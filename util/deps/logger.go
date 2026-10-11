package deps

import (
	"context"

	"github.com/canda6/atlas/pkg/xlog"
)

func WithLogger(ctx context.Context, logger xlog.Interface) context.Context {
	return xlog.WithLogger(ctx, logger)
}

func Logger(ctx context.Context) xlog.Interface {
	return xlog.Logger(ctx)
}
