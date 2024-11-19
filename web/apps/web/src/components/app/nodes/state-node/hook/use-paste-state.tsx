import { useReactFlowStore, getCanvasCenter } from '@shellagent/flow-engine';
import { RefSceneEnum } from '@shellagent/shared/protocol/app-scope';
import { customSnakeCase } from '@shellagent/shared/utils';
import { useKeyPress } from 'ahooks';
import { useInjection } from 'inversify-react';
import { useObserver } from 'mobx-react-lite';
import { useCallback } from 'react';

import { useAppState } from '@/stores/app/use-app-state';
import {
  getKeyboardKeyCodeBySystem,
  isEventTargetInputArea,
} from '@/utils/common-helper';

import { AppBuilderModel } from '../../../../../stores/app/models/app-builder.model';

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

  const { currentCopyStateData: data } = useAppState(state => ({
    currentCopyStateData: state.currentCopyStateData,
  }));

  const pasteState = useCallback(() => {
    const index = Object.values(appBuilder.nodeData).map(
      value => value.type === 'state',
    )?.length;
    const displayName = `${data?.display_name} Copy${index > 0 ? `#${index}` : ''}`;
    const newId = customSnakeCase(displayName) as Lowercase<string>;

    appBuilder.setNodeData({ id: newId, data });

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
  }, [
    appBuilder.setNodeData,
    data,
    reactFlowWrapper,
    viewport,
    onAddNode,
    appBuilder.nodeData,
  ]);

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
