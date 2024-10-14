from typing import Union, Literal
from pydantic import Field

from typing import Literal, Union

from proconfig.core.block import BaseProp, Block, BlockChildren, Task
from proconfig.core.workflow import Workflow
from proconfig.core.render import RenderConfig

class StateProp(BaseProp):
    is_final: bool = False 
    
class State(Block):
    type: Literal["state"] = "state"
    properties: StateProp = StateProp()
    blocks: BlockChildren[Union[Task, Workflow]] = Field({})
    render: RenderConfig = RenderConfig()
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.sanity_check()
        
    def sanity_check(self):
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
        # check IM count
        self.check_input_IM()
        
    def check_input_IM(self):
        IM_count = 0
        for k, v in self.inputs.items():
            if v.type in ["text", "string"] and v.source == "IM":
                IM_count += 1
        if IM_count > 1:
            raise ValueError(f"state {self.name} contains more than 1 inputs with of source `IM`")