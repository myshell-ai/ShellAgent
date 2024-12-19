import { Automata } from '@shellagent/pro-config';
import {
  RefOptionsOutput,
  refOptOutputGlobalSchema,
  scopesSchema,
  State,
  stateSchema,
} from '@shellagent/shared/protocol/app-scope';
import { reservedStateNameSchema } from '@shellagent/shared/protocol/node';
import { Button as IButtonType } from '@shellagent/shared/protocol/render-button';
import { mapValues, isEmpty } from 'lodash-es';

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
    display_name: nodeData.display_name || nodeData.name,
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
              const { content } = button;
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

  return cascaderOptions;
}

// 以下为兼容逻辑
export function fieldsModeMap2Refs(
  automata: Automata | null,
  map: Record<string, any>,
) {
  const result: Record<string, any> = {};

  Object.entries(map || {}).forEach(([key, value]) => {
    // 提取基础键和其他部分
    const [baseKey, ...rest] = key.split('.');

    // 初始化基础键对象
    result[baseKey] = result[baseKey] || {};

    // 如果是 blocks 相关的字段
    if (rest.length > 0 && rest[0] === 'blocks') {
      const blockIndex = parseInt(rest[1], 10);
      // 添加类型断言
      const blockName = (automata?.blocks as any)?.[baseKey]?.blocks?.[
        blockIndex
      ]?.name;

      if (blockName) {
        // 替换路径中的数字索引为 block name
        const newPath = ['blocks', blockName, ...rest.slice(2)].join('.');
        Object.entries(value).forEach(([fieldKey, mode]) => {
          result[baseKey][`${newPath}.${fieldKey}`] = {
            currentMode: mode,
          };
        });
      }
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
    // 处理普通字段
    else {
      Object.entries(value).forEach(([fieldKey, mode]) => {
        result[baseKey][fieldKey] = {
          currentMode: mode,
        };
      });
    }
  });

  return result;
}
