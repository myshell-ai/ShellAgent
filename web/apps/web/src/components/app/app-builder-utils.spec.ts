import {
  convertNodeDataToState,
  convertRefOptsToCascaderOpts,
  convetNodeDataToScopes,
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
          text: '{{ untitled_input_1 }}\n{{ untitled_output_1 }}',
        },
        input: {
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
        output: {
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
        input: {},
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
                "type": "text",
              },
              "untitled___context__2__": {
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
                      "type": "text",
                    },
                    "untitled_input_2": {
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
                            "type": "text",
                          },
                          "untitled_payload_2": {
                            "type": "text",
                          },
                        },
                      },
                    },
                  },
                  "variables": {
                    "untitled_output_1": {
                      "type": "text",
                    },
                  },
                },
                "tasks": [
                  {
                    "name": "workflow_runner_1",
                    "variables": {},
                  },
                  {
                    "name": "comfy_ui_1",
                    "variables": {},
                  },
                ],
              },
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
                            "type": "text",
                          },
                          "untitled_payload_4": {
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
                      "type": "text",
                    },
                    "untitled_payload_4": {
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
        "name": "state_2",
      }
    `);
  });

  it.only('convert ref opts to cascader opts', () => {
    const input = {
      global: {
        context: {
          global_a: {
            type: 'text',
          },
        },
        state_1: {
          output_a: {
            type: 'text',
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
              },
            },
          },
        },
        inputs: {
          variables: {
            input_b: {
              type: 'text',
            },
          },
        },
        outputs: {
          variables: {
            output_b: {
              type: 'text',
            },
          },
        },
        tasks: [
          {
            name: 'task1',
            variables: {
              output_a: {
                type: 'text',
              },
            },
          },
          {
            name: 'task2',
            variables: {
              output_a: {
                type: 'text',
              },
            },
          },
        ],
      },
    };
    const ret = convertRefOptsToCascaderOpts(input as any);
    expect(ret).toMatchInlineSnapshot(`
      [
        {
          "children": [
            {
              "children": [
                {
                  "field_type": "text",
                  "label": "global_a",
                  "value": "{{ context.global_a }}",
                },
              ],
              "label": "context",
            },
            {
              "children": [
                {
                  "field_type": "text",
                  "label": "output_a",
                  "value": "{{ state_1.output_a }}",
                },
              ],
              "label": "state_1",
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
                      "label": "input_b",
                      "value": "{{ input_b }}",
                    },
                  ],
                  "label": "button_a",
                },
              ],
              "label": "buttons",
            },
            {
              "children": [
                {
                  "field_type": "text",
                  "label": "input_b",
                  "value": "{{ input_b }}",
                },
              ],
              "label": "inputs",
            },
            {
              "children": [
                {
                  "field_type": "text",
                  "label": "output_b",
                  "value": "{{ output_b }}",
                },
              ],
              "label": "outputs",
            },
            {
              "children": [
                {
                  "children": [
                    {
                      "field_type": "text",
                      "label": "output_a",
                      "value": "{{ task1.output_a }}",
                    },
                  ],
                  "label": "task1",
                },
                {
                  "children": [
                    {
                      "field_type": "text",
                      "label": "output_a",
                      "value": "{{ task2.output_a }}",
                    },
                  ],
                  "label": "task2",
                },
              ],
              "label": "tasks",
            },
          ],
          "label": "local",
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
        input: {
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
                "name": "gpt_1",
                "variables": {
                  "reply": {
                    "type": "string|object",
                  },
                },
              },
            ],
          },
          "name": "state_2",
        }
      `);
    });
  });
});
