@echo off
setlocal EnableExtensions DisableDelayedExpansion
set "TARGET=windows"
if "%~1"=="" goto begin
if /i not "%~1"=="-TargetOS" goto usage
if not "%~3"=="" goto usage
if /i "%~2"=="linux" (set "TARGET=linux") else if /i not "%~2"=="windows" goto usage
goto begin
:usage
echo Usage: %~nx0 [-TargetOS windows^|linux] 1>&2
exit /b 1
:begin
pushd "%~dp0.." || exit /b 1
set "GOOS=%TARGET%"
set "OUT=.build\bin"
set "EXT=.exe"
if "%TARGET%"=="linux" (
    set "CGO_ENABLED=0"
    set "OUT=.build\docker\bin"
    set "EXT="
    if not exist logs mkdir logs
)
if not exist "%OUT%" mkdir "%OUT%"
if errorlevel 1 goto fail
for %%S in (auth logic room gate testclient) do (
    go build -trimpath -buildvcs=false -o "%OUT%\%%S%EXT%" ./cmd/%%S
    if errorlevel 1 goto fail
)
go build -trimpath -buildvcs=false -o "%OUT%\grpc-health-probe%EXT%" github.com/grpc-ecosystem/grpc-health-probe
if errorlevel 1 goto fail
popd
exit /b 0
:fail
popd
exit /b 1
