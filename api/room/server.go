package room

import (
	"context"

	pb "github.com/canda6/atlas-example/gen/proto/go/room"
	"google.golang.org/protobuf/types/known/emptypb"
)

func (m *Manager) CreateRoom(ctx context.Context, _ *pb.MembershipRequest) (*pb.RoomSnapshot, error) {
	return publish(ctx), nil
}
func (m *Manager) JoinRoom(ctx context.Context, in *pb.MembershipRequest) (*pb.RoomSnapshot, error) {
	if err := current(ctx).Join(in.UserId, in.Name, session(in)); err != nil {
		return nil, err
	}
	return publish(ctx), nil
}
func (m *Manager) LeaveRoom(ctx context.Context, in *pb.MembershipRequest) (*emptypb.Empty, error) {
	if err := current(ctx).Leave(in.UserId, session(in)); err != nil {
		return nil, err
	}
	publish(ctx)
	return &emptypb.Empty{}, nil
}
