'use client';

import { useCallback } from 'react';
import type { EditorState } from 'lexical';
import { TextNode, $getRoot } from 'lexical';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import ComponentPickerBlock from './component-pick-block';
import Placeholder from './placeholder';
import VariableBlock from './variable-block';
import VariableValueBlock from './variable-value-block';
import { VariableValueBlockNode } from './variable-value-block/node';
import { CustomTextNode } from './custom-text/node';

type EditorProps = {
  placeholder?: string;
  onChange?: (text: string) => void;
};

const initialConfig = {
  namespace: 'ExpressionEditor',
  onError: (error: Error) => {
    console.error(error);
  },
  editable: true,
  nodes: [
    CustomTextNode,
    {
      replace: TextNode,
      with: (node: TextNode) => new CustomTextNode(node.__text),
    },
    VariableValueBlockNode,
  ],
};

export const Editor = ({
  placeholder = 'write you note...',
  onChange,
}: EditorProps) => {
  const handleEditorChange = useCallback(
    (editorState: EditorState) => {
      const text = editorState.read(() => $getRoot().getTextContent());
      if (onChange) onChange(text.replaceAll('\n\n', '\n'));
    },
    [onChange],
  );

  return (
    <div className="h-full w-full">
      <LexicalComposer initialConfig={initialConfig}>
        <div className="relative h-full">
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                spellCheck={false}
                className="w-full min-h-[138px] outline-none caret-primary-600 text-sm leading-5 p-3 text-[var(--text)] bg-[var(--surface-search-field)] rounded-xl border border-[var(--border)] shadow-[0_1px_2px_0_var(--shadow-background-default)] hover:bg-[var(--surface-subtle)] focus:ring-2 focus:ring-[var(--focus-ring-brand)] focus:ring-offset-1 focus:ring-offset-[var(--surface-default)]"
              />
            }
            placeholder={<Placeholder value={placeholder} compact />}
            ErrorBoundary={LexicalErrorBoundary}
          />
          <ComponentPickerBlock triggerString="/" />
          <OnChangePlugin onChange={handleEditorChange} />
          <HistoryPlugin />
          {
            <>
              <VariableBlock />
              <VariableValueBlock />
            </>
          }
        </div>
      </LexicalComposer>
    </div>
  );
};
