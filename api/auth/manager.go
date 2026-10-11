package auth

import (
	pb "github.com/canda6/atlas-example/gen/proto/go/auth"
	iauth "github.com/canda6/atlas-example/internal/auth"
	"google.golang.org/grpc"
)

type Manager struct {
	pb.UnimplementedAuthClientServiceServer
	svc *iauth.Service
}

func NewManager() *Manager {
	return &Manager{svc: iauth.NewService()}
}

func (m *Manager) Register(r grpc.ServiceRegistrar) {
	pb.RegisterAuthClientServiceServer(r, m)
}
