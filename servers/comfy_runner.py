import requests
from flask import request, jsonify, abort, send_from_directory, send_file
import websocket
import uuid
import json
import urllib
import os
from datetime import datetime

from servers.base import app, PROJECT_ROOT

COMFY_ROOT = os.path.join(PROJECT_ROOT, "comfy_workflow")
@app.route(f'/api/comfyui/upload', methods=['POST'])
def upload_workflow():
    data = request.get_json()
    workflow_id = data["comfy_workflow_id"]
    workflow = data["workflow"]
    
    # step 1: decide workflow type
    if all([k in workflow for k in ["schemas", "dependencies", "workflow", "workflow_api"]]):
        # is shellagent workflow
        return_dict = {
            "success": True,
            "comfy_workflow": workflow["workflow"],
            "message": ""
        }
        # save both
        fname_mapping = {
            "workflow.shellagent.json": workflow, # with dependency
            "workflow.json": workflow["workflow"],
        }
        save_root = os.path.join(COMFY_ROOT, workflow_id)
        os.makedirs(save_root, exist_ok=True)
        for fname, dict_to_save in fname_mapping.items():
            with open(os.path.join(save_root, fname), "w") as f:
                json.dump(dict_to_save, f, indent=2)
        
    elif isinstance(workflow, dict) and all([key in workflow for key in ["last_node_id", "last_link_id", "nodes", "links"]]):
        # save both
        fname_mapping = {
            "workflow.json": workflow,
        }
        save_root = os.path.join(COMFY_ROOT, workflow_id)
        os.makedirs(save_root, exist_ok=True)
        for fname, dict_to_save in fname_mapping.items():
            with open(os.path.join(save_root, fname), "w") as f:
                json.dump(dict_to_save, f, indent=2)
        return_dict = {
            "success": True,
            "comfy_workflow": workflow,
            "message": ""
        }
    else:
        return_dict = {
            "success": False,
            "comfy_workflow": None,
            "message": "invalid json"
        }
    return jsonify(return_dict)

    
@app.route(f'/api/comfyui/save', methods=['POST'])
def save_comfyui_workflow():
    data = request.get_json()
    api = data["comfyui_api"]
    workflow_api = data["prompt"]
    workflow = data["workflow"]
    workflow_id = data["comfy_workflow_id"]
    
    # metadata.json
    metadata = {
        "name": data["name"],
        "workflow_id": workflow_id,
        "create_time": datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    }
    
    post_data = {
        "prompt": workflow_api,
    }
    
    results = requests.post(f"{api}/shellagent/export", json=post_data).json()
    if results["success"]:
        shellagent_json = {
            "workflow": workflow,
            "workflow_api": workflow_api,
            "dependencies": results["dependencies"],
            "schemas": results["schemas"],
        }
        return_dict = {
            "success": True,
            "data": shellagent_json
        }
        
        save_root = os.path.join(COMFY_ROOT, workflow_id)
        os.makedirs(save_root, exist_ok=True)
        
        fname_mapping = {
            "workflow.json": workflow,
            "workflow.shellagent.json": shellagent_json,
            "metadata.json": metadata,
        }
        
        for fname, dict_to_save in fname_mapping.items():
            with open(os.path.join(save_root, fname), "w") as f:
                json.dump(dict_to_save, f, indent=2)
    else:
        return_dict = {
            "success": False,
            "message": results["message"]
        }
    return jsonify(return_dict)


@app.route(f'/api/comfyui/get_file', methods=['POST'])
def comfyui_get_file():
    data = request.get_json()
    filename = data["filename"]
    workflow_id = data["comfy_workflow_id"]
    json_path = os.path.join(COMFY_ROOT, workflow_id, filename)
    
    return_dict = {}
    if os.path.isfile(json_path):
        data = json.load(open(json_path))
        return_dict["data"] = data
        return_dict["success"] = True
    else:
        return_dict["data"] = {}
        return_dict["success"] = False
        return_dict["message"] = f"{json_path} does not exists"
    
    return jsonify(return_dict)
    

@app.route(f'/comfyui/list_workflow', methods=['POST'])
def comfyui_list_workflow():
    data = request.get_json()
    host = data["host"]
    port = data["port"]
    workflow_lists = requests.get(f"{host}:{port}/shellagent/list_workflow").json()
    return jsonify(workflow_lists)


@app.route(f'/comfyui/get_schema', methods=['POST'])
def comfyui_get_schema():
    data = request.get_json()
    host = data["host"]
    port = data["port"]
    post_data = {
        "filename": "schemas.json",
        "workflow_id": data["workflow_id"]
    }
    schemas = requests.post(f"{host}:{port}/shellagent/get_file", json=post_data).json()
    return jsonify(schemas)


def queue_prompt(prompt, server_address, client_id):
    p = {"prompt": prompt, "client_id": client_id}
    data = json.dumps(p).encode('utf-8')
    req =  urllib.request.Request("http://{}/prompt".format(server_address), data=data)
    return json.loads(urllib.request.urlopen(req).read())

def get_history(server_address, prompt_id):
    with urllib.request.urlopen("http://{}/history/{}".format(server_address, prompt_id)) as response:
        return json.loads(response.read())

def get_media(server_address, filename, subfolder, folder_type):
    data = {"filename": filename, "subfolder": subfolder, "type": folder_type}
    url_values = urllib.parse.urlencode(data)
    with urllib.request.urlopen("http://{}/view?{}".format(server_address, url_values)) as response:
        return response.read()
    
NON_FILE_INPUT_TYPES = ["text", "number", "integer"]
@app.route(f'/comfyui/run', methods=['POST'])
def comfyui_run():
    data = request.get_json()
    
    host = data["host"]
    port = data["port"]
    user_inputs = data["user_input"]
    
    server_address = f"{host}:{port}"
    
    prompt = requests.post(f"http://{host}:{port}/shellagent/get_file", json={
        "filename": "workflow_api.json",
        "workflow_id": data["workflow_id"]
    }).json()
    
    schemas = requests.post(f"http://{host}:{port}/shellagent/get_file", json={
        "filename": "schemas.json",
        "workflow_id": data["workflow_id"]
    }).json()
    
    client_id = str(uuid.uuid4())
    ws = websocket.WebSocket()
    ws.connect("ws://{}/ws?clientId={}".format(server_address, client_id))
    # first replace the prompt
    for node_id, node_schema in schemas["inputs"].items():
        input_value = user_inputs[node_schema["name"]]
        if node_schema["type"] not in NON_FILE_INPUT_TYPES: # file input
            input_value = os.path.join(os.getcwd(), input_value)
            
        prompt[node_id]["inputs"]["default_value"] = input_value
        
    prompt_id = queue_prompt(prompt, server_address, client_id)['prompt_id']

    while True:
        out = ws.recv()
        if isinstance(out, str):
            message = json.loads(out)
            print(message)
            if message['type'] == 'executing':
                data = message['data']
                if data['node'] is None and data['prompt_id'] == prompt_id:
                    break #Execution is done
        else:
            continue #previews are binary data

    history = get_history(server_address, prompt_id)[prompt_id]
    outputs = {}
    for node_id in history['outputs']:
        if node_id not in schemas["outputs"]:
            continue
        node_output = history['outputs'][node_id]
        
        # if 'images' in node_output:
        if schemas["outputs"][node_id]["type"] == "image":
            images_output = []
            for image in node_output['images']:
                image_data = get_media(server_address, image['filename'], image['subfolder'], image['type'])
                save_path = os.path.join(image["type"], image['subfolder'], image['filename'])
                os.makedirs(os.path.dirname(save_path), exist_ok=True)
                with open(save_path, "wb") as f:
                    f.write(image_data)
                images_output.append(save_path)
            outputs[schemas["outputs"][node_id]["name"]] = images_output
        elif schemas["outputs"][node_id]["type"] == "video":
            videos_output = []
            for video_path in node_output['video']:
                output_dir, filename = os.path.split(video_path)
                video_data = get_media(server_address, filename, "", output_dir)
                save_path = video_path
                os.makedirs(os.path.dirname(save_path), exist_ok=True)
                with open(save_path, "wb") as f:
                    f.write(video_data)
                videos_output.append(save_path)
            outputs[schemas["outputs"][node_id]["name"]] = videos_output
    return_dict = {
        "outputs": outputs
    }
    return jsonify(return_dict)


