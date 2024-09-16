import { ChevronRightIcon } from '@heroicons/react/16/solid';
import { TrashIcon } from '@heroicons/react/24/outline';
import {
  useFormContext,
  FormField,
  Heading,
  Paragraph,
  IconButton,
} from '@shellagent/ui';
import React, { useState } from 'react';

import { cn } from '../../utils/cn';
import Control from '../control';
import { EditDialog } from '../edit-dialog';
import { useFormEngineContext } from '../provider';

export interface IInlineProps {
  name?: string;
  children?: React.ReactNode;
}

/**
 * @param props
 * @returns
 */
const Inline: React.FC<IInlineProps> = props => {
  const { name = '', children } = props;
  const { fields, append, remove, components } = useFormEngineContext();
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
    'x-edit-dialog': xEditDialog,
    // 'x-empty': xEmpty,
    'x-class': xClass,
    'x-wrapper-class': xWrapperClass,
    'x-deletable': xDeletable,
    'x-suffix': xSuffix,
    'x-prefix': xPrefix,
  } = schema;
  const [isExpand, setIsExpand] = useState(xDefaultExpand ?? true);
  const { control } = useFormContext();
  const onExpandToggle = () => {
    setIsExpand(!isExpand);
  };

  const onDelete = () => {
    remove(name);
  };

  const contentCls = cn(
    'flex gap-x-2 w-full justify-between items-center',
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
      <div className="flex items-center">
        <ChevronRightIcon
          onClick={onExpandToggle}
          className={cn('w-5 h-5 text-subtle cursor-pointer ml-auto', {
            'rotate-90': isExpand,
          })}
        />
        <Heading size={xTitleSize} lineClamp={1} className="flex-1 w-28">
          {title}
        </Heading>
      </div>
    ) : (
      <Heading size={xTitleSize} lineClamp={1} className="w-28">
        {title}
      </Heading>
    );
  };

  const renderTitle = () => {
    return (
      <div className="flex items-center">
        <div className="flex-1">{renderCollapsibleTitle()}</div>
        <div className="flex items-center space-x-1">
          {xAddable ? (
            <div
              className="flex items-center cursor-pointer text-primary"
              onClick={onAdd}>
              <div className="w-6 h-6 flex items-center justify-center">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 3.9375C9.31066 3.9375 9.5625 4.18934 9.5625 4.5V8.4375L13.5 8.4375C13.8107 8.4375 14.0625 8.68934 14.0625 9C14.0625 9.31066 13.8107 9.5625 13.5 9.5625L9.5625 9.5625V13.5C9.5625 13.8107 9.31066 14.0625 9 14.0625C8.68934 14.0625 8.4375 13.8107 8.4375 13.5V9.5625L4.5 9.5625C4.18934 9.5625 3.9375 9.31066 3.9375 9C3.9375 8.68934 4.18934 8.4375 4.5 8.4375L8.4375 8.4375V4.5C8.4375 4.18934 8.68934 3.9375 9 3.9375Z" />
                </svg>
              </div>
              Add
            </div>
          ) : null}
        </div>
      </div>
    );
  };

  const renderActions = () =>
    xEditDialog || xDeletable || xSuffix ? (
      <div className="flex gap-x-1.5">
        {xEditDialog ? <EditDialog name={name} schema={xEditDialog} /> : null}
        {xDeletable ? (
          <IconButton
            size="sm"
            color="gray"
            type="button"
            variant="ghost"
            icon={TrashIcon}
            onClick={onDelete}
            className="border-0 hover:bg-surface-accent-gray-subtle focus-visible:ring-0"
          />
        ) : null}
        {xSuffix
          ? React.createElement(components[xSuffix], {
              name,
            })
          : null}
      </div>
    ) : null;

  if (xComponent) {
    return (
      <div className="flex flex-col" data-ui="inline">
        {title ? renderTitle() : null}
        {description ? (
          <Paragraph size="lg" lineClamp={2} color="subtler" className="mt-1">
            {description}
          </Paragraph>
        ) : null}
        <div className={contentCls}>
          {xPrefix
            ? React.createElement(components[xPrefix], {
                name,
              })
            : null}
          <div className="grow">
            <Control name={name} />
          </div>
          {renderActions()}
        </div>
      </div>
    );
  }

  const render = () => {
    return (
      <div className={cn('flex flex-col', xWrapperClass)} data-ui="inline">
        {title ? renderTitle() : null}
        {description ? (
          <Paragraph size="lg" color="subtler" lineClamp={2} className="mt-1">
            {description}
          </Paragraph>
        ) : null}
        <div className={contentCls}>
          {xPrefix
            ? React.createElement(components[xPrefix], {
                name,
              })
            : null}
          {React.Children.map(children, (child, idx) => {
            if (!React.isValidElement(child) || idx > 1) {
              return null;
            }
            return child;
          })}
          {renderActions()}
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

export default Inline;
