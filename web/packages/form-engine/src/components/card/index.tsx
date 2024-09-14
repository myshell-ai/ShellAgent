import { ChevronRightIcon } from '@heroicons/react/16/solid';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import {
  useFormContext,
  FormField,
  Drag,
  Switch,
  Heading,
  IconButton,
  Button,
} from '@shellagent/ui';
import clsx from 'clsx';
import type { Identifier } from 'dnd-core';
import React, { useRef, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';

import { TValue } from '../../types';
import { cn } from '../../utils/cn';
import { getDefaultValueBySchema } from '../../utils/generate-schema';
import Control from '../control';
import { EditTitle } from '../edit-title';
import { useFormEngineContext } from '../provider';

export interface ICardProps {
  name?: string;
  index?: number;
  children?: React.ReactNode;
  error?: boolean;
}

interface DragItem {
  index: number;
  id: string;
  type: string;
}

/**
 * @param props
 * @returns
 */
const Card: React.FC<ICardProps> = props => {
  const { name = '', index, children, error } = props;
  const { fields, remove, append, reorder, replaceKey, components } =
    useFormEngineContext();
  const { getValues, setValue } = useFormContext();
  const { control } = useFormContext();
  const { schema, parent } = fields[name] || {};
  const [oldValue, setOldValue] = useState();
  const dragRef = useRef<HTMLDivElement>(null);

  const [{ handlerId }, drop] = useDrop<
    DragItem,
    void,
    { handlerId: Identifier | null }
  >({
    accept: parent,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: DragItem) {
      if (!dragRef.current || index === undefined) {
        return;
      }
      const startIndex = item.index;
      const endIndex = index;

      if (startIndex === endIndex) {
        return;
      }
      reorder(name, startIndex, endIndex);
      item.index = endIndex;
    },
  });

  const [{ opacity }, drag, preview] = useDrag(() => ({
    type: parent,
    item: () => {
      return { id: name, index };
    },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
      opacity: monitor.isDragging() ? 0 : 1,
    }),
  }));

  if (!schema) {
    return null;
  }

  const { type, title } = schema;
  const cls =
    'rounded-lg border border-default overflow-hidden bg-surface-subtle';
  const {
    'x-draggable': xDraggable,
    'x-title-editable': xTitleEditable,
    'x-title-component-props': xTitleComponentProps,
    'x-switchable': xSwithable,
    'x-switchable-default': xSwitchableDefault,
    'x-switch-default-value': xSwitchDefaultValue,
    'x-deletable': xDeletable,
    'x-addable': xAddable,
    'x-component': xComponent,
    'x-error-component': xErrorComponent,
    'x-empty': xEmpty,
    'x-hidden': xHidden,
    'x-collapsible': xCollapsible,
    'x-default-expand': xDefaultExpand,
  } = schema;

  const [isExpand, setIsExpand] = useState(xDefaultExpand ?? true);
  const onExpandToggle = () => {
    setIsExpand(!isExpand);
  };
  const [checked, setChecked] = useState(
    !!getValues(name) || xSwitchableDefault,
  );
  const onDelete = () => {
    remove(name);
  };
  const onAdd = () => {
    if (!error) {
      append(name);
    }
  };

  const onKeyChange = (key: string, value?: TValue) => {
    replaceKey(name, key, value);
  };
  const onCheckedChange = (checked: boolean) => {
    if (!checked) {
      setOldValue(getValues(name));
    }

    setValue(
      name,
      checked
        ? oldValue || getDefaultValueBySchema(schema, true)
        : xSwitchDefaultValue,
    );
    setChecked(checked);
  };
  let titleControl: React.ReactElement<
    unknown,
    string | React.JSXElementConstructor<any>
  > | null = null;

  React.Children.forEach(children, child => {
    if (!React.isValidElement(child)) {
      return;
    }
    const { schema: childSchema } = fields[child.props.name] || {};

    if (!childSchema) {
      return;
    }

    const { 'x-role': xRole } = childSchema;

    if (xRole === 'title') {
      titleControl = child;
    }
  });

  if (xTitleEditable) {
    titleControl = (
      <EditTitle
        {...xTitleComponentProps}
        defaultValue={title}
        onChange={e => {
          onKeyChange(e.target.value);
        }}
        path={name}
      />
    );
  }

  const renderTitle = () => {
    if (titleControl) {
      return <div className="flex-1">{titleControl}</div>;
    }

    if (title) {
      return (
        <div className="flex-1">
          <Heading size="h4">{title}</Heading>
        </div>
      );
    }

    if (typeof index === 'number') {
      return (
        <div className="flex-1">
          <Heading size="h4">Item #{index + 1}</Heading>
        </div>
      );
    }

    return null;
  };

  const renderCollapsibleTitle = () => {
    return xCollapsible ? (
      <div className="flex items-center">
        {renderTitle()}
        <ChevronRightIcon
          onClick={onExpandToggle}
          className={cn('w-5 h-5 text-subtle cursor-pointer ml-auto', {
            'rotate-90': isExpand,
          })}
        />
      </div>
    ) : (
      renderTitle()
    );
  };

  drag(drop(dragRef));

  const renderHeader = () => {
    return (
      <div
        className="h-[28px] flex items-center justify-between space-x-1"
        ref={preview as any}>
        <div className="flex items-center space-x-1">
          {xDraggable ? (
            <div
              className="w-6 h-6 flex items-center justify-center cursor-grab"
              role="Handle"
              data-handler-id={handlerId}
              ref={dragRef}>
              <Drag size="md" color="subtle" />
            </div>
          ) : null}
          {renderCollapsibleTitle()}
        </div>
        <div className="flex items-center space-x-1">
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
          {xSwithable ? (
            <Switch
              onCheckedChange={onCheckedChange}
              checked={checked}
              size="sm"
            />
          ) : null}
        </div>
      </div>
    );
  };

  if (xErrorComponent && error) {
    return (
      <div className={cn(cls, { hidden: xHidden })} data-ui="card">
        <div className="p-3 bg-surface-default space-y-4">
          {title ? renderHeader() : null}
        </div>
        {React.createElement(components[xErrorComponent], {})}
        {xAddable && checked ? (
          <Button
            icon={PlusIcon}
            onClick={onAdd}
            variant="outline"
            size="sm"
            className={clsx('rounded-lg mt-1.5 w-18 border-default', {
              'cursor-not-allowed opacity-30': error,
            })}>
            Add
          </Button>
        ) : null}
      </div>
    );
  }

  if (xComponent) {
    return (
      <div className={cn(cls, { hidden: xHidden })} data-ui="card">
        <div className="p-3 bg-surface-subtle space-y-4">
          {title ? renderHeader() : null}
        </div>
        {checked ? (
          <div className="py-2 px-1.5 bg-surface-subtle">
            <Control name={name} />
          </div>
        ) : null}
        {xAddable && checked ? (
          <Button
            icon={PlusIcon}
            onClick={onAdd}
            variant="outline"
            size="sm"
            className={clsx('rounded-lg mt-1.5 w-18 border-default', {
              'cursor-not-allowed opacity-30': error,
            })}>
            Add
          </Button>
        ) : null}
      </div>
    );
  }

  const render = () => {
    return (
      <div className={cls} data-ui="card">
        <div className="p-2 bg-surface-subtle space-y-4 rounded-lg">
          {renderHeader()}
          {checked &&
            React.Children.map(children, child => {
              if (!React.isValidElement(child)) {
                return null;
              }
              const { schema: childSchema } = fields[child.props.name] || {};

              if (!childSchema) {
                return null;
              }

              const { 'x-role': xRole } = childSchema;

              if (xRole !== 'core') {
                return null;
              }

              return child;
            })}
          {checked && React.Children.count(children) === 0 && xEmpty && (
            <div className="h-24 flex flex-col items-center justify-center shadow-surface-default ring-offset-surface-default bg-surface-hovered text-subtle space-y-1 cursor-pointer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 16.875h3.375m0 0h3.375m-3.375 0V13.5m0 3.375v3.375M6 10.5h2.25a2.25 2.25 0 0 0 2.25-2.25V6a2.25 2.25 0 0 0-2.25-2.25H6A2.25 2.25 0 0 0 3.75 6v2.25A2.25 2.25 0 0 0 6 10.5Zm0 9.75h2.25A2.25 2.25 0 0 0 10.5 18v-2.25a2.25 2.25 0 0 0-2.25-2.25H6a2.25 2.25 0 0 0-2.25 2.25V18A2.25 2.25 0 0 0 6 20.25Zm9.75-9.75H18a2.25 2.25 0 0 0 2.25-2.25V6A2.25 2.25 0 0 0 18 3.75h-2.25A2.25 2.25 0 0 0 13.5 6v2.25a2.25 2.25 0 0 0 2.25 2.25Z"
                />
              </svg>
              <div className="text-sm">{xEmpty.text}</div>
            </div>
          )}
        </div>
        {checked && React.Children.count(children) ? (
          <div
            className={cn({
              hidden: !isExpand,
            })}>
            {checked &&
              React.Children.map(children, (child, i) => {
                if (!React.isValidElement(child)) {
                  return null;
                }
                const { schema: childSchema } = fields[child.props.name] || {};

                if (!childSchema) {
                  return null;
                }

                const { 'x-role': xRole, 'x-hidden': xHidden } = childSchema;

                if (xRole === 'core' || xRole === 'title') {
                  return null;
                }

                return !xHidden ? (
                  <div key={i} className="bg-surface-subtle px-2 pb-2">
                    {child}
                  </div>
                ) : (
                  child
                );
              })}
          </div>
        ) : null}
        {xAddable && checked ? (
          <Button
            icon={PlusIcon}
            onClick={onAdd}
            variant="outline"
            size="sm"
            type="button"
            className={clsx('rounded-lg mt-1.5 w-18 border-default', {
              'cursor-not-allowed opacity-30': error,
            })}>
            Add
          </Button>
        ) : null}
      </div>
    );
  };

  return (
    <div
      className={cn({ hidden: xHidden })}
      style={{ opacity }}
      data-ui="card"
      ref={drop as any}>
      {type === 'void' ? (
        render()
      ) : (
        <FormField control={control} name={name} render={render} />
      )}
    </div>
  );
};

export default Card;
