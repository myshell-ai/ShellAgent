import {
  useReactFlowStore,
  getCanvasCenter,
  uuid,
} from '@shellagent/flow-engine';
import { useKeyPress } from 'ahooks';
import { useCallback } from 'react';

import { useAppStore } from '@/stores/app/app-provider';
import { useAppState } from '@/stores/app/use-app-state';
import { RefSceneEnum } from '@shellagent/shared/protocol/app-scope';
import { customSnakeCase } from '@shellagent/shared/utils';
import {
  getKeyboardKeyCodeBySystem,
  isEventTargetInputArea,
} from '@/utils/common-helper';
import { useInjection } from 'inversify-react';
import { AppBuilderModel } from '@/components/app/app-builder.model';
import { initData } from '../utils';

export const usePasteState = ({
  enabeKeyboard = false,
}: {
  enabeKeyboard: boolean;
}) => {
  const { setNodeData } = useAppStore(state => ({
    setNodeData: state.setNodeData,
  }));
  const appBuilder = useInjection(AppBuilderModel);

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
    const newData = initData(data);
    const displayName = `${newData?.display_name} Copy`;
    const newId = customSnakeCase(displayName) as Lowercase<string>;

    setNodeData({ id: newId, data: newData });

    appBuilder.hanldeRefScene({
      scene: RefSceneEnum.Enum.duplicate_state,
      params: {
        stateName: data.id as Lowercase<string>,
        duplicateStateName: newId,
      },
    });

    const position = getCanvasCenter(reactFlowWrapper, viewport);
    onAddNode({
      type: data.type || 'state',
      position,
      data: {
        id: newId,
        name: data?.name || '',
        display_name: displayName,
      },
      isCopy: true,
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
