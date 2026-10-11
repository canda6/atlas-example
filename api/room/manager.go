package room

import (
	"context"
	"errors"
	"strings"

	pb "github.com/canda6/atlas-example/gen/proto/go/room"
	pushpb "github.com/canda6/atlas-example/gen/proto/go/roompush"
	domain "github.com/canda6/atlas-example/internal/room"
	"github.com/canda6/atlas-example/util/deps"
	"github.com/canda6/atlas/actor"
	"github.com/canda6/atlas/pkg/gate"
	atlasgrpc "github.com/canda6/atlas/pkg/grpc"
	"github.com/canda6/atlas/pkg/xerror"
	"github.com/canda6/atlas/pkg/xlog"
	"google.golang.org/grpc"
)

type Manager struct {
	pb.UnimplementedRoomClientServiceServer
	pb.UnimplementedRoomServerServiceServer
	actors *actor.Manager[*domain.Room, string]
}

func NewManager() *Manager { return &Manager{actors: actor.NewManager[*domain.Room, string]()} }
func (m *Manager) Register(r grpc.ServiceRegistrar) {
	pb.RegisterRoomClientServiceServer(r, m)
	pb.RegisterRoomServerServiceServer(r, m)
}
func (m *Manager) Run(ctx context.Context) error { return m.actors.Run(ctx) }

// UnaryInterceptor dispatches business RPCs through the owning actor.
func (m *Manager) UnaryInterceptor(ctx context.Context, req any, info *grpc.UnaryServerInfo, next grpc.UnaryHandler) (any, error) {
	method := info.FullMethod
	input, ok := req.(interface{ GetRoomId() string })
	if !ok || input.GetRoomId() == "" {
		return nil, domain.ErrRoom
	}
	id := input.GetRoomId()
	if method == pb.RoomServerService_CreateRoom_FullMethodName {
		if m.actors.Exists(id) {
			return nil, domain.ErrExists
		}
		in := req.(*pb.MembershipRequest)
		if err := m.actors.Add(ctx, id, func(context.Context) (*domain.Room, error) {
			r := domain.New(id)
			err := r.Join(in.UserId, in.Name, session(in))
			return r, err
		}); err != nil {
			return nil, err
		}
	}
	empty := false
	result, err := m.actors.Exec(ctx, id, func(ctx context.Context, r *domain.Room) (any, error) {
		if strings.HasPrefix(method, "/"+pb.RoomClientService_ServiceDesc.ServiceName+"/") {
			user, _ := atlasgrpc.ShardKeyFromContext(ctx)
			ref, _ := atlasgrpc.SessionRefFromContext(ctx)
			if _, err := r.Member(user, ref); err != nil {
				return nil, err
			}
		}
		response, err := next(ctx, req)
		empty = r.Empty()
		return response, err
	})
	if empty {
		if deleteErr := m.actors.Delete(ctx, id); deleteErr != nil {
			deps.Logger(ctx).Warn("delete empty room", xlog.KV("error", deleteErr))
		}
	}
	if errors.Is(err, xerror.ErrActorNotFound) {
		return nil, domain.ErrRoom
	}
	return result, err
}
func current(ctx context.Context) *domain.Room {
	r, _ := actor.FromContextAs[*domain.Room](ctx)
	return r
}
func session(req *pb.MembershipRequest) gate.SessionRef {
	return gate.SessionRef{GateID: req.GetSession().GetGateId(), SessionID: req.GetSession().GetSessionId()}
}
func publish(ctx context.Context) *pb.RoomSnapshot {
	r := current(ctx)
	snapshot := r.Snapshot()
	refs := r.Recipients()
	data, method, err := pushpb.MarshalPush(snapshot)
	if err != nil {
		deps.Logger(ctx).Warn("encode room push", xlog.KV("error", err))
		return snapshot
	}
	for _, ref := range refs {
		if _, err := gate.Push(ctx, ref, method, data); err != nil {
			deps.Logger(ctx).Warn("push room snapshot", xlog.KV("error", err))
		}
	}
	return snapshot
}
