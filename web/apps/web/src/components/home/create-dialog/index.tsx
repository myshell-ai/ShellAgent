'use client';

import { PlusIcon } from '@heroicons/react/24/outline';
import { TValues } from '@shellagent/form-engine';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Separator,
  Heading,
  ButtonProps,
} from '@shellagent/ui';
import { useBoolean, useRequest } from 'ahooks';
import { capitalize } from 'lodash-es';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-toastify';

import { createItem } from '@/services/home';
import { Type } from '@/services/home/type';

import DetailForm from '../detail-form';

interface CreateDialogProps {
  size?: ButtonProps['size'];
  onSuccess: () => void;
  type: Type;
}

export const CreateDialog: React.FC<CreateDialogProps> = ({
  size,
  onSuccess,
  type,
}) => {
  const [open, openAction] = useBoolean();
  const [data, setData] = useState({
    name: '',
    description: '',
  });
  const router = useRouter();

  const onOpenChange = (value: boolean) => {
    openAction.set(value);
  };

  const { loading, run } = useRequest(createItem, {
    manual: true,
    onSuccess: result => {
      if (result.success) {
        onSuccess();
        if (result.data.id) {
          router.push(`/${type}/detail?id=${result.data.id}`);
        }
      }
    },
    onError: error => {
      toast.error(error.message);
    },
  });

  const onConfirm = async () => {
    run({ ...data, type });
  };

  const onChange = (values: TValues) => {
    setData(values as { name: string; description: string });
  };

  return (
    <>
      <Button
        size={size || 'md'}
        icon={PlusIcon}
        onClick={() => onOpenChange(true)}>
        Create
      </Button>
      <Dialog modal open={open} onOpenChange={onOpenChange}>
        <DialogContent onClose={() => onOpenChange(false)} className="w-96">
          <DialogHeader>
            <DialogTitle>
              <Heading size="h2">Create a New {capitalize(type)}</Heading>
            </DialogTitle>
          </DialogHeader>
          <Separator />
          <DialogDescription className="px-4 py-3">
            <DetailForm type={type} values={data} onChange={onChange} />
          </DialogDescription>
          <Separator />
          <DialogFooter className="gap-x-4 flex">
            <Button
              type="button"
              className="flex-1"
              variant="outline"
              onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              type="button"
              className="flex-1"
              disabled={!data.name}
              loading={loading}
              onClick={onConfirm}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
