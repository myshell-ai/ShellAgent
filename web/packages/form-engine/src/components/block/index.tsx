import { ChevronRightIcon } from '@heroicons/react/16/solid';
import { PlusIcon } from '@heroicons/react/24/outline';
import {
  useFormContext,
  FormField,
  Heading,
  Paragraph,
  Text,
  Button,
} from '@shellagent/ui';
import React, { useState } from 'react';

import { cn } from '../../utils/cn';
import Control from '../control';
import { useFormEngineContext } from '../provider';

export interface IBlockProps {
  name?: string;
  children?: React.ReactNode;
}

/**
 * @param props
 * @returns
 */
const Block: React.FC<IBlockProps> = props => {
  const { name = '', children } = props;
  const { fields, append, components } = useFormEngineContext();
  const { schema } = fields[name] || {};

  if (!schema) {
    return null;
  }

  const {
    type,
    title,
    description,
    'x-title-size': xTitleSize = 'h3',
    'x-collapsible': xCollapsible,
    'x-default-expand': xDefaultExpand,
    'x-addable': xAddable,
    'x-component': xComponent,
    'x-suffix': xSuffix,
    'x-empty': xEmpty,
    'x-hidden': xHidden,
    'x-class': xClass,
  } = schema;
  const [isExpand, setIsExpand] = useState(xDefaultExpand ?? true);
  const { control } = useFormContext();
  const onExpandToggle = () => {
    setIsExpand(!isExpand);
  };
  const contentCls = cn(
    'mt-2 space-y-1.5',
    {
      hidden: !isExpand,
    },
    xClass,
  );

  const onAdd = () => {
    append(name);
  };

  const renderCollapsibleTitle = () => {
    return xCollapsible ? (
      <div className="flex items-center flex-1">
        <Heading size={xTitleSize} lineClamp={1}>
          {title}
        </Heading>
        <ChevronRightIcon
          onClick={onExpandToggle}
          className={cn('w-5 h-5 text-subtle cursor-pointer ml-auto', {
            'rotate-90': isExpand,
          })}
        />
      </div>
    ) : (
      <Heading size={xTitleSize} lineClamp={1}>
        {title}
      </Heading>
    );
  };

  const renderTitle = () => {
    return (
      <div className="flex items-center">
        <div className="flex-1">{renderCollapsibleTitle()}</div>
        <div className="flex items-center space-x-1">
          {xSuffix ? (
            <div className="ml-auto">
              {React.createElement(components[xSuffix], { ...props })}
            </div>
          ) : null}
        </div>
      </div>
    );
  };

  if (xComponent) {
    return (
      <div className="flex flex-col" data-ui="block">
        {title ? renderTitle() : null}
        {description ? (
          <Paragraph size="lg" lineClamp={6} color="subtler" className="mt-1">
            {description}
          </Paragraph>
        ) : null}
        <div className={contentCls}>
          <Control name={name} />
          {xAddable ? (
            <Button
              icon={PlusIcon}
              onClick={onAdd}
              variant="outline"
              size="sm"
              className="rounded-lg mt-1.5 w-18 border-default">
              Add
            </Button>
          ) : null}
        </div>
      </div>
    );
  }

  const render = () => {
    return (
      <div
        className={cn('flex flex-col', {
          hidden: xHidden,
        })}
        data-ui="block">
        {title ? renderTitle() : null}
        {description ? (
          <Paragraph size="lg" color="subtler" lineClamp={6} className="mt-1">
            {description}
          </Paragraph>
        ) : null}
        <div className={contentCls}>
          {React.Children.count(children) === 0 && xEmpty ? (
            <Text size="sm" color="subtler">
              {xEmpty.text}
            </Text>
          ) : (
            children
          )}
          {xAddable ? (
            <Button
              icon={PlusIcon}
              onClick={onAdd}
              variant="outline"
              size="sm"
              type="button"
              className="rounded-lg mt-1.5 w-18 border-default">
              Add
            </Button>
          ) : null}
        </div>
      </div>
    );
  };

  return type === 'void' ? (
    render()
  ) : (
    <FormField control={control} name={name} render={render} />
  );
};

export default Block;
