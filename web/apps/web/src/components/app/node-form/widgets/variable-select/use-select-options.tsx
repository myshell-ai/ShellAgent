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

  const options = useMemo(() => {
    const formatOptions = (items: any[]): CascaderOption[] => {
      return items.reduce((memo, item) => {
        const current = { ...item };
        if (
          parent?.startsWith('input.') &&
          ['Input', 'Tasks', 'Output'].includes(current.label)
        ) {
          return memo;
        }
        if (parent?.startsWith('blocks.')) {
          if (['Output'].includes(current.label)) {
            return memo;
          }
          if (['Tasks'].includes(current.label)) {
            const match = parent.match(/(\d+)$/);
            if (match?.[1]) {
              current.children = current.children?.splice(0, Number(match[1]));
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

    return [
      { label: 'current', children: formatOptions(currentGroup) },
      { label: 'global', children: formatOptions(globalGroup) },
    ];
  }, [currentGroup, globalGroup, parent, name]);

  return options;
};
