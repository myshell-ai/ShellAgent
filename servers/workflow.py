from proconfig.widgets.base import WIDGETS
import os
import time
import json
import threading
import queue
from typing import Literal
import json
import traceback
from filelock import FileLock
import uuid
from proconfig.widgets.base import WIDGETS
from proconfig.utils.misc import convert_unserializable_display, hash_dict
from proconfig.utils.pytree import tree_map
from proconfig.core import Workflow
from proconfig.runners.runner import Runner
from proconfig.core.constant import return_breakpoint_cache_dir
from proconfig.widgets.imagen_widgets.utils.model_manager import safe_download
from proconfig.utils.widget_manager import install_widget

from typing import Dict
from fastapi import HTTPException
from fastapi.responses import JSONResponse, StreamingResponse
from servers.base import app, WORKFLOW_SAVE_ROOT, MODEL_DIR, CUSTOM_WIDGETS_DIR, WORKFLOW_RUNS_SAVE_ROOT

@app.get("/api/workflow/get_widget_list")
async def get_widget_list():
    widget_names = list(WIDGETS.module_dict.keys())
    response = {
        "widget_list": [
            {
                "name": name,
                "display_name": WIDGETS._name_mapping.get(name, "Warning: Display Name not Specified")
            }
            for name in widget_names
        ]
    }
    return response

@app.get("/api/workflow/get_widget_category_list")
async def get_widget_category_list():
    # Step 1: Get categories
    usage_to_categories_map = {}

    for category, widget_names in WIDGETS.category_dict.items():
        usage_name = category.split('/')[0]
        category_name = category.split('/')[1] if isinstance(category, str) else category.value
        if category_name == '':
            continue
        if usage_name not in usage_to_categories_map:
            usage_to_categories_map[usage_name] = []

        sub_widget_items = [
            {
                "name": widget_name,
                "display_name": WIDGETS._name_mapping.get(widget_name, "Warning: Display Name not Specified")
            }
            for widget_name in widget_names
        ]

        usage_to_categories_map[usage_name].append(
            {
                "name": category_name,
                "children": sub_widget_items
            }
        )

    response = {
        "widget_list": [
            {
                "title": usage,
                "items": usage_to_categories_map[usage]
            }
            for usage in usage_to_categories_map
        ]
    }
    return response


@app.post("/api/workflow/get_widgets_by_category")
async def get_widgets_by_category(data: Dict) -> Dict:
    response = {
        "widget_list": list(WIDGETS.category_dict.get(data['widget_category'], []))
    }
    return response

@app.post("/api/workflow/get_widget_schema")
async def get_widget_schema(data: Dict[str, str]) -> Dict:
    widget_name = data["widget_name"]
    WidgetClass = WIDGETS.module_dict[widget_name]
    
    response = {}
    if len(WidgetClass.InputsSchemaDict) > 0:  # multiple inputs schema
        response["input_schema"] = {
            k: v.model_json_schema()
            for k, v in WidgetClass.InputsSchemaDict.items()
        }
        response["multi_input_schema"] = True
    else:
        response["input_schema"] = WidgetClass.InputsSchema.model_json_schema()
        response["multi_input_schema"] = False
    
    response["output_schema"] = WidgetClass.OutputsSchema.model_json_schema()
    
    return response


@app.post("/api/workflow/save")
async def save(data: Dict) -> Dict:
    flow_id = data["flow_id"]
    backend = data["workflow"]
    
    # Check if all required keys in the backend are empty
    if all(len(backend.get(key, {})) == 0 for key in ["blocks", "inputs", "outputs", "context"]):
        response = {
            "success": False,
            "message": "empty proconfig"
        }
    else:
        frontend = {k: data[k] for k in ["config", "reactflow"]}
        save_root = f"{WORKFLOW_SAVE_ROOT}/{flow_id}/latest"
        os.makedirs(save_root, exist_ok=True)
        
        # Save backend and frontend configurations to JSON files
        with open(f"{save_root}/proconfig.json", "w") as backend_file:
            json.dump(backend, backend_file, indent=2)
        with open(f"{save_root}/reactflow.json", "w") as frontend_file:
            json.dump(frontend, frontend_file, indent=2)
        
        response = {
            "success": True
        }
    
    return response


@app.post("/api/workflow/get_version_list")
async def get_version_list(data: Dict):
    flow_id = data.get("flow_id")

    if not flow_id:
        raise HTTPException(status_code=400, detail="flow_id is required")

    flow_path = os.path.join(WORKFLOW_SAVE_ROOT, flow_id)

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

@app.post("/api/workflow/release")
async def release(data: Dict) -> Dict:
    flow_id = data["flow_id"]
    backend = data["workflow"]
    metadata = data["metadata"]
    tag = data.get("version_name", "")
    
    # Calculate version hash and construct the save tag
    version_hash = hash_dict(data)
    save_tag = f"{tag}({version_hash})"
    
    # Prepare frontend data and save directory path
    frontend = {k: data[k] for k in ["config", "reactflow"]}
    save_root = f"{WORKFLOW_SAVE_ROOT}/{flow_id}/{save_tag}"
    os.makedirs(save_root, exist_ok=True)
    
    # Save backend, frontend, and metadata to JSON files
    with open(f"{save_root}/proconfig.json", "w") as backend_file:
        json.dump(backend, backend_file, indent=2)
    with open(f"{save_root}/reactflow.json", "w") as frontend_file:
        json.dump(frontend, frontend_file, indent=2)
    with open(f"{save_root}/metadata.json", "w") as metadata_file:
        json.dump(metadata, metadata_file, indent=2)
    
    response = {
        "success": True
    }
    return response



@app.post("/api/workflow/get_proconfig")
async def get_proconfig(data: Dict):
    flow_id = data.get("flow_id")
    version = data.get("version_name", "latest")
    save_root = f"{WORKFLOW_SAVE_ROOT}/{flow_id}/{version}"
    proconfig_file = f"{save_root}/proconfig.json"
    
    if os.path.isfile(proconfig_file):
        with open(proconfig_file) as f:
            proconfig = json.load(f)
    else:
        proconfig = {}
    
    response = {
        "data": proconfig
    }
    return JSONResponse(content=response)

@app.post("/api/workflow/get_flow")
async def get_flow(data: Dict):
    flow_id = data.get("flow_id")
    version = data.get("version_name", "latest")
    save_root = f"{WORKFLOW_SAVE_ROOT}/{flow_id}/{version}"
    flow_file = f"{save_root}/reactflow.json"
    
    if os.path.isfile(flow_file):
        with open(flow_file) as f:
            response = json.load(f)
    else:
        response = {}

    # Get the metadata
    metadata_file = f"{save_root}/metadata.json"
    if os.path.isfile(metadata_file):
        with open(metadata_file) as f:
            metadata = json.load(f)
    else:
        metadata = {}
    
    response["metadata"] = metadata
    return JSONResponse(content=response)

@app.post("/api/workflow/get_workflow_versions")
async def get_workflow_versions(data: Dict):
    flow_id = data.get("flow_id")
    versions = os.listdir(f"{WORKFLOW_SAVE_ROOT}/{flow_id}")
    
    response = {"versions": versions}
    return JSONResponse(content=response)


# SSE
clients = []
tasks_queue = []

@app.post("/api/workflow/run")
@app.get("/api/workflow/run")  # Handling both POST and GET requests
async def run_workflow(data: Dict):
    workflow = Workflow.model_validate(data["workflow"])
    
    environ = {}
    payload = data["user_input"]
    print(f'\n\n\n payload is {payload} \n\n\n')
    node_id_map = data.get("node_id_map", {})
    task_id = str(uuid.uuid4().hex)
    
    if task_id not in tasks_queue:
        tasks_queue.append(task_id)
        print("updated tasks_queue:", tasks_queue)
    
    environ["CURRENT_TASK_ID"] = task_id
    client_queue = queue.Queue()
    
    def generate(environ, client_queue):
        while True:
            try:
                message = client_queue.get(timeout=1)
                if message == '@@END_RUN@@':
                    break
                yield message
            except queue.Empty:
                data = json.dumps({})
                message = f"event: heartbeat\ndata: {data}\n\n"
                yield message
                continue

    run_from_breakpoint = False
    threading.Thread(target=execute, args=(task_id, client_queue, workflow, environ, payload, node_id_map, run_from_breakpoint)).start()
    
    return StreamingResponse(generate(environ, client_queue), media_type='text/event-stream', headers={
        'Connection': 'keep-alive',
        'Content-Encoding': 'none',
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': '*',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Credentials': 'true'
    })


def execute(task_id, client_queue, workflow, environ, payload, node_id_map, run_from_breakpoint=False):
    def callback(
        event_type=Literal['workflow_start', 'workflow_end', 'task_start', 'task_end', 'task_running', 'breakpoint'],
        inputs=None,
        outputs=None, 
        create_time=None, 
        finish_time=None, 
        task_status: Literal['start', 'succeeded', 'failed'] = None,
        task_name=None,
        progress=None,
    ):
        event_type = event_type.replace("task_", "node_")
        # inputs = {k: v.__dict__ if isinstance(v, EasyDict) else v for k, v in inputs.items()}
        data = {
            "input": tree_map(convert_unserializable_display, inputs),
            "output": tree_map(convert_unserializable_display, outputs),
            "node_id": node_id_map.get(task_name, task_name),
            "create_time": create_time,
            "finish_time": finish_time,
            "node_status": task_status,
            "task_id": task_id,
        }
        json_data = json.dumps(data)
        message = f"event: {event_type}\ndata: {json_data}\n\n"
        client_queue.put(message)
        
        run_data_path = os.path.join(WORKFLOW_RUNS_SAVE_ROOT, task_id, "runtime_data.json")
        os.makedirs(os.path.dirname(run_data_path), exist_ok=True)
        with FileLock(run_data_path + ".lock"):
            json.dump(data, open(run_data_path, "w"), indent=2)
    
    # waiting
    while tasks_queue[0] != task_id:
        time.sleep(2)
        num_previous_tasks = tasks_queue.index(task_id)
        data = json.dumps({"previous_tasks": num_previous_tasks})
        message = f"event: queuing\ndata: {data}\n\n"
        client_queue.put(message)
        
    runner = Runner(callback=callback)
    try:
        runner.run_workflow(workflow, environ, payload, run_from_breakpoint=run_from_breakpoint)
    except Exception as e:
        error_message = str(e)
        error_message_detail = str(traceback.print_exc())
        callback("workflow_end", outputs={"error_message": error_message, "error_message_detail": error_message_detail}, task_status='failed')
        time.sleep(3)
        abort(500, description=error_message)
        pass
    finally:
        assert tasks_queue[0] == task_id
        tasks_queue.pop(0)
        print("after tasks queue:", tasks_queue)
        client_queue.put('@@END_RUN@@')

