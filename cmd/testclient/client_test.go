package main

import (
	"bytes"
	"context"
	"errors"
	"fmt"
	"net"
	"strings"
	"sync"
	"testing"
	"time"

	authpb "github.com/canda6/atlas-example/gen/proto/go/auth"
	logicpb "github.com/canda6/atlas-example/gen/proto/go/logic"
	"github.com/canda6/atlas/gate/connection"
	"github.com/canda6/atlas/gate/protocol"
	"google.golang.org/protobuf/proto"
	"google.golang.org/protobuf/types/known/emptypb"
)

func TestReferenceClientCorrelatesOutOfOrderResponses(t *testing.T) {
	server, clientConn := newReferenceMessagePair(t)
	client := newReferenceClient(clientConn, nil)
	t.Cleanup(func() { _ = client.Close(); _ = server.Close() })
	serverDone := make(chan error, 1)
	go func() {
		first, err := server.ReadMessage()
		if err != nil {
			serverDone <- err
			return
		}
		second, err := server.ReadMessage()
		if err != nil {
			serverDone <- err
			return
		}
		if err := server.WriteMessages(&protocol.Message{Kind: protocol.KindResponse, RequestID: second.RequestID, Payload: []byte("second")}); err != nil {
			serverDone <- err
			return
		}
		serverDone <- server.WriteMessages(&protocol.Message{Kind: protocol.KindResponse, RequestID: first.RequestID, Payload: []byte("first")})
	}()

	var wg sync.WaitGroup
	results := make(chan string, 2)
	for range 2 {
		wg.Go(func() {
			response, err := client.Call(context.Background(), "/test.Service/Call", &emptypb.Empty{})
			if err != nil {
				results <- "error: " + err.Error()
				return
			}
			results <- string(response.Payload)
		})
	}
	wg.Wait()
	close(results)
	seen := map[string]bool{}
	for result := range results {
		seen[result] = true
	}
	if !seen["first"] || !seen["second"] {
		t.Fatalf("results = %+v", seen)
	}
	if err := <-serverDone; err != nil {
		t.Fatal(err)
	}
}

func TestReferenceClientCallTimesOut(t *testing.T) {
	server, clientConn := newReferenceMessagePair(t)
	client := newReferenceClient(clientConn, nil)
	t.Cleanup(func() { _ = client.Close(); _ = server.Close() })
	requestRead := make(chan struct{})
	go func() {
		message, _ := server.ReadMessage()
		if message != nil {
		}
		close(requestRead)
	}()

	ctx, cancel := context.WithTimeout(context.Background(), 20*time.Millisecond)
	defer cancel()
	_, err := client.Call(ctx, "/test.Service/Call", &emptypb.Empty{})
	if !errors.Is(err, context.DeadlineExceeded) {
		t.Fatalf("error = %v, want deadline exceeded", err)
	}
	<-requestRead
}

func TestReferenceClientReportsClosedConnection(t *testing.T) {
	server, clientConn := newReferenceMessagePair(t)
	client := newReferenceClient(clientConn, nil)
	t.Cleanup(func() { _ = client.Close() })
	go func() {
		message, _ := server.ReadMessage()
		if message != nil {
		}
		_ = server.Close()
	}()

	ctx, cancel := context.WithTimeout(context.Background(), time.Second)
	defer cancel()
	_, err := client.Call(ctx, "/test.Service/Call", &emptypb.Empty{})
	if err == nil {
		t.Fatal("Call succeeded after the server closed the connection")
	}
}

func newReferenceMessagePair(t *testing.T) (connection.Conn, connection.Conn) {
	t.Helper()
	serverRaw, clientRaw := net.Pipe()
	return connection.NewConn(serverRaw), connection.NewConn(clientRaw)
}

func TestReferenceClientRetainsResponseAndIgnoresDuplicates(t *testing.T) {
	conn := newOwnershipConn()
	client := newReferenceClient(conn, nil)
	t.Cleanup(func() { _ = client.Close() })
	nextOwnershipRead(t, conn)

	for _, code := range []int32{0, -7} {
		result, requestID := startOwnershipCall(t, client, conn, context.Background())
		incoming := &protocol.Message{Kind: protocol.KindResponse, RequestID: requestID, Code: code, Payload: []byte("owned")}
		deliverOwnershipMessage(t, conn, incoming)
		response := receiveOwnershipResult(t, result)
		if code == 0 {
			if response.err != nil || response.message != incoming || string(response.message.Payload) != "owned" {
				t.Fatalf("response = %+v", response)
			}
		} else if response.err == nil || response.message != nil {
			t.Fatalf("failed response = %+v", response)
		}
		// A repeated response must not block delivery for the next call.
		deliverOwnershipMessage(t, conn, &protocol.Message{Kind: protocol.KindResponse, RequestID: requestID, Payload: []byte("duplicate")})
	}
}

func TestReferenceClientRetainsPushAndRejectsUnexpectedMessage(t *testing.T) {
	conn := newOwnershipConn()
	pushes := make(chan *protocol.Message, 1)
	client := newReferenceClient(conn, func(message *protocol.Message) { pushes <- message })
	t.Cleanup(func() { _ = client.Close() })
	nextOwnershipRead(t, conn)

	deliverOwnershipMessage(t, conn, &protocol.Message{Kind: protocol.KindPush, Method: "/test.Service/Event", Payload: []byte("push")})
	push := <-pushes
	if string(push.Payload) != "push" {
		t.Fatalf("retained push = %q", push.Payload)
	}
	deliverOwnershipMessage(t, conn, &protocol.Message{Kind: protocol.KindPong, Payload: []byte("probe")})

	unexpected := &protocol.Message{Kind: protocol.KindRequest, Payload: []byte("invalid")}
	conn.reads <- unexpected
	select {
	case <-client.done:
	case <-time.After(time.Second):
		t.Fatal("unexpected request did not close client")
	}
	if string(push.Payload) != "push" {
		t.Fatal("later reads or close invalidated the retained push")
	}
}

func TestReferenceClientHandlesCanceledAndRacingResponses(t *testing.T) {
	conn := newOwnershipConn()
	client := newReferenceClient(conn, nil)
	t.Cleanup(func() { _ = client.Close() })
	nextOwnershipRead(t, conn)

	for i := range 32 {
		ctx, cancel := context.WithCancel(context.Background())
		result, requestID := startOwnershipCall(t, client, conn, ctx)
		if i%2 == 0 {
			cancel()
			response := receiveOwnershipResult(t, result)
			if !errors.Is(response.err, context.Canceled) {
				t.Fatalf("canceled call = %+v", response)
			}
			deliverOwnershipMessage(t, conn, &protocol.Message{Kind: protocol.KindResponse, RequestID: requestID, Payload: []byte("late")})
		} else {
			go cancel()
			deliverOwnershipMessage(t, conn, &protocol.Message{Kind: protocol.KindResponse, RequestID: requestID, Payload: []byte("race")})
			response := receiveOwnershipResult(t, result)
			if response.err != nil && !errors.Is(response.err, context.Canceled) {
				t.Fatal(response.err)
			}
		}
	}
}

func startOwnershipCall(t *testing.T, client *referenceClient, conn *ownershipConn, ctx context.Context) (<-chan callResult, uint64) {
	t.Helper()
	result := make(chan callResult, 1)
	go func() {
		message, err := client.Call(ctx, "/test.Service/Call", &emptypb.Empty{})
		result <- callResult{message: message, err: err}
	}()
	select {
	case request := <-conn.writes:
		return result, request.RequestID
	case <-time.After(time.Second):
		t.Fatal("Call did not write a request")
		return nil, 0
	}
}

func receiveOwnershipResult(t *testing.T, results <-chan callResult) callResult {
	t.Helper()
	select {
	case result := <-results:
		return result
	case <-time.After(time.Second):
		t.Fatal("Call did not finish")
		return callResult{}
	}
}

func deliverOwnershipMessage(t *testing.T, conn *ownershipConn, message *protocol.Message) {
	t.Helper()
	want := string(message.Payload)
	select {
	case conn.reads <- message:
	case <-time.After(time.Second):
		t.Fatal("read loop is blocked")
	}
	nextOwnershipRead(t, conn)
	if string(message.Payload) != want {
		t.Fatalf("incoming kind %d was modified during delivery", message.Kind)
	}
}

func nextOwnershipRead(t *testing.T, conn *ownershipConn) {
	t.Helper()
	select {
	case <-conn.enteredRead:
	case <-time.After(time.Second):
		t.Fatal("client did not continue reading")
	}
}

type ownershipConn struct {
	reads       chan *protocol.Message
	writes      chan *protocol.Message
	enteredRead chan struct{}
	closed      chan struct{}
	once        sync.Once
}

func newOwnershipConn() *ownershipConn {
	return &ownershipConn{
		reads: make(chan *protocol.Message), writes: make(chan *protocol.Message, 8),
		enteredRead: make(chan struct{}, 1), closed: make(chan struct{}),
	}
}

func (c *ownershipConn) ReadMessage() (*protocol.Message, error) {
	c.enteredRead <- struct{}{}
	select {
	case message := <-c.reads:
		return message, nil
	case <-c.closed:
		return nil, net.ErrClosed
	}
}

func (c *ownershipConn) WriteMessages(messages ...*protocol.Message) error {
	for _, message := range messages {
		c.writes <- message.Clone()
	}
	return nil
}

func (*ownershipConn) SetReadDeadline(time.Time) error { return nil }
func (*ownershipConn) RemoteAddr() net.Addr            { return &net.TCPAddr{} }
func (c *ownershipConn) Close() error {
	c.once.Do(func() { close(c.closed) })
	return nil
}

type fakeCaller struct {
	responses map[string]*protocol.Message
	errors    map[string]error
	wait      bool
}

func (f *fakeCaller) Call(ctx context.Context, method string, _ proto.Message) (*protocol.Message, error) {
	if f.wait {
		<-ctx.Done()
		return nil, context.Cause(ctx)
	}
	if err := f.errors[method]; err != nil {
		return nil, err
	}
	return f.responses[method], nil
}

func responseMessage(t *testing.T, message proto.Message) *protocol.Message {
	t.Helper()
	payload, err := proto.Marshal(message)
	if err != nil {
		t.Fatal(err)
	}
	return &protocol.Message{Payload: payload}
}

func successfulResponses(t *testing.T) map[string]*protocol.Message {
	t.Helper()
	player := &logicpb.PlayerInfo{Id: "guest_demo", Name: "guest_demo"}
	return map[string]*protocol.Message{
		authenticateMethod: responseMessage(t, &authpb.AuthenticateResponse{Success: true, RoleId: player.Id}),
		loginMethod:        responseMessage(t, &logicpb.LoginResponse{Success: true, Player: player}),
		getBagsMethod:      responseMessage(t, &logicpb.GetBagsResponse{Items: []*logicpb.BagItem{{ItemId: 10, Count: 2}}}),
	}
}

func TestRunBasicSuccess(t *testing.T) {
	responses := successfulResponses(t)
	client := newGameClient(&fakeCaller{responses: responses}, time.Second)
	var output bytes.Buffer
	err := runBasic(client, options{accountID: "demo", channel: "guest"}, &output)
	if err != nil {
		t.Fatal(err)
	}
	for _, want := range []string{
		"AUTH success=true role_id=guest_demo",
		"LOGIN success=true player_id=guest_demo",
		"BAGS count=1",
		"BASIC_SCENARIO PASS",
	} {
		if !strings.Contains(output.String(), want) {
			t.Fatalf("output %q does not contain %q", output.String(), want)
		}
	}
}

func TestRunBasicEmptyBags(t *testing.T) {
	responses := successfulResponses(t)
	responses[getBagsMethod] = responseMessage(t, &logicpb.GetBagsResponse{})
	var output bytes.Buffer
	if err := runBasic(newGameClient(&fakeCaller{responses: responses}, time.Second), options{accountID: "demo"}, &output); err != nil {
		t.Fatal(err)
	}
	if !strings.Contains(output.String(), "BAGS count=0") || !strings.Contains(output.String(), "BASIC_SCENARIO PASS") {
		t.Fatalf("empty bag should be a successful response: %s", output.String())
	}
}

func TestRunBasicWebSocket(t *testing.T) {
	listener := connection.NewWSAcceptor(connection.WSOptions{Addr: "127.0.0.1:0", Path: "/ws"})
	err := listener.Listen()
	if err != nil {
		t.Fatal(err)
	}
	t.Cleanup(func() { _ = listener.Close() })
	responses := successfulResponses(t)
	serverDone := make(chan error, 1)
	go func() {
		conn, err := listener.Accept()
		if err != nil {
			serverDone <- err
			return
		}
		defer conn.Close()
		_ = conn.SetReadDeadline(time.Now().Add(3 * time.Second))
		for _, method := range []string{authenticateMethod, loginMethod, getBagsMethod} {
			request, err := conn.ReadMessage()
			if err != nil {
				serverDone <- err
				return
			}
			if request.Kind != protocol.KindRequest || request.Method != method {
				serverDone <- fmt.Errorf("unexpected request: %+v", request)
				return
			}
			response := responses[method]
			response.Kind = protocol.KindResponse
			response.RequestID = request.RequestID
			if err := conn.WriteMessages(response); err != nil {
				serverDone <- err
				return
			}
		}
		serverDone <- nil
	}()

	// Authenticate is the first Gate message after the WebSocket handshake.
	rpc, err := dial("ws://"+listener.Addr().String()+"/ws", time.Second)
	if err != nil {
		t.Fatal(err)
	}
	t.Cleanup(func() { _ = rpc.Close() })
	var output bytes.Buffer
	if err := runBasic(newGameClient(rpc, time.Second), options{accountID: "demo", channel: "guest"}, &output); err != nil {
		t.Fatal(err)
	}
	if !strings.Contains(output.String(), "BASIC_SCENARIO PASS") {
		t.Fatalf("unexpected scenario output: %s", output.String())
	}
	if err := <-serverDone; err != nil {
		t.Fatal(err)
	}
}

func TestRunBasicFailures(t *testing.T) {
	tests := []struct {
		name   string
		change func(*testing.T, map[string]*protocol.Message)
		want   string
	}{
		{
			name: "authenticate rejected",
			change: func(t *testing.T, responses map[string]*protocol.Message) {
				responses[authenticateMethod] = responseMessage(t, &authpb.AuthenticateResponse{Message: "denied"})
			},
			want: "authenticate rejected",
		},
		{
			name: "empty role id",
			change: func(t *testing.T, responses map[string]*protocol.Message) {
				responses[authenticateMethod] = responseMessage(t, &authpb.AuthenticateResponse{Success: true})
			},
			want: "empty role_id",
		},
		{
			name: "malformed response",
			change: func(_ *testing.T, responses map[string]*protocol.Message) {
				responses[authenticateMethod] = &protocol.Message{Payload: []byte{0xff}}
			},
			want: "decode response",
		},
		{
			name: "login rejected",
			change: func(t *testing.T, responses map[string]*protocol.Message) {
				responses[loginMethod] = responseMessage(t, &logicpb.LoginResponse{Message: "denied"})
			},
			want: "login rejected",
		},
		{
			name: "login player missing",
			change: func(t *testing.T, responses map[string]*protocol.Message) {
				responses[loginMethod] = responseMessage(t, &logicpb.LoginResponse{Success: true})
			},
			want: "login returned no player",
		},
		{
			name: "login player mismatch",
			change: func(t *testing.T, responses map[string]*protocol.Message) {
				responses[loginMethod] = responseMessage(t, &logicpb.LoginResponse{Success: true, Player: &logicpb.PlayerInfo{Id: "other"}})
			},
			want: "does not match role id",
		},
		{
			name: "malformed bags",
			change: func(_ *testing.T, responses map[string]*protocol.Message) {
				responses[getBagsMethod] = &protocol.Message{Payload: []byte{0xff}}
			},
			want: "decode response",
		},
	}

	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			responses := successfulResponses(t)
			test.change(t, responses)
			client := newGameClient(&fakeCaller{responses: responses}, time.Second)
			err := runBasic(client, options{accountID: "demo", channel: "guest"}, &bytes.Buffer{})
			if err == nil || !strings.Contains(err.Error(), test.want) {
				t.Fatalf("error = %v, want substring %q", err, test.want)
			}
		})
	}
}

func TestGameClientTimeout(t *testing.T) {
	client := newGameClient(&fakeCaller{wait: true}, 10*time.Millisecond)
	_, err := client.Authenticate("", "demo", "guest")
	if !errors.Is(err, context.DeadlineExceeded) {
		t.Fatalf("error = %v, want deadline exceeded", err)
	}
}

func TestParseOptions(t *testing.T) {
	for _, args := range [][]string{
		{"-mode", "unknown"},
		{"-mode", "basic"},
		{"-timeout", "0s"},
		{"unexpected"},
	} {
		if _, err := parseOptions(args, &bytes.Buffer{}); err == nil {
			t.Fatalf("parseOptions(%v) succeeded", args)
		}
	}

	opts, err := parseOptions([]string{"-mode", "basic", "-account-id", "demo"}, &bytes.Buffer{})
	if err != nil {
		t.Fatal(err)
	}
	if opts.mode != "basic" || opts.accountID != "demo" || opts.channel != "guest" {
		t.Fatalf("options = %+v", opts)
	}
}
