import {
  RefOptionsOutput,
  Scopes,
  scopesSchema,
  State,
  stateSchema,
} from '@shellagent/shared/protocol/app-scope';
import { mapValues, isEmpty } from 'lodash-es';

export interface CascaderOption {
  label: string;
  value?: string;
  field_type?: string;
  children?: CascaderOption[];
}

export function convertNodeDataToState(nodeData: any): State {
  const ret = {
    name: nodeData.id,
    children: {
      inputs: {
        variables: Object.fromEntries(
          Object.entries(nodeData.input || {}).map(
            ([key, value]: [string, any]) => [
              key,
              { type: value.type, display_name: value.name },
            ],
          ),
        ),
      },
      tasks: (nodeData.blocks || []).map((block: any) => ({
        name: block.name,
        display_name: block.display_name,
        variables: mapValues(block.outputs.display, (v, k) => {
          return {
            type: v,
            display_name: k,
          };
        }), // Assuming inputs are the variables
      })),
      outputs: {
        variables: Object.fromEntries(
          Object.entries(nodeData.output || {}).map(
            ([key, value]: [string, any]) => [
              key,
              { type: value.type, display_name: value.name },
            ],
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
                    display_name: v.name,
                  })),
                },
              ];
            }),
          ),
        },
      },
    },
  };
  try {
    // console.log(ret)
    return stateSchema.parse(ret);
  } catch (e) {
    throw e;
  }
}

export function convetNodeDataToScopes(nodeDatas: any, edges: any[]) {
  const ret = Object.keys(nodeDatas).reduce(
    (acc, k) => {
      const v = nodeDatas[k];
      if (k === '@@@start') {
        acc.context = {
          variables: mapValues(v.context, v => ({
            type: v.type,
            display_name: v.name,
          })),
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

  return scopesSchema.parse({
    scopes: ret,
  });
}

export function convertRefOptsToCascaderOpts(
  refOptions: RefOptionsOutput,
): CascaderOption[] {
  const cascaderOptions: CascaderOption[] = [];

  // Convert global options
  const globalOptions: CascaderOption[] = [];
  for (const [key, variables] of Object.entries(refOptions.global)) {
    const children: CascaderOption[] = Object.entries(variables || {}).map(
      ([variableKey, variable]) => ({
        label: variable?.display_name || variableKey,
        value: `{{ ${key}.${variableKey} }}`,
        field_type: variable?.type,
      }),
    );

    globalOptions.push({
      label: key,
      children,
    });
  }

  if (globalOptions.length > 0) {
    cascaderOptions.push({
      label: 'global',
      children: globalOptions,
    });
  }

  // Convert local options
  const localOptions: CascaderOption[] = [];

  // Local buttons
  if (!isEmpty(refOptions.local.buttons)) {
    const buttonOptions = Object.entries(refOptions.local.buttons).map(
      ([buttonKey, button]) => {
        return {
          label: buttonKey,
          children: Object.entries(button?.payload || {}).map(
            ([payloadKey, payload]) => {
              return {
                label: payload?.display_name || payloadKey,
                value: `{{ ${payloadKey} }}`,
                field_type: payload?.type,
              };
            },
          ),
        };
      },
    );

    localOptions.push({
      label: 'buttons',
      children: buttonOptions,
    });
  }

  // Local inputs
  if (!isEmpty(refOptions.local.inputs.variables)) {
    localOptions.push({
      label: 'inputs',
      children: Object.entries(refOptions.local.inputs.variables).map(
        ([variableKey, variable]) => ({
          label: variable?.display_name || variableKey,
          value: `{{ ${variableKey} }}`,
          field_type: variable?.type,
        }),
      ),
    });
  }

  // Local outputs
  if (!isEmpty(refOptions.local.outputs.variables)) {
    localOptions.push({
      label: 'outputs',
      children: Object.entries(refOptions.local.outputs.variables).map(
        ([variableKey, variable]) => ({
          label: variable.display_name,
          value: `{{ ${variableKey} }}`,
          field_type: variable.type,
        }),
      ),
    });
  }

  // Local tasks
  if (refOptions.local.tasks.length > 0) {
    const taskOptions = refOptions.local.tasks.map(task => ({
      label: task?.display_name || task.name,
      children: Object.entries(task.variables).map(
        ([variableKey, variable]) => ({
          label: variableKey,
          value: `{{ ${task.name}.${variableKey} }}`,
          field_type: variable?.type,
        }),
      ),
    }));

    localOptions.push({
      label: 'tasks',
      children: taskOptions,
    });
  }

  if (localOptions.length > 0) {
    cascaderOptions.push({
      label: 'current',
      children: localOptions,
    });
  }

  return cascaderOptions;
}
