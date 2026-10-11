package main

import (
	"github.com/canda6/atlas/app"
	atlasgrpc "github.com/canda6/atlas/pkg/grpc"
	"github.com/canda6/atlas/provider/loader"
	_ "github.com/canda6/atlas/provider/zap"
	_ "github.com/canda6/atlas/registry/consul"
)

type Config struct {
	app.Providers
	GRPC loader.Config `json:"GRPC"`
	Gate GateConfig    `json:"Gate"`
}

func main() {
	cfg := defaultConfig()
	app := app.New(&cfg)

	gs, err := cfg.buildGate()
	if err != nil {
		panic(err)
	}

	// RPC Task 先初始化，完成控制端点发布后再打开 Gate 入口。
	srv, err := atlasgrpc.NewServer(
		&cfg.GRPC,
		gs.Register,
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
	app.Add(srv, gs)

	app.Run()
}
