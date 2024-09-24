import { useCallback } from 'react';

import { usePasteState } from './use-paste-state';

export const useDuplicateState = () => {
  const { pasteState } = usePasteState({ enabeKeyboard: false });

  const duplicateState = useCallback(() => {
    pasteState();
  }, [pasteState]);

  return { duplicateState };
};
