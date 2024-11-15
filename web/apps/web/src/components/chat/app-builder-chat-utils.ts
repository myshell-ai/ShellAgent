import { EmbedObjStatus } from '@/services/app/message-type';
import { EntityInfo, Message, RunningErrorEnum } from 'myshell-bundled-chat';

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
      errorDetail:
        serverMessage.output.error_message +
        '\n' +
        serverMessage.output.error_message_detail,
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
  } else if (serverMessage.output?.error_message) {
    return convertErrorServerMessage(entity, serverMessage);
  } else {
    return commonServerMessageToMessage(entity, serverMessage);
  }
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
    type: d.type,
    createdDateUnix: d.createdDateUnix,
    updatedDateUnix: d.updatedDateUnix,
    text: d.text,
    embedObjs: d.embedObjs,
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
              actions: [
                {
                  action: 'MESSAGE_COMPONENTS_BUTTON_ACTION_TYPE_INTERACTION',
                  interactionInput: {
                    displayType:
                      'BOT_MESSAGE_COMPONENTS_BUTTON_ACTION_INTERACTION_INPUT_DISPLAY_TYPE_SLASH_COMMAND',
                    slashCommandInput: {
                      name: `/${component.button.content.text}`,
                      paramMap: {},
                    },
                  },
                },
              ],
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
