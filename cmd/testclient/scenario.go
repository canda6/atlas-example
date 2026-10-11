package main

import (
	"context"
	"fmt"
	"time"

	authpb "github.com/canda6/atlas-example/gen/proto/go/auth"
	logicpb "github.com/canda6/atlas-example/gen/proto/go/logic"
	"github.com/canda6/atlas/gate/protocol"
	"google.golang.org/protobuf/proto"
)

const (
	authenticateMethod = "/auth.client.v1.AuthClientService/Authenticate"
	loginMethod        = "/logic.client.v1.LogicClientService/Login"
	getBagsMethod      = "/logic.client.v1.LogicClientService/GetBags"
)

type rpcCaller interface {
	Call(context.Context, string, proto.Message) (*protocol.Message, error)
}

type gameClient struct {
	rpc     rpcCaller
	timeout time.Duration
}

func newGameClient(rpc rpcCaller, timeout time.Duration) *gameClient {
	return &gameClient{rpc: rpc, timeout: timeout}
}

func (c *gameClient) call(method string, request, response proto.Message) error {
	ctx, cancel := context.WithTimeout(context.Background(), c.timeout)
	defer cancel()

	message, err := c.rpc.Call(ctx, method, request)
	if err != nil {
		return fmt.Errorf("%s: %w", method, err)
	}
	if message == nil {
		return fmt.Errorf("%s: empty response message", method)
	}
	if err := proto.Unmarshal(message.Payload, response); err != nil {
		return fmt.Errorf("%s: decode response: %w", method, err)
	}
	return nil
}

func (c *gameClient) Authenticate(sdkToken, accountID, channel string) (*authpb.AuthenticateResponse, error) {
	if channel == "" {
		channel = "guest"
	}
	response := &authpb.AuthenticateResponse{}
	err := c.call(authenticateMethod, &authpb.AuthenticateRequest{
		SdkToken:  sdkToken,
		AccountId: accountID,
		Channel:   channel,
	}, response)
	if err != nil {
		return nil, err
	}
	if !response.Success {
		return nil, fmt.Errorf("authenticate rejected: %s", response.Message)
	}
	if response.RoleId == "" {
		return nil, fmt.Errorf("authenticate returned an empty role_id")
	}
	return response, nil
}

func (c *gameClient) Login(userID string) (*logicpb.LoginResponse, error) {
	response := &logicpb.LoginResponse{}
	if err := c.call(loginMethod, &logicpb.LoginRequest{UserId: userID}, response); err != nil {
		return nil, err
	}
	if !response.Success {
		return nil, fmt.Errorf("login rejected: %s", response.Message)
	}
	if response.Player == nil {
		return nil, fmt.Errorf("login returned no player")
	}
	return response, nil
}

func (c *gameClient) GetBags(userID string) (*logicpb.GetBagsResponse, error) {
	response := &logicpb.GetBagsResponse{}
	if err := c.call(getBagsMethod, &logicpb.GetBagsRequest{UserId: userID}, response); err != nil {
		return nil, err
	}
	return response, nil
}
