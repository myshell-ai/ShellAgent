import { getCanvasCenter, useReactFlowStore } from '@shellagent/flow-engine';
import type { FieldValues } from '@shellagent/ui';
import { useKeyPress } from 'ahooks';
import { useInjection } from 'inversify-react';
import { useCallback } from 'react';

import { AppBuilderModel } from '@/stores/app/models/app-builder.model';
import {
  getKeyboardKeyCodeBySystem,
  isEventTargetInputArea,
} from '@/utils/common-helper';

export const usePasteState = ({
  enabeKeyboard = false,
}: {
  enabeKeyboard: boolean;
}) => {
  const appBuilder = useInjection<AppBuilderModel>('AppBuilderModel');

  const { reactFlowWrapper, viewport, onAddNode } = useReactFlowStore(
    state => ({
      reactFlowWrapper: state.reactFlowWrapper,
      viewport: state.viewport,
      onAddNode: state.onAddNode,
    }),
  );

  const pasteState = useCallback(
    (data: FieldValues) => {
      const { newId, displayName } = appBuilder.duplicateState(data);
      const position = getCanvasCenter(reactFlowWrapper, viewport);
      onAddNode({
        type: data?.type || 'state',
        position,
        data: {
          id: newId,
          name: data?.name || '',
          display_name: displayName,
        },
        isCopy: true,
      });
    },
    [
      appBuilder.setNodeData,
      reactFlowWrapper,
      viewport,
      onAddNode,
      appBuilder.nodeData,
    ],
  );

  useKeyPress(`${getKeyboardKeyCodeBySystem('ctrl')}.v`, e => {
    if (isEventTargetInputArea(e.target as HTMLElement)) {
      return;
    }
    if (appBuilder.copyNodeData && enabeKeyboard) {
      pasteState(appBuilder.copyNodeData);
    }
  });

  return { pasteState };
};
