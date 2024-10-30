import { stateSchema } from './protocol';

describe('scope', () => {
  it('state', () => {
    const s1 = stateSchema.parse({
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
