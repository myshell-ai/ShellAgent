import { TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';
import {
  Heading,
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  Button,
  AlertDialogPortal,
} from '@shellagent/ui';
import { useRequest } from 'ahooks';
import { toast } from 'react-toastify';

import { deleteItem } from '@/services/home';
import { Type } from '@/services/home/type';

interface DeleteDialogProps {
  id: string;
  name: string;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  type: Type;
}

export const DeleteDialog = ({
  id,
  name,
  open,
  onClose,
  onSuccess,
  type,
}: DeleteDialogProps) => {
  const { loading, run } = useRequest(deleteItem, {
    manual: true,
    onSuccess: result => {
      if (result.success) {
        toast.success('Delete Success!', {
          position: 'top-center',
          autoClose: 1000,
          hideProgressBar: true,
          pauseOnHover: true,
          closeButton: false,
        });
        onSuccess();
      }
    },
    onError: error => {
      toast.error(error.message);
    },
  });

  const onConfirm = () => {
    run({ id, type });
  };

  return (
    <AlertDialog open={open}>
      <AlertDialogPortal>
        <AlertDialogContent style={{ width: '380px' }}>
          <AlertDialogHeader>
            <AlertDialogTitle>
              <div className="flex justify-between items-center">
                <span className="rounded-full p-2 bg-surface-accent-yellow-subtler">
                  <TrashIcon className="w-6 h-6 text-warning" />
                </span>
                <div className="w-9 h-9 flex cursor-pointer justify-center items-center focus-visible:outline-0 rounded-full hover:bg-surface-hovered">
                  <XMarkIcon
                    className="w-6 h-6 text-icon-subtle"
                    onClick={onClose}
                  />
                </div>
              </div>
              <Heading size="h2" className="mt-3">
                Delete file
              </Heading>
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription>
            Are you sure you want to delete &quot;<b>{name}</b>&quot; ?
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="flex-1"
              autoFocus={false}
              onClick={onClose}>
              Cancel
            </AlertDialogCancel>
            <Button
              loading={loading}
              className="flex-1"
              color="warning"
              onClick={onConfirm}>
              Confirm
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogPortal>
    </AlertDialog>
  );
};
