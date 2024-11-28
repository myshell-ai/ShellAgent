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

from filelock import FileLock

import re
from proconfig.utils.misc import convert_unserializable_display, hash_dict

from pydantic import BaseModel

from proconfig.widgets.tools.dependency_checker import check_dependency
from proconfig.core import Automata
from proconfig.runners.runner import Runner
from proconfig.utils.misc import convert_unserializable_display, process_local_file_path_async
from proconfig.utils.pytree import tree_map
from proconfig.core.chat import (
    ServerMessage, MessageComponentsContainer, MessageComponentsButton, 
    MessageComponentsButtonAction, MessageComponentsTypeEnum, MessageInputSetting, 
    EmbedObj, EmbedObjStatus, EmbedObjType,
    SessionState
)

from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse, StreamingResponse

from servers.base import app, APP_SAVE_ROOT, WORKFLOW_SAVE_ROOT, APP_RUNS_SAVE_ROOT, PROJECT_ROOT
from proconfig.core.exception import ShellException

from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.asymmetric import padding
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.backends import default_backend

with open("assets/public_key.pem", "rb") as key_file:
    public_key = serialization.load_pem_public_key(key_file.read(), backend=default_backend())

def encrypt_message(public_key, message):
    encrypted_message = public_key.encrypt(
        message.encode(),
        padding.OAEP(
            mgf=padding.MGF1(algorithm=hashes.SHA256()),
            algorithm=hashes.SHA256(),
            label=None
        )
    )
    return encrypted_message

def export_env_variables(public_key, env_vars):
    encrypted_vars = {k: encrypt_message(public_key, v).hex() for k, v in env_vars.items()}
    return encrypted_vars

# app related
@app.post("/api/app/save")
async def save_app(data: Dict):
    try:
        flow_id = data["app_id"]
        backend = data["automata"]

        # Check if backend is empty
        if all([len(backend.get(key, {})) == 0 for key in ["blocks", "context"]]):
            return {"success": False, "message": "empty proconfig"}
        else:
            frontend = {
                "config": data["config"],
                "reactflow": data["reactflow"]
            }
            
            save_root = f"{APP_SAVE_ROOT}/{flow_id}/latest"
            os.makedirs(save_root, exist_ok=True)
            
            # Lock and save files
            with FileLock(os.path.join(save_root, "lock.lock")):
                json.dump(backend, open(f"{save_root}/automata.json", "w"), indent=2)
                json.dump(frontend, open(f"{save_root}/reactflow.json", "w"), indent=2)
            
            return {"success": True}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
    

@app.post("/api/app/get_version_list")
async def get_version_list(data: Dict):
    flow_id = data.get("app_id")

    if not flow_id:
        raise HTTPException(status_code=400, detail="flow_id is required")

    flow_path = os.path.join(APP_SAVE_ROOT, flow_id)

    if not os.path.exists(flow_path):
        raise HTTPException(status_code=404, detail="Flow ID not found")

    versions = os.listdir(flow_path)
    if not versions:
        return {"data": []}

    # Reorder the versions as in the original code
    versions = [versions[0]] + versions[1:][::-1]

    return_data = []
    for version in versions:
        version_path = os.path.join(flow_path, version)
        create_time = os.path.getctime(version_path)
        return_data.append({
            "version_name": version,
            "create_time": create_time
        })

    return {"data": return_data}

@app.post("/api/app/release")
async def release(data: Dict) -> Dict:
    flow_id = data["app_id"]
    backend = data["automata"]
    metadata = data["metadata"]
    
    tag = data.get("version_name", "")
    
    # Calculate version hash and construct the save tag
    version_hash = hash_dict(data)
    save_tag = f"{tag}({version_hash})"
    
    # Prepare frontend data and save directory path
    frontend = {k: data[k] for k in ["config", "reactflow"]}
    save_root = f"{APP_SAVE_ROOT}/{flow_id}/{save_tag}"
    os.makedirs(save_root, exist_ok=True)
    
    # Save backend, frontend, and metadata to JSON files
    with open(f"{save_root}/automata.json", "w") as backend_file:
        json.dump(backend, backend_file, indent=2)
    with open(f"{save_root}/reactflow.json", "w") as frontend_file:
        json.dump(frontend, frontend_file, indent=2)
    with open(f"{save_root}/metadata.json", "w") as metadata_file:
        json.dump(metadata, metadata_file, indent=2)
    
    response = {
        "success": True
    }
    return response    


@app.post("/api/app/get_automata")
async def get_automata(data: Dict):
    try:
        flow_id = data["app_id"]
        version = data.get("version_name", "latest")
        save_root = os.path.join(APP_SAVE_ROOT, flow_id, version)
        proconfig_file = os.path.join(save_root, "automata.json")

        # Check if the automata file exists
        if os.path.isfile(proconfig_file):
            proconfig = json.load(open(proconfig_file))
        else:
            print(proconfig_file)
            proconfig = {}

        return {"data": proconfig}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/app/get_flow")
async def get_app_flow(data: Dict):
    try:
        flow_id = data["app_id"]
        version = data.get("version_name", "latest")
        save_root = os.path.join(APP_SAVE_ROOT, flow_id, version)

        # Load flow file (reactflow.json)
        flow_file = os.path.join(save_root, "reactflow.json")
        if os.path.isfile(flow_file):
            response = json.load(open(flow_file))
        else:
            response = {}

        # Load metadata file (metadata.json)
        metadata_file = os.path.join(save_root, "metadata.json")
        if os.path.isfile(metadata_file):
            metadata = json.load(open(metadata_file))
        else:
            metadata = {}

        # Add metadata to the response
        response["metadata"] = metadata

        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# export
@app.post('/api/app/export')
async def export_app(data: dict):
    try:
        automata_path = os.path.join(APP_SAVE_ROOT, data["app_id"], data["version_name"], "automata.json")
        metadata_path = os.path.join(APP_SAVE_ROOT, data["app_id"], data["version_name"], "metadata.json")
        reactflow_path = os.path.join(APP_SAVE_ROOT, data["app_id"], data["version_name"], "reactflow.json")

        with open("settings.json") as f:
            settings = json.load(f)
            
        with open(metadata_path) as f:
            metadata = json.load(f)
        
        with open(automata_path) as f:
            automata = json.load(f)
            
        with open(reactflow_path) as f:
            reactflow = json.load(f)
        
        dependency_results, automata = check_dependency(automata)
        
        # Get the workflows
        workflows = {}
        for workflow_id in dependency_results["workflow_ids"]:
            workflow_path = os.path.join(WORKFLOW_SAVE_ROOT, workflow_id, "proconfig.json")
            with open(workflow_path) as f:
                workflow = json.load(f)
            workflows[workflow_id] = workflow
            
        # Get the comfyui workflows
        comfyui_workflows = {}
        comfyui_dependencies = {
            "comfyui_version": {},
            "custom_nodes": [],
            "models": {},
            "files": {},
            "pypi": {}
        }
        custom_node_names = []
        
        if len(dependency_results["comfy_workflow_path_id_map"]) > 0:
            comfy_workflow_path_id_map = dependency_results["comfy_workflow_path_id_map"]
        else: # old
            comfy_workflow_path_id_map = {}
            for comfyui_workflow_id in dependency_results["comfyui_workflow_ids"]:
                shellagent_json_path = os.path.join(PROJECT_ROOT, "comfy_workflow", comfyui_workflow_id, "workflow.shellagent.json")
                comfy_workflow_path_id_map[shellagent_json_path] = comfyui_workflow_id
        
        for shellagent_json_path, comfyui_workflow_id in comfy_workflow_path_id_map.items():
        # for comfyui_workflow_id in dependency_results["comfyui_workflow_ids"]:
        #     shellagent_json_path = os.path.join(PROJECT_ROOT, "comfy_workflow", comfyui_workflow_id, "workflow.shellagent.json")
            with open(shellagent_json_path) as f:
                shellagent_json = json.load(f)
            comfyui_workflows[comfyui_workflow_id] = {
                "workflow": shellagent_json["workflow"],
                "workflow_api": shellagent_json["workflow_api"],
                "schemas": shellagent_json["schemas"],
            }
            for k in ["comfyui_version", "models", "files", "pypi"]:
                comfyui_dependencies[k].update(shellagent_json["dependencies"].get(k, {}))
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
        
        envs = settings["envs"]
        sensitive_keys = ["MYSHELL_API_KEY", "OPENAI_API_KEY", "COMFYUI_API", "HTTP_PROXY", "HTTPS_PROXY"]
        for key in sensitive_keys:
            envs.pop(key, None)

        results = {
            "data": {
                **exported_data,
                "comfyui_workflows": comfyui_workflows,
                "comfyui_dependencies": comfyui_dependencies,
                "metadata": metadata,
                "reactflow": reactflow,
                "dependency": {
                    "models": dependency_results["models"],
                    "widgets": dependency_results["widgets"]
                },
                "envs": export_env_variables(public_key, envs)
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

    return results


# app run

from proconfig.utils.misc import convert_unserializable_display
from proconfig.utils.pytree import tree_map
from proconfig.core.chat import ServerMessage, MessageComponentsContainer, MessageComponentsButton, \
    MessageComponentsButtonAction, MessageComponentsTypeEnum, MessageInputSetting, EmbedObj, \
    EmbedObjStatus, EmbedObjType


    
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

def generate_sess_id():
    return str(uuid.uuid1())

EVENT_MAPPING_KEY = "EVENT_MAPPING"
CHAT_MESSAGE = "CHAT_MESSAGE"

@app.post('/api/app/init_bot')
async def init_bot(data: dict):
    try:
        automata = Automata.model_validate(data['automata'])  # Validate input
        session_id = generate_sess_id()
        sess_id_to_automata[session_id] = automata  # Store in session
        
        return_data = {
            "session_id": session_id
        }
    except Exception as e:
        error_message = str(traceback.format_exc())
        return_data = {
            "session_id": None,
            "message": error_message
        }

    return JSONResponse(content=return_data)
    

sess_states: Dict[str, SessionState] = {}

# SSE
clients = []
tasks_queue = []
@app.post('/api/app/run')
@app.get('/api/app/run')
async def app_run(event_data: RunAppRequest):

    automata = sess_id_to_automata[event_data.session_id]
    
    sess_id = event_data.session_id
    sess_state = sess_states.get(sess_id, SessionState())
    
    # Decide the event_name
    if event_data.messageType == 15:
        event_name = event_data.buttonId
    elif event_data.messageType == 1:
        event_name = "CHAT"
        # Build the form data
        event_data.form_data[CHAT_MESSAGE] = event_data.text
    else:
        event_name = None
    
    target_state = automata.initial if event_name is None else sess_state.event_mapping[event_name].target_state
    payload = {}
    if event_name is not None:
        payload.update(getattr(sess_state.event_mapping[event_name], "target_inputs_transition", {}))
    payload.update(event_data.form_data)
        
    sess_state.current_state = target_state
    
    task_id = str(uuid.uuid4().hex)
    if task_id not in tasks_queue:
        tasks_queue.append(task_id)
        print("updated tasks_queue:", tasks_queue)
        

    environ = sess_state.environ
    environ["CURRENT_TASK_ID"] = sess_id

    # Define generator for streaming
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
    
    # Start the thread to execute automata
    threading.Thread(target=execute_automata, args=(task_id, client_queue, automata, payload, sess_id, sess_state)).start()
    
    # Create StreamingResponse for SSE
    resp = StreamingResponse(generate(client_queue), media_type='text/event-stream')
    headers = {
        'Connection': 'keep-alive',
        'Content-Encoding': 'none',
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': '*',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Credentials': 'true'
    }
    
    # Add headers to response
    for k, v in headers.items():
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
            elif v.type in ["image", "video", "text_file", "file"]:
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
        if os.path.isfile(new_file_uri):
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
        schema, _ = build_form_schema(event_mapping[buttonId].target_inputs)
        
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
            payload=event_mapping[buttonId].target_inputs_transition,
        )
        buttons.append(
            MessageComponentsContainer(
                type=MessageComponentsTypeEnum.BUTTON,
                button=message_component_button,
            )
        )
        
    if "CHAT" in event_mapping:
        _, inputSetting = build_form_schema(event_mapping["CHAT"].target_inputs)
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
                try:
                    ext = media.rsplit(".", 1)[-1]
                except:
                    error = {
                        'error_code': 'SHELL-1111',
                        'error_head': 'Value Error', 
                        'msg': f"{media} is not a valid {media_key}. Please check the automata defination.",
                    }
                    raise ShellException(**error)
                
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

def execute_automata(task_id, client_queue, automata, payload, sess_id, sess_state):
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
        sess_state, render = runner.run_automata(automata, sess_state, payload)
        # add message count
        sess_states[sess_id] = sess_state
        server_message = parse_server_message(sess_id, render, sess_state.event_mapping, sess_state.message_count)
        sess_state.message_count += 1
        callback('state_exit', server_message=server_message.model_dump(), create_time=create_time, finish_time=time.time(), task_status="succeeded")
    except ShellException as e:
        if e.traceback is None:
            e.traceback = traceback.format_exc()
        error_messages = {
            "error_message": e.error_head,
            "error_message_detail": e.traceback
        }
        callback('state_exit', outputs={"runningError": e.format_dict(), **error_messages}, create_time=create_time, finish_time=time.time(), task_status="failed")
    except Exception as e:
        error_message_detail = traceback.format_exc()
        error_message = str(e)
        empty_exception = ShellException("UNKNOWN-9999", "Unknown Error", error_message, error_message_detail)
        error_messages = {
            "error_message": error_message,
            "error_message_detail": error_message_detail
        }
        callback('state_exit', outputs={"runningError": empty_exception.format_dict(), **error_messages}, create_time=create_time, finish_time=time.time(), task_status="failed")
    finally:
        assert tasks_queue[0] == task_id
        tasks_queue.pop(0)
        print("after tasks queue:", tasks_queue)
        
        
class MyShellUserInput(BaseModel):
    type: str
    form: Dict[str, Any] = {}
    button_id: str = ""
    text: str = ""
    embeded_objects: List[str] = None # not used
    
    
class MyShellRunAppRequest(BaseModel):
    proconfig_json: str
    user_input: MyShellUserInput
    store_session: str = "" # json string
    headers: Dict = {}

class MyShellRunAppResponse(BaseModel):
    store_session: str | None # json string
    render_result: ServerMessage | None
    running_error: Dict | None
    

def prepare_payload(automata: Automata, event_data: MyShellUserInput, sess_state: SessionState):
    # Decide the event_name
    if event_data.type == "15":
        event_name = event_data.button_id
    elif event_data.type == "1":
        event_name = "CHAT"
        # Build the form data
        event_data.form[CHAT_MESSAGE] = event_data.text
    else:
        event_name = None
    
    target_state = automata.initial if event_name is None else sess_state.event_mapping[event_name].target_state
    payload = {}
    if event_name is not None:
        payload.update(getattr(sess_state.event_mapping[event_name], "target_inputs_transition", {}))
    payload.update(event_data.form)
    sess_state.current_state = target_state
    return payload
    

def run_automata_stateless_impl(request: MyShellRunAppRequest, queue):
    # first version: no sse
    try:
        runner = Runner()
        automata = json.loads(request.proconfig_json)
        automata = Automata.model_validate(automata)  # Validate input
        
        if request.store_session == "":
            sess_state = SessionState()
        else:
            sess_state_dict = json.loads(request.store_session)
            sess_state = SessionState.model_validate(sess_state_dict)
            
        sess_state.environ["MYSHELL_HEADERS"] = request.headers
        sess_state.environ["CURRENT_TASK_ID"] = hash_dict(request.headers)
            
        payload = prepare_payload(automata, request.user_input, sess_state)
        sess_state, render = runner.run_automata(automata, sess_state, payload)
        server_message = parse_server_message("", render, sess_state.event_mapping, sess_state.message_count)
        sess_state.message_count += 1
        sess_state_str = sess_state.model_dump_json()
        running_error = None
    except ShellException as e:
        if e.traceback is None:
            e.traceback = traceback.format_exc()
        server_message = sess_state_str = None
        running_error = e.format_dict()
    except Exception as e:
        error_message_detail = traceback.format_exc()
        error_message = str(e)
        empty_exception = ShellException("UNKNOWN-9999", "Unknown Error", error_message, error_message_detail)
        running_error = empty_exception.format_dict()
        
    if running_error is not None:
        running_error["trace_id"] = request.headers.get("x-myshell-openapi-trace-id", "")
        
    result = MyShellRunAppResponse(
        store_session=sess_state_str,
        render_result=server_message,
        running_error=running_error
    )

    queue.put(result)
    return result
    
    
@app.post('/api/app/run_stateless')
async def run_automata_stateless(request: MyShellRunAppRequest):
    result_queue = queue.Queue()
    thread = threading.Thread(target=run_automata_stateless_impl, args=(request, result_queue))
    thread.start()
    thread.join()
    result = result_queue.get()
    # result = run_automata_stateless_impl(request)
    return result
