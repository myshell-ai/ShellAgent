import {
  popupFormAction,
  serverMessageToMessage,
} from './app-builder-chat-utils';

const testEntity = {
  id: 'shellagent-app-builder-chat',
  name: 'ShellAgent App Builder Chat',
};

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

    const ret = serverMessageToMessage(testEntity, d);

    expect(ret).toMatchInlineSnapshot(`
      {
        "createdDateUnix": "2024-11-15 14:59:28",
        "embedObjs": [],
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
    const ret = serverMessageToMessage(testEntity, d);
    expect(ret).toEqual(c);
  });

  it('patch error', () => {
    const d = {
      input: null,
      output: {
        error_message:
          'some_text requires user_input=True but no input is provided!',
        error_message_detail:
          'Traceback (most recent call last):\n  File "/Users/shane/Downloads/ShellAgent_MacOS_release/ShellAgent/servers/automata.py", line 606, in execute_automata\n    sess_state, render, event_mapping = runner.run_automata(automata, sess_state, environ, payload)\n  File "/Users/shane/Downloads/ShellAgent_MacOS_release/ShellAgent/proconfig/runners/runner.py", line 485, in run_automata\n    context, render, local_vars, output_vars = self.run_state(current_state, context, environ, payload)\n  File "/Users/shane/Downloads/ShellAgent_MacOS_release/ShellAgent/proconfig/runners/runner.py", line 432, in run_state\n    raise NotImplementedError(f"{v.name} requires user_input=True but no input is provided!")\nNotImplementedError: some_text requires user_input=True but no input is provided!\n',
      },
      node_id: null,
      create_time: 1731657737.861372,
      finish_time: 1731657737.864793,
      node_status: 'failed',
      task_id: '322c57d310a640fab38e87ccd17a900a',
      session_id: '8b1a91da-a327-11ef-9b11-9ebb585eaf7d',
    };
    const s = serverMessageToMessage(testEntity, d);
    expect(s).toMatchInlineSnapshot(`
      {
        "asyncJobInfo": {
          "componentInput": "",
          "jobId": "",
          "status": "EMBED_OBJ_STATUS_UNSPECIFIED",
        },
        "createdDateUnix": 1731657737.861372,
        "entityId": "shellagent-app-builder-chat",
        "id": "322c57d310a640fab38e87ccd17a900a",
        "runningError": {
          "errorDetail": "some_text requires user_input=True but no input is provided!
      Traceback (most recent call last):
        File "/Users/shane/Downloads/ShellAgent_MacOS_release/ShellAgent/servers/automata.py", line 606, in execute_automata
          sess_state, render, event_mapping = runner.run_automata(automata, sess_state, environ, payload)
        File "/Users/shane/Downloads/ShellAgent_MacOS_release/ShellAgent/proconfig/runners/runner.py", line 485, in run_automata
          context, render, local_vars, output_vars = self.run_state(current_state, context, environ, payload)
        File "/Users/shane/Downloads/ShellAgent_MacOS_release/ShellAgent/proconfig/runners/runner.py", line 432, in run_state
          raise NotImplementedError(f"{v.name} requires user_input=True but no input is provided!")
      NotImplementedError: some_text requires user_input=True but no input is provided!
      ",
          "errorType": "RUNNING_ERROR_TYPE_ENGINE_ERROR",
        },
        "status": "failed",
        "text": undefined,
        "type": "REPLY",
        "updatedDateUnix": 1731657737.864793,
        "userId": "test-app-builder",
      }
    `);
  });

  it('patch popup form action', () => {
    const d: any = [
      {
        action: 'MESSAGE_COMPONENTS_BUTTON_ACTION_TYPE_POP_UP_FORM',
        actionLink: null,
        formSchema: {
          properties: {
            key_1731664091698: {
              name: 'arg1',
              type: 'string',
              description: null,
              default: null,
            },
          },
          required: ['key_1731664091698'],
        },
        interactionInput: null,
      },
    ];

    const ret = popupFormAction(d);
    expect(ret).toMatchInlineSnapshot(`
      [
        {
          "action": "MESSAGE_COMPONENTS_BUTTON_ACTION_TYPE_POP_UP_FORM",
          "componentInput": {
            "componentsFunction": [],
            "componentsInput": [
              {
                "booleanDefault": false,
                "description": "",
                "fieldName": "key_1731664091698",
                "fileDefaultParam": "",
                "fileDefaultParamType": "MESSAGE_METADATA_TYPE_UNSPECIFIED",
                "fileUploadSizeMaximum": 0,
                "hasIntegerLimitation": false,
                "hasNumberLimitation": false,
                "integerDefault": 0,
                "isRequired": true,
                "name": "arg1",
                "numberDefault": 0,
                "numberSelectorAllOf": [],
                "numberSelectorDefault": 0,
                "stringCharLengthLimitation": 0,
                "stringDefault": "",
                "supportedFileTypes": [],
                "textSelectorAllOf": [],
                "textSelectorDefault": "",
                "type": "BOT_IM_COMPONENT_INPUT_TYPE_TEXT_INPUT",
              },
            ],
            "description": "Enter to run",
            "energyConsumePerUse": 0,
            "githubUrl": "",
            "name": "Information",
            "saveButtonContent": "Run",
          },
        },
      ]
    `);

    const c = {
      action: 'MESSAGE_COMPONENTS_BUTTON_ACTION_TYPE_POP_UP_FORM',
      componentInput: {
        name: 'Information',
        description: 'Enter to run',
        githubUrl: '',
        componentsInput: [
          {
            type: 'BOT_IM_COMPONENT_INPUT_TYPE_TEXT_INPUT',
            name: 'Untitled',
            description: '',
            stringDefault: '',
            numberDefault: 0,
            hasNumberLimitation: false,
            integerDefault: 0,
            hasIntegerLimitation: false,
            booleanDefault: false,
            textSelectorDefault: '',
            textSelectorAllOf: [],
            numberSelectorDefault: 0,
            numberSelectorAllOf: [],
            fieldName: 'key_1729235996147',
            isRequired: true,
            supportedFileTypes: [],
            fileDefaultParam: '',
            fileDefaultParamType: 'MESSAGE_METADATA_TYPE_UNSPECIFIED',
            fileUploadSizeMaximum: 0,
            stringCharLengthLimitation: 0,
          },
        ],
        componentsFunction: [],
        energyConsumePerUse: 0,
        saveButtonContent: 'Run',
      },
    };
  });

  it('case server message with embedObjs', () => {
    const d = {
      session_id: '68736a4c-a3a6-11ef-ba7c-9ebb585eaf7d',
      id: '3',
      status: 'DONE',
      type: 'TEXT',
      createdDateUnix: '2024-11-16 07:07:59',
      updatedDateUnix: '2024-11-16 07:07:59',
      text: "Single image is rendered following certain rules to align with instant message apps' experience. Please check [the rules](https://www.notion.so/myshellai/FAQ-10d3f81ff51e8054b60ad7a23aed1fa6?pvs=4#1373f81ff51e8068b20bd816a1ebc784).",
      embedObjs: [
        {
          title: '',
          type: 'MESSAGE_METADATA_TYPE_IMAGE_FILE',
          url: 'https://www.myshellstatic.com/image/chat/embed_obj/202411122156/9ff86246dc344b0dbbb8abfec226c936.jpeg',
          mediaFileMetadata: null,
          id: null,
          status: 'EMBED_OBJ_STATUS_DONE',
          extensionName: 'jpeg',
          iconUrl: null,
        },
      ],
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

    const s = serverMessageToMessage(testEntity, d);
    expect(s).toMatchInlineSnapshot(`
      {
        "createdDateUnix": "2024-11-16 07:07:59",
        "embedObjs": [
          {
            "extensionName": "jpeg",
            "iconUrl": null,
            "id": null,
            "mediaFileMetadata": null,
            "status": "EMBED_OBJ_STATUS_DONE",
            "title": "",
            "type": "MESSAGE_METADATA_TYPE_IMAGE_FILE",
            "url": "https://www.myshellstatic.com/image/chat/embed_obj/202411122156/9ff86246dc344b0dbbb8abfec226c936.jpeg",
          },
        ],
        "entityId": "shellagent-app-builder-chat",
        "id": "3",
        "status": "DONE",
        "text": "Single image is rendered following certain rules to align with instant message apps' experience. Please check [the rules](https://www.notion.so/myshellai/FAQ-10d3f81ff51e8054b60ad7a23aed1fa6?pvs=4#1373f81ff51e8068b20bd816a1ebc784).",
        "type": "REPLY",
        "updatedDateUnix": "2024-11-16 07:07:59",
        "userId": "test-app-builder",
      }
    `);
  });

  it('case save button content', () => {
    const d = {
      session_id: '5c4196a0-a3aa-11ef-ba7c-9ebb585eaf7d',
      id: '3',
      status: 'DONE',
      type: 'TEXT',
      createdDateUnix: '2024-11-16 07:38:45',
      updatedDateUnix: '2024-11-16 07:38:45',
      text: 'Hi!',
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
              buttonId: 'MESSAGE_3_BUTTON_0',
              actions: [
                {
                  action: 'MESSAGE_COMPONENTS_BUTTON_ACTION_TYPE_POP_UP_FORM',
                  actionLink: null,
                  formSchema: {
                    properties: {
                      key_1731713716445: {
                        name: 'some_text',
                        type: 'string',
                        description: null,
                        default: null,
                      },
                      key_1731713725339: {
                        name: 'some_img',
                        type: 'image',
                        description: null,
                        default: null,
                      },
                    },
                    required: ['key_1731713716445', 'key_1731713725339'],
                  },
                  interactionInput: null,
                },
              ],
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
    const ret = serverMessageToMessage(testEntity, d);
    expect(ret).toMatchInlineSnapshot(`
      {
        "componentContainer": {
          "button": null,
          "components": [
            {
              "components": [
                {
                  "button": {
                    "actions": [
                      {
                        "action": "MESSAGE_COMPONENTS_BUTTON_ACTION_TYPE_POP_UP_FORM",
                        "componentInput": {
                          "componentsFunction": [],
                          "componentsInput": [
                            {
                              "booleanDefault": false,
                              "description": "",
                              "fieldName": "key_1731713716445",
                              "fileDefaultParam": "",
                              "fileDefaultParamType": "MESSAGE_METADATA_TYPE_UNSPECIFIED",
                              "fileUploadSizeMaximum": 0,
                              "hasIntegerLimitation": false,
                              "hasNumberLimitation": false,
                              "integerDefault": 0,
                              "isRequired": true,
                              "name": "some_text",
                              "numberDefault": 0,
                              "numberSelectorAllOf": [],
                              "numberSelectorDefault": 0,
                              "stringCharLengthLimitation": 0,
                              "stringDefault": "",
                              "supportedFileTypes": [],
                              "textSelectorAllOf": [],
                              "textSelectorDefault": "",
                              "type": "BOT_IM_COMPONENT_INPUT_TYPE_TEXT_INPUT",
                            },
                            {
                              "booleanDefault": false,
                              "description": "",
                              "fieldName": "key_1731713725339",
                              "fileDefaultParam": "",
                              "fileDefaultParamType": "MESSAGE_METADATA_TYPE_UNSPECIFIED",
                              "fileUploadSizeMaximum": 0,
                              "hasIntegerLimitation": false,
                              "hasNumberLimitation": false,
                              "integerDefault": 0,
                              "isRequired": true,
                              "name": "some_img",
                              "numberDefault": 0,
                              "numberSelectorAllOf": [],
                              "numberSelectorDefault": 0,
                              "stringCharLengthLimitation": 0,
                              "stringDefault": "",
                              "supportedFileTypes": [],
                              "textSelectorAllOf": [],
                              "textSelectorDefault": "",
                              "type": "BOT_IM_COMPONENT_INPUT_TYPE_IMAGE_UPLOAD",
                            },
                          ],
                          "description": "Enter to run",
                          "energyConsumePerUse": 0,
                          "githubUrl": "",
                          "name": "Information",
                          "saveButtonContent": "Run",
                        },
                      },
                    ],
                    "buttonId": "MESSAGE_3_BUTTON_0",
                    "content": {
                      "description": null,
                      "direction": null,
                      "iconLabel": null,
                      "iconUrl": null,
                      "text": "Go",
                    },
                    "disabled": false,
                    "doubleCheck": {
                      "description": "",
                      "isNeedDoubleCheck": false,
                      "title": "",
                    },
                    "payload": {},
                    "style": {
                      "backgroundColorHex": "#F6F6F7",
                      "borderColorHex": "#E4E9F0",
                      "darkModeBackgroundColorHex": "#323339",
                      "darkModeBorderColorHex": "#42434A",
                      "darkModeFontColorHex": "#B8BCCF",
                      "darkModeIconLineColorHex": "#FFFFFF33",
                      "fontColorHex": "#202223",
                      "iconLineColorHex": "#00000033",
                    },
                  },
                  "components": [],
                  "type": "BOT_MESSAGE_COMPONENTS_TYPE_BUTTON",
                },
              ],
              "type": "BOT_MESSAGE_COMPONENTS_TYPE_ROW",
            },
          ],
          "type": "BOT_MESSAGE_COMPONENTS_TYPE_CONTAINER",
        },
        "createdDateUnix": "2024-11-16 07:38:45",
        "embedObjs": [],
        "id": "3",
        "inputSetting": {
          "canInputAudio": false,
          "canInputText": false,
          "canUploadFile": false,
        },
        "replyId": "",
        "session_id": "5c4196a0-a3aa-11ef-ba7c-9ebb585eaf7d",
        "status": "DONE",
        "text": "Hi!",
        "type": "TEXT",
        "updatedDateUnix": "2024-11-16 07:38:45",
      }
    `);
  });

  it.only('lastValidReplyMessage', () => {
    const messageList = [
      {
        id: '1856539384440025088',
        userId: '3537713',
        referenceText: '',
        text: '',
        audioUrl: '',
        duration: 0,
        audioSpeed: 1,
        status: 'DONE',
        type: 'RESET',
        createdDateUnix: '1731468456737',
        updatedDateUnix: '1731468456737',
        entityId: '1719284610',
        replyId: '0',
        feedbackState: 'Normal',
        feedbackIssues: [],
        asyncJobInfo: null,
        runningWidgetInfo: [],
        runningError: null,
        handled: false,
        imageGenMessageResponse: null,
        inputSetting: null,
        uploadSetting: null,
        componentContainer: null,
        embedObjs: [],
        slashCommandInput: null,
        referenceSource: [],
        recommendatioQuestions: {
          question: [],
        },
        regeneratedMessages: [],
        extraInfo: {
          consumeEnergy: 0,
          canEdit: false,
          canRegenerate: false,
          runningWidgetInfo: [],
          bgm: null,
          senderInfo: null,
        },
        isLlmBot: false,
      },
      {
        session_id: '38996918-a3ae-11ef-ba7c-9ebb585eaf7d',
        id: '0',
        status: 'DONE',
        type: 'TEXT',
        createdDateUnix: '2024-11-16 08:03:58',
        updatedDateUnix: '2024-11-16 08:03:58',
        text: 'Hi!',
        embedObjs: [],
        replyId: '',
        componentContainer: {
          type: 'BOT_MESSAGE_COMPONENTS_TYPE_CONTAINER',
          button: null,
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
                          'MESSAGE_COMPONENTS_BUTTON_ACTION_TYPE_POP_UP_FORM',
                        componentInput: {
                          name: 'Information',
                          description: 'Enter to run',
                          githubUrl: '',
                          saveButtonContent: 'Run',
                          energyConsumePerUse: 0,
                          componentsFunction: [],
                          componentsInput: [
                            {
                              type: 'BOT_IM_COMPONENT_INPUT_TYPE_TEXT_INPUT',
                              name: 'some_text',
                              description: '',
                              stringDefault: '',
                              numberDefault: 0,
                              hasNumberLimitation: false,
                              integerDefault: 0,
                              hasIntegerLimitation: false,
                              booleanDefault: false,
                              textSelectorDefault: '',
                              textSelectorAllOf: [],
                              numberSelectorDefault: 0,
                              numberSelectorAllOf: [],
                              fieldName: 'key_1731713716445',
                              isRequired: true,
                              supportedFileTypes: [],
                              fileDefaultParam: '',
                              fileDefaultParamType:
                                'MESSAGE_METADATA_TYPE_UNSPECIFIED',
                              fileUploadSizeMaximum: 0,
                              stringCharLengthLimitation: 0,
                            },
                          ],
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
        },
        inputSetting: {
          canInputText: false,
          canInputAudio: false,
          canUploadFile: false,
        },
      },
    ];

    const lastValidReplyMessage = messageList.reduceRight(
      (lastDone: any, message: any) => {
        console.log(message.type);
        if (lastDone) return lastDone;
        if (
          (message.type === 'REPLY' || message.type === 'GREETING') &&
          message.status === 'DONE'
        ) {
          return message;
        }
        return null;
      },
      null,
    );

    console.log(lastValidReplyMessage);
  });
});
