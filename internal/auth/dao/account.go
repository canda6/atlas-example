package dao

import (
	"context"
	"errors"

	"github.com/canda6/atlas-example/util/deps"
	"github.com/redis/go-redis/v9"
)

func accountKey(channel, accountID string) string {
	return "account:" + channel + ":" + accountID
}

func GetRoleIDByAccount(ctx context.Context, channel, accountID string) (string, error) {
	roleID, err := deps.Redis(ctx).Get(ctx, accountKey(channel, accountID)).Result()
	if errors.Is(err, redis.Nil) {
		return "", nil
	}
	return roleID, err
}

// GetOrCreateRoleID atomically binds an account once and returns its stored role ID.
// SET NX GET requires Redis 7.0 or later; account mappings do not expire.
func GetOrCreateRoleID(ctx context.Context, channel, accountID, candidateRoleID string) (string, error) {
	roleID, err := deps.Redis(ctx).SetArgs(ctx, accountKey(channel, accountID), candidateRoleID, redis.SetArgs{
		Mode: "NX",
		Get:  true,
	}).Result()
	if errors.Is(err, redis.Nil) {
		// No previous value means this call created the mapping.
		return candidateRoleID, nil
	}
	if err != nil {
		return "", err
	}
	return roleID, nil
}
