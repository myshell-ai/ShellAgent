import { refOptionsOutputSchema } from '@shellagent/shared/protocol/app-scope';

import {
  convertNodeDataToState,
  convertRefOptsToCascaderOpts,
  convetNodeDataToScopes,
  fieldsModeMap2Refs,
} from './app-builder-utils';

describe('app builder utils', () => {
  it('convert node data to state', () => {
    const nodeData = {
      '@@@start': {
        id: '@@@start',
        type: 'start',
        context: {
          untitled___context__1__: {
            type: 'text',
            value: '',
            name: 'Untitled Context',
          },
          untitled___context__2__: {
            type: 'text',
            value: '',
            name: 'Untitled Context',
          },
        },
      },
      state_1: {
        id: 'state_1',
        type: 'state',
        name: 'State',
        render: {
          buttons: [
            {
              content: 'Button#1',
              on_click: {
                event: 'button_1.on_click',
                payload: {
                  untitled_payload_1: {
                    type: 'text',
                    value: '',
                    name: 'Untitled Payload',
                  },
                  untitled_payload_2: {
                    type: 'text',
                    value: '',
                    name: 'Untitled Payload',
                  },
                },
              },
              id: 'button_1.on_click',
              description: '',
            },
          ],
          text: '{{untitled_input_1}}\n{{untitled_output_1}}',
        },
        inputs: {
          untitled_input_1: {
            name: 'Untitled Input',
            type: 'text',
            user_input: true,
          },
          untitled_input_2: {
            name: 'Untitled Input',
            type: 'text',
            user_input: true,
          },
        },
        outputs: {
          untitled_output_1: {
            type: 'text',
            value: '',
            name: 'Untitled Output',
          },
        },
        blocks: [
          {
            type: 'task',
            display_name: 'Workflow Runner#1',
            name: 'workflow_runner_1',
            mode: 'workflow',
            inputs: {},
            outputs: {},
          },
          {
            api: 'https://comfyui-test.myshell.life/',
            comfy_workflow_id: 'ce6567645cdd4afc8c5cf90add032f8a',
            type: 'task',
            display_name: 'ComfyUI#1',
            name: 'comfy_ui_1',
            mode: 'widget',
            inputs: {},
            outputs: {},
            custom: true,
            widget_class_name: 'ComfyUIWidget',
          },
        ],
      },
      state_2: {
        id: 'state_2',
        type: 'state',
        name: 'State',
        render: {
          buttons: [
            {
              content: 'Button#1',
              on_click: {
                event: 'button_1.on_click',
                payload: {
                  untitled_payload_3: {
                    type: 'text',
                    value: '',
                    name: 'Untitled Payload',
                  },
                  untitled_payload_4: {
                    type: 'text',
                    value: '',
                    name: 'Untitled Payload',
                  },
                },
              },
              id: 'button_1.on_click',
              description: '',
            },
          ],
        },
        inputs: {},
      },
    };
    const edges = [
      {
        type: 'default_edge',
        style: {
          strokeWidth: 2,
          stroke: '#d1d5db',
        },
        markerEnd: {
          color: '#5A646Es',
          height: 25,
          strokeWidth: 2,
          type: 'arrowclosed',
          width: 10,
        },
        id: 'reactflow__edge-@@@start@@@start-state_1state_1',
        source: '@@@start',
        target: 'state_1',
      },
      {
        type: 'custom_edge',
        style: {
          strokeWidth: 2,
          stroke: '#d1d5db',
        },
        markerEnd: {
          color: '#5A646Es',
          height: 25,
          strokeWidth: 2,
          type: 'arrowclosed',
          width: 10,
        },
        id: 'reactflow__edge-state_1custom_button-source-handle-button_1.on_click#0-state_2state_2',
        source: 'state_1',
        target: 'state_2',
        data: {
          id: 'f02199d9-c3ff-4681-aaee-1b64bdc49bed',
          custom: true,
          event_key: 'button_1.on_click',
          type: 'STATE',
          source: 'state_1',
          target: 'state_2',
          conditions: [],
        },
      },
      {
        type: 'custom_edge',
        style: {
          strokeWidth: 2,
          stroke: '#d1d5db',
        },
        markerEnd: {
          color: '#5A646Es',
          height: 25,
          strokeWidth: 2,
          type: 'arrowclosed',
          width: 10,
        },
        id: 'reactflow__edge-state_1custom_state_1-state_2state_2',
        source: 'state_1',
        target: 'state_2',
        data: {
          id: 'state_1',
          custom: true,
          type: 'ALWAYS',
          source: 'state_1',
          target: 'state_2',
          conditions: [],
        },
      },
    ];
    const scopes = convetNodeDataToScopes(nodeData, edges);
    expect(scopes).toMatchInlineSnapshot(`
      {
        "scopes": {
          "context": {
            "variables": {
              "untitled___context__1__": {
                "display_name": "Untitled Context",
                "type": "text",
              },
              "untitled___context__2__": {
                "display_name": "Untitled Context",
                "type": "text",
              },
            },
          },
          "edges": [
            {
              "source": "@@@start",
              "target": "state_1",
            },
            {
              "source": "state_1",
              "target": "state_2",
            },
            {
              "source": "state_1",
              "target": "state_2",
            },
          ],
          "states": {
            "state_1": {
              "children": {
                "inputs": {
                  "variables": {
                    "untitled_input_1": {
                      "display_name": "Untitled Input",
                      "type": "text",
                    },
                    "untitled_input_2": {
                      "display_name": "Untitled Input",
                      "type": "text",
                    },
                  },
                },
                "outputs": {
                  "render": {
                    "buttons": {
                      "button_1": {
                        "event": "button_1.on_click",
                        "payload": {
                          "untitled_payload_1": {
                            "display_name": "Untitled Payload",
                            "type": "text",
                          },
                          "untitled_payload_2": {
                            "display_name": "Untitled Payload",
                            "type": "text",
                          },
                        },
                      },
                    },
                  },
                  "variables": {
                    "untitled_output_1": {
                      "display_name": "Untitled Output",
                      "type": "text",
                    },
                  },
                },
                "tasks": [
                  {
                    "display_name": "Workflow Runner#1",
                    "name": "workflow_runner_1",
                    "variables": {},
                  },
                  {
                    "display_name": "ComfyUI#1",
                    "name": "comfy_ui_1",
                    "variables": {},
                  },
                ],
              },
              "display_name": "State",
              "name": "state_1",
            },
            "state_2": {
              "children": {
                "inputs": {
                  "variables": {},
                },
                "outputs": {
                  "render": {
                    "buttons": {
                      "button_1": {
                        "event": "button_1.on_click",
                        "payload": {
                          "untitled_payload_3": {
                            "display_name": "Untitled Payload",
                            "type": "text",
                          },
                          "untitled_payload_4": {
                            "display_name": "Untitled Payload",
                            "type": "text",
                          },
                        },
                      },
                    },
                  },
                  "variables": {},
                },
                "tasks": [],
              },
              "display_name": "State",
              "name": "state_2",
            },
          },
        },
      }
    `);
  });
  it('convert a node data state to state', () => {
    const nodeData = {
      id: 'state_2',
      type: 'state',
      name: 'State',
      render: {
        buttons: [
          {
            content: 'Button#1',
            on_click: {
              event: 'button_1.on_click',
              payload: {
                untitled_payload_3: {
                  type: 'text',
                  value: '',
                  name: 'Untitled Payload',
                },
                untitled_payload_4: {
                  type: 'text',
                  value: '',
                  name: 'Untitled Payload',
                },
              },
            },
            id: 'button_1.on_click',
            description: '',
          },
        ],
      },
    };
    const ret = convertNodeDataToState(nodeData);
    expect(ret).toMatchInlineSnapshot(`
      {
        "children": {
          "inputs": {
            "variables": {},
          },
          "outputs": {
            "render": {
              "buttons": {
                "button_1": {
                  "event": "button_1.on_click",
                  "payload": {
                    "untitled_payload_3": {
                      "display_name": "Untitled Payload",
                      "type": "text",
                    },
                    "untitled_payload_4": {
                      "display_name": "Untitled Payload",
                      "type": "text",
                    },
                  },
                },
              },
            },
            "variables": {},
          },
          "tasks": [],
        },
        "display_name": "State",
        "name": "state_2",
      }
    `);
  });

  it('convert ref opts to cascader opts', () => {
    const input = refOptionsOutputSchema.parse({
      global: {
        context: {
          display_name: 'Context',
          variables: {
            global_a: {
              type: 'text',
              display_name: 'Global A',
            },
          },
        },
        state_1: {
          display_name: 'State#1',
          variables: {
            output_a: {
              type: 'text',
              display_name: 'Output A',
            },
          },
        },
      },
      local: {
        buttons: {
          button_a: {
            event: 'button_a.on_click',
            payload: {
              input_b: {
                type: 'text',
                display_name: 'Input B',
              },
            },
          },
        },
        inputs: {
          variables: {
            input_b: {
              type: 'text',
              display_name: 'Input B',
            },
          },
        },
        outputs: {
          variables: {
            output_b: {
              type: 'text',
              display_name: 'Output B',
            },
          },
        },
        tasks: [
          {
            name: 'task1',
            display_name: 'Task 1',
            variables: {
              output_a: {
                display_name: 'output_a',
                type: 'text',
              },
            },
          },
          {
            name: 'task2',
            display_name: 'Task 2',
            variables: {
              output_a: {
                display_name: 'output_a',
                type: 'text',
              },
            },
          },
        ],
      },
    });
    const ret = convertRefOptsToCascaderOpts(input as any);
    expect(ret).toMatchInlineSnapshot(`
      [
        {
          "children": [
            {
              "children": [
                {
                  "field_type": "text",
                  "label": "Global A",
                  "parent": "context",
                  "value": "{{ __context__global_a__ }}",
                },
              ],
              "label": "Context",
              "value": "Context",
            },
            {
              "children": [
                {
                  "field_type": "text",
                  "label": "Output A",
                  "parent": "state",
                  "value": "{{ state_1.output_a }}",
                },
              ],
              "label": "State#1",
              "value": "State#1",
            },
          ],
          "label": "global",
        },
        {
          "children": [
            {
              "children": [
                {
                  "children": [
                    {
                      "field_type": "text",
                      "label": "Input B",
                      "parent": "buttons",
                      "value": "{{ payload.input_b }}",
                    },
                  ],
                  "label": "button_a",
                  "parent": "render",
                  "value": "button_a",
                },
              ],
              "label": "Payload",
              "value": "Payload",
            },
            {
              "children": [
                {
                  "field_type": "text",
                  "label": "Input B",
                  "parent": "inputs",
                  "value": "{{ input_b }}",
                },
              ],
              "label": "Input",
              "value": "Input",
            },
            {
              "children": [
                {
                  "field_type": "text",
                  "label": "Output B",
                  "parent": "outputs",
                  "value": "{{ output_b }}",
                },
              ],
              "label": "Output",
              "value": "Output",
            },
            {
              "children": [
                {
                  "children": [
                    {
                      "field_type": "text",
                      "label": "output_a",
                      "parent": "blocks",
                      "value": "{{ task1.output_a }}",
                    },
                  ],
                  "label": "Task 1",
                  "parent": "blocks",
                  "value": "Task 1",
                },
                {
                  "children": [
                    {
                      "field_type": "text",
                      "label": "output_a",
                      "parent": "blocks",
                      "value": "{{ task2.output_a }}",
                    },
                  ],
                  "label": "Task 2",
                  "parent": "blocks",
                  "value": "Task 2",
                },
              ],
              "label": "Task",
              "value": "Task",
            },
          ],
          "label": "current",
        },
      ]
    `);
  });

  describe('cases', () => {
    it('case#1', () => {
      const input = {
        id: 'state_2',
        type: 'state',
        name: 'State',
        render: {},
        inputs: {
          untitled_input_1: {
            name: 'input_1',
            type: 'text',
            user_input: true,
          },
        },
        blocks: [
          {
            type: 'task',
            display_name: 'GPT#1',
            name: 'gpt_1',
            mode: 'widget',
            inputs: {
              model: 'gpt-4o',
              system_prompt: '',
              user_prompt: '',
              input_image: null,
              memory: [],
              function_parameters: [],
              memory_mode: 'auto',
              temperature: 0.7,
              top_p: 1,
              max_tokens: null,
              stream: false,
              presence_penalty: 0,
              frequency_penalty: 0,
              callback: null,
              widget_run_id: null,
              function_name: 'any_function_name',
              function_description: 'any_function_description',
            },
            outputs: {
              display: {
                reply: 'string|object',
              },
            },
            widget_class_name: 'GPTWidget',
            render: null,
          },
        ],
      };
      const ret = convertNodeDataToState(input);
      expect(ret).toMatchInlineSnapshot(`
        {
          "children": {
            "inputs": {
              "variables": {
                "untitled_input_1": {
                  "display_name": "input_1",
                  "type": "text",
                },
              },
            },
            "outputs": {
              "render": {
                "buttons": {},
              },
              "variables": {},
            },
            "tasks": [
              {
                "display_name": "GPT#1",
                "name": "gpt_1",
                "variables": {
                  "reply": {
                    "display_name": "reply",
                    "type": "string|object",
                  },
                },
              },
            ],
          },
          "display_name": "State",
          "name": "state_2",
        }
      `);
    });

    it('case#2', () => {
      const nodeDatas = {
        '@@@start': {
          id: '@@@start',
          type: 'start',
          context: {
            '7b_7b_name_7d_7d__2': {
              type: 'text',
              value: '',
              name: '1111',
            },
            '7b_7b_name_7d_7d__1': {
              type: 'text',
              value: '',
              name: '2222',
            },
          },
        },
        state_1: {
          id: 'state_1',
          type: 'state',
          name: 'State',
          render: {
            buttons: [
              {
                content: 'Button#1',
                on_click: {
                  event: 'button_1.on_click',
                  payload: {
                    key_1730724703385: {
                      type: 'text',
                      value: '{{untitled_output_2}}',
                      name: 'Untitled',
                    },
                  },
                },
                id: 'button_1.on_click',
                description: '',
              },
            ],
          },
          inputs: {
            untitled_input_2: {
              name: 'Untitled Input',
              type: 'text',
              user_input: true,
            },
          },
          outputs: {
            untitled_output_2: {
              type: 'text',
              value: '',
              name: 'Untitled Output',
            },
          },
        },
        state_2: {
          id: 'state_2',
          type: 'state',
          name: 'State',
          render: {
            buttons: [
              {
                content: 'Button#1',
                on_click: {
                  event: 'button_1.on_click',
                  payload: {
                    untitled_payload_1: {
                      type: 'text',
                      value: '{{__context__7b_7b_name_7d_7d__2__}}',
                      name: 'hhhh',
                    },
                  },
                },
                id: 'button_1.on_click',
                description: '',
              },
            ],
            audio: '',
            image: '',
            text: '{{__context__7b_7b_name_7d_7d__2__}}',
          },
          inputs: {
            untitled_input_1: {
              name: 'Untitled Input',
              type: 'text',
              user_input: true,
              default_value: '{{state_1.untitled_output_2}}',
            },
          },
          outputs: {
            untitled_output_1: {
              type: 'text',
              value: '{{__context__7b_7b_name_7d_7d__2__}}',
              name: 'Untitled Output',
            },
          },
          blocks: [
            {
              inputs: {
                model: 'gpt-4o',
                system_prompt: '',
                user_prompt: '',
                input_image: null,
                memory: [],
                function_parameters: [],
                memory_mode: 'auto',
                temperature: 0.7,
                top_p: 1,
                max_tokens: null,
                stream: false,
                presence_penalty: 0,
                frequency_penalty: 0,
                callback: null,
                widget_run_id: null,
                function_name: 'any_function_name',
                function_description: 'any_function_description',
              },
              outputs: {
                display: {
                  reply: 'string|object',
                },
              },
              render: null,
              type: 'task',
              display_name: 'GPT#1',
              name: 'gpt_1',
              mode: 'widget',
              widget_class_name: 'GPTWidget',
            },
            {
              type: 'task',
              display_name: 'GPT',
              name: 'key_1730724856858',
              mode: 'widget',
              widget_class_name: 'GPTWidget',
              inputs: {},
              outputs: {},
            },
          ],
        },
      };

      const ret = convetNodeDataToScopes(nodeDatas, []);
      expect(ret).toMatchInlineSnapshot(`
        {
          "scopes": {
            "context": {
              "variables": {
                "7b_7b_name_7d_7d__1": {
                  "display_name": "2222",
                  "type": "text",
                },
                "7b_7b_name_7d_7d__2": {
                  "display_name": "1111",
                  "type": "text",
                },
              },
            },
            "edges": [],
            "states": {
              "state_1": {
                "children": {
                  "inputs": {
                    "variables": {
                      "untitled_input_2": {
                        "display_name": "Untitled Input",
                        "type": "text",
                      },
                    },
                  },
                  "outputs": {
                    "render": {
                      "buttons": {
                        "button_1": {
                          "event": "button_1.on_click",
                          "payload": {
                            "key_1730724703385": {
                              "display_name": "Untitled",
                              "type": "text",
                            },
                          },
                        },
                      },
                    },
                    "variables": {
                      "untitled_output_2": {
                        "display_name": "Untitled Output",
                        "type": "text",
                      },
                    },
                  },
                  "tasks": [],
                },
                "display_name": "State",
                "name": "state_1",
              },
              "state_2": {
                "children": {
                  "inputs": {
                    "variables": {
                      "untitled_input_1": {
                        "display_name": "Untitled Input",
                        "type": "text",
                      },
                    },
                  },
                  "outputs": {
                    "render": {
                      "buttons": {
                        "button_1": {
                          "event": "button_1.on_click",
                          "payload": {
                            "untitled_payload_1": {
                              "display_name": "hhhh",
                              "type": "text",
                            },
                          },
                        },
                      },
                    },
                    "variables": {
                      "untitled_output_1": {
                        "display_name": "Untitled Output",
                        "type": "text",
                      },
                    },
                  },
                  "tasks": [
                    {
                      "display_name": "GPT#1",
                      "name": "gpt_1",
                      "variables": {
                        "reply": {
                          "display_name": "reply",
                          "type": "string|object",
                        },
                      },
                    },
                    {
                      "display_name": "GPT",
                      "name": "key_1730724856858",
                      "variables": {},
                    },
                  ],
                },
                "display_name": "State",
                "name": "state_2",
              },
            },
          },
        }
      `);
    });

    // it('case#3', () => {
    //   const nodeData = {
    //     '@@@start': {
    //       id: '@@@start',
    //       type: 'start',
    //       context: {
    //         qweqweqwe: {
    //           type: 'text',
    //           value: '',
    //           name: 'qweqweqwe',
    //         },
    //         aaaaa: {
    //           type: 'text',
    //           value: '',
    //           name: 'aaaaa',
    //         },
    //         ccccc: {
    //           type: 'text',
    //           value: '',
    //           name: 'ccccc',
    //         },
    //         'bbbb_asad_@as_hhh': {
    //           type: 'text',
    //           value: '',
    //           name: '阿珂建设南大街卡',
    //         },
    //       },
    //     },
    //     state_1: {
    //       blocks: [],
    //       transition: {},
    //       id: 'state_1',
    //       name: 'State#1',
    //       type: 'state',
    //       inputs: {
    //         '1111': {
    //           name: '1111',
    //           type: 'text',
    //           user_input: true,
    //         },
    //         '2222': {
    //           name: '2222_1',
    //         },
    //         '2222_': {
    //           name: '2222_',
    //           type: 'text',
    //           user_input: true,
    //         },
    //       },
    //       outputs: {},
    //       render: {},
    //     },
    //   };
    //   expect(() => convetNodeDataToScopes(nodeData, []))
    //     .toThrowErrorMatchingInlineSnapshot(`
    //     "[
    //       {
    //         "code": "custom",
    //         "message": "should not be empty",
    //         "path": [
    //           "children",
    //           "inputs",
    //           "variables",
    //           "2222",
    //           "type"
    //         ]
    //       }
    //     ]"
    //   `);
    // });
  });
});

describe('fieldsModeMap2Refs', () => {
  it('should convert simple field mode map', () => {
    const input = {
      '@@@start': {
        'context.key_1732680761763.value': 'ref',
      },
      key_1732680760262: {
        'output.key_1732680806536.value': 'raw',
        'output.key_1732680825193.value': 'raw',
        'render.audio': 'ref',
        'render.image': 'raw',
        'input.key_1732680981496.default_value': 'ref',
      },
      'key_1732680760262.7a3ae4a4-0e6f-42db-bba7-94d0ce244feb': {
        description: 'ref',
        payload: 'ref',
      },
      'key_1732680760262.blocks.0': {
        'inputs.system_prompt': 'ref',
      },
    };

    const result = fieldsModeMap2Refs(input);

    expect(result).toEqual({
      '@@@start': {
        'context.key_1732680761763.value': {
          currentMode: 'ref',
        },
      },
      key_1732680760262: {
        'output.key_1732680806536.value': {
          currentMode: 'raw',
        },
        'output.key_1732680825193.value': {
          currentMode: 'raw',
        },
        'render.audio': {
          currentMode: 'ref',
        },
        'render.image': {
          currentMode: 'raw',
        },
        'input.key_1732680981496.default_value': {
          currentMode: 'ref',
        },
        'blocks.0.inputs.system_prompt': {
          currentMode: 'ref',
        },
        'render.buttons.7a3ae4a4-0e6f-42db-bba7-94d0ce244feb.description': {
          currentMode: 'ref',
        },
        'render.buttons.7a3ae4a4-0e6f-42db-bba7-94d0ce244feb.payload': {
          currentMode: 'ref',
        },
      },
    });
  });

  // it('should handle UUID fields correctly', () => {
  //   const input = {
  //     'key_1732680760262': {
  //       'key_1732680760262.7a3ae4a4-0e6f-42db-bba7-94d0ce244feb.description': 'ref',
  //       'normal.field': 'raw'
  //     }
  //   };

  //   const result = fieldsModeMap2Refs(input);

  //   expect(result).toEqual({
  //     'key_1732680760262': {
  //       'render.buttons.7a3ae4a4-0e6f-42db-bba7-94d0ce244feb.payload': {
  //         currentMode: 'ref'
  //       },
  //       'normal.field': {
  //         currentMode: 'raw'
  //       }
  //     }
  //   });
  // });

  // it('should handle mixed fields with blocks', () => {
  //   const input = {
  //     'key_1732680760262': {
  //       'key_1732680760262.blocks.0': {
  //         'inputs.system_prompt': 'ref'
  //       },
  //       'normal.field': 'raw',
  //       'key_1732680760262.7a3ae4a4-0e6f-42db-bba7-94d0ce244feb.description': 'ref'
  //     }
  //   };

  //   const result = fieldsModeMap2Refs(input);

  //   expect(result).toEqual({
  //     'key_1732680760262': {
  //       'blocks.0.inputs.system_prompt': {
  //         currentMode: 'ref'
  //       },
  //       'normal.field': {
  //         currentMode: 'raw'
  //       },
  //       'render.buttons.7a3ae4a4-0e6f-42db-bba7-94d0ce244feb.payload': {
  //         currentMode: 'ref'
  //       }
  //     }
  //   });
  // });
});
