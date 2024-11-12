import {
  Avatar,
  Clear,
  Text,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  Loading,
} from '@shellagent/ui';
import React, { memo, useEffect, useMemo, useRef } from 'react';
import { useInjection } from 'inversify-react';
import { observer } from 'mobx-react-lite';
import ReactMarkdown from 'react-markdown';
import { atelierHeathLight } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { JsxRuntimeComponents } from 'react-markdown/lib';
import { Virtuoso, VirtuosoHandle } from 'react-virtuoso';

import { AssistantModel } from '@/components/assistant-help/model';
import { TextInput } from './text-input';
import { cn } from '@/utils/cn';

const capitalizationLanguageNameMap: Record<string, string> = {
  sql: 'SQL',
  javascript: 'JavaScript',
  java: 'Java',
  typescript: 'TypeScript',
  vbscript: 'VBScript',
  css: 'CSS',
  html: 'HTML',
  xml: 'XML',
  php: 'PHP',
  python: 'Python',
  yaml: 'Yaml',
  mermaid: 'Mermaid',
  markdown: 'MarkDown',
  makefile: 'MakeFile',
  echarts: 'ECharts',
  shell: 'Shell',
  powershell: 'PowerShell',
  json: 'JSON',
  latex: 'Latex',
  svg: 'SVG',
};

const getCorrectCapitalizationLanguageName = (language: string) => {
  if (!language) return 'Plain';

  if (language in capitalizationLanguageNameMap)
    return capitalizationLanguageNameMap[language];

  return language.charAt(0).toUpperCase() + language.substring(1);
};
export const CodeBlock = memo(
  ({ inline, className, children, ...props }: any) => {
    const match = /language-(\w+)/.exec(className || '');
    const language = match?.[1];
    const languageShowName = getCorrectCapitalizationLanguageName(
      language || '',
    );

    const content = String(children);

    const handleClick = () => {
      navigator.clipboard.writeText(children);
    };

    const renderCodeContent = useMemo(() => {
      const codeContent = content.replace(/\n$/, '');

      return (
        <SyntaxHighlighter
          {...props}
          style={atelierHeathLight}
          customStyle={{
            paddingLeft: 12,
            backgroundColor: '#fff',
          }}
          language={match?.[1]}
          showLineNumbers
          PreTag="div">
          {codeContent}
        </SyntaxHighlighter>
      );
    }, [language, match, props, content]);

    if ((inline || !match) && !content.includes('\n')) {
      return (
        <code {...props} className={cn('px-1', className)}>
          {children}
        </code>
      );
    }

    return (
      <div className="marked-code-block">
        <div className="marked-code-header bg-surface-container-pressed alt-14 text-subtle">
          <span>{languageShowName}</span>
          <button className="copy-button text-brand" onClick={handleClick}>
            Copy
          </button>
        </div>
        {renderCodeContent}
      </div>
    );
  },
);

const Message = ({
  question,
  reply,
  loading,
}: {
  question?: string;
  reply?: string;
  loading?: boolean;
}) => {
  if (question) {
    return (
      <div className="w-[calc(100%-38px)] ml-[38px] flex gap-1.5 justify-end pb-3">
        <div className="max-w-full overflow-hidden rounded-2xl !rounded-tr-sm min-h-11 py-3 px-4 bg-surface-primary-subtle-hovered">
          <Text>{question}</Text>
        </div>
      </div>
    );
  }
  if (reply || loading) {
    return (
      <div className="w-[calc(100%-4px)] mr-1 flex gap-1.5 justify-start pb-3">
        <div className="grow overflow-hidden self-start flex items-start gap-1.5 group/menu">
          <Avatar
            size="md"
            src="/assistant.png"
            className="border border-default"
          />
          <div className="assistant-md-viewer max-w-full overflow-hidden rounded-2xl !rounded-tl-sm min-h-11 py-3 px-4 bg-surface-hovered">
            {loading ? (
              <Loading className="w-6 h-4.5" />
            ) : (
              <ReactMarkdown
                components={{
                  code: CodeBlock as JsxRuntimeComponents['code'],
                }}>
                {reply}
              </ReactMarkdown>
            )}
          </div>
        </div>
      </div>
    );
  }
  return null;
};

const Editor = observer(() => {
  const model = useInjection(AssistantModel);

  return (
    <div className="w-full flex py-1 px-2 items-center">
      <TextInput
        autoFocus
        value={model.question}
        onSend={model.query}
        sendDisabled={model.sending}
        onChange={e => model.setQuestion(e.target.value)}
        className="flex-grow min-h-5 max-h-28 text-sm"
        placeholder="Write a message. Press `Enter` to send"
      />
      {/* <Button
        loading={model.sending}
        disabled={model.sending || !text}
        variant="primary"
        size="sm"
        // onClick={onSend}
        className={cn('w-fit rounded-lg shrink-0', text ? '' : 'hidden')}>
        <PaperAirplaneIcon className="w-4 h-4" />
      </Button> */}
    </div>
  );
});

export const AssistantBot = observer(() => {
  const virtualRef = useRef<VirtuosoHandle>(null);
  const model = useInjection(AssistantModel);
  const scrollToIndex = (location?: {
    index?: number;
    align?: 'start' | 'center' | 'end';
  }) => {
    requestAnimationFrame(() => {
      console.log('scrollToIndex: ', scrollToIndex);
      virtualRef.current?.scrollToIndex({
        index: location?.index || 'LAST',
        align: location?.align || 'end',
        behavior: 'auto',
      });
    });
  };
  console.log('model.messages.length: ', model.messages.length);
  useEffect(() => {
    scrollToIndex();
  }, [model.messages.length]);

  return (
    <div className="h-full w-full relative flex flex-col">
      <div className="w-full pb-0 px-4 pt-4 flex-grow">
        <Virtuoso
          height="100%"
          className="h-full w-full overflow-x-hidden overscroll-contain"
          ref={virtualRef}
          data={model.messages}
          // components={{
          //   Footer: () =>
          //     model.sending ? <Message loading={model.sending} /> : null,
          // }}
          itemContent={(
            _: number,
            item: { question?: string; reply?: string },
          ) => <Message {...item} />}
        />
      </div>
      <div className="w-full flex p-4 items-center align-bottom">
        {/* <IconButton icon={Clear} variant="ghost" size="md" color="brand" /> */}
        <Tooltip>
          <TooltipTrigger>
            <Clear
              className="w-6 h-6 text-brand cursor-pointer"
              onClick={model.clearMemory}
            />
          </TooltipTrigger>
          <TooltipContent>Clear Memory</TooltipContent>
        </Tooltip>
        <div className="ml-2 flex-grow flex rounded-4xl p-2 bg-surface-hovered">
          <Editor />
        </div>
      </div>
    </div>
  );
});
