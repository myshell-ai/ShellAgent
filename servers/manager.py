import os
import json
import time
import shutil
import re
import queue
import glob
import threading
from typing import Literal
from datetime import datetime
import logging

from flask import request, jsonify, Response
from filelock import FileLock

from pydantic import BaseModel

from fuzzywuzzy import process

from proconfig.widgets.imagen_widgets.utils.model_manager import safe_download
from proconfig.utils.widget_manager import (
    install_widget, get_git_info, get_github_repo_hash, 
    get_github_repo_tags, get_github_repo_commits
)
from proconfig.utils.misc import hash_dict

from servers.base import app, CUSTOM_WIDGETS_DIR, CUSTOM_WIDGETS_STATUS_PATH, get_file_times


sha256_to_info = json.load(open('model_info.json')) # dict

model_list_map_by_id = sha256_to_info

for key, item in sha256_to_info.items():
    item["info_for_query"] = f"{item['filename']}"


class ModelsMarketplaceData(BaseModel):
    name: str
    type: str
    base: str
    link: str
    description: str
    filename: str

types = sorted(list(set([item['type'] for item in sha256_to_info.values()])))
bases = sorted(list(set([item['base'] for item in sha256_to_info.values()])))
save_paths = sorted(list(set([item['save_path'].split("/")[0] for item in sha256_to_info.values()])))

@app.route(f'/api/models/marketplace/types_bases_lists', methods=['POST']) # tested
def types_bases_lists():
    result = {
        "types": types,
        "bases": bases,
        "save_paths": save_paths,
        "message": ""
    }
    return jsonify(result)


@app.route(f'/api/models/marketplace/list', methods=['POST']) # tested
def fetch_models_marketplace_list():
    data = request.get_json()
    filtered_model_list = [item for _, item in sha256_to_info.items()]
    # first filter with base and type
    if data["base"] != "":
        filtered_model_list = [item for item in filtered_model_list if data["base"] in item["base"]]
    if data["type"] != "":
        filtered_model_list = [item for item in filtered_model_list if data["type"] in item["type"]]
    # fuzzy match
    # best_matches = process.extract(data["query"], [item['info_for_query'] for item in filtered_model_list], limit=15)
    if data["query"] == "":
        predict_sha256 = [item["id"] for item in filtered_model_list]
    else:       
        model_list_map = {}
        for item in filtered_model_list:
            key = item['id']
            for filename in item["info_for_query"].split('|'):
                if model_list_map.get(filename) is None:
                    model_list_map[filename] = [key]
                else:
                    model_list_map[filename].append(key)
        
        best_matches = process.extract(data["query"], list(model_list_map.keys()), limit=15)
        predict_sha256 = []
        for match in best_matches:
            if match[1] > 80:
                predict_sha256.extend(model_list_map[match[0]])
        predict_sha256 = list(set(predict_sha256))
    
    data = [
        {
            "id": sha256_to_info[sha256]["id"],
            "name": sha256_to_info[sha256]["name"],
            "type": sha256_to_info[sha256]["type"],
            "base": sha256_to_info[sha256]["base"],
            "link": sha256_to_info[sha256]["links"],
            "filename": sha256_to_info[sha256]["filename"],
            "description": sha256_to_info[sha256].get("description", "")
        }
        for sha256 in predict_sha256
    ]
    
    models_status = json.load(open(os.environ["MODELS_STATUS_PATH"]))
    for item in data:
        if item["id"] in models_status:
            item["install_status"] = models_status[item["id"]]["install_status"]
        else:
            item["install_status"] = "not_installed"
    
    result = {
        "data": data,
        "success": True,
        "message": ""
    }
    return jsonify(result)

# model uninstall 打开的是已经安装的，install
# shared download function
clients = []

def download_fn(client_queue, model_id, model_url, cache_path, model_size=None):
    def callback(
        event_type=Literal['download_start', 'download_end', 'downloading'],
        outputs=None,
        create_time=None, 
        finish_time=None, 
        task_status: Literal['start', 'succeeded', 'failed'] = None,
    ):
        data = {
            "input": {'model_id': model_id, "model_url": model_url, "cache_path": cache_path, "model_size": model_size},
            "output": outputs,
            "create_time": create_time,
            "finish_time": finish_time,
            "node_status": task_status,
        }
        json_data = json.dumps(data)
        message = f"event: {event_type}\ndata: {json_data}\n\n"
        client_queue.put([message, model_id, task_status])
    callback('download_start', outputs={'progress': 0})
    safe_download(model_url, cache_path, model_size, callback)
    
def download_exists_fn(client_queue, model_id, model_url, cache_path, model_size=None):
    event_type = 'download_end'
    data = {
        "input": {'model_id': model_id, "model_url": model_url, "cache_path": cache_path, "model_size": model_size},
        "output": {"progress": 100},
    }
    json_data = json.dumps(data)
    message = f"event: {event_type}\ndata: {json_data}\n\n"
    task_status = "succeeded"
    client_queue.put([message, model_id, task_status])
            
            
model_download_queue = queue.Queue()
downloading_models = {}
completed_models = {}

def model_downloader_generate_fn(client_queue):
    while True:
        try:
            message, model_id, task_status = client_queue.get(timeout=1)
            if message.startswith("event: download_end"):
                if task_status == "succeeded":
                    with FileLock(os.environ["MODELS_STATUS_PATH"] + ".lock"):
                        models_status = json.load(open(os.environ["MODELS_STATUS_PATH"]))
                        models_status[model_id]["install_status"] = "installed"
                        json.dump(models_status, open(os.environ["MODELS_STATUS_PATH"], "w"))
                    if model_id not in completed_models:
                        completed_models[model_id] = downloading_models[model_id]
                    current_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
                    completed_models[model_id]["finish_time"] = current_time
                    del downloading_models[model_id]
                else:
                    downloading_models[model_id]["error_status"] = "failed"
            yield message
        except queue.Empty:
            continue
            
def download_model_sse(model_infos):
    # model_info: model_id, model_url, cache_path, model_size  
    with FileLock(os.environ["MODELS_STATUS_PATH"] + ".lock"):
        if not os.path.isfile(os.environ["MODELS_STATUS_PATH"]):
            models_status = {}
        else:
            models_status = json.load(open(os.environ["MODELS_STATUS_PATH"]))
            
        for model_info in model_infos:
            model_id = model_info["model_id"]
            model_url = model_info["model_url"]
            cache_path = model_info["cache_path"]
            model_size = model_info["model_size"]
            model_info["filename"] = os.path.basename(model_info["cache_path"])
            models_status[model_id] = {
                "install_status": "installing"
            }
            downloading_models[model_id] = model_info
            if os.path.isfile(cache_path) and not model_info.get("force", False):
                threading.Thread(target=download_exists_fn, args=(model_download_queue, model_id, model_url, cache_path, model_size)).start()
            else:
                threading.Thread(target=download_fn, args=(model_download_queue, model_id, model_url, cache_path, model_size)).start() 
        json.dump(models_status, open(os.environ["MODELS_STATUS_PATH"], "w"))
    
    return_dict = {
        "success": True,
    }
    return jsonify(return_dict)


@app.route(f'/api/download-center/get_downloading_models', methods=['POST'])
def get_downloading_models():
    return_list = list(downloading_models.values())[::-1]
    return jsonify({"models": return_list})


@app.route(f'/api/download-center/get_completed_models', methods=['POST'])
def get_completed_models():
    return_list = list(completed_models.values())[::-1]
    return jsonify({"models": return_list})



@app.route(f'/api/download-center/get_downloading_models_progress', methods=['POST'])
def get_downloading_models_progress():
    resp = Response(model_downloader_generate_fn(model_download_queue), mimetype='text/event-stream')
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

    
    
@app.route(f'/api/models/marketplace/install', methods=['POST']) # tested
def install_models_marketplace():
    data = request.get_json()
    item = model_list_map_by_id[data["id"]]
    if "save_path" not in item:
        item["save_path"] = item["type"].lower()
    cache_path = os.path.join(os.environ["MODEL_DIR"], item["save_path"], item["filename"])
    
    model_url = item["links"][0]["url"]
    model_size = item["links"][0]["filesize(MB)"]
        
    model_info = {
        "model_id": data["id"],
        "model_url": model_url,
        "cache_path": cache_path,
        "model_size": model_size * 1024 ** 2,
        "force": data.get("force", False),
        "source": "marketplace",
    }
    return download_model_sse([model_info])

@app.route(f'/api/models/cancel_download', methods=['POST']) # tested
def model_cancel_download(): # TODO: what is this used for? # TODO
    data = request.get_json()
    cache_path = data["cache_path"]
    
    cancel_file = cache_path + ".cancel"
    with open(cancel_file, "w") as f:
        f.write("")
    
    result = {
        "success": True,
        "message": "",
    }
    time.sleep(1.0)
    if not os.path.isfile(cancel_file):
        return jsonify(result)
    
    time.sleep(5.0)
    if not os.path.isfile(cancel_file):
        return jsonify(result)
    else:
        os.remove(cancel_file)
        result["success"] = False
        return jsonify(result)


@app.route(f'/api/models/marketplace/install_from_link', methods=['POST']) # tested
def install_from_link_models_marketplace(): # TODO: what is this used for? # TODO
    data = request.get_json()
    model_id = hash_dict(data)
    save_type = re.sub(r"\s+", '_', data["save_path"])
    cache_path = os.path.join(os.environ["MODEL_DIR"], save_type, data["filename"])
    # save the metadata
    data["id"] = model_id
    os.makedirs(os.path.dirname(cache_path), exist_ok=True)
    with open(cache_path + ".json", "w") as f:
        json.dump(data, f)
        
    model_infos = [
        {
            "model_id": model_id,
            "model_url": data["url"],
            "cache_path": cache_path,
            "model_size": None,
            "source": "link"
        }
    ]
    return download_model_sse(model_infos)


@app.route(f'/api/models/marketplace/batch_install', methods=['POST']) # tested
def batch_install_from_models_marketplace():
    data = request.get_json()
    model_infos = []
    for model_id in data["id_list"]:
        item = model_list_map_by_id[model_id]
        if "save_path" not in item:
            item["save_path"] = item["type"].lower()
        cache_path = os.path.join(os.environ["MODEL_DIR"], item["save_path"], item["filename"])
        
        model_url = item["links"][0]["url"]
        model_size = item["links"][0]["filesize(MB)"]
        model_info = {
            "model_id": model_id,
            "model_url": model_url,
            "cache_path": cache_path,
            "model_size": model_size * 1024 ** 2,
            "source": "marketplace"
        }
        model_infos.append(model_info)
    return download_model_sse(model_infos)



@app.route(f'/api/models/marketplace/batch_uninstall', methods=['POST']) # tested
def batch_uninstall_from_models_marketplace():
    data = request.get_json()
    for model_id in data["id_list"]:
        item = model_list_map_by_id[model_id]
        cache_path = os.path.join(os.environ["MODEL_DIR"], item["save_path"], item["filename"])
        if os.path.isfile(cache_path):
            os.remove(cache_path)
        metadata_file = cache_path + ".json"
        if os.path.isfile(metadata_file):
            os.remove(metadata_file)
        with FileLock(os.environ["MODELS_STATUS_PATH"] + ".lock"):
            models_status = json.load(open(os.environ["MODELS_STATUS_PATH"]))
            models_status[model_id]["install_status"] = "not_installed"
            json.dump(models_status, open(os.environ["MODELS_STATUS_PATH"], "w"))
        
    result = {
        "success": True,
        "message": ""
    }
    return jsonify(result)


class ModelsInstalledData(BaseModel):
    name: str
    type: str
    base: str
    link: str
    description: str
    filename: str
    version: str = None


local_model_map = {}
def get_local_models(location="models"):
    local_model_map.clear()
    all_local_models = glob.glob(f'{location}/**/*', recursive=True)
    supported_suffix = ["pth", "pt", "safetensors"]
    for local_model in all_local_models:
        if not os.path.isfile(local_model):
            continue
        suffix = local_model.rsplit('.', 1)[-1]
        if suffix not in supported_suffix:
            continue
        # find the possible metadata file
        metadata = {}
        metadata["filename"] = os.path.basename(local_model)
        if not location.endswith("/"):
            location = location + "/"
        metadata["save_path"] = local_model[len(location):].split('/')[0]
        metadata["local_path"] = local_model
        metadata["id"] = hash_dict(metadata)
        metadata["create_time"], metadata["update_time"], _ = get_file_times(local_model)
        local_model_map[metadata["id"]] = metadata
    

# Models Installed
@app.route(f'/api/models/installed/list', methods=['POST']) # tested
def fetch_models_installed_list():
    data = request.get_json()
    get_local_models(os.environ["MODEL_DIR"])
    filtered_model_list = list(local_model_map.values())
    # first filter with base and type
    if data["base"] != "":
        filtered_model_list = [item for item in filtered_model_list if item["base"] == data["base"]]
    if data["save_path"] != "":
        filtered_model_list = [item for item in filtered_model_list if item["save_path"] == data["save_path"]]
        
    if data["query"] == "":
        selected_items = filtered_model_list
    else:
        best_matches = process.extract(data["query"], [item['filename'] for item in filtered_model_list], limit=15)
        selected_items = [item for item in filtered_model_list if item['filename'] in [match[0] for match in best_matches]]
    result = {
        "data": selected_items,
        "success": True,
        "message": "",
    }
    return jsonify(result)


@app.route('/api/models/installed/batch_uninstall', methods=['POST']) # tested
def batch_uninstall_models_installed():
    # Implement your logic here
    data = request.get_json()
    for model_id in data["id_list"]:
        item = local_model_map[model_id]
        cache_path = item["local_path"]
        os.remove(cache_path)
        metadata_file = cache_path + ".json"
        if os.path.isfile(metadata_file):
            os.remove(metadata_file)
    result = {
        "success": True,
        "message": ""
    }
    return jsonify(result)


class WidgetsMarketplaceData(BaseModel):
    name: str
    link: str
    description: str
  
# Widgets Marketplace
widget_map = json.load(open('custom_widget_info.json'))
widget_map = {
    k: {
        "name": k,
        "id": k,
        **v
    }
    for k, v in widget_map.items()
}

local_widget_map = {}
def get_local_widgets(location="custom_widgets"):
    local_widget_map.clear()
    local_widget_names = os.listdir(location)
    for local_widget_name in local_widget_names:
        if not os.path.isdir(os.path.join(location, local_widget_name)):
            continue
        if local_widget_name in widget_map:
            metadata = widget_map[local_widget_name]
        else:
            git_rul, branch, commit = get_git_info(os.path.join(location, local_widget_name))
            metadata = {
                "name": local_widget_name,
                "git": git_rul,
                "branch": branch,
                "commit": commit
            }
        local_widget_map[local_widget_name] = metadata

@app.route('/api/widgets/marketplace/list', methods=['POST']) # tested
def fetch_widgets_marketplace_list():
    data = request.get_json()
    if data["query"] == "":
        items = list(widget_map.values())
    else:
        best_matches = process.extract(data["query"], [item['name'] for item in widget_map.values()], limit=15)
        items = [item for item in widget_map.values() if item['name'] in [match[0] for match in best_matches]]
        
    for item in items:
        item["remote_commit_hash"] = get_github_repo_hash(item["git"], item.get("branch", "main"), item.get("commmit", "latest"))
        widget_local_dir = os.path.join(CUSTOM_WIDGETS_DIR, item["name"])
        item["local_commits_hash"] = os.listdir(widget_local_dir) if os.path.isdir(widget_local_dir) else []
        
    result = {
        "data": items,
        "success": True,
        "message": "",
    }
    return jsonify(result)

def install_widget_marketplace_by_info(widget_info):
    remote_hash = get_github_repo_hash(widget_info["git"], widget_info.get("branch", "main"), widget_info.get("commit", "latest"))
    local_path = os.path.join(CUSTOM_WIDGETS_DIR, widget_info["name"], remote_hash)
    if os.path.isdir(local_path):
        shutil.rmtree(local_path)
    install_widget(widget_info["git"], local_path)
    
    # handle the widget info
    if not os.path.isfile(CUSTOM_WIDGETS_STATUS_PATH):
        widget_status = {}
    else:
        widget_status = json.load(open(CUSTOM_WIDGETS_STATUS_PATH))
    if widget_info["name"] not in widget_status:
        widget_status[widget_info["name"]] = {
            "enabled": True,
            "current_commit": remote_hash
        }
    else:
        widget_status[widget_info["name"]]["current_commit"] = remote_hash
    json.dump(widget_status, open(CUSTOM_WIDGETS_STATUS_PATH, "w"))


    
@app.route('/api/widgets/get_remote_versions', methods=['POST'])  # tested
def get_remote_versions():
    data = request.get_json()
    
    tags = {}
    commits = {}
    if data['query'] == '':
        tags = get_github_repo_tags(data['git'])
    else:
        tags = get_github_repo_tags(data['git'])
        commits = get_github_repo_commits(data['git'])
        tags = {k: v for k, v in tags.items() if k.startswith(data["query"])}
        commits = {k: v for k, v in commits.items() if k.startswith(data["query"])}
        
    result = {
        "success": True,
        "message": "",
        "tags": tags,
        "commits": commits
    }
    return jsonify(result)

@app.route('/api/widgets/marketplace/install', methods=['POST'])  # tested
def install_widgets_marketplace():
    data = request.get_json()
    widget_info = widget_map[data['id']]
    if "commit" in data:
        widget_info["commit"] = data["commit"]
    install_widget_marketplace_by_info(widget_info)
    result = {
        "success": True,
        "message": ""
    }
    return jsonify(result)


@app.route('/api/widgets/marketplace/install_from_git', methods=['POST'])  # tested
def install_widgets_from_git():
    data = request.get_json()
    
    widget_name = data["widget_name"].replace(' ', '-')
    widget_info ={
        "git": data["link"],
        "name": widget_name
    }
    install_widget_marketplace_by_info(widget_info)
    result = {
        "success": True,
        "message": ""
    }
    return jsonify(result)


@app.route('/api/widgets/marketplace/batch_install', methods=['POST'])
def batch_install_widgets_marketplace():
    data = request.get_json()
    for widget_id in data['id_list']:
        widget_info = widget_map[widget_id]
        install_widget_marketplace_by_info(widget_info)
    result = {
        "success": True,
        "message": ""
    }
    return jsonify(result)
        

@app.route('/api/widgets/marketplace/batch_update', methods=['POST'])
def batch_update_widgets_marketplace():
    data = request.get_json()
    for widget_id in data['id_list']:
        widget_info = widget_map[widget_id]
        local_path = os.path.join(CUSTOM_WIDGETS_DIR, widget_info["name"])
        shutil.rmtree(local_path)
        install_widget_marketplace_by_info(widget_info)
    result = {
        "success": True,
        "message": ""
    }
    return jsonify(result)

@app.route('/api/widgets/marketplace/uninstall', methods=['POST'])
def uninstall_widgets_marketplace():
    data = request.get_json()
    widget_info = widget_map[data['id']]
    if "commit" in data:
        local_path = os.path.join(CUSTOM_WIDGETS_DIR, widget_info["name"], data["commit"])
    else:
        local_path = os.path.join(CUSTOM_WIDGETS_DIR, widget_info["name"])
        widget_status = json.load(open(CUSTOM_WIDGETS_STATUS_PATH))
        if data['id'] in widget_status:
            del widget_status[data['id']]
        json.dump(widget_status, open(CUSTOM_WIDGETS_STATUS_PATH, "w"))
    if os.path.isdir(local_path):
        shutil.rmtree(local_path)
    result = {
        "success": True,
        "message": ""
    }
    return jsonify(result)

@app.route('/api/widgets/marketplace/batch_uninstall', methods=['POST'])
def batch_uninstall_widgets_marketplace():
    data = request.get_json()
    for widget_id in data['id_list']:
        widget_info = widget_map[widget_id]
        local_path = os.path.join(CUSTOM_WIDGETS_DIR, widget_info["name"])
        shutil.rmtree(local_path)
    result = {
        "success": True,
        "message": ""
    }
    return jsonify(result)

# Widgets Installed
@app.route('/api/widgets/installed/list', methods=['POST'])
def fetch_widgets_installed_list():
    data = request.get_json()
    get_local_widgets()
    if data.get("query", "") == "":
        items = list(local_widget_map.values())
    else:
        best_matches = process.extract(data["query"], [item['name'] for item in local_widget_map.values()], limit=15)
        items = [item for item in local_widget_map.values() if item['name'] in [match[0] for match in best_matches]]
        
    widgets_info = json.load(open(CUSTOM_WIDGETS_STATUS_PATH))
    for item in items:
        item["enabled"] = widgets_info[item["name"]]["enabled"]
        item["current_commit"] = widgets_info[item["name"]]["current_commit"]
    
    result = {
        "data": items,
        "success": True,
        "message": ""
    }
    return jsonify(result)

# Widgets Installed
@app.route('/api/widgets/installed/set_widget_status', methods=['POST'])
def set_widget_status():
    data = request.get_json()
    
    widget_id = data['id']
    widgets_info = json.load(open(CUSTOM_WIDGETS_STATUS_PATH))
    assert widget_id in widgets_info
    if "enabled" in data:
        widgets_info[widget_id]['enabled'] = data["enabled"]
    if "current_commit" in data:
        widgets_info[widget_id]['current_commit'] = data["current_commit"]
    json.dump(widgets_info, open(CUSTOM_WIDGETS_STATUS_PATH, "w"))
    result = {
        "success": True,
        "message": ""
    }
    return jsonify(result)

