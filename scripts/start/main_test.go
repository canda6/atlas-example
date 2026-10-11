package main

import (
	"context"
	"os"
	"os/exec"
	"testing"
	"time"
)

func TestEndpoint(t *testing.T) {
	for _, tc := range []struct{ input, want string }{
		{":9000", "127.0.0.1:9000"},
		{"0.0.0.0:9001", "127.0.0.1:9001"},
		{"http://localhost:18500", "localhost:18500"},
		{"[::]:9002", "127.0.0.1:9002"},
		{"tcp://[::1]:9003", "[::1]:9003"},
	} {
		got, err := endpoint(tc.input)
		if err != nil || got != tc.want {
			t.Errorf("endpoint(%q) = %q, %v; want %q", tc.input, got, err, tc.want)
		}
	}
	for _, input := range []string{"", "localhost", ":0", ":65536", "localhost:bad"} {
		if _, err := endpoint(input); err == nil {
			t.Errorf("endpoint(%q) should fail", input)
		}
	}
}

func TestReadinessStopsOnExitOrCancellation(t *testing.T) {
	s := &service{name: "test", done: make(chan struct{})}
	close(s.done)
	if err := waitReady(context.Background(), s, "unused", time.Second); err == nil {
		t.Fatal("exited process reported ready")
	}
	s.done = make(chan struct{})
	ctx, cancel := context.WithCancel(context.Background())
	cancel()
	if err := waitReady(ctx, s, "unused", time.Second); err == nil {
		t.Fatal("cancelled startup reported ready")
	}
}

func TestShutdownKillsOwnedProcessAfterDeadline(t *testing.T) {
	if os.Getenv("ATLAS_START_TEST_CHILD") == "1" {
		time.Sleep(time.Minute)
		os.Exit(0)
	}
	cmd := exec.Command(os.Args[0], "-test.run=^TestShutdownKillsOwnedProcessAfterDeadline$")
	cmd.Env = append(os.Environ(), "ATLAS_START_TEST_CHILD=1")
	if err := cmd.Start(); err != nil {
		t.Fatal(err)
	}
	t.Cleanup(func() { _ = cmd.Process.Kill() })
	s := &service{name: "test", cmd: cmd, done: make(chan struct{})}
	go func() {
		s.err = cmd.Wait()
		close(s.done)
	}()
	shutdown([]*service{s}, 10*time.Millisecond)
	select {
	case <-s.done:
	default:
		t.Fatal("shutdown returned with its child still running")
	}
}
