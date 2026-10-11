package bag

import (
	"context"
	"fmt"
	"math"
	"sort"

	pb "github.com/canda6/atlas-example/gen/proto/go/logic"
	infra "github.com/canda6/atlas-example/util/deps"
	"github.com/canda6/atlas/pkg/xlog"
)

// deps 由模块声明自身需要的能力，初始化时传入 User。
type deps interface {
	Key() string
}

// Row 暂时手写；未来由表结构生成的数据类型替换。
type Row struct {
	ItemID int64
	Count  int64
}

type Manager struct {
	deps  deps
	items map[int64]int64
}

// Init 接收加载好的数据列表，只恢复自身状态，不调用其他模块。
func (m *Manager) Init(d deps, rows []Row) error {
	items := make(map[int64]int64, len(rows))
	for _, row := range rows {
		if row.ItemID <= 0 || row.Count < 0 {
			return fmt.Errorf("invalid bag row: %+v", row)
		}
		if _, exists := items[row.ItemID]; exists {
			return fmt.Errorf("duplicate item: %d", row.ItemID)
		}
		items[row.ItemID] = row.Count
	}
	m.deps, m.items = d, items
	return nil
}

func (m *Manager) AddItem(ctx context.Context, itemID, count int64) error {
	if itemID <= 0 || count <= 0 {
		return fmt.Errorf("invalid item addition: item=%d count=%d", itemID, count)
	}
	if m.items == nil {
		return fmt.Errorf("bag is not initialized")
	}
	if m.items[itemID] > math.MaxInt64-count {
		return fmt.Errorf("item count overflow: %d", itemID)
	}
	m.items[itemID] += count
	infra.Logger(ctx).Debug("bag item added", xlog.KV("player_id", m.deps.Key()),
		xlog.KV("item_id", itemID), xlog.KV("count", count))
	return nil
}

func (m *Manager) ItemCount(itemID int64) int64 {
	return m.items[itemID]
}

// GetBags 返回按道具 ID 排序的快照，调用者不能修改背包内部状态。
func (m *Manager) GetBags(ctx context.Context, req *pb.GetBagsRequest) (*pb.GetBagsResponse, error) {
	items := make([]*pb.BagItem, 0, len(m.items))
	for id, count := range m.items {
		items = append(items, &pb.BagItem{ItemId: id, Count: count})
	}
	sort.Slice(items, func(i, j int) bool { return items[i].ItemId < items[j].ItemId })
	return &pb.GetBagsResponse{Items: items}, nil
}
