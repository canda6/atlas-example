package logic

import (
	"context"

	gatepb "github.com/canda6/atlas/pkg/proto/gate"
	"google.golang.org/protobuf/types/known/emptypb"
)

func (m *Manager) OnDisconnect(ctx context.Context, req *gatepb.OnDisconnectRequest) (*emptypb.Empty, error) {
	u := UserFromContext(ctx)
	return u.OnDisconnect(ctx, req)
}
