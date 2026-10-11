package main

import (
	"github.com/canda6/atlas-example/api/room"
	"github.com/canda6/atlas/app"
	atlasgrpc "github.com/canda6/atlas/pkg/grpc"
	"github.com/canda6/atlas/provider/loader"
	_ "github.com/canda6/atlas/provider/zap"
	_ "github.com/canda6/atlas/registry/consul"
	"google.golang.org/grpc"
)

type Config struct {
	app.Providers
	GRPC loader.Config `json:"GRPC"`
}

func main() {
	var cfg Config
	app := app.New(&cfg)

	mgr := room.NewManager()
	srv, err := atlasgrpc.NewServer(
		&cfg.GRPC,
		mgr.Register,
		atlasgrpc.ServerOptions{
			Context:            app.Context(),
			Registrar:          app.Discovery(),
			AdvertiseHost:      app.Host(),
			Version:            app.Version(),
			SubscribeReadiness: app.SubscribeReadiness,
			UnaryInterceptors: []grpc.UnaryServerInterceptor{
				mgr.UnaryInterceptor,
			},
		},
	)
	if err != nil {
		panic(err)
	}

	app.Add(mgr, srv)
	app.Run()
}
