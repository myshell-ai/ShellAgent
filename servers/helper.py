from servers.base import app
import servers.base
import servers.automata
from pydantic import BaseModel
from typing import Dict, List
import requests
import json
import time
import sys
import platform
import os
import tempfile
import os
from proconfig.utils.misc import is_valid_url, upload_file_to_myshell

history = []

HELPER_ENDPOINT = "https://shellagent-helper.myshell.life/"

@app.post("/api/helper/clear_memory")
async def clear_memory():
    history.clear()
    return {
        "success": True
    }

def upload_to_myshell_if_local(path):
    if is_valid_url(path):
        return path
    assert os.path.isfile(path), f"`{path}` is not a valid path"
    return upload_file_to_myshell(path)

@app.post("/api/helper/query")
async def helper_query(data: Dict):
    # data: {"question": "xx"}
    question = data["question"]
    images = data.get("images", [])
    
    if len(images) > 0:
        from proconfig.widgets.language_models.gpt_widgets import GPTWidget
        widget = GPTWidget()
        inputs = dict(
            model="gpt-4o",
            system_prompt="You are a OCR detector, you will always faithfully extract the text in the input image",
            user_prompt="Please extract the text in the provided image:"
        )
        for image in images:
            result = widget({}, {**inputs, "input_image": image})
            question += f"\n{result['reply']}\n"
    print(question)
    payload = {
        "question": question,
        "images": images
    }
    if len(history) > 0:
        payload["history"] = json.dumps(history)
        
    headers = {
        'Content-Type': 'application/json',
        # 'Authorization': f"Bearer {self.api_token}"
    } 
    response = requests.post(HELPER_ENDPOINT + "/generate_reply", json=payload, headers=headers)
    task_id = response.json()['task_id']
    
    while True:
        response = requests.post(HELPER_ENDPOINT + '/get_result', json={'task_id': task_id }, headers=headers)
        data = response.json()
        status = data['status']
        if status in ["CREATED", "RUNNING"]:
            time.sleep(1)
            continue
        else:
            break
    reply = data.get('result', '')
    
    if reply != '':
        # success
        history.extend([
            {"role": "user", "content": question},
            {"role": "assistant", "content": reply},
        ])
    
    return {
        "reply": reply
    }
    
class SubmitFeedbackRequest(BaseModel):
    feedback_summary: str = "反馈内容"
    feedback_detail: List[str] = []
    email: str = ""
    wechat: str = ""
    trace_id: str = ""
    additional_info: str = ""

def get_os_version():
    os_name = platform.system().lower()
    if "linux" in os_name:
        return "Linux"
    elif "darwin" in os_name:  # macOS identifies as 'Darwin'
        return "Mac"
    elif "windows" in os_name:
        return "Windows"
    else:
        return "Unknown"
    
@app.post("/api/helper/submit_feedback")
async def submit_feedback(data: SubmitFeedbackRequest):
    if data.trace_id != "":
        # retrive data runtime info
        data.trace_id = list(servers.automata.trace_id_to_runtime_data_map)[0]
        runtime_data = servers.automata.trace_id_to_runtime_data_map[data.trace_id].model_dump()
        with tempfile.NamedTemporaryFile(delete=True, suffix='.json', mode="w", newline="") as temp_file:
            json.dump(runtime_data, temp_file, indent=2, ensure_ascii=False)
            temp_file.flush()
            # runtime_data_loaded = json.load(open(temp_file.name))
            # import pdb; pdb.set_trace()
            app_info_url = upload_file_to_myshell(temp_file.name)
    else:
        app_info_url = ""
        
    # get comfyui version
    # Make the POST request to shellagent/export API
    comfyui_version = None
    try:
        comfyui_api = os.environ["COMFYUI_API"]
        response = requests.post(f"{comfyui_api}/shellagent/inspect_version", json={})
        if response.status_code == 200:
            comfyui_version = response.json()
    except Exception as e:
        import pdb; pdb.set_trace()
        
    
    submit_data = {
        "反馈内容": data.feedback_summary,
        "反馈详情": data.feedback_detail,
        "邮箱": data.email,
        "微信": data.wechat,
        "关联 app": app_info_url,
        "补充信息": data.additional_info,
        "操作系统": get_os_version(),
        "Python 版本": sys.version,
        "启动参数": servers.base.launch_args,
        "ComfyUI 版本": comfyui_version,
    }
    
    payload = {
        "feedback_str": json.dumps(submit_data)
    }
    
    headers = {
        'Content-Type': 'application/json',
        # 'Authorization': f"Bearer {self.api_token}"
    } 
    response = requests.post(HELPER_ENDPOINT + "/submit_feedback", json=payload, headers=headers)
    task_id = response.json()['task_id']
    
    while True:
        response = requests.post(HELPER_ENDPOINT + '/get_result', json={'task_id': task_id }, headers=headers)
        data = response.json()
        status = data['status']
        if status in ["CREATED", "RUNNING"]:
            time.sleep(1)
            continue
        else:
            break
    return {
        "success": True,
        "data": submit_data
    }