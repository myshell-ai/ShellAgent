from typing import Literal
import copy
import time
from typing import Literal

from proconfig.core.variables import Variable
from proconfig.utils.pytree import tree_map
from proconfig.utils.expressions import calc_expression
from proconfig.utils.dag import DAG
from proconfig.core.block import ContainerBlock, BaseProp, BlockChildren, TaskWithAlwaysTransitions


class Workflow(ContainerBlock):
    type: Literal["workflow"]
    properties: BaseProp = BaseProp()
    blocks: BlockChildren[TaskWithAlwaysTransitions]
    tasks_dag: DAG = None
    debug_uuid: str = None
    
    def sanity_check(self):
        super().sanity_check()
        has_transitions = any([block.transitions is not None for block in self.blocks.values()])
        if has_transitions:
            # build DAG
            dag = DAG()
            for block_name, block in self.blocks.items():
                if block_name not in dag.graph:
                    dag.graph[block_name]
                if block.transitions is not None:
                    for transition in block.transitions["ALWAYS"]:
                        dag.add_edge(block_name, transition.target)
            dag.topological_sort()
            print("dag order:", dag.top_order)
            self.blocks = {k: self.blocks[k] for k in dag.top_order if k in self.blocks}
            self.tasks_dag = dag
            
    def _get_required_local_variable(self):
        required_local_variable = []
        def append_name_to_list(x):
            if self.is_ref(x):
                v = x[2:-2]
                splits = v.split(".")
                assert len(splits) == 2 and splits[0] in self.blocks
                required_local_variable.append(splits)

        _ = tree_map(lambda x: append_name_to_list(x), self.outputs)
        for _, task in self.blocks.items():
            _ = tree_map(lambda x: append_name_to_list(x), task.inputs)

        return required_local_variable
    
    
    def is_ref(self, v):
        if type(v) == str and v.startswith(r"{{") and v.endswith(r"}}"):
            v = v[2:-2]
            if r"{{" not in v and r"}}" not in v:
                splits = v.split(".", 1)
                if splits[0] in self.blocks:
                    return True
        return False