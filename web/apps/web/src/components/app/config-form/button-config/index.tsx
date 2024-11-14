'use client';

import { TValues, TFieldMode } from '@shellagent/form-engine';
import { useCallback } from 'react';

import NodeForm from '@/components/app/node-form';
import { useAppState } from '@/stores/app/use-app-state';
import { buttonConfigSchema } from '@/stores/app/utils/schema';
import { useInjection } from 'inversify-react';
import { observer } from 'mobx-react-lite';
import { AppBuilderModel } from '@/components/app/app-builder.model';

interface ButtonConfigProps {
  values: TValues;
  id: string;
  onChange: (values: TValues) => void;
}

export const ButtonConfig = observer(
  ({ values, onChange, id }: ButtonConfigProps) => {
    const appBuilder = useInjection<AppBuilderModel>('AppBuilderModel');

    const currentButtonId = useAppState(state => state.currentButtonId);

    const onModeChange = useCallback(
      (name: string, mode: TFieldMode) => {
        appBuilder.setFieldsModeMap({
          id: `${id}.${currentButtonId}`,
          name,
          mode,
        });
      },
      [currentButtonId, id, appBuilder.setFieldsModeMap],
    );

    return (
      <NodeForm
        parent={`render.buttons.${currentButtonId}`}
        key={currentButtonId}
        schema={buttonConfigSchema}
        values={values as TValues}
        onChange={onChange}
        onModeChange={onModeChange}
        modeMap={
          appBuilder.config.fieldsModeMap?.[`${id}.${currentButtonId}`] || {}
        }
      />
    );
  },
);
