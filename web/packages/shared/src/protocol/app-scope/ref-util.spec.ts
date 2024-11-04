import { scopesSchema, stateSchema } from './protocol';
import {
  findAncestors,
  getRefOptions,
  renameRefer,
  renameRefKey,
  updateRefValue,
} from './ref-util';

describe('ref util', () => {
  describe('find ancestors', () => {
    it('ancestors', () => {
      const edges = [
        { source: 'state_1', target: 'state_2' },
        { source: 'state#0', target: 'state_1' },
      ];
      expect(findAncestors(edges, 'state_2')).toMatchInlineSnapshot(`
        [
          "state_1",
          "state#0",
        ]
      `);
    });

    it('ancestors - complex case', () => {
      /*
state#0
  |
  v
state_1     state#5
  |           |
  v           v
state_2 <-- state#4
  ^
  |
state#3
      */
      const edges = [
        { source: 'state_1', target: 'state_2' },
        { source: 'state#0', target: 'state_1' },
        { source: 'state#3', target: 'state_2' },
        { source: 'state#4', target: 'state#3' },
        { source: 'state#5', target: 'state#4' },
      ];
      expect(findAncestors(edges, 'state_2')).toMatchInlineSnapshot(`
        [
          "state_1",
          "state#0",
          "state#3",
          "state#4",
          "state#5",
        ]
      `);
    });

    it('ancestors - no ancestors', () => {
      const edges = [
        { source: 'state_1', target: 'state_2' },
        { source: 'state#0', target: 'state_1' },
      ];
      expect(findAncestors(edges, 'state#0')).toMatchInlineSnapshot(`[]`);
    });

    it('ancestors - disconnected graph', () => {
      const edges = [
        { source: 'state_1', target: 'state_2' },
        { source: 'state#3', target: 'state#4' },
      ];
      expect(findAncestors(edges, 'state#4')).toMatchInlineSnapshot(`
        [
          "state#3",
        ]
      `);
    });

    /*
state_1
  |
  v
state_2
  |
  v
state#3
  |
  └───> (back to state_1)
    */
    it('ancestors - circular dependency', () => {
      const edges = [
        { source: 'state_1', target: 'state_2' },
        { source: 'state_2', target: 'state#3' },
        { source: 'state#3', target: 'state_1' }, // Circular dependency
      ];
      expect(findAncestors(edges, 'state#3')).toMatchInlineSnapshot(`
        [
          "state_2",
          "state_1",
          "state#3",
        ]
      `);
    });
  });

  describe('get ref options', () => {
    it('state_input', () => {
      const edges = [{ source: 'state_1', target: 'state_2' }];

      const scopes = scopesSchema.parse({
        scopes: {
          context: {
            variables: {
              global_a: { type: 'text', display_name: 'Hello world' },
            },
          },
          edges: edges,
          states: {
            state_1: {
              name: 'state_1',
              display_name: 'State#1',
              children: {
                inputs: {
                  variables: {
                    input_a: { type: 'text', display_name: 'Hello world' },
                  },
                },
                tasks: [
                  {
                    name: 'task1',
                    display_name: 'Task 1',
                    variables: {},
                  },
                  {
                    name: 'task2',
                    display_name: 'Task 2',
                    variables: {},
                  },
                ],
                outputs: {
                  variables: {
                    output_a: { type: 'text', display_name: 'Hello world' },
                  },
                  render: { buttons: {} },
                },
              },
            },
            state_2: {
              name: 'state_2',
              display_name: 'State#2',
              children: {
                inputs: {
                  variables: {},
                },
                tasks: [],
                outputs: {
                  variables: {
                    output_b: { type: 'text', display_name: 'Hello world' },
                  },
                  render: { buttons: {} },
                },
              },
            },
          },
        },
      });

      const options = getRefOptions(scopes, 'state_2', 'state_input');

      expect(options).toMatchInlineSnapshot(`
        {
          "global": {
            "context": {
              "global_a": {
                "display_name": "Hello world",
                "type": "text",
              },
            },
            "state_1": {
              "output_a": {
                "display_name": "Hello world",
                "type": "text",
              },
            },
          },
          "local": {
            "buttons": {},
            "inputs": {
              "variables": {},
            },
            "outputs": {
              "variables": {},
            },
            "tasks": [],
          },
        }
      `);
    });

    describe('state_task', () => {
      it('state_task', () => {
        const edges = [{ source: 'state_1', target: 'state_2' }];
        const scopes = scopesSchema.parse({
          scopes: {
            context: {
              variables: {
                global_a: { type: 'text', display_name: 'Hello world' },
              },
            },
            edges: edges,
            states: {
              state_1: {
                name: 'state_1',
                display_name: 'State#1',
                children: {
                  inputs: { variables: {} },
                  tasks: [],
                  outputs: {
                    variables: {
                      output_a: { type: 'text', display_name: 'Hello world' },
                    },
                    render: { buttons: {} },
                  },
                },
              },
              state_2: {
                name: 'state_2',
                display_name: 'State#2',
                children: {
                  inputs: {
                    variables: {
                      input_b: { type: 'text', display_name: 'Hello world' },
                    },
                  },
                  tasks: [
                    {
                      name: 'task1',
                      display_name: 'Task 1',
                      variables: {
                        output_a: { type: 'text', display_name: 'output_a' },
                      },
                    },
                    {
                      name: 'task2',
                      display_name: 'Task 2',
                      variables: {},
                    },
                  ],
                  outputs: {
                    variables: {
                      output_b: { type: 'text', display_name: 'Hello world' },
                    },
                    render: { buttons: {} },
                  },
                },
              },
            },
          },
        });
        const options = getRefOptions(
          scopes,
          // edges,
          'state_2',
          'state_task',
          'task2',
        );
        expect(options).toMatchInlineSnapshot(`
          {
            "global": {
              "context": {
                "global_a": {
                  "display_name": "Hello world",
                  "type": "text",
                },
              },
              "state_1": {
                "output_a": {
                  "display_name": "Hello world",
                  "type": "text",
                },
              },
            },
            "local": {
              "buttons": {},
              "inputs": {
                "variables": {
                  "input_b": {
                    "display_name": "Hello world",
                    "type": "text",
                  },
                },
              },
              "outputs": {
                "variables": {},
              },
              "tasks": [
                {
                  "display_name": "Task 1",
                  "name": "task1",
                  "variables": {
                    "output_a": {
                      "display_name": "output_a",
                      "type": "text",
                    },
                  },
                },
              ],
            },
          }
        `);
      });

      it('state_task first task', () => {
        const edges = [{ source: 'state_1', target: 'state_2' }];
        const scopes = scopesSchema.parse({
          scopes: {
            context: {
              variables: {
                global_a: { type: 'text', display_name: 'Hello world' },
              },
            },
            edges: edges,
            states: {
              state_1: {
                name: 'state_1',
                display_name: 'State#1',
                children: {
                  inputs: { variables: {} },
                  tasks: [],
                  outputs: {
                    variables: {
                      output_a: { type: 'text', display_name: 'Hello world' },
                    },
                    render: { buttons: {} },
                  },
                },
              },
              state_2: {
                name: 'state_2',
                display_name: 'State#2',
                children: {
                  inputs: {
                    variables: {
                      input_b: { type: 'text', display_name: 'Hello world' },
                    },
                  },
                  tasks: [
                    {
                      name: 'task1',
                      display_name: 'Task 1',
                      variables: {
                        output_a: { type: 'text', display_name: 'Hello world' },
                      },
                    },
                    {
                      name: 'task2',
                      display_name: 'Task 2',
                      variables: {},
                    },
                  ],
                  outputs: {
                    variables: {
                      output_b: { type: 'text', display_name: 'Hello world' },
                    },
                    render: { buttons: {} },
                  },
                },
              },
            },
          },
        });
        const options = getRefOptions(
          scopes,
          // edges,
          'state_2',
          'state_task',
          'task1',
        );
        expect(options).toMatchInlineSnapshot(`
          {
            "global": {
              "context": {
                "global_a": {
                  "display_name": "Hello world",
                  "type": "text",
                },
              },
              "state_1": {
                "output_a": {
                  "display_name": "Hello world",
                  "type": "text",
                },
              },
            },
            "local": {
              "buttons": {},
              "inputs": {
                "variables": {
                  "input_b": {
                    "display_name": "Hello world",
                    "type": "text",
                  },
                },
              },
              "outputs": {
                "variables": {},
              },
              "tasks": [],
            },
          }
        `);
      });
    });

    it('state_output', () => {
      const edges = [{ source: 'state_1', target: 'state_2' }];
      const scopes = scopesSchema.parse({
        scopes: {
          context: {
            variables: {
              global_a: { type: 'text', display_name: 'Hello world' },
            },
          },
          edges: edges,
          states: {
            state_1: {
              name: 'state_1',
              display_name: 'State#1',
              children: {
                inputs: { variables: {} },
                tasks: [],
                outputs: {
                  variables: {
                    output_a: { type: 'text', display_name: 'Hello world' },
                  },
                  render: { buttons: {} },
                },
              },
            },
            state_2: {
              name: 'state_2',
              display_name: 'State#2',
              children: {
                inputs: {
                  variables: {
                    input_b: { type: 'text', display_name: 'Hello world' },
                  },
                },
                tasks: [
                  {
                    name: 'task1',
                    display_name: 'Task 1',
                    variables: {
                      output_a: { type: 'text', display_name: 'Hello world' },
                    },
                  },
                  {
                    name: 'task2',
                    display_name: 'Task 2',
                    variables: {
                      output_a: { type: 'text', display_name: 'Hello world' },
                    },
                  },
                ],
                outputs: {
                  variables: {
                    output_b: { type: 'text', display_name: 'Hello world' },
                  },
                  render: { buttons: {} },
                },
              },
            },
          },
        },
      });
      const options = getRefOptions(scopes, 'state_2', 'state_output');
      expect(options).toMatchInlineSnapshot(`
        {
          "global": {
            "context": {
              "global_a": {
                "display_name": "Hello world",
                "type": "text",
              },
            },
            "state_1": {
              "output_a": {
                "display_name": "Hello world",
                "type": "text",
              },
            },
          },
          "local": {
            "buttons": {},
            "inputs": {
              "variables": {
                "input_b": {
                  "display_name": "Hello world",
                  "type": "text",
                },
              },
            },
            "outputs": {
              "variables": {},
            },
            "tasks": [
              {
                "display_name": "Task 1",
                "name": "task1",
                "variables": {
                  "output_a": {
                    "display_name": "Hello world",
                    "type": "text",
                  },
                },
              },
              {
                "display_name": "Task 2",
                "name": "task2",
                "variables": {
                  "output_a": {
                    "display_name": "Hello world",
                    "type": "text",
                  },
                },
              },
            ],
          },
        }
      `);
    });

    it('state_render', () => {
      const edges = [{ source: 'state_1', target: 'state_2' }];
      const scopes = scopesSchema.parse({
        scopes: {
          context: {
            variables: {
              global_a: { type: 'text', display_name: 'Hello world' },
            },
          },
          edges: edges,
          states: {
            state_1: {
              display_name: 'State#1',
              name: 'state_1',
              children: {
                inputs: { variables: {} },
                tasks: [],
                outputs: {
                  variables: {
                    output_a: { type: 'text', display_name: 'Hello world' },
                  },
                  render: { buttons: {} },
                },
              },
            },
            state_2: {
              name: 'state_2',
              display_name: 'State#2',
              children: {
                inputs: {
                  variables: {
                    input_b: { type: 'text', display_name: 'Hello world' },
                  },
                },
                tasks: [
                  {
                    name: 'task1',
                    display_name: 'Task 1',
                    variables: {
                      output_a: { type: 'text', display_name: 'Hello world' },
                    },
                  },
                  {
                    name: 'task2',
                    display_name: 'Task 2',
                    variables: {
                      output_a: { type: 'text', display_name: 'Hello world' },
                    },
                  },
                ],
                outputs: {
                  variables: {
                    output_b: { type: 'text', display_name: 'Hello world' },
                  },
                  render: { buttons: {} },
                },
              },
            },
          },
        },
      });
      const options = getRefOptions(scopes, 'state_2', 'state_render');
      expect(options).toMatchInlineSnapshot(`
        {
          "global": {
            "context": {
              "global_a": {
                "display_name": "Hello world",
                "type": "text",
              },
            },
            "state_1": {
              "output_a": {
                "display_name": "Hello world",
                "type": "text",
              },
            },
          },
          "local": {
            "buttons": {},
            "inputs": {
              "variables": {
                "input_b": {
                  "display_name": "Hello world",
                  "type": "text",
                },
              },
            },
            "outputs": {
              "variables": {
                "output_b": {
                  "display_name": "Hello world",
                  "type": "text",
                },
              },
            },
            "tasks": [
              {
                "display_name": "Task 1",
                "name": "task1",
                "variables": {
                  "output_a": {
                    "display_name": "Hello world",
                    "type": "text",
                  },
                },
              },
              {
                "display_name": "Task 2",
                "name": "task2",
                "variables": {
                  "output_a": {
                    "display_name": "Hello world",
                    "type": "text",
                  },
                },
              },
            ],
          },
        }
      `);
    });

    it('target_input', () => {
      const edges = [{ source: 'state_1', target: 'state_2' }];
      const scopes = scopesSchema.parse({
        scopes: {
          context: {
            variables: {
              global_a: { type: 'text', display_name: 'Hello world' },
            },
          },
          edges: edges,
          states: {
            state_1: {
              name: 'state_1',
              display_name: 'State#1',
              children: {
                inputs: { variables: {} },
                tasks: [],
                outputs: {
                  variables: {
                    output_a: { type: 'text', display_name: 'Hello world' },
                  },
                  render: { buttons: {} },
                },
              },
            },
            state_2: {
              name: 'state_2',
              display_name: 'State#2',
              children: {
                inputs: {
                  variables: {
                    input_b: { type: 'text', display_name: 'Hello world' },
                  },
                },
                tasks: [
                  {
                    name: 'task1',
                    display_name: 'Task 1',
                    variables: {
                      output_a: { type: 'text', display_name: 'Hello world' },
                    },
                  },
                  {
                    name: 'task2',
                    display_name: 'Task 2',
                    variables: {
                      output_a: { type: 'text', display_name: 'Hello world' },
                    },
                  },
                ],
                outputs: {
                  variables: {
                    output_b: { type: 'text', display_name: 'Hello world' },
                  },
                  render: {
                    buttons: {
                      button_a: {
                        event: 'button_a.on_click',
                        payload: {
                          input_b: {
                            type: 'text',
                            display_name: 'Hello world',
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      });
      const options = getRefOptions(scopes, 'state_2', 'target_input');
      expect(options).toMatchInlineSnapshot(`
        {
          "global": {
            "context": {
              "global_a": {
                "display_name": "Hello world",
                "type": "text",
              },
            },
            "state_1": {
              "output_a": {
                "display_name": "Hello world",
                "type": "text",
              },
            },
          },
          "local": {
            "buttons": {
              "button_a": {
                "event": "button_a.on_click",
                "payload": {
                  "input_b": {
                    "display_name": "Hello world",
                    "type": "text",
                  },
                },
              },
            },
            "inputs": {
              "variables": {
                "input_b": {
                  "display_name": "Hello world",
                  "type": "text",
                },
              },
            },
            "outputs": {
              "variables": {
                "output_b": {
                  "display_name": "Hello world",
                  "type": "text",
                },
              },
            },
            "tasks": [
              {
                "display_name": "Task 1",
                "name": "task1",
                "variables": {
                  "output_a": {
                    "display_name": "Hello world",
                    "type": "text",
                  },
                },
              },
              {
                "display_name": "Task 2",
                "name": "task2",
                "variables": {
                  "output_a": {
                    "display_name": "Hello world",
                    "type": "text",
                  },
                },
              },
            ],
          },
        }
      `);
    });
  });

  describe('refs', () => {
    // 被引用对象
    it('rename referenced key', () => {
      const refs = {
        'state_1.outputs.outputs1-1': 'context.global_111',
        'state_1.outputs.outputs21': 'context.global_111',
        'state_2.message.text': 'state_1.outputs.output1',
      };

      const ret = renameRefKey(
        refs,
        'state_1.outputs.outputs1-1',
        'state_1.outputs.outputs1',
      );

      expect(ret).toMatchInlineSnapshot(`
        {
          "state_1.outputs.outputs1": "context.global_111",
          "state_1.outputs.outputs21": "context.global_111",
          "state_2.message.text": "state_1.outputs.output1",
        }
      `);
    });

    it('update referenced value', () => {
      const refs = {
        'state_1.outputs.outputs1-1': 'context.global_111',
        'state_1.outputs.outputs21': 'context.global_111',
        'state_2.message.text': 'state_1.outputs.output1',
      };

      const ret = updateRefValue(
        refs,
        'state_1.outputs.outputs1-1',
        'context.global_a',
      );
      expect(ret).toMatchInlineSnapshot(`
        {
          "state_1.outputs.outputs1-1": "context.global_a",
          "state_1.outputs.outputs21": "context.global_111",
          "state_2.message.text": "state_1.outputs.output1",
        }
      `);
    });

    it('rename refer', () => {
      const refs = {
        'state_1.outputs.outputs1-1': 'context.global_111',
        'state_1.outputs.outputs21': 'context.global_111',
        'state_2.message.text': 'state_1.outputs.output1',
      };

      const ret = renameRefer(refs, 'context.global_111', 'context.global.a');
      expect(ret).toMatchInlineSnapshot(`
        {
          "state_1.outputs.outputs1-1": "context.global.a",
          "state_1.outputs.outputs21": "context.global.a",
          "state_2.message.text": "state_1.outputs.output1",
        }
      `);
    });
  });
});
