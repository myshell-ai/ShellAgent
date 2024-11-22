import { useInjection } from 'inversify-react';
import { useCallback } from 'react';

import { AppBuilderModel } from '@/stores/app/models/app-builder.model';

import { usePasteState } from './use-paste-state';

export const useDuplicateState = () => {
  const { pasteState } = usePasteState({ enabeKeyboard: false });
  const appBuilder = useInjection<AppBuilderModel>('AppBuilderModel');

  const duplicateState = useCallback(
    (id: string, displayName: string) => {
      const data = {
        ...(appBuilder.nodeData[id] || {}),
        display_name: displayName,
        name: 'State',
      };
      pasteState(data);
    },
    [pasteState],
  );

  return { duplicateState };
};
