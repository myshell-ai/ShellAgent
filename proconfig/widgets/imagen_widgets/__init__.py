import sys
import importlib
import os
import asyncio

absolute_path = os.path.abspath(os.path.join("proconfig", "widgets", "imagen_widgets", "library", "ComfyUI"))
sys.path.append(absolute_path)

from proconfig.widgets.utils import load_module

from server import PromptServer
loop = asyncio.new_event_loop()
asyncio.set_event_loop(loop)
prompt_server = PromptServer(loop)
sys.modules["custom_nodes"] = load_module("", "proconfig/widgets/imagen_widgets/library/comfy_custom_nodes")


import os
def load_imagen_widgets(modules):
    ignored = ['__pycache__', 'utils', 'library']
    for module_name in modules:
        if os.path.isfile(os.path.join(cwd, module_name)):
            continue
        if module_name in ignored:
            continue
        init_file = os.path.join(cwd, module_name, "__init__.py")
        f = open(init_file, "w")
        for other_file in os.listdir(os.path.join(cwd, module_name)):
            if other_file.endswith(".py") and other_file != "__init__.py":
                other_file = other_file[:-3]
                f.write(f"from .{other_file} import *\n")
        f.close()
        module = importlib.import_module(f".{module_name}", package=__package__)

cwd = os.path.dirname(__file__)
modules = ['comfy_nodes']
load_imagen_widgets(modules)

