// Command gate assembles the control RPC server and client ingresses.
package main

import (
	"fmt"
	"net/http"
	"time"

	"github.com/canda6/atlas/gate"
	"github.com/canda6/atlas/gate/connection"
	atlasgrpc "github.com/canda6/atlas/pkg/grpc"
	grpcprovider "github.com/canda6/atlas/provider/grpc"
)

// GateConfig is application configuration, decoded directly from config.json.
// The demo accepts client connections over WebSocket.
type GateConfig struct {
	WebSocket struct {
		Listen string `json:"listen"`
		Path   string `json:"path"`
	} `json:"websocket"`
	Timeouts struct {
		Idle           string `json:"idle"`
		Request        string `json:"request"`
		DisconnectCall string `json:"disconnect_call"`
	} `json:"timeouts"`
	Capacity struct {
		MaxConnections           int `json:"max_connections"`
		MaxInFlightPerConnection int `json:"max_in_flight_per_connection"`
	} `json:"capacity"`
}

func defaultConfig() Config {
	var cfg Config
	cfg.Gate.Timeouts.Idle = "2m"
	cfg.Gate.Timeouts.Request = "15s"
	cfg.Gate.Timeouts.DisconnectCall = "3s"
	cfg.Gate.Capacity.MaxConnections = 100000
	cfg.Gate.Capacity.MaxInFlightPerConnection = 64
	return cfg
}

func (c GateConfig) options() (gate.Options, error) {
	opts := gate.Options{Capacity: gate.Capacity{
		MaxConnections:           c.Capacity.MaxConnections,
		MaxInFlightPerConnection: c.Capacity.MaxInFlightPerConnection,
	}}
	for _, field := range []struct {
		name, value string
		target      *time.Duration
	}{
		{"idle", c.Timeouts.Idle, &opts.Timeouts.Idle},
		{"request", c.Timeouts.Request, &opts.Timeouts.Request},
		{"disconnect_call", c.Timeouts.DisconnectCall, &opts.Timeouts.DisconnectCall},
	} {
		d, err := time.ParseDuration(field.value)
		if err != nil {
			return gate.Options{}, fmt.Errorf("gate.timeouts.%s: %w", field.name, err)
		}
		*field.target = d
	}
	if err := opts.Validate(); err != nil {
		return gate.Options{}, fmt.Errorf("gate options: %w", err)
	}
	return opts, nil
}

func (c *Config) buildGate() (*gate.Server, error) {
	conns, err := atlasgrpc.DefaultClientManager()
	if err != nil {
		return nil, err
	}
	opts, err := c.Gate.options()
	if err != nil {
		return nil, err
	}
	rpc, ok := c.GRPC.Provider().(*grpcprovider.Server)
	if !ok || rpc == nil {
		return nil, fmt.Errorf("gate: %w: loaded GRPC server required", gate.ErrInvalidOptions)
	}
	if c.Gate.WebSocket.Listen == "" {
		return nil, fmt.Errorf("gate.websocket.listen: %w", gate.ErrInvalidOptions)
	}
	acceptor := connection.NewWSAcceptor(connection.WSOptions{Addr: c.Gate.WebSocket.Listen, Path: c.Gate.WebSocket.Path, CheckOrigin: demoOrigin})
	server, err := gate.NewServer(opts, rpc.Config().NodeID, conns, acceptor)
	if err != nil {
		return nil, fmt.Errorf("build gate: %w", err)
	}
	return server, nil
}

// demoOrigin permits the local frontend and non-browser test clients.
func demoOrigin(r *http.Request) bool {
	switch r.Header.Get("Origin") {
	case "", "http://127.0.0.1:5173", "http://localhost:5173":
		return true
	default:
		return false
	}
}
