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
import { INSERT_VARIABLE_VALUE_BLOCK_COMMAND } from '../variable-value-block';
import type { CascaderOption } from '@shellagent/ui';
import { CascaderContent } from '@shellagent/ui';
import { formatVariableValue2Editor } from '../variable-value-block/utils';

type ComponentPickerProps = {
  triggerString: string;
};

const ComponentPicker = ({ triggerString }: ComponentPickerProps) => {
  const [editor] = useLexicalComposerContext();
  const { refs, floatingStyles, elements } = useFloating({
    placement: 'bottom-start',
    middleware: [offset(0), shift(), flip()],
  });

  const mockOptions: CascaderOption[] = [
    {
      label: 'global',
      children: [
        {
          label: 'Context',
          value: 'Context',
          children: [
            {
              label: 'A',
              value: '{{__context__a__}}',
              field_type: 'image',
              parent: 'context',
            },
            {
              label: 'B',
              value: '{{__context__b__}}',
              field_type: 'image',
              parent: 'context',
            },
            {
              label: 'C',
              value: '{{__context__c__}}',
              field_type: 'image',
              parent: 'context',
            },
            {
              label: 'D',
              value: '{{__context__d__}}',
              field_type: 'image',
              parent: 'context',
            },
            {
              label: 'E',
              value: '{{__context__e__}}',
              field_type: 'image',
              parent: 'context',
            },
            {
              label: 'F',
              value: '{{__context__f__}}',
              field_type: 'image',
              parent: 'context',
            },
            {
              label: 'G',
              value: '{{__context__g__}}',
              field_type: 'image',
              parent: 'context',
            },
            {
              label: 'H',
              value: '{{__context__h__}}',
              field_type: 'image',
              parent: 'context',
            },
            {
              label: 'I',
              value: '{{__context__i__}}',
              field_type: 'image',
              parent: 'context',
            },
            {
              label: 'J',
              value: '{{__context__j__}}',
              field_type: 'image',
              parent: 'context',
            },
            {
              label: 'user_image',
              value: '{{__context__user_image__}}',
              field_type: 'image',
              parent: 'context',
            },
            {
              label: 'poster',
              value: '{{__context__poster__}}',
              field_type: 'image',
              parent: 'context',
            },
            {
              label: 'template',
              value: '{{__context__template__}}',
              field_type: 'image',
              parent: 'context',
            },
            {
              label: 'mask1',
              value: '{{__context__mask1__}}',
              field_type: 'text',
              parent: 'context',
            },
            {
              label: 'mask2',
              value: '{{__context__mask2__}}',
              field_type: 'text',
              parent: 'context',
            },
            {
              label: 'Glinda3',
              value: '{{__context__glinda3__}}',
              field_type: 'image',
              parent: 'context',
            },
            {
              label: 'Glinda4',
              value: '{{__context__glinda4__}}',
              field_type: 'image',
              parent: 'context',
            },
            {
              label: 'Fiyero',
              value: '{{__context__fiyero__}}',
              field_type: 'image',
              parent: 'context',
            },
            {
              label: 'hello',
              value: '{{__context__hello__}}',
              field_type: 'image',
              parent: 'context',
            },
            {
              label: 'posterpreview',
              value: '{{__context__posterpreview__}}',
              field_type: 'image',
              parent: 'context',
            },
          ],
        },
        {
          label: 'State#2',
          value: 'State#2',
          children: [
            {
              label: 'Context/user_image',
              value: '{{__context__user_image__}}',
              field_type: 'text',
              parent: 'state',
            },
          ],
        },
        {
          label: 'A',
          value: 'A',
          children: [
            {
              label: 'Context/mask1',
              value: '{{__context__mask1__}}',
              field_type: 'text',
              parent: 'state',
            },
            {
              label: 'Context/mask2',
              value: '{{__context__mask2__}}',
              field_type: 'text',
              parent: 'state',
            },
            {
              label: 'Context/poster',
              value: '{{__context__poster__}}',
              field_type: 'text',
              parent: 'state',
            },
          ],
        },
        {
          label: 'B',
          value: 'B',
          children: [
            {
              label: 'Context/mask1',
              value: '{{__context__mask1__}}',
              field_type: 'text',
              parent: 'state',
            },
            {
              label: 'Context/mask2',
              value: '{{__context__mask2__}}',
              field_type: 'text',
              parent: 'state',
            },
            {
              label: 'Context/poster',
              value: '{{__context__poster__}}',
              field_type: 'text',
              parent: 'state',
            },
          ],
        },
        {
          label: 'C',
          value: 'C',
          children: [
            {
              label: 'Context/mask1',
              value: '{{__context__mask1__}}',
              field_type: 'text',
              parent: 'state',
            },
            {
              label: 'Context/mask2',
              value: '{{__context__mask2__}}',
              field_type: 'text',
              parent: 'state',
            },
            {
              label: 'Context/poster',
              value: '{{__context__poster__}}',
              field_type: 'text',
              parent: 'state',
            },
          ],
        },
        {
          label: 'D',
          value: 'D',
          children: [
            {
              label: 'Context/mask1',
              value: '{{__context__mask1__}}',
              field_type: 'text',
              parent: 'state',
            },
            {
              label: 'Context/mask2',
              value: '{{__context__mask2__}}',
              field_type: 'text',
              parent: 'state',
            },
            {
              label: 'Context/poster',
              value: '{{__context__poster__}}',
              field_type: 'text',
              parent: 'state',
            },
          ],
        },
        {
          label: 'E',
          value: 'E',
          children: [
            {
              label: 'Context/mask1',
              value: '{{__context__mask1__}}',
              field_type: 'text',
              parent: 'state',
            },
            {
              label: 'Context/mask2',
              value: '{{__context__mask2__}}',
              field_type: 'text',
              parent: 'state',
            },
            {
              label: 'Context/poster',
              value: '{{__context__poster__}}',
              field_type: 'text',
              parent: 'state',
            },
          ],
        },
        {
          label: 'F',
          value: 'F',
          children: [
            {
              label: 'Context/mask1',
              value: '{{__context__mask1__}}',
              field_type: 'text',
              parent: 'state',
            },
            {
              label: 'Context/mask2',
              value: '{{__context__mask2__}}',
              field_type: 'text',
              parent: 'state',
            },
            {
              label: 'Context/poster',
              value: '{{__context__poster__}}',
              field_type: 'text',
              parent: 'state',
            },
          ],
        },
        {
          label: 'G',
          value: 'G',
          children: [
            {
              label: 'Context/mask1',
              value: '{{__context__mask1__}}',
              field_type: 'text',
              parent: 'state',
            },
            {
              label: 'Context/mask2',
              value: '{{__context__mask2__}}',
              field_type: 'text',
              parent: 'state',
            },
            {
              label: 'Context/poster',
              value: '{{__context__poster__}}',
              field_type: 'text',
              parent: 'state',
            },
          ],
        },
        {
          label: 'H',
          value: 'H',
          children: [
            {
              label: 'Context/mask1',
              value: '{{__context__mask1__}}',
              field_type: 'text',
              parent: 'state',
            },
            {
              label: 'Context/mask2',
              value: '{{__context__mask2__}}',
              field_type: 'text',
              parent: 'state',
            },
            {
              label: 'Context/poster',
              value: '{{__context__poster__}}',
              field_type: 'text',
              parent: 'state',
            },
          ],
        },
        {
          label: 'I',
          value: 'I',
          children: [
            {
              label: 'Context/mask1',
              value: '{{__context__mask1__}}',
              field_type: 'text',
              parent: 'state',
            },
            {
              label: 'Context/mask2',
              value: '{{__context__mask2__}}',
              field_type: 'text',
              parent: 'state',
            },
            {
              label: 'Context/poster',
              value: '{{__context__poster__}}',
              field_type: 'text',
              parent: 'state',
            },
          ],
        },
        {
          label: 'J',
          value: 'J',
          children: [
            {
              label: 'Context/mask1',
              value: '{{__context__mask1__}}',
              field_type: 'text',
              parent: 'state',
            },
            {
              label: 'Context/mask2',
              value: '{{__context__mask2__}}',
              field_type: 'text',
              parent: 'state',
            },
            {
              label: 'Context/poster',
              value: '{{__context__poster__}}',
              field_type: 'text',
              parent: 'state',
            },
          ],
        },
      ],
    },
  ];
  const [queryString, setQueryString] = useState<string | null>(null);

  const onSelectOption = useCallback(
    (
      selectedOption: { label: string; value: string; parent?: string },
      nodeToRemove: TextNode | null,
      closeMenu: () => void,
    ) => {
      editor.update(() => {
        if (nodeToRemove) nodeToRemove.remove();

        editor.dispatchCommand(
          INSERT_VARIABLE_VALUE_BLOCK_COMMAND,
          formatVariableValue2Editor(
            selectedOption.label,
            selectedOption.value,
          ),
        );

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
                    <CascaderContent
                      options={mockOptions}
                      value={queryString || ''}
                      onValueChange={({ label, value, parent }) => {
                        selectOptionAndCleanUp({ label, value, parent });
                      }}
                      className="w-[260px]"
                      emptyText="No options available"
                    />
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
