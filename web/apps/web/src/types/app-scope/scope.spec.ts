import { stateSchema } from './protocol';

describe('scope', () => {
  it('a valid state', () => {
    const edges = [
      {
        source: 'state#1',
        target: 'state#2',
      },
      {
        source: 'state#1',
        target: 'state#3',
      },
      {
        // source: 'state#1-1'
      },
    ];

    // case copy state#1 -> state#1-1
    // output: scope = fn(automata, edges, 'state#1-1')
    /*
     */
    // case 1
    // state#1某个 ref input 完全限定名 能够 ref 哪些 scope
    const scope = {
      'state#1.outputs.output1' /* 完全限定名 */: ['context'],
      //
      'state#1-1.outputs.output1': ['context'],
    };
    // delete all context

    // case 2 output context name
    const scope2 = {
      'state#1.outputs.context.global_a' /* 完全限定名 */: ['context'],
    };

    const s1 = stateSchema.parse({
      name: 'state#1',
      children: {
        inputs: {
          variables: {
            user_prompt: {
              type: 'text',
            },
          },
        },
        tasks: {
          variables: {
            gpt2: {
              type: 'task',
            },
          },
        },
        outputs: {
          variables: {
            untitled: {
              type: 'text',
            },
          },
          render: {
            buttons: {
              home: {
                event: 'home.click',
                payload: {
                  a: {
                    type: 'text',
                  },
                },
              },
            },
          },
        },
      },
    });
  });
});
