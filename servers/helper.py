from servers.base import app
from typing import Dict
import requests
import json
import time
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