import { CustomKey } from '@shellagent/pro-config';
import { scopesSchema } from './protocol';
import {
  findAncestors,
  getRefOptions,
  changeNodedataKeyMode,
  setNodedataKeyVal,
  renameRefOpt,
  renameStateName,
  removeRefOpts,
  removeRefOptsPrefix,
  removeEdge,
  findDescendants,
  getBeforeAndAfterNodes,
  duplicateState,
  hanldeRefScene,
  removeEmptyLeaves,
  removeState,
  findMissingPrevious,
  reorderTasks,
} from './ref-util';
import { Edge, Edges, edgeSchema, edgesSchema, refsSchema } from './scope';

describe('ref util', () => {
  describe('find descendants', () => {
    it('descendants', () => {
      const edges = [
        { source: 'state_0', target: 'state_1' },
        { source: 'state_1', target: 'state_2' },
        { source: 'state_2', target: 'state_3' },
        { source: 'state_2', target: 'state_5' },
        { source: 'state_3', target: 'state_4' },
      ];
      expect(findDescendants(edges as Edges, 'state_2')).toMatchInlineSnapshot(`
        [
          "state_3",
          "state_4",
          "state_5",
        ]
      `);
    });
  });

  describe('find ancestors', () => {
    it('ancestors', () => {
      const edges = [
        { source: 'state_1', target: 'state_2' },
        { source: 'state#0', target: 'state_1' },
      ];
      expect(findAncestors(edges as Edges, 'state_2')).toMatchInlineSnapshot(`
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
      expect(findAncestors(edges as Edges, 'state_2')).toMatchInlineSnapshot(`
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
      expect(findAncestors(edges as Edges, 'state#0')).toMatchInlineSnapshot(
        `[]`,
      );
    });

    it('ancestors - disconnected graph', () => {
      const edges = [
        { source: 'state_1', target: 'state_2' },
        { source: 'state#3', target: 'state#4' },
      ];
      expect(findAncestors(edges as Edges, 'state#4')).toMatchInlineSnapshot(`
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
      expect(findAncestors(edges as Edges, 'state#3')).toMatchInlineSnapshot(`
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
            state_3: {
              name: 'state_3',
              display_name: 'State#3',
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
            "state_3": {
              "display_name": "State#3",
              "variables": {
                "output_b": {
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
        });
        expect(ret).toMatchInlineSnapshot(`
          {
            "state_1": {
              "outputs.outputs1-1": {
                "currentMode": "ref",
                "ref": "context.global_a",
              },
              "outputs.outputs21": {
                "currentMode": "ref",
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
          newValue: ['context.global_a'],
          mode: 'ui',
        });
        expect(ret).toMatchInlineSnapshot(`
          {
            "state_1": {
              "outputs.outputs1-1": {
                "currentMode": "ui",
                "ui": [
                  "context.global_a",
                ],
              },
              "outputs.outputs21": {
                "currentMode": "ui",
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
              "currentMode": "raw",
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

    it('remove ref opt', () => {
      const refs = refsSchema.parse({
        state_1: {
          'inputs.arg1': {
            ref: 'context.global_a',
          },
          'outputs.arg1': {
            ref: 'state_1.inputs.input_a',
          },
          // Hit Me!
          // custom snakecase 少了一个 display name form field []
          'render.buttons.u1234_hit_me.on_click.payload.arg1': {
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

    it('remove ref opts matches prefix, e.g. remove button, remove payload', () => {
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
        prefix: ['state_1.buttons.button_a.on_click'],
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

    it('get before and after nodes after edge removed', () => {
      const edges = edgesSchema.parse([
        { source: 'state_0', target: 'state_1' },
        { source: 'state_1', target: 'state_2' },
        { source: 'state_2', target: 'state_3' },
        { source: 'state_2', target: 'state_5' },
        { source: 'state_3', target: 'state_4' },
      ]);
      const toRemoveEdge = edgeSchema.parse({
        source: 'state_1',
        target: 'state_2',
      });

      const ret = getBeforeAndAfterNodes(edges, toRemoveEdge);
      expect(ret).toMatchInlineSnapshot(`
        {
          "after": [
            "state_3",
            "state_4",
            "state_5",
            "state_2",
          ],
          "before": [
            "state_0",
            "state_1",
          ],
        }
      `);
    });

    it('remove ref opts because of edges removed', () => {
      const refs = refsSchema.parse({
        state_3: {
          'target_inputs.input_a': {
            ref: 'state_0.outptu1',
            ui: ['state_0.outptu1', 'state_2.outptu2'],
            raw: ['state_1.outptu1', 'state_2.outptu2'],
          },
        },
        state_1: {
          'target_inputs.input_a': {
            ref: 'state_0.outptu1',
            ui: ['state_0.outptu1', 'state_2.outptu2'],
            raw: ['state_1.outptu1', 'state_2.outptu2'],
          },
        },
      });

      const ret = removeEdge(refs, {
        edges: [
          { source: 'state_0', target: 'state_1' },
          { source: 'state_1', target: 'state_2' },
          { source: 'state_2', target: 'state_3' },
          { source: 'state_2', target: 'state_5' },
          { source: 'state_3', target: 'state_4' },
        ],
        removeEdge: { source: 'state_1', target: 'state_2' },
      });

      expect(ret).toMatchInlineSnapshot(`
        {
          "state_1": {
            "target_inputs.input_a": {
              "raw": [
                "state_1.outptu1",
                "state_2.outptu2",
              ],
              "ref": "state_0.outptu1",
              "ui": [
                "state_0.outptu1",
                "state_2.outptu2",
              ],
            },
          },
          "state_3": {
            "target_inputs.input_a": {
              "raw": [
                "state_2.outptu2",
              ],
              "ui": [
                "state_2.outptu2",
              ],
            },
          },
        }
      `);
    });

    it('remove ref opts because of button removed', () => {
      const refs = refsSchema.parse({
        state_3: {
          'target_inputs.input_a': {
            ref: 'state_1.buttons.button_c.on_click.payload.arg2',
            ui: [
              'state_1.buttons.button_b.on_click.payload.arg2',
              'state_1.buttons.button_c.on_click.payload.arg2',
            ],
            raw: [
              'state_1.buttons.button_d.on_click.payload.arg2',
              'state_1.buttons.button_c.on_click.payload.arg2',
            ],
          },
        },
      });

      const ret = removeRefOptsPrefix(refs, {
        prefix: ['state_1.buttons.button_c.on_click'],
      });

      expect(ret).toMatchInlineSnapshot(`
        {
          "state_3": {
            "target_inputs.input_a": {
              "raw": [
                "state_1.buttons.button_d.on_click.payload.arg2",
              ],
              "ui": [
                "state_1.buttons.button_b.on_click.payload.arg2",
              ],
            },
          },
        }
      `);
    });

    it('remove ref opts because of task reordered', () => {
      const refs = refsSchema.parse({
        state_3: {
          'tasks.task_3': {
            ref: 'tasks.task_1.output_a',
            ui: ['tasks.task_2.output_a', 'tasks.task_1.output_a'],
            raw: ['tasks.task_1.output_a', 'tasks.task_1.output_a'],
          },
        },
      });

      const ret = removeRefOptsPrefix(refs, {
        prefix: ['tasks.task_2'],
      });

      expect(ret).toMatchInlineSnapshot(`
        {
          "state_3": {
            "tasks.task_3": {
              "raw": [
                "tasks.task_1.output_a",
                "tasks.task_1.output_a",
              ],
              "ref": "tasks.task_1.output_a",
              "ui": [
                "tasks.task_1.output_a",
              ],
            },
          },
        }
      `);
    });

    it('duplicate state', () => {
      const refs = refsSchema.parse({
        state_1: {
          'outputs.output1': {
            ref: 'state_1.inputs.input_a',
            ui: ['state_1.inputs.input_b', 'state_2.inputs.input_a'],
            raw: ['context.global_a', 'state_1.inputs.input_a'],
          },
        },
      });

      const ret = duplicateState(refs, {
        stateName: 'state_1',
        duplicateStateName: 'state_1_1',
      });

      expect(ret).toMatchInlineSnapshot(`
        {
          "state_1": {
            "outputs.output1": {
              "raw": [
                "context.global_a",
                "state_1.inputs.input_a",
              ],
              "ref": "state_1.inputs.input_a",
              "ui": [
                "state_1.inputs.input_b",
                "state_2.inputs.input_a",
              ],
            },
          },
          "state_1_1": {
            "outputs.output1": {
              "raw": [
                "context.global_a",
                "state_1_1.inputs",
              ],
              "ref": "state_1_1.inputs",
              "ui": [
                "state_1_1.inputs",
                "state_2.inputs.input_a",
              ],
            },
          },
        }
      `);
    });
  });

  describe('cases', () => {
    it('case#1', () => {
      const input = {
        scene: 'set_nodedata_key_val',
        params: {
          stateName: 'state_1',
          key: 'render.text',
          newValue: '{{ context.test_a }}',
          mode: 'ref',
        } as const,
      };
      const rets = hanldeRefScene(
        {},
        {
          scene: 'set_nodedata_key_val',
          params: input.params,
        },
      );
      expect(rets).toMatchInlineSnapshot(`
        {
          "state_1": {
            "render.text": {
              "currentMode": "ref",
              "ref": "{{ context.test_a }}",
            },
          },
        }
      `);
    });

    it('case#1-1', () => {
      const input = {
        scene: 'set_nodedata_key_val',
        params: {
          stateName: 'state_1',
          key: 'render.text',
          newValue: '{{ context.test_a }}',
          mode: 'ref',
        } as const,
      };
      const rets = hanldeRefScene(
        {
          state_1: {
            'render.text': {},
          },
        },
        {
          scene: 'set_nodedata_key_val',
          params: input.params,
        },
      );
      expect(rets).toMatchInlineSnapshot(`
        {
          "state_1": {
            "render.text": {
              "currentMode": "ref",
              "ref": "{{ context.test_a }}",
            },
          },
        }
      `);
    });
    it('case#1-2', () => {
      const input = {
        scene: 'set_nodedata_key_val',
        params: {
          stateName: 'state_1',
          key: 'render.text',
          newValue: [
            '{{ context.test_a }}',
            '{{ context.test_b }}',
          ] as string[],
          mode: 'ui',
        } as const,
      };
      const rets = hanldeRefScene(
        {
          state_1: {
            'render.text': {
              ui: [],
            },
          },
        },
        {
          scene: 'set_nodedata_key_val',
          params: input.params,
        },
      );
      expect(rets).toMatchInlineSnapshot(`
        {
          "state_1": {
            "render.text": {
              "currentMode": "ui",
              "ui": [
                "{{ context.test_a }}",
                "{{ context.test_b }}",
              ],
            },
          },
        }
      `);
    });

    it('case#3', () => {
      const refs = {
        state_1: {
          'render.text': {
            ref: '{{ context.test_a }}',
          },
        },
      };
      const evt = {
        scene: 'change_nodedata_mode',
        params: {
          stateName: 'state_1',
          mode: 'ui',
          key: 'render.text',
        },
      } as const;
      const ret = hanldeRefScene(refs, {
        scene: 'change_nodedata_mode',
        params: evt.params,
      });
      expect(ret).toMatchInlineSnapshot(`
        {
          "state_1": {
            "render.text": {
              "currentMode": "ui",
            },
          },
        }
      `);
    });

    it('case#4', () => {
      const refs = {
        state_1: {
          'outputs.__context__123__.value': {
            ref: '{{ wwqkaa }}',
          },
          'outputs.__context__3__.value': {
            ref: '{{ untitled_input_1 }}',
          },
          'outputs.{{_untitled_input_1_}}.value': {
            ref: '{{ test }}',
          },
        },
      };
      const evt = {
        scene: 'remove_ref_opts',
        params: {
          paths: ['inputs.test'],
        } as const,
      };
      const ret = hanldeRefScene(refs, {
        scene: 'remove_ref_opts',
        // @ts-expect-error
        params: evt.params,
      });
      expect(ret).toMatchInlineSnapshot(`
        {
          "state_1": {
            "outputs.__context__123__.value": {
              "ref": "{{ wwqkaa }}",
            },
            "outputs.__context__3__.value": {
              "ref": "{{ untitled_input_1 }}",
            },
            "outputs.{{_untitled_input_1_}}.value": {
              "ref": "{{ test }}",
            },
          },
        }
      `);
    });

    it('case#5', () => {
      const refs = {
        state_1: {
          'render.text': {
            ref: 'state_1_copy.untitled_context_3',
          },
          'render.image': {
            ref: 'context.untitled_context_3',
          },
        },
        state_1_copy: {
          'render.text': {
            ref: 'context.untitled_context_3',
          },
        },
      };
      const evt = {
        scene: 'remove_state',
        params: {
          stateName: 'state_1_copy' as CustomKey,
        },
      };

      const ret = removeState(refs, evt.params);
      expect(ret).toMatchInlineSnapshot(`
        {
          "state_1": {
            "render.image": {
              "ref": "context.untitled_context_3",
            },
          },
        }
      `);
    });
  });

  describe('removeEmptyLeaves', () => {
    it('case#1', () => {
      const refs = {
        state_1: {
          'render.text': {},
        },
      };
      const ret = removeEmptyLeaves(refs);
      expect(ret).toMatchInlineSnapshot(`{}`);
    });

    it('case#2', () => {
      const refs = {
        state_1: {
          'render.text': {
            ref: 'hi',
          },
        },
      };
      const ret = removeEmptyLeaves(refs);
      expect(ret).toMatchInlineSnapshot(`
        {
          "state_1": {
            "render.text": {
              "ref": "hi",
            },
          },
        }
      `);
    });
    it('case#3', () => {
      const refs = {
        state_1: {
          'render.text': {},
          'render.image': {
            ref: '{{ context.a }}',
          },
        },
      };
      const ret = removeEmptyLeaves(refs);
      expect(ret).toMatchInlineSnapshot(`
        {
          "state_1": {
            "render.image": {
              "ref": "{{ context.a }}",
            },
          },
        }
      `);
    });

    it('case#4', () => {
      const refs = {
        state_1: {
          'outputs.outputs1-1': {
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
      };
      const ret = removeEmptyLeaves(refs);
      expect(ret).toMatchInlineSnapshot(`
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
  });

  describe('task re order', () => {
    it('reorder tasks', () => {
      const refs = refsSchema.parse({
        state_1: {
          'block.a.inputs.system_prompt': {},
          'block.b.inputs.system_prompt': {},
          'block.c.inputs.system_prompt': { ref: 'state_1.block.b.outputs.o1' },
          'block.d.inputs.system_prompt': { ref: 'state_1.block.b.outputs.o1' },
        },
      });

      const ret = reorderTasks(refs, {
        stateName: 'state_1',
        previousTasks: ['a', 'b', 'c', 'd'],
        currentTasks: ['a', 'c', 'd', 'b'],
      });
      expect(ret).toMatchInlineSnapshot(`
        {
          "state_1": {
            "block.a.inputs.system_prompt": {},
            "block.b.inputs.system_prompt": {},
            "block.c.inputs.system_prompt": {},
            "block.d.inputs.system_prompt": {},
          },
        }
      `);
    });

    it('reorder tasks case#2', () => {
      const refs = refsSchema.parse({
        state_1: {
          'block.a.inputs.system_prompt': {},
          'block.b.inputs.system_prompt': {},
          'block.c.inputs.system_prompt': {
            ui: ['state_1.block.b.outputs.o1', 'state_1.block.a.outputs.o1'],
          },
          'block.d.inputs.system_prompt': { ref: 'state_1.block.b.outputs.o1' },
        },
      });

      const ret = reorderTasks(refs, {
        stateName: 'state_1',
        previousTasks: ['a', 'b', 'c', 'd'],
        currentTasks: ['a', 'c', 'd', 'b'],
      });
      expect(ret).toMatchInlineSnapshot(`
        {
          "state_1": {
            "block.a.inputs.system_prompt": {},
            "block.b.inputs.system_prompt": {},
            "block.c.inputs.system_prompt": {
              "ui": [
                "state_1.block.a.outputs.o1",
              ],
            },
            "block.d.inputs.system_prompt": {},
          },
        }
      `);
    });

    it('reorder tasks case#3', () => {
      const refs = refsSchema.parse({
        state_1: {
          'block.a.inputs.system_prompt': {},
          'block.b.inputs.system_prompt': {},
          'block.c.inputs.system_prompt': {},
          'block.d.inputs.system_prompt': { ref: 'state_1.block.b.outputs.o1' },
          'block.d.inputs.system_prompt_2': {
            ref: 'state_1.block.c.outputs.o1',
          },
          'block.d.inputs.system_prompt_3': {
            ref: 'state_1.block.a.outputs.o1',
          },
        },
      });

      const ret = reorderTasks(refs, {
        stateName: 'state_1',
        previousTasks: ['a', 'b', 'c', 'd'],
        currentTasks: ['a', 'd', 'b', 'c'],
      });
      expect(ret).toMatchInlineSnapshot(`
        {
          "state_1": {
            "block.a.inputs.system_prompt": {},
            "block.b.inputs.system_prompt": {},
            "block.c.inputs.system_prompt": {},
            "block.d.inputs.system_prompt": {},
            "block.d.inputs.system_prompt_2": {},
            "block.d.inputs.system_prompt_3": {
              "ref": "state_1.block.a.outputs.o1",
            },
          },
        }
      `);
    });

    it('case#1', () => {
      const orig = ['a', 'b', 'c', 'd'];
      const cur = ['a', 'c', 'd', 'b'];
      const ret = findMissingPrevious(orig, cur);
      expect(ret).toMatchInlineSnapshot(`
        [
          {
            "item": "a",
            "missing": [],
          },
          {
            "item": "c",
            "missing": [
              "b",
            ],
          },
          {
            "item": "d",
            "missing": [
              "b",
            ],
          },
          {
            "item": "b",
            "missing": [],
          },
        ]
      `);
    });

    it('case#2', () => {
      const orig = ['a', 'b', 'c', 'd'];
      const cur = ['a', 'd', 'b', 'c'];
      const ret = findMissingPrevious(orig, cur);
      expect(ret).toMatchInlineSnapshot(`
        [
          {
            "item": "a",
            "missing": [],
          },
          {
            "item": "d",
            "missing": [
              "b",
              "c",
            ],
          },
          {
            "item": "b",
            "missing": [],
          },
          {
            "item": "c",
            "missing": [],
          },
        ]
      `);
    });
  });
});