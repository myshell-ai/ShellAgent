source ./miniconda/etc/profile.d/conda.sh
conda activate shell_agent
pip install -e .
python servers/main.py