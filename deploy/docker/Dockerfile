# Compile Linux binaries with scripts/build.bat -TargetOS linux before building.
FROM alpine:3.22@sha256:5291449c3df73caf6ed85e649dec1b9e818b39a5d8c871e97afc13e9cd5e8fa8
WORKDIR /app
RUN mkdir -p /app/logs /app/config && chown 1000:1000 /app/logs
COPY .build/docker/bin/auth .build/docker/bin/logic .build/docker/bin/room .build/docker/bin/gate .build/docker/bin/testclient .build/docker/bin/grpc-health-probe /app/
RUN chmod 0755 /app/auth /app/logic /app/room /app/gate /app/testclient /app/grpc-health-probe
USER 1000:1000
CMD ["/app/gate", "-config", "/app/config/gate.json", "-name", "gate", "-instance", "gate-docker-1"]
