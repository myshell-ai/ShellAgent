from pydantic import BaseModel, constr, Field
from typing import Any, Literal, Union, List, Dict, Optional, Generic, TypeVar

T = TypeVar('T')

URLString = str

# Expression = constr(regex=r'\{\{.*\}\}')
Expression = str
BoolExpression = NumExpression = Expression

VariableDefinition = Any

class VariableBase(BaseModel):
    type: str
    name: str = None
    value: Any = None
    
    
class TextVar(VariableBase):
    type: Literal["text", "string"]
    value: str = None
   
class NumVar(VariableBase):
    type: Literal["number", "integer"]
    value: Union[int, float, NumExpression] = None
    
class BoolVar(VariableBase):
    type: Literal["boolean"]
    value: Union[bool, BoolExpression] = None
    
class FileVar(VariableBase):
    type: Literal["image", "audio", "video", "text_file", "file"]
    value: URLString = None
   
class ArrayVar(VariableBase):
    type: Literal["array"]
    items: VariableDefinition = None
    value: Union[List[Any], Expression] = None
    
class ObjectVar(VariableBase):
    type: Literal["object"]
    properties: Dict[str, VariableDefinition] = None
    value: Union[Dict[str, Any], Expression] = None
    
class UnknownVar(VariableBase):
    type: Literal["unknown"]
    value: Union[Dict[str, Any], Expression] = None
    
Variable = Union[TextVar, NumVar, BoolVar, FileVar, ArrayVar, ObjectVar, UnknownVar]
Value = Union[str, int, float, bool, URLString, List[Any], Dict[str, Any]] | None


# input variables

class Validation(BaseModel):
    required: Optional[bool] = Field(default=True, description="defaults to true")
    max_length: Optional[int] = Field(None, description="string maximum char limitation")
    max_file_size: Optional[int] = Field(None, description="max size for uploading a file in bytes")
    max_number: Optional[float] = Field(None, description="max number for number and integer")
    min_number: Optional[float] = Field(None, description="min number for number and integer")
    max_items: Optional[int] = Field(None, description="max number for array's items")
    min_items: Optional[int] = Field(None, description="min number for array's items")
    error_message: Optional[str] = Field(None, description="error message")
    

class ChoicesBase(Generic[T]):
    choices: Union[List[Union[T, Expression]], Expression] = None
    
class InputVariableBase(VariableBase, Generic[T]):
    validations: List[Validation] = []
    description: str = None
    default_value: Union[T, Expression] = None
    value: Union[T, Expression] = None
    user_input: bool = False
    source: Literal["IM", "form"] = None
    
class InputTextVar(TextVar, InputVariableBase[str], ChoicesBase[str]):
    type: Literal["text", "string"]

    
class InputNumVar(NumVar, InputVariableBase[Union[float, int]], ChoicesBase[Union[float, int]]):
    type: Literal["number", "integer"]

    
class InputBoolVar(BoolVar, InputVariableBase[bool], ChoicesBase[bool]):
    type: Literal["boolean"]
    
class InputFileVar(FileVar, InputVariableBase[URLString], ChoicesBase[URLString]):
    type: Literal["image", "audio", "video", "text_file", "file"]
    
class InputArrayVar(ArrayVar, InputVariableBase[List[Any]], ChoicesBase[List[Any]]):
    type: Literal["array"]
    
class InputObjectVar(ObjectVar, InputVariableBase[Dict[str, Any]], ChoicesBase[Dict[str, Any]]):
    type: Literal["object"]
    
    
Input = Union[InputTextVar, InputNumVar, InputBoolVar, InputFileVar, InputArrayVar, InputObjectVar]


if __name__ == "__main__":
    pass