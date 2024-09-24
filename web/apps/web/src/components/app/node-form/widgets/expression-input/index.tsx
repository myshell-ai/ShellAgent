import React, { useCallback, useEffect, useMemo } from 'react';
import {
  MentionsInput,
  OnChangeHandlerFunc,
  Mention,
  SuggestionDataItem,
  DataFunc,
} from 'react-mentions';

import classNames from './index.module.css';
import {
  flattenOptions,
  MentionRegex,
  WrapperRegex,
  DEFAULT_LABEL,
} from './utils';
import { useSelectOptions } from '../variable-select/use-select-options';

interface IExpressionValue {
  target: { value: string | number };
}

interface IExpressionInputProps {
  value?: string;
  onChange?: (e: IExpressionValue) => void;
  singleLine?: boolean;
  name?: string;
  placeholder?: string;
}

const ExpressionInput: React.FC<IExpressionInputProps> = ({
  onChange,
  value,
  singleLine,
  name,
  placeholder,
}) => {
  const options = useSelectOptions(name);
  const flatOptions = flattenOptions(options);

  const getWrappedText = (text: string) => {
    let currentIndex = 0;

    while (currentIndex < text.length) {
      const wrapperMatch = text.slice(currentIndex).match(WrapperRegex);

      if (wrapperMatch) {
        // 如果找到了 {{ }} 包裹的内容,则跳过这部分
        currentIndex += wrapperMatch[0].length;
      } else {
        // 如果没有找到 {{ }} 包裹的内容,则记录当前位置
        const startIndex = currentIndex;

        currentIndex += 1;

        // 继续向后搜索,直到找到下一个 {{ 或到达字符串末尾
        while (currentIndex < text.length && text[currentIndex] !== '{') {
          currentIndex += 1;
        }

        const endIndex = currentIndex;
        const matchText = text.slice(startIndex, endIndex);
        const [curText] = matchText.match(MentionRegex) || [];
        // 如果存在未被{{  }}包裹的变量，自动包裹
        if (curText && !matchText.includes(`{{ ${curText} }}`)) {
          const firstPart = text.slice(0, startIndex);
          const lastPart = text.slice(endIndex + 1);
          const replaceChar = text
            .slice(startIndex, endIndex)
            .replace(curText, `{{ ${curText} }}`);
          text = firstPart + replaceChar + lastPart;
        }
      }
    }

    return text;
  };

  // TODO 如果多个value相同，只能映射到最后一个label
  const v2l = (value: string) => {
    const valueToLabelMap = new Map<string, string>();

    // 构建 value 到 label 的映射
    flatOptions.forEach(item => {
      const { value: itemValue, label } = item;
      if (itemValue) {
        valueToLabelMap.set(itemValue, label || DEFAULT_LABEL);
      }
    });

    // 替换 value 为对应的 label
    valueToLabelMap.forEach((label, itemValue) => {
      const regex = new RegExp(`\\b${itemValue}\\b`, 'g');
      // 确保替换时没有重复替换
      value = value.replace(regex, match => {
        // 检查是否已经被替换过
        const alreadyReplaced = new RegExp(
          `@\\[${label}\\]\\(value:${itemValue}\\)`,
        ).test(value);
        return alreadyReplaced ? match : `@[${label}](value:${itemValue})`;
      });
    });

    return value;
  };

  const l2v = (label: string) => {
    const str =
      flatOptions?.reduce<string>((prev, item) => {
        const { value, label: itemLabel } = item;
        if (value && prev) {
          const regex = new RegExp(
            `@\\[${itemLabel || DEFAULT_LABEL}\\]\\(value:${value}\\)`,
            'g',
          );
          prev = prev.replace(regex, value || '');
        }
        return prev;
      }, label) || label;
    return str;
  };

  // TODO trick的写法
  useEffect(() => {
    const suggestionsContainer = document.querySelector(
      '#mentions__suggestions_container',
    );
    if (suggestionsContainer && suggestionsContainer.parentElement) {
      suggestionsContainer.parentElement.style.zIndex = '10000'; // 修改父元素的z-index
    }
  });

  const onNewChange: OnChangeHandlerFunc = (
    e: { target: any },
    newValue: string,
  ) => {
    const text = getWrappedText(newValue);
    e.target.value = l2v(text);
    onChange?.(e);
  };

  const newValue = value ? v2l(value) : value;

  const mentions =
    flatOptions?.reduce<SuggestionDataItem[]>((memo, cur) => {
      if (cur.value) {
        memo.push({
          id: cur.value,
          display: cur.label || DEFAULT_LABEL,
        });
      }
      return memo;
    }, []) || [];

  const source: DataFunc = (
    search: any,
    callback: (arg0: SuggestionDataItem[]) => void,
  ) => {
    if (!search) {
      callback(mentions);
    } else {
      callback(mentions.filter(item => item.display?.includes(search)));
    }
  };

  const customSuggestionsContainer = useCallback(
    (children: any) => (
      <div
        id="mentions__suggestions_container"
        className={classNames.mentions__suggestions_container}>
        {children}
      </div>
    ),
    [],
  );

  return (
    <MentionsInput
      value={newValue || ''}
      onChange={onNewChange}
      className="mentions"
      classNames={classNames}
      onMouseDownCapture={e => {
        e.stopPropagation();
      }}
      onKeyDown={(e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' || e.key === 'Delete') {
          e.stopPropagation();
        }
      }}
      onWheelCapture={(e: React.WheelEvent) => e.stopPropagation()}
      allowSpaceInQuery
      singleLine={singleLine}
      placeholder={
        placeholder ??
        "Support for entering '{{ }}' embedded expressions, mention variable using '/'."
      }
      a11ySuggestionsListLabel="Suggested mentions"
      suggestionsPortalHost={document.body}
      customSuggestionsContainer={customSuggestionsContainer}>
      <Mention
        markup="@[__display__](value:__id__)"
        trigger="/"
        data={source}
        renderSuggestion={(
          suggestion,
          search,
          highlightedDisplay,
          index,
          focused,
        ) => (
          <div
            className={`flex ${classNames.mentions__suggestions__item} ${
              focused ? classNames['mentions__suggestions__item--focused'] : ''
            }`}>
            {highlightedDisplay}
          </div>
        )}
        className={classNames.mentions__mention}
      />
    </MentionsInput>
  );
};

ExpressionInput.displayName = 'ExpressionInput';

export { ExpressionInput };
