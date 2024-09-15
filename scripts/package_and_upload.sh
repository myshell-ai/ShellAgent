#!/bin/bash

# back to main directory
cd ..  

# name the archive file with date
current_date=$(date +'%Y-%m-%d')
archive_name="ShellAgent-${current_date}.7z"

# delete the previous file if exists
if [[ -f "$archive_name" ]]; then
    echo "delete: $archive_name"
    rm "$archive_name"
fi

# delete the package file
rm -rf package/ShellAgent

# choose and gather the file for archive
rsync -av \
    --exclude='__pycache__' \
    --include='proconfig/***' \
    --include='custom_widgets/***' \
    --include='servers/***' \
    --include='web/***' \
    --include='custom_widget_info.json' \
    --include='folder_paths.py' \
    --include='LICENSE.txt' \
    --include='model_info.json' \
    --include='poetry.lock' \
    --include='pyproject.toml' \
    --include='README.md' \
    --exclude='*' \
    ./ ./package/ShellAgent

cp -r data_template package/ShellAgent/data

# use 7z
cd ./package
7z a "../$archive_name" *

echo "Finish Achieve: $archive_name"

# back to main directory
cd ..

# upload to huggingface
python -c "
import os
from dotenv import load_dotenv
from huggingface_hub import HfApi, HfFolder, login

# Retrieve the token from the environment variable
load_dotenv()
hf_token = os.getenv('HUGGINGFACE_TOKEN')

if hf_token is None:
    raise ValueError('HUGGINGFACE_TOKEN environment variable is not set.')

# Log in to Hugging Face using the token
login(token=hf_token, add_to_git_credential=True)

api = HfApi()
token = HfFolder.get_token()

api.upload_file(
    path_or_fileobj='$archive_name',
    path_in_repo='$archive_name',
    repo_id='myshell-ai/ShellAgent',
    repo_type='model',
    token=token
)
"

echo "Successful Upload: $repo_id"