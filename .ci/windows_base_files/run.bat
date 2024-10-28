@echo off
setlocal enabledelayedexpansion
chcp 65001 >nul
:: Check for administrator privileges

:: Attempt to create a directory in the system folder, which requires admin privileges
mkdir "%windir%\System32\dummy" >nul 2>&1

:: Check if the last operation was successful
if '%errorlevel%' == '0' (
    :: Remove the created directory
    rmdir "%windir%\System32\dummy"
) else (
    echo Please run as administrator. 请以管理员方式运行
    pause
    exit /b
)

:start
cd /d %~dp0
cd ShellAgent

:: Add self-update functionality
if exist ".ci\windows_base_files\run.bat" (
    fc /b "%~f0" ".ci\windows_base_files\run.bat" > nul
    if errorlevel 1 (
        echo Detected new version of run.bat, updating...
        copy /Y ".ci\windows_base_files\run.bat" "%~f0"
        echo Update complete. Restarting...
        start "" "%~f0"
        exit
    ) else (
        echo run.bat is already up to date. No update needed.
    )
)

set PATH=..\git\bin;%PATH%
set MYSHELL_KEY=OPENSOURCE_FIXED
set PLAYWRIGHT_BROWSERS_PATH=..\python_embeded\playwright_browsers

git config --global core.longpaths true

if not exist "output" (
    mkdir "output"
)

..\python_embeded\python.exe -m pip install -e .
..\python_embeded\python.exe -m playwright install chromium
..\python_embeded\python.exe servers\main.py

if %errorlevel% equ 42 (
    echo Restart signal detected, program will restart in 3 seconds...
    timeout /t 3 >nul
    goto start
) else (
    echo Program has exited, press any key to close the window...
    pause >nul
    exit /b
)

pause