import pygit2
from datetime import datetime
import sys
import os
import shutil
import filecmp
import subprocess
import requests
import zipfile

def pull(repo, remote_name='origin', branch='main'):
    for remote in repo.remotes:
        if remote.name == remote_name:
            remote.fetch()
            remote_master_id = repo.lookup_reference('refs/remotes/origin/%s' % (branch)).target
            merge_result, _ = repo.merge_analysis(remote_master_id)
            # Up to date, do nothing
            if merge_result & pygit2.GIT_MERGE_ANALYSIS_UP_TO_DATE:
                return
            # We can just fastforward
            elif merge_result & pygit2.GIT_MERGE_ANALYSIS_FASTFORWARD:
                repo.checkout_tree(repo.get(remote_master_id))
                try:
                    master_ref = repo.lookup_reference('refs/heads/%s' % (branch))
                    master_ref.set_target(remote_master_id)
                except KeyError:
                    repo.create_branch(branch, repo.get(remote_master_id))
                repo.head.set_target(remote_master_id)
            elif merge_result & pygit2.GIT_MERGE_ANALYSIS_NORMAL:
                repo.merge(remote_master_id)

                if repo.index.conflicts is not None:
                    for conflict in repo.index.conflicts:
                        print('Conflicts found in:', conflict[0].path)
                    raise AssertionError('Conflicts, ahhhhh!!')

                user = repo.default_signature
                tree = repo.index.write_tree()
                commit = repo.create_commit('HEAD',
                                            user,
                                            user,
                                            'Merge!',
                                            tree,
                                            [repo.head.target, remote_master_id])
                # We need to do this or git CLI will think we are still merging.
                repo.state_cleanup()
            else:
                raise AssertionError('Unknown merge analysis result')

pygit2.option(pygit2.GIT_OPT_SET_OWNER_VALIDATION, 0)
repo_path = str(sys.argv[1])
if "SHELLAGENT_BRANCH" in os.environ:
    branch_name = os.environ['SHELLAGENT_BRANCH']
else:
    branch_name = 'main'

repo = pygit2.Repository(repo_path)
ident = pygit2.Signature('shellagent', 'shellagent@myshell.ai')

# Check and update .gitmodules file and submodules
gitmodules_path = os.path.join(repo_path, '.gitmodules')
gitmodules_updated = False

if os.path.exists(gitmodules_path):
    print("Checking if .gitmodules file has updates")
    remote_gitmodules = repo.revparse_single('origin/main:.gitmodules')
    with open(gitmodules_path, 'rb') as f:
        local_content = f.read()
    if local_content != remote_gitmodules.data:
        print(".gitmodules file has updates, starting update")
        with open(gitmodules_path, 'wb') as f:
            f.write(remote_gitmodules.data)
        repo.index.add('.gitmodules')
        repo.index.write()
        gitmodules_updated = True
    else:
        print(".gitmodules file unchanged, skipping update")

if gitmodules_updated:
    print("Updating all submodules")
    # Use Git command to update submodules
    result = subprocess.run(['git', '-C', repo_path, 'submodule', 'update', '--init', '--recursive'], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    if result.returncode != 0:
        print("Failed to update submodules:", result.stderr.decode())
        sys.exit(1)
else:
    print("No need to update submodules")

try:
    print("Stashing current changes")
    repo.stash(ident)
except KeyError:
    print("No changes to stash")

backup_branch_name = 'backup_branch_{}'.format(datetime.today().strftime('%Y-%m-%d_%H_%M_%S'))
print("creating backup branch: {}".format(backup_branch_name))
try:
    repo.branches.local.create(backup_branch_name, repo.head.peel())
except:
    pass

print(f"Checking out {branch_name} branch")
branch = repo.lookup_branch(branch_name)
if branch is None:
    ref = repo.lookup_reference('refs/remotes/origin/main')
    repo.checkout(ref)
    branch = repo.lookup_branch(branch_name)
    if branch is None:
        repo.create_branch(branch_name, repo.get(ref.target))
else:
    ref = repo.lookup_reference(branch.name)
    repo.checkout(ref)

print("Pulling latest changes")
if branch_name != 'main':
    subprocess.run(['git', '-C', repo_path, 'checkout', branch_name])
    subprocess.run(['git', '-C', repo_path, 'pull', 'origin', branch_name])
else:
    pull(repo, branch=branch_name)

if "--stable" in sys.argv and branch_name == 'main':
    def latest_tag(repo):
        versions = []
        for k in repo.references:
            try:
                prefix = "refs/tags/v"
                if k.startswith(prefix):
                    version = list(map(int, k[len(prefix):].split(".")))
                    versions.append((version[0] * 10000000000 + version[1] * 100000 + version[2], k))
            except:
                pass
        versions.sort()
        if len(versions) > 0:
            return versions[-1][1]
        return None
    latest_tag = latest_tag(repo)
    print(f"latest_tag: {latest_tag}")
    if latest_tag is not None:
        repo.checkout(latest_tag)

    # Check and update submodules for stable version
    if gitmodules_updated:
        print("Updating submodules for stable version")
        result = subprocess.run(['git', '-C', repo_path, 'submodule', 'update', '--init', '--recursive'], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        if result.returncode != 0:
            print("Failed to update submodules for stable version:", result.stderr.decode())
            sys.exit(1)

def download_latest_web_build():
    print("Downloading the latest web-build...")

    if branch_name != 'main':
        if 'WEB_BUILD_URL' not in os.environ:
            print("WEB_BUILD_URL is not set")
            return
        download_url = os.environ['WEB_BUILD_URL']
        try:
            # URL format like: https://github.com/myshell-ai/ShellAgent/actions/runs/{run_id}/artifacts/{artifact_id}
            parts = download_url.split('/')
            artifact_id = parts[-1]
            owner = "myshell-ai"
            repo = "ShellAgent"
            
            # Construct GitHub API URL
            api_url = f"https://api.github.com/repos/{owner}/{repo}/actions/artifacts/{artifact_id}/zip"
            
            # Set GitHub API authentication headers
            headers = {
                'Authorization': f'token {os.environ.get("GITHUB_TOKEN")}',
                'Accept': 'application/vnd.github+json'
            }
            
            response = requests.get(api_url, headers=headers)
            response.raise_for_status()
            
            with open('web-build.zip', 'wb') as f:
                f.write(response.content)
            print("Download completed successfully")
        except Exception as e:
            print(f"Failed to download web-build: {e}")
            return
    else:
        # Get the latest release information
        api_url = "https://api.github.com/repos/myshell-ai/ShellAgent/releases/latest"
        response = requests.get(api_url)
        if response.status_code != 200:
            print("Failed to get the latest release information")
            return

        release_info = response.json()
        web_build_asset = next((asset for asset in release_info['assets'] if asset['name'] == 'web-build.zip'), None)

        if not web_build_asset:
            print("web-build.zip resource not found")
            return

        # Download web-build
        download_url = web_build_asset['browser_download_url']

        response = requests.get(download_url)

        if response.status_code != 200:
            print("Failed to download web-build")
            return

        # Save and extract web-build
        with open('web-build.zip', 'wb') as f:
            f.write(response.content)

    target_dir = os.path.join(repo_path, "servers", "web-build")
    if os.path.exists(target_dir):
        shutil.rmtree(target_dir)

    with zipfile.ZipFile('web-build.zip', 'r') as zip_ref:
        zip_ref.extractall(target_dir)

    os.remove('web-build.zip')
    print("web-build updated")

download_latest_web_build()

print("Done!")
