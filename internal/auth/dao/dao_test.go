package dao_test

import (
	"context"
	"errors"
	"fmt"
	"reflect"
	"sync"
	"testing"
	"time"

	"github.com/alicebob/miniredis/v2"
	"github.com/canda6/atlas-example/internal/auth/dao"
	"github.com/canda6/atlas-example/util/deps"
	"github.com/redis/go-redis/v9"
)

func TestLookupsUseRequestDependencies(t *testing.T) {
	lookups := []struct {
		name         string
		get          func(context.Context) (string, error)
		key          string
		missingError error
	}{
		{"account", func(ctx context.Context) (string, error) { return dao.GetRoleIDByAccount(ctx, "guest", "alice") }, "account:guest:alice", nil},
		{"token", func(ctx context.Context) (string, error) { return dao.GetRoleIDByToken(ctx, "ticket") }, "token:ticket", nil},
	}
	storageErr := errors.New("storage unavailable")
	for _, lookup := range lookups {
		t.Run(lookup.name, func(t *testing.T) {
			for _, replyErr := range []error{nil, redis.Nil, storageErr} {
				var request context.Context
				called := false
				client := hookedClient(t, func(ctx context.Context, cmd redis.Cmder) error {
					called = true
					if ctx != request || !reflect.DeepEqual(cmd.Args(), []any{"get", lookup.key}) {
						t.Fatalf("unexpected request context or command: %v", cmd.Args())
					}
					if replyErr == nil {
						cmd.(*redis.StringCmd).SetVal("stored-value")
					}
					return replyErr
				})
				request = deps.WithRedis(context.Background(), client)
				value, err := lookup.get(request)
				wantErr := replyErr
				wantValue := ""
				if errors.Is(replyErr, redis.Nil) {
					wantErr = lookup.missingError
				} else if replyErr == nil {
					wantValue = "stored-value"
				}
				if !called || !errors.Is(err, wantErr) || value != wantValue {
					t.Fatalf("lookup = (%q, %v), want (%q, %v); called=%v", value, err, wantValue, wantErr, called)
				}
			}
		})
	}
}

func TestWritesPreserveStorageFormatAndErrors(t *testing.T) {
	storageErr := errors.New("storage unavailable")
	cases := []struct {
		name  string
		write func(context.Context) error
		args  []any
	}{
		{"token", func(ctx context.Context) error { return dao.SaveToken(ctx, "ticket", "role-1", 24*time.Hour) }, []any{"set", "token:ticket", "role-1", "ex", int64(86400)}},
		{"revoke", func(ctx context.Context) error { return dao.DeleteToken(ctx, "ticket") }, []any{"del", "token:ticket"}},
	}
	for _, tc := range cases {
		t.Run(tc.name, func(t *testing.T) {
			client := hookedClient(t, func(_ context.Context, cmd redis.Cmder) error {
				if !reflect.DeepEqual(cmd.Args(), tc.args) {
					t.Fatalf("command = %v, want %v", cmd.Args(), tc.args)
				}
				return storageErr
			})
			if err := tc.write(deps.WithRedis(context.Background(), client)); !errors.Is(err, storageErr) {
				t.Fatalf("storage error was lost: %v", err)
			}
		})
	}
}

type commandHook struct {
	process redis.ProcessHook
}

func (h commandHook) DialHook(next redis.DialHook) redis.DialHook       { return next }
func (h commandHook) ProcessHook(_ redis.ProcessHook) redis.ProcessHook { return h.process }
func (h commandHook) ProcessPipelineHook(next redis.ProcessPipelineHook) redis.ProcessPipelineHook {
	return next
}

func hookedClient(t *testing.T, process redis.ProcessHook) *redis.Client {
	t.Helper()
	client := redis.NewClient(&redis.Options{})
	client.AddHook(commandHook{process: process})
	t.Cleanup(func() { _ = client.Close() })
	return client
}

func TestGetOrCreateRoleIDPreservesMapping(t *testing.T) {
	for _, existing := range []string{"", "existing-role"} {
		t.Run(fmt.Sprintf("existing=%q", existing), func(t *testing.T) {
			server := miniredis.RunT(t)
			const key = "account:guest:alice"
			if existing != "" {
				if err := server.Set(key, existing); err != nil {
					t.Fatal(err)
				}
			}
			ctx := deps.WithRedis(t.Context(), accountTestClient(t, server))
			want := existing
			if want == "" {
				want = "candidate-role"
			}
			for _, candidate := range []string{"candidate-role", "retry-role"} {
				got, err := dao.GetOrCreateRoleID(ctx, "guest", "alice", candidate)
				if err != nil || got != want {
					t.Fatalf("get or create = (%q, %v), want (%q, nil)", got, err, want)
				}
			}
			stored, err := server.Get(key)
			if err != nil || stored != want || server.TTL(key) != 0 {
				t.Fatalf("mapping = (%q, %v), ttl=%v; want persistent %q", stored, err, server.TTL(key), want)
			}
		})
	}
}

func TestGetOrCreateRoleIDConcurrentCandidates(t *testing.T) {
	server := miniredis.RunT(t)
	ctx, cancel := context.WithTimeout(t.Context(), 10*time.Second)
	defer cancel()
	// Independent clients exercise coordination in storage, not in one client.
	contexts := make([]context.Context, 4)
	for i := range contexts {
		contexts[i] = deps.WithRedis(ctx, accountTestClient(t, server))
	}
	const workers = 64
	type result struct {
		roleID string
		err    error
	}
	results := make(chan result, workers)
	start := make(chan struct{})
	candidates := make(map[string]bool, workers)
	for i := range workers {
		candidate := fmt.Sprintf("candidate-%d", i)
		candidates[candidate] = true
		go func() {
			<-start
			roleID, err := dao.GetOrCreateRoleID(contexts[i%len(contexts)], "guest", "alice", candidate)
			results <- result{roleID, err}
		}()
	}
	close(start)
	var winner string
	for range workers {
		got := <-results
		if got.err != nil {
			t.Errorf("get or create: %v", got.err)
			continue
		}
		if !candidates[got.roleID] {
			t.Errorf("unexpected role ID %q", got.roleID)
		}
		if winner == "" {
			winner = got.roleID
		}
		if got.roleID != winner {
			t.Errorf("concurrent request returned %q, want %q", got.roleID, winner)
		}
	}
	stored, err := server.Get("account:guest:alice")
	if err != nil || stored != winner || len(server.Keys()) != 1 {
		t.Fatalf("stored mapping = (%q, %v), keys=%v; want %q", stored, err, server.Keys(), winner)
	}
}

func TestGetOrCreateRoleIDRetryAfterLostReply(t *testing.T) {
	server := miniredis.RunT(t)
	client := accountTestClient(t, server)
	client.AddHook(&lostAccountReplyHook{})
	ctx := deps.WithRedis(t.Context(), client)
	got, err := dao.GetOrCreateRoleID(ctx, "guest", "alice", "first-role")
	if !errors.Is(err, context.DeadlineExceeded) || got != "" {
		t.Fatalf("lost reply = (%q, %v), want empty ID and deadline exceeded", got, err)
	}
	// A reconnect can use a different client and propose a different ID.
	retryCtx := deps.WithRedis(t.Context(), accountTestClient(t, server))
	got, err = dao.GetOrCreateRoleID(retryCtx, "guest", "alice", "retry-role")
	if err != nil || got != "first-role" {
		t.Fatalf("retry = (%q, %v), want (first-role, nil)", got, err)
	}
}

func TestGetOrCreateRoleIDStorageFailure(t *testing.T) {
	server := miniredis.RunT(t)
	server.SetError("ERR storage unavailable")
	ctx := deps.WithRedis(t.Context(), accountTestClient(t, server))
	got, err := dao.GetOrCreateRoleID(ctx, "guest", "alice", "candidate-role")
	if err == nil || got != "" {
		t.Fatalf("storage failure = (%q, %v), want empty ID and error", got, err)
	}
}

func accountTestClient(t *testing.T, server *miniredis.Miniredis) *redis.Client {
	t.Helper()
	client := redis.NewClient(&redis.Options{Addr: server.Addr(), MaxRetries: -1})
	t.Cleanup(func() { _ = client.Close() })
	return client
}

// Simulate a committed write whose reply did not reach the caller.
type lostAccountReplyHook struct {
	once sync.Once
}

func (h *lostAccountReplyHook) DialHook(next redis.DialHook) redis.DialHook { return next }
func (h *lostAccountReplyHook) ProcessPipelineHook(next redis.ProcessPipelineHook) redis.ProcessPipelineHook {
	return next
}
func (h *lostAccountReplyHook) ProcessHook(next redis.ProcessHook) redis.ProcessHook {
	return func(ctx context.Context, cmd redis.Cmder) error {
		err := next(ctx, cmd)
		if cmd.Name() == "set" && (err == nil || errors.Is(err, redis.Nil)) {
			h.once.Do(func() { err = context.DeadlineExceeded })
		}
		return err
	}
}
