@echo off
setlocal EnableExtensions DisableDelayedExpansion
set "FIX="
if "%~1"=="" goto begin
if /i not "%~1"=="-Fix" goto usage
if not "%~2"=="" goto usage
set "FIX=--fix"
goto begin
:usage
echo Usage: %~nx0 [-Fix] 1>&2
exit /b 1
:begin
pushd "%~dp0.." || exit /b 1
set "LINTER="
for %%P in (golangci-lint.exe) do set "LINTER=%%~$PATH:P"
if not defined LINTER for /f "delims=" %%P in ('go env GOPATH') do if exist "%%P\bin\golangci-lint.exe" set "LINTER=%%P\bin\golangci-lint.exe"
if not defined LINTER (
    echo golangci-lint not found. 1>&2
    popd
    exit /b 1
)
"%LINTER%" run --allow-serial-runners --config ".golangci.yml" %FIX% ./...
set "RESULT=%ERRORLEVEL%"
popd
exit /b %RESULT%
