package logic

import (
	"context"

	pb "github.com/canda6/atlas-example/gen/proto/go/logic"
	"github.com/canda6/atlas-example/util/deps"
	"github.com/canda6/atlas/pkg/gate"
	gatepb "github.com/canda6/atlas/pkg/proto/gate"
	"github.com/canda6/atlas/pkg/xerror"
	"github.com/canda6/atlas/pkg/xlog"
	"google.golang.org/protobuf/types/known/emptypb"
)

// User 初始化后只能通过指针使用，模块持有其依赖引用，不应复制。
type User struct {
	models

	ID      string
	Name    string
	Session gate.SessionRef // 只记录已完成登录的连接。
	GuildID string

	loginInProgress bool
	revokedSessions map[gate.SessionRef]struct{} // 防止被顶掉的连接通过在途 login 抢回登录状态。
}

func (p *User) GetSessionID() string { return p.Session.SessionID }
func (p *User) GetGuildID() string   { return p.GuildID }

func (p *User) Key() string                    { return p.ID }
func (p *User) GetName() string                { return p.Name }
func (p *User) GetSessionRef() gate.SessionRef { return p.Session }

func NewUser(ctx context.Context, id, name string, data ModelData) (*User, error) {
	player := &User{
		ID:   id,
		Name: name,
	}
	if err := player.initModels(data); err != nil {
		return nil, err
	}
	deps.Logger(ctx).Debug("player created", xlog.KV("name", name))
	return player, nil
}

func (p *User) clearSession() {
	p.Session = gate.SessionRef{}
}

// onLogin 是可选钩子，模块无需提供空实现。
type onLogin interface {
	OnLogin(context.Context) error
}

// Login 在所属 Actor 内按注册顺序调用钩子，遇错停止。
// 同连接成功后的重试不再调用钩子；失败前已执行的变更不会自动回滚。
// 钩子如需本次登录的连接，应从 ctx 获取，Session 尚未提交。
func (u *User) Login(ctx context.Context, req *pb.LoginRequest) (*pb.LoginResponse, error) {
	if u == nil {
		return nil, xerror.ErrActorNotFound
	}
	ref, err := gate.SessionRefFromContext(ctx)
	if err != nil {
		return nil, xerror.ErrUnauthorized
	}
	if _, revoked := u.revokedSessions[ref]; revoked {
		return nil, xerror.ErrUnauthorized
	}
	if u.loginInProgress {
		return nil, ErrLoginInProgress
	}
	if u.Session.SameConnection(ref) {
		return &pb.LoginResponse{Success: true, Player: &pb.PlayerInfo{Id: u.ID, Name: u.Name}}, nil
	}

	u.loginInProgress = true
	defer func() {
		u.loginInProgress = false
	}()

	if err := u.room.Leave(ctx); err != nil {
		return nil, err
	}

	for _, model := range u.models.list {
		if handler, ok := model.(onLogin); ok {
			if err := handler.OnLogin(ctx); err != nil {
				return nil, err
			}
		}
	}
	previous := u.Session
	u.Session = ref
	if previous.Valid() {
		if u.revokedSessions == nil {
			u.revokedSessions = make(map[gate.SessionRef]struct{})
		}
		u.revokedSessions[previous] = struct{}{}
		if err := gate.Disconnect(ctx, previous, gatepb.DisconnectReason_DISCONNECT_REASON_LOGGED_IN_ELSEWHERE); err != nil {
			deps.Logger(ctx).Warn("disconnect replaced session failed", xlog.KV("role_id", u.ID), xlog.KV("gate_id", previous.GateID), xlog.KV("error", err))
		}
	}
	return &pb.LoginResponse{Success: true, Player: &pb.PlayerInfo{Id: u.ID, Name: u.Name}}, nil
}

func (u *User) OnDisconnect(ctx context.Context, req *gatepb.OnDisconnectRequest) (*emptypb.Empty, error) {
	var ref gate.SessionRef
	if req != nil && req.GetSession() != nil {
		ref = gate.SessionRef{GateID: req.Session.GetGateId(), SessionID: req.Session.GetSessionId()}
	}
	if u != nil && u.Session.SameConnection(ref) {
		if err := u.room.Leave(ctx); err != nil {
			return nil, err
		}
		if u.Session.SameConnection(ref) {
			u.clearSession()
		}
	}
	return &emptypb.Empty{}, nil
}
