#!/bin/bash

VENV_PATH=python_venv

if [ -d $VENV_PATH ]; then
    source $VENV_PATH/bin/activate
else
    python -m venv $VENV_PATH
    source $VENV_PATH/bin/activate
fi

echo "activate python from $(which python)"

cd ShellAgent
python -m pip install poetry 
python -m pip install --use-pep517 -e . 
python servers/main.py