import {
  XMarkIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
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
  Select,
  Text,
} from '@shellagent/ui';
import { useRequest } from 'ahooks';
import { toast } from 'react-toastify';

import { saveAsTemplate } from '@/services/home';
import { useState } from 'react';

export const CATEGORY_LIST = ['Tutorial', 'Image Generation'];

interface SaveTemplateDialogProps {
  id: string;
  open: boolean;
  onClose: () => void;
}

export const SaveTemplateDialog = ({
  id,
  open,
  onClose,
}: SaveTemplateDialogProps) => {
  const [category, setCategory] = useState('');
  const { loading, run } = useRequest(saveAsTemplate, {
    manual: true,
    onSuccess: result => {
      if (result.success) {
        toast.success('Save Template Success!', {
          position: 'top-center',
          autoClose: 1000,
          hideProgressBar: true,
          pauseOnHover: true,
          closeButton: false,
        });
        onClose();
        setCategory('');
      }
    },
    onError: error => {
      toast.error(error.message);
    },
  });

  const onConfirm = () => {
    run({
      app_id: id,
      category,
    });
  };

  return (
    <AlertDialog open={open}>
      <AlertDialogPortal>
        <AlertDialogContent style={{ width: '380px' }}>
          <AlertDialogHeader>
            <AlertDialogTitle>
              <div className="flex justify-between items-center">
                <span className="rounded-full p-2 bg-surface-accent-yellow-subtler">
                  <ExclamationTriangleIcon className="w-6 h-6 text-warning" />
                </span>
                <div className="w-9 h-9 flex cursor-pointer justify-center items-center focus-visible:outline-0 rounded-full hover:bg-surface-hovered">
                  <XMarkIcon
                    className="w-6 h-6 text-icon-subtle"
                    onClick={onClose}
                  />
                </div>
              </div>
              <Heading size="h2" className="mt-3">
                Save As Template
              </Heading>
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription>
            <div className="flex flex-col gap-1.5">
              <Text>
                <span className="text-[#EC2F0D] mr-[2px]">*</span> Category
              </Text>
              <Select
                value={category}
                onValueChange={value => setCategory(value)}
                options={CATEGORY_LIST.map(item => ({
                  label: item,
                  value: item,
                }))}
                placeholder="Please select template category."
              />
            </div>
            {/* Feature in beta testing, Are you sure you want to save as template? */}
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
              disabled={!category}
              onClick={onConfirm}>
              Confirm
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogPortal>
    </AlertDialog>
  );
};
