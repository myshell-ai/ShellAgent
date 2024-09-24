'use client';

import { TValues, TFieldMode } from '@shellagent/form-engine';
import { useCallback } from 'react';

import NodeForm from '@/components/app/node-form';
import { useAppState } from '@/stores/app/use-app-state';
import { buttonConfigSchema } from '@/stores/app/utils/schema';
import { useAppStore } from '@/stores/app/app-provider';

interface ButtonConfigProps {
  values: TValues;
  id: string;
  onChange: (values: TValues) => void;
}

export const ButtonConfig = ({ values, onChange, id }: ButtonConfigProps) => {
  const { setFieldsModeMap, fieldsModeMap } = useAppStore(state => ({
    setFieldsModeMap: state.setFieldsModeMap,
    fieldsModeMap: state.config?.fieldsModeMap,
  }));
  const currentButtonId = useAppState(state => state.currentButtonId);

  const onModeChange = useCallback(
    (name: string, mode: TFieldMode) => {
      setFieldsModeMap({ id: `${id}.${currentButtonId}`, name, mode });
    },
    [currentButtonId, id, setFieldsModeMap],
  );

  return (
    <NodeForm
      key={currentButtonId}
      schema={buttonConfigSchema}
      values={values as TValues}
      onChange={onChange}
      onModeChange={onModeChange}
      modeMap={fieldsModeMap?.[`${id}.${currentButtonId}`] || {}}
    />
  );
};
