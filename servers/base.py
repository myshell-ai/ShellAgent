import flask
from flask import Flask, render_template, jsonify
import os
import time
import json
import pygit2
import __main__

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

    has_new_commits = False
    for remote in repo.remotes:
        if remote.name == 'origin':
            remote.fetch()
            remote_main_id = repo.lookup_reference('refs/remotes/origin/main').target
            merge_result, _ = repo.merge_analysis(remote_main_id)
            if not (merge_result & pygit2.GIT_MERGE_ANALYSIS_UP_TO_DATE):
                has_new_commits = True
                break

    has_new_stable = False
    current_tag = None
    for reference in repo.references:
        if reference.startswith('refs/tags/v'):
            current_tag = reference

    if current_tag:
        latest_tag = max((ref for ref in repo.references if ref.startswith('refs/tags/v')), key=lambda x: [int(i) for i in x.split('/')[-1][1:].split('.')])
        has_new_stable = latest_tag != current_tag


    print({
        "has_new_commits": has_new_commits,
        "has_new_stable": has_new_stable
    })
    return jsonify({
        "has_new_commits": has_new_commits,
        "has_new_stable": has_new_stable
    })

@app.route('/about')
def about():
    return "About Page"

print(check_repo_status())