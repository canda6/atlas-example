package room

import (
	"context"

	pb "github.com/canda6/atlas-example/gen/proto/go/room"
	atlasgrpc "github.com/canda6/atlas/pkg/grpc"
)

func (m *Manager) GetRoom(ctx context.Context, _ *pb.RoomRequest) (*pb.RoomSnapshot, error) {
	return current(ctx).Snapshot(), nil
}
func (m *Manager) Ready(ctx context.Context, _ *pb.RoomRequest) (*pb.RoomSnapshot, error) {
	id, _ := atlasgrpc.ShardKeyFromContext(ctx)
	ref, _ := atlasgrpc.SessionRefFromContext(ctx)
	if err := current(ctx).Ready(id, ref); err != nil {
		return nil, err
	}
	return publish(ctx), nil
}
func (m *Manager) PlaceStone(ctx context.Context, in *pb.PlaceStoneRequest) (*pb.RoomSnapshot, error) {
	id, _ := atlasgrpc.ShardKeyFromContext(ctx)
	ref, _ := atlasgrpc.SessionRefFromContext(ctx)
	if err := current(ctx).Place(id, ref, in.X, in.Y); err != nil {
		return nil, err
	}
	return publish(ctx), nil
}
