import {
  useReactFlowStore,
  getCanvasCenter,
  uuid,
  NodeId,
} from '@shellagent/flow-engine';
import { useKeyPress } from 'ahooks';
import { useCallback } from 'react';

import { useWorkflowState } from '@/stores/workflow/use-workflow-state';
import { useWorkflowStore } from '@/stores/workflow/workflow-provider';
import {
  filterVariable,
  getKeyboardKeyCodeBySystem,
  isEventTargetInputArea,
} from '@/utils/common-helper';

export const usePasteState = ({
  enabeKeyboard = false,
}: {
  enabeKeyboard: boolean;
}) => {
  const { setNodeData, nodeData } = useWorkflowStore(state => ({
    setNodeData: state.setNodeData,
    nodeData: state.nodeData,
  }));

  const { reactFlowWrapper, viewport, onAddNode, nodes } = useReactFlowStore(
    state => ({
      reactFlowWrapper: state.reactFlowWrapper,
      viewport: state.viewport,
      onAddNode: state.onAddNode,
      nodes: state.nodes,
    }),
  );

  const { currentCopyId } = useWorkflowState(state => ({
    currentCopyId: state.currentCopyId,
  }));

  const pasteState = useCallback(
    (id: string) => {
      const newId = uuid() as NodeId;

      setNodeData({ id: newId, data: filterVariable(nodeData[id]) });
      const position = getCanvasCenter(reactFlowWrapper, viewport);
      const data = nodes.find(item => item.id === id) as any;
      onAddNode({
        type: data.data.type,
        position,
        data: {
          id: newId,
          name: data?.data?.name || '',
          display_name: data?.data?.name || '',
          type: 'widget',
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
