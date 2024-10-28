import os
import json
import queue
import time
import threading
import traceback
import logging
import uuid
from datetime import datetime
from typing import Dict, Any, Literal, List

from flask import Response, request, jsonify
from filelock import FileLock

import re

from pydantic import BaseModel

from proconfig.widgets.tools.dependency_checker import check_dependency
from proconfig.core import Automata
from proconfig.runners.runner import Runner
from proconfig.utils.misc import convert_unserializable_display, process_local_file_path_async
from proconfig.utils.pytree import tree_map
from proconfig.core.chat import (
    ServerMessage, MessageComponentsContainer, MessageComponentsButton, 
    MessageComponentsButtonAction, MessageComponentsTypeEnum, MessageInputSetting, 
    EmbedObj, EmbedObjStatus, EmbedObjType
)

from servers.base import app, APP_SAVE_ROOT, WORKFLOW_SAVE_ROOT, APP_RUNS_SAVE_ROOT, PROJECT_ROOT


# app related
@app.route(f'/api/app/save', methods=['POST'])
def save_app():
    data = request.get_json()
    
    try:
        flow_id = data["app_id"]
        backend = data["automata"]
        
        if all([len(backend.get(key, {})) == 0 for key in ["blocks", "context"]]):
            response = {
                "success": False,
                "message": "empty proconfig"
            }
        else:
            frontend = {
                k: data[k]
                for k in ["config", "reactflow"] 
            }
            save_root = f"{APP_SAVE_ROOT}/{flow_id}/latest"
            os.makedirs(save_root, exist_ok=True)
            
            with FileLock(os.path.join(save_root, "lock.lock")):
                json.dump(backend, open(f"{save_root}/automata.json", "w"), indent=2)
                json.dump(frontend, open(f"{save_root}/reactflow.json", "w"), indent=2)
        
            response = {
                "success": True
            }
    except Exception as e:
        response = {
            "success": False,
            "message": str(e)
        }
    return jsonify(response)

@app.route('/api/app/get_automata', methods=['POST'])
def get_automata():
    data = request.get_json()
    flow_id = data["app_id"]
    version = data.get("version_name", "latest")
    save_root = os.path.join(APP_SAVE_ROOT, flow_id, version)
    proconfig_file = os.path.join(save_root, "automata.json")
    if os.path.isfile(proconfig_file):
        proconfig = json.load(open(proconfig_file))
    else:
        proconfig = {}
    response = {
        "data": proconfig
    }
    return jsonify(response)

@app.route('/api/app/get_flow', methods=['POST'])
def get_app_flow():
    data = request.get_json()
    flow_id = data["app_id"]
    version = data.get("version_name", "latest")
    save_root = os.path.join(APP_SAVE_ROOT, flow_id, version)
    flow_file = os.path.join(save_root, "reactflow.json")
    if os.path.isfile(flow_file):
        response = json.load(open(flow_file))
    else:
        response = {}
    # get the metadata
    metadata_file = os.path.join(save_root, "metadata.json")
    if os.path.isfile(metadata_file):
        metadata = json.load(open(metadata_file))
    else:
        metadata = {}
    response["metadata"] = metadata
    return jsonify(response)


# export
@app.route('/api/app/export', methods=['POST'])
def export_app():
    data = request.get_json()
    
    try:
        automata_path = os.path.join(APP_SAVE_ROOT, data["app_id"], data["version_name"], "automata.json")
        metadata_path = os.path.join(APP_SAVE_ROOT, data["app_id"], data["version_name"], "metadata.json")
        metadata = json.load(open(metadata_path))
        automata = json.load(open(automata_path))
        dependency_results, automata = check_dependency(automata)
        # get the workflows
        workflows = {}
        for workflow_id in dependency_results["workflow_ids"]:
            workflow_path = os.path.join(WORKFLOW_SAVE_ROOT, workflow_id, "proconfig.json") # NOTE: the workflow_id includes the version_name
            workflow = json.load(open(workflow_path))
            workflows[workflow_id] = workflow
            
        # get the comfyui workflows
        comfyui_workflows = {}
        comfyui_dependencies = {
            "comfyui_version": {},
            "custom_nodes": [],
            "models": {},
            "files": {}
        }
        custom_node_names = []
        for comfyui_workflow_id in dependency_results["comfyui_workflow_ids"]:
            shellagent_json_path = os.path.join(PROJECT_ROOT, "comfy_workflow", comfyui_workflow_id, "workflow.shellagent.json")
            shellagent_json = json.load(open(shellagent_json_path))
            comfyui_workflows[comfyui_workflow_id] = {
                "workflow": shellagent_json["workflow"],
                "workflow_api": shellagent_json["workflow_api"],
                "schemas": shellagent_json["schemas"],
            }
            for k in ["comfyui_version", "models", "files"]:
                comfyui_dependencies[k].update(shellagent_json["dependencies"][k])
            for custom_node in shellagent_json["dependencies"]["custom_nodes"]:
                if custom_node["name"] not in custom_node_names:
                    comfyui_dependencies["custom_nodes"].append(custom_node)
                    custom_node_names.append(custom_node["name"])
                    
            
        exported_data = {
            "automata": automata,
            "workflows": workflows,
        }
        logging.info("ready to upload")
        exported_data = process_local_file_path_async(exported_data, data.get("max_workers", 20))
        
        results = {
            "data": {
                **exported_data,
                "comfyui_workflows": comfyui_workflows,
                "comfyui_dependencies": comfyui_dependencies,
                "metadata": metadata,
                "dependency": {
                    "models": dependency_results["models"],
                    "widgets": dependency_results["widgets"]
                }
            },
            "success": True,
            "message": ""
        }
    
    except Exception as e:
        error_message = str(traceback.format_exc())
        results = {
            "data": {},
            "success": False,
            "message_detail": error_message,
            "message": str(e),
        }

    return jsonify(results)


# app run

from proconfig.utils.misc import convert_unserializable_display
from proconfig.utils.pytree import tree_map
from proconfig.core.chat import ServerMessage, MessageComponentsContainer, MessageComponentsButton, \
    MessageComponentsButtonAction, MessageComponentsTypeEnum, MessageInputSetting, EmbedObj, \
    EmbedObjStatus, EmbedObjType



class ProConfigEvent(BaseModel):
    target_state: str = ""
    automata: dict = None
    sess_id: str = ""
    payload: Dict[str, Any] = {}
    
class RunAppRequest(BaseModel):
    form_data: Dict[str, Any] = {}
    session_id: str = ""
    embedObjs: List[Any] = None
    
    buttonId: str = ""
    messageType: int # 1: TEXT,2: VOICE,15: BUTTON_INTERACTION
    
    text: str = None
    # automata: Optional[Automata] = None
    message: str = None
    

sess_id_to_automata = {}
sess_states = {}

def generate_sess_id():
    return str(uuid.uuid1())

EVENT_MAPPING_KEY = "EVENT_MAPPING"
CHAT_MESSAGE = "CHAT_MESSAGE"

@app.route('/api/app/init_bot', methods=['POST'])
def init_bot():
    data = request.get_json()
    try:
        automata = Automata.model_validate(data['automata'])
        session_id = generate_sess_id()
        sess_id_to_automata[session_id] = automata
        
        return_data = {
            "session_id": session_id
        }
    except Exception as e:
        error_message = str(traceback.format_exc())
        return_data = {
            "session_id": None,
            "message": error_message
        }

    return jsonify(return_data)
    
    
# SSE
clients = []
tasks_queue = []
@app.route('/api/app/run', methods=['POST', 'GET'])
def app_run():
    event_data = request.get_data()
    event_data = json.loads(event_data)
    event_data = RunAppRequest.model_validate(event_data)
    
    automata = sess_id_to_automata[event_data.session_id]
        
    sess_id = event_data.session_id
    sess_state = sess_states.get(sess_id, {})
    sess_state["message_count"] = sess_state.get("message_count", 0)
    sess_state[EVENT_MAPPING_KEY] = sess_state.get(EVENT_MAPPING_KEY, {})
    
    # decide the event_name
    if event_data.messageType == 15:
        event_name = event_data.buttonId
    elif event_data.messageType == 1:
        event_name = "CHAT"
        # build the form data
        event_data.form_data[CHAT_MESSAGE] = event_data.text
    else:
        event_name = None
    
    target_state = automata.initial if event_name is None else sess_state[EVENT_MAPPING_KEY][event_name]["target_state"]
    payload = {}
    if event_name is not None:
        payload.update(sess_state[EVENT_MAPPING_KEY][event_name].get("target_inputs_transition", {}))
    payload.update(event_data.form_data)
    
    sess_state["current_state"] = target_state
    
    task_id = str(uuid.uuid4().hex)
    if task_id not in tasks_queue:
        tasks_queue.append(task_id)
        print("updated tasks_queue:", tasks_queue)
        
    sess_state["environ"] = sess_state.get("environ", {})
    environ = sess_state["environ"]
    environ["CURRENT_TASK_ID"] = sess_id
        
    def generate(client_queue):
        while True:
            try:
                message = client_queue.get(timeout=1)
                yield message
                if message.split('\n')[0].startswith("event: state_exit"):
                    break
            except queue.Empty:
                data = json.dumps({})
                message = f"event: heartbeat\ndata: {data}\n\n"
                yield message
                continue
            
    client_queue = queue.Queue()
        
    threading.Thread(target=execute_automata, args=(task_id, client_queue, automata, environ, payload, sess_id, sess_state)).start()
    resp = Response(generate(client_queue), mimetype='text/event-stream')
    headers = [
        ('Connection', 'keep-alive'),
        ('Content-Encoding', 'none'),
        ('Cache-Control', 'no-cache'),
        ('Access-Control-Allow-Origin', '*'),
        ('Access-Control-Allow-Methods', '*'),
        ('Access-Control-Allow-Headers', '*'),
        ('Access-Control-Allow-Credentials', 'true')
    ]
    for k, v in headers:
        resp.headers[k] = v
    return resp


type_map = {
    "text": "string"
}
def build_form_schema(target_inputs):
    if len(target_inputs) == 0:
        return None, MessageInputSetting()
    
    properties = {}
    required = []
    
    canInputText = False 
    canInputAudio = False
    canUploadFile = False
    for k, v in target_inputs.items():
        if v.user_input:
            required.append(k)
        properties[k] = {
            "name": getattr(v, "name"),
            "type": type_map.get(v.type, v.type),
            "description": v.description,
            "default": v.default_value
        }
        if v.choices:
            properties[k]["enum"] = v.choices
            
        if v.source == "IM":
            if v.type == "audio":
                canInputAudio = True
            elif v.type in ["file", "text_file"]:
                canUploadFile = True
            elif v.type in ["text", "string"]:
                canInputText = True
        
    json_schema = {
        "properties": properties,
        "required": required
    }
    
    inputSetting = MessageInputSetting(
        canInputText=canInputText,
        canInputAudio=canInputAudio,
        canUploadFile=canUploadFile
    )
    return json_schema, inputSetting
      
      
def process_text_embeded_uri(text):
    if text is None:
        return ""
    # Define a regular expression to find img, video, and audio tags with src attribute
    def replace_src(match):
        tag, attributes = match.groups()
        # Find the src attribute and replace its value
        file_uri = re.search(r'src=["\']([^"\']+)["\']', attributes).groups()[0]
        
        new_file_uri = file_uri.strip()
        print("file_uri:", file_uri)
        if os.path.isfile(file_uri):
            new_file_uri = "/api/files/" + new_file_uri
        new_attributes = attributes.replace(file_uri, new_file_uri)
        return f"<{tag} {new_attributes}>"
    
    # Regular expression to match <img>, <video>, or <audio> tags with attributes
    pattern = r'<(img|video|audio|source)\s([^>]*src=["\'][^"\']+["\'][^>]*)>'
    
    # Replace the src attribute in all matches
    text = re.sub(pattern, replace_src, text)
    return text

  
RenderTypeMap = {
    "image": EmbedObjType.IMAGE,
    "audio": EmbedObjType.AUDIO,
}
def parse_server_message(session_id, render, event_mapping, message_count):
    # build the componentContainer
    buttons = []
    for button_count, button in enumerate(render.get("buttons", [])):
        buttonId = f'MESSAGE_{message_count}_BUTTON_{button_count}'
        schema, _ = build_form_schema(event_mapping[buttonId]["target_inputs"])
        
        if schema is not None:
            actions = [MessageComponentsButtonAction(
                formSchema=schema
            )]
        else:
            actions = []
        content = {
            "text": button['content'],
        }
        message_component_button = MessageComponentsButton(
            content=content,
            buttonId=buttonId,
            actions=actions,
            payload=event_mapping[buttonId]["target_inputs_transition"],
        )
        buttons.append(
            MessageComponentsContainer(
                type=MessageComponentsTypeEnum.BUTTON,
                button=message_component_button,
            )
        )
        
    if "CHAT" in event_mapping:
        _, inputSetting = build_form_schema(event_mapping["CHAT"]["target_inputs"])
    else:
        inputSetting = MessageInputSetting(
            canInputText=False,
            canInputAudio=False,
            canUploadFile=False
        )
        
    componentContainer = MessageComponentsContainer(
        type=MessageComponentsTypeEnum.CONTAINER,
        components=buttons,
    )
    
    # build images
    objs = []
    
    for media_key, media_type in RenderTypeMap.items():
        if media_key in render:
            logging.info(f"ready to render {render[media_key]}")
            if not type(render[media_key]) == list:
                render[media_key] = [render[media_key]]
            for media in render[media_key]:
                ext = media.rsplit(".", 1)[-1]
                media_obj = EmbedObj(
                    id=None,
                    status=EmbedObjStatus.DONE,
                    type=media_type,
                    extensionName=ext,
                    url=media
                )
                objs.append(media_obj)
            
    current_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    render_text = process_text_embeded_uri(str(render.get("text", "")))
    
    server_message = ServerMessage(
        session_id=session_id,
        id=str(message_count),
        text=render_text,
        status="DONE",
        type="TEXT",
        createdDateUnix=current_time,
        updatedDateUnix=current_time,
        embedObjs=objs,
        componentContainer=componentContainer,
        inputSetting=inputSetting
    )
    return server_message

def execute_automata(task_id, client_queue, automata, environ, payload, sess_id, sess_state):
    def callback(
        event_type=Literal['app_start', 'app_end', 'state_start', 'state_end', 'state_exit', 'task_start', 'task_end'],
        inputs=None,
        outputs=None, 
        create_time=None, 
        finish_time=None, 
        task_status: Literal['start', 'succeeded', 'failed'] = None,
        task_name=None,
        progress=None,
        **kwargs
    ):
        data = {
            "input": tree_map(convert_unserializable_display, inputs),
            "output": tree_map(convert_unserializable_display, outputs),
            "node_id": task_name,
            "create_time": create_time,
            "finish_time": finish_time,
            "node_status": task_status,
            "task_id": task_id,
            "session_id": sess_id,
            **kwargs
        }
        json_data = json.dumps(data)
        message = f"event: {event_type}\ndata: {json_data}\n\n"
        client_queue.put(message)
        
        run_data_path = os.path.join(APP_RUNS_SAVE_ROOT, sess_id, "runtime_data.json")
        os.makedirs(os.path.dirname(run_data_path), exist_ok=True)
        with FileLock(run_data_path + ".lock"):
            if os.path.isfile(run_data_path):
                run_data = json.load(open(run_data_path))
            else:
                run_data = {}
            run_data[task_id] = data
            json.dump(run_data, open(run_data_path, "w"), indent=2)
        
    
    # waiting
    while tasks_queue[0] != task_id:
        time.sleep(2)
        num_previous_tasks = tasks_queue.index(task_id)
        data = json.dumps({"previous_tasks": num_previous_tasks})
        message = f"event: queuing\ndata: {data}\n\n"
        client_queue.put(message)
        
    create_time = time.time()
    runner = Runner(callback=callback)
    try:
        sess_state, render, event_mapping = runner.run_automata(automata, sess_state, environ, payload)
        # add message count
        message_count = sess_state["message_count"]
        event_mapping = {f'MESSAGE_{message_count}_{k}': v for k, v in event_mapping.items()}
        sess_state[EVENT_MAPPING_KEY].update(event_mapping)
        sess_states[sess_id] = sess_state
        server_message = parse_server_message(sess_id, render, event_mapping, sess_state["message_count"])
        sess_state["message_count"] += 1
        callback('state_exit', server_message=server_message.model_dump(), create_time=create_time, finish_time=time.time(), task_status="succeeded")
    except Exception as e:
        error_message_detail = traceback.format_exc()
        error_message = str(e)
        print(error_message_detail)
        callback('state_exit', outputs={"error_message": str(error_message), "error_message_detail": error_message_detail}, create_time=create_time, finish_time=time.time(), task_status="failed")
    finally:
        assert tasks_queue[0] == task_id
        tasks_queue.pop(0)
        print("after tasks queue:", tasks_queue)