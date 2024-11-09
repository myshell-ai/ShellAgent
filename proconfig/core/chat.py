from enum import Enum
from typing import List, Optional, Dict, Union, Literal, Any
from pydantic import BaseModel
from proconfig.core.variables import Variable, Input, Value


ServerMessageStatus = Literal['PENDING', 'PROCESSING', 'DONE', 'ERROR', 'DELETED']
SharedMessageStatus = Literal['CANCELED']

UserSendMessageType = Literal['TEXT', 'VOICE', 'BUTTON_INTERACTION']

MessageType = Literal[
    'TEXT', 'VOICE', 'BUTTON_INTERACTION', 'REPLY', 'RESET', 'PROMPT_UPDATED', 'GREETING', 'MORE_BOT_TO_EXPLORER',
    'NEED_TO_REGISTER', 'VOICE_CALL_END', 'RECOMMEND_BOT', 'VOICE_CALL_TEXT', 'VOICE_CALL_VOICE', 'VOICE_CALL_REPLY',
    'LLM_MODERATION_REQUEST', 'WIDGET_PROMPT_UPDATED'
]


class EmbedObjType(str, Enum):
    UNKNOWN = 'MESSAGE_METADATA_TYPE_UNSPECIFIED'
    IMAGE = 'MESSAGE_METADATA_TYPE_IMAGE_FILE'
    DOC = 'MESSAGE_METADATA_TYPE_TEXT_FILE'
    AUDIO = 'MESSAGE_METADATA_TYPE_AUDIO_FILE'
    VIDEO = 'MESSAGE_METADATA_TYPE_VIDEO_FILE'
    TEXT_CONTENT = 'MESSAGE_METADATA_TYPE_TEXT_CONTENT'
    AUDIO_CONTENT = 'MESSAGE_METADATA_TYPE_USER_AUDIO'
    ALL = 'MESSAGE_METADATA_TYPE_ALL_FILE'


class EmbedObjStatus(str, Enum):
    UNKNOWN = 'EMBED_OBJ_STATUS_UNSPECIFIED'
    PENDING = 'EMBED_OBJ_STATUS_PENDING'
    PROCESSING = 'EMBED_OBJ_STATUS_PROCESSING'
    DONE = 'EMBED_OBJ_STATUS_DONE'
    ERROR = 'EMBED_OBJ_STATUS_ERROR'
    DELETED = 'EMBED_OBJ_STATUS_DELETED'
    QUEUEING = 'EMBED_OBJ_STATUS_QUEUEING'


class MediaFileMetadata(BaseModel):
    width: Optional[int]
    height: Optional[int]
    thumbnail: Optional[str]
    generateModel: Optional[str]


class UserSendEmbedObj(BaseModel):
    title: Optional[str] = ""
    type: EmbedObjType
    url: str
    mediaFileMetadata: Optional[MediaFileMetadata] = None


class EmbedObj(UserSendEmbedObj):
    id: Optional[str]
    status: EmbedObjStatus
    extensionName: str
    iconUrl: Optional[str] = None


class MessageComponentsTypeEnum(str, Enum):
    ROW = 'BOT_MESSAGE_COMPONENTS_TYPE_ROW'
    BUTTON = 'BOT_MESSAGE_COMPONENTS_TYPE_BUTTON'
    CONTAINER = 'BOT_MESSAGE_COMPONENTS_TYPE_CONTAINER'


class MessageComponentsButtonContentDirectionEnum(str, Enum):
    LEFT = 'BOT_MESSAGE_COMPONENTS_BUTTON_CONTENT_DIRECTION_LEFT'
    RIGHT = 'BOT_MESSAGE_COMPONENTS_BUTTON_CONTENT_DIRECTION_RIGHT'


class MessageComponentsButtonContent(BaseModel):
    text: str
    iconUrl: Optional[str] = None
    iconLabel: Optional[str] = None
    direction: Optional[MessageComponentsButtonContentDirectionEnum] = None
    description: Optional[str] = None


class MessageComponentsButtonStyle(BaseModel):
    fontColorHex: str
    backgroundColorHex: str
    borderColorHex: str
    darkModeBackgroundColorHex: str
    darkModeFontColorHex: str
    darkModeBorderColorHex: str
    iconLineColorHex: str
    darkModeIconLineColorHex: str


class ImComponentsInputTypeEnum(str, Enum):
    BOT_IM_COMPONENT_INPUT_TYPE_UNSPECIFIED = 'BOT_IM_COMPONENT_INPUT_TYPE_UNSPECIFIED'
    BOT_IM_COMPONENT_INPUT_TYPE_FILE_UPLOAD = 'BOT_IM_COMPONENT_INPUT_TYPE_FILE_UPLOAD'
    BOT_IM_COMPONENT_INPUT_TYPE_VIDEO_UPLOAD = 'BOT_IM_COMPONENT_INPUT_TYPE_VIDEO_UPLOAD'
    BOT_IM_COMPONENT_INPUT_TYPE_IMAGE_UPLOAD = 'BOT_IM_COMPONENT_INPUT_TYPE_IMAGE_UPLOAD'
    BOT_IM_COMPONENT_INPUT_TYPE_TEXT_UPLOAD = 'BOT_IM_COMPONENT_INPUT_TYPE_TEXT_UPLOAD'
    BOT_IM_COMPONENT_INPUT_TYPE_TEXT_INPUT = 'BOT_IM_COMPONENT_INPUT_TYPE_TEXT_INPUT'
    BOT_IM_COMPONENT_INPUT_TYPE_TEXT_SELECTOR = 'BOT_IM_COMPONENT_INPUT_TYPE_TEXT_SELECTOR'
    BOT_IM_COMPONENT_INPUT_TYPE_NUMBER_INPUT = 'BOT_IM_COMPONENT_INPUT_TYPE_NUMBER_INPUT'
    BOT_IM_COMPONENT_INPUT_TYPE_INTEGER_INPUT = 'BOT_IM_COMPONENT_INPUT_TYPE_INTEGER_INPUT'
    BOT_IM_COMPONENT_INPUT_TYPE_CHECKBOX = 'BOT_IM_COMPONENT_INPUT_TYPE_CHECKBOX'
    BOT_IM_COMPONENT_INPUT_TYPE_NUMBER_SELECTOR = 'BOT_IM_COMPONENT_INPUT_TYPE_NUMBER_SELECTOR'
    BOT_IM_COMPONENT_INPUT_TYPE_CODE_EDITOR = 'BOT_IM_COMPONENT_INPUT_TYPE_NUMBER_SELECTOR'


class SupportedEmbedTypesEnum(str, Enum):
    MESSAGE_METADATA_TYPE_UNSPECIFIED = 'MESSAGE_METADATA_TYPE_UNSPECIFIED'
    MESSAGE_METADATA_TYPE_IMAGE_FILE = 'MESSAGE_METADATA_TYPE_IMAGE_FILE'
    MESSAGE_METADATA_TYPE_TEXT_FILE = 'MESSAGE_METADATA_TYPE_TEXT_FILE'
    MESSAGE_METADATA_TYPE_ALL_FILE = 'MESSAGE_METADATA_TYPE_ALL_FILE'
    MESSAGE_METADATA_TYPE_AUDIO_FILE = 'MESSAGE_METADATA_TYPE_AUDIO_FILE'
    MESSAGE_METADATA_TYPE_VIDEO_FILE = 'MESSAGE_METADATA_TYPE_VIDEO_FILE'
    MESSAGE_METADATA_TYPE_TEXT_CONTENT = 'MESSAGE_METADATA_TYPE_TEXT_CONTENT'
    MESSAGE_METADATA_TYPE_USER_AUDIO = 'MESSAGE_METADATA_TYPE_USER_AUDIO'
    MESSAGE_METADATA_TYPE_COMPONENT_INPUT = 'MESSAGE_METADATA_TYPE_COMPONENT_INPUT'
    MESSAGE_METADATA_TYPE_ASYNC_JOB_INFO = 'MESSAGE_METADATA_TYPE_ASYNC_JOB_INFO'


class MessageComponentsButtonActionInteractionInputDisplayTypeEnum(str, Enum):
    TEXT = 'BOT_MESSAGE_COMPONENTS_BUTTON_ACTION_INTERACTION_INPUT_DISPLAY_TYPE_TEXT'
    SLASH_COMMAND = 'BOT_MESSAGE_COMPONENTS_BUTTON_ACTION_INTERACTION_INPUT_DISPLAY_TYPE_SLASH_COMMAND'
    NOTHING = 'BOT_MESSAGE_COMPONENTS_BUTTON_ACTION_INTERACTION_INPUT_DISPLAY_TYPE_NOTHING'


class ImSlashCommandInput(BaseModel):
    name: str
    paramMap: Dict[str, str]


class MessageComponentsButtonActionInteraction(BaseModel):
    displayType: MessageComponentsButtonActionInteractionInputDisplayTypeEnum
    slashCommandInput: Optional[ImSlashCommandInput]
    content: Optional[str]


class MessageComponentsButtonActionTypeEnum(str, Enum):
    JUMP_LINK = 'MESSAGE_COMPONENTS_BUTTON_ACTION_TYPE_JUMP_LINK'
    POP_UP_FORM = 'MESSAGE_COMPONENTS_BUTTON_ACTION_TYPE_POP_UP_FORM'
    INTERACTION = 'MESSAGE_COMPONENTS_BUTTON_ACTION_TYPE_INTERACTION'


class MessageComponentsButtonAction(BaseModel):
    action: MessageComponentsButtonActionTypeEnum = MessageComponentsButtonActionTypeEnum.POP_UP_FORM
    actionLink: Optional[str] = None
    formSchema: Optional[dict]  # Assuming JsonSchema7 can be represented as a dict
    interactionInput: Optional[MessageComponentsButtonActionInteraction] = None


class MessageComponentsButton(BaseModel):
    content: MessageComponentsButtonContent
    style: MessageComponentsButtonStyle = None
    buttonId: str
    actions: List[MessageComponentsButtonAction]
    disabled: bool = False
    doubleCheck: Dict[str, Union[bool, str]] = None
    payload: Dict[str, Any] = {} # TODO


class MessageComponentsContainer(BaseModel):
    type: MessageComponentsTypeEnum
    components: Optional[List[Any]] = []
    button: Optional[MessageComponentsButton] = None


class MessageInputSetting(BaseModel):
    canInputText: bool = False
    canInputAudio: bool = False
    canUploadFile: bool = False


class ServerMessage(BaseModel):
    session_id: str
    id: str
    status: Union[ServerMessageStatus, SharedMessageStatus]
    type: MessageType
    
    createdDateUnix: str
    updatedDateUnix: str
    text: str = ""
    
    embedObjs: Optional[List[EmbedObj]] = []
    replyId: Optional[str] = "" # TODO: where to put the text?
    componentContainer: Optional[MessageComponentsContainer] = None
    inputSetting: Optional[MessageInputSetting] = None

class EventItem(BaseModel):
    target_state: str
    target_inputs: Dict[str, Union[Input, Value]] = {}
    target_inputs_transition: Dict = {}
    
    
class SessionState(BaseModel):
    message_count: int = 0
    event_mapping: Dict[str, EventItem] = {}
    environ: Dict = {}
    current_state: str = None
    state_outputs: Dict = {}
    context: Dict[str, Union[Variable, Value]] = None
    