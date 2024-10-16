from proconfig.widgets.base import BaseWidget, WIDGETS
from pydantic import Field, WithJsonSchema
import torch
from typing import Literal, Annotated, List, Any, Union
from pydantic.fields import FieldInfo
from annotated_types import Ge, Le
import os
import traceback
import time
import re
import glob
import logging
import traceback
import importlib
import folder_paths

Ellipsis = ...

from nodes import init_builtin_extra_nodes, load_custom_node
from nodes import NODE_DISPLAY_NAME_MAPPINGS, NODE_CLASS_MAPPINGS
init_builtin_extra_nodes()

var_type_map = {
    "INT": "int",
    "FLOAT": "float",
    "IMAGE": "IMAGE",
    "STRING": "str",
    "CONDITIONING": "CONDITION",
    "BOOLEAN": "bool",
    "*": "Any",
    # some hard code
    "INT,FLOAT": "Union[int, float]",
    "INT:seed": "int",
}

native_types = ['str', 'int', 'float', 'bool']

field_kwargs_map = {
    "min": "ge",
    "max": "le",
    "step": "multiple_of",
    "multiline": "multiline",
    # "placeholder": "placeholder",
    "image_upload": "image_uplaod",
    "video_upload": "video_upload",
    "audio_upload": "audio_upload",
    "dynamicPrompts": "dynamicPrompts",
    "round": "round",
    "padding": "padding"
}

reserved_names = ["if", "break", "else", "elif", "continue", "while", "pass", "in"]

ignore_fields = [
    "pysssss.autocomplete",
    "pysssss.binding",
    "placeholder"
]

save_image_nodes = ['PreviewImage', 'SaveImage']

def init_external_custom_nodes():
    """
    Initializes the external custom nodes.

    This function loads custom nodes from the specified folder paths and imports them into the application.
    It measures the import times for each custom node and logs the results.

    Returns:
        None
    """
    base_node_names = set(NODE_CLASS_MAPPINGS.keys())
    node_paths = ["proconfig/widgets/imagen_widgets/library/comfy_custom_nodes"]
    node_import_times = []
    for custom_node_path in node_paths:
        possible_modules = os.listdir(os.path.realpath(custom_node_path))
        if "__pycache__" in possible_modules:
            possible_modules.remove("__pycache__")

        for possible_module in possible_modules:
            module_path = os.path.join(custom_node_path, possible_module)
            if os.path.isfile(module_path) and os.path.splitext(module_path)[1] != ".py": continue
            if module_path.endswith(".disabled"): continue
            time_before = time.perf_counter()
            success = load_custom_node(module_path, base_node_names)
            if not success:
                print(module_path)
            node_import_times.append((time.perf_counter() - time_before, module_path, success))

    if len(node_import_times) > 0:
        logging.info("\nImport times for custom nodes:")
        for n in sorted(node_import_times):
            if n[2]:
                import_message = ""
            else:
                import_message = " (IMPORT FAILED)"
            logging.info("{:6.1f} seconds{}: {}".format(n[0], import_message, n[1]))
        logging.info("")
        
def execute_prestartup_script():
    def execute_script(script_path):
        module_name = os.path.splitext(script_path)[0]
        try:
            spec = importlib.util.spec_from_file_location(module_name, script_path)
            module = importlib.util.module_from_spec(spec)
            spec.loader.exec_module(module)
            return True
        except Exception as e:
            print(f"Failed to execute startup-script: {script_path} / {e}")
        return False

    node_paths = ["proconfig/widgets/imagen_widgets/library/comfy_custom_nodes"]
    for custom_node_path in node_paths:
        possible_modules = os.listdir(custom_node_path)
        node_prestartup_times = []

        for possible_module in possible_modules:
            module_path = os.path.join(custom_node_path, possible_module)
            if os.path.isfile(module_path) or module_path.endswith(".disabled") or module_path == "__pycache__":
                continue

            script_path = os.path.join(module_path, "prestartup_script.py")
            if os.path.exists(script_path):
                time_before = time.perf_counter()
                success = execute_script(script_path)
                node_prestartup_times.append((time.perf_counter() - time_before, module_path, success))
    if len(node_prestartup_times) > 0:
        print("\nPrestartup times for custom nodes:")
        for n in sorted(node_prestartup_times):
            if n[2]:
                import_message = ""
            else:
                import_message = " (PRESTARTUP FAILED)"
            print("{:6.1f} seconds{}:".format(n[0], import_message), n[1])
        print()

def add_suffixes(input_list):
    count = {}
    result = []
    input_list = map(str, input_list)
    for item in input_list:
        if item in count:
            count[item] += 1
            result.append(f"{item}_{count[item]}")
        else:
            count[item] = 1
            result.append(item)
    
    # Second pass to correct the first occurrence of duplicates
    for i in range(len(result)):
        item = result[i]
        if item in count and count[item] > 1:
            result[i] = f"{item}_1"
            count[item] -= 1
    
    return result

def to_valid_variable_name(input_string):
    # Replace dots and spaces with underscores
    input_string = input_string.replace('.', '_').replace(' ', '_')
    
    # Remove all non-ASCII characters
    input_string = input_string.encode('ascii', 'ignore').decode('ascii')
    
    # Remove any characters that are not alphanumeric or underscores
    input_string = re.sub(r'[^0-9a-zA-Z_]', '', input_string)
    
    # Ensure the variable name does not start with a digit
    if input_string and input_string[0].isdigit():
        input_string = 'var_' + input_string
    
    input_string = input_string.lower()
    if input_string == '':
        return 'result'
    if input_string in native_types:
        input_string += "_var"
    if input_string.startswith("_"):
        input_string = "var" + input_string
    if input_string in reserved_names:
        input_string += "_input"
    return input_string


@WIDGETS.register_module(name="ComfyUI/Reroute")
class ComfyRerouteWidget(BaseWidget):
    NAME = "ComfyUI/Reroute"
    CATEGORY = "ComfyUI Nodes/utils"
    class InputsSchema(BaseWidget.InputsSchema):
        input_var_0: Any = None
        
    class OutputsSchema(BaseWidget.OutputsSchema):
        output_var: Any
        
    @torch.no_grad()
    def execute(self, environ, config: dict = {}):
        return {"output_var": config.input_var_0}

default_value_map = {}
node_instances = {}

def convert_var_type(var_type):
    pass

def is_native_types(var_type):
    for prefix in ["Literal", "Union"]:
        if var_type.startswith(prefix):
            return True
    return var_type in native_types
        
    
def build_comfy_widget(node_name, NodeID, NodeClass) -> BaseWidget:
    if node_name in node_instances:
        raise ValueError(f"node {node_name} is already registered!")
    
    return_dict = {}
    
    types_lines = ''
    INPUT_IS_LIST = getattr(NodeClass, "INPUT_IS_LIST", False)
    total_lines = f"""
@WIDGETS.register_module(name="ComfyUI/{NodeID}")
class ComfyWidget(BaseWidget):
    NAME = "{node_name}"
    CATEGORY = "ComfyUI Nodes/{NodeClass.CATEGORY.split('/')[0]}"
    INPUT_IS_LIST = {INPUT_IS_LIST}
    class InputsSchema(BaseWidget.InputsSchema):
"""
    var_name_map = {}
    count = 0
    if NodeID in ["LoadImage"]:
        is_upload = True
    else:
        is_upload = False
    
    try:
        for variable_category, variables in NodeClass.INPUT_TYPES().items():
            hidden = variable_category == "hidden"
            for var_name, var_schema in variables.items():
                count += 1

                if type(var_schema) not in [tuple, list]:
                    var_schema = (var_schema, {"default": None})
                    
                var_type = var_schema[0]
                
                if len(var_schema) > 1:
                    field = var_schema[1]
                else:
                    field = {}
                    
                if type(field) == str:
                    field = {"default": field}

                if type(var_type) == tuple:
                    var_type = list(var_type)
                    
                choices = None
                if type(var_type) == list:
                    if "default" not in field:
                        if len(var_type) > 0:
                            field["default"] = var_type[0]
                        else:
                            field["default"] = ...

                    if len(var_type) > 0:
                        choices = var_type
                        var_type = "Literal" + str(var_type)
                    else:
                        var_type = "str"
                        
                elif str(var_type) in var_type_map:
                    var_type = var_type_map[str(var_type)]
                else:
                    var_type = var_type
                    
                if type(var_type) == str and not is_native_types(var_type):
                    var_type = var_type.upper()
                    if var_type not in globals():
                        globals()[var_type] =  Annotated[Any, WithJsonSchema({'type': var_type})]

                if (variable_category != "required") and "default" not in field:
                    default_value = None
                elif "default" not in field:
                    default_value = ...
                else:
                    default_value = field['default']
                    
                field_kwargs = {}
                for k, v in field.items():
                    if k in ignore_fields:
                        continue
                    if k in ['min', 'max'] and var_type == 'int':
                        v = int(v)
                    if k in ["default", "display"]:
                        continue
                    if k not in field_kwargs_map:
                        print(f"warning: cannot find {k}")
                        field_kwargs_map[k] = k
                    else:
                        new_k = field_kwargs_map[k]
                        if k == "step" and type(v) == float:
                            continue
                        field_kwargs[new_k] = v
                    
                if is_upload:
                    var_type = "str"
                    if choices is not None:
                        field_kwargs["choices"] = choices

                if hidden:
                    field_kwargs["hidden"] = True
                field_str = ", ".join([f"{k}={v}" if type(v) != str else f'{k}="{v}"' for k, v in field_kwargs.items()])
                
                new_var_name = to_valid_variable_name(var_name)
                var_name_map[new_var_name] = var_name

                if INPUT_IS_LIST:
                    if type(default_value) != list and default_value != ...:
                        # revert to normal input, it is wrong type of the ComfyUI
                        var_type_display = f"Union[List[{var_type}], {var_type}]"
                    else:
                        var_type_display = f"List[{var_type}]"
                        if var_type in ["int", "float"]:
                            field_str = "" # TODO list input for int does not support le, ge
                else:
                    var_type_display = var_type
                    field_str = field_str
                    
                default_value_new = f"\'{default_value}\'" if type(default_value) == str else default_value
                # if default_value_new == 'euler':
                #     import pdb; pdb.set_trace()
                default_value_map[count] = default_value
                
                line = f"        {new_var_name}: {var_type_display} = Field(default_value_map[{count}], {field_str})\n"
                total_lines += line
    except Exception as e:
        print(traceback.format_exc())
        print(e)
        
    # output schema
    output_line = ""
    return_dict_line = ""
    
    if not hasattr(NodeClass, "RETURN_NAMES"):
        RETURN_NAMES = add_suffixes(NodeClass.RETURN_TYPES)
    else:
        RETURN_NAMES = NodeClass.RETURN_NAMES
    RETURN_TYPES = NodeClass.RETURN_TYPES
    added_output = False
    if len(RETURN_NAMES) == 0:
        RETURN_TYPES = ('*',)
        RETURN_NAMES = ('result',)
        added_output = True
      
    # handle the output is list
    if NodeID in save_image_nodes:
        outputs_is_list = [True]
    else:
        outputs_is_list = getattr(NodeClass, "OUTPUT_IS_LIST", [False] * len(RETURN_NAMES))
    if len(outputs_is_list) == 1 and len(RETURN_NAMES) > 1:
        outputs_is_list = outputs_is_list * len(RETURN_NAMES)
    
    output_count = 0  
    for return_name, return_type, output_is_list in zip(RETURN_NAMES, RETURN_TYPES, outputs_is_list):
        return_name = to_valid_variable_name(return_name)
        if type(return_type) == list:
            if len(return_type) > 0:
                return_type = "Literal" + str(return_type)
            else:
                return_type = "str"
        else:
            return_type = var_type_map.get(str(return_type), return_type)
            
        extra_kwargs = ""
        if output_is_list:
            return_type_display = f"List[{return_type}]"
            extra_kwargs = "is_list=True"
        else:
            return_type_display = return_type
        output_line += f"        {return_name}: {return_type_display} = Field({extra_kwargs})\n"
        if type(return_type) == str and return_type not in native_types:
            if return_type not in globals():
                globals()[return_type] =  Annotated[Any, WithJsonSchema({'type': return_type})]
                types_lines += f"{return_type} = Annotated[str, WithJsonSchema({{'type': '{return_type}'}})]\n"
        return_dict_line += f"            \"{return_name}\": outputs[{output_count}] if {output_count} < len(outputs) else '',\n"
        output_count += 1
    
    function_name = NodeClass.FUNCTION
    node_instances[node_name] = NodeClass()
    output_line1 = f'outputs = node_instances[\"{node_name}\"].{function_name}(**kwargs)'
    convert_lines = ""
    for new_var_name, ori_name in var_name_map.items():
        convert_lines += f'"{ori_name}": kwargs_new["{new_var_name}"],\n'
        
    total_lines += f"""
        pass
    class OutputsSchema(BaseWidget.OutputsSchema):
{output_line}
        pass
    
    @torch.no_grad()
    def execute(self, environ, config: dict = {{}}):
        config = self.InputsSchema.model_validate(config)
        kwargs_new = config.model_dump()
        
        kwargs = {{
            {convert_lines}
        }}
        
        if {is_upload}:
            for k, v in kwargs.items():
                if type(v) == str and v.startswith("input/"):
                    kwargs[k] = v[len("input/"):]
            
        try:
            {output_line1}
        except Exception as e:
            logging.error(e, exc_info=True)
            print(traceback.format_exc())
            print(\'{output_line1}\')
            print(node_instances[\"{node_name}\"])
            raise e
        if type(outputs) == dict:
            if 'result' in outputs:
                outputs = outputs['result']
            elif {added_output}:
                # convert for save_images
                if 'ui' in outputs and 'images' in outputs['ui']:
                    outputs = [item['type'] + '/' + item['filename'] for item in outputs['ui']['images']]
                outputs = [outputs]
        return_dict = {{
{return_dict_line}        }}
        return return_dict
return_dict['result'] = ComfyWidget
"""
    try:
        exec(total_lines)
    except Exception as e:
        print(total_lines)
        print(traceback.format_exc())
    return return_dict['result']

init_external_custom_nodes()
execute_prestartup_script()

failed_nodes = []
for NodeID, NodeClass in NODE_CLASS_MAPPINGS.items():
    try:
        WidgetClass = build_comfy_widget(NODE_DISPLAY_NAME_MAPPINGS.get(NodeID, NodeID), NodeID, NodeClass)
    except Exception as e:
        logging.warning(f"failed to load {NodeID}, \n {e}")
        print(traceback.format_exc())
        failed_nodes.append(NodeID)
        
print("summary: failed nodes:", failed_nodes)

if __name__ == '__main__':
    pass