package logic

import (
	"context"

	pb "github.com/canda6/atlas-example/gen/proto/go/logic"
	roompb "github.com/canda6/atlas-example/gen/proto/go/room"
	"google.golang.org/protobuf/types/known/emptypb"
)

func (m *Manager) Login(ctx context.Context, req *pb.LoginRequest) (*pb.LoginResponse, error) {
	u := UserFromContext(ctx)
	return u.Login(ctx, req)
}

func (m *Manager) CreateRoom(ctx context.Context, _ *emptypb.Empty) (*roompb.RoomSnapshot, error) {
	return UserFromContext(ctx).RoomCreate(ctx)
}
func (m *Manager) JoinRoom(ctx context.Context, in *roompb.RoomRequest) (*roompb.RoomSnapshot, error) {
	return UserFromContext(ctx).RoomJoin(ctx, in.RoomId)
}
func (m *Manager) LeaveRoom(ctx context.Context, _ *emptypb.Empty) (*emptypb.Empty, error) {
	err := UserFromContext(ctx).RoomLeave(ctx)
	return &emptypb.Empty{}, err
}

func (m *Manager) GetBags(ctx context.Context, req *pb.GetBagsRequest) (*pb.GetBagsResponse, error) {
	u := UserFromContext(ctx)
	return u.BagGetBags(ctx, req)
}
