#!/bin/bash
echo "===========================> StartShellAgent  v.1.0.0  <==========================="

echo "=========> Source Miniconda and initialize Conda"
source "./miniconda/etc/profile.d/conda.sh"
conda init bash
echo "=========> Activate Conda environment 'shellagent'"
conda activate shellagent

echo "=========> Check which Python is being used"
which python

echo "=========> Change directory to ShellAgent"
cd ShellAgent

echo "=========> Start ShellAgent inside of the environment"
kill_server_on_port() {
    echo "=========>   Checking if a server is running on port $1..."
    server_pid=$(lsof -i :$1 | grep LISTEN | awk '{print $2}')
    if [ -n "$server_pid" ]; then
        echo "=========>   Server found with PID $server_pid. Killing server..."
        kill -9 $server_pid
        echo "=========>   Server on port $1 has been killed."
    else
        echo "=========>   No server is currently running on port $1."
    fi
}

while true; do
    # Check and kill any server running on port 8099
    kill_server_on_port 8099

    # Start the server
    export MYSHELL_KEY=OPENSOURCE_FIXED
    python servers/main.py &

    # Wait for the server to start
    sleep 10
    echo "=========> Open Browser"
    open http://127.0.0.1:8099

    # Wait for the server process to finish
    wait $!

    exit_code=$?
    if [ $exit_code -eq 42 ]; then
        echo "Restart signal detected, program will restart in 3 seconds..."
        sleep 3
    else
        echo "Program exited normally with exit code: $exit_code"
        break
    fi
done

echo "=========> Program has exited"
