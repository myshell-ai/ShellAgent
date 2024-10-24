#!/bin/bash

# Function to check and update files
check_and_update_file() {
    local source_file="$1"
    local target_file="$2"
    if [ -f "$source_file" ]; then
        if ! cmp -s "$source_file" "$target_file"; then
            echo "Detected new version of $target_file, updating..."
            cp "$source_file" "$target_file"
            echo "Update complete for $target_file"
            return 0
        else
            echo "$target_file is already up to date. No update needed."
        fi
    fi
    return 1
}

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

# Function to check if conda is installed
check_conda_installed() {
    if command -v conda &> /dev/null; then
        echo "Conda is installed."
        conda_root=$(conda info | grep 'base environment' | awk '{print $4}')

        if [ -n "$conda_root" ]; then
            echo "find conda root: $conda_root"
            CONDA_SH_PATH="$conda_root/etc/profile.d/conda.sh"
        else
            echo "Parse conda info failed. Try to search it in some regular path"
            find_conda_sh
        fi

        return 0
    else
        echo "Conda is not installed. Installing Miniconda..."
        install_miniconda
        return 1
    fi
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

check_conda_installed
initialize_conda
echo "activate python from $(which python)"
cd ShellAgent

# Main script execution
while true; do
    # Check and update start.sh and install.sh
    cd ..
    update_required=false
    install_updated=false
    if check_and_update_file "ShellAgent/.ci/linux_base_files/start.sh" "${BASH_SOURCE[0]}"; then
        update_required=true
    fi
    if check_and_update_file "ShellAgent/.ci/linux_base_files/install.sh" "install.sh"; then
        update_required=true
        install_updated=true
    fi

    if [ "$install_updated" = true ]; then
        echo "install.sh was updated. Running it to update the environment..."
        bash install.sh
        echo "Environment update complete."
    fi

    if [ "$update_required" = true ]; then
        echo "Updates applied. Restarting..."
        exec bash "${BASH_SOURCE[0]}"
    fi
    cd ShellAgent

    export MYSHELL_KEY=OPENSOURCE_FIXED
    python servers/main.py --port 8154

    exit_code=$?
    if [ $exit_code -eq 42 ]; then
        echo "Restart signal detected, program will restart in 3 seconds..."
        sleep 3
    else
        exit 0
    fi
done
