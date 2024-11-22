import { useCallback } from 'react';

import { usePasteState } from './use-paste-state';
import { AppBuilderModel } from '@/stores/app/models/app-builder.model';
import { useInjection } from 'inversify-react';

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
