# 本机 Docker Compose 部署

在仓库根目录运行：

```powershell
docker compose up -d
```

启动 Auth、Logic、Room、Gate、Redis、Consul 六个服务。默认不配置 `Telemetry`，不启动观测组件，日志写入控制台和根目录 `logs/`。去掉 `-d` 可在前台运行并查看日志。

## 首次构建与更新

首次部署按以下顺序准备生成工具、生成协议、编译 Linux 程序并打包镜像；仅修改 Go 代码时可跳过前两步：

```powershell
.\scripts\generate.bat -PrepareTools # 首次使用或工具依赖/源码更新时执行
.\scripts\generate.bat
.\scripts\build.bat -TargetOS linux
docker compose build gate
docker compose up -d
```

构建脚本将五个程序及 Health 探针输出到 `.build/docker/bin/` 并创建 `logs/`。本机需安装 Go 和 protoc（完整发行包的 bin 加入 PATH），配置好私有 Atlas 依赖的访问权限；构建沿用现有 Go 工作区，不在 Docker 内下载 Go 依赖。目标 CPU 架构使用当前 Go 配置，本机与 Docker 均为 amd64。

Dockerfile 只打包后端程序，不包含网页。网页在本机执行 `pnpm --dir web install --frozen-lockfile`、`pnpm --dir web dev`，然后打开 `http://127.0.0.1:5173`；浏览器直接连接 Gate 8081。Compose 将各服务的 `cmd/<服务>/config.docker.json` 只读挂载到 `/app/config/<服务>.json`，配置文件必须存在。修改配置内容后重启业务服务即可，无需重新编译或打包：

```powershell
docker compose restart auth logic room gate
```

服务在启动时读取配置，不会自动热加载。如果修改的是 `compose.yaml` 或 `.env` 中的挂载路径、端口等容器设置，执行 `docker compose up -d` 更新容器。

本机 Windows CLI 连接 WSL Docker，需要在根目录 `.env` 指定 Docker 能访问的挂载路径，本机已配置：

```dotenv
ATLAS_LOG_DIR=/mnt/d/Projects/atlas-example/logs
ATLAS_CONFIG_DIR=/mnt/d/Projects/atlas-example/cmd
```

`.env` 不提交到 Git。迁移目录时更新这两个路径；普通 Docker Desktop 或 Linux 环境可省略，默认使用 `./logs` 和 `./cmd`。Linux 上提前创建 `logs/` 并确保容器用户可写、配置文件可读；默认 UID/GID 为 `1000:1000`，可通过 `ATLAS_UID`、`ATLAS_GID` 调整。

## 日常操作

```powershell
docker compose ps
docker compose logs -f --tail 100
docker compose run --rm testclient
docker compose down
```

客户端验证认证、登录和背包查询，成功输出 `BASIC_SCENARIO PASS`。它是临时容器，不随 `up` 常驻启动。

## 端口与数据

| 用途 | 宿主机地址 | 容器网络地址 |
| --- | --- | --- |
| Gate WebSocket | `127.0.0.1:8081` | `gate:8081/ws` |
| 网页（本机 Vite） | `127.0.0.1:5173` | 不在容器中运行 |
| Redis | `127.0.0.1:16379` | `redis:6379`，DB 2 |
| Consul | `127.0.0.1:18500` | `consul:8500` |
| 服务 gRPC | 不映射 | Auth `9002`、Logic `9000`、Room `9003`、Gate `9001` |

- Compose 按健康检查顺序启动依赖和服务，业务健康检查调用标准 gRPC Health Check；停止时留出 45 秒优雅退出时间。
- 日志追加到 `logs/auth.log`、`logs/logic.log`、`logs/gate.log`，文件暂不自动轮转。Docker 的标准输出日志单独限制为每容器 3 个文件、每个 10 MB。
- Redis、Consul 使用命名卷，`down` 保留数据；`docker compose down -v` 会删除这些卷中的数据。
- 当前固定为每种业务服务一个实例。背包仅在内存中，Logic 重启后为空。
- 宿主机调试时，先停止容器业务服务，再执行 `docker compose up -d --wait redis consul` 和 `scripts/start.bat`。
