import { serverMessageToMessage } from './app-builder-chat-utils';

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

  it.only('patch error', () => {
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
});
