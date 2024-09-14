from proconfig.core import Workflow
import logging
from urllib.parse import urlsplit
import requests
import os
import subprocess
import pkg_resources
import sys

logging.basicConfig(level=logging.INFO)

CUSTOM_WIDGET_ROOT = "custom_widgets"

CURRENT_PACKAGE_NAME_KEY = f"CURRENT_PACKAGE_PID_{os.getpid()}"

def parse_github_url(url):
    path = urlsplit(url).path
    parts = [part for part in path.split('/') if part]
    if len(parts) >= 2:
        owner = parts[0]
        repo = parts[1].replace('.git', '')
        return owner, repo
    else:
        raise ValueError("Invalid GitHub URL")
    
def get_github_repo_tags(url):
    owner, repo = parse_github_url(url)
    # GitHub API endpoint for tags
    tags_url = f'https://api.github.com/repos/{owner}/{repo}/tags'

    # Get all tags
    tags_response = requests.get(tags_url)
    tags_response.raise_for_status()
    tags_data = tags_response.json()

    tags_and_hashes = {tag['name']: tag['commit']['sha'] for tag in tags_data}

    return tags_and_hashes

def get_github_repo_commits(url):
    owner, repo = parse_github_url(url)
    # GitHub API endpoint for commits
    commits_url = f'https://api.github.com/repos/{owner}/{repo}/commits'

    # Get all commits
    commits_response = requests.get(commits_url)
    commits_response.raise_for_status()
    commits_data = commits_response.json()

    commits = {}
    for commit in commits_data:
        commit_hash = commit['sha']
        commits[commit_hash] = {
            'author': commit['commit']['author']['name'],
            'date': commit['commit']['author']['date'],
            'message': commit['commit']['message']
        }

    return commits

def get_github_repo_hash(repo_url, branch="main", commit="latest"):
    if commit != "latest":
        return commit
    owner, repo = parse_github_url(repo_url)
    url = f"https://api.github.com/repos/{owner}/{repo}/git/refs/heads/{branch}"
    response = requests.get(url)
    if response.status_code == 200:
        ref_data = response.json()
        sha = ref_data['object']['sha']
        return sha
    else:
        print(f"Failed to get repository data: {response.status_code}")
        return None
    

def check_repo_valid(local_path, remote_hash):
    local_hash =  get_latest_commit_hash(local_path)
    return remote_hash == local_hash

    
def get_latest_commit_hash(local_path):
    result = subprocess.run(["git", "-C", local_path, "rev-parse", "HEAD"], check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    return result.stdout.strip().decode('utf-8')

def check_conflicts(requirements):
    """
    Check for conflicts between requirements and the current environment.
    Returns a tuple: (conflicting_requirements, non_conflicting_requirements)
    """
    installed_packages = {pkg.key: pkg.version for pkg in pkg_resources.working_set}
    conflicting_requirements = []
    non_conflicting_requirements = []

    for req in requirements:
        try:
            # Parse the requirement
            req_obj = pkg_resources.Requirement.parse(req)
            pkg_key = req_obj.key
            if pkg_key in installed_packages:
                installed_version = pkg_resources.parse_version(installed_packages[pkg_key])
                specifier_set = req_obj.specifier

                # Check if the installed version satisfies the requirement
                if not specifier_set.contains(installed_version, prereleases=True):
                    conflicting_requirements.append(req)
                else:
                    non_conflicting_requirements.append(req)
            else:
                # Package not installed, so it's safe to install
                non_conflicting_requirements.append(req)
        except Exception as e:
            logging.error(f"Error checking requirement {req}: {e}")
            conflicting_requirements.append(req)

    return conflicting_requirements, non_conflicting_requirements

def get_git_info(repo_path):
    # Get the remote URL
    try:
        remote_url = subprocess.check_output(["git", "config", "--get", "remote.origin.url"], cwd=repo_path).strip().decode('utf-8')
    except subprocess.CalledProcessError as e:
        remote_url = f"Failed to get remote URL: {e}"

    # Get the current branch
    try:
        branch = subprocess.check_output(["git", "rev-parse", "--abbrev-ref", "HEAD"], cwd=repo_path).strip().decode('utf-8')
    except subprocess.CalledProcessError as e:
        branch = "main"

    # Get the current commit hash
    try:
        commit = subprocess.check_output(["git", "rev-parse", "HEAD"], cwd=repo_path).strip().decode('utf-8')
    except subprocess.CalledProcessError as e:
        commit = None

    return remote_url, branch, commit

def install_widget(git_url, local_path, commit=None, branch="main"):
    try:
        # Clone the repository with the specified branch
        logging.info(f"Cloning repository from {git_url} to {local_path} (branch: {branch})")
        subprocess.run(["git", "clone", "--branch", branch, git_url, local_path], check=True)
        logging.info(f"Repository cloned to {local_path}")
        
        # Checkout the specific commit if provided
        if commit:
            logging.info(f"Checking out commit {commit}")
            subprocess.run(["git", "checkout", commit], cwd=local_path, check=True)
            logging.info(f"Checked out to commit {commit}")
            
        # Define the path to pip based on the current Python interpreter
        pip_path = os.path.join(os.path.dirname(sys.executable), 'pip')
        
        # Check for requirements.txt
        requirements_file = os.path.join(local_path, 'requirements.txt')
        if os.path.exists(requirements_file):
            logging.info("Found requirements.txt. Checking for dependency conflicts...")
            
            # Read requirements.txt
            with open(requirements_file, 'r') as file:
                requirements = [line.strip() for line in file if line.strip()]

            # Check for conflicts
            conflicting_requirements, non_conflicting_requirements = check_conflicts(requirements)
            if conflicting_requirements:
                logging.warning("Conflicts detected with the following requirements:")
                for conflict in conflicting_requirements:
                    logging.warning(conflict)
                    
            if non_conflicting_requirements:
                logging.info("Installing non-conflicting dependencies...")
                # Create a temporary requirements file for non-conflicting dependencies
                temp_requirements_file = os.path.join(local_path, 'temp_requirements.txt')
                with open(temp_requirements_file, 'w') as temp_file:
                    for req in non_conflicting_requirements:
                        temp_file.write(f"{req}\n")
                
                subprocess.run([pip_path, "install", "-r", temp_requirements_file], check=True)
                logging.info("Dependencies installed successfully.")
                
                # Clean up temporary requirements file
                os.remove(temp_requirements_file)
            else:
                logging.info("No non-conflicting dependencies to install.")
                
        else:
            logging.info("No requirements.txt found. Skipping dependency installation.")
    except subprocess.CalledProcessError as e:
        logging.error(f"An error occurred during git or pip operations: {e}")
    
def install_missing_widgets(workflow: Workflow, custom_widgets: dict):
    for block_name, block in workflow.blocks.items():
        if block.type == "task" and block.mode == "widget" and block.package_name is not None:
            if block.package_name not in custom_widgets:
                raise NotImplementedError(f"{block.package_name} should be either registered to custom_widget_info.json or to the dependency")
            widget_info = custom_widgets[block.package_name]
            # step 0: if folder does not exist, directly clone and install
            folder_name = block.package_name
            local_path = os.path.join(CUSTOM_WIDGET_ROOT, folder_name)
            if not os.path.exists(local_path):
                install_widget(widget_info["git"], local_path)
                continue
            
            # step 1: if exist, get remote hash and check repo valid
            remote_hash = get_github_repo_hash(widget_info["git"])
            repo_valid = check_repo_valid(os.path.join("custom_widgets", folder_name), remote_hash)
            if repo_valid:
                continue
            
            # step 2: if the hash mismatch, clone a new repo
            folder_name_new = folder_name + "-" + remote_hash[:6]
            local_path_new = os.path.join(CUSTOM_WIDGET_ROOT, folder_name_new)
            logging.info(f"hash mismatch, change path to {local_path_new}")
            if not os.path.exists(local_path_new):
                install_widget(widget_info["git"], local_path_new)
            block.package_name = folder_name_new