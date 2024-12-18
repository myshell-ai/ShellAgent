'use client';
import React, { useState, useRef, Fragment } from 'react';
import { Check, ChevronDown, X, ChevronRight } from 'lucide-react';
import { ClassNameValue } from 'tailwind-merge';
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  useClick,
  useDismiss,
  useRole,
  useInteractions,
  FloatingFocusManager,
  FloatingPortal,
  useHover,
  safePolygon,
} from '@floating-ui/react';

import { cn } from '../../lib/utils';
import { Button } from './button';
import { Text } from './typography';
import { Tooltip, TooltipContent, TooltipTrigger } from './tooltip';

interface CascaderOption {
  label: string;
  value?: string;
  disabled?: boolean;
  children?: CascaderOption[];
  parent?: string;
}

interface P {
  options: CascaderOption[];
  value?: string;
  defaultValue?: string;
  onValueChange: ({
    label,
    value,
    parent,
  }: {
    label: string;
    value: string;
    parent?: string;
  }) => void;
  className?: ClassNameValue;
  showParentLabel?: boolean;
  placeholder?: string;
  emptyText?: string;
  clearByDefault?: boolean;
}

interface CascaderContentProps {
  options: CascaderOption[];
  value?: string;
  onValueChange: ({
    label,
    value,
    parent,
  }: {
    label: string;
    value: string;
    parent?: string;
  }) => void;
  className?: ClassNameValue;
  emptyText?: string;
}

interface NestedMenuProps extends CascaderContentProps {
  option: CascaderOption;
}

function NestedMenu({
  option,
  value,
  onValueChange,
  className,
}: NestedMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [offset({ mainAxis: 0, crossAxis: 0 }), flip(), shift()],
    placement: 'right-start',
    whileElementsMounted: autoUpdate,
  });

  const hover = useHover(context, {
    delay: { open: 75 },
    handleClose: safePolygon(),
  });
  const dismiss = useDismiss(context);
  const role = useRole(context);

  const { getReferenceProps, getFloatingProps } = useInteractions([
    hover,
    dismiss,
    role,
  ]);

  return (
    <div className="relative">
      <div
        ref={refs.setReference}
        {...getReferenceProps()}
        className={cn(
          'px-4 py-2 cursor-pointer hover:bg-gray-100 flex items-center justify-between',
          {
            'bg-surface-container-selected-default': value === option.value,
            'opacity-50 cursor-not-allowed': option.disabled,
          },
        )}>
        <Text size="sm">{option.label}</Text>
        <ChevronRight className="h-4 w-4 text-gray-500" />
      </div>

      {isOpen && (
        <FloatingPortal>
          <div
            ref={refs.setFloating}
            style={floatingStyles}
            {...getFloatingProps()}
            className="bg-white rounded-lg border border-gray-200 shadow-lg">
            <div className="py-1 min-w-[8rem]">
              {option.children?.map(child => (
                <Fragment key={child.value}>
                  {child.children && child.children.length > 0 ? (
                    <NestedMenu
                      option={child}
                      value={value}
                      onValueChange={onValueChange}
                      options={child.children}
                      className={className}
                      emptyText=""
                    />
                  ) : (
                    <div
                      className={cn(
                        'px-4 py-2 cursor-pointer hover:bg-gray-100 flex items-center justify-between',
                        {
                          'bg-surface-container-selected-default':
                            value === child.value,
                          'opacity-50 cursor-not-allowed': child.disabled,
                        },
                      )}
                      onClick={() => {
                        if (!child.disabled) {
                          onValueChange({
                            label: child.label,
                            value: child.value!,
                            parent: child.parent,
                          });
                        }
                      }}>
                      <Text size="sm">{child.label}</Text>
                      {value === child.value && (
                        <Check className="h-4 w-4 text-surface-primary-default" />
                      )}
                    </div>
                  )}
                </Fragment>
              ))}
            </div>
          </div>
        </FloatingPortal>
      )}
    </div>
  );
}

function CascaderContent({
  options,
  value,
  onValueChange,
  className,
  emptyText,
}: CascaderContentProps) {
  if (!options.length) {
    return (
      <div className="text-subtler text-sm text-center p-2">{emptyText}</div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-lg">
      <div className="py-1 min-w-[8rem]">
        {options.map(option => (
          <Fragment key={option.value || option.label}>
            {!option.value ? (
              <>
                {option.children && option.children.length > 0 && (
                  <div className="font-normal text-xs text-subtler">
                    {option.label}
                  </div>
                )}
                {option.children?.map(child => (
                  <Fragment key={child.value}>
                    {child.children && child.children.length > 0 ? (
                      <NestedMenu
                        option={child}
                        value={value}
                        onValueChange={onValueChange}
                        options={child.children}
                        className={className}
                        emptyText=""
                      />
                    ) : (
                      <div
                        className={cn(
                          'px-4 py-2 cursor-pointer hover:bg-gray-100 flex items-center justify-between',
                          {
                            'bg-surface-container-selected-default':
                              value === child.value,
                            'opacity-50 cursor-not-allowed': child.disabled,
                          },
                        )}
                        onClick={() => {
                          if (!child.disabled) {
                            onValueChange({
                              label: child.label,
                              value: child.value!,
                              parent: child.parent,
                            });
                          }
                        }}>
                        <Text size="sm">{child.label}</Text>
                        {value === child.value && (
                          <Check className="h-4 w-4 text-surface-primary-default" />
                        )}
                      </div>
                    )}
                  </Fragment>
                ))}
              </>
            ) : option.children && option.children.length > 0 ? (
              <NestedMenu
                option={option}
                value={value}
                onValueChange={onValueChange}
                options={option.children}
                className={className}
                emptyText=""
              />
            ) : (
              <div
                className={cn(
                  'px-4 py-2 cursor-pointer hover:bg-gray-100 flex items-center justify-between',
                  {
                    'bg-surface-container-selected-default':
                      value === option.value,
                    'opacity-50 cursor-not-allowed': option.disabled,
                  },
                )}
                onClick={() => {
                  if (!option.disabled) {
                    onValueChange({
                      label: option.label,
                      value: option.value!,
                      parent: option.parent,
                    });
                  }
                }}>
                <Text size="sm">{option.label}</Text>
                {value === option.value && (
                  <Check className="h-4 w-4 text-surface-primary-default" />
                )}
              </div>
            )}
          </Fragment>
        ))}
      </div>
    </div>
  );
}

function Cascader(props: P) {
  const {
    options,
    className,
    value,
    defaultValue,
    onValueChange,
    clearByDefault,
    showParentLabel,
    placeholder,
    emptyText,
  } = props;

  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const { refs, floatingStyles, context } = useFloating({
    open,
    onOpenChange: setOpen,
    middleware: [offset(4), flip(), shift()],
    whileElementsMounted: autoUpdate,
  });

  const click = useClick(context);
  const dismiss = useDismiss(context);
  const role = useRole(context);

  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    dismiss,
    role,
  ]);

  return (
    <>
      <Button
        id="cascader-container"
        variant="outline"
        role="combobox"
        ref={refs.setReference}
        {...getReferenceProps()}
        className={cn(
          '!w-full group font-normal !h-7 p-3 rounded-lg border-default bg-surface-search-field shadow-background-default hover:bg-white active:bg-white',
          className,
        )}
        aria-expanded={open}>
        <div className="flex items-center justify-between !w-full">
          <Tooltip>
            <TooltipTrigger asChild>
              <Text
                size="sm"
                className="flex-1 text-default text-ellipsis overflow-hidden whitespace-nowrap">
                {value ? (
                  renderLabel(options, value, showParentLabel)
                ) : (
                  <span className="text-subtler">{placeholder}</span>
                )}
              </Text>
            </TooltipTrigger>
            <TooltipContent>
              {value
                ? renderLabel(options, value, showParentLabel)
                : placeholder}
            </TooltipContent>
          </Tooltip>
          <div className="flex items-center ml-2">
            {value ? (
              <div className="relative">
                <ChevronDown className="h-4 w-4 text-icon-subtle duration-0 group-hover:opacity-0" />
                <X
                  className="absolute top-0 right-0 h-4 w-4 text-icon-subtle opacity-0 group-hover:opacity-100 group-hover:bg-gray-200 group-hover:rounded-full p-1"
                  onClick={e => {
                    e.stopPropagation();
                    onValueChange({
                      label: clearByDefault ? defaultValue! : '',
                      value: clearByDefault ? defaultValue! : '',
                      parent: undefined,
                    });
                  }}
                />
              </div>
            ) : (
              <ChevronDown className="h-4 w-4 text-icon-subtle duration-0" />
            )}
          </div>
        </div>
      </Button>

      {open && (
        <FloatingPortal>
          <FloatingFocusManager context={context} modal={false}>
            <div
              ref={refs.setFloating}
              style={floatingStyles}
              {...getFloatingProps()}>
              <CascaderContent
                options={options}
                value={value}
                onValueChange={({ label, value, parent }) => {
                  onValueChange({ label, value, parent });
                  setOpen(false);
                }}
                className={className}
                emptyText={emptyText}
              />
            </div>
          </FloatingFocusManager>
        </FloatingPortal>
      )}
    </>
  );
}

function renderLabel(
  options: CascaderOption[],
  value: string,
  showParentLabel = false,
  path = '',
): string {
  for (const option of options) {
    if (option.value === value) {
      return showParentLabel
        ? path
          ? `${path}/${option.label}`
          : option.label
        : option.label;
    }

    if (option.children) {
      const childPath = renderLabel(
        option.children,
        value,
        showParentLabel,
        showParentLabel && option.value
          ? path
            ? `${path}/${option.label}`
            : option.label
          : path,
      );
      if (childPath) return childPath;
    }
  }

  return '';
}

export { Cascader, CascaderContent, type CascaderOption };
