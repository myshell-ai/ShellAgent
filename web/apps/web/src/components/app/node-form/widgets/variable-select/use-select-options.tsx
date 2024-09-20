import { useFormEngineContext } from '@shellagent/form-engine';
import { CascaderOption } from '@shellagent/ui';
import { isEmpty } from 'lodash-es';
import { useMemo } from 'react';

import { useVariableContext } from '@/stores/app/variable-provider';

export const useSelectOptions = (name?: string) => {
  const { parent } = useFormEngineContext();
  const {
    payloads = [],
    input = [],
    tasks = [],
    output = [],
    context = [],
    states = [],
  } = useVariableContext(state => ({
    payloads: state.payloads,
    input: state.input,
    tasks: state.tasks,
    output: state.output,
    context: state.context,
    states: state.states,
  }));

  const currentGroup = [...input, ...tasks, ...output];

  if (parent?.startsWith('condition.')) {
    // target inputs需要payload
    currentGroup.push(...payloads);
  }

  const globalGroup = [...context, ...states];

  const formatOptions = (items: any[]): CascaderOption[] => {
    return items.reduce((memo, item) => {
      const current = { ...item };
      if (
        parent?.startsWith('input.') &&
        ['Input', 'Output', 'Task'].includes(current.label)
      ) {
        return memo;
      }
      if (parent?.startsWith('blocks.')) {
        if (['Output'].includes(current.label)) {
          return memo;
        }
        if (['Task'].includes(current.label)) {
          const match = parent.match(/(\d+)$/);
          if (match?.[1]) {
            const parentIndex = Number(match[1]);
            // 只展示索引小于当前任务索引的任务
            current.children = (current.children as CascaderOption[])?.filter(
              (_, index) => index < parentIndex,
            );
          }
          if (isEmpty(current.children)) {
            return memo;
          }
        }
      } else if (
        name?.startsWith('output.') &&
        ['Output'].includes(current.label)
      ) {
        return memo;
      } else if (
        name?.startsWith('context.') &&
        ['Start-Context'].includes(current.label)
      ) {
        return memo;
      }
      memo.push({
        label: current.label,
        value: `{{${current.value}}}`,
        children: current.children?.map((child: any) => ({
          label: child.label,
          value: `{{${child.value}}}`,
          children: child.children?.map((grandchild: any) => ({
            label: grandchild.label,
            value: `{{${grandchild.value}}}`,
          })),
        })),
      });
      return memo;
    }, [] as CascaderOption[]);
  };

  const options = useMemo(() => {
    return [
      { label: 'current', children: formatOptions(currentGroup) },
      { label: 'global', children: formatOptions(globalGroup) },
    ];
  }, [currentGroup, globalGroup, parent, name]);

  return options;
};
