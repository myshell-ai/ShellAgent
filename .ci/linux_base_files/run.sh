#!/bin/bash

SHELLAGENT_ENV=shell_agent

# Function to check if conda is installed and find conda.sh
find_conda_sh() {
    local possible_paths=(
        "$HOME/miniconda/etc/profile.d/conda.sh"
        "$HOME/anaconda3/etc/profile.d/conda.sh"
        "$HOME/opt/miniconda3/etc/profile.d/conda.sh"
        "$HOME/opt/anaconda3/etc/profile.d/conda.sh"
        "$CONDA_PREFIX/../../etc/profile.d/conda.sh"
    )
    
    for path in "${possible_paths[@]}"; do
        if [ -f "$path" ]; then
            echo "Conda.sh found at $path"
            CONDA_SH_PATH=$path
            return 0
        fi
    done
    return 1
}

# Function to initialize conda for the current shell session
initialize_conda() {
    if [ -z "$CONDA_SH_PATH" ]; then
        echo "Error: CONDA_SH_PATH is not set. Cannot initialize Conda."
        exit 1
    fi
    source "$CONDA_SH_PATH"
    eval "$(conda shell.bash hook)"
    echo "Activating the '$SHELLAGENT_ENV' environment..."
    conda activate $SHELLAGENT_ENV
}

# Main script execution
find_conda_sh
initialize_conda
echo "activate python from $(which python)"

cd ShellAgent
python servers/main.py