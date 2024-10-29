/* eslint-disable react/require-default-props */
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import * as React from 'react';

import { cn } from '../../lib/utils';

import { Icon } from './icon';

const buttonVariants = cva(
  'relative shrink-0 inline-flex items-center justify-center whitespace-nowrap rounded-full font-medium transition-colors ring-offset-surface-default focus-visible:outline-none focus-visible:shadow-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-30 disabled:shadow-none',
  {
    variants: {
      variant: {
        primary:
          'text-static bg-surface-primary-default shadow-button-primary hover:bg-surface-primary-hovered active:bg-surface-primary-pressed',
        outline: 'border hover:bg-surface-hovered active:bg-surface-pressed',
        static:
          'bg-static border hover:bg-surface-hoverd-static active:bg-surface-pressed-static',
        link: 'rounded-none font-normal underline-offset-4 hover:underline active:underline',
        plain:
          'rounded-md font-medium hover:bg-surface-hovered active:bg-surface-pressed',
      },
      color: {
        default: '',
        brand: '',
        warning: '',
        error: '',
        gray: '',
      },
      size: {
        lg: '',
        md: '',
        sm: '',
      },
    },
    compoundVariants: [
      {
        variant: 'primary',
        size: 'lg',
        className: 'h-11 min-w-11 px-6',
      },
      {
        variant: 'primary',
        size: 'md',
        className: 'h-9 min-w-9 px-4 text-sm',
      },
      {
        variant: 'primary',
        size: 'sm',
        className: 'h-7 min-w-7 px-3 text-sm',
      },
      {
        variant: 'primary',
        color: 'default',
        className:
          'text-brand bg-surface-search-field border border-default hover:bg-surface-hovered active:bg-surface-pressed active:shadow-button-pressed shadow-button-basic',
      },
      {
        variant: 'primary',
        color: 'brand',
        className:
          'bg-surface-primary-default hover:bg-surface-primary-hovered active:bg-surface-primary-pressed',
      },
      {
        variant: 'primary',
        color: 'warning',
        className:
          'bg-surface-warning-default hover:bg-surface-warning-hovered active:bg-surface-warning-pressed',
      },
      {
        variant: 'primary',
        color: 'error',
        className:
          'bg-surface-critical-default hover:bg-surface-critical-hovered active:bg-surface-critical-pressed',
      },
      {
        variant: 'primary',
        color: 'gray',
        className:
          'text-subtle bg-surface-search-field border border-default hover:bg-surface-hovered active:bg-surface-pressed shadow-button-basic',
      },
      {
        variant: 'static',
        color: 'default',
        className: 'text-static-black',
      },
      {
        variant: 'static',
        color: 'brand',
        className: 'text-brand',
      },
      {
        variant: 'static',
        color: 'warning',
        className: 'text-warning',
      },
      {
        variant: 'static',
        color: 'error',
        className: 'text-critical',
      },
      {
        variant: 'static',
        color: 'gray',
        className: 'text-subtler',
      },
      {
        variant: 'outline',
        color: 'default',
        className:
          'border-default text-subtle shadow-button-basic active:shadow-button-pressed',
      },
      {
        variant: 'outline',
        color: 'brand',
        className: 'border-surface-primary-default text-brand',
      },
      {
        variant: 'outline',
        color: 'warning',
        className:
          'border-surface-warning-default text-warning hover:bg-surface-warning-subtle-hovered active:bg-surface-warning-subtle-pressed',
      },
      {
        variant: 'outline',
        color: 'error',
        className:
          'border-surface-critical-default text-critical hover:bg-surface-critical-subtle-hovered active:bg-surface-critical-subtle-pressed',
      },
      {
        variant: 'outline',
        color: 'gray',
        className:
          'text-subtle hover:bg-surface-hovered active:shadow-button-pressed',
      },
      {
        variant: 'outline',
        size: 'lg',
        className: 'h-11 min-w-11 px-6',
      },
      {
        variant: 'outline',
        size: 'md',
        className: 'h-9 min-w-9 px-4 text-sm',
      },
      {
        variant: 'outline',
        size: 'sm',
        className: 'h-7 min-w-7 px-3 text-sm',
      },
      {
        variant: 'static',
        size: 'lg',
        className: 'h-11 min-w-11 px-6',
      },
      {
        variant: 'static',
        size: 'md',
        className: 'h-9 min-w-9 px-4 text-sm',
      },
      {
        variant: 'static',
        size: 'sm',
        className: 'h-7 min-w-7 px-3 text-sm',
      },
      {
        variant: 'link',
        className: 'h-fit w-fit min-w-auto px-0.5 py-0.5',
      },
      {
        variant: 'link',
        color: 'default',
        className: 'text-default',
      },
      {
        variant: 'link',
        color: 'brand',
        className: 'text-brand',
      },
      {
        variant: 'link',
        color: 'warning',
        className: 'text-warning',
      },
      {
        variant: 'link',
        color: 'error',
        className: 'text-critical',
      },
      {
        variant: 'link',
        color: 'gray',
        className: 'text-subtler hover:text-subtler',
      },
      {
        variant: 'link',
        size: 'lg',
        className: 'h-fit w-fit px-0.5 py-0.5 text-base',
      },
      {
        variant: 'link',
        size: 'md',
        className: 'h-fit w-fit px-0.5 py-0.5 text-sm',
      },
      {
        variant: 'plain',
        className: 'h-fit w-fit min-w-auto px-0.5 py-0.5',
      },
      {
        variant: 'plain',
        color: 'default',
        className: 'text-default',
      },
      {
        variant: 'plain',
        color: 'brand',
        className: 'text-brand',
      },
      {
        variant: 'plain',
        color: 'warning',
        className: 'text-warning',
      },
      {
        variant: 'plain',
        color: 'error',
        className: 'text-critical',
      },
      {
        variant: 'plain',
        color: 'gray',
        className: 'text-subtler hover:text-subtle active:text-subtle',
      },
      {
        variant: 'plain',
        size: 'lg',
        className: 'h-fit w-fit px-0.5 py-0.5 text-base',
      },
      {
        variant: 'plain',
        size: 'md',
        className: 'h-fit w-fit px-0.5 py-0.5 text-sm',
      },
      {
        variant: 'plain',
        size: 'sm',
        className: 'h-fit w-fit px-0.5 py-0.5 text-sm',
      },
    ],
    defaultVariants: {
      variant: 'primary',
      color: 'default',
      size: 'lg',
    },
  },
);
const iconVariants = cva(
  'relative shrink-0 text-inherit inline-flex items-center justify-center whitespace-nowrap transition-colors ring-offset-surface-default',
  {
    variants: {
      variant: {
        primary: '',
        outline: '',
        link: 'font-normal',
        plain: 'font-medium',
        static: '',
      },
      size: {
        lg: 'text-base w-5 h-5',
        md: 'text-sm w-4.5 h-4.5',
        sm: 'text-sm w-4 h-4',
      },
    },
    compoundVariants: [
      {
        variant: 'plain',
        size: 'lg',
        className: 'text-base w-4.5 h-4.5',
      },
      {
        variant: 'plain',
        size: 'md',
        className: 'text-sm w-4 h-4',
      },
      {
        variant: 'plain',
        size: 'md',
        className: 'text-sm',
      },
    ],
    defaultVariants: {
      variant: 'primary',
      size: 'lg',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  icon?: React.ElementType;
  iconDirection?: 'left' | 'right';
  color?: 'default' | 'brand' | 'warning' | 'error' | 'gray';
  noStyle?: boolean;
  iconClassName?: string;
  iconOutBox?: boolean;
  isBlock?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = '',
      iconClassName,
      variant,
      color = 'brand',
      icon,
      iconDirection = 'left',
      size,
      asChild = false,
      loading = false,
      noStyle = false,
      iconOutBox = false,
      isBlock = false,
      disabled,
      children,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : 'button';
    const disable = disabled || loading;

    return (
      <Comp
        className={
          noStyle
            ? className
            : cn(
                buttonVariants({ variant, color, size, className }),
                disable && 'cursor-not-allowed !pointer-events-auto',
                isBlock && 'w-full',
              )
        }
        ref={ref}
        disabled={disable}
        {...props}>
        {loading && (
          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <Loader2
              className={cn(
                iconVariants({ variant, size }),
                'animate-spin',
                size === 'lg'
                  ? 'w-6 h-6'
                  : size === 'md'
                  ? 'w-5 h-5'
                  : 'w-4.5 h-4.5',
              )}
            />
          </span>
        )}
        {icon &&
          iconOutBox &&
          iconDirection === 'left' &&
          renderIcon(icon, 'left', {
            loading,
            noStyle,
            iconClassName,
            variant,
            color,
            size,
          })}
        <span
          className={cn(
            'w-full inline-flex items-center justify-center',
            loading ? 'opacity-0' : 'opacity-100',
            variant === 'plain' && 'font-medium',
          )}>
          {icon &&
            !iconOutBox &&
            iconDirection === 'left' &&
            renderIcon(icon, 'left', {
              loading,
              noStyle,
              iconClassName,
              variant,
              color,
              size,
            })}
          {children}
          {icon &&
            !iconOutBox &&
            iconDirection === 'right' &&
            renderIcon(icon, 'right', {
              loading,
              noStyle,
              iconClassName,
              variant,
              color,
              size,
            })}
        </span>
        {icon &&
          iconOutBox &&
          iconDirection === 'right' &&
          renderIcon(icon, 'right', {
            loading,
            noStyle,
            iconClassName,
            variant,
            color,
            size,
          })}
      </Comp>
    );
  },
);
const renderIcon = (
  icon: React.ElementType,
  direction: 'left' | 'right',
  {
    loading,
    noStyle,
    iconClassName,
    variant = 'primary',
    color = 'brand',
    size = 'lg',
  }: ButtonProps,
) => (
  <Icon
    component={icon}
    className={
      noStyle
        ? iconClassName
        : cn(
            iconVariants({ variant, size }),
            variant === 'plain' || variant === 'link'
              ? direction === 'left'
                ? 'mr-0.5'
                : 'ml-0.5'
              : direction === 'left'
              ? 'mr-1.5'
              : 'ml-1.5',

            iconClassName,
            loading ? 'opacity-0' : 'opacity-100',
          )
    }
  />
);
Button.displayName = 'Button';

export { Button, buttonVariants };
