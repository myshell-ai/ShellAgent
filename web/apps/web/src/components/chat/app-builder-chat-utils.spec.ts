import { convertDtoC, serverMessageToMessage } from './app-builder-chat-utils';

describe('app-builder-chat-utils', () => {
  it('do not patch', () => {
    const d = {
      session_id: '27bc406e-a31f-11ef-9b11-9ebb585eaf7d',
      id: '0',
      status: 'DONE',
      type: 'TEXT',
      createdDateUnix: '2024-11-15 14:59:28',
      updatedDateUnix: '2024-11-15 14:59:28',
      text: 'Hi there!',
      embedObjs: [],
      replyId: '',
      componentContainer: {
        type: 'BOT_MESSAGE_COMPONENTS_TYPE_CONTAINER',
        components: [],
        button: null,
      },
      inputSetting: {
        canInputText: false,
        canInputAudio: false,
        canUploadFile: false,
      },
    };

    const ret = serverMessageToMessage(
      {
        id: 'shellagent-app-builder-chat',
        name: 'ShellAgent App Builder Chat',
      },
      d,
    );

    expect(ret).toMatchInlineSnapshot(`
      {
        "createdDateUnix": "2024-11-15 14:59:28",
        "entityId": "shellagent-app-builder-chat",
        "id": "0",
        "status": "DONE",
        "text": "Hi there!",
        "type": "REPLY",
        "updatedDateUnix": "2024-11-15 14:59:28",
        "userId": "test-app-builder",
      }
    `);
  });

  it('patch convert shellagent server message to C site message', () => {
    const d = {
      session_id: 'f2350708-a31b-11ef-9b11-9ebb585eaf7d',
      id: '0',
      status: 'DONE',
      type: 'TEXT',
      createdDateUnix: '2024-11-15 14:36:30',
      updatedDateUnix: '2024-11-15 14:36:30',
      text: 'Hi there!',
      embedObjs: [],
      replyId: '',
      componentContainer: {
        type: 'BOT_MESSAGE_COMPONENTS_TYPE_CONTAINER',
        components: [
          {
            type: 'BOT_MESSAGE_COMPONENTS_TYPE_BUTTON',
            components: [],
            button: {
              content: {
                text: 'Go',
                iconUrl: null,
                iconLabel: null,
                direction: null,
                description: null,
              },
              style: null,
              buttonId: 'MESSAGE_0_BUTTON_0',
              actions: [],
              disabled: false,
              doubleCheck: null,
              payload: {},
            },
          },
        ],
        button: null,
      },
      inputSetting: {
        canInputText: false,
        canInputAudio: false,
        canUploadFile: false,
      },
    };
    const c = {
      session_id: 'f2350708-a31b-11ef-9b11-9ebb585eaf7d',
      id: '0',
      status: 'DONE',
      type: 'TEXT',
      createdDateUnix: '2024-11-15 14:36:30',
      updatedDateUnix: '2024-11-15 14:36:30',
      text: 'Hi there!',
      embedObjs: [],
      replyId: '',
      componentContainer: {
        type: 'BOT_MESSAGE_COMPONENTS_TYPE_CONTAINER',
        components: [
          {
            type: 'BOT_MESSAGE_COMPONENTS_TYPE_ROW',
            components: [
              {
                type: 'BOT_MESSAGE_COMPONENTS_TYPE_BUTTON',
                components: [],
                button: {
                  content: {
                    text: 'Go',
                    iconUrl: null,
                    iconLabel: null,
                    direction: null,
                    description: null,
                  },
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
                  buttonId: 'MESSAGE_0_BUTTON_0',
                  actions: [
                    {
                      action:
                        'MESSAGE_COMPONENTS_BUTTON_ACTION_TYPE_INTERACTION',
                      interactionInput: {
                        displayType:
                          'BOT_MESSAGE_COMPONENTS_BUTTON_ACTION_INTERACTION_INPUT_DISPLAY_TYPE_SLASH_COMMAND',
                        slashCommandInput: {
                          name: '/Go',
                          paramMap: {},
                        },
                      },
                    },
                  ],
                  disabled: false,
                  doubleCheck: {
                    isNeedDoubleCheck: false,
                    title: '',
                    description: '',
                  },
                  payload: {},
                },
              },
            ],
          },
        ],
        button: null,
      },
      inputSetting: {
        canInputText: false,
        canInputAudio: false,
        canUploadFile: false,
      },
    };
    const ret = serverMessageToMessage(
      {
        id: 'shellagent-app-builder-chat',
        name: 'ShellAgent App Builder Chat',
      },
      d,
    );
    expect(ret).toEqual(c);
  });
});
