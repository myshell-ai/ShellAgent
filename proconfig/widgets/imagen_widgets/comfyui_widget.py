import os
from proconfig.widgets.base import BaseWidget, WIDGETS
from typing import Literal, Any, Dict
from proconfig.utils.misc import upload_file_to_myshell
import json
import uuid
import websocket
import urllib


NON_FILE_INPUT_TYPES = ["text", "number", "integer"]


def queue_prompt(prompt, server_address, client_id):
    p = {"prompt": prompt, "client_id": client_id}
    data = json.dumps(p).encode('utf-8')
    req =  urllib.request.Request("{}/prompt".format(server_address), data=data)
    return json.loads(urllib.request.urlopen(req).read())

def get_history(server_address, prompt_id):
    with urllib.request.urlopen("{}/history/{}".format(server_address, prompt_id)) as response:
        return json.loads(response.read())

def get_media(server_address, filename, subfolder, folder_type):
    data = {"filename": filename, "subfolder": subfolder, "type": folder_type}
    url_values = urllib.parse.urlencode(data)
    with urllib.request.urlopen("{}/view?{}".format(server_address, url_values)) as response:
        return response.read()

def comfyui_run(api, prompt, schemas, user_inputs):
    server_address = api.split("//")[-1]
    if server_address.endswith("/"):
        server_address = server_address[:-1]
    print("server address:", server_address)
    httpx = "https" if "https" in api else "http"
    wsx = "wss" if httpx == "https" else "ws"
    ws_address = f"{wsx}://{server_address}"
    http_address = f"{httpx}://{server_address}"
    
    is_local = "localhost" in server_address or "127.0.0.1" in server_address
    
    client_id = str(uuid.uuid4())
    ws = websocket.WebSocket()
    ws.connect("{}/ws?clientId={}".format(ws_address, client_id))
    # first replace the prompt
    
    for node_id, node_schema in schemas["inputs"].items():
        input_value = user_inputs[node_id]
        if node_schema["type"] not in NON_FILE_INPUT_TYPES: # file input
            if is_local:
                input_value = os.path.join(os.getcwd(), input_value)
            else:
                # upload to CDN
                input_value = upload_file_to_myshell(input_value)
            
        prompt[node_id]["inputs"]["default_value"] = input_value
        
    prompt_id = queue_prompt(prompt, http_address, client_id)['prompt_id']

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

    history = get_history(http_address, prompt_id)[prompt_id]
    outputs = {}
    for node_id in history['outputs']:
        if node_id not in schemas["outputs"]:
            continue
        node_output = history['outputs'][node_id]
        
    # "outputs": {
    #   "18": {
    #     "title": "output_image",
    #     "type": "array",
    #     "items": {
    #       "type": "string",
    #       "url_type": "image"
    #     }
    #   }
        # if 'images' in node_output:
        node_output_schema = schemas["outputs"][node_id]
        if node_output_schema["type"] == "array" and node_output_schema["items"].get("url_type") == "image":
            images_output = []
            for image in node_output['images']:
                image_data = get_media(http_address, image['filename'], image['subfolder'], image['type'])
                save_path = os.path.join(image["type"], image['subfolder'], image['filename'])
                os.makedirs(os.path.dirname(save_path), exist_ok=True)
                with open(save_path, "wb") as f:
                    f.write(image_data)
                images_output.append(save_path)
            outputs[schemas["outputs"][node_id]["title"]] = images_output
        elif node_output_schema["type"] == "string" and node_output_schema.get("url_type") == "image":
            image = node_output['images'][0]
            image_data = get_media(http_address, image['filename'], image['subfolder'], image['type'])
            save_path = os.path.join(image["type"], image['subfolder'], image['filename'])
            os.makedirs(os.path.dirname(save_path), exist_ok=True)
            with open(save_path, "wb") as f:
                f.write(image_data)
            outputs[schemas["outputs"][node_id]["title"]] = save_path  
        elif node_output_schema["type"] == "array" and node_output_schema["items"].get("url_type") == "video":
            videos_output = []
            for video_path in node_output['video']:
                output_dir, filename = os.path.split(video_path)
                video_data = get_media(http_address, filename, "", output_dir)
                save_path = video_path
                os.makedirs(os.path.dirname(save_path), exist_ok=True)
                with open(save_path, "wb") as f:
                    f.write(video_data)
                videos_output.append(save_path)
            outputs[schemas["outputs"][node_id]["title"]] = videos_output
        elif node_output_schema["type"] == "string" and node_output_schema.get("url_type") == "video":
            video_path = node_output['video'][0]
            output_dir, filename = os.path.split(video_path)
            video_data = get_media(http_address, filename, "", output_dir)
            save_path = video_path
            os.makedirs(os.path.dirname(save_path), exist_ok=True)
            with open(save_path, "wb") as f:
                f.write(video_data)
            outputs[schemas["outputs"][node_id]["title"]] = save_path
    return outputs



@WIDGETS.register_module()
class ComfyUIWidget(BaseWidget):
    NAME = "ComfyUI Widget"
    CATEGORY = 'Visual Generation/ComfyUI Widget'
    
    dynamic_schema = True
    
    def execute(self, environ, config):
        comfy_extra_inputs = config.pop("comfy_extra_inputs")
        comfy_workflow_root = os.path.join(os.environ["PROCONFIG_PROJECT_ROOT"], "comfy_workflow")
        shellagent_json = json.load(open(os.path.join(comfy_workflow_root, comfy_extra_inputs["comfy_workflow_id"], "workflow.shellagent.json")))
        
        outputs = comfyui_run(
            comfy_extra_inputs["api"],
            shellagent_json["workflow_api"],
            shellagent_json["schemas"],
            config
        )
        return outputs