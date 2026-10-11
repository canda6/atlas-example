package main

import (
	"fmt"
	"io"
	"time"

	pb "github.com/canda6/atlas-example/gen/proto/go/room"
	"google.golang.org/protobuf/types/known/emptypb"
)

const logicRoute = "/logic.client.v1.LogicClientService/"
const roomRoute = "/room.client.v1.RoomClientService/"

func runDuel(a *gameClient, opts options, out io.Writer) error {
	bRPC, err := dial(opts.addr, opts.timeout)
	if err != nil {
		return err
	}
	defer func() { _ = bRPC.Close() }()
	b := newGameClient(bRPC, opts.timeout)
	prefix := fmt.Sprintf("duel-%d", time.Now().UnixNano())
	login := func(c *gameClient, account string) (string, error) {
		resp, authErr := c.Authenticate("", account, "guest")
		if authErr != nil {
			return "", authErr
		}
		_, authErr = c.Login(resp.RoleId)
		return resp.RoleId, authErr
	}
	aid, err := login(a, prefix+"-a")
	if err != nil {
		return err
	}
	if _, err = login(b, prefix+"-b"); err != nil {
		return err
	}
	var state pb.RoomSnapshot
	if err = a.call(logicRoute+"CreateRoom", &emptypb.Empty{}, &state); err != nil {
		return err
	}
	id := state.RoomId
	if err = verifyAdmission(a, b, id, aid); err != nil {
		return err
	}
	if err = playDuel(a, b, id, aid, out); err != nil {
		return err
	}
	return verifyDisconnect(a, bRPC, opts, id, aid, prefix, login, out)
}

func verifyAdmission(a, b *gameClient, id, aid string) error {
	var state pb.RoomSnapshot
	var err error
	if err = a.call(logicRoute+"CreateRoom", &emptypb.Empty{}, &pb.RoomSnapshot{}); err == nil {
		return fmt.Errorf("second room accepted")
	}
	if err = b.call(roomRoute+"GetRoom", &pb.RoomRequest{RoomId: id}, &pb.RoomSnapshot{}); err == nil {
		return fmt.Errorf("non-member read accepted")
	}
	if err = b.call("/room.server.v1.RoomServerService/JoinRoom", &pb.MembershipRequest{RoomId: id, UserId: aid}, &pb.RoomSnapshot{}); err == nil {
		return fmt.Errorf("internal RPC publicly accessible")
	}
	if err = b.call(logicRoute+"JoinRoom", &pb.RoomRequest{RoomId: "missing"}, &pb.RoomSnapshot{}); err == nil {
		return fmt.Errorf("missing room accepted")
	}
	if err = b.call(logicRoute+"JoinRoom", &pb.RoomRequest{RoomId: id}, &state); err != nil {
		return err
	}
	return nil
}

func verifyDisconnect(a *gameClient, bRPC *referenceClient, opts options, id, aid, prefix string, login func(*gameClient, string) (string, error), out io.Writer) error {
	var state pb.RoomSnapshot
	var err error
	if err = bRPC.Close(); err != nil {
		return err
	}
	deadline := time.Now().Add(opts.timeout)
	for {
		if err = a.call(roomRoute+"GetRoom", &pb.RoomRequest{RoomId: id}, &state); err != nil {
			return err
		}
		if state.Result == "leave" && state.WinnerId == aid {
			break
		}
		if time.Now().After(deadline) {
			return fmt.Errorf("disconnect did not forfeit")
		}
		time.Sleep(50 * time.Millisecond)
	}
	_, _ = fmt.Fprintln(out, "DUEL disconnect forfeits: passed")
	replacement, err := dial(opts.addr, opts.timeout)
	if err != nil {
		return err
	}
	defer func() { _ = replacement.Close() }()
	c := newGameClient(replacement, opts.timeout)
	if _, err = login(c, prefix+"-a"); err != nil {
		return err
	}
	if err = a.call(roomRoute+"GetRoom", &pb.RoomRequest{RoomId: id}, &state); err == nil {
		return fmt.Errorf("old connection still active")
	}
	if err = c.call(logicRoute+"CreateRoom", &emptypb.Empty{}, &state); err != nil {
		return err
	}
	if err = c.call(logicRoute+"LeaveRoom", &emptypb.Empty{}, &emptypb.Empty{}); err != nil {
		return err
	}
	_, _ = fmt.Fprintln(out, "DUEL takeover and fresh room: passed")
	_, _ = fmt.Fprintln(out, "DUEL_SCENARIO PASS")
	return nil
}

func playDuel(a, b *gameClient, id, aid string, out io.Writer) error {
	var state pb.RoomSnapshot
	var err error
	ready := func() error {
		for _, c := range []*gameClient{a, b} {
			if err = c.call(roomRoute+"Ready", &pb.RoomRequest{RoomId: id}, &state); err != nil {
				return err
			}
		}
		return nil
	}
	if err = ready(); err != nil {
		return err
	}
	if err = b.call(roomRoute+"PlaceStone", &pb.PlaceStoneRequest{RoomId: id}, &state); err == nil {
		return fmt.Errorf("white moved first")
	}
	for x := uint32(0); x < 5; x++ {
		if err = a.call(roomRoute+"PlaceStone", &pb.PlaceStoneRequest{RoomId: id, X: x, Y: 0}, &state); err != nil {
			return err
		}
		if x < 4 {
			if err = b.call(roomRoute+"PlaceStone", &pb.PlaceStoneRequest{RoomId: id, X: x, Y: 1}, &state); err != nil {
				return err
			}
		}
	}
	if state.Phase != "finished" || state.WinnerId != aid {
		return fmt.Errorf("wrong winner: %s", state.String())
	}
	_, _ = fmt.Fprintf(out, "DUEL five-in-a-row room=%s winner=%s\n", id, aid)
	if err = ready(); err != nil {
		return err
	}
	return nil
}
