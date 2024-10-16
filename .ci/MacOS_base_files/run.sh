VENV_NAME="shellagent"
VENV_PATH="./$VENV_NAME"

python -m venv "$VENV_PATH"
source "$VENV_PATH/bin/activate

cd ShellAgent
python -m pip install poetry
python -m pip install -e .
python servers/main.py