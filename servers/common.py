import os
import json
import shutil
import uuid
import importlib
import sys

from flask import request, jsonify, abort, send_from_directory, send_file

from proconfig.widgets.base import WIDGETS
from proconfig.widgets import load_custom_widgets
from proconfig.utils.misc import is_valid_url, _make_temp_file

from servers.base import app, APP_SAVE_ROOT, WORKFLOW_SAVE_ROOT, get_file_times


SAVE_ROOTS = {
    "app": APP_SAVE_ROOT,
    "workflow": WORKFLOW_SAVE_ROOT
}

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