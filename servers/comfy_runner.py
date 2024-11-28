import requests
import websocket
import uuid
import json
import urllib
import os
from datetime import datetime
from typing import Dict

from servers.base import app, PROJECT_ROOT

COMFY_ROOT = os.path.join(PROJECT_ROOT, "comfy_workflow")
COMFY_LOCAL_DEPS_PATH = os.path.join(PROJECT_ROOT, "comfy_data", "dependencies.json")

if not os.path.isfile(COMFY_LOCAL_DEPS_PATH):
    os.makedirs(os.path.dirname(COMFY_LOCAL_DEPS_PATH), exist_ok=True)
    empty_data = {
        "models": {},
        "custom_nodes": {}
    }
    json.dump(empty_data, open(COMFY_LOCAL_DEPS_PATH, "w"))


@app.post("/api/comfyui/upload")
async def upload_workflow(data: Dict):
    workflow_id = data.get("comfy_workflow_id")
    workflow = data.get("workflow")

    # Step 1: Decide workflow type
    if all([k in workflow for k in ["schemas", "dependencies", "workflow", "workflow_api"]]):
        # Is shellagent workflow
        return_dict = {
            "success": True,
            "comfy_workflow": workflow["workflow"],
            "message": ""
        }
        # Save both
        fname_mapping = {
            "workflow.shellagent.json": workflow,  # with dependency
            "workflow.json": workflow["workflow"]
        }
        save_root = os.path.join(COMFY_ROOT, workflow_id)
        os.makedirs(save_root, exist_ok=True)
        for fname, dict_to_save in fname_mapping.items():
            with open(os.path.join(save_root, fname), "w") as f:
                json.dump(dict_to_save, f, indent=2)
        
    elif isinstance(workflow, dict) and all([key in workflow for key in ["last_node_id", "last_link_id", "nodes", "links"]]):
        # Save both
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
    
    return return_dict

    
@app.post("/api/comfyui/save")
async def save_comfyui_workflow(data: Dict):
    api = data["comfyui_api"]
    workflow_api = data["prompt"]
    workflow = data["workflow"]
    
    workflow_id = data.get("comfy_workflow_id", "")
    
    # metadata.json
    metadata = {
        "workflow_id": workflow_id,
        "create_time": datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    }
    
    # Add the dependencies previously provided by the user
    with open(COMFY_LOCAL_DEPS_PATH, "r") as deps_file:
        custom_dependencies = json.load(deps_file)
    
    post_data = {
        "prompt": workflow_api,
        "custom_dependencies": custom_dependencies,
    }
    
    # Make the POST request to shellagent/export API
    response = requests.post(f"{api}/shellagent/export", json=post_data)
    results = response.json()

    if results["success"]:
        shellagent_json = {
            "workflow": workflow,
            "workflow_api": workflow_api,
            "dependencies": results["dependencies"],
            "schemas": results["schemas"],
        }
        
        return_dict = {
            "success": True,
            "data": shellagent_json,
            "warning_message": results.get("warning_message", "")
        }
        
        # Save the data to the filesystem
        if "location" not in data:
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
            with open(data["location"], "w") as f:
                json.dump(shellagent_json, f, indent=2)
    else:
        return_dict = {
            "success": False,
            "message": results["message"],
            "message_detail": results.get("message_detail", "")
        }
    
    return return_dict


@app.post("/api/comfyui/update_dependency")
async def update_dependency(data: Dict):
    missing_repos = {item["name"]: item for item in data.get("missing_custom_nodes", [])}
    missing_models = data.get("missing_models", {})
    
    # Read the local custom dependencies file
    with open(COMFY_LOCAL_DEPS_PATH, "r") as deps_file:
        custom_dependencies = json.load(deps_file)
    
    # Read the shellagent JSON
    if "location" in data:
        shellagent_json_path = data["location"]
    else:
        workflow_id = data["comfy_workflow_id"]
        shellagent_json_path = os.path.join(COMFY_ROOT, workflow_id, "workflow.shellagent.json")
        
    shellagent_json_path_new = data.get("location_new", shellagent_json_path)
    
    with open(shellagent_json_path, "r") as shellagent_file:
        shellagent_json = json.load(shellagent_file)
    
    # Update the dependencies with missing models
    shellagent_json["dependencies"]["models"].update(missing_models)
    for model_id, item in missing_models.items():
        if len(item["urls"]):
            custom_dependencies["models"].update({model_id: item})
    
    # Update the custom nodes (repos)
    repos = [shellagent_json["dependencies"]["comfyui_version"]] + shellagent_json["dependencies"]["custom_nodes"]
    for repo in repos:
        if repo["name"] in missing_repos:
            repo.update(missing_repos[repo["name"]])
            if repo["repo"] != "":
                custom_dependencies["custom_nodes"].update({repo["name"]: repo})
    
    # Save the updated custom dependencies
    with open(COMFY_LOCAL_DEPS_PATH, "w") as deps_file:
        json.dump(custom_dependencies, deps_file, indent=2)
    
    # Save the updated shellagent JSON
    with open(shellagent_json_path_new, "w") as shellagent_file:
        json.dump(shellagent_json, shellagent_file, indent=2)
    
    # Prepare the response
    return_dict = {
        "success": True,
        "data": shellagent_json
    }
    
    return return_dict



@app.post(f'/api/comfyui/get_file')
async def comfyui_get_file(data: Dict):
    if "location" in data:
        json_path = data["location"] # get .shellagent.json content, where we can obtain the workflow inside it
    else:
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
    
    return return_dict


@app.post(f'/api/comfyui/check_json_exist')
async def check_json_exist(data: Dict):
    filename = data["location"]
    return {
        "success": filename.endswith(".shellagent.json") and os.path.isfile(filename)
    }