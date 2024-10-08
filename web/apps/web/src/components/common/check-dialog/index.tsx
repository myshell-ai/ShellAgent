'use client';

import { ButtonProps, AModal } from '@shellagent/ui';

import { useGlobalStore } from '@/stores/global/global-provider';

import { CheckerContent } from './content';

interface ManagerDialogProps {
  buttonSize?: ButtonProps['size'];
}

export const CheckDialog: React.FC<ManagerDialogProps> = () => {
  const { checkDialogOpen, setCheckDialogOpen } = useGlobalStore(state => ({
    checkDialogOpen: state.checkDialogOpen,
    setCheckDialogOpen: state.setCheckDialogOpen,
  }));

  return (
    <AModal
      open={checkDialogOpen}
      width={720}
      zIndex={9999}
      bodyPadding={0}
      onCancel={() => setCheckDialogOpen(false)}
      title="">
      <CheckerContent />
    </AModal>
  );
};
