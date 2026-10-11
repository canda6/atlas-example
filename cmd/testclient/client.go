package main

import (
	"context"
	"fmt"
	"net"
	"sync"
	"sync/atomic"

	"github.com/canda6/atlas/gate/connection"
	"github.com/canda6/atlas/gate/protocol"
	"google.golang.org/protobuf/proto"
)

type callResult struct {
	message *protocol.Message
	err     error
}

type referenceClient struct {
	conn    connection.Conn
	nextID  atomic.Uint64
	writeMu sync.Mutex
	mu      sync.Mutex
	pending map[uint64]chan callResult
	done    chan struct{}
	onPush  func(*protocol.Message)
	once    sync.Once
}

// onPush receives an independently stored message and may retain it read-only.
func newReferenceClient(conn connection.Conn, onPush func(*protocol.Message)) *referenceClient {
	client := &referenceClient{conn: conn, pending: make(map[uint64]chan callResult), done: make(chan struct{}), onPush: onPush}
	go client.readLoop()
	return client
}

// Call returns an independently stored response that may be retained read-only.
func (c *referenceClient) Call(ctx context.Context, method string, request proto.Message) (*protocol.Message, error) {
	if err := context.Cause(ctx); err != nil {
		return nil, err
	}
	payload, err := proto.Marshal(request)
	if err != nil {
		return nil, err
	}
	requestID := c.nextID.Add(1)
	result := make(chan callResult, 1)
	c.mu.Lock()
	select {
	case <-c.done:
		c.mu.Unlock()
		return nil, net.ErrClosed
	default:
	}
	c.pending[requestID] = result
	c.mu.Unlock()
	defer func() {
		c.mu.Lock()
		delete(c.pending, requestID)
		c.mu.Unlock()
	}()
	c.writeMu.Lock()
	err = c.conn.WriteMessages(&protocol.Message{Kind: protocol.KindRequest, RequestID: requestID, Method: method, Payload: payload})
	c.writeMu.Unlock()
	if err != nil {
		return nil, err
	}
	select {
	case response := <-result:
		return response.message, response.err
	case <-ctx.Done():
		return nil, context.Cause(ctx)
	case <-c.done:
		// A peer may close immediately after its final response. Preserve an
		// already delivered result even when both select cases are ready.
		select {
		case response := <-result:
			return response.message, response.err
		default:
			return nil, net.ErrClosed
		}
	}
}

func (c *referenceClient) readLoop() {
	for {
		message, err := c.conn.ReadMessage()
		if err != nil {
			c.fail(err)
			return
		}
		switch message.Kind {
		case protocol.KindResponse:
			c.mu.Lock()
			result := c.pending[message.RequestID]
			if result != nil {
				// Remove before delivery: duplicate and late responses are discarded,
				// and a buffered result can never block the shared read loop.
				delete(c.pending, message.RequestID)
				if message.Code != 0 {
					result <- callResult{err: fmt.Errorf("response failed: status=%d code=%d", message.Status, message.Code)}
				} else {
					result <- callResult{message: message}
				}
			}
			c.mu.Unlock()
		case protocol.KindPush:
			if c.onPush != nil {
				c.onPush(message)
			}
		case protocol.KindPong:
			// No pending business call is associated with a heartbeat.
		default:
			err := fmt.Errorf("unexpected message kind %d", message.Kind)
			c.fail(err)
			return
		}
	}
}

func (c *referenceClient) fail(err error) {
	c.once.Do(func() {
		_ = c.conn.Close()
		close(c.done)
		c.mu.Lock()
		for _, pending := range c.pending {
			select {
			case pending <- callResult{err: err}:
			default:
			}
		}
		clear(c.pending)
		c.mu.Unlock()
	})
}

func (c *referenceClient) Close() error {
	err := c.conn.Close()
	c.fail(net.ErrClosed)
	return err
}
