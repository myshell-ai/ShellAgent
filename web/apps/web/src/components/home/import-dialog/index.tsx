'use client';

import { Button, ButtonProps, ImportIcon } from '@shellagent/ui';
import { useBoolean } from 'ahooks';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

import ImportModal from '@/components/app/header/extra-action/import-modal';
import { importApp } from '@/services/app';
import { Type } from '@/services/home/type';
import { ShellAgent } from '@/types/app/types';
import { ExportBotResponse } from '@/services/app/type';

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

  const onConfirm = async (data: ExportBotResponse['data']) => {
    loadingAction.setTrue();
    const resp = await importApp(data);
    if (resp.success && resp.data.id) {
      onOpenChange(false);
      onSuccess();
      router.push(`/${type}/detail?id=${resp.data.id}`);
    } else {
      toast.error(resp.message);
    }
    loadingAction.setFalse();
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
