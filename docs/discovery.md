# Consul 服务发现

Demo 固定为单节点，Auth、Logic、Room、Gate 各一个实例；本地调试和 Docker 部署统一使用 Consul，不提供 Static 切换。

四个入口空导入 `github.com/canda6/atlas/registry/consul`，通过各自完整配置的 `Discovery.Config` 创建发现连接。业务 RPC 仍使用生成的服务函数。

## Docker

按 [部署说明](docker-quickstart.md) 构建，运行 `docker compose up -d --wait`。Consul 位于 `consul:8500`，宿主机 UI 为 `http://localhost:18500`。服务地址分别为 Auth `auth:9002`、Logic `logic:9000`、Room `room:9003`、Gate `gate:9001`。

每个服务的客户端/内部服务名共用该进程的 NodeID。服务通过标准 gRPC Health 检查，Auth 就绪检查还包含 Redis。使用 `docker compose run --rm testclient -addr ws://gate:8081/ws -mode duel` 验收真实调用链。

## 宿主机调试

先停止容器中的业务进程，保留 Redis 和 Consul，再运行 `scripts/start.bat`。脚本检查配置必须使用 Consul，按顺序启动四个业务进程。

配置中的默认 Consul 地址为 `127.0.0.1:18500`。**如果 Consul Agent 在容器中，默认 advertise 的 localhost 不可直接用于健康检查**：改成 Agent 和宿主机程序都可访问的宿主机地址，端口保持对应的 9000–9003。也可以使用本机运行的 Consul Agent，并调整 Discovery 地址。不要同时启动两套使用相同 NodeID 的业务服务。

正常退出注销服务；异常停止后，以原 NodeID 重启。不删除 Redis 数据卷来修复服务发现问题。本 Demo 不实现 Actor 跨节点迁移或故障接管。
