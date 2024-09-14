import * as react from 'react';
import react__default, { ReactNode, ReactElement } from 'react';
import * as react_jsx_runtime from 'react/jsx-runtime';

declare enum MessageComponentsTypeEnum {
    ROW = "BOT_MESSAGE_COMPONENTS_TYPE_ROW",
    BUTTON = "BOT_MESSAGE_COMPONENTS_TYPE_BUTTON",
    CONTAINER = "BOT_MESSAGE_COMPONENTS_TYPE_CONTAINER"
}
declare enum MessageComponentsButtonContentDirectionEnum {
    LEFT = "BOT_MESSAGE_COMPONENTS_BUTTON_CONTENT_DIRECTION_LEFT",
    RIGHT = "BOT_MESSAGE_COMPONENTS_BUTTON_CONTENT_DIRECTION_RIGHT"
}
declare enum MessageComponentsButtonActionTypeEnum {
    JUMP_LINK = "MESSAGE_COMPONENTS_BUTTON_ACTION_TYPE_JUMP_LINK",
    POP_UP_FORM = "MESSAGE_COMPONENTS_BUTTON_ACTION_TYPE_POP_UP_FORM",
    INTERACTION = "MESSAGE_COMPONENTS_BUTTON_ACTION_TYPE_INTERACTION"
}
declare enum MessageComponentsButtonActionInteractionInputDisplayTypeEnum {
    TEXT = "BOT_MESSAGE_COMPONENTS_BUTTON_ACTION_INTERACTION_INPUT_DISPLAY_TYPE_TEXT",
    SLASH_COMMAND = "BOT_MESSAGE_COMPONENTS_BUTTON_ACTION_INTERACTION_INPUT_DISPLAY_TYPE_SLASH_COMMAND",
    NOTHING = "BOT_MESSAGE_COMPONENTS_BUTTON_ACTION_INTERACTION_INPUT_DISPLAY_TYPE_NOTHING"
}

declare enum supportedEmbedTypesEnum {
    MESSAGE_METADATA_TYPE_UNSPECIFIED = "MESSAGE_METADATA_TYPE_UNSPECIFIED",
    MESSAGE_METADATA_TYPE_IMAGE_FILE = "MESSAGE_METADATA_TYPE_IMAGE_FILE",
    MESSAGE_METADATA_TYPE_TEXT_FILE = "MESSAGE_METADATA_TYPE_TEXT_FILE",
    MESSAGE_METADATA_TYPE_ALL_FILE = "MESSAGE_METADATA_TYPE_ALL_FILE",
    MESSAGE_METADATA_TYPE_AUDIO_FILE = "MESSAGE_METADATA_TYPE_AUDIO_FILE",
    MESSAGE_METADATA_TYPE_VIDEO_FILE = "MESSAGE_METADATA_TYPE_VIDEO_FILE",
    MESSAGE_METADATA_TYPE_TEXT_CONTENT = "MESSAGE_METADATA_TYPE_TEXT_CONTENT",
    MESSAGE_METADATA_TYPE_USER_AUDIO = "MESSAGE_METADATA_TYPE_USER_AUDIO",
    MESSAGE_METADATA_TYPE_COMPONENT_INPUT = "MESSAGE_METADATA_TYPE_COMPONENT_INPUT",
    MESSAGE_METADATA_TYPE_ASYNC_JOB_INFO = "MESSAGE_METADATA_TYPE_ASYNC_JOB_INFO"
}
declare enum ImComponentsInputTypeEnum {
    BOT_IM_COMPONENT_INPUT_TYPE_UNSPECIFIED = "BOT_IM_COMPONENT_INPUT_TYPE_UNSPECIFIED",
    BOT_IM_COMPONENT_INPUT_TYPE_FILE_UPLOAD = "BOT_IM_COMPONENT_INPUT_TYPE_FILE_UPLOAD",
    BOT_IM_COMPONENT_INPUT_TYPE_VIDEO_UPLOAD = "BOT_IM_COMPONENT_INPUT_TYPE_VIDEO_UPLOAD",
    BOT_IM_COMPONENT_INPUT_TYPE_IMAGE_UPLOAD = "BOT_IM_COMPONENT_INPUT_TYPE_IMAGE_UPLOAD",
    BOT_IM_COMPONENT_INPUT_TYPE_TEXT_UPLOAD = "BOT_IM_COMPONENT_INPUT_TYPE_TEXT_UPLOAD",
    BOT_IM_COMPONENT_INPUT_TYPE_TEXT_INPUT = "BOT_IM_COMPONENT_INPUT_TYPE_TEXT_INPUT",
    BOT_IM_COMPONENT_INPUT_TYPE_TEXT_SELECTOR = "BOT_IM_COMPONENT_INPUT_TYPE_TEXT_SELECTOR",
    BOT_IM_COMPONENT_INPUT_TYPE_NUMBER_INPUT = "BOT_IM_COMPONENT_INPUT_TYPE_NUMBER_INPUT",
    BOT_IM_COMPONENT_INPUT_TYPE_INTEGER_INPUT = "BOT_IM_COMPONENT_INPUT_TYPE_INTEGER_INPUT",
    BOT_IM_COMPONENT_INPUT_TYPE_CHECKBOX = "BOT_IM_COMPONENT_INPUT_TYPE_CHECKBOX",
    BOT_IM_COMPONENT_INPUT_TYPE_NUMBER_SELECTOR = "BOT_IM_COMPONENT_INPUT_TYPE_NUMBER_SELECTOR",
    BOT_IM_COMPONENT_INPUT_TYPE_CODE_EDITOR = "BOT_IM_COMPONENT_INPUT_TYPE_NUMBER_SELECTOR"
}

interface ImComponentInput {
    type: ImComponentsInputTypeEnum;
    name: string;
    description: string;
    stringDefault: string;
    numberDefault: number;
    hasNumberLimitation: boolean;
    numberMax: number;
    numberMin: number;
    integerDefault: number;
    hasIntegerLimitation: boolean;
    integerMax: number;
    integerMin: number;
    booleanDefault: boolean;
    textSelectorDefault: string;
    textSelectorAllOf: {
        label?: string;
        value: string;
        iconUrl: string;
    };
    numberSelectorDefault: number;
    numberSelectorAllOf: {
        label?: number;
        value: number;
        iconUrl: string;
    };
    fieldName: string;
    isRequired: boolean;
    supportedFileTypes: supportedEmbedTypesEnum;
    fileDefaultParam: string;
    fileDefaultParamType: supportedEmbedTypesEnum;
    fileUploadSizeMaximum: number;
}
interface ImComponent {
    name: string;
    description: string;
    githubUrl: string;
    componentsInput: ImComponentInput[];
    componentsFunction: Array<{
        functionName: string;
    }>;
    energyConsumePerUse: number;
    saveButtonContent: string;
}

interface ReferenceSource {
    title: string;
    link: string;
    snippet: string;
    displayLint: string;
}
interface RecommandationQuestion {
    question: string[];
}
interface MessageComponentsContainer {
    type: MessageComponentsTypeEnum;
    components: MessageComponentsContainer[];
    button?: MessageComponentsButton;
}
interface MessageComponentsButtonStyle {
    fontColorHex: string;
    backgroundColorHex: string;
    borderColorHex: string;
    darkModeBackgroundColorHex: string;
    darkModeFontColorHex: string;
    darkModeBorderColorHex: string;
    iconLineColorHex: string;
    darkModeIconLineColorHex: string;
}
interface MessageComponentsButtonContent {
    text: string;
    iconUrl?: string;
    iconLabel?: string;
    direction?: MessageComponentsButtonContentDirectionEnum;
    description?: string;
}
interface MessageComponentsButtonActionInteraction {
    displayType: MessageComponentsButtonActionInteractionInputDisplayTypeEnum;
    slashCommandInput: ImSlashCommandInput;
    content: string;
}
interface MessageComponentsButtonAction {
    action: MessageComponentsButtonActionTypeEnum;
    actionLink?: string;
    componentInput?: ImComponent;
    interactionInput?: MessageComponentsButtonActionInteraction;
}
interface MessageComponentsButton {
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
interface ImSlashCommandInput {
    name: string;
    paramMap: Record<string, string>;
}
declare enum ImageStatus {
    DONE = "DONE",
    PROCESSING = "PROCESSING",
    ERROR = "ERROR"
}
interface Image {
    img: string[];
}
interface ImageDetail {
    imgBatch: Image[];
    metadata?: {
        width?: string | number;
        height?: string | number;
        [key: string]: any;
    };
    genStatus: ImageStatus;
    jobId?: string;
    [key: string]: any;
}

declare enum EmbedObjStatus {
    UNKNOWN = "EMBED_OBJ_STATUS_UNSPECIFIED",
    PENDING = "EMBED_OBJ_STATUS_PENDING",
    PROCESSING = "EMBED_OBJ_STATUS_PROCESSING",
    DONE = "EMBED_OBJ_STATUS_DONE",
    ERROR = "EMBED_OBJ_STATUS_ERROR",
    DELETED = "EMBED_OBJ_STATUS_DELETED",
    QUEUEING = "EMBED_OBJ_STATUS_QUEUEING"
}
declare enum EmbedObjType {
    UNKNOWN = "MESSAGE_METADATA_TYPE_UNSPECIFIED",
    IMAGE = "MESSAGE_METADATA_TYPE_IMAGE_FILE",
    DOC = "MESSAGE_METADATA_TYPE_TEXT_FILE",
    AUDIO = "MESSAGE_METADATA_TYPE_AUDIO_FILE",
    VIDEO = "MESSAGE_METADATA_TYPE_VIDEO_FILE",
    TEXT_CONTENT = "MESSAGE_METADATA_TYPE_TEXT_CONTENT",
    AUDIO_CONTENT = "MESSAGE_METADATA_TYPE_USER_AUDIO",
    ALL = "MESSAGE_METADATA_TYPE_ALL_FILE"
}
declare enum FeedbackState {
    NORMAL = "Normal",
    LIKED = "Liked",
    DISLIKE = "Dislike"
}
declare enum ChatSettingSpeakingLangEnum {
    UNSPECIFIED = "BOT_CHAT_SETTING_SPEAKING_LANGUAGE_UNSPECIFIED",
    AUTO = "BOT_CHAT_SETTING_SPEAKING_LANGUAGE_AUTO",
    EN = "BOT_CHAT_SETTING_SPEAKING_LANGUAGE_EN",
    ZH = "BOT_CHAT_SETTING_SPEAKING_LANGUAGE_ZH",
    JA = "BOT_CHAT_SETTING_SPEAKING_LANGUAGE_JA",
    RU = "BOT_CHAT_SETTING_SPEAKING_LANGUAGE_RU",
    ES = "BOT_CHAT_SETTING_SPEAKING_LANGUAGE_ES",
    KO = "BOT_CHAT_SETTING_SPEAKING_LANGUAGE_KO"
}
declare enum ChatSettingAudioSpeed {
    ZERO_POINT_FIVE = "BOT_CHAT_SETTING_AUDIO_SPEED_ZERO_POINT_FIVE",
    ZERO_POINT_SEVEN_FIVE = "BOT_CHAT_SETTING_AUDIO_SPEED_ZERO_POINT_SEVEN_FIVE",
    ONE = "BOT_CHAT_SETTING_AUDIO_SPEED_ONE",
    ONE_POINT_TWENTY_FIVE = "BOT_CHAT_SETTING_AUDIO_SPEED_ONE_POINT_TWENTY_FIVE",
    ONE_POINT_FIVE = "BOT_CHAT_SETTING_AUDIO_SPEED_ONE_POINT_FIVE"
}
declare enum MenuFunctionEnum {
    REMOVE_FROM_LIST = 0,
    CLEAR_MEMORY = 1
}
type ServerMessageStatus = 'PENDING' | 'PROCESSING' | 'DONE' | 'ERROR' | 'DELETED';
type SharedMessageStatus = 'CANCELED';
type LocalMessageStatus = 'LOCAL_ERROR' | 'CANCELING';
type DraftMessageStatus = 'DRAFT';
type MessageStatus = DraftMessageStatus | LocalMessageStatus | SharedMessageStatus | ServerMessageStatus;
type UserSendMessageType = 'TEXT' | 'VOICE' | 'BUTTON_INTERACTION';
type MessageType = UserSendMessageType | 'REPLY' | 'RESET' | 'PROMPT_UPDATED' | 'GREETING' | 'MORE_BOT_TO_EXPLORER' | 'NEED_TO_REGISTER' | 'VOICE_CALL_END' | 'RECOMMEND_BOT' | 'VOICE_CALL_TEXT' | 'VOICE_CALL_VOICE' | 'VOICE_CALL_REPLY' | 'LLM_MODERATION_REQUEST' | 'WIDGET_PROMPT_UPDATED';
type LocalMessageType = 'PENDING_FOR_RESPONSE' | 'ROOM_CLOSED' | 'OTHER_SIDE_LEFT' | 'OTHER_SIDE_NO_ENOUGH_ENERGY';
type MessageDisplayType = 'NORMAL' | 'NOTIFICATION' | 'INFO' | 'ERROR';
type MessageSource = 'USER' | 'OTHER';
type MediaFileMetadata = {
    width?: number;
    height?: number;
    thumbnail?: string;
    generateModel?: string;
};
type MessageInputSetting = {
    canInputText: boolean;
    canInputAudio: boolean;
};
type AsyncJobInfo = {
    jobId: string;
    componentInput: string;
    status: EmbedObjStatus;
};
type MessageExtraInfo = {
    canEdit: boolean;
    canRegenerate: boolean;
    consumeEnergy: number;
};
type ChatSetting = {
    isAudioOn: boolean;
    isAudioPlayOn: boolean;
    isTranscriptionOn: boolean;
    isTranslationOn: boolean;
    speakingLanguage: ChatSettingSpeakingLangEnum;
    audioSpeed: ChatSettingAudioSpeed;
};
type MemberInfo = {
    id: string;
    isEntity: boolean;
    name: string;
    avatar?: string;
    nameTag: string;
    isVisitor: boolean;
};
interface UserSendEmbedObj {
    title: string;
    type: EmbedObjType;
    url: string;
    mediaFileMetadata?: MediaFileMetadata;
}
interface EmbedObj extends UserSendEmbedObj {
    id?: string;
    type: EmbedObjType;
    status: EmbedObjStatus;
    extensionName: string;
    iconUrl: string;
}
interface ServerMessage {
    id: string;
    userId: string;
    botId: string;
    status: ServerMessageStatus & SharedMessageStatus;
    type: MessageType;
    createdDateUnix: string;
    updatedDateUnix: string;
    referenceText?: string;
    text?: string;
    handled?: boolean;
    translation?: string;
    voiceUrl?: string;
    voiceFileDurationSeconds?: number;
    feedbackState?: FeedbackState;
    feedbackIssues?: string[];
    audioSpeed?: number;
    imageGenMessageResponse?: ImageDetail;
    embedObjs?: EmbedObj[];
    imSlashCommandInput?: ImSlashCommandInput;
    asyncJobInfo?: AsyncJobInfo;
    widgetId?: string;
    replyId?: string;
    referenceSource?: ReferenceSource[];
    recommendationQuestion?: RecommandationQuestion;
    componentContainer?: MessageComponentsContainer;
    inputSetting?: MessageInputSetting;
    regeneratedMessages?: Message[];
    extraInfo?: MessageExtraInfo;
}
interface BaseMessage {
    id: string;
    userId: string;
    entityId: string;
    createdDateUnix: string;
    updatedDateUnix: string;
    type: MessageType | LocalMessageType;
    referenceText?: string;
    text?: string;
    replyId?: string;
}
interface Message extends BaseMessage {
    audioUrl?: string;
    audioBuffer?: ArrayBuffer[];
    translation?: string;
    status: MessageStatus;
}
interface LocalMessage extends BaseMessage {
    audioBlobDataURI?: string;
    type: Extract<MessageType, 'TEXT' | 'VOICE' | 'BUTTON_INTERACTION'>;
}
interface DraftMessage extends LocalMessage {
    status: DraftMessageStatus;
}
interface LocalErrorMessage extends LocalMessage {
    status: Extract<LocalMessageStatus, 'LOCAL_ERROR'>;
}
interface DisplayMessage extends Message {
    avatar?: string;
    name?: string;
    replyTo?: MemberInfo;
    source: MessageSource;
    msgDisplayType: MessageDisplayType;
    contextMenuItems: MenuActionType[];
    buttons?: ReactNode;
}
declare enum MenuActionType {
    Like = "Like",
    Dislike = "Dislike",
    Copy_Message = "Copy Message",
    Stop_Generating = "Stop Generating",
    Regenerate = "Regenerate",
    Edit = "Edit",
    Translate = "Translate",
    Download_Voice = "Download Voice",
    Share = "Share",
    Delete = "Delete",
    Remove_Dislike = "Remove Dislike",
    Regenerate_Voice = "Regenerate Voice",
    Feedback = "Feedback",
    Save_Image = "Save Image",
    Copy_Image = "Copy Image",
    Copy_Image_Link = "Copy Image Link"
}

type ChatModuleType = 'bot' | 'widget' | 'ugc' | 'web3' | 'room';

type ListActionMode = 'initialize' | 'append' | 'remove' | 'silent_update';

type GetListFn<T> = (type?: ListActionMode) => Promise<T[]>;
type EntityInfo = {
    id: string;
    name: string;
    logoUrl?: string;
    energyPerChat?: number;
    pinned?: boolean;
};
type EntityActions = {
    getList: GetListFn<unknown>;
};
type StaticContextProps = {
    type: ChatModuleType;
    entityInfo: EntityInfo;
    readonly?: boolean;
    interactionDisabled?: boolean;
    imTextDisabled?: boolean;
    imAudioDisabled?: boolean;
    disabledReason?: string;
    visitorInteroperable?: boolean;
    showInteractionCostEnergy?: boolean;
    chatSettingDisabled: boolean;
    chatSetting?: ChatSetting;
    menuDisabled?: boolean;
    menuFunctions: Array<{
        menuFunction: MenuFunctionEnum;
        disabled?: boolean;
    }>;
    customMenuFunction?: ReactElement[];
} & EntityActions;
declare const StaticContext: react.Context<StaticContextProps>;

type LocalDraftMsg = {
    text?: string;
    audioBlobDataURI?: string;
    files?: UserSendEmbedObj[];
};

type MessageContextProps = {
    messageMap: Map<string, DisplayMessage>;
    sendTextMessage: (text: string) => void;
    sendAudioMessage: (audioBlob: Blob, mimeType?: string) => Promise<void>;
    messageIdList: string[];
    autoPlayIdQueue: string[];
    lastUserInteractionId?: string;
    sending: boolean;
    interacting: boolean;
    scrollToBottom: number;
    draftMessage?: LocalDraftMsg;
    setDraftMessage: (localDraftMsg: LocalDraftMsg) => void;
    hasMore: boolean;
    gettingHistory: boolean;
    getHistoryMessage: () => Promise<ServerMessage[]>;
    clearMessageList: () => void;
};
declare const MessageContext: react.Context<MessageContextProps>;

interface IRunningErrorProps {
    errorMessage: string;
}
declare const RunningError: ({ errorMessage }: IRunningErrorProps) => react_jsx_runtime.JSX.Element;

type P = {
    bgUrl?: string;
    editorAnchorRef: react__default.RefObject<HTMLDivElement>;
    editorContainerRef: react__default.RefObject<HTMLDivElement>;
    textareaRef: react__default.RefObject<HTMLTextAreaElement>;
    topActionsSlot?: ReactNode;
    customMenuIconSlot?: ReactNode;
    scrollLayoutToTop?: () => void;
    showMobileDetail?: () => void;
};
declare function ChatModule({ bgUrl, editorAnchorRef, editorContainerRef, textareaRef, topActionsSlot, customMenuIconSlot, scrollLayoutToTop, showMobileDetail }: P): react_jsx_runtime.JSX.Element;

declare function MessageToDisplayParser(message: Message, userId: string, memberInfoMap: Map<string, MemberInfo>, showReplyTo?: boolean, visitorNameParser?: (name: string) => string): DisplayMessage;

declare function useMessageParams(type: ChatModuleType, id: string, entityId?: string, showMockReply?: boolean): {
    messageIdList: string[];
    messageMap: Map<string, Message>;
    autoPlayIdQueue: string[];
    lastMessageInfo: Message | undefined;
    lastUserInteractionMsgId: string;
    draftMessage: LocalDraftMsg | undefined;
    sending: boolean;
    interacting: boolean;
    scrollToBottom: number;
    setDraftMessage: (localDraftMsg?: LocalDraftMsg) => void;
    sendTextMessage: (text: string) => void;
    sendAudioMessage: (audio: string) => void;
    sendButtonInteractionMessage: () => void;
    replaceDraftMessage: (message: Message | LocalErrorMessage) => void;
    addMessage: (messages: (Message | DraftMessage | LocalErrorMessage) | Array<Message | DraftMessage | LocalErrorMessage>) => void;
    clearMessageList: () => void;
};

export { ChatModule, type DisplayMessage, type DraftMessage, type EntityInfo, type IRunningErrorProps, type LocalErrorMessage, MenuFunctionEnum, type Message, type MessageComponentsContainer, MessageContext, type MessageContextProps, MessageToDisplayParser, RunningError, StaticContext, type StaticContextProps, useMessageParams };
