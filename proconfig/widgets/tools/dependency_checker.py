import os
import json
import copy
from proconfig.core import Automata, Workflow
from proconfig.widgets import build_widgets
from proconfig.widgets.imagen_widgets.utils.model_manager import compute_sha256
from proconfig.utils.expressions import calc_expression, tree_map
from functools import partial
from proconfig.utils.misc import windows_to_linux_path
import logging
from easydict import EasyDict as edict

PROCONFIG_PROJECT_ROOT = os.environ.get("PROCONFIG_PROJECT_ROOT", "data")

calc_expression_no_strict = partial(calc_expression, check_valid=False)

model_list_json = json.load(open("model_info.json"))
def handle_model_info(ckpt_path):
    ckpt_path = windows_to_linux_path(ckpt_path)
    filename = os.path.basename(ckpt_path)
    dirname = os.path.dirname(ckpt_path)
    save_path = dirname.split('/', 1)[1]
    metadata_path = ckpt_path + ".json"
    if os.path.isfile(metadata_path):
        metadata = json.load(open(metadata_path))
        model_id = metadata["id"]
    else:
        logging.info(f"computing sha256 of {ckpt_path}")
        model_id = compute_sha256(ckpt_path)
        data = {
            "id": model_id,
            "save_path": save_path,
            "filename": filename,
        }
        json.dump(data, open(metadata_path, "w"))
    if model_id in model_list_json:
        urls = [item["url"] for item in model_list_json[model_id]["links"]][:10] # use the top 10
    else:
        urls = []
        
    item = {
        "filename": filename,
        "save_path": save_path,
        "urls": urls,
    }
    return model_id, item

ComfyUIModelLoaders = {
    'ComfyUI/VAELoader': (["vae_name"], "vae"),
    'ComfyUI/CheckpointLoader': (["ckpt_name"], "checkpoints"),
    'ComfyUI/CheckpointLoaderSimple': (["ckpt_name"], "checkpoints"),
    'ComfyUI/DiffusersLoader': (["model_path"], "diffusers"),
    'ComfyUI/unCLIPCheckpointLoader': (["ckpt_name"], "checkpoints"),
    'ComfyUI/LoraLoader': (["lora_name"], "loras"),
    'ComfyUI/LoraLoaderModelOnly': (["lora_name"], "loras"),
    'ComfyUI/ControlNetLoader': (["control_net_name"], "controlnet"),
    'ComfyUI/DiffControlNetLoader': (["control_net_name"], "controlnet"),
    'ComfyUI/UNETLoader': (["unet_name"], "unet"),
    'ComfyUI/CLIPLoader': (["clip_name"], "clip"),
    'ComfyUI/DualCLIPLoader': (["clip_name1", "clip_name2"], "clip"),
    'ComfyUI/CLIPVisionLoader': (["clip_name"], "clip_vision"),
    'ComfyUI/StyleModelLoader': (["style_model_name"], "style_models"),
    'ComfyUI/GLIGENLoader': (["gligen_name"], "gligen"),
}
    
# here the config must be task of widget
def check_missing_models(config, non_existed_models, missing_models, local_vars):
    widget_inputs = tree_map(lambda x: calc_expression_no_strict(x, local_vars), config.inputs)
    if config.widget_class_name in ComfyUIModelLoaders: # handle the ComfyUI loaders
        input_names, save_path = ComfyUIModelLoaders[config.widget_class_name]
        ckpt_paths = []
        for input_name in input_names:
            if type(widget_inputs[input_name]) == str:
                ckpt_path = os.path.join("models", save_path, widget_inputs[input_name])
                ckpt_paths.append(ckpt_path)
    else:
        ckpt_paths = []
    
    for ckpt_path in ckpt_paths:
        if not os.path.isfile(ckpt_path) and ckpt_path not in non_existed_models:
            non_existed_models.append(ckpt_path)
        else:
            model_id, item = handle_model_info(ckpt_path)
            if model_id not in missing_models:
                missing_models[model_id] = item
    return non_existed_models, missing_models

TypeMap = {
    "automata": Automata,
    "workflow": Workflow
}

DefaultValueMap = {
    "text": "",
    "string": "",   
    "number": 0,
    "integer": 0,
    "boolean": False,
    "image": ""
}

widget_status = json.load(open("custom_widgets/widgets_status.json"))
all_widget_json = json.load(open("custom_widget_info.json"))
def check_missing_widgets(config, missing_widgets):
    # very simple
    package_name = config.package_name or "myshell"
    if package_name != "myshell":
        if package_name in missing_widgets:
            # already added
            return missing_widgets
        if package_name in widget_status:
            current_commit = widget_status[package_name]["current_commit"]
        else:
            # randomly pick one
            current_commit = sorted(os.listdir(os.path.join("custom_widgets", package_name)))[0]
        registered = package_name in all_widget_json
        missing_widgets[package_name] = {
            "commit": current_commit,
            "git": all_widget_json[package_name]["git"] if registered else None
        }
    return missing_widgets

# non_existed_models: cannot find in local disk
# missing_models: found in local disk, but not in model-list (failed when imported)
# missing widgets: widgets installed locally but haven't registered in widget-list
def check_dependency_recursive(config, non_existed_models: list, missing_models: dict, undefined_widgets: list, missing_widgets: dict, local_vars: dict, payload: dict, workflow_ids: list, comfyui_workflow_ids: list):
    # config is a json
    if config.type == "task": # leaf nodes
        if config.mode == "undefined":
            if config.widget_class_name not in undefined_widgets:
                undefined_widgets.append(config.widget_class_name)
        elif config.mode == "widget":
            if hasattr(config, "comfy_workflow_id"):
                if config.comfy_workflow_id not in comfyui_workflow_ids:
                    comfyui_workflow_ids.append(config.comfy_workflow_id)
                    config.mode = "comfy_workflow"
                return # models in ComfyWorkflowTask already checked
            non_existed_models, missing_models = check_missing_models(config, non_existed_models, missing_models, local_vars)
            missing_widgets = check_missing_widgets(config, missing_widgets)
            return
        elif config.mode == "workflow":
            workflow_root = os.path.join(PROCONFIG_PROJECT_ROOT, "workflow")
            workflow_path = os.path.join(workflow_root, config.workflow_id, "proconfig.json")
            workflow_config = json.load(open(workflow_path))
            if config.workflow_id not in workflow_ids:
                workflow_ids.append(config.workflow_id)
            payload = {k: calc_expression_no_strict(v, local_vars) for k, v in config.inputs.items()}
            workflow_config = Workflow.model_validate(workflow_config)
            return check_dependency_recursive(workflow_config, non_existed_models, missing_models, undefined_widgets, missing_widgets, {}, payload=payload, workflow_ids=workflow_ids, comfyui_workflow_ids=comfyui_workflow_ids)
        elif config.mode == "block":
            payload = {k: calc_expression_no_strict(v, local_vars) for k, v in config.inputs.items()}
            config_block = TypeMap[config.block["type"]].model_validate(config_block)
            return check_dependency_recursive(config_block, non_existed_models, missing_models, undefined_widgets, missing_widgets, local_vars, payload=payload, workflow_ids=workflow_ids, comfyui_workflow_ids=comfyui_workflow_ids)
    elif config.type in ["automata", "workflow", "state"]:
        if config.type == "automata":
            local_vars = {"context": config.context} # we do not know what other to do
        elif config.type == "state":
            local_vars = {"context": local_vars["context"]}
            for k, v in config.inputs.items():
                if getattr(v, "default_value"):
                    local_vars[k] = calc_expression_no_strict(v.default_value, local_vars)
                elif k in payload:
                    local_vars[k] = payload[k]
                else:
                    local_vars[k] = DefaultValueMap.get(v.type, "")

        elif config.type == "workflow":
            local_vars = {"context": config.context}
            for k, v in config.inputs.items():
                if getattr(v, "default_value"):
                    local_vars[k] = calc_expression_no_strict(v.default_value, local_vars)
                elif k in payload:
                    local_vars[k] = payload[k]
                else:
                    local_vars[k] = DefaultValueMap[v.type]
        
        config.blocks = getattr(config, "blocks", [])          
        if type(config.blocks) in [dict, edict]:
            for name, block_config in config.blocks.items():
                check_dependency_recursive(block_config, non_existed_models, missing_models, undefined_widgets, missing_widgets, local_vars, {}, workflow_ids=workflow_ids, comfyui_workflow_ids=comfyui_workflow_ids)
        elif type(config.blocks) == list:
            for block_config in config.blocks:
                check_dependency_recursive(block_config, non_existed_models, missing_models, undefined_widgets, missing_widgets, local_vars, {}, workflow_ids=workflow_ids, comfyui_workflow_ids=comfyui_workflow_ids)
        return
        

def check_dependency(config):
    # here config is a json
    assert config["type"] in ["automata", "workflow"]
    config = edict(config)
    # if config["type"] == "automata":
    #     config = Automata.model_validate(config)
    # else:
    #     config = Workflow.model_validate(config)
        
    workflow_ids = []
    comfyui_workflow_ids = []
    non_existed_models = []
    missing_models = {}
    undefined_widgets = []
    missing_widgets = {}
    check_dependency_recursive(config, non_existed_models=non_existed_models, missing_models=missing_models, 
                                       undefined_widgets=undefined_widgets, missing_widgets=missing_widgets, 
                                       workflow_ids=workflow_ids, comfyui_workflow_ids=comfyui_workflow_ids, local_vars={}, payload={})
    return {
        "non_existed_models": non_existed_models,
        "models": missing_models,
        "undefined_widgets": undefined_widgets,
        "widgets": missing_widgets,
        "workflow_ids": workflow_ids,
        "comfyui_workflow_ids": comfyui_workflow_ids,
    }, config
    
if __name__ == "__main__":
    config = json.load(open("configs/comfyui_converted/test.json"))
    print(check_dependency(config))