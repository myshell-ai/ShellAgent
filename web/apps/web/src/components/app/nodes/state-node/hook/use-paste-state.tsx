import {
  useReactFlowStore,
  getCanvasCenter,
  uuid,
} from '@shellagent/flow-engine';
import { useKeyPress } from 'ahooks';
import { useCallback } from 'react';

import { useAppStore } from '@/stores/app/app-provider';
import { useAppState } from '@/stores/app/use-app-state';
import {
  getKeyboardKeyCodeBySystem,
  isEventTargetInputArea,
} from '@/utils/common-helper';

export const usePasteState = ({
  enabeKeyboard = false,
}: {
  enabeKeyboard: boolean;
}) => {
  const { setNodeData, nodeData } = useAppStore(state => ({
    setNodeData: state.setNodeData,
    nodeData: state.nodeData,
  }));

  const { reactFlowWrapper, viewport, onAddNode } = useReactFlowStore(
    state => ({
      reactFlowWrapper: state.reactFlowWrapper,
      viewport: state.viewport,
      onAddNode: state.onAddNode,
    }),
  );

  const { currentCopyId } = useAppState(state => ({
    currentCopyId: state.currentCopyId,
  }));

  // TODO 需要把nodeData里的key都换掉
  const pasteState = useCallback(
    (id: string) => {
      const newId = uuid();
      setNodeData({ id: newId, data: nodeData[id] });
      const position = getCanvasCenter(reactFlowWrapper, viewport);
      onAddNode({
        type: nodeData[id].type,
        position,
        data: {
          id: newId,
          name: nodeData[id].name || '',
          display_name: 'State',
        },
      });
    },
    [setNodeData, nodeData, reactFlowWrapper, viewport, onAddNode],
  );

  useKeyPress(`${getKeyboardKeyCodeBySystem('ctrl')}.v`, e => {
    if (isEventTargetInputArea(e.target as HTMLElement)) {
      return;
    }
    if (currentCopyId && enabeKeyboard) {
      pasteState(currentCopyId);
    }
  });

  return { pasteState };
};
