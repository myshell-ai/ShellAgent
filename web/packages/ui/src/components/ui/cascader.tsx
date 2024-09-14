'use client';
import React, { useState } from 'react';
import { Check, ChevronDown, X } from 'lucide-react';
import { Fragment, useRef } from 'react';
import { ClassNameValue } from 'tailwind-merge';

import { cn } from '../../lib/utils';

import { Button } from './button';
import { Text } from './typography';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from './dropdown-menu';

interface CascaderOption {
  label: string;
  value?: string;
  disabled?: boolean;
  children?: CascaderOption[];
}

interface CommonP {
  value?: string;
  defaultValue?: string;
  onValueChange: (value: string) => void;
  className?: ClassNameValue;
}

interface P extends CommonP {
  options: CascaderOption[];
  showParentLabel?: boolean;
  placeholder?: string;
  emptyText?: string;
  clearByDefault?: boolean;
}

function CascaderContent({
  options,
  value,
  onValueChange,
  className,
  emptyText,
}: {
  options: CascaderOption[];
  value?: string;
  onValueChange: (value: string) => void;
  className?: ClassNameValue;
  emptyText?: string;
}) {
  return (
    <DropdownMenuPortal
      container={document.getElementById('cascader-container')}>
      <DropdownMenuContent className={cn(className, 'w-full')}>
        {options.length ? (
          options.map(option => (
            <Fragment key={option.label}>
              {!option.value ? (
                <>
                  {option.children && option.children?.length > 0 && (
                    <Text size="sm" className="text-xs text-subtler">
                      {option.label}
                    </Text>
                  )}
                  {option.children &&
                    option.children.map(child => (
                      <Fragment key={child.label}>
                        {child.children && child.children.length ? (
                          <NestDropdownMenuRender
                            className={className}
                            option={child}
                            value={value}
                            onValueChange={onValueChange}
                          />
                        ) : (
                          <DropdownMenuItem
                            className={cn(
                              'py-1 cursor-pointer text-center font-medium text-default',
                              {
                                'bg-surface-container-selected-default':
                                  value === child.value,
                              },
                            )}
                            onChange={() => onValueChange(child.value!)}>
                            <Text size="sm">{child.label}</Text>
                          </DropdownMenuItem>
                        )}
                      </Fragment>
                    ))}
                </>
              ) : option.children && !!option.children.length ? (
                <NestDropdownMenuRender
                  className={className}
                  option={option}
                  value={value}
                  onValueChange={onValueChange}
                />
              ) : (
                <DropdownMenuItem
                  className={cn(
                    'py-1 cursor-pointer text-center font-medium text-default',
                    {
                      'bg-surface-container-selected-default':
                        value === option.value,
                    },
                  )}
                  onChange={() => onValueChange(option.value!)}>
                  <Text size="sm">{option.label}</Text>
                </DropdownMenuItem>
              )}
            </Fragment>
          ))
        ) : (
          <div className="text-subtler text-sm text-center">{emptyText}</div>
        )}
      </DropdownMenuContent>
    </DropdownMenuPortal>
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
  const conRef = useRef<any>(null);

  return (
    <DropdownMenu onOpenChange={open => setOpen(open)}>
      <DropdownMenuTrigger asChild className="w-full" ref={conRef}>
        <Button
          id="cascader-container"
          variant="outline"
          role="combobox"
          className={cn(
            'group font-normal !h-7 p-3 space-x-1.5 rounded-lg border-default bg-surface-search-field shadow-background-default hover:bg-white active:bg-white justify-between [&>span]:line-clamp-1 [&[data-state=open]>span>span>svg]:rotate-180',
            className,
          )}
          aria-expanded={open}>
          <span className="text-subtler flex items-center justify-between">
            {value ? (
              <Text
                size="sm"
                className="max-w-72 text-ellipsis overflow-hidden whitespace-nowrap">
                {renderLabel(options, value, showParentLabel)}
              </Text>
            ) : (
              placeholder
            )}
            {value ? (
              <div className="relative">
                <ChevronDown className="dropdown-chevron h-4 w-4 text-icon-subtle duration-0 group-hover:opacity-0" />
                <X
                  className="absolute top-0 left-0 h-4 w-4 text-icon-subtle opacity-0 group-hover:opacity-100 group-hover:bg-gray-200 group-hover:rounded-full p-1"
                  onClick={e => {
                    e.stopPropagation();
                    onValueChange(clearByDefault ? defaultValue! : '');
                  }}
                />
              </div>
            ) : (
              <ChevronDown className="dropdown-chevron h-4 w-4 text-icon-subtle duration-0" />
            )}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <CascaderContent
        options={options}
        value={value}
        onValueChange={onValueChange}
        className={className}
        emptyText={emptyText}
      />
    </DropdownMenu>
  );
}

interface NestDropDownP extends CommonP {
  option: CascaderOption;
}

function NestDropdownMenuRender(props: NestDropDownP) {
  const { option, value, onValueChange, className } = props;

  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger className="py-1 cursor-pointer">
        <Text size="sm">{option.label}</Text>
      </DropdownMenuSubTrigger>
      <DropdownMenuPortal>
        <DropdownMenuSubContent
          className={cn(className, 'w-full')}
          sideOffset={10}>
          {option.children!.map(opt => (
            <Fragment key={opt.label}>
              {opt.children && opt.children.length ? (
                <NestDropdownMenuRender
                  className={className}
                  option={opt}
                  value={value}
                  onValueChange={onValueChange}
                />
              ) : opt.disabled ? (
                <DropdownMenuItem
                  className="py-1 justify-between cursor-not-allowed"
                  onClick={e => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}>
                  <Text size="sm" className="text-disabled">
                    {opt.label}
                  </Text>
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem
                  className={cn('py-1 justify-between cursor-pointer', {
                    'bg-surface-container-selected-default':
                      value === opt.value,
                  })}
                  onClick={() => onValueChange(opt.value!)}>
                  <Text size="sm">{opt.label}</Text>
                  {value === opt.value && (
                    <Check className="h-4 w-4 text-surface-primary-default ml-1" />
                  )}
                </DropdownMenuItem>
              )}
            </Fragment>
          ))}
        </DropdownMenuSubContent>
      </DropdownMenuPortal>
    </DropdownMenuSub>
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
      // 如果当前项的值匹配，则返回路径
      return showParentLabel
        ? path
          ? `${path}/${option.label}`
          : option.label
        : option.label;
    }

    // 如果当前项有子项，则递归搜索子项
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
      if (childPath) return childPath; // 如果在子项中找到匹配，则返回构建的路径
    }
  }

  // 如果没有找到匹配项，则返回空字符串
  return '';
}

export { Cascader, CascaderContent, type CascaderOption };
