package room

import (
	"context"
	"crypto/rand"
	"encoding/hex"

	pb "github.com/canda6/atlas-example/gen/proto/go/room"
	"github.com/canda6/atlas/pkg/gate"
	gatepb "github.com/canda6/atlas/pkg/proto/gate"
	"github.com/canda6/atlas/pkg/xerror"
)

var (
	ErrInRoom = xerror.Define(409, 2100, "already in a room")
	ErrRoomID = xerror.Define(400, 2101, "room id required")
)

type deps interface {
	Key() string
	GetName() string
	GetSessionRef() gate.SessionRef
}
type Manager struct {
	deps   deps
	roomID string
}

func (m *Manager) Init(d deps) { m.deps = d }
func (m *Manager) ID() string  { return m.roomID }
func (m *Manager) request(id string) *pb.MembershipRequest {
	ref := m.deps.GetSessionRef()
	return &pb.MembershipRequest{RoomId: id, UserId: m.deps.Key(), Name: m.deps.GetName(), Session: &gatepb.SessionRef{GateId: ref.GateID, SessionId: ref.SessionID}}
}
func (m *Manager) enter(ctx context.Context, id string, create bool) (*pb.RoomSnapshot, error) {
	if m.roomID != "" {
		return nil, ErrInRoom
	}
	if id == "" {
		return nil, ErrRoomID
	}
	m.roomID = id
	request := m.request(id)
	// Room receives the player identity from Gate; room membership still checks the exact connection.
	if err := gate.Set(ctx, gate.SessionRef{GateID: request.Session.GateId, SessionID: request.Session.SessionId}, pb.RoomClientService_ServiceDesc.ServiceName, request.UserId, gate.Immutable()); err != nil {
		m.roomID = ""
		return nil, err
	}
	var snapshot *pb.RoomSnapshot
	var err error
	if create {
		snapshot, err = pb.CreateRoom(ctx, request)
	} else {
		snapshot, err = pb.JoinRoom(ctx, request)
	}
	if err != nil {
		m.roomID = ""
	}
	return snapshot, err
}
func (m *Manager) Create(ctx context.Context) (*pb.RoomSnapshot, error) {
	var id [4]byte
	if _, err := rand.Read(id[:]); err != nil {
		return nil, err
	}
	return m.enter(ctx, hex.EncodeToString(id[:]), true)
}
func (m *Manager) Join(ctx context.Context, id string) (*pb.RoomSnapshot, error) {
	return m.enter(ctx, id, false)
}
func (m *Manager) Leave(ctx context.Context) error {
	if m.roomID == "" {
		return nil
	}
	_, err := pb.LeaveRoom(ctx, m.request(m.roomID))
	if err == nil {
		m.roomID = ""
	}
	return err
}
