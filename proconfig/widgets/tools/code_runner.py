from proconfig.widgets.base import BaseWidget, WIDGETS
from proconfig.utils.code_runner import evaluate_js_code, evaluate_python_code
from typing import Literal, Any, Dict
import torch

@WIDGETS.register_module()
class CodeRunnerWidget(BaseWidget):
    NAME = "Code Runner"
    CATEGORY = "Tools/Code Runner"
    
    class InputsSchema(BaseWidget.InputsSchema):
        language: Literal["python", "javascript"] = "python"
        params: Dict[str, Any]
        code: str

    
    class OutputsSchema(BaseWidget.OutputsSchema):
        result: Any
        
    @torch.no_grad()
    def execute(self, environ, config):
        return_dict = {}
        if config.language == "javascript":
            return_dict['result'] = evaluate_js_code(config.code_string, config.params)
        elif config.language == "python":
            return_dict['result'] = evaluate_python_code(config.code_string, config.params)
        else:
            raise NotImplementedError()
        return return_dict