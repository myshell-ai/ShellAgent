from servers.base import app
from typing import Dict
import requests
import json
import time

history = []

HELPER_ENDPOINT = "https://shellagent-helper.myshell.life/"

@app.post("/api/helper/clear_memory")
async def clear_memory():
    history.clear()
    return {
        "success": True
    }

    
@app.post("/api/helper/query")
async def helper_query(data: Dict):
    # data: {"question": "xx"}
    question = data["question"]
    payload = {
        "question": question,
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