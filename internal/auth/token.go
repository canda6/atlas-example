package auth

import (
	"context"
	"crypto/rand"
	"encoding/hex"
	"fmt"
	"time"

	"github.com/canda6/atlas-example/internal/auth/dao"
)

const tokenTTL = 24 * time.Hour

func createToken(ctx context.Context, roleID string) (string, error) {
	b := make([]byte, 32)
	if _, err := rand.Read(b); err != nil {
		return "", fmt.Errorf("rand: %w", err)
	}
	token := hex.EncodeToString(b)
	if err := dao.SaveToken(ctx, token, roleID, tokenTTL); err != nil {
		return "", err
	}
	return token, nil
}
