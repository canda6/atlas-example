package logic

import (
	"context"
	"errors"
	"net"
	"os"
	"reflect"
	"sync"
	"sync/atomic"
	"testing"
	"time"

	pb "github.com/canda6/atlas-example/gen/proto/go/logic"
	roompb "github.com/canda6/atlas-example/gen/proto/go/room"
	"github.com/canda6/atlas-example/internal/logic/bag"
	roommodule "github.com/canda6/atlas-example/internal/logic/room"
	"github.com/canda6/atlas/actor"
	"github.com/canda6/atlas/app"
	"github.com/canda6/atlas/pkg/gate"
	atlasgrpc "github.com/canda6/atlas/pkg/grpc"
	gatepb "github.com/canda6/atlas/pkg/proto/gate"
	"github.com/canda6/atlas/pkg/xerror"
	"github.com/canda6/atlas/pkg/xsync"
	grpcprovider "github.com/canda6/atlas/provider/grpc"
	"github.com/canda6/atlas/registry"
	"google.golang.org/grpc"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
	"google.golang.org/protobuf/types/known/emptypb"
)

func TestBagRestoreAndForward(t *testing.T) {
	rows := []bag.Row{{ItemID: 10, Count: 3}}
	u, err := NewUser(context.Background(), "u1", "demo", ModelData{Bag: rows})
	if err != nil {
		t.Fatal(err)
	}
	rows[0].Count = 100 // 加载数据的变更不能绕过模块修改状态。
	if len(u.models.list) != 2 || u.models.list[0] != &u.bag {
		t.Fatal("module list must reference the user's bag instance")
	}
	if err := u.BagAddItem(context.Background(), 10, 2); err != nil {
		t.Fatal(err)
	}
	if got := u.BagItemCount(10); got != 5 {
		t.Fatalf("count = %d, want 5", got)
	}
	if _, err := NewUser(context.Background(), "u2", "bad", ModelData{Bag: []bag.Row{{ItemID: -1}}}); err == nil {
		t.Fatal("invalid loaded data must fail user construction")
	}
}

type loginHook struct {
	id    int
	order *[]int
	err   error
}

func (h *loginHook) OnLogin(context.Context) error {
	*h.order = append(*h.order, h.id)
	return h.err
}

func TestLoginOptionalHooksAndFailure(t *testing.T) {
	u, err := NewUser(context.Background(), "u1", "demo", ModelData{})
	if err != nil {
		t.Fatal(err)
	}
	var order []int
	wantErr := errors.New("login failed")
	second := &loginHook{id: 2, order: &order, err: wantErr}
	u.models.list = append(u.models.list, &loginHook{id: 1, order: &order}, second, &loginHook{id: 3, order: &order})
	prior := gate.SessionRef{GateID: "g", SessionID: "old"}
	next := gate.SessionRef{GateID: "g", SessionID: "new"}
	u.Session = prior
	if _, err := u.Login(atlasgrpc.WithSessionRef(context.Background(), next), &pb.LoginRequest{}); !errors.Is(err, wantErr) {
		t.Fatalf("error = %v", err)
	}
	if !reflect.DeepEqual(order, []int{1, 2}) || u.Session != prior {
		t.Fatalf("order=%v session=%+v", order, u.Session)
	}
	order = nil
	second.err = nil
	if _, err := u.Login(atlasgrpc.WithSessionRef(context.Background(), next), &pb.LoginRequest{}); err != nil {
		t.Fatal(err)
	}
	if !reflect.DeepEqual(order, []int{1, 2, 3}) || u.Session != next {
		t.Fatalf("order=%v session=%+v", order, u.Session)
	}
}

func TestDisconnectOnlyClearsMatchingConnection(t *testing.T) {
	u := &User{Session: gate.SessionRef{GateID: "gate-1", SessionID: "new"}}
	for _, ref := range []gate.SessionRef{
		{GateID: "gate-1", SessionID: "old"},
		{GateID: "gate-2", SessionID: "new"},
	} {
		_, _ = u.OnDisconnect(context.Background(), &gatepb.OnDisconnectRequest{Session: &gatepb.SessionRef{GateId: ref.GateID, SessionId: ref.SessionID}})
		if u.Session != (gate.SessionRef{GateID: "gate-1", SessionID: "new"}) {
			t.Fatal("stale disconnect cleared session")
		}
	}
	_, _ = u.OnDisconnect(context.Background(), &gatepb.OnDisconnectRequest{Session: &gatepb.SessionRef{GateId: u.Session.GateID, SessionId: u.Session.SessionID}})
	if u.Session != (gate.SessionRef{}) {
		t.Fatal("matching disconnect did not clear session")
	}
}

func TestMain(m *testing.M) {
	app.ParseFlags().Config = ""
	app := app.New(&app.Providers{})
	code := m.Run()
	app.Stop()
	os.Exit(code)
}

type loginHookFunc func(context.Context) error

func (f loginHookFunc) OnLogin(ctx context.Context) error { return f(ctx) }

func TestLoginWhileAwaiting(t *testing.T) {
	ctx, cancel := context.WithTimeout(t.Context(), 5*time.Second)
	defer cancel()
	ref := gate.SessionRef{GateID: "g", SessionID: "s"}
	ctx = atlasgrpc.WithSessionRef(ctx, ref)
	u, err := NewUser(ctx, "u1", "demo", ModelData{})
	if err != nil {
		t.Fatal(err)
	}
	manager := actor.NewManager[*User, string]()
	if err := manager.Add(ctx, u.ID, func(context.Context) (*User, error) { return u, nil }); err != nil {
		t.Fatal(err)
	}
	t.Cleanup(func() {
		cleanupCtx, cleanupCancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cleanupCancel()
		if err := manager.Delete(cleanupCtx, u.ID); err != nil {
			t.Errorf("delete actor: %v", err)
		}
	})

	started := make(chan struct{})
	resume := make(chan struct{})
	release := sync.OnceFunc(func() { close(resume) })
	t.Cleanup(release)
	calls := 0
	u.models.list = append(u.models.list, loginHookFunc(func(ctx context.Context) error {
		calls++
		if calls > 1 {
			return errors.New("login hook repeated")
		}
		return xsync.Await(ctx, func(ctx context.Context) {
			close(started)
			select {
			case <-resume:
			case <-ctx.Done():
			}
		})
	}))
	login := func() (*pb.LoginResponse, error) {
		value, err := manager.Exec(ctx, u.ID, func(ctx context.Context, user *User) (any, error) {
			return user.Login(ctx, &pb.LoginRequest{})
		})
		if err != nil {
			return nil, err
		}
		return value.(*pb.LoginResponse), nil
	}
	type result struct {
		resp *pb.LoginResponse
		err  error
	}
	results := make(chan result, 1)
	go func() {
		resp, err := login()
		results <- result{resp, err}
	}()
	select {
	case <-started:
	case <-ctx.Done():
		t.Fatal("login never yielded")
	}

	// 第一条 login 在 Await 中时，不能提前绑定 Session 或重复执行钩子。
	for _, source := range []gate.SessionRef{ref, {GateID: "g2", SessionID: "s2"}} {
		_, err = manager.Exec(atlasgrpc.WithSessionRef(ctx, source), u.ID, func(ctx context.Context, user *User) (any, error) {
			if user.Session != (gate.SessionRef{}) {
				return nil, errors.New("session published before login completed")
			}
			return user.Login(ctx, &pb.LoginRequest{})
		})
		if !errors.Is(err, ErrLoginInProgress) {
			t.Fatalf("overlapping login from %v: error=%v", source, err)
		}
	}
	release()
	select {
	case got := <-results:
		if got.err != nil || !got.resp.GetSuccess() || u.Session != ref {
			t.Fatalf("response=%v error=%v session=%+v", got.resp, got.err, u.Session)
		}
	case <-ctx.Done():
		t.Fatal("login did not finish")
	}

	// 成功后重发 login，直接返回玩家信息。
	resp, err := login()
	if err != nil || !resp.GetSuccess() || resp.GetPlayer().GetId() != u.ID || resp.GetPlayer().GetName() != u.Name || calls != 1 {
		t.Fatalf("retry response=%v error=%v hook calls=%d", resp, err, calls)
	}
}

type disconnectCall struct {
	node string
	req  *gatepb.DisconnectRequest
}

type disconnectRecorder struct {
	gatepb.UnimplementedGateServerServiceServer
	node  string
	calls chan<- disconnectCall
	err   error
}

func (s *disconnectRecorder) Disconnect(_ context.Context, req *gatepb.DisconnectRequest) (*gatepb.Empty, error) {
	s.calls <- disconnectCall{node: s.node, req: req}
	return &gatepb.Empty{}, s.err
}

// 通过真实 Gate SDK 和按 GateID 选点的 gRPC 客户端检查踢线目标。
func recordDisconnects(t *testing.T, kickErr error) <-chan disconnectCall {
	t.Helper()
	discovery := make(testDiscovery)
	conns, err := atlasgrpc.NewClientManager(atlasgrpc.ClientConfig{Discovery: discovery, Transport: grpcprovider.DefaultClientOptions()})
	if err != nil {
		t.Fatal(err)
	}
	t.Cleanup(func() { _ = conns.Close() })
	previous, _ := atlasgrpc.DefaultClientManager()
	atlasgrpc.SetDefaultClientManager(conns)
	t.Cleanup(func() { atlasgrpc.SetDefaultClientManager(previous) })
	calls := make(chan disconnectCall, 16)
	for _, node := range []string{"g1", "g2"} {
		listener, err := net.Listen("tcp", "127.0.0.1:0")
		if err != nil {
			t.Fatal(err)
		}
		server := grpc.NewServer()
		gatepb.RegisterGateServerServiceServer(server, &disconnectRecorder{node: node, calls: calls, err: kickErr})
		t.Cleanup(func() { server.Stop(); _ = listener.Close() })
		if err := discovery.Register(t.Context(), &registry.ServiceInstance{
			Name:      gatepb.GateServerService_ServiceDesc.ServiceName,
			Endpoints: []string{"grpc://" + listener.Addr().String()}, ID: node,
		}); err != nil {
			t.Fatal(err)
		}
		go func() { _ = server.Serve(listener) }()
	}
	return calls
}

func TestLoginTakeover(t *testing.T) {
	for _, tc := range []struct {
		name    string
		next    gate.SessionRef
		kickErr error
	}{
		{name: "same gate", next: gate.SessionRef{GateID: "g1", SessionID: "s2"}},
		// 相同 SessionID、不同 GateID 仍是两个连接。
		{name: "different gate", next: gate.SessionRef{GateID: "g2", SessionID: "s1"}},
		{name: "disconnect RPC fails", next: gate.SessionRef{GateID: "g2", SessionID: "s1"}, kickErr: status.Error(codes.Unavailable, "gate unavailable")},
	} {
		t.Run(tc.name, func(t *testing.T) {
			kicks := recordDisconnects(t, tc.kickErr)
			ctx, cancel := context.WithTimeout(t.Context(), 5*time.Second)
			defer cancel()
			u, err := NewUser(ctx, "u1", "demo", ModelData{})
			if err != nil {
				t.Fatal(err)
			}
			hookCalls := 0
			var hookErr error
			u.models.list = append(u.models.list, loginHookFunc(func(context.Context) error {
				hookCalls++
				return hookErr
			}))
			login := func(ref gate.SessionRef, wantErr error) {
				t.Helper()
				resp, err := u.Login(atlasgrpc.WithSessionRef(ctx, ref), &pb.LoginRequest{})
				if !errors.Is(err, wantErr) || resp.GetSuccess() != (wantErr == nil) {
					t.Fatalf("login %v: response=%v error=%v, want %v", ref, resp, err, wantErr)
				}
				if wantErr == nil && u.Session != ref {
					t.Fatalf("session=%v, want %v", u.Session, ref)
				}
			}
			checkKick := func(ref gate.SessionRef) {
				t.Helper()
				select {
				case call := <-kicks:
					if call.node != ref.GateID || call.req.Session.GateId != ref.GateID || call.req.Session.SessionId != ref.SessionID ||
						call.req.Reason != gatepb.DisconnectReason_DISCONNECT_REASON_LOGGED_IN_ELSEWHERE {
						t.Fatalf("kick=%+v, want %v", call, ref)
					}
				case <-ctx.Done():
					t.Fatal("missing disconnect RPC")
				}
			}
			checkNoKick := func() {
				t.Helper()
				select {
				case call := <-kicks:
					t.Fatalf("unexpected kick: %+v", call)
				default:
				}
			}

			first := gate.SessionRef{GateID: "g1", SessionID: "s1"}
			login(first, nil)
			checkNoKick()

			// 新登录失败，旧连接仍能使用，不应被撤销或踢线。
			hookErr = errors.New("login hook failed")
			login(tc.next, hookErr)
			login(first, nil)
			checkNoKick()

			hookErr = nil
			login(tc.next, nil)
			checkKick(first)
			login(tc.next, nil)
			login(first, xerror.ErrUnauthorized)
			checkNoKick()

			// 再次顶号后，所有已被顶掉的连接都不能通过旧 login 抢回来。
			third := gate.SessionRef{GateID: "g1", SessionID: "s3"}
			login(third, nil)
			checkKick(tc.next)
			login(first, xerror.ErrUnauthorized)
			login(tc.next, xerror.ErrUnauthorized)
			checkNoKick()
			if u.Session != third || hookCalls != 4 {
				t.Fatalf("session=%v hook calls=%d, want %v and 4", u.Session, hookCalls, third)
			}
		})
	}
}

type roomCalls struct {
	roompb.UnimplementedRoomServerServiceServer
	gatepb.UnimplementedGateServerServiceServer
	started   chan struct{}
	resume    chan struct{}
	failLeave atomic.Bool
}

func (s *roomCalls) Set(context.Context, *gatepb.SetRequest) (*gatepb.Empty, error) {
	return &gatepb.Empty{}, nil
}
func (s *roomCalls) JoinRoom(ctx context.Context, in *roompb.MembershipRequest) (*roompb.RoomSnapshot, error) {
	if in.RoomId == "missing" {
		return nil, status.Error(codes.NotFound, "missing")
	}
	close(s.started)
	select {
	case <-s.resume:
	case <-ctx.Done():
		return nil, ctx.Err()
	}
	return &roompb.RoomSnapshot{RoomId: in.RoomId}, nil
}
func (s *roomCalls) LeaveRoom(context.Context, *roompb.MembershipRequest) (*emptypb.Empty, error) {
	if s.failLeave.Load() {
		return nil, status.Error(codes.Unavailable, "unavailable")
	}
	return &emptypb.Empty{}, nil
}
func setupRoomCalls(t *testing.T) *roomCalls {
	t.Helper()
	s := &roomCalls{started: make(chan struct{}), resume: make(chan struct{})}
	listener, err := net.Listen("tcp", "127.0.0.1:0")
	if err != nil {
		t.Fatal(err)
	}
	server := grpc.NewServer()
	roompb.RegisterRoomServerServiceServer(server, s)
	gatepb.RegisterGateServerServiceServer(server, s)
	t.Cleanup(func() { server.Stop(); _ = listener.Close() })
	go func() { _ = server.Serve(listener) }()
	discovery := make(testDiscovery)
	for _, name := range []string{roompb.RoomServerService_ServiceDesc.ServiceName, gatepb.GateServerService_ServiceDesc.ServiceName} {
		if registerErr := discovery.Register(t.Context(), &registry.ServiceInstance{Name: name, ID: "g", Endpoints: []string{"grpc://" + listener.Addr().String()}}); registerErr != nil {
			t.Fatal(registerErr)
		}
	}
	conns, err := atlasgrpc.NewClientManager(atlasgrpc.ClientConfig{Discovery: discovery, Transport: grpcprovider.DefaultClientOptions()})
	if err != nil {
		t.Fatal(err)
	}
	previous, _ := atlasgrpc.DefaultClientManager()
	atlasgrpc.SetDefaultClientManager(conns)
	t.Cleanup(func() { atlasgrpc.SetDefaultClientManager(previous); _ = conns.Close() })
	return s
}

func TestRoomIDBlocksJoinWhileRPCYields(t *testing.T) {
	s := setupRoomCalls(t)
	release := sync.OnceFunc(func() { close(s.resume) })
	defer release()
	ctx, cancel := context.WithTimeout(t.Context(), 5*time.Second)
	defer cancel()
	mgr := actor.NewManager[*User, string]()
	if err := mgr.Add(ctx, "u", func(ctx context.Context) (*User, error) {
		u, err := NewUser(ctx, "u", "u", ModelData{})
		if err == nil {
			u.Session = gate.SessionRef{GateID: "g", SessionID: "s"}
		}
		return u, err
	}); err != nil {
		t.Fatal(err)
	}
	defer func() { _ = mgr.Delete(context.Background(), "u") }()
	call := func(fn func(context.Context, *User) (any, error)) (any, error) { return mgr.Exec(ctx, "u", fn) }
	result := make(chan error, 1)
	go func() {
		_, err := call(func(ctx context.Context, u *User) (any, error) { return u.RoomJoin(ctx, "room-a") })
		result <- err
	}()
	select {
	case <-s.started:
	case <-ctx.Done():
		t.Fatal("join never reached Room")
	}
	_, err := call(func(ctx context.Context, u *User) (any, error) {
		if u.room.ID() != "room-a" {
			t.Error("roomID not assigned before RPC")
		}
		return u.RoomJoin(ctx, "room-b")
	})
	if !errors.Is(err, roommodule.ErrInRoom) {
		t.Fatalf("overlapping join: %v", err)
	}
	release()
	if err = <-result; err != nil {
		t.Fatal(err)
	}
	s.failLeave.Store(true)
	_, err = call(func(ctx context.Context, u *User) (any, error) { return nil, u.RoomLeave(ctx) })
	if err == nil {
		t.Fatal("failed leave reported success")
	}
	_, err = call(func(ctx context.Context, u *User) (any, error) {
		if u.room.ID() != "room-a" {
			t.Error("failed leave cleared roomID")
		}
		return u.RoomJoin(ctx, "room-b")
	})
	if !errors.Is(err, roommodule.ErrInRoom) {
		t.Fatalf("join after failed leave: %v", err)
	}
	s.failLeave.Store(false)
	_, err = call(func(ctx context.Context, u *User) (any, error) { return nil, u.RoomLeave(ctx) })
	if err != nil {
		t.Fatal(err)
	}
	_, err = call(func(ctx context.Context, u *User) (any, error) {
		if u.room.ID() != "" {
			t.Error("successful leave kept roomID")
		}
		return u.RoomJoin(ctx, "missing")
	})
	if err == nil {
		t.Fatal("failed join reported success")
	}
	_, err = call(func(_ context.Context, u *User) (any, error) {
		if u.room.ID() != "" {
			t.Error("failed join kept roomID")
		}
		return nil, nil
	})
	if err != nil {
		t.Fatal(err)
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
