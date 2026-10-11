package logic

import (
	"context"
	"fmt"

	pb "github.com/canda6/atlas-example/gen/proto/go/logic"
	roompb "github.com/canda6/atlas-example/gen/proto/go/room"
	"github.com/canda6/atlas-example/internal/logic/bag"
	roommodule "github.com/canda6/atlas-example/internal/logic/room"
)

// 暂时手写，未来由 code gen 维护本文件，不修改 user.go。
// 导出业务方法以模块名为前缀转发，Init 和生命周期钩子不转发。
type models struct {
	bag  bag.Manager
	room roommodule.Manager
	list []any
}

// ModelData 汇总已加载的模块数据；数据库加载和 CRUD 生成尚未接入。
type ModelData struct {
	Bag []bag.Row
}

func (u *User) initModels(data ModelData) error {
	u.room.Init(u)
	if err := u.bag.Init(u, data.Bag); err != nil {
		return fmt.Errorf("init bag: %w", err)
	}
	// 列表与具名成员使用同一实例，注册顺序就是钩子执行顺序。
	u.models.list = []any{&u.bag, &u.room}
	return nil
}

func (u *User) RoomCreate(ctx context.Context) (*roompb.RoomSnapshot, error) {
	return u.room.Create(ctx)
}
func (u *User) RoomJoin(ctx context.Context, id string) (*roompb.RoomSnapshot, error) {
	return u.room.Join(ctx, id)
}
func (u *User) RoomLeave(ctx context.Context) error { return u.room.Leave(ctx) }

func (u *User) BagAddItem(ctx context.Context, itemID, count int64) error {
	return u.bag.AddItem(ctx, itemID, count)
}

func (u *User) BagItemCount(itemID int64) int64 {
	return u.bag.ItemCount(itemID)
}

func (u *User) BagGetBags(ctx context.Context, req *pb.GetBagsRequest) (*pb.GetBagsResponse, error) {
	return u.bag.GetBags(ctx, req)
}
