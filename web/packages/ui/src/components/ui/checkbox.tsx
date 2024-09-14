'use client';

import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { cva, type VariantProps } from 'class-variance-authority';
import { Check } from 'lucide-react';
import * as React from 'react';

import { cn } from '../../lib/utils';

const checkboxVariants = cva(
  'peer w-5 h-5 shrink-0 border-[1.5px] border-pressed data-[state=checked]:border-surface-primary-default ring-offset-surface-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-30 data-[state=checked]:bg-surface-primary-default data-[state=checked]:text-icon-static disabled:data-[state=checked]:text-disabled disabled:data-[state=checked]:border-none',
  {
    variants: {
      variant: {
        square: 'rounded-sm',
        circle: 'rounded-full',
      },
    },
    defaultVariants: {
      variant: 'square',
    },
  },
);

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> &
    VariantProps<typeof checkboxVariants>
>(({ className, variant, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(checkboxVariants({ variant, className }))}
    {...props}>
    <CheckboxPrimitive.Indicator
      className={cn('flex items-center justify-center text-current')}>
      <Check className="h-3 w-3 stroke-[1.5px]" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
