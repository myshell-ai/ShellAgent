import {
  RefOptionsOutput,
  Scopes,
  scopesSchema,
  State,
  stateSchema,
} from '@shellagent/shared/protocol/app-scope';
import { mapValues } from 'lodash-es';

export interface CascaderOption {
  label: string;
  value?: string;
  field_type?: string;
  children?: CascaderOption[];
}

export function convertNodeDataToState(nodeData: any): State {
  return stateSchema.parse({
    name: nodeData.id,
    children: {
      inputs: {
        variables: Object.fromEntries(
          Object.entries(nodeData.input || {}).map(
            ([key, value]: [string, any]) => [key, { type: value.type }],
          ),
        ),
      },
      tasks: (nodeData.blocks || []).map((block: any) => ({
        name: block.name,
        variables: block.inputs, // Assuming inputs are the variables
      })),
      outputs: {
        variables: Object.fromEntries(
          Object.entries(nodeData.output || {}).map(
            ([key, value]: [string, any]) => [key, { type: value.type }],
          ),
        ),
        render: {
          buttons: Object.fromEntries(
            (nodeData.render?.buttons || []).map((button: any) => {
              const [name, evt] = button.id.split('.');
              return [
                name,
                {
                  event: button.id,
                  payload: mapValues(button[evt]?.payload, v => ({
                    type: v.type,
                  })),
                },
              ];
            }),
          ),
        },
      },
    },
  });
}

export function convetNodeDataToScopes(nodeDatas: any, edges: any[]) {
  const ret = Object.keys(nodeDatas).reduce(
    (acc, k) => {
      const v = nodeDatas[k];
      if (k === '@@@start') {
        acc.context = {
          variables: mapValues(v.context, v => ({ type: v.type })),
        };
      } else {
        acc.states[k] = convertNodeDataToState(v);
      }
      return acc;
    },
    {
      context: {},
      states: {},
      edges: [],
    } as any,
  );

  ret.edges = edges.map(e => {
    return {
      source: e.source,
      target: e.target,
    };
  });

  scopesSchema.parse({
    scopes: ret,
  });
  return ret;
}

export function convertRefOptsToCascaderOpts(input: any): CascaderOption[] {
  const convertVariables = (variables: any): CascaderOption[] => {
    return Object.entries(variables).map(([key, value]: [string, any]) => ({
      label: key,
      field_type: value.type,
      value: '{{}}',
    }));
  };

  const convertSection = (section: any): CascaderOption[] => {
    return Object.entries(section).map(([key, value]: [string, any]) => {
      if (value.type) {
        // It's a variable
        return {
          label: key,
          field_type: value.type,
          value: '{{}}',
        };
      } else if (value.payload) {
        // It's a button with payload
        return {
          label: key,
          children: convertVariables(value.payload),
        };
      } else if (Array.isArray(value)) {
        // It's a list of tasks
        return {
          label: key,
          children: value.map((task: any) => ({
            label: task.name,
            children: convertVariables(task.variables),
          })),
        };
      } else {
        // It's a nested section
        return {
          label: key,
          children: convertSection(value),
        };
      }
    });
  };

  return [
    {
      label: 'global',
      children: convertSection(input.global),
    },
    {
      label: 'local',
      children: convertSection(input.local),
    },
  ];
}
