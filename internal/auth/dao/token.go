package dao

import (
	"context"
	"errors"
	"time"

	"github.com/canda6/atlas-example/util/deps"
	"github.com/redis/go-redis/v9"
)

func tokenKey(token string) string {
	return "token:" + token
}

func SaveToken(ctx context.Context, token, roleID string, ttl time.Duration) error {
	return deps.Redis(ctx).Set(ctx, tokenKey(token), roleID, ttl).Err()
}

func GetRoleIDByToken(ctx context.Context, token string) (string, error) {
	roleID, err := deps.Redis(ctx).Get(ctx, tokenKey(token)).Result()
	if errors.Is(err, redis.Nil) {
		return "", nil
	}
	return roleID, err
}

func DeleteToken(ctx context.Context, token string) error {
	return deps.Redis(ctx).Del(ctx, tokenKey(token)).Err()
}
