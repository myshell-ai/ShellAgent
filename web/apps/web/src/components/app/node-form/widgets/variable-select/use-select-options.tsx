import { useFormEngineContext } from '@shellagent/form-engine';
import { CascaderOption } from '@shellagent/ui';
import { isEmpty } from 'lodash-es';
import { useMemo } from 'react';

import { useVariableContext } from '@/stores/app/variable-provider';
import { useInjection } from 'inversify-react';
import { AppBuilderModel } from '@/components/app/app-builder.model';
import { RefType, refTypeSchema } from '@shellagent/shared/protocol/app-scope';
import { useSchemaContext } from '@/stores/app/schema-provider';

export const useSelectOptions = (name?: string) => {
  const { parent } = useFormEngineContext();
  const stateId = useSchemaContext(state => state.id);

  const appBuilder = useInjection(AppBuilderModel);
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

  let refType: RefType | null = null;

  if (parent?.startsWith('condition.')) {
    refType = refTypeSchema.Enum.target_input;
  } else if (parent?.startsWith('input.')) {
    refType = refTypeSchema.Enum.state_input;
  } else if (parent?.startsWith('blocks.')) {
    refType = refTypeSchema.Enum.state_task;
  } else if (name?.startsWith('output.')) {
    refType = refTypeSchema.Enum.state_output;
  } else if (parent?.startsWith('render.buttons.')) {
    refType = refTypeSchema.Enum.state_render;
  } else if (name?.startsWith('render.')) {
    refType = refTypeSchema.Enum.state_render;
  }

  console.log('refType>>>', refType, parent, name);

  // const globalGroup = [...context, ...states];

  // const formatOptions = (items: any[]): CascaderOption[] => {
  //   return items.reduce((memo, item) => {
  //     const current = { ...item };
  //     if (
  //       parent?.startsWith('input.') &&
  //       ['Input', 'Output', 'Task'].includes(current.label)
  //     ) {
  //       return memo;
  //     }
  //     if (parent?.startsWith('blocks.')) {
  //       if (['Output'].includes(current.label)) {
  //         return memo;
  //       }
  //       if (['Task'].includes(current.label)) {
  //         const match = parent.match(/(\d+)$/);
  //         if (match?.[1]) {
  //           const parentIndex = Number(match[1]);
  //           // 只展示索引小于当前任务索引的任务
  //           current.children = (current.children as CascaderOption[])?.filter(
  //             (_, index) => index < parentIndex,
  //           );
  //         }
  //         if (isEmpty(current.children)) {
  //           return memo;
  //         }
  //       }
  //     } else if (
  //       name?.startsWith('output.') &&
  //       ['Output'].includes(current.label)
  //     ) {
  //       return memo;
  //     } else if (
  //       name?.startsWith('context.') &&
  //       ['Context'].includes(current.label)
  //     ) {
  //       return memo;
  //     }
  //     memo.push({
  //       label: current.label,
  //       value: `{{${current.value}}}`,
  //       field_type: current.field_type,
  //       children: current.children?.map((child: any) => ({
  //         label: child.label,
  //         value: `{{${child.value}}}`,
  //         field_type: child.field_type,
  //         children: child.children?.map((grandchild: any) => ({
  //           label: grandchild.label,
  //           value: `{{${grandchild.value}}}`,
  //           field_type: grandchild.field_type,
  //         })),
  //       })),
  //     });
  //     return memo;
  //   }, [] as CascaderOption[]);
  // };

  // const options = useMemo(() => {
  //   return [
  //     { label: 'current', children: formatOptions(currentGroup) },
  //     { label: 'global', children: formatOptions(globalGroup) },
  //   ];
  // }, [currentGroup, globalGroup, parent, name]);

  const refOptions = appBuilder.getRefOptions(
    stateId as Lowercase<string>,
    refType as RefType,
    // refTypeSchema.enum.state_input,
  );

  return refOptions;
};
