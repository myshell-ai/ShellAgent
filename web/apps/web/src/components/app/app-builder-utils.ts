import {
  RefOptionsOutput,
  refOptOutputGlobalSchema,
  scopesSchema,
  State,
  stateSchema,
} from '@shellagent/shared/protocol/app-scope';
import { reservedStateNameSchema } from '@shellagent/shared/protocol/node';
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
    display_name: nodeData.name,
    children: {
      inputs: {
        variables: Object.fromEntries(
          Object.entries(nodeData.inputs || {}).map(
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
          Object.entries(nodeData.outputs || {}).map(
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
  // TODO blocks 的type有问题
  try {
    return stateSchema.parse(ret);
  } catch (e) {
    console.error(e);
    return ret;
  }
}

export function convetNodeDataToScopes(nodeDatas: any, edges: any[]) {
  const ret = Object.keys(nodeDatas).reduce(
    (acc, k) => {
      const v = nodeDatas[k];
      if (k === reservedStateNameSchema.enum.start) {
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

  // TODO blocks 的type有问题
  try {
    return scopesSchema.parse({
      scopes: ret,
    });
  } catch (e) {
    console.error(e);
    return ret;
  }
}

export function convertRefOptsToCascaderOpts(
  refOpts: RefOptionsOutput,
): CascaderOption[] {
  const cascaderOptions: CascaderOption[] = [];

  const globalOptions: CascaderOption[] = [];
  Object.entries(refOpts.global).forEach(([key, val]) => {
    const val2 = refOptOutputGlobalSchema.parse(val);
    const children: CascaderOption[] = Object.entries(val2.variables || {}).map(
      ([variableKey, variable]) => {
        let value;
        if (key === 'context') {
          value = `{{ __context__${variableKey}__ }}`;
        } else {
          value = `{{ ${key}.${variableKey} }}`;
        }
        return {
          label: variable?.display_name || variableKey,
          value,
          field_type: variable?.type,
        };
      },
    );

    if (children.length > 0) {
      globalOptions.push({
        label: val2?.display_name,
        value: val2?.display_name,
        children,
      });
    }
  });

  if (globalOptions.length > 0) {
    cascaderOptions.push({
      label: 'global',
      children: globalOptions,
    });
  }

  const localOptions: CascaderOption[] = [];

  if (!isEmpty(refOpts.local.buttons)) {
    const buttonOptions = Object.entries(refOpts.local.buttons).map(
      ([buttonKey, button]) => {
        return {
          label: buttonKey,
          value: buttonKey,
          children: Object.entries(button?.payload || {}).map(
            ([payloadKey, payload]) => {
              return {
                label: payload?.display_name || payloadKey,
                value: `{{ payload.${payloadKey} }}`,
                field_type: payload?.type,
              };
            },
          ),
        };
      },
    );

    localOptions.push({
      label: 'Payload',
      value: 'Payload',
      children: buttonOptions,
    });
  }

  if (!isEmpty(refOpts.local.inputs.variables)) {
    localOptions.push({
      label: 'Input',
      value: 'Input',
      children: Object.entries(refOpts.local.inputs.variables).map(
        ([variableKey, variable]) => ({
          label: variable?.display_name || variableKey,
          value: `{{ ${variableKey} }}`,
          field_type: variable?.type,
        }),
      ),
    });
  }

  if (!isEmpty(refOpts.local.outputs.variables)) {
    localOptions.push({
      label: 'Output',
      value: 'Output',
      children: Object.entries(refOpts.local.outputs.variables).map(
        ([variableKey, variable]) => ({
          label: variable.display_name,
          value: `{{ ${variableKey} }}`,
          field_type: variable.type,
        }),
      ),
    });
  }

  if (refOpts.local.tasks.length > 0) {
    const taskOptions = refOpts.local.tasks.map(task => ({
      label: task?.display_name || task.name,
      value: task?.display_name || task.name,
      children: Object.entries(task.variables).map(
        ([variableKey, variable]) => ({
          label: variableKey,
          value: `{{ ${task.name}.${variableKey} }}`,
          field_type: variable?.type,
        }),
      ),
    }));

    localOptions.push({
      label: 'Task',
      value: 'Task',
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
