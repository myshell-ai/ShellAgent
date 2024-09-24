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

import { initData } from '../utils';

export const usePasteState = ({
  enabeKeyboard = false,
}: {
  enabeKeyboard: boolean;
}) => {
  const { setNodeData } = useAppStore(state => ({
    setNodeData: state.setNodeData,
  }));

  const { reactFlowWrapper, viewport, onAddNode } = useReactFlowStore(
    state => ({
      reactFlowWrapper: state.reactFlowWrapper,
      viewport: state.viewport,
      onAddNode: state.onAddNode,
    }),
  );

  const { currentCopyStateData: data } = useAppState(state => ({
    currentCopyStateData: state.currentCopyStateData,
  }));

  const pasteState = useCallback(() => {
    const newId = uuid();
    const newData = initData(data);

    setNodeData({ id: newId, data: newData });

    const position = getCanvasCenter(reactFlowWrapper, viewport);
    onAddNode({
      type: data.type || 'state',
      position,
      data: {
        id: newId,
        name: data.name || '',
        display_name: 'State',
      },
    });
  }, [setNodeData, data, reactFlowWrapper, viewport, onAddNode]);

  useKeyPress(`${getKeyboardKeyCodeBySystem('ctrl')}.v`, e => {
    if (isEventTargetInputArea(e.target as HTMLElement)) {
      return;
    }
    if (data && enabeKeyboard) {
      pasteState();
    }
  });

  return { pasteState };
};
