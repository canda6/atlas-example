// Package deps provides context accessors for shared infrastructure dependencies.
// Services own provider configuration and dependency assembly.
package deps

import (
	"context"

	"github.com/redis/go-redis/v9"
)

type redisKey struct{}

// WithRedis attaches an existing client without taking ownership of it.
// A nil client is a dependency assembly error.
func WithRedis(ctx context.Context, client *redis.Client) context.Context {
	if client == nil {
		panic("deps: cannot inject a nil Redis client")
	}
	return context.WithValue(ctx, redisKey{}, client)
}

// Redis returns the client injected by the service's startup code.
// It panics if the required dependency is missing from ctx.
func Redis(ctx context.Context) *redis.Client {
	client, ok := ctx.Value(redisKey{}).(*redis.Client)
	if !ok || client == nil {
		panic("deps: Redis client is not injected")
	}
	return client
}
