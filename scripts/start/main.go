// Command start supervises the local demo services for start.bat.
package main

import (
	"context"
	"encoding/json"
	"errors"
	"flag"
	"fmt"
	"net"
	"net/url"
	"os"
	"os/exec"
	"os/signal"
	"path/filepath"
	"strconv"
	"strings"
	"time"
)

type config struct {
	GRPC struct {
		Config struct {
			Listen string
			NodeID string `json:"node_id"`
		}
	}
	Discovery struct {
		Provider string
		Config   struct{ Address string }
	}
	Redis struct{ Config struct{ Addr string } }
}

type service struct {
	name, path, endpoint string
	config               config
	cmd                  *exec.Cmd
	done                 chan struct{}
	err                  error // Read only after done closes.
}

func endpoint(value string) (string, error) {
	value = strings.TrimSpace(value)
	if !strings.Contains(value, "://") {
		value = "tcp://" + value
	}
	u, err := url.Parse(value)
	if err != nil {
		return "", fmt.Errorf("invalid endpoint %q: %w", value, err)
	}
	port, err := strconv.Atoi(u.Port())
	if err != nil || port < 1 || port > 65535 {
		return "", fmt.Errorf("invalid endpoint %q", value)
	}
	host := u.Hostname()
	if host == "" || host == "0.0.0.0" || host == "::" {
		host = "127.0.0.1"
	}
	return net.JoinHostPort(host, strconv.Itoa(port)), nil
}

func reachable(address string) bool {
	conn, err := net.DialTimeout("tcp", address, 500*time.Millisecond)
	if err != nil {
		return false
	}
	_ = conn.Close()
	return true
}

func waitReady(ctx context.Context, s *service, probe string, timeout time.Duration) error {
	ctx, cancel := context.WithTimeout(ctx, timeout)
	defer cancel()
	ticker := time.NewTicker(250 * time.Millisecond)
	defer ticker.Stop()
	for {
		select {
		case <-s.done:
			return fmt.Errorf("%s exited before becoming ready: %v", s.name, s.err)
		default:
		}
		check := exec.CommandContext(ctx, probe, "-addr="+s.endpoint, "-connect-timeout=500ms", "-rpc-timeout=500ms")
		if check.Run() == nil {
			fmt.Printf("%s ready at %s\n", s.name, s.endpoint)
			return nil
		}
		select {
		case <-ctx.Done():
			return fmt.Errorf("%s readiness: %w", s.name, ctx.Err())
		case <-ticker.C:
		}
	}
}

func shutdown(services []*service, wait time.Duration) {
	// Windows delivers console Ctrl+C to the children as well. Give them time
	// to finish graceful shutdown, then kill only processes owned by this run.
	if len(services) == 0 {
		return
	}
	fmt.Println("Waiting for services to flush logs and stop...")
	timer := time.NewTimer(wait)
	defer timer.Stop()
	for _, s := range services {
		select {
		case <-s.done:
		case <-timer.C:
			for _, remaining := range services {
				select {
				case <-remaining.done:
				default:
					fmt.Printf("Terminating %s (PID %d)\n", remaining.name, remaining.cmd.Process.Pid)
					_ = remaining.cmd.Process.Kill()
				}
			}
			for _, remaining := range services {
				<-remaining.done
			}
			return
		}
	}
}

func run(ctx context.Context, root string, services []*service, skipBuild bool, startup, stop time.Duration) error {
	if err := os.MkdirAll(filepath.Join(root, "logs"), 0755); err != nil {
		return err
	}
	checked := map[string]bool{}
	for _, s := range services {
		if !filepath.IsAbs(s.path) {
			s.path = filepath.Join(root, s.path)
		}
		data, err := os.ReadFile(s.path)
		if err != nil {
			return err
		}
		if err := json.Unmarshal(data, &s.config); err != nil {
			return fmt.Errorf("%s config: %w", s.name, err)
		}
		if s.config.Discovery.Provider != "consul" {
			return fmt.Errorf("%s: demo requires Consul discovery", s.name)
		}
		s.endpoint, err = endpoint(s.config.GRPC.Config.Listen)
		if err != nil {
			return fmt.Errorf("%s: %w", s.name, err)
		}
		for _, value := range []string{s.config.Redis.Config.Addr, s.config.Discovery.Config.Address} {
			if strings.TrimSpace(value) == "" {
				continue
			}
			address, err := endpoint(value)
			if err != nil {
				return err
			}
			if !checked[address] {
				if !reachable(address) {
					return fmt.Errorf("dependency unavailable at %s; start Redis and Consul with: docker compose up -d --wait redis consul", address)
				}
				checked[address] = true
			}
		}
	}
	for _, s := range services {
		if reachable(s.endpoint) {
			return fmt.Errorf("%s endpoint %s is already in use", s.name, s.endpoint)
		}
	}
	if !skipBuild {
		build := exec.CommandContext(ctx, "cmd.exe", "/d", "/c", "scripts\\build.bat")
		build.Dir, build.Stdout, build.Stderr = root, os.Stdout, os.Stderr
		if err := build.Run(); err != nil {
			return fmt.Errorf("build failed: %w", err)
		}
	}
	bin := filepath.Join(root, ".build", "bin")
	started := make([]*service, 0, len(services))
	defer func() { shutdown(started, stop) }()
	exited := make(chan *service, len(services))
	for _, s := range services {
		if err := ctx.Err(); err != nil {
			return err
		}
		s.cmd = exec.Command(filepath.Join(bin, s.name+".exe"), "-config", s.path,
			"-name", s.name, "-version", "1.0.0", "-instance", s.config.GRPC.Config.NodeID)
		s.cmd.Dir, s.cmd.Stdout, s.cmd.Stderr = root, os.Stdout, os.Stderr
		fmt.Printf("Starting %s...\n", s.name)
		if err := s.cmd.Start(); err != nil {
			return err
		}
		s.done = make(chan struct{})
		started = append(started, s)
		go func() {
			s.err = s.cmd.Wait()
			close(s.done)
			exited <- s
		}()
		if err := waitReady(ctx, s, filepath.Join(bin, "grpc-health-probe.exe"), startup); err != nil {
			return err
		}
	}
	fmt.Println("auth, logic, room and gate are ready. Run pnpm --dir web dev separately and open http://127.0.0.1:5173. Press Ctrl+C to stop.")
	select {
	case <-ctx.Done():
		return nil
	case s := <-exited:
		return fmt.Errorf("%s exited: %v", s.name, s.err)
	}
}

func main() {
	root := flag.String("Root", ".", "repository root")
	skipBuild := flag.Bool("SkipBuild", false, "skip building service executables")
	startup := flag.Int("StartupTimeoutSeconds", 30, "readiness timeout (1-300 seconds)")
	stop := flag.Int("ShutdownWaitSeconds", 40, "graceful shutdown timeout (1-300 seconds)")
	services := []*service{{name: "auth"}, {name: "logic"}, {name: "room"}, {name: "gate"}}
	for _, s := range services {
		flag.StringVar(&s.path, strings.ToUpper(s.name[:1])+s.name[1:]+"Config", "cmd/"+s.name+"/config.json", s.name+" config path")
	}
	flag.Parse()
	if flag.NArg() != 0 || *startup < 1 || *startup > 300 || *stop < 1 || *stop > 300 {
		fmt.Fprintln(os.Stderr, "Unexpected arguments or timeout outside 1-300 seconds")
		os.Exit(1)
	}
	ctx, cancel := signal.NotifyContext(context.Background(), os.Interrupt)
	defer cancel()
	if err := run(ctx, *root, services, *skipBuild, time.Duration(*startup)*time.Second, time.Duration(*stop)*time.Second); err != nil && !errors.Is(err, context.Canceled) {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}
}
