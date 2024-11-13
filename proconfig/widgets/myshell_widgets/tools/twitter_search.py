from typing import Any, Literal, Optional, List
from pydantic import Field, BaseModel

from proconfig.widgets.base import BaseWidget, WIDGETS

# import instructor
import os
from pydantic import BaseModel, Field
import requests
import json

@WIDGETS.register_module()
class XWidget(BaseWidget):
    NAME = "Twitter Search"
    CATEGORY = "Myshell Widgets/Tools"
    
    class InputsSchema(BaseWidget.InputsSchema):
        action: Literal["search_tweets", "scrape_tweets", "scrape_profile"] = Field("scrape_tweets", description="The action to perform")
        query: str = Field(default="", description="The query string to search for")
        sort_order: Literal["relevancy", "recency"] = Field("relevancy", description="The sort order of the results")
        twitter_handle: str = Field(default="", description="The Twitter handle (without @) to scrape or analyze")

    class OutputsSchema(BaseWidget.OutputsSchema):
        data: str | list
        
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
            "widget_id": "1784206090390036480",
            "input": json.dumps({
                "action": config.action,
                "query": config.query,
                "sort_order": config.sort_order,
                "twitter_handle": config.twitter_handle
            })
        }
        
        # Send POST request to the API
        response = requests.post(url, headers=headers, json=data)
        
        # Parse the JSON response
        json_response = response.json()
        
        # Extract the 'result' field and return it as a string
        if json_response.get('success') and 'result' in json_response:
            return {"data": json.loads(json_response['result'])['data']}
        else:
            # If 'result' is not found, return the entire response as a string
            return {"data": json.dumps(json_response)}
