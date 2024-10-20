from pydantic import BaseModel, ConfigDict, Field
from proconfig.utils.registry import Registry, build_from_cfg
import enum
import os
from proconfig.utils.pytree import tree_map
from proconfig.utils.misc import process_local_file_path

WIDGETS = Registry('widgets')

def build_widgets(obj_type, package_name=None, **kwargs):
    return build_from_cfg(obj_type, WIDGETS, package_name=package_name.split('/')[1] if package_name is not None else None, **kwargs)


class WidgetCategory(enum.Enum):
    VISUAL_GENERATION = ("Visual Generation")


class ExtraInputsSchema(BaseModel):
    def convert():
        pass

INPUT_SCHEMA_MODE_KEY = 'inputs_schema_mode'
CURRENT_WORK_DIR = os.getcwd()

class BaseWidget:
    exclusive_mode: bool = False
    CATEGORY: str = None

    class InputsSchema(BaseModel):
        model_config = ConfigDict(
            protected_namespaces=(INPUT_SCHEMA_MODE_KEY,),
            # extra = "forbid"
        )
        
        def convert(config):
            pass


    class OutputsSchema(BaseModel):
        pass

    InputsSchemaDict = {}

    def process_ckpt_paths(self, config, ckpt_path_lists=[]):
        if not isinstance(config, BaseModel):
            return config
        for field_name, field in config.model_fields.items():
            if getattr(config, field_name) is None:
                continue
            sub_field = getattr(config, field_name)
            if isinstance(sub_field, BaseModel):
                sub_field = self.process_ckpt_paths(sub_field)
                setattr(config, field_name, sub_field)
            elif isinstance(sub_field, list):
                sub_field = [self.process_ckpt_paths(item) for item in sub_field]
                setattr(config, field_name, sub_field)
            elif isinstance(sub_field, dict):
                sub_field = {k: self.process_ckpt_paths(v) for k, v in sub_field.items()}
                setattr(config, field_name, sub_field)
            else:
                field_extra_info = field.json_schema_extra
                if field_extra_info is not None:
                    subfolder = field_extra_info.get('subfolder')
                    model_path_mode = field_extra_info.get('model_path_mode')
                    if subfolder and model_path_mode:
                        if model_path_mode == 'rel':
                            setattr(config, field_name, os.path.join('models', subfolder, getattr(config, field_name)))
                        elif model_path_mode == 'fname':
                            pass
                        else:
                            raise NotImplementedError(f'Unsupported {model_path_mode=}, expected ["rel", "fname"]. \n Details: Error when deal with {field_name}: {field}')
                        ckpt_path_lists.append(getattr(config, field_name))
        return config
    

    def execute(self, environ: dict = {}, inputs: dict = {}):
        return {}

    def __call__(self, environ: dict = {}, inputs: dict = {}, return_config=False):
        ''' 
        the inputs should be 
        {
          "inputs_schema_mode": "advanced",
          "inputs": {
              ...
          }
        }
        '''
        if INPUT_SCHEMA_MODE_KEY in inputs:
            input_schema_mode = inputs.pop(INPUT_SCHEMA_MODE_KEY)
            InputsSchemaClass = self.InputsSchemaDict.get(input_schema_mode, self.InputsSchema)
            schema = InputsSchemaClass
            ori_config = schema.model_validate(inputs)
            if schema != self.InputsSchema:
                config = ori_config.convert()
            else:
                config = ori_config
        else:
            schema = self.InputsSchema
            config = schema.model_validate(inputs)
            
        if hasattr(config, "callback"):
            config.callback = inputs["callback"]
                    
        config = self.process_ckpt_paths(config, [])
        return_dict = self.execute(environ, config)
        
        return_dict = tree_map(lambda x: x[len(CURRENT_WORK_DIR) + 1:] if type(x) == str and x.startswith(CURRENT_WORK_DIR) else x, return_dict)
        
        if os.environ.get('RUN_AS_CLOUD_SERVER', False):
            return_dict = tree_map(lambda x: process_local_file_path(x), return_dict)
        
        try:
            self.OutputsSchema.model_validate(return_dict)
        except Exception as e:
            raise e
            
        if return_config:
            return return_dict, config
        else:
            return return_dict