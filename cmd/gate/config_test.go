package main

import (
	"context"
	"encoding/json"
	"errors"
	"net/http"
	"testing"

	atlasgrpc "github.com/canda6/atlas/pkg/grpc"
	"github.com/canda6/atlas/provider/loader"
	"github.com/canda6/atlas/registry"
	"github.com/gorilla/websocket"
)

type configDiscovery struct{}

func (configDiscovery) Register(context.Context, *registry.ServiceInstance) error {
	return errors.New("unexpected registration during Build")
}
func (configDiscovery) GetService(context.Context, string) ([]*registry.ServiceInstance, error) {
	return nil, errors.New("unexpected resolve during Build")
}

func TestConfigLoadsGateWithoutProvider(t *testing.T) {
	// Only load Gate sections: this check requires no Redis, Consul or collector.
	cfg := defaultConfig()
	if err := loader.UnmarshalFile("config.json", &cfg); err != nil {
		t.Fatal(err)
	}
	for _, provider := range []*loader.Config{&cfg.GRPC} {
		if _, err := loader.Load(context.Background(), provider); err != nil {
			t.Fatal(err)
		}
	}
	if !cfg.GrpcClientDefaults.Insecure {
		t.Fatal("client defaults missing from config.json")
	}
	client, err := atlasgrpc.NewClientManager(atlasgrpc.ClientConfig{Discovery: configDiscovery{}, Transport: cfg.GrpcClientDefaults})
	if err != nil {
		t.Fatal(err)
	}
	t.Cleanup(func() { _ = client.Close() })
	previous, _ := atlasgrpc.DefaultClientManager()
	atlasgrpc.SetDefaultClientManager(client)
	t.Cleanup(func() { atlasgrpc.SetDefaultClientManager(previous) })

	s, err := cfg.buildGate()
	if err != nil {
		t.Fatal(err)
	}
	if s.Addr() != nil {
		t.Fatal("Build unexpectedly opened the configured ingress port")
	}
}

func (configDiscovery) Watch(context.Context, string) (registry.Watcher, error) {
	return nil, registry.ErrClosed
}

func TestGateConfigDefaultsAndValidation(t *testing.T) {
	for _, tc := range []struct {
		name, input string
		invalid     bool
	}{
		{"defaults", `{"Gate":{"websocket":{"listen":":8081","path":"/ws"}}}`, false},
		{"partial", `{"Gate":{"timeouts":{"request":"7s"}}}`, false},
		{"zero", `{"Gate":{"capacity":{"max_connections":0}}}`, true},
		{"duration", `{"Gate":{"timeouts":{"idle":"invalid"}}}`, true},
		{"empty", `{"Gate":{"timeouts":{"idle":""}}}`, true},
	} {
		t.Run(tc.name, func(t *testing.T) {
			cfg := defaultConfig()
			if err := json.Unmarshal([]byte(tc.input), &cfg); err != nil {
				t.Fatal(err)
			}
			opts, err := cfg.Gate.options()
			if (err != nil) != tc.invalid {
				t.Fatalf("options error: %v", err)
			}
			if !tc.invalid && opts.Timeouts.DisconnectCall.String() != "3s" {
				t.Fatal("omitted default lost")
			}
		})
	}
}

func TestGateAcceptsLocalFrontendDirectly(t *testing.T) {
	cfg := defaultConfig()
	if err := loader.UnmarshalFile("config.json", &cfg); err != nil {
		t.Fatal(err)
	}
	if _, err := loader.Load(context.Background(), &cfg.GRPC); err != nil {
		t.Fatal(err)
	}
	cfg.Gate.WebSocket.Listen = "127.0.0.1:0"
	client, err := atlasgrpc.NewClientManager(atlasgrpc.ClientConfig{Discovery: configDiscovery{}, Transport: cfg.GrpcClientDefaults})
	if err != nil {
		t.Fatal(err)
	}
	t.Cleanup(func() { _ = client.Close() })
	previous, _ := atlasgrpc.DefaultClientManager()
	atlasgrpc.SetDefaultClientManager(client)
	t.Cleanup(func() { atlasgrpc.SetDefaultClientManager(previous) })
	server, err := cfg.buildGate()
	if err != nil {
		t.Fatal(err)
	}
	if err := server.Listen(context.Background()); err != nil {
		t.Fatal(err)
	}
	t.Cleanup(func() { _ = server.StopAccept() })
	for _, origin := range []string{"", "http://127.0.0.1:5173", "http://localhost:5173", "http://untrusted.example", "http://localhost:5174"} {
		t.Run(origin, func(t *testing.T) {
			header := http.Header{}
			if origin != "" {
				header.Set("Origin", origin)
			}
			conn, response, err := websocket.DefaultDialer.Dial("ws://"+server.Addr().String()+"/ws", header)
			allowed := origin == "" || origin == "http://127.0.0.1:5173" || origin == "http://localhost:5173"
			if allowed {
				if err != nil {
					t.Fatal(err)
				}
				_ = conn.Close()
			} else {
				if err == nil {
					_ = conn.Close()
					t.Fatal("unexpected origin accepted")
				}
				if response == nil || response.StatusCode != http.StatusForbidden {
					t.Fatalf("response=%v err=%v", response, err)
				}
			}
			if response != nil {
				_ = response.Body.Close()
			}
		})
	}
}
