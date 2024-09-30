import flask
from flask import Flask, render_template, jsonify
import os
import time
import json
import pygit2
import subprocess
import __main__
import requests

# define the app and some basic settings

app = Flask(
    __name__, 
    instance_relative_config=True, 
    static_folder='web-build', 
    template_folder='web-build',
    static_url_path=''
)

flask.json.provider.DefaultJSONProvider.sort_keys = False

os.environ["PROCONFIG_PROJECT_ROOT"] = os.environ.get("PROCONFIG_PROJECT_ROOT", "data")

PROJECT_ROOT = os.environ["PROCONFIG_PROJECT_ROOT"]

print("current project root:", PROJECT_ROOT)

UPLOAD_FOLDER = os.path.join("input") # to be compatible with ComfyUI
OUTPUT_FOLDER = "output"
os.makedirs(OUTPUT_FOLDER, exist_ok=True)
WORKFLOW_SAVE_ROOT =  os.path.join(PROJECT_ROOT, "workflow")
APP_SAVE_ROOT =  os.path.join(PROJECT_ROOT, "app")
APP_RUNS_SAVE_ROOT =  os.path.join(PROJECT_ROOT, "runs","app")
WORKFLOW_RUNS_SAVE_ROOT =  os.path.join(PROJECT_ROOT, "runs","workflow")
MODEL_DIR = "models"
CUSTOM_WIDGETS_DIR = "custom_widgets"

CUSTOM_WIDGETS_STATUS_PATH = os.path.join(CUSTOM_WIDGETS_DIR, "widgets_status.json")
MODELS_STATUS_PATH = os.path.join(MODEL_DIR, "model_status.json")

os.environ["MODEL_DIR"] = MODEL_DIR
os.environ["MODELS_STATUS_PATH"] = MODELS_STATUS_PATH


os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(WORKFLOW_SAVE_ROOT, exist_ok=True)
os.makedirs(APP_SAVE_ROOT, exist_ok=True)
os.makedirs(APP_RUNS_SAVE_ROOT, exist_ok=True)
os.makedirs(WORKFLOW_RUNS_SAVE_ROOT, exist_ok=True)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def initialize_envs():
    if not os.path.isfile("settings.json"):
        json.dump({"model_location": "models", "envs": {}}, open("settings.json", "w"))
    env = json.load(open("settings.json"))
    os.makedirs(os.environ["MODEL_DIR"], exist_ok=True)
    os.makedirs(os.path.join(os.path.dirname(__main__.__file__), "web", "extensions"), exist_ok=True)
    if not os.path.isfile(os.environ["MODELS_STATUS_PATH"]):
        json.dump({}, open(os.environ["MODELS_STATUS_PATH"], "w"))
    if not os.path.isfile(CUSTOM_WIDGETS_STATUS_PATH):
        json.dump({}, open(CUSTOM_WIDGETS_STATUS_PATH, "w"))
        
    for k, v in env["envs"].items():
        os.environ[k] = str(v)
        
initialize_envs()

def get_file_times(file_path):
    try:
        # Get the creation time
        creation_time = os.path.getctime(file_path)
        # Get the last modification time
        modification_time = os.path.getmtime(file_path)

        # Convert the timestamps to human-readable format
        creation_time_str = time.ctime(creation_time)
        modification_time_str = time.ctime(modification_time)

        return creation_time_str, modification_time_str, modification_time
    except Exception as e:
        print(f"An error occurred: {e}")
        return None, None
    
    
@app.route('/')
def home():
    return render_template("app.html")

@app.route('/app')
def app_page():
    return render_template("app.html")

@app.route('/workflow')
def workflow_page():
    return render_template("workflow.html")

@app.route('/app/detail')
def app_detail_page():
    return render_template("app/detail.html")

@app.route('/workflow/detail')
def workflow_detail_page():
    return render_template("workflow/detail.html")

@app.route('/check_repo_status')
def check_repo_status():
    pygit2.option(pygit2.GIT_OPT_SET_OWNER_VALIDATION, 0)
    repo = pygit2.Repository('../ShellAgent')

    has_new_stable = False
    current_tag = None
    
    current_branch = repo.head.shorthand
    
    latest_commit = repo.revparse_single(current_branch)
    
    for reference in repo.references:
        if reference.startswith('refs/tags/v'):
            tag = repo.lookup_reference(reference)
            if tag.peel().id == latest_commit.id:
                current_tag = reference
                break
    print(f'current_tag: {current_tag}')

    if current_tag:
        latest_tag = max((ref for ref in repo.references if ref.startswith('refs/tags/v')), key=lambda x: [int(i) for i in x.split('/')[-1][1:].split('.')])
        print(f"latest_tag: {latest_tag}")
        has_new_stable = latest_tag != current_tag

        if has_new_stable:
            latest_tag_name = latest_tag.split('/')[-1]
            
            # get changelog
            github_api_url = f"https://api.github.com/repos/myshell-ai/ShellAgent/releases/tags/{latest_tag_name}"
            response = requests.get(github_api_url)
            if response.status_code == 200:
                release_data = response.json()
                changelog = release_data.get('body', 'No changelog found')
            else:
                changelog = f"Failed to get changelog. HTTP status code: {response.status_code}"

            print(f"Latest tag: {latest_tag_name}")
            print(f"Changelog:\n{changelog}")

    response = {
        "has_new_stable": has_new_stable
    }
    if has_new_stable:
        response["latest_tag_name"] = latest_tag_name
        response["changelog"] = changelog
    return jsonify(response)

def update_stable():
    try:
        script_path = os.path.join('.ci', 'update_windows', 'update.py')
        result = subprocess.run(['python', script_path, './', '--stable'], capture_output=True, text=True, check=True)
        return result.stdout
    except subprocess.CalledProcessError as e:
        raise Exception(f"update failed: {e.stderr}")

@app.route('/update/stable')
def update_stable_route():
    try:
        result = update_stable()
        return jsonify({"success": True, "message": result}), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/restart')
def restart():
    print("Restart signal triggered")
    # Return a response to the client
    response = jsonify({"message": "Server is restarting"})
    response.status_code = 200
    # Use a thread to exit the program after a short delay
    import threading
    def delayed_exit():
        import time
        time.sleep(1)  # Wait for 1 second to ensure the response has been sent
        os._exit(42)  # Use exit code 42 to indicate restart signal
    threading.Thread(target=delayed_exit).start()
    return response

@app.route('/about')
def about():
    return "About Page"
