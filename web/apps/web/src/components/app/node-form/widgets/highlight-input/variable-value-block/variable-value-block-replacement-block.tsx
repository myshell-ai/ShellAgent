import { memo, useCallback, useEffect } from 'react';
import type { TextNode } from 'lexical';
import { $applyNodeReplacement } from 'lexical';
import { mergeRegister } from '@lexical/utils';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { decoratorTransform } from './utils';
import { CustomTextNode } from '../custom-text/node';
import { $createVariableValueBlockNode } from './node';
import { VariableValueBlockNode } from './node';
import { VAR_REGEX_STRING } from './const';

interface VariableValueBlockType {
  onInsert?: () => void;
}

const VariableValueBlockReplacementBlock = ({
  onInsert,
}: VariableValueBlockType) => {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([VariableValueBlockNode]))
      throw new Error(
        'VariableValueBlockPlugin: VariableValueBlockNode not registered on editor',
      );
  }, [editor]);

  const createVariableValueBlockNode = useCallback(
    (textNode: TextNode): VariableValueBlockNode => {
      if (onInsert) onInsert();

      const variableName = textNode.getTextContent().slice(2, -2);
      return $applyNodeReplacement($createVariableValueBlockNode(variableName));
    },
    [onInsert],
  );

  const getMatch = useCallback((text: string) => {
    const matchArr = VAR_REGEX_STRING.exec(text);

    if (matchArr === null) return null;

    const startOffset = matchArr.index;
    const endOffset = startOffset + matchArr[0].length;
    return {
      end: endOffset,
      start: startOffset,
    };
  }, []);

  const transformListener = useCallback(
    (textNode: any) => {
      return decoratorTransform(
        textNode,
        getMatch,
        createVariableValueBlockNode,
      );
    },
    [createVariableValueBlockNode, getMatch],
  );

  useEffect(() => {
    return mergeRegister(
      editor.registerNodeTransform(CustomTextNode, transformListener),
    );
  }, [editor, transformListener]);

  return null;
};

export default memo(VariableValueBlockReplacementBlock);
