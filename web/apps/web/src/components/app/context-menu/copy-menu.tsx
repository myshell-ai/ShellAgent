import { ContextMenuSub, ContextMenuItem } from '@shellagent/ui';
import React from 'react';

import { useDuplicateState } from '@/components/app/nodes/state-node/hook/use-duplicate-state';
// import ShortcutsName from '@/components/common/shortcuts-name';
import { useAppState } from '@/stores/app/use-app-state';

const CopyMenu: React.FC<{ id: string }> = ({ id }) => {
  const setCurrentCopyId = useAppState(state => state.setCurrentCopyId);

  const { duplicateState } = useDuplicateState(id);

  const handleCopy = () => {
    setCurrentCopyId(id);
  };

  const handleDuplicate = () => {
    duplicateState();
  };

  return (
    <>
      <ContextMenuSub>
        <ContextMenuItem onClick={handleCopy} className="cursor-pointer">
          <div className="flex w-full">
            <div>Copy</div>
            <div className="ml-auto">
              {/* <ShortcutsName keys={['ctrl', 'C']} /> */}
            </div>
          </div>
        </ContextMenuItem>
      </ContextMenuSub>
      <ContextMenuSub>
        <ContextMenuItem onClick={handleDuplicate} className="cursor-pointer">
          <div className="flex w-full">
            <div>Duplicate</div>
            <div className="ml-auto">
              {/* <ShortcutsName keys={['ctrl', 'D']} /> */}
            </div>
          </div>
        </ContextMenuItem>
      </ContextMenuSub>
    </>
  );
};

export default CopyMenu;
