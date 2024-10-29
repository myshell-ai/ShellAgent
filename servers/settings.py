import os
import json
from fastapi.responses import JSONResponse
from typing import Dict
from servers.base import app



@app.api_route("/api/settings/env/load", methods=["POST", "GET"])
async def load_env():
    with open("settings.json") as f:
        env = json.load(f)
    env["envs"] = [{"key": k, "value": v} for k, v in env["envs"].items()]
    return JSONResponse(content=env)

@app.post("/api/settings/env/save")
async def save_env(env: Dict):
    env = request.get_json()
    env["envs"] = {item["key"]: item["value"] for item in env["envs"]}
    json.dump(env, open("settings.json", "w"))
    # result = {
    #     "success": True
    # }

    # os.environ["MODEL_DIR"] = env.get("model_location", "models")
    # link the model into ./models
    # target_models_dir = env.get("model_location", "models")
    
    # do nothing here
    # sync_folders(os.environ["MODEL_DIR"], target_models_dir)

    # os.environ["MODELS_STATUS_PATH"] = os.path.join(os.environ["MODEL_DIR"], "model_status.json")
    # target_models_status_file = os.path.join(target_models_dir, "model_status.json")
    # if os.path.isfile(target_models_status_file):
    #     # json.dump({}, open(os.environ["MODELS_STATUS_PATH"], "w"))
    #     merge_json_files([os.environ["MODELS_STATUS_PATH"], target_models_status_file], os.environ["MODELS_STATUS_PATH"])

    for k, v in env["envs"].items():
        if k != "":
            os.environ[k] = str(v)
    return JSONResponse(content={"success": True})

def create_symlinks(src, dest):
    """
    Recursively create symbolic links from src to dest.
    """
    # If the destination path does not exist, create the symlink
    if not os.path.exists(dest):
        if os.path.islink(dest):
            # means link is invalid
            os.remove(dest)
            print(f"Remove invalid symlink '{dest}'.")
        try:
            if os.path.isdir(src):
                os.symlink(src, dest, target_is_directory=True)
                print(f"Created symlink for directory '{dest}'.")
            else:
                os.symlink(src, dest)
                print(f"Created symlink for file '{dest}'.")
        except OSError as e:
            print(f"Failed to create symlink for '{dest}': {e}")
    # If the destination path exists and is a directory, recurse into it
    elif os.path.isdir(src):
        for item in os.listdir(src):
            src_item = os.path.join(src, item)
            dest_item = os.path.join(dest, item)
            create_symlinks(src_item, dest_item)
    else:
        # print(f"'{dest}' already exists, skipping.")
        pass

def sync_folders(folder1, folder2):
    """
    Sync folder2 to folder1 by creating symlinks for missing files and directories.
    """
    # Convert paths to absolute paths
    folder1 = os.path.abspath(folder1)
    folder2 = os.path.abspath(folder2)
    
    # Check if the paths are the same
    if folder1 == folder2:
        print("The two folder paths are the same, skipping operation.")
        return
    
    # Iterate through items in folder2
    for item in os.listdir(folder2):
        src = os.path.join(folder2, item)
        dest = os.path.join(folder1, item)
        create_symlinks(src, dest)

def merge_json_files(file_paths, output_file):
    merged_data = {}

    for file_path in file_paths:
        with open(file_path, 'r') as f:
            data = json.load(f)
            # Merge the loaded JSON data into the merged_data dictionary
            merged_data = merge_dicts(merged_data, data)

    # Write the merged data to the output file
    with open(output_file, 'w') as f:
        json.dump(merged_data, f, indent=4)
    print(f"JSON files have been merged into {output_file}")

def merge_dicts(dict1, dict2):
    """
    Merge two dictionaries.
    """
    for key in dict2:
        if key in dict1:
            pass
        else:
            dict1[key] = dict2[key]
    return dict1