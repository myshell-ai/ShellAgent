import { ContextMenuSub, ContextMenuItem } from '@shellagent/ui';
import React from 'react';

import { useDuplicateState } from '@/components/app/nodes/state-node/hook/use-duplicate-state';
import { useInjection } from 'inversify-react';
import { observer } from 'mobx-react-lite';
// import ShortcutsName from '@/components/common/shortcuts-name';
import { useAppState } from '@/stores/app/use-app-state';
import { AppBuilderModel } from '@/components/app/app-builder.model';

const CopyMenu: React.FC<{ id: string; name: string }> = observer(
  ({ id, name }) => {
    const appBuilder = useInjection<AppBuilderModel>('AppBuilderModel');
    const setCurrentCopyStateData = useAppState(
      state => state.setCurrentCopyStateData,
    );
    const { duplicateState } = useDuplicateState();

    const handleCopy = () => {
      setCurrentCopyStateData({
        ...appBuilder.nodeData?.[id],
        name,
      });
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
  },
);

export default CopyMenu;
