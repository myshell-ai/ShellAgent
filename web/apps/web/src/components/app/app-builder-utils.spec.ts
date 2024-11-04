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
    const scopes = convetNodeDataToScopes(nodeData);
    expect(scopes).toMatchInlineSnapshot(`
      {
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

  it('convert ref opts to cascader opts', () => {
    const input = {
      global: {
        context: {
          global_a: {
            type: 'text',
          },
        },
        'state#1': {
          output_a: {
            type: 'text',
          },
        },
      },
      local: {
        buttons: {
          button_a: {
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

    // const ret = [
    //   { label: 'global', children: [
    //     {
    //       label: "context",
    //       children: [
    //         {
    //           label: "global_a",
    //           value: "{{}}",
    //           field_type: "text"
    //         },
    //       ]
    //     },
    //     {
    //       label: "state#1",
    //       children: [
    //         {
    //           label: "output_a",
    //           value: "{{}}",
    //           field_type: "text"
    //         },
    //       ]
    //     }
    //   ] },
    //   { label: 'local', children: [
    //     {
    //       label: "buttons",
    //       children: [
    //         {
    //           label: "button_a",
    //           children: [
    //             {
    //               label: "input_b",
    //               field_type: "text"
    //             }
    //           ]
    //         },
    //       ]
    //     },
    //     {
    //       label: "inputs",
    //       children: [
    //         {
    //           label: "input_b",
    //           field_type: "text",
    //           value: "{{}}",
    //         },
    //       ]
    //     },
    //     {
    //       label: "outputs",
    //       children: [
    //         {
    //           label: "output_b",
    //           field_type: "text",
    //           value: "{{}}",
    //         },
    //       ]
    //     },
    //     {
    //       label: "tasks",
    //       children: [
    //         {
    //           label: "task1",
    //           children: [
    //             {
    //               label: "output_a",
    //               field_type: "text",
    //               value: "{{}}",
    //             },
    //           ]
    //         },
    //         {
    //           label: "task2",
    //           children: [
    //             {
    //               label: "output_a",
    //               field_type: "text",
    //               value: "{{}}",
    //             },
    //           ]
    //         },
    //       ]
    //     }
    //   ] },
    // ]
    const ret = convertRefOptsToCascaderOpts(input);
    expect(ret).toMatchInlineSnapshot(`
      [
        {
          "children": [
            {
              "children": [
                {
                  "field_type": "text",
                  "label": "global_a",
                  "value": "{{}}",
                },
              ],
              "label": "context",
            },
            {
              "children": [
                {
                  "field_type": "text",
                  "label": "output_a",
                  "value": "{{}}",
                },
              ],
              "label": "state#1",
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
                      "value": "{{}}",
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
                  "children": [
                    {
                      "field_type": "text",
                      "label": "input_b",
                      "value": "{{}}",
                    },
                  ],
                  "label": "variables",
                },
              ],
              "label": "inputs",
            },
            {
              "children": [
                {
                  "children": [
                    {
                      "field_type": "text",
                      "label": "output_b",
                      "value": "{{}}",
                    },
                  ],
                  "label": "variables",
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
                      "value": "{{}}",
                    },
                  ],
                  "label": "task1",
                },
                {
                  "children": [
                    {
                      "field_type": "text",
                      "label": "output_a",
                      "value": "{{}}",
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
});
