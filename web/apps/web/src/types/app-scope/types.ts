import { CustomKey, TargetPath, CustomEventName } from '@shellagent/pro-config';

export type VariableType =
  | 'text'
  | 'image'
  | 'audio'
  | 'video'
  | 'file'
  | 'text_file';

type VariableName = CustomKey;

type OutputName = VariableName | `context.${VariableName}`;

export type ScopeType = TargetPath;

export interface Variable {
  type?: VariableType;
}

export interface TaskVariable {
  type: 'task';
  name: string;
  variables: {
    [key: VariableName]: Variable;
  };
}

export interface Scopes {
  scopes: {
    context: {
      variables: {
        [contextName: VariableName]: Variable;
      };
    };
    states: {
      [stateName: VariableName]: State;
    };
  };
}

export interface State {
  variables: {
    // state的variables取自outputs
    [key: VariableName]: Variable;
  };
  children: {
    inputs: {
      variables: {
        [key: VariableName]: Variable;
      };
    };
    tasks: TaskVariable[];
    outputs: {
      variables: {
        [key: OutputName]: Variable;
      };
      render: {
        buttons: {
          [buttonName: VariableName]: {
            event: CustomEventName;
            payload: {
              [key: VariableName]: Variable;
            };
          };
        };
      };
    };
  };
}
