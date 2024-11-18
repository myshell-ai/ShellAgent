import * as react from 'react';
import react__default, { ReactElement, ReactNode, MutableRefObject } from 'react';
import * as react_dropzone from 'react-dropzone';
import { DropzoneRootProps, DropzoneInputProps } from 'react-dropzone';
import * as react_jsx_runtime from 'react/jsx-runtime';
import { VirtuosoMessageListMethods } from '@virtuoso.dev/message-list';

declare enum ContentTypeEnum {
    PNG = "CONTENT_TYPE_IMAGE_PNG",
    JPEG = "CONTENT_TYPE_IMAGE_JPEG",
    JPG = "CONTENT_TYPE_IMAGE_JPG",
    APNG = "CONTENT_TYPE_IMAGE_APNG",
    GIF = "CONTENT_TYPE_IMAGE_GIF",
    TIFF = "CONTENT_TYPE_IMAGE_TIFF",
    TIF = "CONTENT_TYPE_IMAGE_TIFF",
    BMP = "CONTENT_TYPE_IMAGE_BMP",
    MP3 = "CONTENT_TYPE_MP3",
    WAV = "CONTENT_TYPE_AUDIO_WAV",
    OGG = "CONTENT_TYPE_AUDIO_OGG",
    FLAC = "CONTENT_TYPE_AUDIO_FLAC",
    APE = "CONTENT_TYPE_AUDIO_APE",
    WMA = "CONTENT_TYPE_AUDIO_WMA",
    TXT = "CONTENT_TYPE_TEXT_TXT",
    DOC = "CONTENT_TYPE_TEXT_DOC",
    DOCX = "CONTENT_TYPE_TEXT_DOCX",
    PDF = "CONTENT_TYPE_TEXT_PDF",
    MARKDOWN = "CONTENT_TYPE_TEXT_MARKDOWN",
    MD = "CONTENT_TYPE_TEXT_MARKDOWN",
    RTF = "CONTENT_TYPE_TEXT_RTF",
    MP4 = "CONTENT_TYPE_VIDEO_MP4",
    AVI = "CONTENT_TYPE_VIDEO_AVI",
    MOV = "CONTENT_TYPE_VIDEO_MOV",
    WMV = "CONTENT_TYPE_VIDEO_WMV",
    FLV = "CONTENT_TYPE_VIDEO_FLV",
    ALL = "CONTENT_TYPE_ALL"
}

declare enum BotStatusEnum {
    BOT_STATUS_UNSPECIFIED = "BOT_STATUS_UNSPECIFIED",
    Public = "Public",
    Active = "Active",
    Inactive = "Inactive"
}

declare enum WidgetChatCallerTypeEnum {
    WIDGET_CHAT_CALLER_TYPE_UNSPECFIED = "WIDGET_CHAT_CALLER_TYPE_UNSPECFIED",
    WIDGET_CHAT_CALLER_TYPE_PROMPT = "WIDGET_CHAT_CALLER_TYPE_PROMPT",
    WIDGET_CHAT_CALLER_TYPE_VOICE = "WIDGET_CHAT_CALLER_TYPE_VOICE",
    WIDGET_CHAT_CALLER_TYPE_COMPONENT = "WIDGET_CHAT_CALLER_TYPE_COMPONENT"
}

declare enum UserSourceEnum {
    APKPURE_BANNER = "apkpure_banner",
    MYSHELL = "myshell",
    VISITOR = "visitor"
}
declare enum FollowStatus {
    FOLLOW_STATUS_UNSPECIFIED = "FOLLOW_STATUS_UNSPECIFIED",
    FOLLOWED = "FOLLOWED",
    NOT_FOLLOWED = "NOT_FOLLOWED",
    NOT_AVAILABLE = "NOT_AVAILABLE"
}
declare enum LoginType {
    LOGIN_TYPE_UNSPECIFIED = "LOGIN_TYPE_UNSPECIFIED",
    LOGIN_TYPE_EMAIL = "LOGIN_TYPE_EMAIL",
    LOGIN_TYPE_GOOGLE = "LOGIN_TYPE_GOOGLE",
    LOGIN_TYPE_APPLE = "LOGIN_TYPE_APPLE",
    LOGIN_TYPE_FACEBOOK = "LOGIN_TYPE_FACEBOOK",
    LOGIN_TYPE_PUBLIC_ADDRESS = "LOGIN_TYPE_PUBLIC_ADDRESS"
}

interface EnergyInfo {
    energy: number;
    dailyEnergy?: number;
    userId?: string;
}
interface User {
    avatar?: string;
    email?: string;
    id: string;
    isGenesisPasscard: boolean;
    isNftAvatar: boolean;
    isPasscard: boolean;
    level: number;
    name: string;
    nameTag: string;
    publicAddress: string;
    source?: UserSourceEnum;
    hasParticleAccount?: boolean;
    createdDate?: string;
    createdTime?: string;
    premiumInfo: PremiumInfo;
    privateBotLimit: number;
    publicBotLimit: number;
    canPublishNewBot?: boolean;
    hasFollowed: boolean;
    followedCount: string;
    fansCount: string;
    followStatus: FollowStatus;
    description: string;
    backgroundUrl: string;
    loginCredential: string;
    loginType: LoginType;
    connectInfo: {
        discord: {
            id: string;
            userId: string;
            connectUserId: string;
            userName: string;
            createdDateUnix: number;
        };
        twitter: {
            id: string;
            userId: string;
            connectUserId: string;
            userName: string;
            createdDateUnix: number;
        };
        telegram: {
            id: string;
            userId: string;
            tgId: string;
            firstName: string;
            lastName: string;
            username: string;
            photoUrl: string;
            connectUserId: string;
            currentBotId: string;
            createdDateUnix: number;
        };
    };
    publicKey: string;
}
interface PremiumInfo {
    level: number;
    totalExp: number;
    nextLevelNeedExp: number;
    currentLevelExp: number;
}

declare enum MessageStatusEnum {
    PENDING = "PENDING",
    PROCESSING = "PROCESSING",
    DONE = "DONE",
    ERROR = "ERROR",
    CANCELING = "CANCELING",
    CANCELED = "CANCELED"
}
declare enum MessageTypeEnum {
    TEXT = "TEXT",
    VOICE = "VOICE",
    REPLY = "REPLY",
    RESET = "RESET",
    PROMPT_UPDATED = "PROMPT_UPDATED",
    GREETING = "GREETING",
    MORE_BOT_TO_EXPLORE = "MORE_BOT_TO_EXPLORER",
    NEED_TO_REGISTER = "NEED_TO_REGISTER",
    VOICE_CALL_END = "VOICE_CALL_END",
    VOICE_CALL_TEXT = "VOICE_CALL_TEXT",
    VOICE_CALL_VOICE = "VOICE_CALL_VOICE",
    VOICE_CALL_REPLY = "VOICE_CALL_REPLY",
    LLM_MODERATION_REQUEST = "LLM_MODERATION_REQUEST",
    EMBED_OBJ_STATUS_QUEUEING = "EMBED_OBJ_STATUS_QUEUEING",
    BUTTON_INTERACTION = "BUTTON_INTERACTION",
    WIDGET_PROMPT_UPDATED = "WIDGET_PROMPT_UPDATED"
}

interface ReferenceSource$1 {
    title: string;
    link: string;
    snippet: string;
    displayLint: string;
}
interface RecommandationQuestion$1 {
    question: string[];
}
type WidgetRunningStatusType$1 = 'PROCESSING' | 'ERROR' | 'DONE';
interface IRunningWidgetInfo {
    widgetName: string;
    endTimeTimestamp: string;
    startTimeTimestamp: string;
    widgetLogo: string;
    status: WidgetRunningStatusType$1;
}
interface MessageDetail {
    id: string;
    localId?: string;
    replaceId?: string;
    deleteId?: string;
    userId: string;
    status: MessageStatusEnum;
    type: MessageTypeEnum;
    text: string;
    translation?: string;
    botId: string;
    botUid: string;
    replyUid?: string;
    voiceUrl?: string;
    duration?: number;
    createdDate: string | number;
    updatedDate?: string | number;
    handled?: boolean;
    isFromHistory?: boolean;
    feedbackState: number;
    feedbackIssues?: string[];
    voiceFileDurationSeconds: number;
    textStream?: TextStreamDetail[];
    audioStream?: AudioStreamDetail[];
    imageGenMessageResponse?: ImageDetail;
    translationStream?: TranslationStreamDetail[];
    audioSpeed: number;
    userSentMsg?: MessageDetail;
    embedObjs?: any[];
    asyncJobInfo?: any;
    modelStatus?: string;
    createdDateUnix: string;
    referenceSource?: ReferenceSource$1[];
    recommendationQuestion?: RecommandationQuestion$1;
    imSlashCommandInput: ImSlashCommandInput;
    componentContainer: MessageComponentsContainer;
    isLocalSend?: boolean;
    isLocalReply?: boolean;
    replaceLocalSend?: boolean;
    replaceLocalReply?: boolean;
    inputSetting?: IUploadSettings & {
        canInputText: boolean;
        canInputAudio: boolean;
        canUploadFile: boolean;
    };
    callAgentTx?: `0x${string}`;
    extraInfo?: {
        runningWidgetInfo?: IRunningWidgetInfo[];
    };
    runningError?: {
        requireEnergyToUse?: number;
        errorDetail: string;
        errorType: MessageRunningErrorType;
    };
    isLlmBot?: boolean;
    [key: string]: any | undefined;
}
declare enum MessageRunningErrorType {
    RUNNING_ERROR_TYPE_UNSPECIFIED = "RUNNING_ERROR_TYPE_UNSPECIFIED",
    RUNNING_ERROR_TYPE_ENGINE_ERROR = "RUNNING_ERROR_TYPE_ENGINE_ERROR",
    RUNNING_ERROR_TYPE_INNER_COMPONENT_ERROR = "RUNNING_ERROR_TYPE_INNER_COMPONENT_ERROR",
    RUNNING_ERROR_TYPE_ENERGY_INSUFFICIANT = "RUNNING_ERROR_TYPE_ENERGY_INSUFFICIANT",
    RUNNING_ERROR_TYPE_LLM_TOKEN_TOO_LONG = "RUNNING_ERROR_TYPE_LLM_TOKEN_TOO_LONG"
}
interface IUploadSettings {
    supportedEmbedTypes?: string[];
    embedNumberLimit?: number;
    embedNumberMinimum?: number;
    embedMaxFileBytesEach?: string;
}
interface StreamDetail {
    index: number;
    isFinal: boolean;
}
interface TextStreamDetail extends StreamDetail {
    replyMessage: MessageDetail;
    text: string;
    modelStatus?: string;
    embedObjs?: any;
    isJob?: boolean;
}
interface AudioStreamDetail extends StreamDetail {
    replyMessage: MessageDetail;
    audio: ArrayBuffer;
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
interface TranslationStreamDetail extends StreamDetail {
    message: MessageDetail;
    text: string;
}

type ListActionMode = 'initialize' | 'append' | 'remove' | 'silent_update';

type ChatModuleType = 'bot' | 'room' | 'widget' | 'ugc' | 'toolbox' | 'curve' | 'gallery';
type GetListFn<T> = (type?: ListActionMode) => Promise<T[]>;
type PartialDetail = {
    pinned?: boolean;
    hasUnlocked?: boolean;
};
type EntityInfo = {
    id: string;
    name?: string;
    logoUrl?: string;
    energyPerChat?: number;
    energyPerLevelByPass?: number[];
    maxTokens?: number;
    pinned?: boolean;
    status?: BotStatusEnum;
    hasUnlocked?: boolean;
    needShowUnlock?: boolean;
    chatCallerType?: WidgetChatCallerTypeEnum;
    sellPrice?: string;
};
type EntitySetting = {
    outputVoice?: boolean;
};
type EntityActions = {
    getList: GetListFn<unknown>;
    updateChatSetting?: (setting: ChatSetting) => void;
    partialUpdateDetail?: (partialDetail: PartialDetail) => void;
};
type StaticContextProps = {
    type: ChatModuleType;
    entityInfo: EntityInfo;
    entitySetting?: EntitySetting;
    readonly?: boolean;
    interactionDisabled?: boolean;
    disabledReason?: string;
    textDisabled?: boolean;
    audioDisabled?: boolean;
    uploadDisabled?: boolean;
    visitorInteroperable?: boolean;
    showInteractionCostEnergy?: boolean;
    showChatSetting?: boolean;
    chatSettingDisabled?: boolean;
    chatSettingLoading?: boolean;
    chatSetting?: ChatSetting;
    menuDisabled?: boolean;
    menuFunctions: Array<{
        menuFunction: MenuFunctionEnum;
        disabled?: boolean;
    }>;
    customMenuFunction?: ReactElement[];
    setEnergyInfo?: (energyInfo: EnergyInfo) => void;
    showPin?: boolean;
    atBottom: boolean;
    setAtBottom: (atBottom: boolean) => void;
    imgGenerator?: boolean;
    showReplyName?: boolean;
    forceToLogin?: boolean;
    terminatable?: boolean;
    messageShareAvailable?: boolean;
    feedbackAvailable?: boolean;
    editAvailable?: boolean;
    regenAvailable?: boolean;
    showMockReply?: boolean;
    globalContextMenuDisabled?: boolean;
} & EntityActions;
declare const StaticContext: react.Context<StaticContextProps>;

type LocalServerFileType = keyof typeof ServerFileTypes | 'TEXT';

declare enum ConversationScenario {
    CONVERSATION_SCENARIO_UNSPECIFIED = 0,
    CONVERSATION_SCENARIO_WEB_FOR_TESTS = 2,
    CONVERSATION_SCENARIO_IMMERSION_WEB_CHAT = 3,
    CONVERSATION_SCENARIO_WEB_CHAT_NORMAL = 4,
    CONVERSATION_SCENARIO_BOT_GENERATION = 9
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
    UNSPECIFIED = "BOT_CHAT_SETTING_AUDIO_SPEED_UNSPECIFIED",
    ZERO_POINT_FIVE = "BOT_CHAT_SETTING_AUDIO_SPEED_ZERO_POINT_FIVE",
    ZERO_POINT_SEVEN_FIVE = "BOT_CHAT_SETTING_AUDIO_SPEED_ZERO_POINT_SEVEN_FIVE",
    ONE = "BOT_CHAT_SETTING_AUDIO_SPEED_ONE",
    ONE_POINT_TWENTY_FIVE = "BOT_CHAT_SETTING_AUDIO_SPEED_ONE_POINT_TWENTY_FIVE",
    ONE_POINT_FIVE = "BOT_CHAT_SETTING_AUDIO_SPEED_ONE_POINT_FIVE"
}
declare enum MenuFunctionEnum {
    REMOVE_FROM_LIST = 0,
    SHARE = 1,
    CLEAR_MEMORY = 2,
    CLEAR_HISTORY = 3
}
declare enum RunningErrorEnum {
    UNSPECIFIED = "RUNNING_ERROR_TYPE_UNSPECIFIED",
    ENGINE_ERROR = "RUNNING_ERROR_TYPE_ENGINE_ERROR",
    INNER_COMPONENT_ERROR = "RUNNING_ERROR_TYPE_INNER_COMPONENT_ERROR",
    ENERGY_INSUFFICIANT = "RUNNING_ERROR_TYPE_ENERGY_INSUFFICIANT",
    LLM_TOKEN_TOO_LONG = "RUNNING_ERROR_TYPE_LLM_TOKEN_TOO_LONG"
}
declare enum ImageGenStatus {
    UNSPECIFIED = "MESSAGE_STATUS_UNSPECIFIED",
    PENDING = "PENDING",
    PROCESSING = "PROCESSING",
    DONE = "DONE",
    ERROR = "ERROR",
    DELETED = "DELETED",
    CANCELED = "CANCELED"
}
declare enum ImageGenType {
    UNSPECIFIED = "IMAGE_GEN_MESSAGE_TYPE_UNSPECIFIED",
    SIMPLE = "IMAGE_GEN_MESSAGE_TYPE_SIMPLE_MESSAGE",
    COMMAND = "IMAGE_GEN_MESSAGE_TYPE_COMMAND_MESSAGE",
    PANEL = "IMAGE_GEN_MESSAGE_TYPE_PANEL_MESSAGE",
    REGEN = "IMAGE_GEN_MESSAGE_TYPE_REGENERATE_MESSAGE",
    VARIATION = "IMAGE_GEN_MESSAGE_TYPE_VARIATION_MESSAGE",
    UPSCALE = "IMAGE_GEN_MESSAGE_TYPE_UPSCALE_MESSAGE",
    GIF = "IMAGE_GEN_MESSAGE_TYPE_SIMPLE_GIF"
}
declare enum ButtonActionTypeEnum {
    JUMP_LINK = "MESSAGE_COMPONENTS_BUTTON_ACTION_TYPE_JUMP_LINK",
    POP_UP_FORM = "MESSAGE_COMPONENTS_BUTTON_ACTION_TYPE_POP_UP_FORM",
    INTERACTION = "MESSAGE_COMPONENTS_BUTTON_ACTION_TYPE_INTERACTION",
    CLIPBOARD = "MESSAGE_COMPONENTS_BUTTON_ACTION_TYPE_CLIPBOARD"
}
declare enum ServerFileTypes {
    AUDIO = "MESSAGE_METADATA_TYPE_AUDIO_FILE",
    IMAGE = "MESSAGE_METADATA_TYPE_IMAGE_FILE",
    APPLICATION = "MESSAGE_METADATA_TYPE_TEXT_FILE",
    VIDEO = "MESSAGE_METADATA_TYPE_VIDEO_FILE",
    ALL = "MESSAGE_METADATA_TYPE_ALL_FILE"
}
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
    INTERACTION = "MESSAGE_COMPONENTS_BUTTON_ACTION_TYPE_INTERACTION",
    CLIPBOARD = "MESSAGE_COMPONENTS_BUTTON_ACTION_TYPE_CLIPBOARD"
}
declare enum MessageComponentsButtonActionInteractionInputDisplayTypeEnum {
    TEXT = "BOT_MESSAGE_COMPONENTS_BUTTON_ACTION_INTERACTION_INPUT_DISPLAY_TYPE_TEXT",
    SLASH_COMMAND = "BOT_MESSAGE_COMPONENTS_BUTTON_ACTION_INTERACTION_INPUT_DISPLAY_TYPE_SLASH_COMMAND",
    NOTHING = "BOT_MESSAGE_COMPONENTS_BUTTON_ACTION_INTERACTION_INPUT_DISPLAY_TYPE_NOTHING"
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
declare enum SupportedEmbedTypesEnum {
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
type ServerMessageStatus = 'PENDING' | 'PROCESSING' | 'DONE' | 'ERROR' | 'DELETED';
type SharedMessageStatus = 'CANCELED';
type LocalMessageStatus = 'LOCAL_ERROR' | 'NETWORK_ERROR' | 'CANCELING' | 'REGENERATING' | 'REGENERATE_ERROR';
type DraftMessageStatus = 'DRAFT';
type MessageStatus = DraftMessageStatus | LocalMessageStatus | SharedMessageStatus | ServerMessageStatus;
type UserSendMessageType = 'TEXT' | 'VOICE' | 'BUTTON_INTERACTION';
type MessageType = UserSendMessageType | 'REPLY' | 'RESET' | 'PROMPT_UPDATED' | 'GREETING' | 'MORE_BOT_TO_EXPLORER' | 'NEED_TO_REGISTER' | 'VOICE_CALL_END' | 'VOICE_CALL_TEXT' | 'VOICE_CALL_VOICE' | 'VOICE_CALL_REPLY' | 'LLM_MODERATION_REQUEST' | 'WIDGET_PROMPT_UPDATED';
type LocalMessageType = 'PENDING_FOR_RESPONSE' | 'ROOM_CLOSED' | 'OTHER_SIDE_LEFT' | 'OTHER_SIDE_NO_ENOUGH_ENERGY' | 'VISITOR_DISABLED' | 'CLAIM_PASSCARD' | 'USE_ENERGY_PACK';
type MessageDisplayType = 'NORMAL' | 'NOTIFICATION' | 'INFO';
type MessageSource = 'USER' | 'OTHER_USER' | 'OTHER';
type WidgetRunningStatusType = 'PROCESSING' | 'ERROR' | 'DONE';
type MediaFileMetadata = {
    width?: number;
    height?: number;
    thumbnail?: string;
    generateModel?: string;
};
type MessageInputSetting = {
    canInputText: boolean;
    canInputAudio: boolean;
    canUploadFile: boolean;
};
type SupportedFileInfo = {
    fileExtensions: string[];
    maxSingleBytes: number;
    maxTotalBytes: number;
    maxUploadNum: number;
    minUploadNum: number;
    type: ServerFileTypes;
};
type UploadSetting = {
    supportedFileInfos: SupportedFileInfo[];
};
type SdParams = {
    prompt: string;
    negativePrompt: string;
    model: string;
    imageWidth: number;
    imageHeight: number;
    samplingMethod: string;
    samplingSteps: number;
    cfgScale: number;
    seed: number;
    reflectModelId: string;
};
type GenParams = {
    batchNumber: number;
    imageNumber: number;
    batchCount: number;
    sdParam: SdParams;
};
interface ImageGenDetail {
    imgBatch: Array<{
        img: string[];
    }>;
    genStatus: ImageGenStatus;
    jobId: string;
    metadata?: {
        width?: number;
        height?: number;
        jobId: string;
        genType: ImageGenType;
    };
    genParams?: GenParams;
}
type AsyncJobInfo = {
    jobId: string;
    componentInput: string;
    status: EmbedObjStatus;
};
type RunningWidgetInfo = {
    widgetName: string;
    endTimeTimestamp: string;
    startTimeTimestamp: string;
    widgetLogo: string;
    status: WidgetRunningStatusType;
};
type MessageExtraInfo = {
    canEdit: boolean;
    canRegenerate: boolean;
    consumeEnergy: number;
    runningWidgetInfo?: RunningWidgetInfo[];
};
type ChatSetting = {
    isAutopushOn: boolean;
    isAudioOn: boolean;
    isAudioPlayOn: boolean;
    isTranscriptionOn: boolean;
    isTranslationOn: boolean;
    speakingLanguage: ChatSettingSpeakingLangEnum;
    audioSpeed: ChatSettingAudioSpeed;
};
type SlashCommandInput = {
    name: string;
    paramMap: Record<string, string>;
};
type MemberInfo = {
    id?: string;
    isEntity?: boolean;
    name?: string;
    avatar?: string;
    nameTag?: string;
    isVisitor?: boolean;
};
type TranslationStatus = 'TRANSLATING' | 'ERROR';
type RunningError$1 = {
    requireEnergyToUse?: number;
    errorDetail: string;
    errorType: RunningErrorEnum;
};
type PartialMessageDetail = Partial<Pick<Message, 'feedbackState' | 'feedbackIssues' | 'audioUrl' | 'audioSpeed' | 'duration' | 'status' | 'handled' | 'imageGenMessageResponse' | 'text'>>;
type MapKey = `${ChatModuleType}-${string}`;
type EditorMode = 'NORMAL' | 'SHARE' | 'PUBLISH';
type InputMode = 'TEXT' | 'AUDIO';
interface UIData {
    mimeType: LocalServerFileType;
    orginalMIMEType: string;
    contentType: ContentTypeEnum;
    name: string;
    ex: string;
    serverType: ServerFileTypes;
    icon: string;
    type: string;
    bg: string;
    iconUrl: string;
}
interface IMLocalFile {
    file: File;
    id: string;
    type: ServerFileTypes;
    url?: string;
    uiData: UIData;
    mediaFileMetadata?: MediaFileMetadata;
    status?: LocalFileStatus;
    progress?: number;
    cancelToken?: any;
}
interface EmbedObj {
    type: EmbedObjType;
    status?: EmbedObjStatus;
    title: string;
    extensionName?: string;
    url: string;
    iconUrl: string;
    mediaFileMetadata?: MediaFileMetadata;
}
interface RecommandationQuestion {
    question: string[];
}
interface ReferenceSource {
    title: string;
    link: string;
    snippet: string;
    displayLint: string;
}
interface MessageComponentsButtonContent {
    text: string;
    iconUrl?: string;
    iconLabel?: string;
    direction?: MessageComponentsButtonContentDirectionEnum;
    description?: string;
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
    supportedFileTypes: SupportedEmbedTypesEnum;
    fileDefaultParam: string;
    fileDefaultParamType: SupportedEmbedTypesEnum;
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
interface ImSlashCommandInput {
    name: string;
    paramMap: Record<string, string>;
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
    clipboardContent?: string;
    interactionInput?: MessageComponentsButtonActionInteraction;
}
interface MessageComponentsContainer {
    type: MessageComponentsTypeEnum;
    components: MessageComponentsContainer[];
    button?: MessageComponentsButton;
}
interface ServerMessage {
    id: string;
    userId: string;
    botId: string;
    status: ServerMessageStatus | SharedMessageStatus;
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
    imageGenMessageResponse?: ImageGenDetail;
    embedObjs?: EmbedObj[];
    imSlashCommandInput?: SlashCommandInput;
    asyncJobInfo?: AsyncJobInfo;
    widgetId?: string;
    replyId?: string;
    referenceSource?: ReferenceSource[];
    recommendationQuestion?: RecommandationQuestion;
    componentContainer?: MessageComponentsContainer;
    inputSetting?: MessageInputSetting;
    uploadSetting?: UploadSetting;
    regeneratedMessages?: ServerMessage[];
    extraInfo?: MessageExtraInfo;
    runningError?: RunningError$1;
    isLlmBot?: boolean;
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
    embedObjs?: EmbedObj[];
    slashCommandInput?: SlashCommandInput;
    isLlmBot?: boolean;
}
interface Message extends BaseMessage {
    audioSpeed?: number;
    audioUrl?: string;
    duration?: number;
    audioBuffer?: ArrayBuffer[];
    translation?: string;
    feedbackState?: FeedbackState;
    feedbackIssues?: string[];
    status: MessageStatus;
    asyncJobInfo?: AsyncJobInfo;
    runningWidgetInfo?: RunningWidgetInfo[];
    runningError?: RunningError$1;
    handled?: boolean;
    imageGenMessageResponse?: ImageGenDetail;
    inputSetting?: MessageInputSetting;
    uploadSetting?: UploadSetting;
    componentContainer?: MessageComponentsContainer;
    referenceSource?: ReferenceSource[];
    recommendatioQuestions?: RecommandationQuestion;
    regeneratedMessages?: Message[];
    requestParams?: any;
    customRender?: ReactNode;
    extraInfo?: MessageExtraInfo;
}
interface LocalMessage extends BaseMessage {
    audioUrl?: string;
    type: Extract<MessageType, 'TEXT' | 'VOICE' | 'BUTTON_INTERACTION'>;
    requestParams?: any;
}
interface DraftMessage extends LocalMessage {
    status: DraftMessageStatus;
}
interface LocalErrorMessage extends LocalMessage {
    status: Extract<LocalMessageStatus, 'LOCAL_ERROR' | 'NETWORK_ERROR'>;
}
interface DisplayMessage extends Message {
    avatar?: string;
    name?: string;
    replyTo?: MemberInfo;
    source: MessageSource;
    msgDisplayType: MessageDisplayType;
    buttons?: ReactNode;
    embedObjs?: EmbedObj[];
    regeneratedMessages?: DisplayMessage[];
}
type LocalFileStatus = 'PENDING' | 'UPLOADING' | 'SUCCESS' | 'ERROR';

interface IPublishItem {
    messageId: string;
    imageLink: string;
    botId: string;
    naturalHeight: number;
    naturalWidth: number;
}

type PublishItem = Omit<IPublishItem, 'botId'>;

type ButtonFnParams = {
    actionType: ButtonActionTypeEnum;
    buttonId: string;
    msgId: string;
    text?: string;
    componentInputMessage?: string;
    imSlashCommandInput?: SlashCommandInput;
};

type MessageContextProps = {
    exceptionsForTextDisplay?: Record<MapKey, string[]>;
    addTextDisplayException?: (msgId: string) => void;
    sendTextMessage: (text: string, files?: IMLocalFile[], secenario?: ConversationScenario) => void;
    sendAudioMessage: (audioBlob: Blob, mimeType?: string) => Promise<void>;
    sendButtonInteractionMessage?: (buttonInteractionParams: ButtonFnParams, successCb?: () => void) => Promise<void>;
    errorMessageRetry?: (message: DisplayMessage) => void;
    sendCustomRequest?: (reqParams: any, cb?: () => void) => void;
    regenerateMessage?: (regenMessage: Message, originMessage: Message) => void;
    showTerminate?: boolean;
    terminating?: boolean;
    terminate?: () => void;
    messageList: Message[];
    messageToDisplay: (message: Message) => DisplayMessage;
    lastUserInteractionMsgId?: string;
    sending: boolean;
    interacting: boolean;
    scrollToBottom: number;
    draftMessage?: string;
    setDraftMessage: (draftText: string) => void;
    hasMore: boolean;
    gettingHistory: boolean;
    initializingHistory: boolean;
    messageInited: boolean;
    getHistoryMessage: () => Promise<ServerMessage[]>;
    markAsRead?: () => Promise<void>;
    appendMessages: (messages: Message | Message[], needScrollToBottom?: boolean) => void;
    mixMessages: (messages: Message | Message[], needScrollToBottom?: boolean) => void;
    updateMessage?: (message: Message) => void;
    partialUpdateMessage?: (messageId: string, partialDetail: PartialMessageDetail) => void;
    partialUpdateRegenMessage?: (messageId: string, regenMessageId: string, partialDetail: PartialMessageDetail) => void;
    deleteSpecifiedMessageId?: (msgId?: string) => void;
    translationStatus?: TranslationStatus;
    translate?: (messageId: string) => void;
    playingAudio?: string;
    playNext?: () => void;
    enQueue?: (messageId: string) => void;
    clearQueue?: () => void;
    getJobInfo?: (jobId: string, messageId: string) => Promise<boolean>;
    clearMemory?: (successCb?: () => void) => Promise<void>;
    clearHistory?: (successCb?: () => void) => Promise<void>;
    dragMaskVisible: boolean;
    getClickRootProps?: <T extends DropzoneRootProps>(props?: T) => T;
    getDragRootProps?: <T extends DropzoneRootProps>(props?: T) => T;
    getInputProps?: <T extends DropzoneInputProps>(props?: T) => T;
    onPastedFiles?: (files: File[]) => void;
    editorMode?: EditorMode;
    setEditorMode?: (editorMode: EditorMode) => void;
    inputMode?: InputMode;
    setInputMode?: (inputMode: InputMode) => void;
    share?: {
        idSet: Set<string>;
        add: (id: string) => void;
        remove: (id: string) => void;
        clear: () => void;
        allChecked: boolean;
        checkAllHandler: () => void;
    };
    file?: {
        isChoosingFile?: MutableRefObject<boolean>;
        uploadedFiles: IMLocalFile[];
        uploadFiles: (files: IMLocalFile[], retry?: boolean) => void;
        deleteFile: (fileId?: string) => void;
        overrideUploadFileToS3WithProgress?: (file: File) => Promise<{
            success: boolean;
            objectAccessUrl?: string;
        }>;
    };
    questions?: string[];
    publish?: {
        selectedImg: Map<string, PublishItem>;
        reachedLimitation: boolean;
        everPublished: boolean;
        addImg: (path: string, publishItem: PublishItem) => void;
        removeImg: (path: string) => void;
        clearImg: () => void;
        batchPublishToGallery: (list: PublishItem[], successCb?: () => void) => void;
        publishSingleImgToGallery: (item: PublishItem, successCb?: () => void) => void;
        publishing: boolean;
    };
    scrolled?: boolean;
    setScrolled?: (val: boolean) => void;
};
declare const MessageContext: react.Context<MessageContextProps>;

interface IRunningErrorProps {
    chat: MessageDetail;
}
declare const RunningError: ({ chat }: IRunningErrorProps) => react_jsx_runtime.JSX.Element | null;

type P$1 = {
    bgUrl?: string;
    editorAnchorRef: react__default.RefObject<HTMLDivElement>;
    editorContainerRef: react__default.RefObject<HTMLDivElement>;
    textareaRef: react__default.RefObject<HTMLTextAreaElement>;
    virtuosoRef: react__default.RefObject<VirtuosoMessageListMethods<Message>>;
    topActionsSlot?: ReactNode;
    scrollLayoutToTop?: () => void;
    showMobileDetail?: () => void;
};
declare function ChatModule({ bgUrl, editorAnchorRef, editorContainerRef, textareaRef, virtuosoRef, topActionsSlot, scrollLayoutToTop, showMobileDetail }: P$1): react_jsx_runtime.JSX.Element;

declare function MessageToDisplayParser(message: Message, userId: string, memberInfoMap: Map<string, MemberInfo>, showReplyTo?: boolean, visitorNameParser?: (name?: string) => string): DisplayMessage;

type P = {
    type: ChatModuleType;
    id: string;
    entityId?: string;
    showMockReply?: boolean;
    initMessages?: Message[];
    virtuosoMessageApi: {
        onSendMessage: (message: Message, isButtonInteraction?: boolean) => void;
        onAppendMessages: (messages: Message | Message[], needScrollToBottom?: boolean) => void;
        onUpdateMessage: (messageId: string, newMessage: Message) => void;
        onPartialUpdateMessage: (messageId: string, partialDetail: PartialMessageDetail) => void;
        onPartialUpdateRegenMessage: (messageId: string, regenMessageId: string, partialDetail: PartialMessageDetail) => void;
        onTextStream: (messageId: string, content: string) => void;
        onAudioStream: (messageId: string, audioChunk: ArrayBuffer) => void;
        onTranslationStream: (messageId: string, translation: string) => void;
        onPrependMessages: (messages: Message[]) => void;
        onDeleteMessage: (messageId?: string) => void;
        onRemoveDraftReplyIfExist: (messageId: string) => void;
        onVirtuosoRegen: (originMessageId: string) => void;
        onMixMessages: (messages: Message | Message[], needScrollToBottom?: boolean) => void;
    };
};
declare function useMessageParams(params: P): {
    messageList: Message[];
    lastMessageInfo: Message | undefined;
    lastValidReplyMessage: Message | null;
    questions: string[] | undefined;
    lastUserInteractionMsgId: string;
    draftMessage: string;
    sending: boolean;
    interacting: boolean;
    scrollToBottom: number;
    exceptionsForTextDisplay: Record<`bot-${string}` | `widget-${string}` | `toolbox-${string}` | `gallery-${string}` | `room-${string}` | `ugc-${string}` | `curve-${string}`, string[]>;
    getLatestLastMessageInfo: () => Message | undefined;
    addTextDisplayException: (msgId: string) => void;
    setDraftMessage: (draftText?: string) => void;
    sendTextMessage: (text: string, files?: IMLocalFile[], requestParams?: any) => void;
    sendAudioMessage: (audio: string, requestParams?: any) => void;
    sendButtonInteractionMessage: (buttonInteractionParams: {
        text?: string;
        componentInputMessage?: string;
        imSlashCommandInput?: SlashCommandInput;
    }, requestParams?: any) => void;
    onRetry: (message: DisplayMessage) => void;
    onRegen: (messageId: string, originMessageId: string) => void;
    replaceDraftMessage: (message: Message | LocalErrorMessage) => void;
    prependMessages: (messages: Message[]) => void;
    appendMessages: (messages: Message | Message[], needScrollToBottom?: boolean) => void;
    updateMessage: (message: Message | LocalErrorMessage) => void;
    replaceMessage: (oldMessageId: string, newMessage: Message) => void;
    onMessageReply: (message: Message) => void;
    mixMessages: (messages: Message | Message[], needScrollToBottom?: boolean) => void;
    addTextStream: (messageId: string, content: string, isLlmBot: boolean) => void;
    addAudioStream: (messageId: string, audioChunk: ArrayBuffer) => void;
    addTranslationStream: (messageId: string, translation: string) => void;
    deleteSpecifiedMessageId: (msgId?: string) => void;
    partialUpdateMsg: (messageId: string, partialDetail: PartialMessageDetail) => void;
    partialUpdateRegenMsg: (messageId: string, regenMessageId: string, partialDetail: PartialMessageDetail) => void;
    onInteractionError: (error: Extract<LocalMessageStatus, "LOCAL_ERROR" | "NETWORK_ERROR">) => void;
    clearDraft: () => void;
    audioQueue: {
        playingAudio: string;
        queue: string[];
        enQueue: (id: string) => void;
        clearQueue: () => void;
        playNext: () => void;
    };
    file: {
        uploadedFiles: IMLocalFile[];
    };
    showTerminate: boolean;
    terminating: boolean;
};

declare function useChatLayout(): {
    scrollContainerRef: react.RefObject<HTMLDivElement>;
    editorContainerRef: react.RefObject<HTMLDivElement>;
    editorAnchorRef: react.RefObject<HTMLDivElement>;
    textareaRef: react.RefObject<HTMLTextAreaElement>;
    chatContainerRef: react.RefObject<HTMLDivElement>;
    detailContainerRef: react.RefObject<HTMLDivElement>;
    detailScrollRef: react.RefObject<HTMLDivElement>;
    scrollLayoutToTop: () => void;
    manuallyScrollDetailToTop: () => void;
    isEditorSticky: boolean;
    contentActive: boolean;
    setContentActive: (nextValue?: any) => void;
    detailScrollY: number;
    showMobileDetail: () => void;
};

declare function useVirtuosoMessageListApi(showMockReply?: boolean): {
    scrolled: boolean;
    setScrolled: (nextValue?: any) => void;
    virtuosoRef: react.RefObject<VirtuosoMessageListMethods<Message, any>>;
    onSendMessage: (message: Message, isButtonInteraction?: boolean) => void;
    onAppendMessages: (messages: Message | Message[], needScrollToBottom?: boolean) => void;
    onUpdateMessage: (messageId: string, newMessage: Message) => void;
    onPartialUpdateMessage: (messageId: string, partialDetail: PartialMessageDetail) => void;
    onPartialUpdateRegenMessage: (messageId: string, regenMessageId: string, partialDetail: PartialMessageDetail) => void;
    onTextStream: (messageId: string, content: string) => void;
    onAudioStream: (messageId: string, audioChunk: ArrayBuffer) => void;
    onTranslationStream: (messageId: string, translation: string) => void;
    onPrependMessages: (messages: Message[]) => void;
    onDeleteMessage: (messageId?: string) => void;
    onRemoveDraftReplyIfExist: (messageId: string) => void;
    onVirtuosoRegen: (originMessage: string) => void;
    onMixMessages: (msgs: Message | Message[], needScrollToBottom?: boolean) => void;
};

declare function useAtBottom(): {
    atBottom: boolean;
    setAtBottom: (nextValue?: any) => void;
};

declare function useEditorMode(): {
    inputMode: InputMode;
    setInputMode: react.Dispatch<react.SetStateAction<InputMode>>;
    editorMode: EditorMode;
    setEditorMode: react.Dispatch<react.SetStateAction<EditorMode>>;
};

type IProps = {
    type: ChatModuleType;
    id: string;
    name?: string;
    uploadedFiles?: IMLocalFile[];
    disabled?: boolean;
    panelSettings?: UploadSetting;
    messageSettings?: UploadSetting;
    dragDisabled?: boolean;
    scrollLayoutToTop?: () => void;
    textareaRef?: React.RefObject<HTMLTextAreaElement>;
    overrideUploadFileToS3WithProgress?: (file: File) => Promise<{
        success: boolean;
        objectAccessUrl?: string;
    }>;
};
declare function useUploadFiles({ panelSettings, uploadedFiles, messageSettings, type, id, name, disabled, dragDisabled, scrollLayoutToTop, textareaRef, overrideUploadFileToS3WithProgress, }: IProps): {
    dragMaskVisible: boolean;
    uploadedFiles: IMLocalFile[];
    noValidLimitations: boolean;
    handleUpload: (files: IMLocalFile[], retry?: boolean) => void;
    handleDelete: (fileId?: string) => void;
    getDragRootProps: <T extends react_dropzone.DropzoneRootProps>(props?: T) => T;
    getClickRootProps: <T extends react_dropzone.DropzoneRootProps>(props?: T) => T;
    getInputProps: <T extends react_dropzone.DropzoneInputProps>(props?: T) => T;
    handlePastedFiles: (files: File[]) => void;
    isChoosingFile: react.MutableRefObject<boolean>;
};

interface GlobalStoreProviderProps {
    isMobile: boolean;
    nonce?: string;
    children: ReactNode;
}
declare const GlobalStoreProvider: ({ children, nonce, isMobile }: GlobalStoreProviderProps) => react_jsx_runtime.JSX.Element;

interface UserStoreProviderProps {
    user?: User;
    token?: string;
    language?: string;
    isLogin: boolean;
    children: ReactNode;
}
declare const UserStoreProvider: ({ children, user, isLogin, language }: UserStoreProviderProps) => react_jsx_runtime.JSX.Element;

interface ChatStoreProviderProps {
    children: ReactNode;
    type?: ChatModuleType;
    id?: string;
    messages?: Message[];
}
declare const ChatStoreProvider: ({ children, type, id, messages }: ChatStoreProviderProps) => react_jsx_runtime.JSX.Element;

export { type ButtonFnParams, ChatModule, type ChatModuleType, ChatStoreProvider, type DisplayMessage, type DraftMessage, type EntityInfo, FollowStatus, GlobalStoreProvider, type IMLocalFile, type IRunningErrorProps, type LocalErrorMessage, LoginType, MenuFunctionEnum, type Message, type MessageComponentsContainer, MessageContext, type MessageContextProps, MessageToDisplayParser, RunningError, RunningErrorEnum, ServerFileTypes, type SlashCommandInput, StaticContext, type StaticContextProps, type User, UserSourceEnum, UserStoreProvider, useAtBottom, useChatLayout, useEditorMode, useMessageParams, useUploadFiles, useVirtuosoMessageListApi };
