@echo off
setlocal EnableExtensions DisableDelayedExpansion
set "PREPARE="
set "PROTOC=protoc.exe"
:args
if "%~1"=="" goto begin
if /i "%~1"=="-PrepareTools" (
    set "PREPARE=1"
    shift /1
    goto args
)
if /i "%~1"=="-Protoc" (
    if "%~2"=="" goto usage
    set "PROTOC=%~2"
    shift /1
    shift /1
    goto args
)
:usage
echo Usage: %~nx0 [-PrepareTools] [-Protoc path] 1>&2
exit /b 1
:begin
pushd "%~dp0.." || exit /b 1
set "TOOLS=%CD%\.build\codegen"
if defined PREPARE goto prepare
set "COMPILER="
for %%P in ("%PROTOC%") do if exist "%%~fP" set "COMPILER=%%~fP"
if not defined COMPILER for %%P in ("%PROTOC%") do set "COMPILER=%%~$PATH:P"
if not defined COMPILER (
    echo protoc not found; add its bin directory to PATH or pass -Protoc. 1>&2
    goto fail
)
for %%P in ("%COMPILER%") do set "PROTO_INCLUDE=%%~dpP..\include"
if not exist "%PROTO_INCLUDE%\google\protobuf\descriptor.proto" (
    echo protoc include directory missing; extract the complete distribution. 1>&2
    goto fail
)
for %%P in (go go-grpc go-register) do if not exist "%TOOLS%\protoc-gen-%%P.exe" (
    echo Plugins missing; run scripts\generate.bat -PrepareTools first. 1>&2
    goto fail
)
rem Only resolve already available modules and toolchains.
set "GOPROXY=off"
set "GOTOOLCHAIN=auto"
set "ATLAS="
for /f "delims=" %%D in ('go list -m -f "{{.Dir}}" github.com/canda6/atlas') do set "ATLAS=%%D"
if not defined ATLAS (
    echo Atlas unavailable locally; prepare dependencies or configure go.work. 1>&2
    goto fail
)
if not exist "%ATLAS%\pkg\proto\" goto fail
set "INPUTS=%TOOLS%\inputs-%RANDOM%-%RANDOM%.txt"
dir /b /s /on "proto\*.proto" > "%INPUTS%"
if errorlevel 1 goto inputfail
"%COMPILER%" "-I%CD%\proto" "-I%ATLAS%\pkg\proto" "-I%PROTO_INCLUDE%" ^
    "--plugin=protoc-gen-go=%TOOLS%\protoc-gen-go.exe" ^
    "--plugin=protoc-gen-go-grpc=%TOOLS%\protoc-gen-go-grpc.exe" ^
    --go_out=. --go_opt=module=github.com/canda6/atlas-example ^
    --go-grpc_out=. --go-grpc_opt=module=github.com/canda6/atlas-example ^
    "@%INPUTS%"
if errorlevel 1 goto inputfail
del /q "%INPUTS%"
rem Preserve the existing Room-only RPC and Push helper scope.
"%COMPILER%" "-I%CD%\proto" "-I%ATLAS%\pkg\proto" "-I%PROTO_INCLUDE%" ^
    "--plugin=protoc-gen-go-register=%TOOLS%\protoc-gen-go-register.exe" ^
    --go-register_out=. --go-register_opt=module=github.com/canda6/atlas-example ^
    room/server.proto room/push.proto
if errorlevel 1 goto fail
goto success
:prepare
set "GOOS=windows"
if not exist "%TOOLS%" mkdir "%TOOLS%"
if errorlevel 1 goto fail
go build -o "%TOOLS%\protoc-gen-go.exe" google.golang.org/protobuf/cmd/protoc-gen-go
if errorlevel 1 goto fail
go build -o "%TOOLS%\protoc-gen-go-grpc.exe" google.golang.org/grpc/cmd/protoc-gen-go-grpc
if errorlevel 1 goto fail
go build -o "%TOOLS%\protoc-gen-go-register.exe" github.com/canda6/atlas/tools/protoc-gen-go-register
if errorlevel 1 goto fail
echo Tools prepared. Run generate again without -PrepareTools.
:success
popd
exit /b 0
:fail
popd
exit /b 1
:inputfail
del /q "%INPUTS%"
goto fail
