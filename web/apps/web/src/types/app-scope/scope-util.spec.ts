import { scopesSchema, stateSchema } from '../../types/app-scope/protocol';
import { findAncestors, getRefOptions } from './scope-util';

describe('scope util', () => {
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
          "local": {},
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
              "inputs": {
                "input_b": {
                  "type": "text",
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
              "inputs": {
                "input_b": {
                  "type": "text",
                },
              },
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
            "inputs": {
              "input_b": {
                "type": "text",
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

    it('state_output_key', () => {
      const edges = [{ source: 'state#1', target: 'state#2' }];
      const scopes = scopesSchema.parse({
        scopes: {
          context: {
            variables: {
              global_a: { type: 'text' },
            },
          },
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
          "local": {},
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
            "inputs": {
              "input_b": {
                "type": "text",
              },
            },
            "outputs": {
              "output_b": {
                "type": "text",
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
            "inputs": {
              "input_b": {
                "type": "text",
              },
            },
            "outputs": {
              "output_b": {
                "type": "text",
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
            "inputs": {
              "input_b": {
                "type": "text",
              },
            },
            "outputs": {
              "output_b": {
                "type": "text",
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
                "payload": {
                  "input_b": {
                    "type": "text",
                  },
                },
              },
            },
            "inputs": {
              "input_b": {
                "type": "text",
              },
            },
            "outputs": {
              "output_b": {
                "type": "text",
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
});
