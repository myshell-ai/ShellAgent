#!/bin/bash

# Check CPU architecture
cpuInfo=$(uname -m)
condaInstaller=""

if [[ "$cpuInfo" == "arm64" ]]; then
    condaInstaller="https://repo.anaconda.com/miniconda/Miniconda3-latest-MacOSX-arm64.sh"
elif [[ "$cpuInfo" == "x86_64" ]]; then
    condaInstaller="https://repo.anaconda.com/miniconda/Miniconda3-latest-MacOSX-x86_64.sh"
else
    echo "Undefined CPU architecture."
    exit 1
fi

install_miniconda() {
    echo "=========>   Check if Miniconda is installed"
    
    if [ ! -d "./miniconda" ]; then
        echo "=========>   Miniconda not found. Installing Miniconda..."
        
        if [ ! -f "./Miniconda3-latest-MacOSX.sh" ]; then
            echo "=========>   Miniconda installer not found. Downloading..."
            curl -o "./Miniconda3-latest-MacOSX.sh" "$condaInstaller"
        else
            echo "=========>   Miniconda installer already exists. Skipping download."
        fi
        
        # Install Miniconda
        bash "./Miniconda3-latest-MacOSX.sh" -b -p "./miniconda"
        echo "=========>   Miniconda installed."
    else
        echo "=========>   Miniconda is already installed."
    fi
    
    # Initialize Miniconda
    echo "=========>   Initialize Miniconda"
    source "./miniconda/etc/profile.d/conda.sh"
    conda init bash
}

continue_script() {
    echo "=========>   Create and activate Conda environment"
    conda create -n shellagent python=3.10 -y
    source activate shellagent
    
    echo "=========>   Python version in environment:"
    which python

    echo "=========>   Change directory to the cloned repository"
    cd "./ShellAgent"
    
    echo "=========>   Install dependencies using Poetry"
    pip install poetry
    pip install -e .
}

# Start the script
echo "===========================> InstallShellAgent v.1.0.0 <==========================="
install_miniconda
continue_script
