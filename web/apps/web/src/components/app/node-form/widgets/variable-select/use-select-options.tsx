import { useFormEngineContext } from '@shellagent/form-engine';
import { useInjection } from 'inversify-react';
import { AppBuilderModel } from '@/components/app/app-builder.model';
import { RefType, refTypeSchema } from '@shellagent/shared/protocol/app-scope';
import { useSchemaContext } from '@/stores/app/schema-provider';
import { useMemo } from 'react';

export const useSelectOptions = (name?: string) => {
  const { parent } = useFormEngineContext();
  const stateId = useSchemaContext(state => state.id);
  const appBuilder = useInjection(AppBuilderModel);

  const { refType, taskIndex } = useMemo(() => {
    let refType: RefType | null = null;
    let taskIndex: number | undefined;

    if (parent?.startsWith('condition.')) {
      refType = refTypeSchema.Enum.target_input;
    } else if (parent?.startsWith('input.')) {
      refType = refTypeSchema.Enum.state_input;
    } else if (parent?.startsWith('blocks.')) {
      refType = refTypeSchema.Enum.state_task;
      taskIndex = Number(parent.split('.')?.[1]);
    } else if (name?.startsWith('output.')) {
      refType = refTypeSchema.Enum.state_output;
    } else if (parent?.startsWith('render.buttons.')) {
      refType = refTypeSchema.Enum.state_render;
    } else if (name?.startsWith('render.')) {
      refType = refTypeSchema.Enum.state_render;
    }

    return { refType, taskIndex };
  }, [parent, name]);

  const refOptions = appBuilder.getRefOptions(
    stateId as Lowercase<string>,
    refType as RefType,
    taskIndex,
  );

  return refOptions;
};
