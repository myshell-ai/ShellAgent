import { Decimal } from 'decimal.js';
import React from 'react';

import { cn } from '../../../lib/utils.ts';

import { Input } from '../input.tsx';
import { calculateNearestValue } from './number-input-utils.ts';

export type INumberInputProps = Omit<
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
  controls?: boolean;
  inputClassName?: string;
};

enum Operation {
  minus = 'minus',
  plus = 'plus',
}

const NumberInput = React.forwardRef<HTMLInputElement, INumberInputProps>(
  ({ className, type, controls, inputClassName, ...props }, ref) => {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const { min, max, step = 1, onChange } = props;
    const hideControls = controls === false;
    const updateValue = (event: any, operation?: Operation) => {
      event.stopPropagation();
      event.preventDefault();
      const inputElement = inputRef.current;

      if (inputElement) {
        if (operation) {
          const decimalValue = new Decimal(inputElement?.value || 0);
          const decimalStep = new Decimal(step);
          const newValue = (
            operation ? decimalValue[operation](decimalStep) : decimalValue
          ).toNumber();
          inputElement.value = newValue.toString();
        }
        if (!Number.isNaN(Number(inputElement.value))) {
          onChange?.({
            target: {
              value:
                inputElement.value === '' ? '' : Number(inputElement.value),
            },
          } as unknown as React.ChangeEvent<HTMLInputElement>);
        }
      }
    };

    const onBlur = (e: any) => {
      const newValue = e.target.value;
      const inputElement = inputRef.current;
      if (!inputElement) {
        return;
      }
      const val = calculateNearestValue(
        Number(newValue),
        Number(min),
        Number(max),
        Number(step),
      );
      inputElement.value = String(val);
      onChange?.({
        target: { value: Number(inputElement.value) },
      } as unknown as React.ChangeEvent<HTMLInputElement>);
    };

    const handleIncrement = (e: any) => updateValue(e, Operation.plus);
    const handleDecrement = (e: any) => updateValue(e, Operation.minus);

    return (
      <div className={cn('relative w-full', className)}>
        <Input
          type="number"
          ref={inputRef}
          {...props}
          value={props.value}
          onChange={updateValue}
          className={cn(`pr-10`, inputClassName)}
          onBlur={onBlur}
        />
        {hideControls ? null : (
          <div className="absolute top-0 right-3 py-2.5 h-full flex flex-col items-center justify-center space-y-0.5">
            <div
              className="text-on-surface bg-surface-accent-gray-subtler rounded-full w-[22px] h-[14px] cursor-pointer flex justify-center items-center"
              onClick={handleIncrement}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="14"
                viewBox="0 0 20 14"
                fill="none">
                <path
                  d="M6.90169 9H13.0983C13.8493 9 14.27 8.24649 13.806 7.7324L10.7077 4.29945C10.3474 3.90018 9.65265 3.90018 9.29231 4.29945L6.19399 7.7324C5.73001 8.24649 6.15069 9 6.90169 9Z"
                  fill="#414345"
                />
              </svg>
            </div>
            <div
              className="text-on-surface bg-surface-accent-gray-subtler rounded-full w-[22px] h-[14px] cursor-pointer flex justify-center items-center"
              onClick={handleDecrement}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="14"
                viewBox="0 0 20 14"
                fill="none">
                <path
                  d="M13.0983 5L6.90169 5C6.15069 5 5.73001 5.75351 6.19399 6.2676L9.29231 9.70055C9.65265 10.0998 10.3474 10.0998 10.7077 9.70055L13.806 6.2676C14.27 5.75351 13.8493 5 13.0983 5Z"
                  fill="#414345"
                />
              </svg>
            </div>
          </div>
        )}
      </div>
    );
  },
);
NumberInput.displayName = 'NumberInput';

export { NumberInput };
