# Testclient 最小账号闭环快速开始

新增五子棋验收：`docker compose run --rm testclient -addr ws://gate:8081/ws -mode duel`。
它用两个独立账号检查创建/加入、错误回合、五连获胜、再来一局、断线判负、顶号退出与重新建房，成功输出 `DUEL_SCENARIO PASS`。
前端在本机运行 `pnpm --dir web dev`，入口为 `http://127.0.0.1:5173`，使用两个不同账号即可手动对战。

本示例验证以下同一长连接流程：

```text
WebSocket 连接 Gate → Authenticate 自动创号/认证 → 绑定 user_id → Login → GetBags
```

## 1. 前置条件

整套服务容器部署后，可以直接运行 `docker compose run --rm testclient`，无需单独编译客户端。部署步骤见 [Docker 部署说明](docker-quickstart.md)。下面是业务程序在 Windows 宿主机运行时的调试流程，不要与容器中的业务服务同时启动。

- Go 版本满足本模块及所依赖的 Atlas 模块要求（当前最低 Go 1.25.0）。
- Docker + Docker Compose 可用。
- 以下命令均从 `atlas-example` 仓库根目录执行。

宿主机调试统一使用 Consul 和 Redis；请先按 [服务发现](discovery.md) 配置 Agent 可访问的 advertise 地址：

```powershell
docker compose up -d --wait redis consul
```

数据保存在 Docker volume 中；请使用唯一的 `account-id` 隔离测试账号。

## 2. 构建

```powershell
.\scripts\build.bat
```

`build.bat` 直接调用 Go 编译工具，不依赖 PowerShell。

构建成功后生成：

```text
.build\bin\auth.exe
.build\bin\logic.exe
.build\bin\room.exe
.build\bin\gate.exe
.build\bin\testclient.exe
```

## 3. 启动服务

推荐直接运行启动脚本；它会完成构建、依赖检查和服务就绪检查：

```powershell
.\scripts\start.bat
```

脚本读取 Auth、Logic、Room、Gate 各自的 `cmd/<服务>/config.json`。自定义配置可传入 `-AuthConfig`、`-LogicConfig`、`-RoomConfig`、`-GateConfig`，相对路径以仓库根目录为准。

`start.bat` 构建并调用 `scripts/start` 中的 Go 启动器，负责 JSON 配置解析、依赖与健康检查、子进程管理。保留 `-SkipBuild`、`-StartupTimeoutSeconds`、`-ShutdownWaitSeconds` 参数；`-SkipBuild` 仅跳过业务程序构建，启动器仍会编译。Ctrl+C 后等待服务退出，超过等待时间只终止本次启动的进程。

脚本自动创建 `logs/`；四个服务分别写入 `auth.log`、`logic.log`、`room.log`、`gate.log`，同时保留控制台输出。日志尚不支持自动轮转或清理。

默认不启用遥测。Consul Agent 必须能访问服务的 advertise 地址；Docker Agent 无法通过 localhost 访问宿主机程序，详见 [服务发现](discovery.md)。

默认端口：Gate WebSocket `8081`、本机前端 `5173`、Logic gRPC `9000`、Gate 控制面 `9001`、Auth `9002`、Room `9003`。使用网页前按 README 安装前端依赖并启动本机前端。
## 4. 自动验收

首次使用一个新账号：

```powershell
.\.build\bin\testclient.exe -mode basic -account-id demo-001
```

成功输出示例：

```text
AUTH success=true role_id=guest_demo-001
LOGIN success=true player_id=guest_demo-001
BAGS count=0
BASIC_SCENARIO PASS
```

再次使用相同账号执行同一命令，role ID 和 Player ID 应保持不变。

可选参数：

```text
-addr        Gate WebSocket URL，默认 ws://127.0.0.1:8081/ws
-channel     认证渠道，默认 guest
-sdk-token   透传给 Authenticate 的 SDK token
-timeout     连接和单次 RPC 超时，默认 15s
```

连接、RPC 或业务校验失败时，程序输出 `BASIC_SCENARIO FAIL` 并以退出码
1 结束；参数错误以退出码 2 结束。

## 5. 交互测试

不带参数启动时进入原有交互菜单：

```powershell
.\.build\bin\testclient.exe
```

依次选择 `Authenticate`、`Login`、`GetBags`。Authenticate 成功后，后续
命令直接回车即可使用保存的 Role ID。

## 6. 当前边界

- Gate 和 testclient 使用 WebSocket，默认直接连接 Gate `ws://127.0.0.1:8081/ws`。完成 WebSocket 握手后发送业务请求；每条 binary message 承载一个 Gate 消息体，不附加 TCP 四字节长度头。默认不压缩、不加密；远程部署可在入口终止 TLS，并使用 `wss://`。
- `sdk_token` 当前只透传，Auth 尚未接入第三方 SDK 验签。
- `game_token` 当前没有用于断线重连；本示例依赖 Authenticate 后在同一连接上
  绑定的不可变 `user_id`。
- 账号与 Token 存储在 Redis；背包目前只驻留 Logic Actor 内存，尚未接入
  DB 加载与保存，新玩家和 Logic 重启后均为空背包。
