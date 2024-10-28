import { CustomKey, TargetPath, CustomEventName } from '@shellagent/pro-config';

export enum ScopeTypeEnum {
  Global = 'global',
  Chain = 'chain',
  Local = 'local',
}

export type VariableType =
  | 'text'
  | 'image'
  | 'audio'
  | 'video'
  | 'file'
  | 'text_file';

export type TaskType = 'workflow' | 'widget';

type VariableName = CustomKey;

type OutputName = VariableName | `context.${VariableName}`;

export type ScopeType = `context.${TargetPath}` | TargetPath;

export interface Variable {
  type?: VariableType;
  scope: ScopeType[];
  value: Variable | string;
}

export interface TaskVariable {
  type: TaskType;
  scope: ScopeType[];
  value: Variable | string;
}

export interface Scopes {
  scopes: {
    context: {
      scopeType: ScopeTypeEnum.Global;
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
  scopeType: ScopeTypeEnum.Chain;
  variables: {
    // state的variables取自outputs
    [key: VariableName]: Variable;
  };
  children: {
    inputs: {
      scopeType: ScopeTypeEnum.Local;
      variables: {
        [key: VariableName]: Variable;
      };
    };
    tasks: {
      scopeType: ScopeTypeEnum.Local;
      variables: {
        [key: VariableName]: TaskVariable;
      };
    };
    outputs: {
      scopeType: ScopeTypeEnum.Local;
      variables: {
        [key: OutputName]: Variable;
      };
      render: {
        scopeType: ScopeTypeEnum.Local;
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
