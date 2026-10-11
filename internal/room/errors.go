package room

import "github.com/canda6/atlas/pkg/xerror"

var (
	ErrRoom   = xerror.Define(404, 3001, "room not found")
	ErrMember = xerror.Define(403, 3002, "not a room member")
	ErrFull   = xerror.Define(409, 3003, "room full or playing")
	ErrMove   = xerror.Define(409, 3004, "invalid move or turn")
	ErrReady  = xerror.Define(409, 3005, "cannot ready now")
	ErrExists = xerror.Define(409, 3006, "room already exists")
)
