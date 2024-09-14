import { TValues } from '@shellagent/form-engine';
import {
  Heading,
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Separator,
  DialogDescription,
  DialogFooter,
} from '@shellagent/ui';
import { useRequest } from 'ahooks';
import { capitalize, isEqual } from 'lodash-es';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { editItem } from '@/services/home';
import { Metadata, Type } from '@/services/home/type';

import DetailForm from '../detail-form';

interface EditDialogProps {
  id: string;
  metadata: Metadata;
  open: boolean;
  type: Type;
  onClose: () => void;
  onSuccess: () => void;
}

export const EditDialog = ({
  id,
  metadata,
  open,
  type,
  onClose,
  onSuccess,
}: EditDialogProps) => {
  const [data, setData] = useState(metadata);
  const { loading, run } = useRequest(editItem, {
    manual: true,
    onSuccess: result => {
      if (result.success) {
        toast.success('Save Success!', {
          position: 'top-center',
          autoClose: 1000,
          hideProgressBar: true,
          pauseOnHover: true,
          closeButton: false,
        });
        onClose();
        onSuccess();
      }
    },
    onError: error => {
      toast.error(error.message);
    },
  });

  useEffect(() => {
    if (open && !isEqual(metadata, data)) {
      setData(metadata);
    }
  }, [open, metadata]);

  const onConfirm = () => {
    run({
      id,
      ...data,
      type,
    });
  };

  const onChange = (values: TValues) => {
    setData(values as { name: string; description: string });
  };

  return (
    <Dialog modal open={open}>
      <DialogContent onClose={onClose} className="w-96">
        <DialogHeader>
          <DialogTitle>
            <Heading size="h2">Edit {capitalize(type)}</Heading>
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
            onClick={onClose}>
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
  );
};
