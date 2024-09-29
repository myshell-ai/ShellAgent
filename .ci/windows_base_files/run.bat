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

:start
cd /d %~dp0
cd ShellAgent

del "proconfig\widgets\imagen_widgets\library\comfy_custom_nodes\ComfyUI_FizzNodes\javascript\Folder here to satisfy init, eventually I'll have stuff in here..txt"

set PATH=..\git\bin;%PATH%
set MYSHELL_KEY=OPENSOURCE_FIXED

git config --global core.longpaths true

if not exist "output" (
    mkdir "output"
)

if not exist "servers\web" (
    mkdir "servers\web"
)

if not exist "models\model_status.json" (
    echo {} > "models\model_status.json"
)

..\python_embeded\python.exe -m pip install -e .
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