import { VariantProps, cva } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import { ClassNameValue } from 'tailwind-merge';

import { cn } from '../../lib/utils';

const spinnerVariants = cva('animate-spin', {
  variants: {
    size: {
      '2xs': 'h-3.5 w-3.5',
      xs: 'h-4 w-4',
      sm: 'h-5 w-5',
      md: 'h-6 w-6',
      lg: 'h-9 w-9',
    },
    speed: {
      slow: 'duration-2000',
      default: 'duration-600',
      fast: 'duration-500',
    },
    color: {
      default: 'text-default',
      brand: 'text-brand',
      static: 'text-static',
      warning: 'text-warning',
      success: 'text-success',
    },
  },
  defaultVariants: {
    size: 'md',
    speed: 'default',
    color: 'default',
  },
});
interface SpinnerProps extends VariantProps<typeof spinnerVariants> {
  className?: ClassNameValue;
}

function Spinner(props: SpinnerProps) {
  const { size, speed, color, className } = props;

  return (
    <Loader2
      className={cn(spinnerVariants({ size, speed, color }), className)}
    />
  );
}

export { Spinner };
