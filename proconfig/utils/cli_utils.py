import logging
from prompt_toolkit import prompt as prompt_toolkit_prompt
from prompt_toolkit.styles import Style
from typing import Union, Optional, List, Dict, Literal, Any
from pydantic import BaseModel, Field
import numpy as np

BaseType = Union[str, int, float, bool, list, dict]
DefaultValues = {
    "str": "",
    "int": 0,
    "float": 0.0,
    "bool": False,
    "list": [],
    "dict": {},
    'image': None,
    'audio': None
}

package_ctx = {
    'np': np
}

class ValueType(BaseModel):
    type: Literal["str", "int", "float", "bool", "list", "dict"] = Field(
        ..., description="The type of the value.")
    value: Optional[BaseType] = Field(
        None, description="The value or expression.")


class CustomFormatter(logging.Formatter):

    grey = "\x1b[38;20m"
    yellow = "\x1b[33;20m"
    red = "\x1b[31;20m"
    bold_red = "\x1b[31;1m"
    reset = "\x1b[0m"
    # format = "%(asctime)s - %(name)s - %(levelname)s - %(message)s (%(filename)s:%(lineno)d)"
    format = "%(message)s"

    FORMATS = {
        logging.DEBUG: grey + format + reset,
        logging.INFO: yellow + format + reset,
        logging.WARNING: grey + format + reset,
        logging.ERROR: red + format + reset,
        logging.CRITICAL: bold_red + format + reset
    }

    def format(self, record):
        log_fmt = self.FORMATS.get(record.levelno)
        formatter = logging.Formatter(log_fmt)
        return formatter.format(record)


def get_logger(name: str):
    """
    Get the logger.
    """
    logger = logging.getLogger(name)
    logger.setLevel(logging.DEBUG)
    handler = logging.StreamHandler()
    handler.setLevel(logging.DEBUG)
    handler.setFormatter(CustomFormatter())
    logger.addHandler(handler)
    return logger


def prompt(message: str, completer=None):
    """
    Wrapper around prompt_toolkit.prompt to use the same color as logging.INFO ("\x1b[33;20m") and the input with the same color as logging.WARNING ("\x1b[38;20m").
    """
    style = Style.from_dict({
        "prompt": "fg:ansiyellow",
    })
    return prompt_toolkit_prompt(message, completer=completer, style=style)