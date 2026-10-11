package auth

import (
	"context"

	pb "github.com/canda6/atlas-example/gen/proto/go/auth"
)

func (m *Manager) Authenticate(ctx context.Context, req *pb.AuthenticateRequest) (*pb.AuthenticateResponse, error) {
	return m.svc.Authenticate(ctx, req)
}
