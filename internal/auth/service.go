package auth

import (
	"context"
	"crypto/sha256"
	"fmt"

	pb "github.com/canda6/atlas-example/gen/proto/go/auth"
	logicpb "github.com/canda6/atlas-example/gen/proto/go/logic"
	"github.com/canda6/atlas-example/internal/auth/dao"
	"github.com/canda6/atlas-example/util/deps"
	"github.com/canda6/atlas/pkg/gate"
	"github.com/canda6/atlas/pkg/xlog"
)

// The attr: prefix cannot match a protobuf service name, so it never affects routing.
const accountIdentityAttribute = "attr:auth.identity"

type Service struct{}

func NewService() *Service {
	return &Service{}
}

func (s *Service) Authenticate(ctx context.Context, req *pb.AuthenticateRequest) (*pb.AuthenticateResponse, error) {
	resp, err := s.authenticate(ctx, req)
	if err != nil || resp == nil || !resp.Success {
		return resp, err
	}
	ref, err := gate.SessionRefFromContext(ctx)
	if err != nil {
		return nil, err
	}
	if err := gate.Set(ctx, ref, logicpb.LogicClientService_ServiceDesc.ServiceName, resp.RoleId, gate.Immutable()); err != nil {
		return nil, err
	}
	return resp, nil
}

func (s *Service) authenticate(ctx context.Context, req *pb.AuthenticateRequest) (*pb.AuthenticateResponse, error) {
	logger := deps.Logger(ctx)

	channel := req.Channel
	if channel == "" {
		channel = "guest"
	}
	accountID := req.AccountId
	if accountID == "" {
		return &pb.AuthenticateResponse{Success: false, Message: "account_id required"}, nil
	}

	logger.Debug("authenticate", xlog.KV("channel", channel), xlog.KV("account_id", accountID))
	// TODO: validate SDK credentials before binding an account to this connection.
	_ = req.SdkToken

	ref, err := gate.SessionRefFromContext(ctx)
	if err != nil {
		return nil, err
	}
	if err := gate.Set(ctx, ref, accountIdentityAttribute, accountIdentity(channel, accountID), gate.Immutable()); err != nil {
		return nil, err
	}

	roleID, err := dao.GetOrCreateRoleID(ctx, channel, accountID, fmt.Sprintf("%s_%s", channel, accountID))
	if err != nil {
		logger.Error("authenticate get or create account failed",
			xlog.KV("channel", channel),
			xlog.KV("account_id", accountID),
			xlog.KV("error", err),
		)
		return &pb.AuthenticateResponse{Success: false, Message: "get or create account failed"}, nil
	}

	token, err := createToken(ctx, roleID)
	if err != nil {
		logger.Error("authenticate create token failed",
			xlog.KV("role_id", roleID),
			xlog.KV("error", err),
		)
		return &pb.AuthenticateResponse{Success: false, Message: "create token failed"}, nil
	}

	return &pb.AuthenticateResponse{
		Success:   true,
		GameToken: token,
		RoleId:    roleID,
	}, nil
}

func accountIdentity(channel, accountID string) string {
	// The length prefix distinguishes tuples even when either part contains separators.
	// A full digest keeps the value within Gate's shard-key length limit.
	identity := fmt.Sprintf("%d:%s%s", len(channel), channel, accountID)
	digest := sha256.Sum256([]byte(identity))
	return fmt.Sprintf("%x", digest)
}
