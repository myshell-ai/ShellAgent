source ./miniconda/etc/profile.d/conda.sh
export PATH='./python-3.10.10-macos11/bin:$PATH'
conda activate shell_agent
pip install -e .
python servers/main.py