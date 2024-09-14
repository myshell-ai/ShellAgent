import os
import sys
import importlib


def load_module(module_path, module_root="proconfig/widgets/imagen_widgets/library/comfy_custom_nodes", overwrite_init=None, module_name=None):
    module_path = os.path.join(*module_root.split('/'), module_path)
    if module_name is None:
        module_name = os.path.basename(module_path)
    if os.path.isfile(module_path):
        module_spec = importlib.util.spec_from_file_location(module_name, module_path)
    else:
        module_init_path = os.path.join(module_path, "__init__.py")
        if type(overwrite_init) == str:
            with open(module_init_path, "w") as f:
                f.write(overwrite_init)
        module_spec = importlib.util.spec_from_file_location(module_name, module_init_path)
    module_dir = module_path

    module = importlib.util.module_from_spec(module_spec)
    sys.modules[module_name] = module
    module_spec.loader.exec_module(module)
    return module