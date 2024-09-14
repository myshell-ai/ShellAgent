import Editor, { Monaco, useMonaco } from '@monaco-editor/react';
import { debounce } from 'lodash-es';
import { editor } from 'monaco-editor';
import { useTheme } from 'next-themes';
import { useRef, useState, useEffect } from 'react';

export type CodeEditorSupportedLang = 'javascript' | 'json';

// loader.config({ monaco });

type P = {
  disabled?: boolean;
  value?: string;
  onValueChange: (value?: string) => void;
  language?: CodeEditorSupportedLang;
  className?: string;
};

export function CodeEditor({
  disabled = false,
  value,
  onValueChange,
  language: lang,
  className,
}: P) {
  const [language] = useState<CodeEditorSupportedLang>(lang ?? 'json');
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const editorRef = useRef<editor.IStandaloneCodeEditor>();
  const monaco = useMonaco();

  // 错误提示，精确到行
  useEffect(() => {
    // 标记高亮
    if (monaco && editorRef.current) {
      // 配置 JSON 验证选项
      monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
        validate: true,
        schemas: [],
        enableSchemaRequest: true,
        comments: 'ignore', // ignore comments
      });
    }
  }, [monaco]);

  const handleEditorDidMount = (
    editor: editor.IStandaloneCodeEditor,
    monaco: Monaco,
  ) => {
    editorRef.current = editor;

    // 获取字段行数，折叠没有生效
    monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
      comments: 'ignore', // ignore comments
    });
  };

  const handleValueChange = debounce((value: string | undefined) => {
    requestAnimationFrame(() => onValueChange(value));
  }, 500);

  return (
    <Editor
      language={language}
      theme={isDark ? 'vs-dark' : 'light'}
      value={value}
      onChange={handleValueChange}
      onMount={handleEditorDidMount}
      className={className}
      options={{
        lineNumbersMinChars: 6,
        readOnly: disabled,
        minimap: {
          enabled: false,
        },
        // 暂不支持精确到行提示错误信息
        // glyphMargin: true,
        contextmenu: false,
        fontSize: 16,
        fontWeight: '500',
      }}
    />
  );
}
