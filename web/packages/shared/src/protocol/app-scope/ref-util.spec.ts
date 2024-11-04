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
        { source: 'state#1', target: 'state#2' },
        { source: 'state#0', target: 'state#1' },
      ];
      expect(findAncestors(edges, 'state#2')).toMatchInlineSnapshot(`
        [
          "state#1",
          "state#0",
        ]
      `);
    });

    it('ancestors - complex case', () => {
      /*
state#0
  |
  v
state#1     state#5
  |           |
  v           v
state#2 <-- state#4
  ^
  |
state#3
      */
      const edges = [
        { source: 'state#1', target: 'state#2' },
        { source: 'state#0', target: 'state#1' },
        { source: 'state#3', target: 'state#2' },
        { source: 'state#4', target: 'state#3' },
        { source: 'state#5', target: 'state#4' },
      ];
      expect(findAncestors(edges, 'state#2')).toMatchInlineSnapshot(`
        [
          "state#1",
          "state#0",
          "state#3",
          "state#4",
          "state#5",
        ]
      `);
    });

    it('ancestors - no ancestors', () => {
      const edges = [
        { source: 'state#1', target: 'state#2' },
        { source: 'state#0', target: 'state#1' },
      ];
      expect(findAncestors(edges, 'state#0')).toMatchInlineSnapshot(`[]`);
    });

    it('ancestors - disconnected graph', () => {
      const edges = [
        { source: 'state#1', target: 'state#2' },
        { source: 'state#3', target: 'state#4' },
      ];
      expect(findAncestors(edges, 'state#4')).toMatchInlineSnapshot(`
        [
          "state#3",
        ]
      `);
    });

    /*
state#1
  |
  v
state#2
  |
  v
state#3
  |
  └───> (back to state#1)
    */
    it('ancestors - circular dependency', () => {
      const edges = [
        { source: 'state#1', target: 'state#2' },
        { source: 'state#2', target: 'state#3' },
        { source: 'state#3', target: 'state#1' }, // Circular dependency
      ];
      expect(findAncestors(edges, 'state#3')).toMatchInlineSnapshot(`
        [
          "state#2",
          "state#1",
          "state#3",
        ]
      `);
    });
  });

  describe('get ref options', () => {
    it('state_input', () => {
      const edges = [{ source: 'state#1', target: 'state#2' }];

      const scopes = scopesSchema.parse({
        scopes: {
          context: {
            variables: {
              global_a: { type: 'text' },
            },
          },
          edges: [],
          states: {
            'state#1': {
              name: 'state#1',
              children: {
                inputs: { variables: { input_a: { type: 'text' } } },
                tasks: [
                  { name: 'task1', variables: {} },
                  { name: 'task2', variables: {} },
                ],
                outputs: {
                  variables: { output_a: { type: 'text' } },
                  render: { buttons: {} },
                },
              },
            },
            'state#2': {
              name: 'state#2',
              children: {
                inputs: {
                  variables: {},
                },
                tasks: [],
                outputs: {
                  variables: { output_b: { type: 'text' } },
                  render: { buttons: {} },
                },
              },
            },
          },
        },
      });

      const options = getRefOptions(scopes, edges, 'state#2', 'state_input');

      expect(options).toMatchInlineSnapshot(`
        {
          "global": {
            "context": {
              "global_a": {
                "type": "text",
              },
            },
            "state#1": {
              "output_a": {
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
        const edges = [{ source: 'state#1', target: 'state#2' }];
        const scopes = scopesSchema.parse({
          scopes: {
            context: {
              variables: {
                global_a: { type: 'text' },
              },
            },
            edges: [],
            states: {
              'state#1': {
                name: 'state#1',
                children: {
                  inputs: { variables: {} },
                  tasks: [],
                  outputs: {
                    variables: { output_a: { type: 'text' } },
                    render: { buttons: {} },
                  },
                },
              },
              'state#2': {
                name: 'state#2',
                children: {
                  inputs: {
                    variables: {
                      input_b: { type: 'text' },
                    },
                  },
                  tasks: [
                    {
                      name: 'task1',
                      variables: {
                        output_a: { type: 'text' },
                      },
                    },
                    { name: 'task2', variables: {} },
                  ],
                  outputs: {
                    variables: { output_b: { type: 'text' } },
                    render: { buttons: {} },
                  },
                },
              },
            },
          },
        });
        const options = getRefOptions(
          scopes,
          edges,
          'state#2',
          'state_task',
          'task2',
        );
        expect(options).toMatchInlineSnapshot(`
          {
            "global": {
              "context": {
                "global_a": {
                  "type": "text",
                },
              },
              "state#1": {
                "output_a": {
                  "type": "text",
                },
              },
            },
            "local": {
              "buttons": {},
              "inputs": {
                "variables": {
                  "input_b": {
                    "type": "text",
                  },
                },
              },
              "outputs": {
                "variables": {},
              },
              "tasks": [
                {
                  "name": "task1",
                  "variables": {
                    "output_a": {
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
        const edges = [{ source: 'state#1', target: 'state#2' }];
        const scopes = scopesSchema.parse({
          scopes: {
            context: {
              variables: {
                global_a: { type: 'text' },
              },
            },
            edges: [],
            states: {
              'state#1': {
                name: 'state#1',
                children: {
                  inputs: { variables: {} },
                  tasks: [],
                  outputs: {
                    variables: { output_a: { type: 'text' } },
                    render: { buttons: {} },
                  },
                },
              },
              'state#2': {
                name: 'state#2',
                children: {
                  inputs: {
                    variables: {
                      input_b: { type: 'text' },
                    },
                  },
                  tasks: [
                    {
                      name: 'task1',
                      variables: {
                        output_a: { type: 'text' },
                      },
                    },
                    { name: 'task2', variables: {} },
                  ],
                  outputs: {
                    variables: { output_b: { type: 'text' } },
                    render: { buttons: {} },
                  },
                },
              },
            },
          },
        });
        const options = getRefOptions(
          scopes,
          edges,
          'state#2',
          'state_task',
          'task1',
        );
        expect(options).toMatchInlineSnapshot(`
          {
            "global": {
              "context": {
                "global_a": {
                  "type": "text",
                },
              },
              "state#1": {
                "output_a": {
                  "type": "text",
                },
              },
            },
            "local": {
              "buttons": {},
              "inputs": {
                "variables": {
                  "input_b": {
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
      const edges = [{ source: 'state#1', target: 'state#2' }];
      const scopes = scopesSchema.parse({
        scopes: {
          context: {
            variables: {
              global_a: { type: 'text' },
            },
          },
          edges: [],
          states: {
            'state#1': {
              name: 'state#1',
              children: {
                inputs: { variables: {} },
                tasks: [],
                outputs: {
                  variables: { output_a: { type: 'text' } },
                  render: { buttons: {} },
                },
              },
            },
            'state#2': {
              name: 'state#2',
              children: {
                inputs: {
                  variables: {
                    input_b: { type: 'text' },
                  },
                },
                tasks: [
                  {
                    name: 'task1',
                    variables: {
                      output_a: { type: 'text' },
                    },
                  },
                  {
                    name: 'task2',
                    variables: {
                      output_a: { type: 'text' },
                    },
                  },
                ],
                outputs: {
                  variables: { output_b: { type: 'text' } },
                  render: { buttons: {} },
                },
              },
            },
          },
        },
      });
      const options = getRefOptions(scopes, edges, 'state#2', 'state_output');
      expect(options).toMatchInlineSnapshot(`
        {
          "global": {
            "context": {
              "global_a": {
                "type": "text",
              },
            },
            "state#1": {
              "output_a": {
                "type": "text",
              },
            },
          },
          "local": {
            "buttons": {},
            "inputs": {
              "variables": {
                "input_b": {
                  "type": "text",
                },
              },
            },
            "outputs": {
              "variables": {},
            },
            "tasks": [
              {
                "name": "task1",
                "variables": {
                  "output_a": {
                    "type": "text",
                  },
                },
              },
              {
                "name": "task2",
                "variables": {
                  "output_a": {
                    "type": "text",
                  },
                },
              },
            ],
          },
        }
      `);
    });

    it('state_output_key', () => {
      const edges = [{ source: 'state#1', target: 'state#2' }];
      const scopes = scopesSchema.parse({
        scopes: {
          context: {
            variables: {
              global_a: { type: 'text' },
            },
          },
          edges: [],
          states: {
            'state#1': {
              name: 'state#1',
              children: {
                inputs: { variables: {} },
                tasks: [],
                outputs: {
                  variables: {},
                  render: { buttons: {} },
                },
              },
            },
            'state#2': {
              name: 'state#2',
              children: {
                inputs: {
                  variables: {},
                },
                tasks: [],
                outputs: {
                  variables: {},
                  render: { buttons: {} },
                },
              },
            },
          },
        },
      });
      const options = getRefOptions(
        scopes,
        edges,
        'state#2',
        'state_output_key',
      );
      expect(options).toMatchInlineSnapshot(`
        {
          "global": {
            "context": {
              "global_a": {
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

    it('state_render', () => {
      const edges = [{ source: 'state#1', target: 'state#2' }];
      const scopes = scopesSchema.parse({
        scopes: {
          context: {
            variables: {
              global_a: { type: 'text' },
            },
          },
          edges: [],
          states: {
            'state#1': {
              name: 'state#1',
              children: {
                inputs: { variables: {} },
                tasks: [],
                outputs: {
                  variables: { output_a: { type: 'text' } },
                  render: { buttons: {} },
                },
              },
            },
            'state#2': {
              name: 'state#2',
              children: {
                inputs: {
                  variables: {
                    input_b: { type: 'text' },
                  },
                },
                tasks: [
                  {
                    name: 'task1',
                    variables: {
                      output_a: { type: 'text' },
                    },
                  },
                  {
                    name: 'task2',
                    variables: {
                      output_a: { type: 'text' },
                    },
                  },
                ],
                outputs: {
                  variables: { output_b: { type: 'text' } },
                  render: { buttons: {} },
                },
              },
            },
          },
        },
      });
      const options = getRefOptions(scopes, edges, 'state#2', 'state_render');
      expect(options).toMatchInlineSnapshot(`
        {
          "global": {
            "context": {
              "global_a": {
                "type": "text",
              },
            },
            "state#1": {
              "output_a": {
                "type": "text",
              },
            },
          },
          "local": {
            "buttons": {},
            "inputs": {
              "variables": {
                "input_b": {
                  "type": "text",
                },
              },
            },
            "outputs": {
              "variables": {
                "output_b": {
                  "type": "text",
                },
              },
            },
            "tasks": [
              {
                "name": "task1",
                "variables": {
                  "output_a": {
                    "type": "text",
                  },
                },
              },
              {
                "name": "task2",
                "variables": {
                  "output_a": {
                    "type": "text",
                  },
                },
              },
            ],
          },
        }
      `);
    });

    it('button_payload', () => {
      const edges = [{ source: 'state#1', target: 'state#2' }];
      const scopes = scopesSchema.parse({
        scopes: {
          context: {
            variables: {
              global_a: { type: 'text' },
            },
          },
          edges: [],
          states: {
            'state#1': {
              name: 'state#1',
              children: {
                inputs: { variables: {} },
                tasks: [],
                outputs: {
                  variables: { output_a: { type: 'text' } },
                  render: { buttons: {} },
                },
              },
            },
            'state#2': {
              name: 'state#2',
              children: {
                inputs: {
                  variables: {
                    input_b: { type: 'text' },
                  },
                },
                tasks: [
                  {
                    name: 'task1',
                    variables: {
                      output_a: { type: 'text' },
                    },
                  },
                  {
                    name: 'task2',
                    variables: {
                      output_a: { type: 'text' },
                    },
                  },
                ],
                outputs: {
                  variables: { output_b: { type: 'text' } },
                  render: { buttons: {} },
                },
              },
            },
          },
        },
      });
      const options = getRefOptions(scopes, edges, 'state#2', 'button_payload');
      expect(options).toMatchInlineSnapshot(`
        {
          "global": {
            "context": {
              "global_a": {
                "type": "text",
              },
            },
            "state#1": {
              "output_a": {
                "type": "text",
              },
            },
          },
          "local": {
            "buttons": {},
            "inputs": {
              "variables": {
                "input_b": {
                  "type": "text",
                },
              },
            },
            "outputs": {
              "variables": {
                "output_b": {
                  "type": "text",
                },
              },
            },
            "tasks": [
              {
                "name": "task1",
                "variables": {
                  "output_a": {
                    "type": "text",
                  },
                },
              },
              {
                "name": "task2",
                "variables": {
                  "output_a": {
                    "type": "text",
                  },
                },
              },
            ],
          },
        }
      `);
    });

    it('button_payload_key', () => {
      const edges = [{ source: 'state#1', target: 'state#2' }];
      const scopes = scopesSchema.parse({
        scopes: {
          context: {
            variables: {
              global_a: { type: 'text' },
            },
          },
          edges: [],
          states: {
            'state#1': {
              name: 'state#1',
              children: {
                inputs: { variables: {} },
                tasks: [],
                outputs: {
                  variables: { output_a: { type: 'text' } },
                  render: { buttons: {} },
                },
              },
            },
            'state#2': {
              name: 'state#2',
              children: {
                inputs: {
                  variables: {
                    input_b: { type: 'text' },
                  },
                },
                tasks: [
                  {
                    name: 'task1',
                    variables: {
                      output_a: { type: 'text' },
                    },
                  },
                  {
                    name: 'task2',
                    variables: {
                      output_a: { type: 'text' },
                    },
                  },
                ],
                outputs: {
                  variables: { output_b: { type: 'text' } },
                  render: { buttons: {} },
                },
              },
            },
          },
        },
      });
      const options = getRefOptions(
        scopes,
        edges,
        'state#2',
        'button_payload_key',
      );
      expect(options).toMatchInlineSnapshot(`
        {
          "global": {
            "context": {
              "global_a": {
                "type": "text",
              },
            },
            "state#1": {
              "output_a": {
                "type": "text",
              },
            },
          },
          "local": {
            "buttons": {},
            "inputs": {
              "variables": {
                "input_b": {
                  "type": "text",
                },
              },
            },
            "outputs": {
              "variables": {
                "output_b": {
                  "type": "text",
                },
              },
            },
            "tasks": [
              {
                "name": "task1",
                "variables": {
                  "output_a": {
                    "type": "text",
                  },
                },
              },
              {
                "name": "task2",
                "variables": {
                  "output_a": {
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
      const edges = [{ source: 'state#1', target: 'state#2' }];
      const scopes = scopesSchema.parse({
        scopes: {
          context: {
            variables: {
              global_a: { type: 'text' },
            },
          },
          edges: [],
          states: {
            'state#1': {
              name: 'state#1',
              children: {
                inputs: { variables: {} },
                tasks: [],
                outputs: {
                  variables: { output_a: { type: 'text' } },
                  render: { buttons: {} },
                },
              },
            },
            'state#2': {
              name: 'state#2',
              children: {
                inputs: {
                  variables: {
                    input_b: { type: 'text' },
                  },
                },
                tasks: [
                  {
                    name: 'task1',
                    variables: {
                      output_a: { type: 'text' },
                    },
                  },
                  {
                    name: 'task2',
                    variables: {
                      output_a: { type: 'text' },
                    },
                  },
                ],
                outputs: {
                  variables: { output_b: { type: 'text' } },
                  render: {
                    buttons: {
                      button_a: {
                        event: 'button_a.on_click',
                        payload: {
                          input_b: { type: 'text' },
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
      const options = getRefOptions(scopes, edges, 'state#2', 'target_input');
      expect(options).toMatchInlineSnapshot(`
        {
          "global": {
            "context": {
              "global_a": {
                "type": "text",
              },
            },
            "state#1": {
              "output_a": {
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
                    "type": "text",
                  },
                },
              },
            },
            "inputs": {
              "variables": {
                "input_b": {
                  "type": "text",
                },
              },
            },
            "outputs": {
              "variables": {
                "output_b": {
                  "type": "text",
                },
              },
            },
            "tasks": [
              {
                "name": "task1",
                "variables": {
                  "output_a": {
                    "type": "text",
                  },
                },
              },
              {
                "name": "task2",
                "variables": {
                  "output_a": {
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
        'state#1.outputs.outputs1-1': 'context.global_111',
        'state#1.outputs.outputs21': 'context.global_111',
        'state#2.message.text': 'state#1.outputs.output1',
      };

      const ret = renameRefKey(
        refs,
        'state#1.outputs.outputs1-1',
        'state#1.outputs.outputs1',
      );

      expect(ret).toMatchInlineSnapshot(`
        {
          "state#1.outputs.outputs1": "context.global_111",
          "state#1.outputs.outputs21": "context.global_111",
          "state#2.message.text": "state#1.outputs.output1",
        }
      `);
    });

    it('update referenced value', () => {
      const refs = {
        'state#1.outputs.outputs1-1': 'context.global_111',
        'state#1.outputs.outputs21': 'context.global_111',
        'state#2.message.text': 'state#1.outputs.output1',
      };

      const ret = updateRefValue(
        refs,
        'state#1.outputs.outputs1-1',
        'context.global_a',
      );
      expect(ret).toMatchInlineSnapshot(`
        {
          "state#1.outputs.outputs1-1": "context.global_a",
          "state#1.outputs.outputs21": "context.global_111",
          "state#2.message.text": "state#1.outputs.output1",
        }
      `);
    });

    it('rename refer', () => {
      const refs = {
        'state#1.outputs.outputs1-1': 'context.global_111',
        'state#1.outputs.outputs21': 'context.global_111',
        'state#2.message.text': 'state#1.outputs.output1',
      };

      const ret = renameRefer(refs, 'context.global_111', 'context.global.a');
      expect(ret).toMatchInlineSnapshot(`
        {
          "state#1.outputs.outputs1-1": "context.global.a",
          "state#1.outputs.outputs21": "context.global.a",
          "state#2.message.text": "state#1.outputs.output1",
        }
      `);
    });
  });
});
