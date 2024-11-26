/* eslint-disable */
import {
  useFormContext,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Button,
  PencilSquare,
  Input,
  Separator,
  Heading,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  FormRef,
} from '@shellagent/ui';
import * as React from 'react';
import { useState, useRef, useMemo, useEffect } from 'react';

import { MemoizedFormEngine } from '../..';
import { ISchema, TValue, TValues } from '../../types';
import { cn } from '../../utils/cn';
import { useFormEngineContext } from '../provider';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export interface IEditTitleProps extends InputProps {
  path: string;
  showDialog?: boolean;
  defaultKey?: string;
  dialogConfig?: {
    title: string;
    schema: ISchema;
  };
  validates?: Array<{
    pattern: string;
    message: string;
  }>;
}

const EditTitle = React.forwardRef<HTMLInputElement, IEditTitleProps>(
  (props, ref) => {
    const formRef = useRef<FormRef>(null);
    const { components } = useFormEngineContext();
    const [isOpenDialog, setIsOpenDialog] = useState(false);
    const { getValues, setValue } = useFormContext();
    const {
      path,
      value,
      defaultValue,
      showDialog,
      dialogConfig,
      validates,
      autoFocus,
      defaultKey,
    } = props;
    const title = value || defaultValue;
    const [formData, setFormData] = useState<TValues>({});
    const [inputValue, setInputValue] = useState<InputProps['value']>(
      (path &&
        (defaultKey ? getValues(path)?.[defaultKey] : getValues(path)?.name)) ||
        title,
    );

    useEffect(() => {
      if (isOpenDialog) {
        setFormData(getValues(path));
      }
    }, [isOpenDialog]);

    const handleEditMode = () => {
      setIsOpenDialog(true);
    };

    const onValuesChange = () => {
      const result = validates?.find(item =>
        new RegExp(item.pattern).test(inputValue as string),
      );
      if (result?.message) {
        // toast.error(result.message);

        return false;
      }

      if (!inputValue) {
        // toast.error('Operation failed: The key is required.');

        return false;
      }

      if (title !== inputValue) {
        props?.onChange?.({ target: { value: inputValue } } as any);
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        onValuesChange();
      }
    };

    const onBlur = () => {
      onValuesChange();
    };

    const onClose = () => {
      setInputValue('');
      setIsOpenDialog(false);
    };

    const onConfirm = () => {
      const { errors = {} } = formRef.current?.formState || {};
      if (Object.keys(errors).length > 0) {
        return;
      } else {
        setValue(path, formData);
        setIsOpenDialog(false);
      }
    };

    const disabled = useMemo(() => {
      const { errors = {} } = formRef.current?.formState || {};
      return Object.keys(errors).length > 0;
    }, [formRef.current?.formState]);

    const getTitle = () => {
      const name =
        path &&
        (defaultKey ? getValues(path)?.[defaultKey] : getValues(path)?.name);
      return name || title || 'Untitled';
    };

    const onFormChange = (values: TValue) => {
      setFormData(values);
    };

    if (!showDialog) {
      return (
        <Input
          ref={ref}
          className={cn(
            'h-7 rounded-lg border border-default bg-surface-search-field p-1.5 text-sm text-default focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-1 aria-[invalid=true]:border-critical aria-[invalid=true]:hover:border-surface-critical-hovered aria-[invalid=true]:hover:bg-surface-accent-red-subtlest aria-[invalid=true]:focus-visible:ring-error',
          )}
          autoFocus={autoFocus}
          onKeyDown={handleKeyDown}
          onBlur={onBlur}
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
        />
      );
    }

    return (
      <div className="flex items-center min-w-0 max-w-full">
        <div className="min-w-0 flex-1 flex items-center">
          <Tooltip>
            <TooltipTrigger type="button" className="w-full">
              <Heading size="h5" className="truncate text-left w-full pr-1">
                {getTitle()}
              </Heading>
            </TooltipTrigger>
            <TooltipContent showArrow={false} side="right">
              {getTitle()}
            </TooltipContent>
          </Tooltip>
        </div>
        <PencilSquare
          size="sm"
          color="subtle"
          className="shrink-0 ml-1 cursor-pointer"
          onClick={handleEditMode}
        />
        <Dialog open={isOpenDialog && showDialog}>
          <DialogContent
            className="max-w-[620px] min-h-[304px] max-h-[508px]"
            onClose={onClose}
            maskClosable={false}>
            <DialogHeader className="border-b">
              <DialogTitle>
                <Heading size="h2">{dialogConfig?.title}</Heading>
              </DialogTitle>
            </DialogHeader>
            <DialogDescription className="px-4 py-3 grid gap-y-1.5 min-h-[160px] max-h-[364px] overflow-y-auto">
              {dialogConfig?.schema && isOpenDialog ? (
                <MemoizedFormEngine
                  ref={formRef}
                  values={formData}
                  parent={path}
                  schema={dialogConfig?.schema}
                  components={components}
                  onChange={onFormChange}
                />
              ) : null}
            </DialogDescription>
            <Separator />
            <DialogFooter className="gap-x-4 min-h-[76px]">
              <Button
                type="button"
                className="min-w-[92px] px-[24px]"
                variant="outline"
                onClick={onClose}>
                Cancel
              </Button>
              <Button
                disabled={disabled}
                type="button"
                className="min-w-[92px] px-[24px]"
                onClick={onConfirm}>
                Confirm
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  },
);

export { EditTitle };
