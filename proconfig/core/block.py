from typing import Union, Dict, List, Literal, Any
from pydantic import BaseModel, Field, field_validator

from typing import Any, Literal, Union, List, Dict, Generic, TypeVar

from proconfig.core.common import CustomKey, ContextCustomKey, ReservedKeys, check_reserved_name, Transition, check_and_convert_transitions
from proconfig.core.variables import Variable, Input, Value

BlockType = Literal["automata", "state", "task", "workflow"]

class Block(BaseModel):
    type: BlockType = Field(..., description="type of the block")
    name: str = Field("", description="name of the block")
    display_name: str = Field(None, description="the display name of the block")
    properties: Dict[str, Any] = Field({}, description="to specify other properties")
    inputs: Dict[CustomKey, Union[Input, Value]] = {}
    outputs: Dict[Union[CustomKey, ContextCustomKey], Union[Variable, Value]] = {}
    breakpoint: bool = Field(False, description="Whether to set a breakpoint for debug for this block")
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.sanity_check()
        
    def sanity_check(self):
        if self.display_name == None:
            self.display_name = self.name
        pass
        
        
    @field_validator('inputs', mode="before")
    def check_inputs(cls, v, values, **kwargs):
        return v
    
    @field_validator('outputs', mode="before")
    def check_outputs(cls, v, values, **kwargs):
        check_reserved_name(v.keys(), ReservedKeys)
        return v
  
  
T = TypeVar('T', bound=Block)
    
BlockChildren = Union[List[T], Dict[CustomKey, T]]

class ContainerBlock(Block):
    context: Dict[Union[CustomKey, ContextCustomKey], Union[Variable, Value]] = Field({})
    blocks: BlockChildren[Block] = Field({})
    
    def sanity_check(self):
        super().sanity_check()
        if type(self.blocks) == list:
            block_dict = {}
            for block in self.blocks:
                block_dict[block.name] = block
            self.blocks = block_dict
        elif type(self.blocks) == dict:
            pass
        else:
            block = self.blocks
            self.blocks = {block.name: block}
            
        for k, v in self.context.items():
            if isinstance(v, Variable):
                self.context[k] = v.value
            

class BaseProp(BaseModel):
    cache: bool = None 

class TaskBase(Block):
    type: Literal["task"]
    properties: BaseProp = BaseProp()
    mode: Literal["block", "widget"] = "widget"
    
class BlockTask(TaskBase):
    mode: Literal["block"] = "block"
    block: Dict[str, Any] # should be validated later
    
class WidgetTask(TaskBase):
    mode: Literal["widget", "undefined"] = "widget"
    widget_name: str = None
    package_name: str = None
    widget_class_name: str = None
    # add widget id here
    
class WorkflowTask(TaskBase):
    mode: Literal["workflow"] = "workflow"
    workflow_id: str
    
class ComfyWorkflowTask(WidgetTask):
    mode: Literal["widget", "comfy_workflow"] = "widget"
    api: str # must be provided
    comfy_workflow_id: str | None = None # might be depreacated later
    location: str | None = None

Task = Union[ComfyWorkflowTask, BlockTask, WidgetTask, WorkflowTask]

T1 = TypeVar('T1', bound=Block)
class BlockWithTransitions(Block, Generic[T1]):
    transitions: Dict[T1, Transition] = None
    
    @field_validator('transitions', mode="before")
    def check_transitions(cls, v, values, **kwargs):
        v = check_and_convert_transitions(v)
        return v
    
        
    
class WidgetTaskWithAlwaysTransitions(WidgetTask, BlockWithTransitions[Literal["ALWAYS"]]):
    pass
    
class BlockTaskWithAlwaysTransitions(BlockTask, BlockWithTransitions[Literal["ALWAYS"]]):
    pass

class WorkflowTaskWithAlwaysTransitions(WorkflowTask, BlockWithTransitions[Literal["ALWAYS"]]):
    pass

TaskWithAlwaysTransitions = Union[WidgetTaskWithAlwaysTransitions, BlockTaskWithAlwaysTransitions, WorkflowTaskWithAlwaysTransitions]
