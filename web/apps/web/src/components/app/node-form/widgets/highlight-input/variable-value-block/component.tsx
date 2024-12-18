import { memo } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { extractDisplayAndValue } from './utils';
import { $getNodeByKey } from 'lexical';
import { VAR_MARKUP_REGEX } from './const';
import { removeBrackets } from '@shellagent/shared/utils';

type VariableValueBlockComponentProps = {
  nodeKey: string;
  text: string;
};

type HighlightBlockProps = {
  text: string;
};

export const HighlightBlock = ({ text }: HighlightBlockProps) => {
  return (
    <span
      // className="inline-flex relative items-center p-0.5 m-1 h-[22px] rounded-lg outline-none"
      style={{
        color: 'rgb(255, 99, 71)',
      }}>
      <span className="text-xs font-medium px-1.5">{text}</span>
    </span>
  );
};

const VariableValueBlockComponent = ({
  nodeKey,
  text,
}: VariableValueBlockComponentProps) => {
  const [editor] = useLexicalComposerContext();

  const renderContent = () => {
    const parts = [];
    let lastIndex = 0;
    let match;
    text = removeBrackets(text);
    while ((match = VAR_MARKUP_REGEX.exec(text.slice(lastIndex))) !== null) {
      const fullMatch = match[0];
      const displayText = match[1];
      const matchIndex = match.index + lastIndex;

      // Add text before the match
      if (matchIndex > lastIndex) {
        parts.push(text.slice(lastIndex, matchIndex));
      }

      // Add the highlight block
      parts.push(<HighlightBlock key={matchIndex} text={displayText} />);

      lastIndex = matchIndex + fullMatch.length;
    }

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }

    return parts;
  };

  // 添加输入事件处理
  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    editor.update(() => {
      const node = $getNodeByKey(nodeKey);
      let text = node?.getTextContent();
      if (node) {
        node;
        // text.setTextContent(e.currentTarget.textContent || '');
      }
    });
  };

  return (
    <div
      className="inline-flex relative items-center p-0.5 m-1 mx-1.5 h-[22px] rounded-lg outline-none"
      style={{
        backgroundColor: '#f5f5f5',
      }}
      contentEditable={true}
      suppressContentEditableWarning={true}
      spellCheck={false}
      // onInput={handleInput}  // 添加 onInput 事件处理器
    >
      {renderContent()}
    </div>
  );
};

export default memo(VariableValueBlockComponent);
