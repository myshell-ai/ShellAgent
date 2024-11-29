from typing import Any, Literal, Optional, List, Dict
from pydantic import Field, BaseModel

from proconfig.widgets.base import BaseWidget, WIDGETS
from proconfig.utils.misc import upload_file_to_myshell

import os
import base64
import requests
import json

TypeMap = {
    "str": str,
    "int": int,
    "float": float,
    "bool": bool,
    "list": list,
    "dict": dict,
}


class FunctionParameter(BaseModel):
    """
    The parameter for the function.
    """
    name: str = Field(..., description="The name of the parameter.")
    type: str = Field(..., description="The type of the parameter.")
    default: Optional[Any] = Field(
        None, description="The default value of the parameter.")
    description: Optional[str] = Field(
        None, description="The description of the parameter.")
    
def encode_image(image_path):
    from proconfig.utils.misc import is_valid_url
    if is_valid_url(image_path):
        return image_path
    return upload_file_to_myshell(image_path)

class MemoryItem(BaseModel):
    role: Literal["user", "assistant"]
    content: str | List[Any] | Dict[str, Any]

CLAUDE_MEMORY_KEY = "CLAUDE_MEMORY_KEY"
@WIDGETS.register_module()
class ClaudeWidget(BaseWidget):
    NAME = "Claude 3.5 Sonnet"
    CATEGORY = "Large Language Model/Claude"
    
    class InputsSchema(BaseWidget.InputsSchema):
        system_prompt: str = ""
        user_prompt: str = ""
        input_image: Optional[str] = None
        memory: List[MemoryItem] = []
        function_parameters: List[FunctionParameter] = []
        memory_mode: Literal["auto", "manual"] = "auto"
        temperature: float = 0.7
        top_p: float = 1.0
        max_tokens: Optional[int] = None
        presence_penalty: float = 0.0
        frequency_penalty: float = 0.0
        callback: Any = Field(None, hidden=True, visible=False)
        widget_run_id: Any = Field(None, hidden=True, visible=False),
        function_name: str = Field("any_function_name", hidden=True, visible=False)
        function_description: str = Field("any_function_description", hidden=True, visible=False)
        
    class OutputsSchema(BaseWidget.OutputsSchema):
        reply: str | dict
        
    def execute(self, environ, config):
        print("widget run id:", config.widget_run_id)

        if config.memory_mode == "auto":
            if CLAUDE_MEMORY_KEY not in environ:
                environ[CLAUDE_MEMORY_KEY] = {}
            config.memory = [MemoryItem.model_validate(item) for item in environ[CLAUDE_MEMORY_KEY].get(config.widget_run_id, [])]

        config.system_prompt = config.system_prompt or ""
        config.user_prompt = config.user_prompt or ""

        if config.input_image is not None:
            config.user_prompt = {
                "text": config.user_prompt,
                "image": encode_image(config.input_image)
            }
        else:
            config.user_prompt = config.user_prompt

        # API endpoint URL
        url = "https://openapi.myshell.ai/public/v1/widget/run"
        
        # Headers for the API request
        headers = {
            "x-myshell-openapi-key": os.environ["MYSHELL_API_KEY"],
            "Content-Type": "application/json",
            **environ.get("MYSHELL_HEADERS", {})
        }
        
        # Request payload
        if config.function_parameters:
            data = {
                "widget_id": "1744218088699596812",
                "input": json.dumps({
                    "system_prompt": config.system_prompt,
                    "user_prompt": config.user_prompt,
                    "temperature": config.temperature,
                    "top_p": config.top_p,
                    "max_tokens": config.max_tokens,
                    "presence_penalty": config.presence_penalty,
                    "frequency_penalty": config.frequency_penalty,
                    "memory": [item.model_dump() for item in config.memory],
                    "function_name": config.function_name,
                    "function_description": config.function_description,
                    "function_parameters": [item.model_dump() for item in config.function_parameters]
                })
            }
        else:
            data = {
                "widget_id": "1744218088699596812",
                "input": json.dumps({
                    "system_prompt": config.system_prompt,
                    "user_prompt": config.user_prompt,
                    "temperature": config.temperature,
                    "top_p": config.top_p,
                    "max_tokens": config.max_tokens,
                    "presence_penalty": config.presence_penalty,
                    "frequency_penalty": config.frequency_penalty,
                    "memory": [item.model_dump() for item in config.memory]
                })
            }

        print(data)
        
        # Send POST request to the API
        response = requests.post(url, headers=headers, json=data)
        
        # Parse the JSON response
        json_response = response.json()

        if config.memory_mode == "auto":
            config.memory += [
                MemoryItem(role="user", content=config.user_prompt),
                MemoryItem(role="assistant", content=json_response['result'])
            ]
            environ[CLAUDE_MEMORY_KEY][config.widget_run_id] = config.memory
        
        print(json_response)
        # Extract the 'result' field and return it as a string
        if json_response.get('success') and 'result' in json_response:
            if config.function_parameters:
                print(type(json.loads(json_response['result'])['_arguments']))
                return {"reply": json.loads(json.loads(json_response['result'])['_arguments'])}
            else:
                return {"reply": json.loads(json_response['result'])}
        else:
            # If 'result' is not found, return an error message
            return {"reply": "Error: Unable to get a valid response from Claude API"}
