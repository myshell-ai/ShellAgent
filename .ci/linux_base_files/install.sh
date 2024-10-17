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
    
    echo "Conda.sh not found in standard locations. Checking environment variable CUSTOM_CONDA_PATH..."
    if [ -n "$CUSTOM_CONDA_PATH" ]; then
        CONDA_SH_PATH="$CUSTOM_CONDA_PATH/etc/profile.d/conda.sh"
        if [ -f "$CONDA_SH_PATH" ]; then
            echo "Conda.sh found at $CONDA_SH_PATH"
            return 0
        else
            echo "Conda.sh not found at $CONDA_SH_PATH. Please check your CUSTOM_CONDA_PATH."
        fi
    else
        echo "Conda.sh not found. Conda may not be installed."
    fi
    return 1
}

# Function to check if conda is installed
check_conda_installed() {
    if command -v conda &> /dev/null; then
        echo "Conda is installed."
        find_conda_sh
        return 0
    else
        echo "Conda is not installed. Installing Miniconda..."
        install_miniconda
        return 1
    fi
}

# Function to install Miniconda
install_miniconda() {
    wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh -O Miniconda3-latest-Linux-x86_64.sh
    bash Miniconda3-latest-Linux-x86_64.sh -b -p $HOME/miniconda
    CONDA_SH_PATH="$HOME/miniconda/etc/profile.d/conda.sh"
    echo "Miniconda installed."
}

# Function to initialize conda for the current shell session
initialize_conda() {
    if [ -z "$CONDA_SH_PATH" ]; then
        echo "Error: CONDA_SH_PATH is not set. Cannot initialize Conda."
        exit 1
    fi
    source "$CONDA_SH_PATH"
    eval "$(conda shell.bash hook)"
}

# Function to create a new conda environment
create_conda_env() {
    echo "Creating new conda environment '$SHELLAGENT_ENV' with Python 3.10..."
    conda create -y -n $SHELLAGENT_ENV python=3.10
    echo "Environment '$SHELLAGENT_ENV' created."
}

# Function to activate the conda environment and install the package
activate_and_install() {
    echo "Activating the '$SHELLAGENT_ENV' environment..."
    conda activate $SHELLAGENT_ENV
    echo "Installing package in editable mode..."
    bash scripts/install_torch_linux.sh
    pip install -e .
    echo "Package installed."
}

# Main script execution
check_conda_installed
initialize_conda
create_conda_env
activate_and_install

echo "Script execution complete."
echo $(which python)