import { useFormContext } from '@shellagent/ui';
import { uniqueId } from 'lodash-es';
import React, { useMemo } from 'react';

import Block from '../block';
import Card from '../card';
import Control from '../control';
import Grid from '../grid';
import Inline from '../inline';
import { useFormEngineContext } from '../provider';
import Render from '../render';
import Section from '../section';
import Switch from '../switch';

interface IRecursionProps {
  name?: string;
  index?: number;
}

/**
 * 递归渲染 ISchema
 *
 * @param props
 * @returns
 */
const Recursion: React.FC<IRecursionProps> = (props: IRecursionProps) => {
  const { name = '', index } = props;
  const { fields } = useFormEngineContext();
  const { getValues } = useFormContext();
  const { schema, parent, error } = fields[name] || {};

  if (!schema) {
    return null;
  }

  const { type, properties, items, 'x-type': xtype } = schema;
  const value = name !== '' ? getValues(name) : getValues();

  const keys = useMemo(() => {
    if (Array.isArray(value)) {
      return value.map(() => uniqueId());
    }
    return null;
  }, [Array.isArray(value) ? value.length : '']);

  const renderChildren = () => {
    if ((type === 'object' || type === 'void') && properties) {
      return Object.keys(properties).map((key, i) => {
        const path = name ? [name] : [];

        if (type === 'void') {
          path.shift();

          if (parent) {
            path.push(parent);
          }
        }

        path.push(key);

        return <Recursion key={key} name={path.join('.')} index={i} />;
      });
    }
    if (type === 'array' && items) {
      return Array.isArray(value) && value.length
        ? value.map((item, i) => {
            const path = name ? [name] : [];
            path.push(String(i));
            return (
              <Recursion key={keys?.[i]} name={path.join('.')} index={i} />
            );
          })
        : null;
    }
  };

  switch (xtype) {
    case 'Render':
      return <Render name={name} />;
    case 'Control':
      return <Control name={name} />;
    case 'Section':
      return <Section name={name}>{renderChildren()}</Section>;
    case 'Card':
      return (
        <Card name={name} index={index} error={error}>
          {renderChildren()}
        </Card>
      );
    case 'Block':
      return <Block name={name}>{renderChildren()}</Block>;
    case 'Grid':
      return <Grid name={name}>{renderChildren()}</Grid>;
    case 'Switch':
      return <Switch name={name}>{renderChildren()}</Switch>;
    case 'Inline':
      return <Inline name={name}>{renderChildren()}</Inline>;
    default:
      return <>{renderChildren()}</>;
  }
};

export default Recursion;
