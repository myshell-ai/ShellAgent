@echo off
setlocal
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

cd /d %~dp0
cd ShellAgent

set PATH=..\git\bin;%PATH%
set MYSHELL_KEY=OPENSOURCE_FIXED

git config --global core.longpaths true

if not exist "output" (
    mkdir "output"
)

..\python_embeded\python.exe -m pip install -e .
..\python_embeded\python.exe servers\main.py

pause