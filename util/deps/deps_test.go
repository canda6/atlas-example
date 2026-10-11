package deps_test

import (
	"context"
	"reflect"
	"testing"
	"time"

	"github.com/canda6/atlas-example/util/deps"
	"github.com/canda6/atlas/pkg/xlog"
	"github.com/redis/go-redis/v9"
	"go.opentelemetry.io/otel/trace"
)

func TestRedisInjectionPreservesRequestContext(t *testing.T) {
	first := redis.NewClient(&redis.Options{})
	second := redis.NewClient(&redis.Options{})
	t.Cleanup(func() {
		_ = first.Close()
		_ = second.Close()
	})
	parent, cancel := context.WithTimeout(context.Background(), time.Minute)
	defer cancel()
	root := deps.WithRedis(parent, first)
	request := deps.WithRedis(root, second)
	if deps.Redis(root) != first || deps.Redis(request) != second {
		t.Fatal("request override changed the parent dependency")
	}
	wantDeadline, _ := parent.Deadline()
	if deadline, ok := request.Deadline(); !ok || deadline != wantDeadline {
		t.Fatal("injection lost the request deadline")
	}
	cancel()
	if request.Err() != context.Canceled {
		t.Fatal("injection lost request cancellation")
	}
}

func TestLoggerPreservesAtlasTraceFields(t *testing.T) {
	span := trace.NewSpanContext(trace.SpanContextConfig{
		TraceID: trace.TraceID{1}, SpanID: trace.SpanID{2}, TraceFlags: trace.FlagsSampled,
	})
	logger := &fieldLogger{}
	ctx := deps.WithLogger(context.Background(), logger)
	if xlog.Logger(ctx) != logger {
		t.Fatal("WithLogger did not use the framework context key")
	}
	ctx = trace.ContextWithSpanContext(ctx, span)
	client := redis.NewClient(&redis.Options{})
	t.Cleanup(func() { _ = client.Close() })
	ctx = deps.WithRedis(ctx, client)
	got, ok := deps.Logger(ctx).(*fieldLogger)
	want := []xlog.Field{
		xlog.KV("trace_id", span.TraceID().String()),
		xlog.KV("span_id", span.SpanID().String()),
		xlog.KV("trace_sampled", true),
	}
	if !ok || !reflect.DeepEqual(got.fields, want) {
		t.Fatalf("Logger lost Atlas trace fields: %#v", got)
	}
}

type fieldLogger struct {
	xlog.NoopLogger
	fields []xlog.Field
}

func (l *fieldLogger) WithFields(fields ...xlog.Field) xlog.Interface {
	return &fieldLogger{fields: append(append([]xlog.Field(nil), l.fields...), fields...)}
}
