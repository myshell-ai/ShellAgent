#!/bin/bash

# Fetch the latest changes from the remote
git fetch origin

mkdir temp_remote_dir
git archive origin/main | tar -x -C temp_remote_dir

# Compare and package the changed files
git diff --name-only origin/main | xargs tar -czf changed_files.tar.gz -C temp_remote_dir

# remove the temp dir
rm -rf temp_remote_dir

echo "Changed files have been packaged into changed_files.tar.gz"