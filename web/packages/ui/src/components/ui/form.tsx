'use client';
import * as LabelPrimitive from '@radix-ui/react-label';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import * as React from 'react';
import {
  Controller,
  ControllerProps,
  FieldPath,
  FieldValues,
  FormProvider,
  useFormContext,
  FieldValue,
  Mode,
  useForm,
  UseFormReturn,
} from 'react-hook-form';

import { Label } from './label';
import { cn } from '../../lib/utils';

export type FormRef = UseFormReturn;

const Form = React.forwardRef<
  UseFormReturn,
  React.ComponentPropsWithoutRef<any>
>(({ children }, ref) => {
  const methods = useFormContext();

  React.useImperativeHandle(ref, () => ({
    ...methods,
  }));

  return <>{children}</>;
});

Form.displayName = 'Form';

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName;
};

const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue,
);

function FormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({ ...props }: ControllerProps<TFieldValues, TName>) {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
}

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);
  const { getFieldState, formState } = useFormContext();

  const fieldState = getFieldState(fieldContext.name, formState);

  if (!fieldContext) {
    throw new Error('useFormField should be used within <FormField>');
  }

  const { id } = itemContext;

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  };
};

type FormItemContextValue = {
  id: string;
};

const FormItemContext = React.createContext<FormItemContextValue>(
  {} as FormItemContextValue,
);

interface IFormItemProps extends React.HTMLAttributes<HTMLDivElement> {
  layout?: 'Vertical' | 'Horizontal';
}

const formLayoutVariants = cva('', {
  variants: {
    layout: {
      Vertical: 'space-y-1.5',
      Horizontal: 'flex flex-row items-center space-x-3',
    },
  },
  defaultVariants: {
    layout: 'Vertical',
  },
});

const FormItem = React.forwardRef<HTMLDivElement, IFormItemProps>(
  ({ className, layout, ...props }, ref) => {
    const id = React.useId();

    const cls = cn(className, formLayoutVariants({ layout }));

    return (
      <FormItemContext.Provider value={{ id }}>
        <div ref={ref} className={cls} {...props} />
      </FormItemContext.Provider>
    );
  },
);
FormItem.displayName = 'FormItem';

interface IFormLabelProps
  extends React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> {
  required?: boolean;
}

const FormLabel = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  IFormLabelProps
>(({ className, required, children, ...props }, ref) => {
  const { formItemId } = useFormField();

  return (
    <Label ref={ref} className={className} htmlFor={formItemId} {...props}>
      {required ? <span className="text-[#EC2F0D] mr-1">*</span> : null}
      {children}
    </Label>
  );
});
FormLabel.displayName = 'FormLabel';

const FormControl = React.forwardRef<
  React.ElementRef<typeof Slot>,
  React.ComponentPropsWithoutRef<typeof Slot>
>(({ ...props }, ref) => {
  const { error, formItemId, formDescriptionId, formMessageId } =
    useFormField();

  return (
    <Slot
      ref={ref}
      id={formItemId}
      aria-describedby={
        !error
          ? `${formDescriptionId}`
          : `${formDescriptionId} ${formMessageId}`
      }
      aria-invalid={!!error}
      {...props}
    />
  );
});
FormControl.displayName = 'FormControl';

const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  const { formDescriptionId } = useFormField();

  return (
    <p
      ref={ref}
      id={formDescriptionId}
      className={cn('text-sm text-subtler', className)}
      {...props}
    />
  );
});
FormDescription.displayName = 'FormDescription';

const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
  const { error, formMessageId } = useFormField();
  const body = error ? String(error?.message) : children;

  if (!body) {
    return null;
  }

  return (
    <p
      ref={ref}
      id={formMessageId}
      className={cn('text-sm font-medium text-critical', className)}
      {...props}>
      {body}
    </p>
  );
});
FormMessage.displayName = 'FormMessage';

export {
  useForm,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  Form,
  FormField,
  Controller,
  FormProvider,
  useFormContext,
  useFormField,
  type FieldValue,
  type Mode,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
};
