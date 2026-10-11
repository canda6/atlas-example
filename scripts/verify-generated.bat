@echo off
setlocal EnableExtensions DisableDelayedExpansion
pushd "%~dp0.." || exit /b 1
if not exist ".build\codegen" mkdir ".build\codegen"
if errorlevel 1 goto fail
set "BEFORE=%CD%\.build\codegen\before-%RANDOM%-%RANDOM%.txt"
set "AFTER=%CD%\.build\codegen\after-%RANDOM%-%RANDOM%.txt"
call :snapshot > "%BEFORE%"
if errorlevel 1 goto fail
call "%~dp0generate.bat" %*
if errorlevel 1 goto fail
call :snapshot > "%AFTER%"
if errorlevel 1 goto fail
fc /b "%BEFORE%" "%AFTER%" >nul
if errorlevel 1 (
    echo Generated files changed; review and commit the updated files. 1>&2
    goto fail
)
echo Generated files are up to date.
set "RESULT=0"
goto cleanup
:fail
set "RESULT=1"
:cleanup
if defined BEFORE if exist "%BEFORE%" del /q "%BEFORE%"
if defined AFTER if exist "%AFTER%" del /q "%AFTER%"
popd
exit /b %RESULT%
:snapshot
for /f "delims=" %%F in ('dir /b /s /on "gen\proto\go\*.go"') do (
    echo %%F
    certutil -hashfile "%%F" SHA256
    if errorlevel 1 exit /b 1
)
exit /b 0
