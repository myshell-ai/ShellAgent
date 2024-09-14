import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '../../lib/utils';

const iconVariants = cva('inline-flex shrink-0', {
  variants: {
    size: {
      '2xs': 'w-3 h-3', // 12
      xs: 'w-3.5 h-3.5', // 14
      sm: 'w-4 h-4', // 16
      md: 'w-4.5 h-4.5', // 18
      lg: 'w-5 h-5', // 20
      xl: 'w-5.5 h-5.5', // 22
      '2xl': 'w-6 h-6', // 24
      '3xl': 'w-7 h-7', // 28
      '4xl': 'w-8 h-8', // 32
      '5xl': 'w-9 h-9', // 36
      '6xl': 'w-10 h-10', // 40
      '7xl': 'w-12 h-12', // 48
    },
    color: {
      default: 'text-default',
      subtle: 'text-subtle',
      subtlest: 'text-subtlest',
      disabled: 'text-disabled',
      inverse: 'text-inverse',
      static: 'text-static',
      brand: 'text-brand',
      critical: 'text-critical',
      warning: 'text-warning',
      success: 'text-success',
    },
    rotate: {
      '45': 'rotate-45',
      '90': 'rotate-90',
      '-45': '-rotate-45',
      '-90': '-rotate-90',
      '180': 'rotate-180',
    },
  },
  defaultVariants: {
    size: 'sm',
    color: 'default',
  },
});

export type IconProps = React.HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof iconVariants> & {
    /**
     * icon 组件 优先heroicons
     */
    component?: React.ElementType;
  };

const Icon = React.forwardRef<HTMLSpanElement, IconProps>((props, ref) => {
  const { children, component, size, color, rotate, className, ...passProps } =
    props;
  const Com = component || 'span';

  return (
    <Com
      ref={ref}
      {...passProps}
      className={cn(iconVariants({ size, color, rotate }), className)}>
      {children}
    </Com>
  );
});
Icon.displayName = 'Icon';

export type Icon = React.ForwardRefExoticComponent<IconProps>;
export { Icon };
