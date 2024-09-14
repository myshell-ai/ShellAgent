'use client';

import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import * as React from 'react';

import { cn } from '../../lib/utils';

const TooltipProvider = TooltipPrimitive.Provider;

const TooltipTrigger = TooltipPrimitive.Trigger;
const TooltipArrow = TooltipPrimitive.Arrow;
const TooltipPortal = TooltipPrimitive.Portal;

const Tooltip = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Root> & {
    open?: boolean;
    defaultOpen?: boolean;
  }
>(({ open, defaultOpen, ...props }, ref) => (
  <TooltipProvider>
    <TooltipPrimitive.Root {...props} open={open} defaultOpen={defaultOpen}>
      {props.children}
    </TooltipPrimitive.Root>
  </TooltipProvider>
));
Tooltip.displayName = TooltipPrimitive.Root.displayName;

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content> & {
    showArrow?: boolean;
    type?: 'default' | 'info';
    /**
     * 气泡方向
     */
    side?: 'top' | 'right' | 'bottom' | 'left';
    /**
     * 气泡箭头位置
     */
    align?: 'start' | 'center' | 'end';
  }
>(
  (
    {
      className,
      type = 'default',
      align = 'center',
      side = 'top',
      sideOffset = 4,
      showArrow = true,
      ...props
    },
    ref,
  ) => (
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        'w-fit max-w-70 max-h-44 overflow-y-auto z-50 rounded-lg shadow-modal-bolder border border-opaque mx-4 px-3 py-2 text-sm fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
        showArrow ? '' : 'animate-in',
        type === 'default'
          ? 'bg-surface-search-field text-subtle'
          : 'bg-surface-accent-yellow-subtle text-warning-bolder',
        className,
      )}
      side={side}
      align={align}
      {...props}>
      {props.children}
      {showArrow && (
        <TooltipArrow
          className={cn(
            type === 'default'
              ? 'fill-surface-search-field'
              : 'fill-surface-accent-yellow-subtle',
          )}
          width={16}
          height={6}
        />
      )}
    </TooltipPrimitive.Content>
  ),
);
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export {
  Tooltip,
  TooltipArrow,
  TooltipContent,
  TooltipPortal,
  TooltipProvider,
  TooltipTrigger,
};
