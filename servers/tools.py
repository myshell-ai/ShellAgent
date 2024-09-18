from flask import request, jsonify
import os
import traceback
import psutil
import GPUtil

from proconfig.widgets.imagen_widgets.comfy_nodes.convert_comfyui_json import convert_comfyui_to_proconfig
from proconfig.widgets.tools.dependency_checker import check_dependency
from servers.base import app


@app.route(f'/api/tools/convert_comfyui_to_proconfig', methods=["POST", "GET"])
def convert_comfyui_to_proconfig_fn():
    data = request.get_json()
    proconfig = data["data"]
    try:
        result = convert_comfyui_to_proconfig(proconfig)
        dependency_results = check_dependency(result)
        return_dict = {
            "data": result,
            "non_existed_models": dependency_results["non_existed_models"]
        }
        print("received blocks", len(result["blocks"]))
    except Exception as e:
        print(str(traceback.format_exc()))
        return_dict = {
            "data": None,
            "error_message_detail": str(traceback.format_exc()),
            "error_message": str(e)
        }
    return jsonify(return_dict)

@app.route(f'/api/tools/monitor_memory', methods=["POST"])
def monitor_memory():
    data = request.get_json()
    device = int(os.environ["CUDA_VISIBLE_DEVICES"])
    
    memory_info = psutil.virtual_memory()

    # Get total memory and used memory in GB
    cpu_memory_total = memory_info.total / (1024 * 1024 * 1024)
    cpu_memory_usage = memory_info.used / (1024 * 1024 * 1024)
    # Monitor GPU memory usage (assuming there's at least one GPU)
    gpus = GPUtil.getGPUs()
    
    if gpus:
        gpu = gpus[device]
        gpu_memory_usage = gpu.memoryUsed / 1024 # GPU usage in bytes
        gpu_memory_total = gpu.memoryTotal / 1024 # GPU usage in bytes
        # print(f"Current GPU memory usage: {gpu_memory_usage / (1024 * 1024 * 1024):.2f} GB")
    else:
        gpu_memory_usage = 0
        # print("No GPU found.")
        
    return_dict = {
        "cpu_memory_used": cpu_memory_usage,
        "cpu_memory_total": cpu_memory_total,
        "gpu_memory_used": gpu_memory_usage,
        "gpu_memory_total": gpu_memory_total,
    }
    return jsonify(return_dict)

