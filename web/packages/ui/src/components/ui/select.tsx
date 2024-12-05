/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable react/display-name */

'use client';

import { CheckIcon } from '@heroicons/react/24/outline';
import * as SelectPrimitive from '@radix-ui/react-select';
import { ChevronDown, ChevronUp } from 'lucide-react';
import * as React from 'react';

import { cn } from '../../lib/utils';
// import { SearchBar } from './search-bar';
// import { debounce } from 'lodash-es';
// import { useDebounce } from 'ahooks';

export interface ISelectProps extends SelectPrimitive.SelectProps {
  options?: Array<{
    value: string;
    label: string;
    icon?: React.ReactNode;
    disabled?: boolean;
  }>;
  placeholder?: React.ReactNode;
  triggerClassName?: string;
}

const Select = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Root>,
  ISelectProps
>(({ children, placeholder, options, triggerClassName, ...props }, ref) => {
  const icon = options?.find(item => item.value === props.value)?.icon;
  // const [query, setQuery] = React.useState('');
  // const [list, setList] = React.useState<ISelectProps['options']>(options);

  // const onSearch = debounce((value: string) => {
  //   if (value) {
  //     const filterList = options?.filter(item => item.label.includes(value) || item.value.includes(value)) || [];
  //     setList(filterList);
  //   } else {
  //     setList(options);
  //   }
  // }, 300);

  return (
    <SelectPrimitive.Root {...props}>
      {Array.isArray(options) ? (
        <>
          <SelectTrigger className={cn('w-full', triggerClassName)}>
            <div
              className={cn(
                'flex items-center max-w-72 overflow-hidden whitespace-nowrap',
                props.value ? '' : 'text-subtler',
              )}>
              <SelectIcon icon={icon} />
              <SelectValue placeholder={placeholder} />
            </div>
          </SelectTrigger>
          {Array.isArray(options) && options.length ? (
            <SelectContent
              style={{ zIndex: 9999 }}
              className="max-h-[500px] overflow-y-auto">
              {/* <SearchBar
                autoFocus
                value={query}
                onChange={e => {
                  setQuery(e.target.value);
                }}
                placeholder='Enter to search'
                className="h-7 w-full text-sm"
                onSearchChange={() => onSearch(query)}
              /> */}
              {options?.map(({ label, value, icon, disabled }, i) => (
                <SelectItem
                  key={`${value}_${i}`}
                  value={value}
                  icon={icon}
                  disabled={disabled}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          ) : null}
        </>
      ) : null}
      {children}
    </SelectPrimitive.Root>
  );
});

const SelectGroup = SelectPrimitive.Group;

const SelectValue = SelectPrimitive.Value;

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      'flex h-10 w-full items-center justify-between rounded-lg border border-default bg-surface-search-field text-default text-sm shadow-background-default p-3 ring-offset-surface-default placeholder:text-subtler focus:outline-none focus:ring-0 focus:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-30 [&>span]:line-clamp-1 [&>.select-chevron]:aria-expanded:rotate-180',
      className,
    )}
    {...props}>
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="select-chevron h-5 w-5 text-icon-subtle duration-200" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn(
      'flex cursor-default items-center justify-center py-1',
      className,
    )}
    {...props}>
    <ChevronUp className="h-4 w-4" />
  </SelectPrimitive.ScrollUpButton>
));
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName;

const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn(
      'flex cursor-default items-center justify-center py-1',
      className,
    )}
    {...props}>
    <ChevronDown className="h-4 w-4" />
  </SelectPrimitive.ScrollDownButton>
));
SelectScrollDownButton.displayName =
  SelectPrimitive.ScrollDownButton.displayName;

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = 'popper', ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        'relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-lg	border border-opaque bg-surface-default text-default shadow-modal-default data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
        position === 'popper' &&
          'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1',
        className,
      )}
      position={position}
      {...props}>
      {/* <SelectScrollUpButton /> */}
      <SelectPrimitive.Viewport
        className={cn(
          'p-2 space-y-1',
          position === 'popper' &&
            'h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]',
        )}>
        {children}
      </SelectPrimitive.Viewport>
      {/* <SelectScrollDownButton /> */}
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
));
SelectContent.displayName = SelectPrimitive.Content.displayName;

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn('py-1 px-3 text-sm font-medium text-subtler', className)}
    {...props}
  />
));
SelectLabel.displayName = SelectPrimitive.Label.displayName;

interface ISelectIconProps {
  icon?: React.ReactNode;
}

function SelectIcon(props: ISelectIconProps) {
  const { icon } = props;

  if (!icon) {
    return null;
  }

  return (
    <SelectPrimitive.Icon>
      <div
        className="aspect-[24/24] w-6 h-6 relative bg-cover bg-no-repeat rounded-md overflow-hidden mr-4"
        style={{ backgroundImage: `url('${icon}')` }}
      />
    </SelectPrimitive.Icon>
  );
}
SelectIcon.displayName = SelectPrimitive.Icon.displayName;

interface ISelectItemProps
  extends SelectPrimitive.SelectItemProps,
    ISelectIconProps {}

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  ISelectItemProps
>(({ className, children, icon, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      'relative flex justify-between w-full cursor-pointer select-none items-center rounded-lg py-1 px-3 outline-none focus:bg-surface-container-selected-default focus:text-default data-[disabled]:pointer-events-none data-[disabled]:opacity-30',
      className,
    )}
    {...props}>
    <span className="flex items-center grow">
      <SelectIcon icon={icon} />
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </span>
    <span className="flex h-4 w-4 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <CheckIcon className="h-4 w-4 text-brand stroke-[2px]" />
      </SelectPrimitive.ItemIndicator>
    </span>
  </SelectPrimitive.Item>
));
SelectItem.displayName = SelectPrimitive.Item.displayName;

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn('-mx-1 my-1 h-px bg-border-default', className)}
    {...props}
  />
));
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
};
