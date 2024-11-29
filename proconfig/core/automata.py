from typing import Dict, Literal, Callable
from pydantic import field_validator

from proconfig.utils.expressions import calc_expression
from proconfig.utils.pytree import tree_map

from proconfig.core.common import CustomEventName, CustomKey, Transition, ReservedKeys, GLOBAL_CACHE_MODE
from proconfig.core.common import check_and_convert_transitions, check_reserved_name
from proconfig.core.block import BlockWithTransitions, BaseProp, BlockChildren, ContainerBlock
from proconfig.core.state import State
from proconfig.core.exception import ShellException

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
            error = {
                'error_code': 'SHELL-1101',
                'error_head': 'ShellAgent Running Error: cannot find available target state in conditional transition', 
                'msg': f"conditional transition failed: no target state found for {event_name}",
            }
            raise ShellException(**error)
        return transition_case
    
    
    def sanity_check(self):
        super().sanity_check()
        
        if self.initial == "":
            error = {
                'error_code': 'SHELL-1100',
                'error_head': 'Automata Initialization Error', 
                'msg': "the initial of automata cannot be empty",
            }
            raise ShellException(**error)
        if len(self.blocks) == 0:
            error = {
                'error_code': 'SHELL-1100',
                'error_head': 'Automata Initialization Error', 
                'msg': "the states cannot be empty",
            }
            raise ShellException(**error)
        if self.type not in ["", "automata"]:
            error = {
                'error_code': 'SHELL-1100',
                'error_head': 'Automata Initialization Error', 
                'msg': "the type must be automata",
            }
            raise ShellException(**error)
        if self.initial not in self.blocks:
            error = {
                'error_code': 'SHELL-1100',
                'error_head': 'Automata Initialization Error', 
                'msg': "the initial must be in the states",
            }
            raise ShellException(**error)
        
        check_reserved_name(self.blocks.keys(), ReservedKeys)
        check_reserved_name(self.context.keys(), ReservedKeys)
        self.check_transition_targets()
        # check ID unique, pass
        self.check_infinite_loop()
        
        
    def check_event_name_valid(self, event_name):
        if event_name in ["CHAT", "DONE", "ALWAYS"]:
            return
        if event_name.startswith("."):
            error = {
                'error_code': 'SHELL-1100',
                'error_head': 'Automata Initialization Error', 
                'msg': "event_name cannot start with `.`",
            }
            raise ShellException(**error)
        if " " in event_name:
            error = {
                'error_code': 'SHELL-1100',
                'error_head': 'Automata Initialization Error', 
                'msg': "event_name cannot include empty space",
            }
            raise ShellException(**error)
        

    def check_transition_targets(self):
        global_transitions = self.transitions
        for event_name, transition in global_transitions.items():
            self.check_event_name_valid(event_name)
            for transition_case in transition:
                if transition_case.target not in self.blocks:
                    error = {
                        'error_code': 'SHELL-1100',
                        'error_head': 'Automata Initialization Error', 
                        'msg': f"target of {event_name} is {transition_case['target']}, which is not a valid state name",
                    }
                    raise ShellException(**error)
                
        for state_name, state in self.blocks.items():
            local_transitions = state.transitions or {}
            for event_name, transition in local_transitions.items():
                self.check_event_name_valid(event_name)
                for transition_case in transition:
                    if transition_case.target not in self.blocks:
                        error = {
                            'error_code': 'SHELL-1100',
                            'error_head': 'Automata Initialization Error', 
                            'msg': f"target of {event_name} is {transition_case['target']}, which is not a valid state name",
                        }
                        raise ShellException(**error)

                    
            for button in state.render.buttons:
                if button.content == "":
                    error = {
                        'error_code': 'SHELL-1100',
                        'error_head': 'Automata Initialization Error', 
                        'msg': "content of button cannot be empty",
                    }
                    raise ShellException(**error)
                
                event = button.on_click
                if type(event) == str:
                    event = event
                elif type(event) == dict:
                    event = event["event"]
                else:
                    event = event.event
                if event not in local_transitions and event not in global_transitions:
                    error = {
                        'error_code': 'SHELL-1100',
                        'error_head': 'Automata Initialization Error', 
                        'msg': f"transition of event {event} is not defined",
                    }
                    raise ShellException(**error)

        
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
                        error = {
                            'error_code': 'SHELL-1100',
                            'error_head': 'Automata Initialization Error', 
                            'msg': f"inifinite loop found. visited state {transition_case.target}",
                        }
                        raise ShellException(**error)
                    else:
                        start_state_name = transition_case.target
                        visited.append(start_state_name)
                else:
                    break