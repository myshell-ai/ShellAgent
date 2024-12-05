import os
from proconfig.widgets.base import BaseWidget, WIDGETS
from typing import Literal, Any, Dict
from proconfig.utils.misc import upload_file_to_myshell
import json
import uuid
import websocket
import urllib
from proconfig.utils.misc import windows_to_linux_path
from pathlib import Path
import requests
import traceback
from proconfig.core.exception import ShellException

# NON_FILE_INPUT_TYPES = ["text", "string", "number", "integer", "float"]


def queue_prompt(workflow, prompt, server_address, client_id):
    p = {"prompt": prompt, "client_id": client_id, "extra_data": {"extra_pnginfo": {"workflow": workflow}}}
    data = json.dumps(p).encode('utf-8')
    req =  urllib.request.Request("{}/prompt".format(server_address), data=data)
    error = None
    try:
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read())
            return data
    except urllib.error.HTTPError as e:
        if e.code == 400:
            # Read the error response content
            error_content = e.read().decode('utf-8')
            # Parse the JSON error message
            error_data = json.loads(error_content)
            # print(f"Error: {error_data['error']}")
            # if 'node_errors' in error_data:
            #     print(f"Node Errors: {error_data['node_errors']}")

            simple_error_msg = ''
            detailed_error_msg = ''

            if error_data.get('error') is not None:
                if error_data['error'].get('type', '') == 'invalid_prompt':
                    error = {
                        'error_code': 'COMFY-1101',
                        'error_head': 'ComfyUI Workflow Validation Error: invalid_prompt', 
                        'msg': error_data['error']['message'], 
                        'traceback': f"Invalid prompt for {error_data['error']['details']}"
                    }
                elif error_data['error'].get('type', '') == 'prompt_no_outputs':
                    error = {
                        'error_code': 'COMFY-1102',
                        'error_head': 'ComfyUI Workflow Validation Error: prompt_no_outputs', 
                        'msg': error_data['error']['message'], 
                        'traceback': f"Your workflow has no output nodes, which is invalid."
                    }
                elif error_data['error'].get('type', '') == 'prompt_outputs_failed_validation':
                    assert isinstance(error_data.get('node_errors', []), dict), f"ComfyUI output is {error_data}"
                    for node_id, error_info in error_data['node_errors'].items():
                        detailed_error_msg += f"* {error_info['class_type']} {node_id}:\n"
                        simple_error_msg += f"* {error_info['class_type']} {node_id}:\n"
                        for reason in error_info['errors']:
                            detailed_error_msg += f"  - {reason['message']}: {reason['details']}\n"
                    error = {
                        'error_code': 'COMFY-1103',
                        'error_head': 'ComfyUI Workflow Validation Error: prompt_outputs_failed_validation',
                        'msg': f"{error_data['error']['message']}:\n {simple_error_msg}", 
                        'traceback': f"The output of your workfow failed to pass validation: \n{detailed_error_msg}"
                    }
                else:
                    error = {
                        'error_code': 'COMFY-1106',
                        'error_head': 'ComfyUI Workflow Validation Error: others',
                        'msg': error_data['error']['message'], 
                        'traceback': f"{error_data['error']['details']}"
                    }
            else:
                if isinstance(error_data.get('node_errors', []), dict):
                    for node_id, error_info in error_data['node_errors'].items():
                        detailed_error_msg += f"* {error_info['class_type']} {node_id}:\n"
                        simple_error_msg += f"* {error_info['class_type']} {node_id}:\n"
                        for reason in error_info['errors']:
                            detailed_error_msg += f"  - {reason['message']}: {reason['details']}\n"

                    if detailed_error_msg != '':
                        error = {
                            'error_code': 'COMFY-1104',
                            'error_head': 'ComfyUI Workflow Validation Error: prompt_inputs_failed_validation', 
                            'msg': f"Prompt inputs failed validation:\n {simple_error_msg}", 
                            'traceback': detailed_error_msg
                        }
            

        else:
            error_traceback = traceback.format_exc()
            error = {
                'error_code': 'COMFY-1106',
                'error_head': 'Unknown HTTPError occurs when we attempt to connect with ComfyUI', 
                'msg': f"HTTP Error: {e.code} - {e.reason}", 
                'traceback': error_traceback
            }
            print(f"HTTP Error: {e.code} - {e.reason}")
    except urllib.error.URLError as e:
        error_traceback = traceback.format_exc()
        error = {
            'error_code': 'COMFY-1106',
            'error_head': 'Unknown URLError occurs when we attempt to connect with ComfyUI', 
            'msg': f"URL Error: {e.reason}", 
            'traceback': error_traceback
        }
    except Exception as e:
        error_traceback = traceback.format_exc()
        error = {
            'error_code': 'COMFY-1106',
            'error_head': 'Unknown Error occurs when we attempt to connect with ComfyUI', 
            'msg': f"General Error: {str(e)}", 
            'traceback': error_traceback
        }
    finally:
        if error is not None:
            raise ShellException(**error)
    return json.loads(urllib.request.urlopen(req).read())

def get_history(server_address, prompt_id):
    with urllib.request.urlopen("{}/history/{}".format(server_address, prompt_id)) as response:
        return json.loads(response.read())

def get_media(server_address, filename, subfolder, folder_type):
    data = {"filename": filename, "subfolder": subfolder, "type": folder_type}
    url_values = urllib.parse.urlencode(data)
    with urllib.request.urlopen("{}/view?{}".format(server_address, url_values)) as response:
        return response.read()

def split_media_path(media_path):
    media_path = windows_to_linux_path(media_path)
    path = Path(media_path)
    output_dir = path.parts[0]
    subfolder = str(Path(*path.parts[1:-1]))
    filename = path.parts[-1]
    return output_dir, subfolder, filename

def comfyui_run(api, workflow, prompt, schemas, user_inputs):
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
        if "url_type" in node_schema: # file input
            if type(input_value) != str:
                error = {
                    'error_code': 'SHELL-1100',
                    'error_head': 'Value Error', 
                    'msg': f"{node_schema['title']} is {input_value}, which is invalid",
                }
                raise ShellException(**error)     

            if input_value.startswith("http"):
                pass
            elif is_local:
                input_value = os.path.join(os.getcwd(), input_value)
                assert os.path.isfile(input_value), f"filename {input_value} not exists"
            elif os.path.isfile(input_value):
                # upload to CDN
                print(f"upload {input_value} to cdn:")
                input_value = upload_file_to_myshell(input_value)
                print(input_value)
            
        prompt[node_id]["inputs"]["default_value"] = input_value
        
    prompt_id = queue_prompt(workflow, prompt, http_address, client_id)['prompt_id']

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
    status_json = history["status"]

    if status_json['status_str'] == 'error':
        msgs = status_json['messages']
        for msg in msgs:
            if msg[0] == 'execution_error':
                error_dict = msg[1]
                error_traceback = "".join(error_dict['traceback'])
                error_msg = error_dict['exception_message']
                error = {
                    'error_code': 'COMFY-1000',
                    'error_head': 'ComfyUI Workflow RunTime Error', 
                    'msg': error_msg, 
                    'traceback': error_traceback
                }
                raise ShellException(**error)
    else:
        try:
            outputs = {}
            for node_id in history['outputs']:
                if node_id not in schemas["outputs"]:
                    continue
                node_output = history['outputs'][node_id]
                
                node_output_schema = schemas["outputs"][node_id]
                if node_output_schema["type"] == "array":
                    if node_output_schema["items"].get("url_type") == "image":
                        images_output = []
                        for image in node_output['images']:
                            image_data = get_media(http_address, image['filename'], image['subfolder'], image['type'])
                            save_path = os.path.join(image["type"], image['subfolder'], image['filename'])
                            os.makedirs(os.path.dirname(save_path), exist_ok=True)
                            save_path = windows_to_linux_path(save_path)
                            with open(save_path, "wb") as f:
                                f.write(image_data)
                            images_output.append(save_path)
                        outputs[schemas["outputs"][node_id]["title"]] = images_output
                    elif node_output_schema["items"].get("url_type") == "video":
                        videos_output = []
                        for video_path in node_output['video']:
                            output_dir, subfolder, filename = split_media_path(video_path)
                            video_data = get_media(http_address, filename, subfolder, output_dir)
                            save_path = windows_to_linux_path(video_path)
                            os.makedirs(os.path.dirname(save_path), exist_ok=True)
                            with open(save_path, "wb") as f:
                                f.write(video_data)
                            videos_output.append(save_path)
                        outputs[schemas["outputs"][node_id]["title"]] = videos_output
                elif node_output_schema["type"] == "string":
                    if node_output_schema.get("url_type") == "image":
                        image = node_output['images'][0]
                        image_data = get_media(http_address, image['filename'], image['subfolder'], image['type'])
                        save_path = os.path.join(image["type"], image['subfolder'], image['filename'])
                        save_path = windows_to_linux_path(save_path)
                        os.makedirs(os.path.dirname(save_path), exist_ok=True)
                        with open(save_path, "wb") as f:
                            f.write(image_data)
                        outputs[schemas["outputs"][node_id]["title"]] = save_path  
                    elif node_output_schema.get("url_type") == "video":
                        video_path = node_output['video'][0]
                        output_dir, subfolder, filename = split_media_path(video_path)
                        video_data = get_media(http_address, filename, subfolder, output_dir)
                        save_path = windows_to_linux_path(video_path)
                        os.makedirs(os.path.dirname(save_path), exist_ok=True)
                        with open(save_path, "wb") as f:
                            f.write(video_data)
                        outputs[schemas["outputs"][node_id]["title"]] = save_path
                    else:
                        outputs[schemas["outputs"][node_id]["title"]] = node_output["output"][0]
                else:
                    outputs[schemas["outputs"][node_id]["title"]] = node_output["output"][0]
        except Exception as e:
            error = {
                'error_code': 'COMFY-1105',
                'error_head': 'ComfyUI Workflow Output Processing Error', 
                'msg': f'Error occurs when we deal with the outputs of ComfyUI workflow with ShellAgent-Plugin nodes: {str(e)}', 
                'traceback': traceback.format_exc()
            }
            raise ShellException(**error)
                
        # check outputs
        for node_id, schema in schemas["outputs"].items():
            if schema["title"] not in outputs:
                error = {
                    'error_code': 'COMFY-1105',
                    'error_head': 'ComfyUI Workflow Output Processing Error', 
                    'msg': f"ShellAgent outputs Node '{schema['title']}' cannot be founded in the ComfyUI results. Please check the ComfyUI workflow: {str(e)}", 
                    'traceback': f"The output schemas for your workflow are {[schema['title'] for schema in schemas['outputs'].values()]}. However, there is at least one missing output is missing in the final outputs of ComfyUI {outputs}."
                }
                raise ShellException(**error)
        return outputs


def comfyui_run_myshell(workflow_id, inputs, extra_headers):
    if "MYSHELL_TEST_DEPLOY" in os.environ:
        url = "https://openapi-test.myshell.fun/public/v1/workflow/run"
    else:
        url = "https://openapi.myshell.ai/public/v1/workflow/run"

    headers = {
        "x-myshell-openapi-key": os.environ["MYSHELL_API_KEY"],
        "Content-Type": "application/json",
        **extra_headers,
    }
    
    inputs = {k: v for k, v in inputs.items() if k not in ['callback', 'widget_run_id'] }
    data = {
        "workflow_id": workflow_id,
        "input": json.dumps(inputs)
    }
    
    response = requests.post(url, headers=headers, json=data)
    # Parse the JSON response
    if response.status_code == 200:
        return json.loads(response.json()['result'])
    else:
        error = {
            'error_code': 'SHELL-1109',
            'error_head': 'HTTP Request Error', 
            'msg': f"workflow {workflow_id} failed to run",
        }
        raise ShellException(**error)


@WIDGETS.register_module()
class ComfyUIWidget(BaseWidget):
    NAME = "ComfyUI Widget"
    CATEGORY = 'Visual Generation/ComfyUI Widget'
    
    dynamic_schema = True
    
    def execute(self, environ, config):
        comfy_extra_inputs = config.pop("comfy_extra_inputs")

        if "MYSHELL_DEPLOY" in os.environ:
            outputs = comfyui_run_myshell(
                comfy_extra_inputs["comfy_workflow_id"],
                config,
                environ.get("MYSHELL_HEADERS", {}),
            )
        else:
            if comfy_extra_inputs.get("location"):
                shellagent_json_path = comfy_extra_inputs["location"]
            else:
                comfy_workflow_root = os.path.join(os.environ["PROCONFIG_PROJECT_ROOT"], "comfy_workflow")
                shellagent_json_path = os.path.join(comfy_workflow_root, comfy_extra_inputs["comfy_workflow_id"], "workflow.shellagent.json")
                
            shellagent_json = json.load(open(shellagent_json_path))
            outputs = comfyui_run(
                comfy_extra_inputs["api"],
                shellagent_json["workflow"],
                shellagent_json["workflow_api"],
                shellagent_json["schemas"],
                config
            )
        return outputs
