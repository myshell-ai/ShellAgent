from pydantic import BaseModel, field_validator, ConfigDict, Field
from pydantic.fields import FieldInfo
from proconfig.widgets.base import BaseWidget, CATEGORIES
from proconfig.utils.misc import hash_dict
from typing import List, Union, Any
import enum
from proconfig.widgets.imagen_widgets.utils.misc import save_images
from proconfig.widgets.imagen_widgets.utils.custom_types import CONDITION, LATENT, MODEL

@CATEGORIES.register_module(name="Myshell Widget")
class MyshellWidgetCategory(enum.Enum):
    TOOLS = "Tools"