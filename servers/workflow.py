from proconfig.widgets.base import WIDGETS
from flask import request, jsonify
import os
import time
import json
from flask import Response, request, jsonify, abort
import threading
import torch
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

from servers.base import app, WORKFLOW_SAVE_ROOT, MODEL_DIR, CUSTOM_WIDGETS_DIR, WORKFLOW_RUNS_SAVE_ROOT
from pympler.tracker import SummaryTracker
tracker = SummaryTracker()

@app.route(f'/api/workflow/get_widget_list')
def get_widget_list():
    widget_names = list(WIDGETS.module_dict.keys())
    response = {
        "widget_list": [{"name": name, "display_name": WIDGETS._name_mapping.get(name, "Warning: Display Name not Specified")} for name in widget_names]
    }
    return jsonify(response)

@app.route(f'/api/workflow/get_widget_category_list')
def get_widget_category_list():
    # step 1: get categories
    usage_to_categories_map = {}

    for category, widget_names in WIDGETS.category_dict.items():
        usage_name = category.split('/')[0]
        category_name = category.split('/')[1] if type(category) == str else category.value
        if category_name == '':
            continue
        if usage_name not in usage_to_categories_map:
            usage_to_categories_map[usage_name] = []
            
        sub_widget_items = [{
            "name": widget_name,
            "display_name": WIDGETS._name_mapping.get(widget_name, "Warning: Display Name not Specified")
        } for widget_name in widget_names]
        
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
    return jsonify(response)

@app.route(f'/api/workflow/get_widgets_by_category', methods=['POST'])
def get_widgets_by_category():
    data = request.get_json()
    response = {
        "widget_list": list(WIDGETS.category_dict[data['widget_category']])
    }
    return jsonify(response)

@app.route(f'/api/workflow/get_widget_schema', methods=['POST'])
def get_widget_schema():
    data = request.get_json()
    widget_name = data["widget_name"]
    
    WidgetClass = WIDGETS.module_dict[widget_name]
    response = {}
    if len(WidgetClass.InputsSchemaDict) > 0: # multiple inputs schema
        response["input_schema"] = {
            k: v.model_json_schema()
            for k, v in WidgetClass.InputsSchemaDict.items()
        }
        response["multi_input_schema"] = True
    else:
        response["input_schema"] = WidgetClass.InputsSchema.model_json_schema()
        response["multi_input_schema"] = False
    output_schema = WidgetClass.OutputsSchema.model_json_schema()
    response["output_schema"] = output_schema
    return jsonify(response)

@app.route(f'/api/workflow/save', methods=['POST'])
def save():
    data = request.get_json()
    flow_id = data["flow_id"]
    backend = data["workflow"]
    # check empty
    if all([len(backend.get(key, {})) == 0 for key in ["blocks", "inputs", "outputs", "context"]]):
        response = {
            "success": False,
            "message": "empty proconfig"
        }
    else:
        frontend = {
            k: data[k]
            for k in ["config", "reactflow"] 
        }
        save_root = f"{WORKFLOW_SAVE_ROOT}/{flow_id}/latest"
        os.makedirs(save_root, exist_ok=True)
        json.dump(backend, open(f"{save_root}/proconfig.json", "w"), indent=2)
        json.dump(frontend, open(f"{save_root}/reactflow.json", "w"), indent=2)
        
        response = {
            "success": True
        }
    return jsonify(response)

@app.route(f'/api/workflow/get_version_list', methods=['POST'])
def get_version_list():
    data = request.get_json()
    flow_id = data["flow_id"]
    versions = os.listdir(os.path.join(WORKFLOW_SAVE_ROOT, flow_id))
    versions = [versions[0]] + versions[1:][::-1]
    return_data = []
    for version in versions:
        create_time = os.path.getctime(os.path.join(WORKFLOW_SAVE_ROOT, flow_id, version))
        return_data.append({
            "version_name": version,
            "create_time": create_time
        })
    return jsonify({"data": return_data})

@app.route(f'/api/workflow/release', methods=['POST'])
def release():
    data = request.get_json()
    flow_id = data["flow_id"]
    backend = data["workflow"]
    metadata = data["metadata"]
    tag = data.get("version_name", "")
    version_hash = hash_dict(data)
    save_tag = f"{tag}({version_hash})"
    frontend = {
        k: data[k]
        for k in ["config", "reactflow"] 
    }
    save_root = f"{WORKFLOW_SAVE_ROOT}/{flow_id}/{save_tag}"
    os.makedirs(save_root, exist_ok=True)
    json.dump(backend, open(f"{save_root}/proconfig.json", "w"), indent=2)
    json.dump(frontend, open(f"{save_root}/reactflow.json", "w"), indent=2)
    json.dump(metadata, open(f"{save_root}/metadata.json", "w"), indent=2)
    
    response = {
        "success": True
    }
    return jsonify(response)



@app.route(f'/api/workflow/get_proconfig', methods=['POST'])
def get_proconfig():
    data = request.get_json()
    flow_id = data["flow_id"]
    version = data.get("version_name", "latest")
    save_root = f"{WORKFLOW_SAVE_ROOT}/{flow_id}/{version}"
    proconfig_file = f"{save_root}/proconfig.json"
    if os.path.isfile(proconfig_file):
        proconfig = json.load(open(proconfig_file))
    else:
        proconfig = {}
    response = {
        "data": proconfig
    }
    return jsonify(response)

@app.route(f'/api/workflow/get_flow', methods=['POST'])
def get_flow():
    data = request.get_json()
    flow_id = data["flow_id"]
    version = data.get("version_name", "latest")
    save_root = f"{WORKFLOW_SAVE_ROOT}/{flow_id}/{version}"
    flow_file = f"{save_root}/reactflow.json"
    if os.path.isfile(flow_file):
        response = json.load(open(flow_file))
    else:
        response = {}
    # get the metadata
    metadata_file = f"{save_root}/metadata.json"
    if os.path.isfile(metadata_file):
        metadata = json.load(open(metadata_file))
    else:
        metadata = {}
    response["metadata"]= metadata
    return jsonify(response)

@app.route(f'/api/workflow/get_workflow_versions', methods=['POST'])
def get_workflow_versions():
    data = request.get_json()
    flow_id = data["flow_id"]
    versions = os.listdir(f"{WORKFLOW_SAVE_ROOT}/{flow_id}")
    response = {"versions": versions}
    return jsonify(response)


# handle the dependency

def install_dependency(dependency):
    # models
    for model_id, model_info in dependency["models"].items():
        model_save_path = os.path.join(MODEL_DIR, model_info["save_path"], model_info["filename"])
        if not os.path.isfile(model_save_path):
            # download
            assert len(model_info["urls"]) > 0 # must > 0
            safe_download(model_info["urls"][0], model_save_path)
        
    for widget_id, widget_info in dependency["widgets"].items():
        local_path = os.path.join(CUSTOM_WIDGETS_DIR, widget_id, widget_info["commit"])
        if not os.path.isdir(local_path):
            install_widget(widget_info["git"], local_path, widget_info["commit"])
    
# check the workflow json to see if there is breakpoint=True
def _check_breakpoint(workflow_json):
    for task in workflow_json['blocks']:
        if task.get('breakpoint', False):
            print(f"find breakpoint in {task['name']}")
            breakpoint_uuid = uuid.uuid4().hex
            return breakpoint_uuid
    return None

# SSE
clients = []
tasks_queue = []
@app.route(f'/api/workflow/run', methods=['POST', 'GET'])
def run_workflow():
    data = request.get_data()
    data = json.loads(data)

    if "dependency" in data:
        install_dependency(data["dependency"])
        
    # generate debug uuid if need
    breakpoint_uuid = _check_breakpoint(data['workflow'])
    if breakpoint_uuid:
        data["workflow"]['debug_uuid'] = breakpoint_uuid
        save_dir = return_breakpoint_cache_dir()
        json.dump(data, open(os.path.join(save_dir, f'{breakpoint_uuid}.json'), "w"), indent=2)

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
    def generate(environ, client_queue):
        while True:
            try:
                message = client_queue.get(timeout=1)
                if message == '@@END_RUN@@':
                    torch.cuda.empty_cache()
                    print("tracker workflow")
                    tracker.print_diff()
                    break
                yield message
            except queue.Empty:
                data = json.dumps({})
                message = f"event: heartbeat\ndata: {data}\n\n"
                yield message
                continue
            
    client_queue = queue.Queue()
    
    run_from_breakpoint = False
    threading.Thread(target=execute, args=(task_id, client_queue, workflow, environ, payload, node_id_map, run_from_breakpoint)).start()
    resp = Response(generate(environ, client_queue), mimetype='text/event-stream')
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

@app.route(f'/api/workflow/breakpoint/<debug_uuid>')
def debug_stream(debug_uuid):
    save_dir = return_breakpoint_cache_dir()
    with open(os.path.join(save_dir, f'{debug_uuid}.json'), 'r') as file:
        data = json.load(file)
    
    workflow = Workflow.model_validate(data["workflow"])
    environ = {}
    payload = data["user_input"]
    node_id_map = data.get("node_id_map", {})
    
    def generate(client_queue):
        while True:
            try:
                message = client_queue.get(timeout=1)
                if message == '@@END_RUN@@':
                    break
                yield message
            except queue.Empty:
                continue
            
    client_queue = queue.Queue()
    
    while True:
        if len(clients) == 0:
            clients.append(client_queue)
            break
        else:
            time.sleep(2)
    run_from_breakpoint = True
    threading.Thread(target=execute, args=(client_queue, workflow, environ, payload, node_id_map, run_from_breakpoint)).start()
    # return Response(generate(client_queue), mimetype='text/event-stream')
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

@app.route(f'/api/workflow/clear_breakpoint/<breakpoint_uuid>', methods=['GET'])
def delete_breakpoint_cache(breakpoint_uuid):
    save_dir = return_breakpoint_cache_dir()
    try:
        json_filename = os.path.join(save_dir, f'{breakpoint_uuid}.json')
        pkl_filename = os.path.join(save_dir, f'{breakpoint_uuid}.pkl')
        if os.path.isfile(json_filename):
            os.remove(json_filename)
        else:
            print("fail file_path:", json_filename)
            # If the file doesn't exist, return a 404 error
            abort(404)

        if os.path.isfile(pkl_filename):
            os.remove(pkl_filename)
        else:
            print("fail file_path:", pkl_filename)
            # If the file doesn't exist, return a 404 error
            abort(404)

    except Exception as e:
        # Handle unexpected errors
        abort(500, description=str(e))

    finally:
        return jsonify(f'done')