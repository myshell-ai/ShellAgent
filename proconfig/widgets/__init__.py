import os
import json
from proconfig.utils.widget_manager import CURRENT_PACKAGE_NAME_KEY
os.environ[CURRENT_PACKAGE_NAME_KEY] = "myshell"
from proconfig.widgets.utils import load_module
from proconfig.widgets.base import build_widgets

import proconfig.widgets.imagen_widgets
import proconfig.widgets.language_models
import proconfig.widgets.tools
# load custom widgets

import os

def load_custom_widgets():
    widget_status = json.load(open("custom_widgets/widgets_status.json"))
    for custom_widget in os.listdir("custom_widgets"):
        if not os.path.isdir(os.path.join("custom_widgets", custom_widget)):
            continue
        if custom_widget in widget_status:
            current_commit = widget_status[custom_widget]["current_commit"]
            os.environ[CURRENT_PACKAGE_NAME_KEY] = custom_widget
            load_module(os.path.join(custom_widget, current_commit), "custom_widgets", module_name=custom_widget)
            
load_custom_widgets()