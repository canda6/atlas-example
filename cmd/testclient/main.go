package main

import (
	"bufio"
	"errors"
	"flag"
	"fmt"
	"io"
	"os"
	"strings"
	"time"

	"github.com/canda6/atlas/gate/connection"
	"github.com/canda6/atlas/gate/protocol"
	"github.com/gorilla/websocket"
)

type options struct {
	mode      string
	addr      string
	accountID string
	channel   string
	sdkToken  string
	timeout   time.Duration
}

func main() {
	os.Exit(run(os.Args[1:], os.Stdout, os.Stderr))
}

func run(args []string, stdout, stderr io.Writer) int {
	opts, err := parseOptions(args, stderr)
	if err != nil {
		return 2
	}

	rpc, err := dial(opts.addr, opts.timeout)
	if err != nil {
		fmt.Fprintf(stderr, "connect gate failed: %v\n", err)
		return 1
	}
	defer rpc.Close()

	client := newGameClient(rpc, opts.timeout)
	switch opts.mode {
	case "duel":
		if err := runDuel(client, opts, stdout); err != nil {
			_, _ = fmt.Fprintf(stderr, "DUEL_SCENARIO FAIL: %v\n", err)
			return 1
		}
	case "basic":
		if err := runBasic(client, opts, stdout); err != nil {
			fmt.Fprintf(stderr, "BASIC_SCENARIO FAIL: %v\n", err)
			return 1
		}
	case "interactive":
		runInteractive(client, opts.addr, os.Stdin, stdout)
	}
	return 0
}

func parseOptions(args []string, stderr io.Writer) (options, error) {
	var opts options
	fs := flag.NewFlagSet("testclient", flag.ContinueOnError)
	fs.SetOutput(stderr)
	fs.StringVar(&opts.mode, "mode", "interactive", "client mode: interactive, basic or duel")
	fs.StringVar(&opts.addr, "addr", "ws://127.0.0.1:8081/ws", "Gate WebSocket URL")
	fs.StringVar(&opts.accountID, "account-id", "", "account id used by basic mode")
	fs.StringVar(&opts.channel, "channel", "guest", "authentication channel")
	fs.StringVar(&opts.sdkToken, "sdk-token", "", "SDK token passed to Authenticate")
	fs.DurationVar(&opts.timeout, "timeout", 15*time.Second, "connect and per-RPC timeout")
	if err := fs.Parse(args); err != nil {
		return options{}, err
	}
	if fs.NArg() != 0 {
		fmt.Fprintln(stderr, "testclient: positional arguments are not supported")
		return options{}, errors.New("unexpected positional arguments")
	}
	if opts.mode != "interactive" && opts.mode != "basic" && opts.mode != "duel" {
		fmt.Fprintf(stderr, "testclient: invalid -mode %q; want interactive, basic or duel\n", opts.mode)
		return options{}, errors.New("invalid mode")
	}
	if opts.mode == "basic" && strings.TrimSpace(opts.accountID) == "" {
		fmt.Fprintln(stderr, "testclient: -account-id is required in basic mode")
		return options{}, errors.New("missing account id")
	}
	if strings.TrimSpace(opts.addr) == "" {
		fmt.Fprintln(stderr, "testclient: -addr must not be empty")
		return options{}, errors.New("missing address")
	}
	if opts.timeout <= 0 {
		fmt.Fprintln(stderr, "testclient: -timeout must be positive")
		return options{}, errors.New("invalid timeout")
	}
	if opts.channel == "" {
		opts.channel = "guest"
	}
	return opts, nil
}

func dial(addr string, timeout time.Duration) (*referenceClient, error) {
	dialer := websocket.Dialer{HandshakeTimeout: timeout, Proxy: websocket.DefaultDialer.Proxy}
	raw, response, err := dialer.Dial(addr, nil)
	if err != nil {
		if response != nil && response.Body != nil {
			_ = response.Body.Close()
		}
		return nil, err
	}
	return newReferenceClient(connection.NewWSConn(raw), func(msg *protocol.Message) {
		fmt.Printf("Push: method=%s payload_bytes=%d\n", msg.Method, len(msg.Payload))
	}), nil
}

func runBasic(client *gameClient, opts options, out io.Writer) error {
	authResp, err := client.Authenticate(opts.sdkToken, opts.accountID, opts.channel)
	if err != nil {
		return err
	}
	fmt.Fprintf(out, "AUTH success=true role_id=%s\n", authResp.RoleId)

	loginResp, err := client.Login(authResp.RoleId)
	if err != nil {
		return err
	}
	if loginResp.Player.Id != authResp.RoleId {
		return fmt.Errorf("login player id %q does not match role id %q", loginResp.Player.Id, authResp.RoleId)
	}
	fmt.Fprintf(out, "LOGIN success=true player_id=%s\n", loginResp.Player.Id)

	bags, err := client.GetBags(authResp.RoleId)
	if err != nil {
		return err
	}
	fmt.Fprintf(out, "BAGS count=%d\n", len(bags.Items))
	fmt.Fprintln(out, "BASIC_SCENARIO PASS")
	return nil
}

func runInteractive(client *gameClient, addr string, input io.Reader, out io.Writer) {
	reader := bufio.NewReader(input)
	var savedRoleID string

	fmt.Fprintln(out, "=== Tsubasa Game Test Client ===")
	fmt.Fprintf(out, "Connected to Gate %s\n\n", addr)
	fmt.Fprintln(out, "首次使用流程:")
	fmt.Fprintln(out, "  [1] Authenticate → 输入 sdk_token account_id channel(可选)")
	fmt.Fprintln(out, "  [2] Login → 默认使用 Authenticate 返回的 role_id")
	fmt.Fprintln(out, "  [3] GetBags → 获取背包")

	for {
		fmt.Fprintln(out, "\nCommands:")
		fmt.Fprintln(out, "  1. Authenticate")
		fmt.Fprintln(out, "  2. Login")
		fmt.Fprintln(out, "  3. GetBags")
		fmt.Fprintln(out, "  q. Quit")
		line, ok := readLine(reader, out, ">")
		if !ok || line == "q" {
			return
		}

		switch line {
		case "1":
			sdkToken, _ := readLine(reader, out, "sdk_token:")
			accountID, _ := readLine(reader, out, "account_id:")
			channel, _ := readLine(reader, out, "channel [guest]:")
			resp, err := client.Authenticate(sdkToken, accountID, channel)
			if err != nil {
				fmt.Fprintf(out, "Authenticate failed: %v\n", err)
				continue
			}
			savedRoleID = resp.RoleId
			fmt.Fprintf(out, "Authenticate: success=true role_id=%s saved for later use\n", resp.RoleId)
		case "2":
			userID, _ := readLine(reader, out, "user_id [Enter=use saved]:")
			userID = defaultUserID(userID, savedRoleID)
			if userID == "" {
				fmt.Fprintln(out, "no user_id provided and no saved role_id from Authenticate")
				continue
			}
			resp, err := client.Login(userID)
			if err != nil {
				fmt.Fprintf(out, "Login failed: %v\n", err)
				continue
			}
			p := resp.Player
			fmt.Fprintf(out, "Login: player{id=%s name=%s}\n", p.Id, p.Name)
		case "3":
			userID, _ := readLine(reader, out, "user_id [Enter=use saved]:")
			userID = defaultUserID(userID, savedRoleID)
			if userID == "" {
				fmt.Fprintln(out, "no user_id")
				continue
			}
			resp, err := client.GetBags(userID)
			if err != nil {
				fmt.Fprintf(out, "GetBags failed: %v\n", err)
				continue
			}
			fmt.Fprintf(out, "Bags: %d items\n", len(resp.Items))
			for _, item := range resp.Items {
				fmt.Fprintf(out, "  item_id=%d count=%d\n", item.ItemId, item.Count)
			}
		default:
			fmt.Fprintln(out, "unknown command, enter 1-3 or q")
		}
	}
}

func readLine(reader *bufio.Reader, out io.Writer, label string) (string, bool) {
	fmt.Fprint(out, label+" ")
	line, err := reader.ReadString('\n')
	if err != nil && !errors.Is(err, io.EOF) {
		return "", false
	}
	line = strings.TrimSpace(line)
	return line, err == nil || line != ""
}

func defaultUserID(userID, savedRoleID string) string {
	if userID == "" {
		return savedRoleID
	}
	return userID
}
