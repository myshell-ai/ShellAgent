import { cva } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '../../lib/utils';

export type InputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'size'
> & {
  rounded?:
    | 'default'
    | 'none'
    | 'sm'
    | 'md'
    | 'lg'
    | 'xl'
    | '2xl'
    | '3xl'
    | 'full'
    | null
    | undefined;
  size?: 'xs' | 'sm' | 'md' | 'lg' | null | undefined;
  isFull?: boolean;
  border?: 'none' | 'default' | null | undefined;
  shadow?: 'none' | 'default' | null | undefined;
  outline?: 'none' | 'default' | null | undefined;
  background?: 'none' | 'default' | null | undefined;
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      autoComplete = 'off',
      isFull = true,
      rounded = 'lg',
      size = 'sm',
      border = 'default',
      outline = 'default',
      background = 'default',
      shadow = 'default',
      ...props
    },
    ref,
  ) => {
    const { readOnly } = props;

    const inputVariants = cva('', {
      variants: {
        rounded: {
          none: 'rounded-none',
          sm: 'rounded-sm',
          default: 'rounded',
          md: 'rounded-md',
          lg: 'rounded-lg',
          xl: 'rounded-xl',
          '2xl': 'rounded-2xl',
          '3xl': 'rounded-3xl',
          full: 'rounded-full',
        },
        size: {
          lg: 'h-14',
          md: 'h-11',
          sm: 'h-10',
          xs: 'h-9',
          '2xs': 'h-7',
        },
        border: {
          none: 'border-none',
          default: 'border border-default',
        },
        outline: {
          none: 'outline-none',
          default:
            'focus-visible:outline-none aria-[invalid=true]:focus-visible:ring-error focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-1',
        },
        background: {
          none: 'bg-transparent',
          default:
            'bg-surface-search-field hover:bg-surface-search-field hover:bg-surface-subtle',
        },
        shadow: {
          none: 'shadow-none',
          default: 'shadow-background-default',
        },
      },
      defaultVariants: {
        rounded: 'lg',
        size: 'sm',
        border: 'default',
        outline: 'default',
        background: 'default',
      },
    });

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      // if (e.key === 'Enter') {
      //   e.preventDefault();
      // } else {
      props.onKeyDown?.(e);
      // }
    };

    return (
      <input
        type={type}
        className={cn(
          'flex space-x-2 p-3 text-base text-default ring-offset-surface-default hover:border-hovered aria-[invalid=true]:border-critical aria-[invalid=true]:hover:border-surface-critical-hovered aria-[invalid=true]:hover:bg-surface-accent-red-subtlest file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-disabled disabled:cursor-not-allowed disabled:opacity-30',
          inputVariants({ rounded, size, border, outline, background, shadow }),
          {
            'focus-visible:ring-offset-0 focus-visible:ring-transparent hover:bg-surface-search-field hover:border-default':
              readOnly,
          },
          isFull && 'w-full',
          className,
        )}
        autoComplete={autoComplete}
        ref={ref}
        {...props}
        onKeyDown={handleKeyDown}
      />
    );
  },
);
Input.displayName = 'Input';

export { Input };
