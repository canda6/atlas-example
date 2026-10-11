package room

import (
	"errors"
	"testing"

	"github.com/canda6/atlas/pkg/gate"
)

func TestWinDirections(t *testing.T) {
	for _, d := range [][2]int{{1, 0}, {0, 1}, {1, 1}, {1, -1}} {
		board := make([]uint32, Size*Size)
		for i := 0; i < 5; i++ {
			x, y := 4+i*d[0], 8+i*d[1]
			board[y*Size+x] = 1
		}
		if !winning(board, 4, 8, 1) {
			t.Fatalf("direction %v", d)
		}
		board[8*Size+4] = 0
		if winning(board, 4+d[0], 8+d[1], 1) {
			t.Fatalf("four stones won: %v", d)
		}
	}
}
func TestGameLifecycle(t *testing.T) {
	r := New("r")
	a := gate.SessionRef{GateID: "g", SessionID: "a"}
	b := gate.SessionRef{GateID: "g", SessionID: "b"}
	for _, p := range []struct {
		id  string
		ref gate.SessionRef
	}{{"a", a}, {"b", b}} {
		if err := r.Join(p.id, p.id, p.ref); err != nil {
			t.Fatal(err)
		}
	}
	if !errors.Is(r.Join("c", "c", a), ErrFull) {
		t.Fatal("third member accepted")
	}
	if err := r.Ready("a", a); err != nil {
		t.Fatal(err)
	}
	if err := r.Ready("b", b); err != nil {
		t.Fatal(err)
	}
	if !errors.Is(r.Place("b", b, 0, 0), ErrMove) {
		t.Fatal("white moved first")
	}
	if !errors.Is(r.Place("a", b, 0, 0), ErrMember) {
		t.Fatal("wrong connection accepted")
	}
	if !errors.Is(r.Place("a", a, 15, 0), ErrMove) {
		t.Fatal("out of bounds")
	}
	snapshot := r.Snapshot()
	for x := uint32(0); x < 5; x++ {
		if err := r.Place("a", a, x, 0); err != nil {
			t.Fatal(err)
		}
		if x < 4 {
			if !errors.Is(r.Place("b", b, x, 0), ErrMove) {
				t.Fatal("occupied position accepted")
			}
			if err := r.Place("b", b, x, 1); err != nil {
				t.Fatal(err)
			}
		}
	}
	if r.state.WinnerId != "a" || r.state.Phase != "finished" {
		t.Fatal("missing winner")
	}
	if snapshot.Board[0] != 0 {
		t.Fatal("snapshot mutated")
	}
	if !errors.Is(r.Place("b", b, 4, 1), ErrMove) {
		t.Fatal("move after finish")
	}
	checkRematchAndExit(t, r, a, b)
}

func TestDraw(t *testing.T) {
	r := New("draw")
	a := gate.SessionRef{GateID: "g", SessionID: "a"}
	b := gate.SessionRef{GateID: "g", SessionID: "b"}
	for id, ref := range map[string]gate.SessionRef{"a": a, "b": b} {
		if err := r.Join(id, id, ref); err != nil {
			t.Fatal(err)
		}
	}
	for y := 0; y < Size; y++ {
		for x := 0; x < Size; x++ {
			r.state.Board[y*Size+x] = uint32((x+2*y)%4/2 + 1)
		}
	}
	r.state.Board[Size*Size-1] = 0
	r.state.Phase = "playing"
	r.state.Turn = 2
	white := r.state.Members[1].UserId
	if err := r.Place(white, r.sessions[white], Size-1, Size-1); err != nil {
		t.Fatal(err)
	}
	if r.state.Phase != "finished" || r.state.Result != "draw" || r.state.WinnerId != "" {
		t.Fatal("full board did not draw")
	}
}

func checkRematchAndExit(t *testing.T, r *Room, a, b gate.SessionRef) {
	t.Helper()
	if err := r.Ready("a", a); err != nil {
		t.Fatal(err)
	}
	if err := r.Ready("b", b); err != nil {
		t.Fatal(err)
	}
	if r.state.Board[0] != 0 || r.state.Phase != "playing" {
		t.Fatal("rematch not reset")
	}
	if err := r.Leave("a", a); err != nil {
		t.Fatal(err)
	}
	if r.state.WinnerId != "b" || r.state.Result != "leave" || r.state.Members[0].Stone != 1 {
		t.Fatal("leave result")
	}
	if err := r.Leave("b", b); err != nil {
		t.Fatal(err)
	}
	if !r.Empty() {
		t.Fatal("room not closed")
	}
	if !errors.Is(r.Join("a", "a", a), ErrRoom) {
		t.Fatal("closed room reopened")
	}
}
