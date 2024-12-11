import { memo } from 'react';

import { MenuOption } from '@lexical/react/LexicalTypeaheadMenuPlugin';

export class VariableOption extends MenuOption {
  title: string;
  icon?: JSX.Element;
  keywords: Array<string>;
  keyboardShortcut?: string;
  onSelect: (queryString: string) => void;
  disabled?: boolean;

  constructor(
    title: string,
    options: {
      icon?: JSX.Element;
      keywords?: Array<string>;
      keyboardShortcut?: string;
      onSelect: (queryString: string) => void;
      disabled?: boolean;
    },
  ) {
    super(title);
    this.title = title;
    this.keywords = options.keywords || [];
    this.icon = options.icon;
    this.keyboardShortcut = options.keyboardShortcut;
    this.onSelect = options.onSelect.bind(this);
    this.disabled = options.disabled;
  }
}

type VariableMenuItemProps = {
  startIndex: number;
  index: number;
  isSelected: boolean;
  onClick: (index: number, option: VariableOption) => void;
  onMouseEnter: (index: number, option: VariableOption) => void;
  option: VariableOption;
};
export const VariableMenuItem = memo(
  ({
    startIndex,
    index,
    isSelected,
    onClick,
    onMouseEnter,
    option,
  }: VariableMenuItemProps) => {
    return (
      <div
        key={option.key}
        className={`
        flex items-center px-3 h-6 cursor-pointer hover:bg-gray-50 rounded-md
        ${isSelected && !option.disabled && '!bg-gray-50'}
        ${
          option.disabled
            ? 'cursor-not-allowed opacity-30'
            : 'hover:bg-gray-50 cursor-pointer'
        }
      `}
        tabIndex={-1}
        ref={option.setRefElement}
        onMouseEnter={() => onMouseEnter(index + startIndex, option)}
        onClick={() => onClick(index + startIndex, option)}>
        {option.icon}
        <div className="ml-1 text-[13px] text-gray-900">{option.title}</div>
      </div>
    );
  },
);
VariableMenuItem.displayName = 'VariableMenuItem';

type VariableMenuProps = {
  startIndex: number;
  selectedIndex: number | null;
  options: any[];
  onClick: (index: number, option: any) => void;
  onMouseEnter: (index: number, option: any) => void;
};
const VariableMenu = ({
  startIndex,
  selectedIndex,
  options,
  onClick,
  onMouseEnter,
}: VariableMenuProps) => {
  return (
    <div className="p-1">
      {options.map((option, index: number) => (
        <VariableMenuItem
          startIndex={startIndex}
          index={index}
          isSelected={selectedIndex === index + startIndex}
          onClick={onClick}
          onMouseEnter={onMouseEnter}
          key={option.key}
          option={option}
        />
      ))}
    </div>
  );
};

export default memo(VariableMenu);
