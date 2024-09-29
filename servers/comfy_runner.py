import requests
from flask import request, jsonify, abort, send_from_directory, send_file
import websocket
import uuid
import json
import urllib
import os

from servers.base import app

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

def get_image(server_address, filename, subfolder, folder_type):
    data = {"filename": filename, "subfolder": subfolder, "type": folder_type}
    url_values = urllib.parse.urlencode(data)
    with urllib.request.urlopen("http://{}/view?{}".format(server_address, url_values)) as response:
        return response.read()
    
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
        if node_schema["type"] not in ["text"]: # file input
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
                image_data = get_image(server_address, image['filename'], image['subfolder'], image['type'])
                save_path = os.path.join(image["type"], image['subfolder'], image['filename'])
                os.makedirs(os.path.dirname(save_path), exist_ok=True)
                with open(save_path, "wb") as f:
                    f.write(image_data)
                images_output.append(save_path)
            outputs[schemas["outputs"][node_id]["name"]] = images_output
    return_dict = {
        "outputs": outputs
    }
    return jsonify(return_dict)


