import { memo, useCallback, useState } from 'react';
import { type CascaderOption, CascaderContent } from '@shellagent/ui';
import type { TextNode } from 'lexical';
import type { MenuRenderFn } from '@lexical/react/LexicalTypeaheadMenuPlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { LexicalTypeaheadMenuPlugin } from '@lexical/react/LexicalTypeaheadMenuPlugin';

type ComponentPickerProps = {
  triggerString: string;
};

type MenuOption = CascaderOption & {
  key: string;
  setRefElement: (element: HTMLElement) => void;
};

const ComponentPicker = ({ triggerString }: ComponentPickerProps) => {
  const [editor] = useLexicalComposerContext();

  const [queryString, setQueryString] = useState<string | null>(null);

  const onSelectOption = useCallback(
    (
      selectedOption: any,
      nodeToRemove: TextNode | null,
      closeMenu: () => void,
      matchingString: string,
    ) => {
      editor.update(() => {
        if (nodeToRemove && selectedOption?.key) nodeToRemove.remove();

        if (selectedOption?.onSelect) selectedOption.onSelect(matchingString);

        closeMenu();
      });
    },
    [editor],
  );

  const renderMenu = useCallback<MenuRenderFn<any>>(
    (
      anchorElementRef,
      { selectedIndex, selectOptionAndCleanUp, setHighlightedIndex },
    ) => {
      if (anchorElementRef.current) {
        return (
          <CascaderContent
            options={mockOptions}
            value={queryString || ''}
            onValueChange={(value, parent) => {
              // 处理选项选择
              const selectedOption = mockOptions.find(opt => opt.key === value);
              selectOptionAndCleanUp(selectedOption);
            }}
            className="z-[999999]"
          />
        );
      }
      return null;
    },
    [mockOptions, queryString],
  );

  const PUNCTUATION =
    '\\.,\\+\\*\\?\\$\\@\\|#{}\\(\\)\\^\\-\\[\\]\\\\/!%\'"~=<>_:;';

  const triggerFn = useCallback(
    (text: string) => {
      const validChars = `[${PUNCTUATION}\\s]`;
      const TypeaheadTriggerRegex = new RegExp(
        '(.*)(' + `[${triggerString}]` + `((?:${validChars}){0, 0})` + ')$',
      );
      const match = TypeaheadTriggerRegex.exec(text);
      if (match !== null) {
        const maybeLeadingWhitespace = match[1];
        const matchingString = match[3];
        if (matchingString.length >= 0) {
          return {
            leadOffset: match.index + maybeLeadingWhitespace.length,
            matchingString,
            replaceableString: match[2],
          };
        }
      }
      return null;
    },
    [triggerString],
  );

  return (
    <LexicalTypeaheadMenuPlugin<MenuOption>
      options={mockOptions}
      onQueryChange={setQueryString}
      onSelectOption={onSelectOption}
      anchorClassName="z-[999999]"
      menuRenderFn={renderMenu}
      triggerFn={triggerFn}
    />
  );
};

export default memo(ComponentPicker);
