'use client';

import * as AccordionPrimitive from '@radix-ui/react-accordion';
import * as React from 'react';
import { ClassNameValue } from 'tailwind-merge';

import { cn } from '../../lib/utils';

import { Icon } from './icon';
import { IconButton } from './icon-button';
import { Text } from './typography';
import DownIcon from './icons/solid/arrow-down';

const Accordion = AccordionPrimitive.Root;

export type AccordionItemProps = React.ComponentPropsWithoutRef<
  typeof AccordionPrimitive.Item
> & {
  count?: number;
  label?: string;
  headerClassName?: ClassNameValue;
  triggerClassName?: ClassNameValue;
  sticky?: boolean;
  children: React.ReactNode;
};
const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  AccordionItemProps
>((props, ref) => {
  const { className, triggerClassName, sticky, children, label, count } = props;

  return (
    <AccordionPrimitive.Item
      ref={ref}
      className={cn('w-full', className)}
      {...props}>
      <AccordionTrigger
        label={label}
        count={count}
        className={triggerClassName as string}
        sticky={sticky}
      />
      <AccordionContent>{children}</AccordionContent>
    </AccordionPrimitive.Item>
  );
});

AccordionItem.displayName = 'AccordionItem';

type AccordionTriggerProps = React.ComponentPropsWithoutRef<
  typeof AccordionPrimitive.Trigger
> & {
  count?: number;
  label?: string;
  sticky?: boolean;
  headerClassName?: ClassNameValue;
};
const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  AccordionTriggerProps
>((props, ref) => {
  const { className, headerClassName, count, label, sticky, ...rest } = props;

  return (
    <AccordionPrimitive.Header
      className={cn('flex', headerClassName, sticky && 'sticky top-0 z-10')}>
      <AccordionPrimitive.Trigger
        ref={ref}
        {...rest}
        className={cn(
          'flex flex-1 items-center justify-between font-medium transition-all [&[data-state=closed]>div>div>div>span>svg]:-rotate-90',
          className,
        )}>
        <div className="w-full flex flex-col justify-center">
          <div className="w-full flex justify-between items-center py-2 hover:bg-surface-hovered rounded-md">
            <div className="flex justify-center items-center space-x-1">
              <IconButton
                asChild
                size="sm"
                variant="ghost"
                icon={DownIcon}
                id="iconButton"
                className="iconButton flex-shrink-0 !w-5 !h-5"
              />
              <Text
                size="sm"
                weight="regular"
                className="truncate text-left flex-1">
                {label}
              </Text>
            </div>
            {count ? (
              <Text size="sm" color="subtlest" className="flex-shrink-0">
                {count}
              </Text>
            ) : null}
          </div>
        </div>
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
});
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    {...props}
    className="overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
    <div className={cn(className)}>{children}</div>
  </AccordionPrimitive.Content>
));

AccordionContent.displayName = AccordionPrimitive.Content.displayName;

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger };
