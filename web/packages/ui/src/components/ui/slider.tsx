'use client';

import * as SliderPrimitive from '@radix-ui/react-slider';
import * as React from 'react';

import { cn } from '../../lib/utils';

import { NumberInput } from './number-input/number-input';

type Size = 'sm' | 'lg';
const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> & {
    size?: Size;
    wrapperClassName?: string;
  }
>(({ className, size = 'lg', wrapperClassName, ...props }, ref) => (
  <div
    className={cn(
      'w-full p-3 flex justify-center items-center h-10 rounded-lg border border-default bg-surface-search-field shadow-background-default text-sm text-default ring-offset-surface-default hover:border-hovered hover:bg-surface-subtle aria-[invalid=true]:border-critical aria-[invalid=true]:hover:border-surface-critical-hovered aria-[invalid=true]:hover:bg-surface-accent-red-subtlest aria-[invalid=true]:focus-visible:ring-error file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-subtler focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-30',
      wrapperClassName,
    )}>
    <SliderPrimitive.Root
      ref={ref}
      className={cn(
        'relative flex w-full touch-none select-none items-center',
        className,
      )}
      {...props}>
      <SliderPrimitive.Track
        className={cn(
          'relative w-full grow overflow-hidden rounded-full bg-surface-container-hovered data-[disabled]:opacity-30',
          size === 'sm' ? 'h-0.5' : 'h-1.5',
        )}>
        <SliderPrimitive.Range className="absolute h-full bg-surface-primary-default data-[disabled]:opacity-30" />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb
        className={cn(
          'block rounded-full border-surface-primary-default bg-surface-default ring-offset-surface-default transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-1 data-[disabled]:pointer-events-none data-[disabled]:opacity-30',
          size === 'sm' ? 'w-2 h-2 border-[1.5px]' : 'w-5 h-5 border-[3px]',
        )}
      />
    </SliderPrimitive.Root>
  </div>
));
Slider.displayName = SliderPrimitive.Root.displayName;

interface ISliderBaseProps
  extends React.RefAttributes<HTMLSpanElement>,
    Omit<
      SliderPrimitive.SliderProps,
      'value' | 'defaultValue' | 'onValueChange' | 'onValueCommit'
    > {}

interface ISliderSingleProps extends ISliderBaseProps {
  size?: Size;
  value?: number;
  defaultValue?: number;
  inputClassName?: string;
  wrapperClassName?: string;
  onValueChange?: (value: number) => void;
  onValueCommit?: (value: number) => void;
}

const SliderSingle = React.forwardRef<
  React.ElementRef<React.ForwardRefExoticComponent<ISliderSingleProps>>,
  React.ComponentPropsWithoutRef<
    React.ForwardRefExoticComponent<ISliderSingleProps>
  >
>(
  (
    {
      className,
      size = 'lg',
      value,
      defaultValue,
      onValueChange,
      onValueCommit,
      wrapperClassName,
      inputClassName,
      ...props
    },
    ref,
  ) => {
    return (
      <div className="flex w-full items-center space-x-1.5">
        <div
          className={cn(
            'w-full p-3 flex justify-center items-center h-10 rounded-lg	 border border-default bg-surface-search-field shadow-background-default text-sm text-default ring-offset-surface-default hover:border-hovered hover:bg-surface-subtle aria-[invalid=true]:border-critical aria-[invalid=true]:hover:border-surface-critical-hovered aria-[invalid=true]:hover:bg-surface-accent-red-subtlest aria-[invalid=true]:focus-visible:ring-error file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-subtler focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-30',
            wrapperClassName,
          )}>
          <SliderPrimitive.Root
            ref={ref}
            className={cn(
              'relative flex w-full touch-none select-none items-center',
              className,
            )}
            value={typeof value === 'number' ? [value] : undefined}
            defaultValue={
              typeof defaultValue === 'number' ? [defaultValue] : undefined
            }
            onValueChange={(rootValue: number[]) =>
              onValueChange?.(rootValue?.[0])
            }
            onValueCommit={(rootValue: number[]) =>
              onValueCommit?.(rootValue?.[0])
            }
            {...props}>
            <SliderPrimitive.Track
              className={cn(
                'relative w-full grow overflow-hidden rounded-full bg-surface-container-hovered data-[disabled]:opacity-30',
                size === 'sm' ? 'h-0.5' : 'h-1.5',
              )}>
              <SliderPrimitive.Range className="absolute h-full bg-surface-primary-default data-[disabled]:opacity-30" />
            </SliderPrimitive.Track>
            <SliderPrimitive.Thumb
              className={cn(
                'block rounded-full border-surface-primary-default bg-surface-default ring-offset-surface-default transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-1 data-[disabled]:pointer-events-none data-[disabled]:opacity-30',
                size === 'sm'
                  ? 'w-2 h-2 border-[1.5px]'
                  : 'w-5 h-5 border-[3px]',
              )}
            />
          </SliderPrimitive.Root>
        </div>
        <div
          className={cn(
            'flex-shrink-0 w-18 h-9 flex justify-center items-center rounded-lg',
            wrapperClassName,
          )}>
          <NumberInput
            value={typeof value === 'number' ? value : undefined}
            min={props?.min}
            max={props?.max}
            step={props?.step}
            controls={false}
            defaultValue={
              typeof defaultValue === 'number' ? defaultValue : undefined
            }
            inputClassName={inputClassName}
            onChange={e => onValueChange?.(Number(e.target.value))}
          />
        </div>
      </div>
    );
  },
);
SliderSingle.displayName = 'SliderSingle';

export { Slider, SliderSingle };
