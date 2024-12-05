import {
  customSnakeCase,
  RefOptionsOutput,
  refOptOutputGlobalSchema,
  scopesSchema,
  State,
  stateSchema,
} from '@shellagent/shared/protocol/app-scope';
import { reservedStateNameSchema } from '@shellagent/shared/protocol/node';
import { Button as IButtonType } from '@shellagent/shared/protocol/render-button';
import { FieldValues } from '@shellagent/ui';
import { cloneDeep, mapValues, isEmpty } from 'lodash-es';

export interface CascaderOption {
  label: string;
  value?: string;
  field_type?: string;
  parent?: string;
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
        }),
      })),
      outputs: {
        variables: Object.fromEntries(
          Object.entries(nodeData.outputs || {}).map(
            ([key, value]: [string, any]) => [
              key,
              {
                type: value.type,
                display_name: value.display_name || value.name,
              },
            ],
          ),
        ),
        render: {
          buttons: Object.fromEntries(
            (nodeData.render?.buttons || []).map((button: IButtonType) => {
              const content = button.content;
              if (!isEmpty(button?.on_click?.payload)) {
                return [
                  content,
                  {
                    event: button.on_click.event,
                    payload: mapValues(button?.on_click?.payload, v => ({
                      type: v.type,
                      display_name: v.name,
                    })),
                  },
                ];
              }
              return [content, {}];
            }),
          ),
        },
      },
    },
  };
  try {
    return stateSchema.parse(ret);
  } catch (error) {
    console.warn('StateSchema Zod Validate Error', error);
    return ret as State;
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

  try {
    return scopesSchema.parse({
      scopes: ret,
    });
  } catch (error) {
    console.warn('ScopesSchema Zod Validate Error', error);
    return {
      scopes: ret,
    };
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
        let parent;
        if (key === 'context') {
          value = `{{__context__${variableKey}__}}`;
          parent = 'context';
        } else {
          if (/__context__([a-z0-9_]+)__/g.test(variableKey)) {
            value = `{{${variableKey}}}`;
          } else {
            value = `{{${key}.${variableKey}}}`;
          }
          parent = 'state';
        }
        return {
          label: variable?.display_name || variableKey,
          value,
          field_type: variable?.type,
          parent,
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
                value: `{{payload.${payloadKey}}}`,
                field_type: payload?.type,
                parent: 'buttons',
              };
            },
          ),
          parent: 'render',
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
          value: `{{${variableKey}}}`,
          field_type: variable?.type,
          parent: 'inputs',
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
          value: `{{${variableKey}}}`,
          field_type: variable.type,
          parent: 'outputs',
        }),
      ),
    });
  }

  if (refOpts.local.tasks.length > 0) {
    const taskOptions = refOpts.local.tasks.map(task => ({
      label: task?.display_name || task.name,
      value: task?.display_name || task.name,
      parent: 'blocks',
      children: Object.entries(task.variables).map(
        ([variableKey, variable]) => ({
          label: variableKey,
          value: `{{${task.name}.${variableKey}}}`,
          field_type: variable?.type,
          parent: 'blocks',
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

// 以下为兼容逻辑

export function fieldsModeMap2Refs(map: Record<string, any>) {
  const result: Record<string, any> = {};

  Object.entries(map || {}).forEach(([key, value]) => {
    // 处理包含UUID的特殊情况
    if (key.includes('.')) {
      const [baseKey, ...rest] = key.split('.');
      result[baseKey] = result[baseKey] || {};

      // 如果是blocks相关的字段
      if (rest.join('.').startsWith('blocks.')) {
        const blockPath = rest.join('.');
        Object.entries(value).forEach(([blockKey, blockMode]) => {
          result[baseKey][`${blockPath}.${blockKey}`] = {
            currentMode: blockMode,
          };
        });
      }
      // 如果包含UUID
      else if (
        rest.some(part =>
          /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(
            part,
          ),
        )
      ) {
        const uuid = rest.find(part =>
          /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(
            part,
          ),
        );
        if (uuid) {
          Object.entries(value).forEach(([field, mode]) => {
            result[baseKey][`render.buttons.${uuid}.${field}`] = {
              currentMode: mode,
            };
          });
        }
      }
      return;
    }

    // 处理普通字段
    result[key] = {};
    Object.entries(value).forEach(([fieldKey, mode]) => {
      result[key][fieldKey] = { currentMode: mode };
    });
  });

  return result;
}

export function duplicateComfyUI(
  defaultLocation: string,
  appName: string,
  stateName: string,
  nodeData: FieldValues,
): {
  nodeData: FieldValues;
  locations: Array<{
    from: string;
    to: string;
  }>;
} {
  const locations: Array<{
    from: string;
    to: string;
  }> = [];
  const nodeData2 = cloneDeep(nodeData);
  if (Array.isArray(nodeData2.blocks)) {
    nodeData2.blocks = nodeData2.blocks.map(b => {
      if (b.widget_class_name === 'ComfyUIWidget') {
        const defaultName = customSnakeCase(
          `${appName}_${stateName}_${b.name}`,
        );
        const locationNew = `${defaultLocation}/${defaultName}.shellagent.json`;
        locations.push({
          from: b.location,
          to: locationNew,
        });
        b.location = locationNew;
      }
      return b;
    });
  }
  return {
    nodeData: nodeData2,
    locations,
  };
}
