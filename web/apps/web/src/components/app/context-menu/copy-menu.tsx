import { ContextMenuSub, ContextMenuItem } from '@shellagent/ui';
import { useInjection } from 'inversify-react';
import { observer } from 'mobx-react-lite';
import React from 'react';

import { useDuplicateState } from '@/components/app/nodes/state-node/hook/use-duplicate-state';

// import ShortcutsName from '@/components/common/shortcuts-name';
import { AppBuilderModel } from '@/stores/app/models/app-builder.model';

const CopyMenu: React.FC<{ id: string; displayName: string }> = ({
  id,
  displayName,
}) => {
  const appBuilder = useInjection<AppBuilderModel>('AppBuilderModel');
  const { duplicateState } = useDuplicateState();

  const handleCopy = () => {
    appBuilder.setCopyData(id, displayName);
  };

  const handleDuplicate = () => {
    duplicateState(id, displayName);
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
