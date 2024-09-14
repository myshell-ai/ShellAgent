/* eslint-disable */
import { useFormContext, FormField } from '@shellagent/ui';
import React from 'react';

import { cn } from '../../utils/cn';
import { useFormEngineContext } from '../provider';

export interface IGridProps {
  name?: string;
  children?: React.ReactNode;
}

/**
 * @param props
 * @returns
 */
const Grid: React.FC<IGridProps> = props => {
  const { name = '', children } = props;
  const { fields } = useFormEngineContext();
  const { control } = useFormContext();
  const { schema } = fields[name] || {};

  if (!schema) {
    return null;
  }

  const { type, 'x-class': xClass } = schema;

  const cls = cn('grid grid-cols-2 gap-2', xClass);

  const render = () => {
    return (
      <div className={cls}>
        {React.Children.map(children, (child, i) => {
          if (!React.isValidElement(child)) {
            return null;
          }
          const {
            schema: { 'x-hidden': xHidden, 'x-class': xChildClass },
          } = fields[child.props.name];

          return !xHidden ? (
            <div key={i} className={cn('flex items-center', xChildClass)}>
              <div className={cn('flex-1', xChildClass)}>{child}</div>
            </div>
          ) : (
            child
          );
        })}
      </div>
    );
  };

  return type === 'void' ? (
    render()
  ) : (
    <FormField control={control} name={name} render={render} />
  );
};

export default Grid;
