import { Scopes, ScopeTypeEnum, VariableType, TaskType } from './types';

const mockScope: Scopes = {
  scopes: {
    context: {
      scopeType: ScopeTypeEnum.Global,
      variables: {
        userName: {
          type: 'text' as VariableType,
          scope: ['global'],
          value: 'John Doe',
        },
        userAvatar: {
          type: 'image' as VariableType,
          scope: ['global'],
          value: 'https://example.com/avatar.jpg',
        },
      },
    },
    states: {
      mainState: {
        scopeType: ScopeTypeEnum.Chain,
        variables: {
          currentStep: {
            type: 'text' as VariableType,
            scope: ['chain'],
            value: 'Step 1',
          },
        },
        children: {
          inputs: {
            scopeType: ScopeTypeEnum.Local,
            variables: {
              userInput: {
                type: 'text' as VariableType,
                scope: ['local'],
                value: '',
              },
            },
          },
          tasks: {
            scopeType: ScopeTypeEnum.Local,
            variables: {
              processInput: {
                type: 'workflow' as TaskType,
                scope: ['local'],
                value: 'processUserInput',
              },
            },
          },
          outputs: {
            scopeType: ScopeTypeEnum.Local,
            variables: {
              processedResult: {
                type: 'text' as VariableType,
                scope: ['local'],
                value: '',
              },
            },
            render: {
              scopeType: ScopeTypeEnum.Local,
              buttons: {
                submit: {
                  event: 'SUBMIT_INPUT',
                  payload: {
                    input: {
                      type: 'text' as VariableType,
                      scope: ['local'],
                      value: '',
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
};

export default mockScope;
