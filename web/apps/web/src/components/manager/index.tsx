'use client';

import { ButtonProps, AModal } from '@shellagent/ui';
import { Flex } from 'react-system';

import { useGlobalStore } from '@/stores/global/global-provider';

import { ManagerContent } from './manager-content';
import { ManagerSideBar } from './manger-sider';

interface ManagerDialogProps {
  buttonSize?: ButtonProps['size'];
}

export const ManagerDialog: React.FC<ManagerDialogProps> = () => {
  const { managerDialogOpen, setManagerDialogOpen } = useGlobalStore(state => ({
    managerDialogOpen: state.managerDialogOpen,
    setManagerDialogOpen: state.setManagerDialogOpen,
  }));

  return (
    <AModal
      open={managerDialogOpen}
      width="900px"
      bodyPadding={0}
      onCancel={() => setManagerDialogOpen(false)}
      footer={null}>
      <Flex>
        <ManagerSideBar />
        <ManagerContent />
      </Flex>
    </AModal>
  );
};
