import { customEventSchema } from '@shellagent/shared/protocol/app-scope';
import { convertNodeDataToState } from './app-builder-utils';

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
                payload: {},
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
        ],
      },
    };
  });

  it('case #1', () => {
    customEventSchema.parse('button_1.on_click');
  });

  it('convert a node data state to state', () => {
    const nodeData = {
      id: 'state_1',
      type: 'state',
      name: 'State',
      render: {
        buttons: [
          {
            content: 'Button#1',
            on_click: {
              event: 'button_1.on_click',
              payload: {},
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
      ],
    };
    const state = {
      name: 'state_1',
      children: {
        inputs: {
          variables: {
            untitled_input_1: {
              type: 'text',
            },
            untitled_input_2: {
              type: 'text',
            },
          },
        },
        tasks: [
          {
            name: 'workflow_runner_1',
            variables: {},
          },
        ],
        outputs: {
          variables: {
            untitled_output_1: {
              type: 'text',
            },
          },
          render: {
            buttons: {
              'button_1.on_click': {
                payload: {},
              },
            },
          },
        },
      },
    };
    const ret = convertNodeDataToState(nodeData);
    expect(ret).toEqual(state);
  });
});
