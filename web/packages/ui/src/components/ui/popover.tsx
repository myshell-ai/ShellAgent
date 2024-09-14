/* eslint-disable react/require-default-props */

'use client';

import * as PopoverPrimitive from '@radix-ui/react-popover';
import * as React from 'react';
import { useState } from 'react';

import { cn } from '../../lib/utils';

// const Popover = ({
//   disabled = false,
//   open,
//   ...props
// }: React.ComponentProps<typeof PopoverPrimitive.Root> & { disabled?: boolean }) => (
//   <PopoverPrimitive.Root open={disabled ? false : open} {...props} />
// );

const PopoverTrigger = PopoverPrimitive.Trigger;

// const PopoverArrow = PopoverPrimitive.Arrow;

interface PopoverContentExs {
  /**
   * 是否展示箭头
   */
  showArrow?: boolean;
  /**
   * 消息类型
   */
  variant?: 'default' | 'info';
  /**
   * 气泡方向
   */
  side?: 'top' | 'right' | 'bottom' | 'left';
  /**
   * 气泡箭头位置
   */
  align?: 'start' | 'center' | 'end';
}

/**
 * PopoverContent
 */
const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content> &
    PopoverContentExs
>(
  (
    {
      className,
      align = 'center',
      variant = 'default',
      side = 'top',
      sideOffset = 4,
      showArrow = true,
      children,
      ...props
    },
    ref,
  ) => (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        ref={ref}
        align={align}
        sideOffset={sideOffset}
        side={side}
        forceMount
        className={cn(
          'relative z-[49] w-fit max-w-72 text-xs mx-4 p-3 text-left rounded-lg border border-opaque shadow-modal-default outline-none data-[state=open]:animate-in [&[data-state=open]>span]:animate-none data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
          variant === 'default'
            ? 'bg-surface-search-field text-subtle'
            : 'bg-surface-accent-yellow-subtle text-warning-bolder',
          className,
        )}
        {...props}>
        {children}
        {showArrow && (
          <PopoverPrimitive.Arrow
            className={cn(
              variant === 'default'
                ? 'fill-surface-search-field'
                : 'fill-surface-accent-yellow-subtle',
            )}
          />
        )}
      </PopoverPrimitive.Content>
    </PopoverPrimitive.Portal>
  ),
);
PopoverContent.displayName = PopoverPrimitive.Content.displayName;

const Popover = ({
  disabled = false,
  open,
  trigger = 'click',
  content,
  children,
  className,
  triggerClassName,
  hasOpenState = false,
  openChangeCallback,
  asChild,
  ...props
}: Omit<React.ComponentProps<typeof PopoverPrimitive.Content>, 'content'> &
  PopoverContentExs & {
    open?: boolean;
    disabled?: boolean;
    trigger?: 'click' | 'hover';
    triggerClassName?: string;
    // pop内容 string或者node
    content?: string | React.ReactNode;
    hasOpenState?: boolean;
    openChangeCallback?: (open: boolean) => void;
  }) => {
  const [isOpen, setIsOpen] = useState(open);

  React.useEffect(() => {
    setIsOpen(open);
  }, [open]);

  return (
    <PopoverPrimitive.Root open={disabled ? false : isOpen}>
      <PopoverTrigger
        asChild={asChild}
        onMouseEnter={() => {
          if (trigger === 'hover' && !isOpen) {
            setIsOpen(!isOpen);
            openChangeCallback && openChangeCallback(!isOpen);
          }
        }}
        onMouseLeave={() => {
          if (trigger === 'hover' && isOpen) {
            setIsOpen(!isOpen);
            openChangeCallback && openChangeCallback(!isOpen);
          }
        }}
        onClick={e => {
          e.stopPropagation();
          e.preventDefault();
          if (trigger === 'click') {
            setIsOpen(!isOpen);
            openChangeCallback && openChangeCallback(!isOpen);
          }
        }}
        className={cn(
          'inline-flex items-center justify-center',
          trigger === 'click' &&
            hasOpenState &&
            'data-[state=open]:bg-surface-hovered',
          triggerClassName,
        )}>
        {children}
      </PopoverTrigger>
      <PopoverContent
        onBlur={e => {
          if (isOpen && !e.relatedTarget) {
            setIsOpen(false);
            openChangeCallback && openChangeCallback(false);
          }
        }}
        {...props}
        className={cn('w-fit max-w-[324px]', className)}
        onCloseAutoFocus={e => e.preventDefault()}>
        {content}
      </PopoverContent>
    </PopoverPrimitive.Root>
  );
};

export { Popover };
