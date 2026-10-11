@echo off
setlocal EnableExtensions DisableDelayedExpansion
pushd "%~dp0.." || exit /b 1
set "GOOS=windows"
if not exist ".build\bin" mkdir ".build\bin"
if errorlevel 1 goto fail
go build -trimpath -buildvcs=false -o ".build\bin\atlas-start.exe" ./scripts/start
if errorlevel 1 goto fail
".build\bin\atlas-start.exe" -Root "%CD%" %*
set "RESULT=%ERRORLEVEL%"
popd
exit /b %RESULT%
:fail
popd
exit /b 1
