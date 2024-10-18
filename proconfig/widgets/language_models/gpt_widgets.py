from typing import Any, Literal, Optional, List
from pydantic import Field, BaseModel

from proconfig.widgets.base import BaseWidget, WIDGETS

# import instructor
import os
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
        
    
    class OutputsSchema(BaseWidget.OutputsSchema):
        reply: str
        
    def execute(self, environ, config):
        print("widget run id:", config.widget_run_id)
        
        if config.memory_mode == "auto":
            if GPT_MEMORY_KEY not in environ:
                environ[GPT_MEMORY_KEY] = {}
            config.memory = environ[GPT_MEMORY_KEY].get(config.widget_run_id, [])
        
        try:
            client = OpenAI(api_key=os.environ["OPENAI_API_KEY"])
        except Exception as e:
            raise ValueError(f'[Warning] Initiate OpenAI error: {e}')
        """
        Execute the LLM function.
        """
        config.system_prompt = config.system_prompt or ""
        config.user_prompt = config.user_prompt or ""
        
        if config.input_image is not None:
            assert config.model in ["gpt-4o", "gpt-4o-mini", "gpt-4-turbo"], "the gpt model does not support image input"
            user_prompt = [
                {"type": "text", "text": config.user_prompt},
                {"type": "image_url", "image_url": {"url": encode_image(config.input_image)}}
            ]
        else:
            user_prompt = config.user_prompt
            
        messages = [{"role": "system", "content": config.system_prompt},]
        
        for memory_item in config.memory:
            messages.append(memory_item.model_dump())
            
        messages.append({"role": "user", "content": user_prompt})
            
        tools = {
            "type": "function",
            "function": {
                "name": "any_function_name",
                "strict": True,
                "description": "any description",
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
                arguments = result['choices'][0]['message']['tool_calls'][0]['function']['arguments']
                return_dict = {'reply': arguments}
                
        
        if config.memory_mode == "auto":
            
            config.memory += [
                MemoryItem(role="user", content=user_prompt),
                MemoryItem(role="assistant", content=return_dict["reply"])
            ]
            environ[GPT_MEMORY_KEY][config.widget_run_id] = config.memory
            
        return return_dict