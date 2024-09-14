import { NodeStatus } from '@shellagent/flow-engine';
import { JsonSchema7 } from 'node_modules/@shellagent/form-engine/src/types/jsonSchema7';

export type ServerMessageStatus =
  | 'PENDING'
  | 'PROCESSING'
  | 'DONE'
  | 'ERROR'
  | 'DELETED'; // 其中 DELETED 目前不会返回给前端

export type SharedMessageStatus = 'CANCELED';

type UserSendMessageType = 'TEXT' | 'VOICE' | 'BUTTON_INTERACTION';

export type MessageType =
  | UserSendMessageType
  | 'REPLY'
  | 'RESET'
  | 'PROMPT_UPDATED'
  | 'GREETING'
  | 'MORE_BOT_TO_EXPLORER'
  | 'NEED_TO_REGISTER'
  | 'VOICE_CALL_END'
  | 'RECOMMEND_BOT'
  | 'VOICE_CALL_TEXT'
  | 'VOICE_CALL_VOICE'
  | 'VOICE_CALL_REPLY'
  | 'LLM_MODERATION_REQUEST'
  | 'WIDGET_PROMPT_UPDATED';

export enum EmbedObjType {
  UNKNOWN = 'MESSAGE_METADATA_TYPE_UNSPECIFIED',
  IMAGE = 'MESSAGE_METADATA_TYPE_IMAGE_FILE',
  DOC = 'MESSAGE_METADATA_TYPE_TEXT_FILE',
  AUDIO = 'MESSAGE_METADATA_TYPE_AUDIO_FILE',
  VIDEO = 'MESSAGE_METADATA_TYPE_VIDEO_FILE',
  TEXT_CONTENT = 'MESSAGE_METADATA_TYPE_TEXT_CONTENT',
  AUDIO_CONTENT = 'MESSAGE_METADATA_TYPE_USER_AUDIO',
  ALL = 'MESSAGE_METADATA_TYPE_ALL_FILE',
}

export enum EmbedObjStatus {
  UNKNOWN = 'EMBED_OBJ_STATUS_UNSPECIFIED',
  PENDING = 'EMBED_OBJ_STATUS_PENDING',
  PROCESSING = 'EMBED_OBJ_STATUS_PROCESSING',
  DONE = 'EMBED_OBJ_STATUS_DONE',
  ERROR = 'EMBED_OBJ_STATUS_ERROR',
  DELETED = 'EMBED_OBJ_STATUS_DELETED',
  QUEUEING = 'EMBED_OBJ_STATUS_QUEUEING',
}

export type MediaFileMetadata = {
  width?: number;
  height?: number;
  thumbnail?: string;
  generateModel?: string;
};

// 用户侧上传但还没发送的消息列表
export interface UserSendEmbedObj {
  title: string;
  type: EmbedObjType;
  url: string;
  mediaFileMetadata?: MediaFileMetadata;
}

export interface EmbedObj extends UserSendEmbedObj {
  id?: string;
  type: EmbedObjType;
  status: EmbedObjStatus;
  extensionName: string;
  iconUrl: string;
}

export enum MessageComponentsTypeEnum {
  // ROW类型可以理解为是一个容器, 包含一行的组件
  ROW = 'BOT_MESSAGE_COMPONENTS_TYPE_ROW',
  // Button类型是一个按钮, 用于承载用户的点击事件
  BUTTON = 'BOT_MESSAGE_COMPONENTS_TYPE_BUTTON',
  CONTAINER = 'BOT_MESSAGE_COMPONENTS_TYPE_CONTAINER',
}

export enum MessageComponentsButtonContentDirectionEnum {
  LEFT = 'BOT_MESSAGE_COMPONENTS_BUTTON_CONTENT_DIRECTION_LEFT',
  RIGHT = 'BOT_MESSAGE_COMPONENTS_BUTTON_CONTENT_DIRECTION_RIGHT',
}

export interface MessageComponentsButtonContent {
  text: string;
  iconUrl?: string;
  iconLabel?: string;
  direction?: MessageComponentsButtonContentDirectionEnum;
  description?: string;
}

export interface MessageComponentsButtonStyle {
  // 字体颜色
  fontColorHex: string;
  // 背景颜色
  backgroundColorHex: string;
  // 边框颜色
  borderColorHex: string;
  darkModeBackgroundColorHex: string;
  darkModeFontColorHex: string;
  darkModeBorderColorHex: string;
  iconLineColorHex: string;
  darkModeIconLineColorHex: string;
}

export enum ImComponentsInputTypeEnum {
  BOT_IM_COMPONENT_INPUT_TYPE_UNSPECIFIED = 'BOT_IM_COMPONENT_INPUT_TYPE_UNSPECIFIED',
  BOT_IM_COMPONENT_INPUT_TYPE_FILE_UPLOAD = 'BOT_IM_COMPONENT_INPUT_TYPE_FILE_UPLOAD',
  BOT_IM_COMPONENT_INPUT_TYPE_VIDEO_UPLOAD = 'BOT_IM_COMPONENT_INPUT_TYPE_VIDEO_UPLOAD',
  BOT_IM_COMPONENT_INPUT_TYPE_IMAGE_UPLOAD = 'BOT_IM_COMPONENT_INPUT_TYPE_IMAGE_UPLOAD',
  BOT_IM_COMPONENT_INPUT_TYPE_TEXT_UPLOAD = 'BOT_IM_COMPONENT_INPUT_TYPE_TEXT_UPLOAD',
  BOT_IM_COMPONENT_INPUT_TYPE_TEXT_INPUT = 'BOT_IM_COMPONENT_INPUT_TYPE_TEXT_INPUT',
  BOT_IM_COMPONENT_INPUT_TYPE_TEXT_SELECTOR = 'BOT_IM_COMPONENT_INPUT_TYPE_TEXT_SELECTOR',
  BOT_IM_COMPONENT_INPUT_TYPE_NUMBER_INPUT = 'BOT_IM_COMPONENT_INPUT_TYPE_NUMBER_INPUT',
  BOT_IM_COMPONENT_INPUT_TYPE_INTEGER_INPUT = 'BOT_IM_COMPONENT_INPUT_TYPE_INTEGER_INPUT',
  BOT_IM_COMPONENT_INPUT_TYPE_CHECKBOX = 'BOT_IM_COMPONENT_INPUT_TYPE_CHECKBOX',
  BOT_IM_COMPONENT_INPUT_TYPE_NUMBER_SELECTOR = 'BOT_IM_COMPONENT_INPUT_TYPE_NUMBER_SELECTOR',
  BOT_IM_COMPONENT_INPUT_TYPE_CODE_EDITOR = 'BOT_IM_COMPONENT_INPUT_TYPE_NUMBER_SELECTOR',
}

export enum SupportedEmbedTypesEnum {
  MESSAGE_METADATA_TYPE_UNSPECIFIED = 'MESSAGE_METADATA_TYPE_UNSPECIFIED',
  MESSAGE_METADATA_TYPE_IMAGE_FILE = 'MESSAGE_METADATA_TYPE_IMAGE_FILE',
  MESSAGE_METADATA_TYPE_TEXT_FILE = 'MESSAGE_METADATA_TYPE_TEXT_FILE',
  MESSAGE_METADATA_TYPE_ALL_FILE = 'MESSAGE_METADATA_TYPE_ALL_FILE',
  MESSAGE_METADATA_TYPE_AUDIO_FILE = 'MESSAGE_METADATA_TYPE_AUDIO_FILE',
  MESSAGE_METADATA_TYPE_VIDEO_FILE = 'MESSAGE_METADATA_TYPE_VIDEO_FILE',
  MESSAGE_METADATA_TYPE_TEXT_CONTENT = 'MESSAGE_METADATA_TYPE_TEXT_CONTENT',
  MESSAGE_METADATA_TYPE_USER_AUDIO = 'MESSAGE_METADATA_TYPE_USER_AUDIO',
  MESSAGE_METADATA_TYPE_COMPONENT_INPUT = 'MESSAGE_METADATA_TYPE_COMPONENT_INPUT',
  MESSAGE_METADATA_TYPE_ASYNC_JOB_INFO = 'MESSAGE_METADATA_TYPE_ASYNC_JOB_INFO',
}

export enum MessageComponentsButtonActionInteractionInputDisplayTypeEnum {
  TEXT = 'BOT_MESSAGE_COMPONENTS_BUTTON_ACTION_INTERACTION_INPUT_DISPLAY_TYPE_TEXT',
  SLASH_COMMAND = 'BOT_MESSAGE_COMPONENTS_BUTTON_ACTION_INTERACTION_INPUT_DISPLAY_TYPE_SLASH_COMMAND',
  NOTHING = 'BOT_MESSAGE_COMPONENTS_BUTTON_ACTION_INTERACTION_INPUT_DISPLAY_TYPE_NOTHING',
}

export interface ImSlashCommandInput {
  name: string;
  paramMap: Record<string, string>;
}

// 交互式组件的输入
// 表示用户点击了这个按钮之后, 会返回什么内容
// 前端需要用这个值先做渲染, 然后后端会在SSE事件中返回对应内容以用于更新
export interface MessageComponentsButtonActionInteraction {
  displayType: MessageComponentsButtonActionInteractionInputDisplayTypeEnum;
  // COMPONENTS_BUTTON_ACTION_INTERACTION_INPUT_DISPLAY_TYPE_SLASH_COMMAND时有效
  slashCommandInput: ImSlashCommandInput;
  // COMPONENTS_BUTTON_ACTION_INTERACTION_INPUT_DISPLAY_TYPE_TEXT时有效
  content: string;
}

export interface MessageComponentsButtonAction {
  /**
   * 动作类型
   */
  action: MessageComponentsButtonActionTypeEnum;
  /**
   * 仅当action为COMPONENTS_BUTTON_ACTION_TYPE_JUMP_LINK时有效
   */
  actionLink?: string;
  /**
   * 仅当action为COMPONENTS_BUTTON_ACTION_TYPE_POP_UP_FORM时有效
   */
  formSchema?: JsonSchema7;
  /**
   * 仅当action为BOT_MESSAGE_COMPONENTS_BUTTON_ACTION_TYPE_INTERACTION时有效
   * 1. 是否显示用户发消息
   * 2. 点击之后用户会发什么消息
   */
  interactionInput?: MessageComponentsButtonActionInteraction;
}

export enum MessageComponentsButtonActionTypeEnum {
  // 链接跳转
  JUMP_LINK = 'MESSAGE_COMPONENTS_BUTTON_ACTION_TYPE_JUMP_LINK',
  // ** 弹出表格
  POP_UP_FORM = 'MESSAGE_COMPONENTS_BUTTON_ACTION_TYPE_POP_UP_FORM',
  // 交互式组件
  INTERACTION = 'MESSAGE_COMPONENTS_BUTTON_ACTION_TYPE_INTERACTION',
}

export interface MessageComponentsButton {
  content: MessageComponentsButtonContent;
  style: MessageComponentsButtonStyle;
  buttonId: string;
  actions: MessageComponentsButtonAction[];
  disabled: boolean;
  doubleCheck: {
    isNeedDoubleCheck: boolean;
    title: string;
    description: string;
  };
}

export interface MessageComponentsContainer {
  type: MessageComponentsTypeEnum;
  components: MessageComponentsContainer[];
  button?: MessageComponentsButton;
}

type MessageInputSetting = {
  canInputText: boolean;
  canInputAudio: boolean;
  canUploadFile: boolean;
};

/**
 * 目前包含 Chat 和 App Builder 部分
 */
export interface ServerMessage extends ChatServerMessage, NodeServerMessage {}

/**
 * 后端 chat 返回的消息体
 */
export interface ChatServerMessage {
  /**
   * ? 是否需要 session_id
   * 后端返回 session_id 前端后续消息发送会带上 session_id
   */
  session_id: string;

  id: string;
  /**
   * 对齐主站
   */
  status: ServerMessageStatus & SharedMessageStatus;
  /**
   * 对齐主站, 目前只有 REPLY
   */
  type: MessageType;
  createdDateUnix: string;
  updatedDateUnix: string;
  text?: string;
  /**
   * 文件列表信息
   */
  embedObjs?: EmbedObj[];
  replyId?: string;
  /**
   * 对齐 主站 LUI Buttons 协议
   */
  componentContainer?: MessageComponentsContainer;
  /**
   * 对齐主站
   */
  inputSetting?: MessageInputSetting;
}

/**
 * 后端推消息 App Builder 部分
 */
export interface NodeServerMessage {
  node_id: string;
  /**
   * start, succeeded, failed
   */
  node_status: NodeStatus;
}
