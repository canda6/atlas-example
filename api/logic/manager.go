package logic

import (
	"context"
	"strings"

	pb "github.com/canda6/atlas-example/gen/proto/go/logic"
	ilogic "github.com/canda6/atlas-example/internal/logic"
	"github.com/canda6/atlas/actor"
	atlasgrpc "github.com/canda6/atlas/pkg/grpc"
	"github.com/canda6/atlas/pkg/xerror"
	"google.golang.org/grpc"
	"google.golang.org/protobuf/types/known/emptypb"
)

type Manager struct {
	pb.UnimplementedLogicClientServiceServer
	pb.UnimplementedLogicServerServiceServer
	actors *actor.Manager[*ilogic.User, string]
}

// NewManager 创建逻辑层 Manager
func NewManager() *Manager {
	actorMgr := actor.NewManager[*ilogic.User, string]()
	return &Manager{actors: actorMgr}
}

// UnaryInterceptor dispatches business RPCs through the owning actor.
func (m *Manager) UnaryInterceptor(ctx context.Context, req any, info *grpc.UnaryServerInfo, next grpc.UnaryHandler) (any, error) {
	method := info.FullMethod
	userID, ok := atlasgrpc.ShardKeyFromContext(ctx)
	if !ok {
		return nil, xerror.ErrUnauthorized
	}

	if !m.actors.Exists(userID) {
		switch {
		case method == pb.LogicServerService_OnDisconnect_FullMethodName:
			return &emptypb.Empty{}, nil
		case method == pb.LogicClientService_Login_FullMethodName,
			strings.HasPrefix(method, "/"+pb.LogicServerService_ServiceDesc.ServiceName+"/"):
			if err := m.actors.Add(ctx, userID, func(ctx context.Context) (*ilogic.User, error) {
				// 数据库加载尚未接入；Session 由 Login 绑定，内部消息可加载离线用户。
				return ilogic.NewUser(ctx, userID, userID, ilogic.ModelData{})
			}); err != nil {
				return nil, err
			}
		default:
			return nil, xerror.ErrActorNotFound
		}
	}

	return m.actors.Exec(ctx, userID, func(ctx context.Context, u *ilogic.User) (any, error) {
		// shard key 表示 Auth 已绑定用户；当前连接是否完成 Logic 登录仍需在 Actor 内确认。
		if method != pb.LogicClientService_Login_FullMethodName &&
			strings.HasPrefix(method, "/"+pb.LogicClientService_ServiceDesc.ServiceName+"/") {
			ref, _ := atlasgrpc.SessionRefFromContext(ctx)
			if !u.Session.SameConnection(ref) {
				return nil, xerror.ErrUnauthorized
			}
		}
		return next(ctx, req)
	})
}

func (m *Manager) Register(r grpc.ServiceRegistrar) {
	pb.RegisterLogicClientServiceServer(r, m)
	pb.RegisterLogicServerServiceServer(r, m)
}

func (m *Manager) Run(ctx context.Context) error {
	return m.actors.Run(ctx)
}

func UserFromContext(ctx context.Context) *ilogic.User {
	p, _ := actor.FromContextAs[*ilogic.User](ctx)
	return p
}
