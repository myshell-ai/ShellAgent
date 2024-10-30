from typing import Any, Literal, Optional, List
from pydantic import Field, BaseModel

from proconfig.widgets.base import BaseWidget, WIDGETS

# import instructor
import os
import json
import requests
from openai import OpenAI
from pydantic import BaseModel, Field
import base64

TypeMap = {
    "str": str,
    "int": int,
    "float": float,
    "bool": bool,
    "list": list,
    "dict": dict,
}

GPT_WIDGET_ID = {
    "gpt-3.5-turbo": "1744214024104448000",
    "gpt-4o": "1744214024104448199",
    "gpt-4o-mini": "1744218088699597788",
    "gpt-4-turbo": "1744214047475109888",
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
    with open(image_path, "rb") as image_file:
        base64_image = base64.b64encode(image_file.read()).decode("utf-8")
    return f"data:image/png;base64,{base64_image}"

class MemoryItem(BaseModel):
    role: Literal["user", "assistant"]
    content: str | List[Any]

GPT_MEMORY_KEY = "GPT_MEMORY_KEY"
@WIDGETS.register_module()
class GPTWidget(BaseWidget):
    NAME = "GPT"
    CATEGORY = "Large Language Model/OpenAI GPT"
    
    class InputsSchema(BaseWidget.InputsSchema):
        model: Literal["gpt-3.5-turbo", "gpt-4o", "gpt-4o-mini", "gpt-4-turbo"] = "gpt-4o"
        system_prompt: str = ""
        user_prompt: str = ""
        input_image: Optional[str] = None
        memory: List[MemoryItem] = []
        function_parameters: List[FunctionParameter] = []
        memory_mode: Literal["auto", "manual"] = "auto"
        temperature: float = 0.7
        top_p: float = 1.0
        max_tokens: Optional[int] = None
        stream: bool = False
        presence_penalty: float = 0.0
        frequency_penalty: float = 0.0
        callback: Any = Field(None, hidden=True, visible=False)
        widget_run_id: Any = Field(None, hidden=True, visible=False)
        function_name: str = Field("any_function_name", hidden=True, visible=False)
        function_description: str = Field("any_function_description", hidden=True, visible=False)
        
    
    class OutputsSchema(BaseWidget.OutputsSchema):
        reply: str | dict
        
    def execute(self, environ, config):
        print("widget run id:", config.widget_run_id)
        
        if config.memory_mode == "auto":
            if GPT_MEMORY_KEY not in environ:
                environ[GPT_MEMORY_KEY] = {}
            config.memory = environ[GPT_MEMORY_KEY].get(config.widget_run_id, [])
        
        """
        Execute the LLM function.
        """
        config.system_prompt = config.system_prompt or ""
        config.user_prompt = config.user_prompt or ""

        if config.input_image is not None:
            assert config.model in ["gpt-4o", "gpt-4o-mini", "gpt-4-turbo"], "the gpt model does not support image input"
            config.user_prompt = [
                {"type": "text", "text": config.user_prompt},
                {"type": "image_url", "image_url": {"url": encode_image(config.input_image)}}
            ]
        else:
            config.user_prompt = config.user_prompt

        if "OPENAI_API_KEY" not in os.environ:
            # API endpoint URL
            url = "https://openapi.myshell.ai/public/v1/widget/run"
            
            # Headers for the API request
            headers = {
                "x-myshell-openapi-key": os.environ["MYSHELL_API_KEY"],
                "Content-Type": "application/json"
            }

            # Request payload
            if config.function_parameters:
                data = {
                    "widget_id": GPT_WIDGET_ID[config.model],
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
                    "widget_id": GPT_WIDGET_ID[config.model],
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

            # Send POST request to the API
            response = requests.post(url, headers=headers, json=data)

            # Parse the JSON response
            json_response = response.json()

            if config.memory_mode == "auto":
                config.memory += [
                    MemoryItem(role="user", content=config.user_prompt),
                    MemoryItem(role="assistant", content=json_response['result'])
                ]
                environ[GPT_MEMORY_KEY][config.widget_run_id] = config.memory
            
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
                return {"reply": "Error: Unable to get a valid response from GPT API"}
            
        else:
            try:
                client = OpenAI(api_key=os.environ["OPENAI_API_KEY"])
            except Exception as e:
                raise ValueError(f'[Warning] Initiate OpenAI error: {e}')
                
            messages = [{"role": "system", "content": config.system_prompt},]
            
            for memory_item in config.memory:
                messages.append(memory_item.model_dump())
                
            messages.append({"role": "user", "content": config.user_prompt})
                
            tools = {
                "type": "function",
                "function": {
                    "name": "any_function_name",
                    "strict": True,
                    "description": "any_function_description",
                    "parameters": {
                        "type": "object",
                        "properties": {},
                        "required": [],
                        "additionalProperties": False
                    }
                }
            }
            # add parameters to the tools
            for function_parameter in config.function_parameters:
                tools["function"]["parameters"]["properties"][function_parameter.name] = {
                    "type": function_parameter.type,
                    "description": function_parameter.description
                }
                tools["function"]["parameters"]["required"].append(function_parameter.name)

            print('tools:', [tools])

            output = client.chat.completions.create(
                model=config.model,
                temperature=config.temperature,
                top_p=config.top_p,
                max_tokens=config.max_tokens,
                stream=config.stream,
                presence_penalty=config.presence_penalty,
                frequency_penalty=config.frequency_penalty,
                messages=messages,
                tools=[tools] if config.function_parameters else None,
                tool_choice="required" if config.function_parameters else None
            )
            
            if config.stream:
                full_reply = ""
                for chunk in output:
                    chunk_str = chunk.choices[0].delta.content
                    if chunk_str is not None:
                        full_reply += str(chunk_str) 
                        print(full_reply)
                        config.callback(stream_output=full_reply)
                return_dict = {'reply': full_reply}
            else:
                result = output.model_dump()
                return_dict = {'reply': result['choices'][0]['message']['content']}
                if result['choices'][0]['message']['tool_calls'] is not None:
                    arguments = json.loads(result['choices'][0]['message']['tool_calls'][0]['function']['arguments'])
                    return_dict = {'reply': arguments}
                    
            
            if config.memory_mode == "auto":
                
                config.memory += [
                    MemoryItem(role="user", content=config.user_prompt),
                    MemoryItem(role="assistant", content=str(return_dict["reply"]))
                ]
                environ[GPT_MEMORY_KEY][config.widget_run_id] = config.memory
                
            return return_dict