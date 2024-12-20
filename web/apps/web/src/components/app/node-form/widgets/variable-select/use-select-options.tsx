import { useFormEngineContext } from '@shellagent/form-engine';
import { CustomEventName } from '@shellagent/pro-config';
import { RefType, refTypeSchema } from '@shellagent/shared/protocol/app-scope';
import { reservedKeySchema } from '@shellagent/shared/protocol/pro-config';
import { WidgetTask, WorkflowTask } from '@shellagent/shared/protocol/task';
import { useInjection } from 'inversify-react';
import { useMemo } from 'react';

import { AppBuilderModel } from '@/stores/app/models/app-builder.model';
import { useSchemaContext } from '@/stores/app/schema-provider';
import { useAppState } from '@/stores/app/use-app-state';

export const useSelectOptions = (name?: string) => {
  const { parent } = useFormEngineContext();
  const stateId = useSchemaContext(state => state.id);
  const appBuilder = useInjection<AppBuilderModel>('AppBuilderModel');
  const currentEdegData = useAppState(state => state.currentEdegData);

  const { refType, taskIndex } = useMemo(() => {
    let refType: RefType | null = null;
    let taskIndex: number | undefined;
    if (
      parent?.startsWith(`${reservedKeySchema.Enum.condition}.`) ||
      name?.startsWith(reservedKeySchema.Enum.condition)
    ) {
      refType = refTypeSchema.Enum.target_input;
    } else if (parent?.startsWith(`${reservedKeySchema.Enum.inputs}.`)) {
      refType = refTypeSchema.Enum.state_input;
    } else if (parent?.startsWith(`${reservedKeySchema.Enum.blocks}.`)) {
      refType = refTypeSchema.Enum.state_task;
      taskIndex = (appBuilder.nodeData[stateId]?.blocks || []).findIndex(
        (block: WorkflowTask | WidgetTask) =>
          block.name === parent.split('.')?.[1],
      );
    } else if (name?.startsWith(`${reservedKeySchema.Enum.outputs}.`)) {
      refType = refTypeSchema.Enum.state_output;
    } else if (
      parent?.startsWith(
        `${reservedKeySchema.Enum.render}.${reservedKeySchema.Enum.buttons}.`,
      ) ||
      name?.startsWith(`${reservedKeySchema.Enum.render}`)
    ) {
      refType = refTypeSchema.Enum.state_render;
    }

    return { refType, taskIndex };
  }, [parent, name]);

  const result = useMemo(() => {
    if (stateId) {
      const refOptions = appBuilder.getRefOptions(
        stateId as Lowercase<string>,
        refType as RefType,
        taskIndex,
        currentEdegData?.event_key as CustomEventName | undefined,
      );
      return refOptions;
    }
    return [];
  }, [stateId, refType, taskIndex, currentEdegData]);

  return result;
};
