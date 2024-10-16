from typing import Dict, Literal, Callable
from pydantic import field_validator

from proconfig.utils.expressions import calc_expression
from proconfig.utils.pytree import tree_map

from proconfig.core.common import CustomEventName, CustomKey, Transition, ReservedKeys, GLOBAL_CACHE_MODE
from proconfig.core.common import check_and_convert_transitions, check_reserved_name
from proconfig.core.block import BlockWithTransitions, BaseProp, BlockChildren, ContainerBlock
from proconfig.core.state import State


class StateWithTransitions(State, BlockWithTransitions[CustomEventName]):
    pass
    
class Automata(ContainerBlock):
    type: Literal["automata"]
    properties: BaseProp = BaseProp()
    initial: CustomKey
    blocks: BlockChildren[StateWithTransitions]
    transitions: Dict[CustomEventName, Transition] = {}
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
            
        self.sanity_check()
        
        for k, v in self.context.items():
            self.context[k] = calc_expression(v, {})
            
    @field_validator('transitions', mode="before")
    def check_transitions(cls, v, values, **kwargs):
        v = check_and_convert_transitions(v)
        return v
    
    def evaluate_conditional_transitions(self, event_name, transition, local_vars):
        target_state = None
        for transition_case in transition:
            if calc_expression(transition_case.condition, local_vars):
                target_state = transition_case.target
                break
        if target_state is None:
            import pdb; pdb.set_trace()
            raise NotImplementedError(f"conditional transition failed: no target state found for {event_name}")
        return transition_case
    
    
    def sanity_check(self):
        super().sanity_check()
        
        if self.initial == "":
            raise ValueError("the initial of automata cannot be empty")
        if len(self.blocks) == 0:
            raise ValueError("the states cannot be empty")
        if self.type not in ["", "automata"]:
            raise ValueError("the type must be automata")
        if self.initial not in self.blocks:
            import pdb; pdb.set_trace()
            raise ValueError("the initial must be in the states")
        
        check_reserved_name(self.blocks.keys(), ReservedKeys)
        check_reserved_name(self.context.keys(), ReservedKeys)
        self.check_transition_targets()
        # check ID unique, pass
        self.check_infinite_loop()
        
        
    def check_event_name_valid(self, event_name):
        if event_name in ["CHAT", "DONE", "ALWAYS"]:
            return
        if event_name.startswith("."):
            raise NotImplementedError("event_name cannot start with `.`")
        if " " in event_name:
            raise NotImplementedError("event_name cannot include empty space")
        

    def check_transition_targets(self):
        global_transitions = self.transitions
        for event_name, transition in global_transitions.items():
            self.check_event_name_valid(event_name)
            for transition_case in transition:
                if transition_case.target not in self.blocks:
                    raise ValueError(f"target of {event_name} is {transition_case['target']}, which is not a valid state name")
                
        for state_name, state in self.blocks.items():
            local_transitions = state.transitions or {}
            for event_name, transition in local_transitions.items():
                self.check_event_name_valid(event_name)
                for transition_case in transition:
                    if transition_case.target not in self.blocks:
                        raise ValueError(f"target of {event_name} is {transition_case['target']}, which is not a valid state name")
                    
            for button in state.render.buttons:
                if button.content == "":
                    raise ValueError("content of button cannot be empty")
                
                event = button.on_click
                if type(event) == str:
                    event = event
                elif type(event) == dict:
                    event = event["event"]
                else:
                    event = event.event
                if event not in local_transitions and event not in global_transitions:
                    raise ValueError(f"transition of event {event} is not defined")

        
    def check_infinite_loop(self):
        state_names = list(self.blocks.keys())
        while len(state_names) > 0:
            start_state_name = state_names.pop()
            visited = [start_state_name]
            while True:
                transitions = self.blocks[start_state_name].transitions or {}
                if len(transitions) == 1 and "ALWAYS" in transitions and len(transitions["ALWAYS"]) == 1:
                    transition_case = transitions["ALWAYS"][0]
                    if transition_case.target in visited:
                        raise ValueError(f"inifinite loop found. visited state {transition_case.target}")
                    else:
                        start_state_name = transition_case.target
                        visited.append(start_state_name)
                else:
                    break