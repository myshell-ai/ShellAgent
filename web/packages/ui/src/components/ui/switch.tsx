'use client';

import * as SwitchPrimitives from '@radix-ui/react-switch';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '../../lib/utils';

const switchRootVariants = cva(
  'peer inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors ring-offset-surface-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 data-[state=unchecked]:focus-visible:bg-surface-container-pressed disabled:cursor-not-allowed disabled:opacity-30 data-[state=checked]:bg-surface-primary-default data-[state=unchecked]:bg-surface-container-pressed',
  {
    variants: {
      size: {
        sm: 'w-7 h-4',
        md: 'w-[34px] h-5',
        lg: 'w-10 h-6',
      },
    },
    defaultVariants: {
      size: 'lg',
    },
  },
);

const switchThumbVariants = cva(
  'pointer-events-none block rounded-full bg-surface-default ring-0 transition-transform data-[state=unchecked]:translate-x-0',
  {
    variants: {
      size: {
        sm: 'w-3 h-3 data-[state=checked]:translate-x-3',
        md: 'w-4 h-4 data-[state=checked]:translate-x-[14px]',
        lg: 'w-5 h-5 data-[state=checked]:translate-x-4',
      },
    },
    defaultVariants: {
      size: 'lg',
    },
  },
);

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root> &
    VariantProps<typeof switchRootVariants>
>(({ className, size, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(switchRootVariants({ size, className }), className)}
    {...props}
    ref={ref}>
    <SwitchPrimitives.Thumb className={cn(switchThumbVariants({ size }))} />
  </SwitchPrimitives.Root>
));
Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };
