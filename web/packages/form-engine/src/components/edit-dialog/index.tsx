import { Cog8ToothIcon } from '@heroicons/react/24/outline';
import {
  Button,
  Dialog,
  DialogTrigger,
  DialogPortal,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogOverlay,
  Separator,
  Heading,
  useFormContext,
  IconButton,
} from '@shellagent/ui';
import * as React from 'react';
import { useState } from 'react';

import { MemoizedFormEngine } from '../..';
import { ISchema, TValue, TValues, TFieldMode } from '../../types';
import { useFormEngineContext } from '../provider';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export interface IEditDialogProps {
  name: string;
  schema?: ISchema;
  children?: React.ReactNode;
}

const EditDialog = (props: IEditDialogProps) => {
  const { name, children, schema } = props;
  const { getValues, setValue } = useFormContext();
  const { components, onModeChange, modeMap } = useFormEngineContext();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<TValues>({});

  React.useEffect(() => {
    if (isOpen) {
      setFormData(getValues(name));
    }
  }, [isOpen]);

  const onEditModeChange = React.useCallback(() => {
    setIsOpen(true);
  }, []);

  const onClose = () => {
    setIsOpen(false);
  };

  const onConfirm = () => {
    for (const key in formData) {
      setValue(`${name}.${key}`, formData[key]);
    }
    setIsOpen(false);
  };

  const onFormChange = (values: TValue) => {
    setFormData(values);
  };

  const onFormModeChange = (key: string, mode: TFieldMode) => {
    onModeChange?.(`${name}.${key}`, mode);
  };

  const dialogModeMap: typeof modeMap = Object.keys(modeMap || {}).reduce(
    (acc: typeof modeMap, key: string) => {
      if (key.startsWith(name) && acc && modeMap) {
        const newKey = key.replace(`${name}.`, '');
        acc[newKey] = modeMap?.[key];
      }
      return acc;
    },
    {},
  );

  return (
    <Dialog open={isOpen}>
      <DialogTrigger>
        <IconButton
          size="sm"
          color="gray"
          type="button"
          variant="ghost"
          icon={Cog8ToothIcon}
          onClick={onEditModeChange}
          className="border-0 hover:bg-surface-accent-gray-subtle focus-visible:ring-0"
        />
      </DialogTrigger>
      <DialogOverlay asChild>
        <DialogPortal>
          <DialogContent
            className="max-w-[620px] min-h-[304px] max-h-[508px]"
            onClose={onClose}
            maskClosable={false}>
            <DialogHeader className="min-h-[68px] flex justify-center">
              <DialogTitle>
                <Heading size="h2">Edit Value</Heading>
              </DialogTitle>
            </DialogHeader>
            <Separator />
            <DialogDescription className="px-4 py-3 grid gap-y-1.5 min-h-[160px] max-h-[364px] overflow-y-auto">
              {schema && isOpen ? (
                <MemoizedFormEngine
                  values={formData}
                  schema={schema}
                  parent={name}
                  components={components}
                  onChange={onFormChange}
                  modeMap={dialogModeMap}
                  onModeChange={onFormModeChange}
                />
              ) : null}
              {children}
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
        </DialogPortal>
      </DialogOverlay>
    </Dialog>
  );
};

export { EditDialog };
