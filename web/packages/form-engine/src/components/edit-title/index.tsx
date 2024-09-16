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
} from '@shellagent/ui';
import * as React from 'react';
import { useState } from 'react';

import { MemoizedFormEngine } from '../..';
import { ISchema, TValue, TValues } from '../../types';
import { cn } from '../../utils/cn';
import { useFormEngineContext } from '../provider';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export interface IEditTitleProps extends InputProps {
  path: string;
  showDialog?: boolean;
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
    const { components, replaceKey } = useFormEngineContext();
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
    } = props;
    const title = value || defaultValue;
    const [formData, setFormData] = useState<TValues>(getValues(path));
    const [inputValue, setInputValue] = useState<InputProps['value']>(
      (path && getValues(path)?.name) || title,
    );

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
      const { __changeKey__, ...data } = formData;
      if (__changeKey__) {
        replaceKey(path, __changeKey__, data);
      } else {
        setValue(path, formData);
      }
      setIsOpenDialog(false);
    };

    const getTitle = () => {
      const name = path && getValues(path)?.name;
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
      <div className="max-w-36 flex items-center">
        <Tooltip>
          <TooltipTrigger type="button">
            <Heading size="h5" className="max-w-28 truncate">
              {getTitle()}
            </Heading>
          </TooltipTrigger>
          <TooltipContent>{getTitle()}</TooltipContent>
        </Tooltip>
        <PencilSquare
          size="sm"
          color="subtle"
          className="ml-1"
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
