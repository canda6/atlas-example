package auth

import (
	"context"
	"errors"
	"net"
	"reflect"
	"testing"
	"time"

	"github.com/alicebob/miniredis/v2"
	pb "github.com/canda6/atlas-example/gen/proto/go/auth"
	"github.com/canda6/atlas-example/internal/auth/dao"
	"github.com/canda6/atlas-example/util/deps"
	"github.com/canda6/atlas/app"
	"github.com/canda6/atlas/gate"
	"github.com/canda6/atlas/gate/connection"
	"github.com/canda6/atlas/gate/protocol"
	gatesdk "github.com/canda6/atlas/pkg/gate"
	atlasgrpc "github.com/canda6/atlas/pkg/grpc"
	gatepb "github.com/canda6/atlas/pkg/proto/gate"
	grpcprovider "github.com/canda6/atlas/provider/grpc"
	"github.com/canda6/atlas/registry"
	"github.com/redis/go-redis/v9"
	"google.golang.org/grpc"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

func TestAuthenticateUsesStoredRoleIDForToken(t *testing.T) {
	env := newAuthTestEnv(t)
	sess := env.newSession(t)
	const storedRoleID = "previously-assigned-role"
	if err := env.store.Set("account:guest:alice", storedRoleID); err != nil {
		t.Fatal(err)
	}
	resp, err := NewService().Authenticate(sess.ctx, &pb.AuthenticateRequest{AccountId: "alice"})
	if err != nil {
		t.Fatal(err)
	}
	if !resp.Success || resp.RoleId != storedRoleID || resp.GameToken == "" {
		t.Fatalf("unexpected auth result: %v", resp)
	}
	tokenRoleID, err := dao.GetRoleIDByToken(sess.ctx, resp.GameToken)
	if err != nil || tokenRoleID != storedRoleID {
		t.Fatalf("token role = (%q, %v), want (%q, nil)", tokenRoleID, err, storedRoleID)
	}
}

func TestAuthenticateRepeatedAccountDoesNotBindAuthRoute(t *testing.T) {
	env := newAuthTestEnv(t)
	sess := env.newSession(t)
	for _, channel := range []string{"", "guest", ""} {
		resp, err := NewService().Authenticate(sess.ctx, &pb.AuthenticateRequest{AccountId: "alice", Channel: channel})
		if err != nil || resp == nil || !resp.Success || resp.RoleId != "guest_alice" {
			t.Fatalf("repeated auth = (%v, %v)", resp, err)
		}
		if probe := env.probe(t, sess); probe.shardKey != "" {
			t.Fatalf("account metadata changed auth routing: %q", probe.shardKey)
		}
	}
}

func TestAuthenticateRejectsAccountSwitchBeforeStorage(t *testing.T) {
	for _, tc := range []struct {
		name          string
		first, second *pb.AuthenticateRequest
	}{
		{"account", &pb.AuthenticateRequest{AccountId: "alice"}, &pb.AuthenticateRequest{AccountId: "bob"}},
		{"channel", &pb.AuthenticateRequest{AccountId: "alice"}, &pb.AuthenticateRequest{Channel: "sdk", AccountId: "alice"}},
		{"role ID collision", &pb.AuthenticateRequest{Channel: "a_b", AccountId: "c"}, &pb.AuthenticateRequest{Channel: "a", AccountId: "b_c"}},
		{"separator collision", &pb.AuthenticateRequest{Channel: "a:b", AccountId: "c"}, &pb.AuthenticateRequest{Channel: "a", AccountId: "b:c"}},
	} {
		t.Run(tc.name, func(t *testing.T) {
			env := newAuthTestEnv(t)
			sess := env.newSession(t)
			resp, err := NewService().Authenticate(sess.ctx, tc.first)
			if err != nil || resp == nil || !resp.Success {
				t.Fatalf("first auth = (%v, %v)", resp, err)
			}
			before := env.store.Keys()
			resp, err = NewService().Authenticate(sess.ctx, tc.second)
			if status.Code(err) != codes.FailedPrecondition || resp != nil {
				t.Fatalf("account switch = (%v, %v), want Gate conflict", resp, err)
			}
			if after := env.store.Keys(); !reflect.DeepEqual(before, after) {
				t.Fatalf("rejected account created mappings or tokens: before=%v after=%v", before, after)
			}
		})
	}
}

func TestAuthenticateConcurrentAccountSwitch(t *testing.T) {
	env := newAuthTestEnv(t)
	sess := env.newSession(t)
	type result struct {
		account string
		resp    *pb.AuthenticateResponse
		err     error
	}
	const workers = 32
	start := make(chan struct{})
	results := make(chan result, workers)
	for i := range workers {
		account := []string{"alice", "bob"}[i%2]
		go func() {
			<-start
			// Independent Service instances must coordinate through the owning Gate.
			resp, err := NewService().Authenticate(sess.ctx, &pb.AuthenticateRequest{AccountId: account})
			results <- result{account, resp, err}
		}()
	}
	close(start)
	var winner string
	succeeded, rejected := 0, 0
	for range workers {
		got := <-results
		if got.err != nil {
			if status.Code(got.err) != codes.FailedPrecondition || got.resp != nil {
				t.Errorf("unexpected auth failure: (%v, %v)", got.resp, got.err)
			}
			rejected++
			continue
		}
		if winner == "" {
			winner = got.account
		}
		if got.account != winner || got.resp == nil || !got.resp.Success || got.resp.RoleId != "guest_"+winner {
			t.Errorf("concurrent auth admitted different accounts: winner=%q result=%+v", winner, got)
		}
		succeeded++
	}
	if succeeded != workers/2 || rejected != workers/2 || len(env.store.Keys()) != succeeded+1 {
		t.Fatalf("success=%d rejected=%d stored keys=%v", succeeded, rejected, env.store.Keys())
	}
	loser := "alice"
	if winner == loser {
		loser = "bob"
	}
	if env.store.Exists("account:guest:" + loser) {
		t.Fatal("losing account was persisted")
	}
}

func TestAuthenticateNewConnectionCanUseAnotherAccount(t *testing.T) {
	env := newAuthTestEnv(t)
	for _, account := range []string{"alice", "bob"} {
		sess := env.newSession(t)
		resp, err := NewService().Authenticate(sess.ctx, &pb.AuthenticateRequest{AccountId: account})
		if err != nil || resp == nil || !resp.Success || resp.RoleId != "guest_"+account {
			t.Fatalf("new connection auth = (%v, %v)", resp, err)
		}
		_ = sess.conn.Close()
	}
}

func TestAuthenticateInvalidSessionDoesNotWriteStorage(t *testing.T) {
	env := newAuthTestEnv(t)
	for _, ctx := range []context.Context{
		env.ctx,
		atlasgrpc.WithSessionRef(env.ctx, gatesdk.SessionRef{GateID: "auth-test-gate", SessionID: "missing-session"}),
	} {
		resp, err := NewService().Authenticate(ctx, &pb.AuthenticateRequest{AccountId: "alice"})
		if err == nil || resp != nil || len(env.store.Keys()) != 0 {
			t.Fatalf("invalid session auth = (%v, %v), keys=%v", resp, err, env.store.Keys())
		}
	}
}

func TestAuthenticateStorageFailureKeepsAccountBinding(t *testing.T) {
	env := newAuthTestEnv(t)
	sess := env.newSession(t)
	env.store.SetError("ERR storage unavailable")
	resp, err := NewService().Authenticate(sess.ctx, &pb.AuthenticateRequest{AccountId: "alice"})
	if err != nil || resp == nil || resp.Success {
		t.Fatalf("storage failure auth = (%v, %v)", resp, err)
	}
	env.store.SetError("")
	if _, err := NewService().Authenticate(sess.ctx, &pb.AuthenticateRequest{AccountId: "bob"}); status.Code(err) != codes.FailedPrecondition {
		t.Fatalf("storage failure released account binding: %v", err)
	}
	resp, err = NewService().Authenticate(sess.ctx, &pb.AuthenticateRequest{AccountId: "alice"})
	if err != nil || resp == nil || !resp.Success {
		t.Fatalf("same-account retry = (%v, %v)", resp, err)
	}
}

// These tests use the actual Gate control handler, including its atomic
// Immutable behavior, instead of implementing another binding map in a mock.
type authTestEnv struct {
	ctx    context.Context
	store  *miniredis.Miniredis
	gate   *gate.Server
	probes chan sessionProbe
}

type sessionProbe struct {
	ref      gatesdk.SessionRef
	shardKey string
}

type probeAuthServer struct {
	pb.UnimplementedAuthClientServiceServer
	probes chan sessionProbe
}

func (s *probeAuthServer) Authenticate(ctx context.Context, _ *pb.AuthenticateRequest) (*pb.AuthenticateResponse, error) {
	ref, err := gatesdk.SessionRefFromContext(ctx)
	if err != nil {
		return nil, err
	}
	key, _ := atlasgrpc.ShardKeyFromContext(ctx)
	s.probes <- sessionProbe{ref: ref, shardKey: key}
	return &pb.AuthenticateResponse{Success: true}, nil
}

func newAuthTestEnv(t *testing.T) *authTestEnv {
	t.Helper()
	store := miniredis.RunT(t)
	redisClient := redis.NewClient(&redis.Options{Addr: store.Addr(), MaxRetries: -1})
	t.Cleanup(func() { _ = redisClient.Close() })
	ctx, cancel := context.WithTimeout(t.Context(), 10*time.Second)
	t.Cleanup(cancel)
	env := &authTestEnv{ctx: deps.WithRedis(ctx, redisClient), store: store, probes: make(chan sessionProbe, 1)}

	discovery := make(testDiscovery)
	conns, err := atlasgrpc.NewClientManager(atlasgrpc.ClientConfig{Discovery: discovery, Transport: grpcprovider.DefaultClientOptions()})
	if err != nil {
		t.Fatal(err)
	}
	t.Cleanup(func() { _ = conns.Close() })
	previous, _ := atlasgrpc.DefaultClientManager()
	atlasgrpc.SetDefaultClientManager(conns)
	t.Cleanup(func() { atlasgrpc.SetDefaultClientManager(previous) })

	env.gate, err = gate.NewServer(gate.Options{
		Timeouts: gate.Timeouts{Idle: time.Minute, Request: 5 * time.Second, DisconnectCall: 50 * time.Millisecond},
		Capacity: gate.Capacity{MaxConnections: 16, MaxInFlightPerConnection: 64},
	}, "auth-test-gate", conns, connection.NewTCPAcceptor("127.0.0.1:0"))
	if err != nil {
		t.Fatal(err)
	}
	rpc := grpc.NewServer(grpc.UnaryInterceptor(atlasgrpc.ServerUnaryMetadataInterceptor(app.Context())))
	env.gate.Register(rpc)
	pb.RegisterAuthClientServiceServer(rpc, &probeAuthServer{probes: env.probes})
	listener, err := net.Listen("tcp", "127.0.0.1:0")
	if err != nil {
		t.Fatal(err)
	}
	t.Cleanup(func() { rpc.Stop(); _ = listener.Close() })
	for _, service := range []string{gatepb.GateServerService_ServiceDesc.ServiceName, pb.AuthClientService_ServiceDesc.ServiceName} {
		if err := discovery.Register(ctx, &registry.ServiceInstance{Name: service, Endpoints: []string{"grpc://" + listener.Addr().String()}, ID: "auth-test-gate"}); err != nil {
			t.Fatal(err)
		}
	}
	go func() { _ = rpc.Serve(listener) }()
	if err := env.gate.Listen(ctx); err != nil {
		t.Fatal(err)
	}
	runCtx, stopGate := context.WithCancel(context.Background())
	done := make(chan error, 1)
	go func() { done <- env.gate.Run(runCtx) }()
	t.Cleanup(func() {
		stopGate()
		select {
		case err := <-done:
			if err != nil && !errors.Is(err, context.Canceled) {
				t.Errorf("Gate shutdown: %v", err)
			}
		case <-time.After(3 * time.Second):
			t.Error("Gate did not stop")
		}
	})
	return env
}

type authTestSession struct {
	ctx    context.Context
	conn   connection.Conn
	nextID uint64
}

func (e *authTestEnv) newSession(t *testing.T) *authTestSession {
	t.Helper()
	raw, err := net.DialTimeout("tcp", e.gate.Addr().String(), time.Second)
	if err != nil {
		t.Fatal(err)
	}
	t.Cleanup(func() { _ = raw.Close() })
	if err := raw.SetDeadline(time.Now().Add(10 * time.Second)); err != nil {
		t.Fatal(err)
	}
	sess := &authTestSession{conn: connection.NewConn(raw)}
	probe := e.probe(t, sess)
	sess.ctx = atlasgrpc.WithSessionRef(e.ctx, probe.ref)
	return sess
}

func (e *authTestEnv) probe(t *testing.T, sess *authTestSession) sessionProbe {
	t.Helper()
	sess.nextID++
	if err := sess.conn.WriteMessages(&protocol.Message{
		Kind: protocol.KindRequest, RequestID: sess.nextID, Method: pb.AuthClientService_Authenticate_FullMethodName,
	}); err != nil {
		t.Fatal(err)
	}
	resp, err := sess.conn.ReadMessage()
	if err != nil {
		t.Fatal(err)
	}
	if resp.Code != 0 || resp.RequestID != sess.nextID {
		t.Fatalf("session probe failed: %+v", resp)
	}
	select {
	case probe := <-e.probes:
		return probe
	case <-e.ctx.Done():
		t.Fatal(e.ctx.Err())
		return sessionProbe{}
	}
}

func (d testDiscovery) Register(_ context.Context, instance *registry.ServiceInstance) error {
	d[instance.Name] = append(d[instance.Name], registry.CloneInstances([]*registry.ServiceInstance{instance})[0])
	return nil
}

// testDiscovery holds addresses assembled before the test starts making RPCs.
type testDiscovery map[string][]*registry.ServiceInstance

func (d testDiscovery) GetService(_ context.Context, name string) ([]*registry.ServiceInstance, error) {
	return registry.CloneInstances(d[name]), nil
}
func (d testDiscovery) Watch(ctx context.Context, name string) (registry.Watcher, error) {
	ctx, cancel := context.WithCancel(ctx)
	return &testWatcher{instances: registry.CloneInstances(d[name]), ctx: ctx, cancel: cancel}, nil
}

type testWatcher struct {
	instances []*registry.ServiceInstance
	ctx       context.Context
	cancel    context.CancelFunc
	sent      bool
}

func (w *testWatcher) Next() ([]*registry.ServiceInstance, error) {
	if err := w.ctx.Err(); err != nil {
		return nil, err
	}
	if !w.sent {
		w.sent = true
		return w.instances, nil
	}
	<-w.ctx.Done()
	return nil, w.ctx.Err()
}
func (w *testWatcher) Stop() error { w.cancel(); return nil }
