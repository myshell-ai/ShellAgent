import { scopesSchema, stateSchema } from './protocol';
import {
  deleteRefer,
  findAncestors,
  getRefOptions,
  renameNodedataKey,
  changeNodedataKeyMode,
  setNodedataKeyVal,
  renameRefOpt,
  renameStateName,
  renameStateOutput,
  removeNodeKey,
  removeRefOpts,
  removeRefOptsPrefix,
} from './ref-util';
import { refsSchema } from './scope';

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
              "display_name": "Context",
              "variables": {
                "global_a": {
                  "display_name": "Hello world",
                  "type": "text",
                },
              },
            },
            "state_1": {
              "display_name": "State#1",
              "variables": {
                "output_a": {
                  "display_name": "Hello world",
                  "type": "text",
                },
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
          1,
        );
        expect(options).toMatchInlineSnapshot(`
          {
            "global": {
              "context": {
                "display_name": "Context",
                "variables": {
                  "global_a": {
                    "display_name": "Hello world",
                    "type": "text",
                  },
                },
              },
              "state_1": {
                "display_name": "State#1",
                "variables": {
                  "output_a": {
                    "display_name": "Hello world",
                    "type": "text",
                  },
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
          0,
        );
        expect(options).toMatchInlineSnapshot(`
          {
            "global": {
              "context": {
                "display_name": "Context",
                "variables": {
                  "global_a": {
                    "display_name": "Hello world",
                    "type": "text",
                  },
                },
              },
              "state_1": {
                "display_name": "State#1",
                "variables": {
                  "output_a": {
                    "display_name": "Hello world",
                    "type": "text",
                  },
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
              "display_name": "Context",
              "variables": {
                "global_a": {
                  "display_name": "Hello world",
                  "type": "text",
                },
              },
            },
            "state_1": {
              "display_name": "State#1",
              "variables": {
                "output_a": {
                  "display_name": "Hello world",
                  "type": "text",
                },
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
              "display_name": "Context",
              "variables": {
                "global_a": {
                  "display_name": "Hello world",
                  "type": "text",
                },
              },
            },
            "state_1": {
              "display_name": "State#1",
              "variables": {
                "output_a": {
                  "display_name": "Hello world",
                  "type": "text",
                },
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
      const options = getRefOptions(
        scopes,
        'state_2',
        'target_input',
        undefined,
        'button_a.on_click',
      );
      expect(options).toMatchInlineSnapshot(`
        {
          "global": {
            "context": {
              "display_name": "Context",
              "variables": {
                "global_a": {
                  "display_name": "Hello world",
                  "type": "text",
                },
              },
            },
            "state_1": {
              "display_name": "State#1",
              "variables": {
                "output_a": {
                  "display_name": "Hello world",
                  "type": "text",
                },
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
    it('rename nodedata key', () => {
      const refs = refsSchema.parse({
        state_1: {
          'outputs.outputs1-1': {
            ref: 'context.global_111',
          },
          'outputs.outputs21': {
            ref: 'context.global_111',
          },
        },
        state_2: {
          'message.text': {
            ref: 'state_1.outputs.output1',
          },
        },
        state_2_1: {
          // 'message.text': 'state_1.outputs.output1',
        },
      });

      const ret = renameNodedataKey(refs, {
        stateName: 'state_1',
        oldKey: 'outputs.outputs1-1',
        newKey: 'outputs.outputs1',
      });

      expect(ret).toMatchInlineSnapshot(`
        {
          "state_1": {
            "outputs.outputs1": {
              "ref": "context.global_111",
            },
            "outputs.outputs21": {
              "ref": "context.global_111",
            },
          },
          "state_2": {
            "message.text": {
              "ref": "state_1.outputs.output1",
            },
          },
          "state_2_1": {},
        }
      `);
    });

    describe('update ref value', () => {
      it('ref', () => {
        const refs = refsSchema.parse({
          state_1: {
            'outputs.outputs1-1': {
              ref: 'context.global_111',
              ui: [
                'context.global_111',
                'context.global_222',
                'context.global_111',
              ],
              raw: ['context.global_111', 'context.global_aaa'],
            },
            'outputs.outputs21': {
              ref: 'context.global_111',
            },
          },
          /*
            state_1 -> state_1_1
            output1 -> output12
          */
          state_2: {
            'message.text': {
              ref: 'state_1.output1',
            },
          },
        });

        const ret = setNodedataKeyVal(refs, {
          stateName: 'state_1',
          key: 'outputs.outputs1-1',
          newValue: 'context.global_a',
          mode: 'ref',
          origVal: 'context.global_111',
        });
        expect(ret).toMatchInlineSnapshot(`
          {
            "state_1": {
              "outputs.outputs1-1": {
                "ref": "context.global_a",
              },
              "outputs.outputs21": {
                "ref": "context.global_111",
              },
            },
            "state_2": {
              "message.text": {
                "ref": "state_1.output1",
              },
            },
          }
        `);
      });

      it('ui', () => {
        const refs = refsSchema.parse({
          state_1: {
            'outputs.outputs1-1': {
              ref: 'context.global_111',
              ui: [
                'context.global_111',
                'context.global_222',
                'context.global_111',
              ],
              raw: ['context.global_111', 'context.global_aaa'],
            },
            'outputs.outputs21': {
              ref: 'context.global_111',
            },
          },
          state_2: {
            'message.text': {
              ref: 'state_1.outputs.output1',
            },
          },
        });

        const ret = setNodedataKeyVal(refs, {
          stateName: 'state_1',
          key: 'outputs.outputs1-1',
          newValue: 'context.global_a',
          mode: 'ui',
          origVal: 'context.global_111',
        });
        expect(ret).toMatchInlineSnapshot(`
          {
            "state_1": {
              "outputs.outputs1-1": {
                "ui": [
                  "context.global_a",
                  "context.global_222",
                  "context.global_a",
                ],
              },
              "outputs.outputs21": {},
            },
            "state_2": {
              "message.text": {
                "ref": "state_1.outputs.output1",
              },
            },
          }
        `);
      });
    });

    it('rename ref opt', () => {
      const refs = refsSchema.parse({
        state_2: {
          'outputs.output1': {
            ref: 'state_1.output1',
          },
          'message.text': {
            ui: ['state_1.output1', 'state_1.output2'],
          },
          'message.image': {
            raw: ['context.global_a', 'state_1.output1'],
          },
        },
      });
      const ret = renameRefOpt(refs, {
        oldPath: 'state_1.output1',
        newPath: 'state_1.output_a',
      });
      expect(ret).toMatchInlineSnapshot(`
        {
          "state_2": {
            "message.image": {
              "raw": [
                "context.global_a",
                "state_1.output_a",
              ],
            },
            "message.text": {
              "ui": [
                "state_1.output_a",
                "state_1.output2",
              ],
            },
            "outputs.output1": {
              "ref": "state_1.output_a",
            },
          },
        }
      `);
    });

    it('rename state name', () => {
      const refs = refsSchema.parse({
        state_2: {
          'outputs.output1': {
            ref: 'state_1.output1',
          },
          'message.text': {
            ui: ['state_1.output1', 'state_1.output2'],
          },
          'message.image': {
            raw: ['context.global_a', 'state_1.output1'],
          },
        },
      });

      const ret = renameStateName(refs, {
        oldName: 'state_1',
        newName: 'state_1_1',
      });
      expect(ret).toMatchInlineSnapshot(`
        {
          "state_2": {
            "message.image": {
              "raw": [
                "context.global_a",
                "state_1_1.output1",
              ],
            },
            "message.text": {
              "ui": [
                "state_1_1.output1",
                "state_1_1.output2",
              ],
            },
            "outputs.output1": {
              "ref": "state_1_1.output1",
            },
          },
        }
      `);
    });

    it('rename state output', () => {
      const refs = refsSchema.parse({
        state_2: {
          'outputs.output1': {
            ref: 'state_1.output1',
          },
          'message.text': {
            ui: ['state_1.output1', 'state_1.output2'],
          },
          'message.image': {
            raw: ['context.global_a', 'state_1.output1'],
          },
        },
      });

      const ret = renameStateOutput(refs, {
        stateName: 'state_1',
        oldOutputName: 'output1',
        newOutputName: 'output_a',
      });
      expect(ret).toMatchInlineSnapshot(`
        {
          "state_2": {
            "message.image": {
              "raw": [
                "context.global_a",
                "state_1.output_a",
              ],
            },
            "message.text": {
              "ui": [
                "state_1.output_a",
                "state_1.output2",
              ],
            },
            "outputs.output1": {
              "ref": "state_1.output_a",
            },
          },
        }
      `);
    });

    it('delete refer', () => {
      const refs = refsSchema.parse({
        state_1: {
          'outputs.outputs1-1': {
            ref: 'context.global_111',
            ui: [
              'context.global_111',
              'context.global_222',
              'context.global_111',
            ],
            raw: ['context.global_111'],
          },
          'outputs.outputs21': {
            ref: 'context.global_111',
          },
        },
        state_2: {
          'message.text': {
            ref: 'state_1.outputs.output1',
          },
        },
      });

      const ret = deleteRefer(refs, 'state_1', 'context.global_111');

      expect(ret).toMatchInlineSnapshot(`
        {
          "state_1": {
            "outputs.outputs1-1": {
              "ui": [
                "context.global_222",
              ],
            },
            "outputs.outputs21": {},
          },
          "state_2": {
            "message.text": {
              "ref": "state_1.outputs.output1",
            },
          },
        }
      `);
    });

    it('change nodedata key mode', () => {
      const refs = refsSchema.parse({
        state_1: {
          'outputs.outputs1-1': {
            ref: 'context.global_111',
            ui: [
              'context.global_111',
              'context.global_222',
              'context.global_111',
            ],
            raw: ['context.global_111'],
          },
          'outputs.outputs21': {
            ref: 'context.global_111',
          },
        },
        state_2: {
          'message.text': {
            ref: 'state_1.outputs.output1',
          },
        },
      });

      const rets = changeNodedataKeyMode(refs, {
        stateName: 'state_1',
        key: 'outputs.outputs1-1',
        mode: 'raw',
      });

      expect(rets).toMatchInlineSnapshot(`
        {
          "state_1": {
            "outputs.outputs1-1": {
              "raw": [
                "context.global_111",
              ],
            },
            "outputs.outputs21": {
              "ref": "context.global_111",
            },
          },
          "state_2": {
            "message.text": {
              "ref": "state_1.outputs.output1",
            },
          },
        }
      `);
    });

    it('remove node key', () => {
      const refs = refsSchema.parse({
        state_2: {
          'outputs.output1': {
            ref: 'state_1.output1',
          },
          'message.text': {
            ui: ['state_1.output1', 'state_1.output2'],
          },
          'message.image': {
            raw: ['context.global_a', 'state_1.output1'],
          },
        },
      });
      const ret = removeNodeKey(refs, {
        stateName: 'state_2',
        key: 'outputs.output1',
      });

      expect(ret).toMatchInlineSnapshot(`
        {
          "state_2": {
            "message.image": {
              "raw": [
                "context.global_a",
                "state_1.output1",
              ],
            },
            "message.text": {
              "ui": [
                "state_1.output1",
                "state_1.output2",
              ],
            },
          },
        }
      `);
    });

    it('remove ref opt', () => {
      const refs = refsSchema.parse({
        state_1: {
          'inputs.arg1': {
            ref: 'context.global_a',
          },
          'outputs.arg1': {
            ref: 'state_1.inputs.input_a',
          },
          'render.buttons.button_a.on_click.payload.arg1': {
            ref: 'state_1.inputs.input_a',
          },
          'render.message.text': {
            ui: ['outputs.output1', 'state_0.outputs.output2'],
          },
          'render.message.image': {
            raw: [
              'context.global_a',
              'state_1.buttons.button_a.on_click.payload.arg1',
            ],
          },
        },
      });

      const ret = removeRefOpts(refs, {
        paths: ['context.global_a', 'state_1.inputs.input_a'],
      });

      expect(ret).toMatchInlineSnapshot(`
        {
          "state_1": {
            "render.message.image": {
              "raw": [
                "state_1.buttons.button_a.on_click.payload.arg1",
              ],
            },
            "render.message.text": {
              "ui": [
                "outputs.output1",
                "state_0.outputs.output2",
              ],
            },
          },
        }
      `);
    });

    it('remove button', () => {
      const refs = refsSchema.parse({
        state_1: {
          'target_inputs.input_a': {
            ref: 'state_1.buttons.button_a.on_click.payload.arg1',
            ui: [
              'state_1.buttons.button_b.on_click.payload.arg1',
              'state_1.buttons.button_a.on_click.payload.arg3',
            ],
            raw: [
              'state_1.buttons.button_a.on_click.payload.arg1',
              'state_1.buttons.button_c.on_click.payload.arg2',
            ],
          },
        },
      });

      const ret = removeRefOptsPrefix(refs, {
        prefix: 'state_1.buttons.button_a.on_click',
      });

      expect(ret).toMatchInlineSnapshot(`
        {
          "state_1": {
            "target_inputs.input_a": {
              "raw": [
                "state_1.buttons.button_c.on_click.payload.arg2",
              ],
              "ui": [
                "state_1.buttons.button_b.on_click.payload.arg1",
              ],
            },
          },
        }
      `);
    });
  });
});
