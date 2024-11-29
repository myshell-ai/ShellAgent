from typing import Optional, Dict, Any, Union, List
from pydantic import Field, BaseModel
from proconfig.core.exception import ShellException

CustomKey = str
ContextCustomKey = str
CustomEventName = str

ReservedKeys = [
    'type',
    'id',
    'properties',
    'inputs',
    'outputs',
    'tasks',
    'render',
    'transitions',
    'states',
    'context',
    'payload'
]

Expression = str 
BoolExpression = str 
URLString = str
TargetName = str
TriggerableEvents = str

GLOBAL_CACHE_MODE = "GLOBAL_CACHE_MODE"

class TransitionCase(BaseModel):
    target: TargetName = Field(..., description="Transit to the self if unspecified")
    condition: Optional[BoolExpression] = Field(default='{{True}}', description="Transit only if `condition` is evaluated as `true`. Treated as `true` when unspecified.")
    target_inputs: Dict[str, Any] = Field(default={}, description="Additional inputs to the target states")
    error_message: Optional[str] = Field(default=None, description="Might display a message when `condition` is not satisfied")

Transition = Union[TargetName, TransitionCase, List[TransitionCase]]


def check_reserved_name(keys, reserved_names):
    for key in keys:
        if key in reserved_names:
            error = {
                'error_code': 'SHELL-1100',
                'error_head': 'Automata Initialization Error', 
                'msg': f'{key} is a reserved name.',
            }
            raise ShellException(**error)
        
def check_and_convert_transitions(transitions):
    for name, transition in transitions.items():
        if type(transition) == str:
            transition = [
                {
                    "target": transition,
                    "condition": "{{1}}"
                }
            ]
        elif type(transition) == dict:
            transition = [TransitionCase.model_validate(transition).model_dump()]
        elif type(transition) == list:
            for i, case in enumerate(transition):
                transition[i] = TransitionCase.model_validate(case).model_dump()
        else:
            error = {
                'error_code': 'SHELL-1100',
                'error_head': 'Automata Initialization Error', 
                'msg': f'The transition {name} are not defined properly',
            }
            raise ShellException(**error)
        transitions[name] = transition
    return transitions
        