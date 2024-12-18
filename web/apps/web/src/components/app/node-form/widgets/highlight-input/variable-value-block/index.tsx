import { memo, useEffect } from 'react';
import { $insertNodes, COMMAND_PRIORITY_EDITOR, createCommand } from 'lexical';
import { mergeRegister } from '@lexical/utils';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $createVariableValueBlockNode, VariableValueBlockNode } from './node';

export const INSERT_VARIABLE_VALUE_BLOCK_COMMAND = createCommand(
  'INSERT_VARIABLE_VALUE_BLOCK_COMMAND',
);
export const DELETE_VARIABLE_VALUE_BLOCK_COMMAND = createCommand(
  'DELETE_VARIABLE_VALUE_BLOCK_COMMAND',
);

const VariableValueBlock = ({}) => {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([VariableValueBlockNode]))
      throw new Error(
        'VariableValueBlockPlugin: VariableValueBlockNode not registered on editor',
      );

    return mergeRegister(
      editor.registerCommand(
        INSERT_VARIABLE_VALUE_BLOCK_COMMAND,
        (text: string) => {
          const variableValueBlockNode = $createVariableValueBlockNode(text);
          $insertNodes([variableValueBlockNode]);
          return true;
        },
        COMMAND_PRIORITY_EDITOR,
      ),
      editor.registerCommand(
        DELETE_VARIABLE_VALUE_BLOCK_COMMAND,
        () => {
          return true;
        },
        COMMAND_PRIORITY_EDITOR,
      ),
    );
  }, [editor]);

  return null;
};

export default memo(VariableValueBlock);
