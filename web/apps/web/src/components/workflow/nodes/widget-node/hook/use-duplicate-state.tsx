import { useCallback } from 'react';

import { usePasteState } from './use-paste-state';

export const useDuplicateState = (id: string) => {
  const { pasteState } = usePasteState({ enabeKeyboard: false });

  const duplicateState = useCallback(() => {
    pasteState(id);
  }, [pasteState]);

  return { duplicateState };
};
