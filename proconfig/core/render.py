from typing import Union, Dict, List, Optional
from pydantic import BaseModel, Field

from .common import CustomKey, CustomEventName
from .variables import URLString, Expression, Value


class EventPayload(BaseModel):
    event: CustomEventName
    payload: Dict[CustomKey, Union[Expression, Value]]

    
class Button(BaseModel):
    content: str = ""
    description: Optional[str] = Field(default=None, description="Tooltip when hovering button")
    on_click: Union[CustomEventName, EventPayload] = Field(..., description="event name triggered")
    style: Dict[str, str] = None # TODO
    
    
class RenderConfig(BaseModel):
    text: Optional[str] = None
    image: Optional[URLString] = None
    audio: Optional[URLString] = None
    video: Optional[URLString] = None
    buttons: Optional[Union[List[Button], List[List[Button]]]] = []
    suggested_reply: Optional[List[str]] = None