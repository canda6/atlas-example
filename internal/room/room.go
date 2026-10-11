package room

import (
	pb "github.com/canda6/atlas-example/gen/proto/go/room"
	"github.com/canda6/atlas/pkg/gate"
	"google.golang.org/protobuf/proto"
)

type Room struct {
	state    *pb.RoomSnapshot
	sessions map[string]gate.SessionRef
	closed   bool
}

func New(id string) *Room {
	return &Room{state: &pb.RoomSnapshot{RoomId: id, Board: make([]uint32, Size*Size), Phase: "waiting"}, sessions: make(map[string]gate.SessionRef)}
}
func (r *Room) Key() string                { return r.state.RoomId }
func (r *Room) Empty() bool                { return r.closed }
func (r *Room) Snapshot() *pb.RoomSnapshot { return proto.Clone(r.state).(*pb.RoomSnapshot) }
func (r *Room) Recipients() []gate.SessionRef {
	refs := make([]gate.SessionRef, 0, len(r.sessions))
	for _, m := range r.state.Members {
		refs = append(refs, r.sessions[m.UserId])
	}
	return refs
}
func (r *Room) Member(id string, ref gate.SessionRef) (*pb.Member, error) {
	if r.closed {
		return nil, ErrRoom
	}
	if !ref.Valid() || !r.sessions[id].SameConnection(ref) {
		return nil, ErrMember
	}
	for _, m := range r.state.Members {
		if m.UserId == id {
			return m, nil
		}
	}
	return nil, ErrMember
}
func (r *Room) Join(id, name string, ref gate.SessionRef) error {
	if r.closed {
		return ErrRoom
	}
	if id == "" || !ref.Valid() {
		return ErrMember
	}
	if len(r.state.Members) >= 2 || r.state.Phase == "playing" {
		return ErrFull
	}
	if _, ok := r.sessions[id]; ok {
		return ErrMember
	}
	r.sessions[id] = ref
	r.state.Members = append(r.state.Members, &pb.Member{UserId: id, Name: name, Stone: uint32(len(r.state.Members) + 1)})
	r.state.Phase = "waiting"
	r.state.Version++
	return nil
}
func (r *Room) Ready(id string, ref gate.SessionRef) error {
	m, err := r.Member(id, ref)
	if err != nil {
		return err
	}
	if r.state.Phase == "playing" || len(r.state.Members) != 2 {
		return ErrReady
	}
	m.Ready = true
	if r.state.Members[0].Ready && r.state.Members[1].Ready {
		r.state.Board = make([]uint32, Size*Size)
		r.state.Turn = 1
		r.state.Phase = "playing"
		r.state.WinnerId = ""
		r.state.Result = ""
	}
	r.state.Version++
	return nil
}
func (r *Room) Place(id string, ref gate.SessionRef, x, y uint32) error {
	m, err := r.Member(id, ref)
	if err != nil {
		return err
	}
	if r.state.Phase != "playing" || m.Stone != r.state.Turn || x >= Size || y >= Size || r.state.Board[y*Size+x] != 0 {
		return ErrMove
	}
	r.state.Board[y*Size+x] = m.Stone
	if winning(r.state.Board, int(x), int(y), m.Stone) {
		r.finish(id, "five")
	} else {
		full := true
		for _, v := range r.state.Board {
			if v == 0 {
				full = false
				break
			}
		}
		if full {
			r.finish("", "draw")
		} else {
			r.state.Turn = 3 - r.state.Turn
		}
	}
	r.state.Version++
	return nil
}
func (r *Room) finish(winner, result string) {
	r.state.Phase = "finished"
	r.state.Turn = 0
	r.state.WinnerId = winner
	r.state.Result = result
	for _, m := range r.state.Members {
		m.Ready = false
	}
}
func (r *Room) Leave(id string, ref gate.SessionRef) error {
	if _, err := r.Member(id, ref); err != nil {
		return err
	}
	if r.state.Phase == "playing" {
		for _, m := range r.state.Members {
			if m.UserId != id {
				r.finish(m.UserId, "leave")
				break
			}
		}
	}
	delete(r.sessions, id)
	for i, m := range r.state.Members {
		if m.UserId == id {
			r.state.Members = append(r.state.Members[:i], r.state.Members[i+1:]...)
			break
		}
	}
	for i, m := range r.state.Members {
		m.Stone = uint32(i + 1)
		m.Ready = false
	}
	if len(r.state.Members) == 0 {
		r.closed = true
	}
	r.state.Version++
	return nil
}
