import ReactDOM from 'react-dom';
import { memo, useCallback, useState } from 'react';
import type { TextNode } from 'lexical';
import type { MenuRenderFn } from '@lexical/react/LexicalTypeaheadMenuPlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { LexicalTypeaheadMenuPlugin } from '@lexical/react/LexicalTypeaheadMenuPlugin';
import {
  FloatingPortal,
  flip,
  offset,
  shift,
  useFloating,
} from '@floating-ui/react';
import VariableMenu, { VariableOption } from './variable-menu';
import { INSERT_VARIABLE_VALUE_BLOCK_COMMAND } from '../variable-block';

type ComponentPickerProps = {
  triggerString: string;
};

const ComponentPicker = ({ triggerString }: ComponentPickerProps) => {
  const [editor] = useLexicalComposerContext();
  const { refs, floatingStyles, elements } = useFloating({
    placement: 'bottom-start',
    middleware: [offset(0), shift(), flip()],
  });

  const mockOptions = [
    {
      label: 'Insert Text',
      key: 'text',
      icon: '📝',
      disabled: false,
    },
    {
      label: 'Add Image',
      key: 'image',
      icon: '🖼️',
      disabled: false,
    },
    {
      label: 'Insert Table',
      key: 'table',
      icon: '📊',
      disabled: false,
    },
    {
      label: 'Add Link',
      key: 'link',
      icon: '🔗',
      disabled: false,
    },
    {
      label: 'Insert Code Block',
      key: 'code',
      icon: '💻',
      disabled: false,
    },
    {
      label: 'Add Quote',
      key: 'quote',
      icon: '💭',
      disabled: false,
    },
    {
      label: 'Premium Feature',
      key: 'premium',
      icon: '⭐',
      disabled: true, // 禁用的选项示例
    },
  ].map(
    option =>
      new VariableOption(option.label, {
        icon: <span className="mr-2">{option.icon}</span>,
        onSelect: () => {
          editor.dispatchCommand(
            INSERT_VARIABLE_VALUE_BLOCK_COMMAND,
            `{{${option.key}}}`,
          );
        },
        disabled: option.disabled,
        keywords: [option.label.toLowerCase(), option.key],
      }),
  );
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

  const renderMenu = useCallback<MenuRenderFn<VariableOption>>(
    (
      anchorElementRef,
      { selectedIndex, selectOptionAndCleanUp, setHighlightedIndex },
    ) => {
      if (anchorElementRef.current) {
        return (
          <>
            {ReactDOM.createPortal(
              <div ref={refs.setReference}></div>,
              anchorElementRef.current,
            )}
            {elements.reference && (
              <FloatingPortal id="typeahead-menu">
                <div
                  className="w-[260px] bg-white rounded-lg border-[0.5px] border-gray-200 shadow-lg overflow-y-auto"
                  style={{
                    ...floatingStyles,
                    maxHeight: 'calc(1 / 3 * 100vh)',
                  }}
                  ref={refs.setFloating}>
                  {!!mockOptions.length && (
                    <>
                      <VariableMenu
                        startIndex={0}
                        selectedIndex={selectedIndex}
                        options={mockOptions}
                        onClick={(index, option) => {
                          if (option.disabled) return;
                          setHighlightedIndex(index);
                          selectOptionAndCleanUp(option);
                        }}
                        onMouseEnter={(index, option) => {
                          if (option.disabled) return;
                          setHighlightedIndex(index);
                        }}
                      />
                    </>
                  )}
                </div>
              </FloatingPortal>
            )}
          </>
        );
      }

      return null;
    },
    [mockOptions, queryString, elements, floatingStyles, refs],
  );

  // 待验证
  const triggerFn = useCallback(
    (text: string) => {
      if (text.endsWith(triggerString)) {
        return {
          leadOffset: text.length - triggerString.length,
          matchingString: '',
          replaceableString: triggerString,
        };
      }
      return null;
    },
    [triggerString],
  );

  return (
    <LexicalTypeaheadMenuPlugin
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
