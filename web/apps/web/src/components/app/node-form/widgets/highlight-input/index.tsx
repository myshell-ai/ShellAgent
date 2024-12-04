'use client'

import {
  useCallback,
} from 'react'
import type { EditorState } from 'lexical'
import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin'
import ComponentPickerBlock from './component-pick-block'
import Placeholder from './placeholder';

type EditorProps = {
  placeholder?: string
  onChange?: (editorState: EditorState) => void
}

const initialConfig = {
  namespace: 'MyEditor',
  onError: (error: Error) => {
    console.error(error)
  },
  editable: true,
  nodes: [

  ],
}

export const Editor = ({
  placeholder = 'write you note...',
  onChange,
}: EditorProps) => {
  const handleEditorChange = useCallback((editorState: EditorState) => {
    onChange?.(editorState)
  }, [onChange])

  return (
    <div className='h-full w-full'>
      <LexicalComposer initialConfig={initialConfig}>
        <div className='relative h-full'>
          <RichTextPlugin
            contentEditable={
              <div>
                <ContentEditable
                  spellCheck={false}
                  className='w-full min-h-[138px] outline-none caret-primary-600 text-sm leading-5 p-3 text-[var(--text)] bg-[var(--surface-search-field)] rounded-xl border border-[var(--border)] shadow-[0_1px_2px_0_var(--shadow-background-default)] hover:bg-[var(--surface-subtle)] focus:ring-2 focus:ring-[var(--focus-ring-brand)] focus:ring-offset-1 focus:ring-offset-[var(--surface-default)]'
                />
              </div>
            }
            placeholder={<Placeholder value={placeholder} compact />}
            ErrorBoundary={LexicalErrorBoundary}
          />
          <ComponentPickerBlock triggerString='/' />
          <OnChangePlugin onChange={handleEditorChange} />
          <HistoryPlugin />
        </div>
      </LexicalComposer>
    </div>
  )
}
