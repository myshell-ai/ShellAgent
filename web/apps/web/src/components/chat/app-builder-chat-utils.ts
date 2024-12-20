import { mapValues } from 'lodash-es';
import {
  ButtonFnParams,
  EntityInfo,
  Message,
  RunningErrorEnum,
} from 'myshell-bundled-chat';

import { EmbedObjStatus } from '@/services/app/message-type';

export const testUserId = 'test-app-builder';

function commonServerMessageToMessage(
  entity: EntityInfo,
  serverMessage: any,
): Message {
  return {
    id: serverMessage.id,
    userId: testUserId,
    entityId: entity.id,
    type: 'REPLY',
    status: serverMessage.status,
    createdDateUnix: serverMessage.createdDateUnix,
    updatedDateUnix: serverMessage.updatedDateUnix,
    text: serverMessage.text,
    embedObjs: patchEmbedObjs(serverMessage.embedObjs),
    inputSetting: serverMessage.inputSetting,
  };
}

function convertErrorServerMessage(
  entity: EntityInfo,
  serverMessage: any,
): Message {
  return {
    id: serverMessage.task_id,
    userId: testUserId,
    entityId: entity.id,
    type: 'REPLY',
    status: serverMessage.node_status,
    createdDateUnix: serverMessage.create_time,
    updatedDateUnix: serverMessage.finish_time,
    text: serverMessage.text,
    asyncJobInfo: {
      jobId: '',
      componentInput: '',
      status: 'EMBED_OBJ_STATUS_UNSPECIFIED' as EmbedObjStatus,
    },
    runningError: {
      errorType: 'RUNNING_ERROR_TYPE_ENGINE_ERROR' as RunningErrorEnum,
      errorDetail: `${serverMessage.output.error_message}\n${serverMessage.output.error_message_detail}`,
    },
  };
}

export function serverMessageToMessage(
  entity: EntityInfo,
  serverMessage: any,
): Message {
  if (
    (serverMessage.componentContainer?.components || []).length > 0 &&
    serverMessage.componentContainer?.components[0].type !==
      'BOT_MESSAGE_COMPONENTS_TYPE_ROW'
  ) {
    return convertDtoC(serverMessage);
  }
  if (serverMessage.output?.error_message) {
    return convertErrorServerMessage(entity, serverMessage);
  }
  return commonServerMessageToMessage(entity, serverMessage);
}

function slashCommandAction(text: string) {
  return [
    {
      action: 'MESSAGE_COMPONENTS_BUTTON_ACTION_TYPE_INTERACTION',
      interactionInput: {
        displayType:
          'BOT_MESSAGE_COMPONENTS_BUTTON_ACTION_INTERACTION_INPUT_DISPLAY_TYPE_SLASH_COMMAND',
        slashCommandInput: {
          name: `/${text}`,
          paramMap: {},
        },
      },
    },
  ];
}

const typeMap: Record<string, string> = {
  audio: 'BOT_IM_COMPONENT_INPUT_TYPE_FILE_UPLOAD', // TODO
  image: 'BOT_IM_COMPONENT_INPUT_TYPE_IMAGE_UPLOAD',
  video: 'BOT_IM_COMPONENT_INPUT_TYPE_VIDEO_UPLOAD',
  text_file: 'BOT_IM_COMPONENT_INPUT_TYPE_TEXT_UPLOAD',
  file: 'BOT_IM_COMPONENT_INPUT_TYPE_FILE_UPLOAD',
  string: 'BOT_IM_COMPONENT_INPUT_TYPE_TEXT_INPUT',
};

export function popupFormAction(actions: any[]) {
  return actions.map(action => {
    return {
      action: 'MESSAGE_COMPONENTS_BUTTON_ACTION_TYPE_POP_UP_FORM',
      componentInput: {
        name: 'Information',
        description: 'Enter to run',
        githubUrl: '',
        saveButtonContent: 'Run',
        energyConsumePerUse: 0,
        componentsFunction: [],
        componentsInput: Object.keys(action.formSchema.properties).map(k => {
          const prop = action.formSchema.properties[k];
          let type =
            typeMap[prop.type] || 'BOT_IM_COMPONENT_INPUT_TYPE_UNSPECIFIED';
          let ret = {
            type,
            name: action.formSchema.properties[k].name,
            description: action.formSchema.properties[k].description,
            stringDefault: action.formSchema.properties[k].default,
            numberDefault: 0,
            hasNumberLimitation: false,
            integerDefault: 0,
            hasIntegerLimitation: false,
            booleanDefault: false,
            textSelectorDefault: '',
            textSelectorAllOf: [],
            numberSelectorDefault: 0,
            numberSelectorAllOf: [],
            fieldName: k,
            isRequired: action.formSchema.required.indexOf(k) > -1,
            supportedFileTypes: [],
            fileDefaultParam: '',
            fileDefaultParamType: 'MESSAGE_METADATA_TYPE_UNSPECIFIED',
            fileUploadSizeMaximum: 0,
            stringCharLengthLimitation: 0,
          };
          if (prop.type === 'string' && Array.isArray(prop.enum)) {
            type = 'BOT_IM_COMPONENT_INPUT_TYPE_TEXT_SELECTOR';
            ret = Object.assign(ret, {
              type,
              textSelectorDefault: action.formSchema.properties[k].default,
              textSelectorAllOf: action.formSchema.properties[k].enum.map(
                (e: string) => ({
                  value: e,
                  iconUrl: '',
                  label: e,
                }),
              ),
            });
          }
          return ret;
        }),
      },
    };
  });
}

export function patchImageUrl(url?: string) {
  if (url?.startsWith('http') == false && url?.indexOf('api/files/') === -1) {
    return `/api/files/${url}`;
  }
  return url;
}

export function removeImageUrlPrefix(url?: string) {
  if (url?.startsWith('http') === false && url?.indexOf('/api/files/') > -1) {
    return url.replace('/api/files/', '');
  }
  return url;
}

export function patchEmbedObjs(embedObjs: any[]) {
  return embedObjs.map(embedObj => {
    embedObj.url = patchImageUrl(embedObj.url);
    return embedObj;
  });
}

/*
patch
1. BOT_MESSAGE_COMPONENTS_TYPE_ROW
2. style
3. action
*/
function convertDtoC(d: any): any {
  return {
    session_id: d.session_id,
    id: d.id,
    status: d.status,
    type: 'REPLY',
    createdDateUnix: d.createdDateUnix,
    updatedDateUnix: d.updatedDateUnix,
    text: d.text,
    embedObjs: patchEmbedObjs(d.embedObjs),
    replyId: d.replyId,
    componentContainer: {
      type: d.componentContainer.type,
      button: d.componentContainer.button,
      components: [
        {
          type: 'BOT_MESSAGE_COMPONENTS_TYPE_ROW',
          components: d.componentContainer.components.map((component: any) => ({
            type: component.type,
            components: component.components,
            button: {
              content: component.button.content,
              style: {
                fontColorHex: '#202223',
                backgroundColorHex: '#F6F6F7',
                borderColorHex: '#E4E9F0',
                darkModeFontColorHex: '#B8BCCF',
                darkModeBackgroundColorHex: '#323339',
                darkModeBorderColorHex: '#42434A',
                iconLineColorHex: '#00000033',
                darkModeIconLineColorHex: '#FFFFFF33',
              },
              buttonId: component.button.buttonId,
              actions:
                component.button.actions?.length === 0
                  ? slashCommandAction(component.button.content.text)
                  : popupFormAction(component.button.actions),
              disabled: component.button.disabled,
              doubleCheck: {
                isNeedDoubleCheck: false,
                title: '',
                description: '',
              },
              payload: component.button.payload,
            },
          })),
        },
      ],
    },
    inputSetting: d.inputSetting,
  };
}

export function patchMessageActionPopupForm(
  buttonInteractionParams: ButtonFnParams,
  session_id: string,
) {
  return {
    session_id,
    buttonId: buttonInteractionParams.buttonId,
    messageType: 15,
    text: '',
    message: '',
    form_data: mapValues(
      JSON.parse(buttonInteractionParams.componentInputMessage || '{}'),
      v => {
        if (typeof v === 'string') {
          return removeImageUrlPrefix(v);
        }
        return v;
      },
    ),
  };
}
