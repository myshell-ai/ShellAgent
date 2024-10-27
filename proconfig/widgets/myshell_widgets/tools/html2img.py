from typing import Any, Literal, Optional, List
from pydantic import Field, BaseModel

from proconfig.widgets.base import BaseWidget, WIDGETS

# import instructor
import os
from pydantic import BaseModel, Field
import requests
import json

@WIDGETS.register_module()
class Html2ImgWidget(BaseWidget):
    NAME = "HTML to Image"
    CATEGORY = "Myshell Widgets/Tools"
    
    class InputsSchema(BaseWidget.InputsSchema):
        html_str: str = Field(default="", description="The HTML string to convert to an image")
        width: int = Field(default=800, description="The width of the image")
        height: int = Field(default=600, description="The height of the image")

    class OutputsSchema(BaseWidget.OutputsSchema):
        image: str
        
    def execute(self, environ, config):
        # API endpoint URL
        url = "https://openapi.myshell.ai/public/v1/widget/run"
        
        # Headers for the API request
        headers = {
            "x-myshell-openapi-key": os.environ["MYSHELL_API_KEY"],
            "Content-Type": "application/json"
        }
        
        # Request payload
        data = {
            "widget_id": "1850127954369142784",
            "input": json.dumps({
                "html_str": config.html_str,
                "width": config.width,
                "height": config.height
            })
        }
        
        # Send POST request to the API
        response = requests.post(url, headers=headers, json=data)
        
        # Parse the JSON response
        json_response = response.json()
        
        # Extract the 'result' field and return it as a string
        if json_response.get('success') and 'result' in json_response:
            return {"image": json.dumps(json.loads(json_response['result'])['image'])}
        else:
            # If 'result' is not found, return the entire response as a string
            return {"image": json.dumps(json_response)}