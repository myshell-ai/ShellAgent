import * as React from 'react';

import { cn } from '../../lib/utils';

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;
const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, maxLength, ...props }, ref) => (
    <div className="relative">
      <textarea
        className={cn(
          'w-full min-h-[123px] p-3 pb-10 rounded-lg border border-default bg-surface-search-field shadow-background-default text-sm text-default ring-offset-surface-default hover:border-hovered hover:bg-surface-subtle aria-[invalid=true]:border-critical aria-[invalid=true]:hover:border-surface-critical-hovered aria-[invalid=true]:hover:bg-surface-accent-red-subtlest aria-[invalid=true]:focus-visible:ring-error file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-subtler focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-30',
          className,
        )}
        ref={ref}
        maxLength={maxLength}
        {...props}
      />
      {maxLength ? (
        <div className="absolute text-right bottom-5 right-4 border-default">
          <span className="text-subtlest text-sm">{`${
            props.value?.toString()?.length || 0
          }/${maxLength}`}</span>
        </div>
      ) : null}
    </div>
  ),
);
Textarea.displayName = 'Textarea';

export { Textarea };
