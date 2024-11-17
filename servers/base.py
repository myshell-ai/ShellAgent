import os
import time
import json
from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from starlette.middleware.base import BaseHTTPMiddleware
from pathlib import Path
# Create FastAPI app instance
app = FastAPI()

# Custom Middleware to remove double slashes in the URL
class RemoveDoubleSlashMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        # Clean up the path by removing multiple slashes
        request.scope['path'] = request.scope['path'].replace('//', '/')
        response = await call_next(request)
        return response

# Add the middleware to the FastAPI app
app.add_middleware(RemoveDoubleSlashMiddleware)

current_file_path = Path(__file__).resolve()
web_build_path = current_file_path.parent / "web-build"
# Serve static files

# Setup template directory
templates = Jinja2Templates(directory=str(web_build_path))

# Set environment variables and directories
os.environ["PROCONFIG_PROJECT_ROOT"] = os.environ.get("PROCONFIG_PROJECT_ROOT", "data")
assert "OPENAI_API_KEY" not in os.environ
PROJECT_ROOT = os.environ["PROCONFIG_PROJECT_ROOT"]
ASSET_ROOT = "assets"
print("current project root:", PROJECT_ROOT)

UPLOAD_FOLDER = os.path.join("input")  # To be compatible with ComfyUI
OUTPUT_FOLDER = "output"
os.makedirs(OUTPUT_FOLDER, exist_ok=True)
WORKFLOW_SAVE_ROOT = os.path.join(PROJECT_ROOT, "workflow")
APP_SAVE_ROOT = os.path.join(PROJECT_ROOT, "app")
APP_RUNS_SAVE_ROOT = os.path.join(PROJECT_ROOT, "runs", "app")
WORKFLOW_RUNS_SAVE_ROOT = os.path.join(PROJECT_ROOT, "runs", "workflow")
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

# Initialization
def initialize_envs():
    if not os.path.isfile("settings.json"):
        json.dump({"model_location": "models", "envs": {}}, open("settings.json", "w"))
    env = json.load(open("settings.json"))
    os.makedirs(os.environ["MODEL_DIR"], exist_ok=True)
    os.makedirs(os.path.join(os.path.dirname(__file__), "web", "extensions"), exist_ok=True)
    if not os.path.isfile(os.environ["MODELS_STATUS_PATH"]):
        json.dump({}, open(os.environ["MODELS_STATUS_PATH"], "w"))
    if not os.path.isfile(CUSTOM_WIDGETS_STATUS_PATH):
        json.dump({}, open(CUSTOM_WIDGETS_STATUS_PATH, "w"))

    for k, v in env["envs"].items():
        if k != "":
            os.environ[k] = str(v)

initialize_envs()

# Utility function to get file times
def get_file_times(file_path):
    try:
        creation_time = os.path.getctime(file_path)
        modification_time = os.path.getmtime(file_path)
        creation_time_str = time.ctime(creation_time)
        modification_time_str = time.ctime(modification_time)
        return creation_time_str, modification_time_str, modification_time
    except Exception as e:
        print(f"An error occurred: {e}")
        return None, None

# Routes
@app.get("/", response_class=HTMLResponse)
async def home(request: Request):
    return templates.TemplateResponse("app.html", {"request": request})

@app.get("/app", response_class=HTMLResponse)
async def app_page(request: Request):
    return templates.TemplateResponse("app.html", {"request": request})

@app.get("/workflow", response_class=HTMLResponse)
async def workflow_page(request: Request):
    return templates.TemplateResponse("workflow.html", {"request": request})

@app.get("/app/detail", response_class=HTMLResponse)
async def app_detail_page(request: Request):
    return templates.TemplateResponse("app/detail.html", {"request": request})

@app.get("/workflow/detail", response_class=HTMLResponse)
async def workflow_detail_page(request: Request):
    return templates.TemplateResponse("workflow/detail.html", {"request": request})

@app.get("/about")
async def about():
    return "About Page"
