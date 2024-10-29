import os
import json
import shutil
import uuid
import importlib
import sys
import pygit2
import subprocess
import requests
from datetime import datetime

from proconfig.widgets.base import WIDGETS
from proconfig.widgets import load_custom_widgets
from proconfig.utils.misc import is_valid_url, _make_temp_file

from servers.base import app, APP_SAVE_ROOT, WORKFLOW_SAVE_ROOT, PROJECT_ROOT, get_file_times

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse, FileResponse
from typing import Dict
import time
import threading

SAVE_ROOTS = {
    "app": APP_SAVE_ROOT,
    "workflow": WORKFLOW_SAVE_ROOT
}
LAST_CHECK_FILE = os.path.join(PROJECT_ROOT, 'last_check_time.json')
AUTO_UPDATE_FILE = os.path.join(PROJECT_ROOT, 'data', 'auto_update_settings.json')

async def upload(file: UploadFile = File(...)):
    filename = file.filename
    root_folder = app.config['UPLOAD_FOLDER']
    save_path = os.path.join(root_folder, filename)

    # Create the directory if it doesn't exist
    os.makedirs(os.path.dirname(save_path), exist_ok=True)

    # Save the uploaded file
    with open(save_path, "wb") as f:
        content = await file.read()
        f.write(content)

    print("save_path:", save_path)
    
    response = {
        "file_path": save_path
    }
    
    return JSONResponse(content=response)


       
BASE_DIR = os.getcwd()
@app.get('/api/files/{filename:path}')
async def get_file(filename: str):
    filename = filename.strip()
    
    try:
        if is_valid_url(filename):
            src = _make_temp_file(filename)
            return FileResponse(src.name)  # Send the temporary file

        # Construct the full file path
        file_path = os.path.join(BASE_DIR, filename)
        file_path = os.path.normpath(file_path)

        if os.path.isfile(file_path):
            return FileResponse(file_path)  # Send the file to the client
        else:
            # If the file doesn't exist, raise a 404 error
            raise HTTPException(status_code=404, detail="File not found")
    except Exception as e:
        # Handle unexpected errors
        raise HTTPException(status_code=500, detail=str(e))

@app.post('/api/list')
async def fetch_workflow_list(params: Dict):
    SAVE_ROOT = SAVE_ROOTS.get(params["type"])

    if not SAVE_ROOT:
        raise HTTPException(status_code=400, detail="Invalid type specified")

    # List workflow IDs
    workflow_ids = [item for item in os.listdir(SAVE_ROOT) if not item.startswith(".")][::-1]
    data = []

    for workflow_id in workflow_ids:
        reactflow_file = os.path.join(SAVE_ROOT, workflow_id, "latest", "reactflow.json")
        metadata_file = os.path.join(SAVE_ROOT, workflow_id, "latest", "metadata.json")
        metadata = {}

        if os.path.isfile(metadata_file):
            with open(metadata_file) as f:
                metadata.update(json.load(f))

        if os.path.isfile(reactflow_file):
            create_time, update_time, update_timestamp = get_file_times(reactflow_file)
            metadata['create_time'] = create_time
            metadata['update_time'] = update_time

        item = {
            'id': workflow_id,
            'metadata': metadata,
            'timestamp': os.path.getmtime(reactflow_file)
        }
        data.append(item)

    # Sort data by timestamp in descending order
    data = sorted(data, key=lambda x: x['timestamp'], reverse=True)
    result = {
        "data": data,
        "total": len(workflow_ids),
        "success": True,
        "message": ""
    }

    return JSONResponse(content=result)


def get_unique_workflow_id(SAVE_ROOT):
    workflow_ids = os.listdir(SAVE_ROOT)
    while True:
        workflow_id = str(uuid.uuid1())
        if workflow_id not in workflow_ids:
            break
    return workflow_id


@app.post('/api/create')
async def create_workflow(params: Dict):
    SAVE_ROOT = SAVE_ROOTS.get(params["type"])

    if not SAVE_ROOT:
        raise HTTPException(status_code=400, detail="Invalid type specified")

    workflow_id = get_unique_workflow_id(SAVE_ROOT)

    metadata_file = os.path.join(SAVE_ROOT, workflow_id, "latest", "metadata.json")
    os.makedirs(os.path.dirname(metadata_file), exist_ok=True)

    # Write metadata to file
    with open(metadata_file, "w") as f:
        json.dump(params, f, indent=2)

    # Initialize reactflow and proconfig
    for filename in ["proconfig.json", "reactflow.json"]:
        filepath = os.path.join(SAVE_ROOT, workflow_id, "latest", filename)
        with open(filepath, "w") as f:
            json.dump({}, f)

    result = {
        "data": {
            "id": workflow_id,
        },
        "success": True,
        "message": ""
    }
    return JSONResponse(content=result)


@app.post('/api/edit')
async def edit_workflow(data: Dict):
    SAVE_ROOT = SAVE_ROOTS.get(data.pop("type"))

    if SAVE_ROOT is None:
        raise HTTPException(status_code=400, detail="Invalid type specified")

    workflow_id = data.pop("id")
    metadata_file = os.path.join(SAVE_ROOT, workflow_id, "latest", "metadata.json")

    if not os.path.isfile(metadata_file):
        raise HTTPException(status_code=404, detail="Metadata file not found")

    # Write updated metadata to file
    with open(metadata_file, "w") as f:
        json.dump(data, f, indent=2)

    result = {
        "success": True,
        "message": ""
    }
    return JSONResponse(content=result)


@app.post('/api/duplicate')
async def duplicate_workflow(data: Dict):
    SAVE_ROOT = SAVE_ROOTS.get(data.pop("type"))

    if SAVE_ROOT is None:
        raise HTTPException(status_code=400, detail="Invalid type specified")

    src_folder = os.path.join(SAVE_ROOT, data["id"])
    new_workflow_id = get_unique_workflow_id(SAVE_ROOT)
    tgt_folder = os.path.join(SAVE_ROOT, new_workflow_id)

    # Check if source folder exists
    if not os.path.exists(src_folder):
        raise HTTPException(status_code=404, detail="Source workflow not found")

    # First copy the folder
    shutil.copytree(src_folder, tgt_folder)

    # Load and modify the metadata
    metadata_file_path = os.path.join(src_folder, "latest", "metadata.json")
    if not os.path.isfile(metadata_file_path):
        raise HTTPException(status_code=404, detail="Metadata file not found")

    with open(metadata_file_path, 'r') as f:
        metadata = json.load(f)

    metadata["name"] = data["name"]

    # Write updated metadata to the new location
    new_metadata_file_path = os.path.join(tgt_folder, "latest", "metadata.json")
    with open(new_metadata_file_path, 'w') as f:
        json.dump(metadata, f, indent=2)

    result = {
        "data": {
            "id": new_workflow_id
        },
        "success": True,
        "message": ""
    }
    return JSONResponse(content=result)


@app.post('/api/delete')
async def delete_workflow(data: Dict):
    SAVE_ROOT = SAVE_ROOTS.get(data.pop("type"))

    if SAVE_ROOT is None:
        raise HTTPException(status_code=400, detail="Invalid type specified")

    folder_path = os.path.join(SAVE_ROOT, data["id"])

    if os.path.isdir(folder_path):
        shutil.rmtree(folder_path)
        result = {
            "success": True,
            "message": ""
        }
    else:
        raise HTTPException(status_code=404, detail="The workflow to delete does not exist")

    return JSONResponse(content=result)


@app.get('/api/check_repo_status')
async def check_repo_status():
    # Record the current time at the beginning of the function
    current_time = datetime.now().isoformat()

    pygit2.option(pygit2.GIT_OPT_SET_OWNER_VALIDATION, 0)
    repo = pygit2.Repository('../ShellAgent')

    try:
        remote = repo.remotes["origin"]
        remote.fetch()
        print("Successfully fetched the latest information from the remote repository")
    except Exception as e:
        print(f"Error fetching information from the remote repository: {str(e)}")

    has_new_stable = False
    current_tag = None
    current_version = None
    target_release_date = None

    current_branch = repo.head.shorthand

    latest_commit = repo.revparse_single(current_branch)
    current_commit_id = str(latest_commit.id)

    for reference in repo.references:
        if reference.startswith('refs/tags/v'):
            tag = repo.lookup_reference(reference)
            if tag.peel().id == latest_commit.id:
                current_tag = reference
                current_version = reference.split('/')[-1]
                break

    if not current_version:
        current_version = current_commit_id[:7]  # Use short commit id

    print(f'current_version: {current_version}')

    latest_tag = max(
        (ref for ref in repo.references if ref.startswith('refs/tags/v')),
        key=lambda x: [int(i) for i in x.split('/')[-1][1:].split('.')]
    )
    latest_tag_ref = repo.lookup_reference(latest_tag)
    latest_tag_commit = latest_tag_ref.peel(pygit2.GIT_OBJECT_COMMIT)
    print(f"latest_tag: {latest_tag}")

    # Check if the latest stable version is newer than the current commit
    has_new_stable = repo.merge_base(latest_tag_commit.id, latest_commit.id) == latest_commit.id and latest_tag_commit.id != latest_commit.id
    latest_tag_name = latest_tag.split('/')[-1]

    changelog = ""
    
    if has_new_stable:
        # Get changelog and release date
        github_api_url = f"https://api.github.com/repos/myshell-ai/ShellAgent/releases/tags/{latest_tag_name}"
        response = requests.get(github_api_url)
        if response.status_code == 200:
            release_data = response.json()
            changelog = release_data.get('body', 'No changelog found')
            target_release_date = release_data.get('published_at', 'Unknown')
        else:
            changelog = f"Failed to get changelog. HTTP status code: {response.status_code}"
            target_release_date = 'Unknown'

        print(f"Latest tag: {latest_tag_name}")
        print(f"Changelog:\n{changelog}")
        print(f"Release date: {target_release_date}")

    response_data = {
        "has_new_stable": has_new_stable,
        "current_version": current_version,
        "target_release_date": target_release_date
    }
    if has_new_stable:
        response_data["latest_tag_name"] = latest_tag_name
        response_data["changelog"] = changelog

    # Update the last check time before returning the response
    os.makedirs(os.path.dirname(LAST_CHECK_FILE), exist_ok=True)
    with open(LAST_CHECK_FILE, 'w') as f:
        json.dump({"last_check_time": current_time}, f)

    return JSONResponse(content=response_data)

def update_stable():
    try:
        script_path = os.path.join('.ci', 'update', 'update.py')
        python_exe = sys.executable
        result = subprocess.run([python_exe, script_path, './', '--stable'], capture_output=True, text=True, check=True)
        return result.stdout
    except subprocess.CalledProcessError as e:
        raise Exception(f"update failed: {e.stderr}")

@app.get('/api/update/stable')
async def update_stable_route():
    try:
        result = update_stable()
        return JSONResponse(content={"success": True, "message": result}, status_code=200)
    except Exception as e:
        raise HTTPException(status_code=500, detail={"success": False, "error": str(e)})

@app.get('/api/restart')
async def restart():
    print("Restart signal triggered")
    
    # Create a response
    response = JSONResponse(content={"message": "Server is restarting"}, status_code=200)
    
    # Use a thread to exit the program after a short delay
    def delayed_exit():
        time.sleep(1)  # Wait for 1 second to ensure the response has been sent
        os._exit(42)  # Use exit code 42 to indicate restart signal

    threading.Thread(target=delayed_exit).start()
    
    return response

@app.get('/api/last_check_time')
def get_last_check_time():
    if os.path.exists(LAST_CHECK_FILE):
        with open(LAST_CHECK_FILE, 'r') as f:
            data = json.load(f)
        return JSONResponse(content=data)
    else:
        return JSONResponse(content={"last_check_time": None})

@app.get('/api/auto_update')
def get_auto_update_setting():
    if os.path.exists(AUTO_UPDATE_FILE):
        with open(AUTO_UPDATE_FILE, 'r') as f:
            settings = json.load(f)
        return JSONResponse(content=settings)
    else:
        return JSONResponse(content={"auto_update": False})

@app.post('/api/auto_update')
def set_auto_update_setting(settings: Dict):
    os.makedirs(os.path.dirname(AUTO_UPDATE_FILE), exist_ok=True)
    
    # Update auto update settings
    with open(AUTO_UPDATE_FILE, 'w') as f:
        json.dump({"auto_update": settings["auto_update"]}, f)

    return JSONResponse(content={"success": True, "message": "Auto update setting updated successfully."})
