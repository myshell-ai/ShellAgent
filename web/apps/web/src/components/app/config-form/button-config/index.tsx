'use client';

import { TValues } from '@shellagent/form-engine';

import NodeForm from '@/components/app/node-form';
import { useAppState } from '@/stores/app/use-app-state';
import { buttonConfigSchema } from '@/stores/app/utils/schema';

interface ButtonConfigProps {
  values: TValues;
  onChange: (values: TValues) => void;
}

export const ButtonConfig = ({ values, onChange }: ButtonConfigProps) => {
  const currentButtonId = useAppState(state => state.currentButtonId);

  return (
    <NodeForm
      parent={`render.buttons.${currentButtonId}`}
      key={currentButtonId}
      schema={buttonConfigSchema}
      values={values as TValues}
      onChange={onChange}
    />
  );
};
