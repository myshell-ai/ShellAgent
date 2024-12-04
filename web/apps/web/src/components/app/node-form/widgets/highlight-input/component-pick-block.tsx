import {
  memo,
  useCallback,
  useState,
} from 'react'
import { type CascaderOption, CascaderContent } from '@shellagent/ui'
import type { TextNode } from 'lexical'
import type { MenuRenderFn } from '@lexical/react/LexicalTypeaheadMenuPlugin'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { LexicalTypeaheadMenuPlugin } from '@lexical/react/LexicalTypeaheadMenuPlugin'

type ComponentPickerProps = {
  triggerString: string
}

type MenuOption = CascaderOption & {
  key: string
  setRefElement: (element: HTMLElement) => void
}

const mockOptions: MenuOption[] = [
  {
    key: 'current',
    label: 'current',
    children: [
      {
        "label": "Input",
        "value": "{{}}",
        "children": [
          {
            "label": "image",
            "value": "{{key_1724934668552}}"
          }
        ]
      },
      {
        "label": "Output",
        "value": "{{}}",
        "children": [
          {
            "label": "Start-Context/image",
            "value": "{{__context__key_1724934375348__}}"
          }
        ]
      }
    ]
  },
  {
    "label": "global",
    "children": [
      {
        "label": "Start-Context",
        "value": "{{}}",
        "children": [
          {
            "label": "template_a",
            "value": "{{__context__key_1724933918131__}}"
          },
          {
            "label": "template_b",
            "value": "{{__context__key_1724933931632__}}"
          },
          {
            "label": "template_c",
            "value": "{{__context__key_1724933962593__}}"
          },
          {
            "label": "bot_name",
            "value": "{{__context__key_1724934336277__}}"
          },
          {
            "label": "image",
            "value": "{{__context__key_1724934375348__}}"
          },
          {
            "label": "selected_video",
            "value": "{{__context__key_1724934383882__}}"
          },
          {
            "label": "generated_video",
            "value": "{{__context__key_1724940882228__}}"
          }
        ]
      },
      {
        "label": "run generation",
        "value": "{{key_1724935721558}}",
        "children": [
          {
            "label": "Start-Context/generated_video",
            "value": "{{__context__key_1724940882228__}}"
          }
        ]
      },
      {
        "label": "save template",
        "value": "{{key_1724934631889}}",
        "children": [
          {
            "label": "Start-Context/selected_video",
            "value": "{{__context__key_1724934383882__}}"
          },
          {
            "label": "Start-Context/image",
            "value": "{{__context__key_1724934375348__}}"
          }
        ]
      },
      {
        "label": "upload image",
        "value": "{{key_1724934454894}}",
        "children": [
          {
            "label": "Start-Context/image",
            "value": "{{__context__key_1724934375348__}}"
          }
        ]
      },
      {
        "label": "retry(save context)",
        "value": "{{key_1724940176604}}",
        "children": [
          {
            "label": "Start-Context/image",
            "value": "{{__context__key_1724934375348__}}"
          },
          {
            "label": "Untitled",
            "value": "{{key_1724940176604.key_1724940325448}}"
          }
        ]
      }
    ]
  }
]

const ComponentPicker = ({
  triggerString,
}: ComponentPickerProps) => {
  const [editor] = useLexicalComposerContext()

  const [queryString, setQueryString] = useState<string | null>(null)

  const onSelectOption = useCallback(
    (
      selectedOption: any,
      nodeToRemove: TextNode | null,
      closeMenu: () => void,
      matchingString: string,
    ) => {
      editor.update(() => {
        if (nodeToRemove && selectedOption?.key)
          nodeToRemove.remove()

        if (selectedOption?.onSelect)
          selectedOption.onSelect(matchingString)

        closeMenu()
      })
    },
    [editor],
  )

  const renderMenu = useCallback<MenuRenderFn<any>>((
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
            const selectedOption = mockOptions.find(opt => opt.key === value)
            selectOptionAndCleanUp(selectedOption)
          }}
          className="z-[999999]"
        />
      )
    }
    return null
  }, [mockOptions, queryString])

  const PUNCTUATION = '\\.,\\+\\*\\?\\$\\@\\|#{}\\(\\)\\^\\-\\[\\]\\\\/!%\'"~=<>_:;'

  const triggerFn = useCallback(
    (text: string) => {
      const validChars = `[${PUNCTUATION}\\s]`
      const TypeaheadTriggerRegex = new RegExp(
        '(.*)('
        + `[${triggerString}]`
        + `((?:${validChars}){0, 0})`
        + ')$',
      )
      const match = TypeaheadTriggerRegex.exec(text)
      if (match !== null) {
        const maybeLeadingWhitespace = match[1]
        const matchingString = match[3]
        if (matchingString.length >= 0) {
          return {
            leadOffset: match.index + maybeLeadingWhitespace.length,
            matchingString,
            replaceableString: match[2],
          }
        }
      }
      return null
    },
    [triggerString],
  )

  return (
    <LexicalTypeaheadMenuPlugin<MenuOption>
      options={mockOptions}
      onQueryChange={setQueryString}
      onSelectOption={onSelectOption}
      anchorClassName='z-[999999]'
      menuRenderFn={renderMenu}
      triggerFn={triggerFn}
    />
  )
}

export default memo(ComponentPicker)
