package logic

import (
	"net/http"

	"github.com/canda6/atlas/pkg/xerror"
)

var ErrLoginInProgress = xerror.Define(http.StatusConflict, 2000, "login in progress")
