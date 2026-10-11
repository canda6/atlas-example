package bag

import (
	"context"
	pb "github.com/canda6/atlas-example/gen/proto/go/logic"
	"math"
	"testing"
)

type testDeps struct{}

func (testDeps) Key() string { return "user-1" }

func TestGetBagsReturnsSortedSnapshot(t *testing.T) {
	var m Manager
	if err := m.Init(testDeps{}, []Row{{ItemID: 20, Count: 3}, {ItemID: 10, Count: 2}}); err != nil {
		t.Fatal(err)
	}
	resp, err := m.GetBags(context.Background(), &pb.GetBagsRequest{})
	if err != nil {
		t.Fatal(err)
	}
	rows := resp.Items
	if len(rows) != 2 || rows[0].ItemId != 10 || rows[0].Count != 2 || rows[1].ItemId != 20 || rows[1].Count != 3 {
		t.Fatalf("unexpected bags: %+v", rows)
	}
	rows[0].Count = 99
	if m.ItemCount(10) != 2 {
		t.Fatal("snapshot mutation changed bag state")
	}
}

func TestInvalidAddLeavesStateUnchanged(t *testing.T) {
	var m Manager
	if err := m.Init(testDeps{}, []Row{{ItemID: 1, Count: math.MaxInt64}}); err != nil {
		t.Fatal(err)
	}
	for _, input := range []Row{{ItemID: 0, Count: 1}, {ItemID: 1, Count: 0}, {ItemID: 1, Count: -1}, {ItemID: 1, Count: 1}} {
		if err := m.AddItem(context.Background(), input.ItemID, input.Count); err == nil {
			t.Fatalf("accepted invalid addition: %+v", input)
		}
		if m.ItemCount(1) != math.MaxInt64 || m.ItemCount(0) != 0 {
			t.Fatal("failed addition changed state")
		}
	}
}

func TestInitRejectsDuplicateAndNegativeRows(t *testing.T) {
	for _, rows := range [][]Row{
		{{ItemID: 1, Count: 1}, {ItemID: 1, Count: 2}},
		{{ItemID: 1, Count: -1}},
	} {
		var m Manager
		if err := m.Init(testDeps{}, rows); err == nil {
			t.Fatalf("accepted invalid rows: %+v", rows)
		}
	}
}
