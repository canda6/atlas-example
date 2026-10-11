package main

import (
	"context"
	"time"

	"github.com/alexliesenfeld/health"
	"github.com/canda6/atlas-example/api/auth"
	"github.com/canda6/atlas-example/util/deps"
	"github.com/canda6/atlas/app"
	atlasgrpc "github.com/canda6/atlas/pkg/grpc"
	"github.com/canda6/atlas/provider/loader"
	redisprovider "github.com/canda6/atlas/provider/redis"
	_ "github.com/canda6/atlas/provider/zap"
	_ "github.com/canda6/atlas/registry/consul"
)

type Config struct {
	app.Providers
	GRPC  loader.Config `json:"GRPC"`
	Redis loader.Config `json:"Redis"`
}

type injector struct {
	redisConfig *loader.Config
}

func (i *injector) Inject(ctx context.Context) context.Context {
	if i.redisConfig == nil || i.redisConfig.ProviderName == "" {
		panic("auth: Redis configuration is required")
	}
	rp, ok := loader.GetByConfig(i.redisConfig).(*redisprovider.Provider)
	if !ok || rp == nil || rp.Client() == nil {
		panic("auth: Redis provider must supply an initialized client")
	}
	return deps.WithRedis(ctx, rp.Client())
}

func main() {
	var cfg Config
	app := app.New(&cfg,
		app.WithInjector(&injector{redisConfig: &cfg.Redis}),
		app.WithReadinessCheck(time.Second, health.Check{
			Name:    "redis",
			Timeout: 500 * time.Millisecond,
			Check: func(ctx context.Context) error {
				return deps.Redis(ctx).Ping(ctx).Err()
			},
		}),
	)

	mgr := auth.NewManager()
	srv, err := atlasgrpc.NewServer(
		&cfg.GRPC,
		mgr.Register,
		atlasgrpc.ServerOptions{
			Context:            app.Context(),
			Registrar:          app.Discovery(),
			AdvertiseHost:      app.Host(),
			Version:            app.Version(),
			SubscribeReadiness: app.SubscribeReadiness,
		},
	)
	if err != nil {
		panic(err)
	}

	app.Add(srv)
	app.Run()
}
