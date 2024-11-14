'use client';

import { Button, ButtonProps, ImportIcon } from '@shellagent/ui';
import { useBoolean } from 'ahooks';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

import ImportModal from '@/components/app/header/extra-action/import-modal';
import { createItem } from '@/services/home';
import { Type } from '@/services/home/type';
import { ShellAgent } from '@/types/app/types';
import { saveApp } from '@/services/app';

interface CreateDialogProps {
  size?: ButtonProps['size'];
  onSuccess: () => void;
  type: Type;
}

export const ImportDialog: React.FC<CreateDialogProps> = ({
  size,
  type,
  onSuccess,
}) => {
  const [open, openAction] = useBoolean();
  const [loading, loadingAction] = useBoolean();
  const router = useRouter();

  const onOpenChange = (value: boolean) => {
    openAction.set(value);
  };

  const onConfirm = async (data: ShellAgent) => {
    loadingAction.setTrue();
    const resp = await createItem({
      ...data.metadata,
      type,
    });
    if (resp.success && resp.data.id) {
      const saveResp = await saveApp({ ...data, app_id: resp.data.id });
      loadingAction.setFalse();
      if (saveResp.success) {
        onOpenChange(false);
        onSuccess();
        router.push(`/${type}/detail?id=${resp.data.id}`);
      } else {
        toast.error(
          saveResp.message || 'import error, please try again later.',
        );
      }
    } else {
      loadingAction.setFalse();
      toast.error(resp.message);
    }
  };

  return (
    <>
      <Button
        size={size || 'md'}
        icon={ImportIcon}
        color="default"
        onClick={() => onOpenChange(true)}>
        Import
      </Button>
      <ImportModal
        open={open}
        onOpenChange={onOpenChange}
        onConfirm={onConfirm}
        comfirmLoading={loading}
      />
    </>
  );
};
