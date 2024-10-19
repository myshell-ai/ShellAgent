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

from flask import request, jsonify, abort, send_from_directory, send_file

from proconfig.widgets.base import WIDGETS
from proconfig.widgets import load_custom_widgets
from proconfig.utils.misc import is_valid_url, _make_temp_file

from servers.base import app, APP_SAVE_ROOT, WORKFLOW_SAVE_ROOT, PROJECT_ROOT, get_file_times


SAVE_ROOTS = {
    "app": APP_SAVE_ROOT,
    "workflow": WORKFLOW_SAVE_ROOT
}
LAST_CHECK_FILE = os.path.join(PROJECT_ROOT, 'last_check_time.json')
AUTO_UPDATE_FILE = os.path.join(PROJECT_ROOT, 'data', 'auto_update_settings.json')

@app.route(f'/api/upload', methods=['POST'])
def upload():
    file = request.files['file']
    filename = file.filename
    root_folder = app.config['UPLOAD_FOLDER']
    save_path = f"{root_folder}/{filename}"
    os.makedirs(os.path.dirname(save_path), exist_ok=True)
    file.save(save_path)
    print("save_path:", save_path)
    response = {
        "file_path": save_path
    }
    return jsonify(response)


@app.route(f'/api/reload', methods=['POST'])
def reload():
    data = request.get_json()
    
    # first reload all the custom widgets
    load_custom_widgets()
    
    if "widget_name" in data:
        widget_names = [data["widget_name"]]
    else:
        widget_names = list(WIDGETS.module_dict.keys())
    
    # useful for update the schema
    modules_to_reload = []
    for widget_name in widget_names:
        widget_class = WIDGETS.module_dict[widget_name]
        if widget_class.__module__ not in modules_to_reload:
            modules_to_reload.append(widget_class.__module__)
            
    for module_to_reload in modules_to_reload:
        print("ready to reload module:", module_to_reload)
        importlib.reload(sys.modules[widget_class.__module__])
        
    response = {
        "success": True
    }
    return jsonify(response)
       
BASE_DIR = os.getcwd()
@app.route('/api/files/<path:filename>')
def get_file(filename):
    try:
        if is_valid_url(filename):
            src = _make_temp_file(filename)
            filename = src.name
            return send_file(filename)
        else:
            # Ensure the file path is safe
            print("base dir:", BASE_DIR)
            print("filename:", filename)
            # if filename.startswith(BASE_DIR):
            #     file_path = filename
            # elif filename.startswith(BASE_DIR[1:]):
            #     file_path = "/" + filename
            # else:
            file_path = os.path.join(BASE_DIR, filename)
            file_path = os.path.normpath(file_path)

        if os.path.isfile(file_path):
            # Send the file to the client
            print("ready to send", filename)
            return send_from_directory(BASE_DIR, filename)
        else:
            print("fail file_path:", file_path)
            # If the file doesn't exist, return a 404 error
            abort(404)
    except Exception as e:
        # Handle unexpected errors
        abort(500, description=str(e))

@app.route('/api/list', methods=['POST']) # tested
def fetch_workflow_list():
    params = request.get_json()
    SAVE_ROOT = SAVE_ROOTS[params["type"]]
    
    workflow_ids = os.listdir(SAVE_ROOT)[::-1]
    data = []
    for workflow_id in workflow_ids:
        reactflow_file = os.path.join(SAVE_ROOT, workflow_id, "latest", "reactflow.json")
        metadata_file = os.path.join(SAVE_ROOT, workflow_id, "latest", "metadata.json")
        metadata = {}
        if os.path.isfile(metadata_file):
            metadata.update(json.load(open(metadata_file)))
            
        if os.path.isfile(reactflow_file):
            create_time, update_time, update_timestamp = get_file_times(reactflow_file)
            metadata['create_time'] = create_time
            metadata['update_time'] = update_time
            
        item = dict(
            id=workflow_id,
            metadata=metadata,
            timestamp=os.path.getmtime(reactflow_file)
        )
        data.append(item)
    data = sorted(data, key=lambda x: x['timestamp'], reverse=True)
    result = {
        "data": data,
        "total": len(workflow_ids),
        "success": True,
        "message": ""
    }
    return jsonify(result)


def get_unique_workflow_id(SAVE_ROOT):
    workflow_ids = os.listdir(SAVE_ROOT)
    while True:
        workflow_id = str(uuid.uuid1())
        if workflow_id not in workflow_ids:
            break
    return workflow_id


@app.route(f'/api/create', methods=['POST']) # tested
def create_workflow():
    params = request.get_json()
    SAVE_ROOT = SAVE_ROOTS[params["type"]]
    
    data = params

    workflow_id = get_unique_workflow_id(SAVE_ROOT)
    
    metadata_file = os.path.join(SAVE_ROOT, workflow_id, "latest", "metadata.json")
    os.makedirs(os.path.dirname(metadata_file), exist_ok=True)
    with open(metadata_file, "w") as f:
        json.dump(data, f, indent=2)
    # init reactflow and proconfig
    for filename in ["proconfig.json", "reactflow.json"]:
        filepath = os.path.join(SAVE_ROOT, workflow_id, "latest", filename)
        json.dump({}, open(filepath, "w"))
        
    result = {
        "data": {
            "id": workflow_id,
        },
        "success": True,
        "message": ""
    }
    return jsonify(result)


@app.route(f'/api/edit', methods=['POST']) # tested
def edit_workflow():
    data = request.get_json()
    SAVE_ROOT = SAVE_ROOTS[data.pop("type")]
    workflow_id = data.pop("id")
    metadata_file = os.path.join(SAVE_ROOT, workflow_id, "latest", "metadata.json")
    
    assert os.path.isfile(metadata_file)
    
    with open(metadata_file, "w") as f:
        json.dump(data, f, indent=2)
    result = {
        "success": True,
        "message": ""
    }
    return jsonify(result)


@app.route(f'/api/duplicate', methods=['POST']) # tested
def duplicate_workflow():
    data = request.get_json()
    SAVE_ROOT = SAVE_ROOTS[data.pop("type")]
    new_workflow_id = get_unique_workflow_id(SAVE_ROOT)
    
    src_folder = os.path.join(SAVE_ROOT, data["id"])
    tgt_folder = os.path.join(SAVE_ROOT, new_workflow_id)
    
    # first copy the folder
    shutil.copytree(src_folder, tgt_folder)
    metadata = json.load(open(os.path.join(src_folder, "latest", "metadata.json")))
    metadata["name"] = data["name"]
    
    json.dump(metadata, open(os.path.join(tgt_folder, "latest", "metadata.json"), "w"))
    result = {
        "data": {
            "id": new_workflow_id
        },
        "success": True,
        "message": ""
    }
    return jsonify(result)


@app.route(f'/api/delete', methods=['POST']) # tested
def delete_workflow():
    data = request.get_json()
    SAVE_ROOT = SAVE_ROOTS[data.pop("type")]
    folder_path = os.path.join(SAVE_ROOT, data["id"])
    if os.path.isdir(folder_path):
        shutil.rmtree(folder_path)
        result = {
            "success": True,
            "message": ""
        }
    else:
        result = {
            "success": False,
            "message": "the workflow to delete does not exist"
        }
    return jsonify(result)


@app.route('/api/check_repo_status')
def check_repo_status():
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

    latest_tag = max((ref for ref in repo.references if ref.startswith('refs/tags/v')), key=lambda x: [int(i) for i in x.split('/')[-1][1:].split('.')])
    latest_tag_ref = repo.lookup_reference(latest_tag)
    latest_tag_commit = latest_tag_ref.peel(pygit2.GIT_OBJECT_COMMIT)
    print(f"latest_tag: {latest_tag}")

    # Check if the latest stable version is newer than the current commit
    has_new_stable = repo.merge_base(latest_tag_commit.id, latest_commit.id) == latest_commit.id and latest_tag_commit.id != latest_commit.id
    latest_tag_name = latest_tag.split('/')[-1]

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

    response = {
        "has_new_stable": has_new_stable,
        "current_version": current_version,
        "target_release_date": target_release_date
    }
    if has_new_stable:
        response["latest_tag_name"] = latest_tag_name
        response["changelog"] = changelog

    # Update the last check time before returning the response
    os.makedirs(os.path.dirname(LAST_CHECK_FILE), exist_ok=True)
    with open(LAST_CHECK_FILE, 'w') as f:
        json.dump({"last_check_time": current_time}, f)

    return jsonify(response)

def update_stable():
    try:
        script_path = os.path.join('.ci', 'update', 'update.py')
        python_exe = sys.executable        
        result = subprocess.run([python_exe, script_path, './', '--stable'], capture_output=True, text=True, check=True)
        return result.stdout
    except subprocess.CalledProcessError as e:
        raise Exception(f"update failed: {e.stderr}")

@app.route('/api/update/stable')
def update_stable_route():
    try:
        result = update_stable()
        return jsonify({"success": True, "message": result}), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/restart')
def restart():
    print("Restart signal triggered")
    # Return a response to the client
    response = jsonify({"message": "Server is restarting"})
    response.status_code = 200
    # Use a thread to exit the program after a short delay
    import threading
    def delayed_exit():
        import time
        time.sleep(1)  # Wait for 1 second to ensure the response has been sent
        os._exit(42)  # Use exit code 42 to indicate restart signal
    threading.Thread(target=delayed_exit).start()
    return response

@app.route('/api/last_check_time')
def get_last_check_time():
    if os.path.exists(LAST_CHECK_FILE):
        with open(LAST_CHECK_FILE, 'r') as f:
            data = json.load(f)
        return jsonify(data)
    else:
        return jsonify({"last_check_time": None})

@app.route('/api/auto_update', methods=['GET'])
def get_auto_update_setting():
    if os.path.exists(AUTO_UPDATE_FILE):
        with open(AUTO_UPDATE_FILE, 'r') as f:
            settings = json.load(f)
        return jsonify(settings)
    else:
        return jsonify({"auto_update": False})

@app.route('/api/auto_update', methods=['POST'])
def set_auto_update_setting():
    data = request.get_json()
    if 'auto_update' not in data or not isinstance(data['auto_update'], bool):
        return jsonify({"error": "Invalid input. 'auto_update' must be a boolean value."}), 400

    os.makedirs(os.path.dirname(AUTO_UPDATE_FILE), exist_ok=True)
    with open(AUTO_UPDATE_FILE, 'w') as f:
        json.dump({"auto_update": data['auto_update']}, f)

    return jsonify({"success": True, "message": "Auto update setting updated successfully."})
