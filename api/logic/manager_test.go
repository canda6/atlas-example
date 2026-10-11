package logic

import (
	"context"
	"errors"
	"os"
	"testing"
	"time"

	pb "github.com/canda6/atlas-example/gen/proto/go/logic"
	ilogic "github.com/canda6/atlas-example/internal/logic"
	"github.com/canda6/atlas/app"
	"github.com/canda6/atlas/pkg/gate"
	atlasgrpc "github.com/canda6/atlas/pkg/grpc"
	gatepb "github.com/canda6/atlas/pkg/proto/gate"
	"github.com/canda6/atlas/pkg/xerror"
	"google.golang.org/grpc"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
	"google.golang.org/protobuf/types/known/emptypb"
)

func TestMain(m *testing.M) {
	app.ParseFlags().Config = ""
	app := app.New(&app.Providers{})
	code := m.Run()
	app.Stop()
	os.Exit(code)
}

func TestUnboundRequestIsRejectedBeforeActorAccess(t *testing.T) {
	// Gate forwards requests without a service binding as keyless calls. Logic
	// must reject them before touching the actor manager or invoking business code.
	manager := &Manager{}
	called := false
	_, err := manager.UnaryInterceptor(context.Background(), nil, &grpc.UnaryServerInfo{FullMethod: pb.LogicClientService_Login_FullMethodName}, func(context.Context, any) (any, error) {
		called = true
		return nil, nil
	})
	if !errors.Is(err, xerror.ErrUnauthorized) || called {
		t.Fatalf("unbound request: error=%v handler called=%v", err, called)
	}
}

func newTestManager(t *testing.T) *Manager {
	t.Helper()
	manager := NewManager()
	t.Cleanup(func() {
		if err := manager.actors.Delete(context.Background(), "u1"); err != nil {
			t.Errorf("delete actor: %v", err)
		}
	})
	return manager
}

// 当前 ServerService 只有断线回调，用内部业务方法名验证后续 Server RPC 的创建边界。
const internalTestMethod = "/logic.server.v1.LogicServerService/AwardItem"

func TestMissingActorCreationPolicy(t *testing.T) {
	ctx := atlasgrpc.WithShardKey(context.Background(), "u1")
	ref := gate.SessionRef{GateID: "g1", SessionID: "s1"}
	connectedCtx := atlasgrpc.WithSessionRef(ctx, ref)
	for _, tc := range []struct {
		name        string
		method      string
		ctx         context.Context
		wantCreated bool
		wantSession gate.SessionRef
		wantErr     error
	}{
		{name: "login", method: pb.LogicClientService_Login_FullMethodName, ctx: connectedCtx, wantCreated: true, wantSession: ref},
		{name: "internal without session", method: internalTestMethod, ctx: ctx, wantCreated: true},
		{name: "internal with source session", method: internalTestMethod, ctx: connectedCtx, wantCreated: true},
		{name: "client with session", method: pb.LogicClientService_GetBags_FullMethodName, ctx: connectedCtx, wantErr: xerror.ErrActorNotFound},
		{name: "client without session", method: pb.LogicClientService_GetBags_FullMethodName, ctx: ctx, wantErr: xerror.ErrActorNotFound},
		{name: "unknown service", method: "/other.server.v1.OtherServerService/Update", ctx: connectedCtx, wantErr: xerror.ErrActorNotFound},
		{name: "similar service name", method: "/logic.server.v1.LogicServerServiceExtra/Update", ctx: connectedCtx, wantErr: xerror.ErrActorNotFound},
		{name: "disconnect", method: pb.LogicServerService_OnDisconnect_FullMethodName, ctx: ctx},
		{name: "login without session", method: pb.LogicClientService_Login_FullMethodName, ctx: ctx, wantCreated: true, wantErr: xerror.ErrUnauthorized},
		{name: "login with empty session", method: pb.LogicClientService_Login_FullMethodName, ctx: atlasgrpc.WithSessionRef(ctx, gate.SessionRef{}), wantCreated: true, wantErr: xerror.ErrUnauthorized},
		{name: "login without gate", method: pb.LogicClientService_Login_FullMethodName, ctx: atlasgrpc.WithSessionRef(ctx, gate.SessionRef{SessionID: "s1"}), wantCreated: true, wantErr: xerror.ErrUnauthorized},
		{name: "login without connection", method: pb.LogicClientService_Login_FullMethodName, ctx: atlasgrpc.WithSessionRef(ctx, gate.SessionRef{GateID: "g1"}), wantCreated: true, wantErr: xerror.ErrUnauthorized},
	} {
		t.Run(tc.name, func(t *testing.T) {
			manager := newTestManager(t)
			var user *ilogic.User
			resp, err := manager.UnaryInterceptor(tc.ctx, nil, &grpc.UnaryServerInfo{FullMethod: tc.method}, func(ctx context.Context, _ any) (any, error) {
				user = UserFromContext(ctx)
				if user == nil || user.ID != "u1" || user.Session != (gate.SessionRef{}) {
					t.Fatalf("new actor before business invocation = %+v", user)
				}
				if tc.method == pb.LogicClientService_Login_FullMethodName {
					return manager.Login(ctx, &pb.LoginRequest{})
				}
				return &emptypb.Empty{}, nil
			})
			if !errors.Is(err, tc.wantErr) {
				t.Fatalf("error = %v, want %v", err, tc.wantErr)
			}
			if tc.wantCreated {
				if user == nil || user.Session != tc.wantSession || manager.actors.Count() != 1 {
					t.Fatalf("user=%+v actor count=%d", user, manager.actors.Count())
				}
			} else if user != nil || manager.actors.Count() != 0 {
				t.Fatalf("handler invoked or actor created: user=%+v count=%d", user, manager.actors.Count())
			}
			if tc.method == pb.LogicServerService_OnDisconnect_FullMethodName {
				if _, ok := resp.(*emptypb.Empty); !ok {
					t.Fatalf("disconnect response = %v", resp)
				}
			}
		})
	}
}

func TestOfflineActorLoginAndSessionChanges(t *testing.T) {
	manager := newTestManager(t)
	ctx := atlasgrpc.WithShardKey(context.Background(), "u1")
	oldRef := gate.SessionRef{GateID: "g1", SessionID: "old"}
	newRef := gate.SessionRef{GateID: "g1", SessionID: "new"}
	var user *ilogic.User
	_, err := manager.UnaryInterceptor(ctx, nil, &grpc.UnaryServerInfo{FullMethod: internalTestMethod}, func(ctx context.Context, _ any) (any, error) {
		user = UserFromContext(ctx)
		return &emptypb.Empty{}, user.BagAddItem(ctx, 10, 3)
	})
	if err != nil {
		t.Fatal(err)
	}

	getBags := func(t *testing.T, ctx context.Context, wantErr error) {
		t.Helper()
		called := false
		req := &pb.GetBagsRequest{}
		resp, err := manager.UnaryInterceptor(ctx, req, &grpc.UnaryServerInfo{FullMethod: pb.LogicClientService_GetBags_FullMethodName}, func(ctx context.Context, _ any) (any, error) {
			called = true
			if UserFromContext(ctx) != user {
				t.Fatal("client request replaced the existing actor")
			}
			return manager.GetBags(ctx, req)
		})
		if !errors.Is(err, wantErr) || called != (wantErr == nil) {
			t.Fatalf("get bags: error=%v handler called=%v, want %v", err, called, wantErr)
		}
		if wantErr == nil {
			items := resp.(*pb.GetBagsResponse).Items
			if len(items) != 1 || items[0].ItemId != 10 || items[0].Count != 3 {
				t.Fatalf("actor data not preserved: %v", items)
			}
		}
	}
	login := func(ref gate.SessionRef) {
		t.Helper()
		req := &pb.LoginRequest{}
		resp, err := manager.UnaryInterceptor(atlasgrpc.WithSessionRef(ctx, ref), req, &grpc.UnaryServerInfo{FullMethod: pb.LogicClientService_Login_FullMethodName}, func(ctx context.Context, _ any) (any, error) {
			if UserFromContext(ctx) != user {
				t.Fatal("login replaced the existing actor")
			}
			return manager.Login(ctx, req)
		})
		if err != nil {
			t.Fatalf("login: %v", err)
		}
		if !resp.(*pb.LoginResponse).Success || user.Session != ref || manager.actors.Count() != 1 {
			t.Fatalf("login response=%v session=%+v count=%d", resp, user.Session, manager.actors.Count())
		}
	}
	disconnect := func(ref gate.SessionRef) {
		t.Helper()
		req := &gatepb.OnDisconnectRequest{Session: &gatepb.SessionRef{GateId: ref.GateID, SessionId: ref.SessionID}}
		if _, err := manager.UnaryInterceptor(ctx, req, &grpc.UnaryServerInfo{FullMethod: pb.LogicServerService_OnDisconnect_FullMethodName}, func(ctx context.Context, _ any) (any, error) {
			return manager.OnDisconnect(ctx, req)
		}); err != nil {
			t.Fatalf("disconnect: %v", err)
		}
	}

	getBags(t, ctx, xerror.ErrUnauthorized)
	getBags(t, atlasgrpc.WithSessionRef(ctx, oldRef), xerror.ErrUnauthorized)
	login(oldRef)
	getBags(t, atlasgrpc.WithSessionRef(ctx, oldRef), nil)
	login(newRef)
	// 旧连接的在途 login 也不能抢回角色，普通业务仍由 Session 校验拦截。
	_, err = manager.UnaryInterceptor(atlasgrpc.WithSessionRef(ctx, oldRef), nil, &grpc.UnaryServerInfo{FullMethod: pb.LogicClientService_Login_FullMethodName}, func(ctx context.Context, _ any) (any, error) {
		return manager.Login(ctx, &pb.LoginRequest{})
	})
	if !errors.Is(err, xerror.ErrUnauthorized) || user.Session != newRef {
		t.Fatalf("replaced connection login: error=%v session=%+v", err, user.Session)
	}
	for _, ref := range []gate.SessionRef{
		{},
		{GateID: "g1"},
		{SessionID: "new"},
		oldRef,
		{GateID: "g2", SessionID: "new"},
	} {
		t.Run("reject "+ref.GateID+"/"+ref.SessionID, func(t *testing.T) {
			getBags(t, atlasgrpc.WithSessionRef(ctx, ref), xerror.ErrUnauthorized)
		})
	}
	getBags(t, ctx, xerror.ErrUnauthorized)
	getBags(t, atlasgrpc.WithSessionRef(ctx, newRef), nil)

	// 内部调用可以携带其他来源连接，但不能替换用户当前的登录连接。
	_, err = manager.UnaryInterceptor(atlasgrpc.WithSessionRef(ctx, oldRef), nil, &grpc.UnaryServerInfo{FullMethod: internalTestMethod}, func(ctx context.Context, _ any) (any, error) {
		if UserFromContext(ctx) != user || user.Session != newRef {
			t.Fatal("internal message changed the logged-in actor or session")
		}
		return &emptypb.Empty{}, nil
	})
	if err != nil {
		t.Fatalf("internal message on online actor: %v", err)
	}
	disconnect(oldRef)
	getBags(t, atlasgrpc.WithSessionRef(ctx, newRef), nil)
	disconnect(newRef)
	getBags(t, atlasgrpc.WithSessionRef(ctx, newRef), xerror.ErrUnauthorized)
	login(newRef)
	getBags(t, atlasgrpc.WithSessionRef(ctx, newRef), nil)
}

func TestBusinessErrorsArePreservedWithoutRetry(t *testing.T) {
	for _, tc := range []struct {
		name     string
		err      error
		wantCode codes.Code
	}{
		{"actor not found", xerror.ErrActorNotFound, codes.NotFound},
		{"unauthorized", xerror.ErrUnauthorized, codes.Unauthenticated},
		{"grpc status", status.Error(codes.ResourceExhausted, "full"), codes.ResourceExhausted},
		{"plain error", errors.New("failure"), codes.Internal},
	} {
		t.Run(tc.name, func(t *testing.T) {
			manager := newTestManager(t)
			ctx := atlasgrpc.WithShardKey(context.Background(), "u1")
			// 第一轮会创建 Actor；第二轮复用已有 Actor，两条路径应保留同样的错误。
			for range 2 {
				calls := 0
				_, err := manager.UnaryInterceptor(ctx, nil, &grpc.UnaryServerInfo{FullMethod: internalTestMethod}, func(context.Context, any) (any, error) {
					calls++
					return nil, tc.err
				})
				if calls != 1 || manager.actors.Count() != 1 {
					t.Fatalf("business calls=%d actor count=%d", calls, manager.actors.Count())
				}
				if !errors.Is(err, tc.err) {
					t.Fatalf("error = %v, want original error %v", err, tc.err)
				}
				if status.Code(xerror.ToStatusError(err)) != tc.wantCode {
					t.Fatalf("error = %v, want code %v", err, tc.wantCode)
				}
			}
		})
	}
}

func TestActorCreationCancellationReturnsContextErr(t *testing.T) {
	manager := newTestManager(t)
	ctx, cancel := context.WithCancelCause(atlasgrpc.WithShardKey(context.Background(), "u1"))
	cancel(errors.New("request stopped"))
	called := false
	_, err := manager.UnaryInterceptor(ctx, nil, &grpc.UnaryServerInfo{FullMethod: internalTestMethod}, func(context.Context, any) (any, error) {
		called = true
		return nil, nil
	})
	if !errors.Is(err, context.Canceled) || called || manager.actors.Count() != 0 {
		t.Fatalf("creation: error=%v handler called=%v actor count=%d", err, called, manager.actors.Count())
	}
}

func TestConcurrentInternalMessagesShareActor(t *testing.T) {
	manager := newTestManager(t)
	ctx, cancel := context.WithTimeout(atlasgrpc.WithShardKey(context.Background(), "u1"), 5*time.Second)
	defer cancel()
	const messages = 16
	type result struct {
		value any
		err   error
	}
	results := make(chan result, messages)
	start := make(chan struct{})
	for range messages {
		go func() {
			<-start
			value, err := manager.UnaryInterceptor(ctx, nil, &grpc.UnaryServerInfo{FullMethod: internalTestMethod}, func(ctx context.Context, _ any) (any, error) {
				user := UserFromContext(ctx)
				return user, user.BagAddItem(ctx, 10, 1)
			})
			results <- result{value, err}
		}()
	}
	close(start)
	var user *ilogic.User
	for range messages {
		got := <-results
		if got.err != nil {
			t.Errorf("internal message: %v", got.err)
			continue
		}
		current := got.value.(*ilogic.User)
		if user != nil && user != current {
			t.Error("concurrent messages created different actors")
		}
		user = current
	}
	if user == nil || user.BagItemCount(10) != messages || manager.actors.Count() != 1 {
		t.Fatalf("concurrent messages lost updates: user=%+v actor count=%d", user, manager.actors.Count())
	}
}
