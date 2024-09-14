import { FormField, useFormContext } from '@shellagent/ui';
import React from 'react';

import { useFormEngineContext } from '../provider';

export interface ISwitchProps {
  name?: string;
  children?: React.ReactNode;
}

/**
 * @param props
 * @returns
 */
const Switch: React.FC<ISwitchProps> = props => {
  const { name = '', children } = props;
  const { fields } = useFormEngineContext();
  const { control } = useFormContext();
  const { schema } = fields[name] || {};

  if (!schema) {
    return null;
  }

  const { type, title } = schema;

  const render = () => {
    return (
      <div className="flex items-center justify-between h-10 rounded-lg border border-default bg-surface-search-field shadow-surface-default p-3">
        <div className="flex-1">{title}</div>
        {children}
      </div>
    );
  };

  return type === 'void' ? (
    render()
  ) : (
    <FormField control={control} name={name} render={render} />
  );
};

export default Switch;
