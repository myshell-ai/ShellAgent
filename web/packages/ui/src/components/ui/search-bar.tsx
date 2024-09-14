'use client';
import MagnifyingGlassIcon from '@heroicons/react/24/outline/esm/MagnifyingGlassIcon';
import XMarkIcon from '@heroicons/react/24/outline/esm/XMarkIcon';
import { cva } from 'class-variance-authority';
import * as React from 'react';
import { useEffect } from 'react';

import { cn } from '../../lib/utils';

import { Icon } from './icon';
import { Input } from './input';

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;
export type SearchBarProps = {
  /**
   * 默认值
   */
  defaultValue?: string;
  /**
   * searchBar样式覆盖
   */
  className?: string;
  /**
   * input样式覆盖
   */
  inputClassName?: string;
  /**
   * 点击或键盘按下回车时触发回调函数
   */
  onSearchChange: (value: string) => void;
  /**
   * placeholder值
   */
  placeholder?: string;
  /**
   * 清除input值
   */
  clearInputValue?: boolean;
  /**
   * 大小 sm(default) | md
   *
   * @default sm
   */
  size?: 'md' | 'sm';
} & InputProps;

const searchBarVariants = cva('rounded-full', {
  variants: {
    size: {
      md: 'h-11',
      sm: 'h-10',
    },
  },
  defaultVariants: {
    size: 'sm',
  },
});

function SearchBar({
  defaultValue,
  className,
  clearInputValue,
  inputClassName,
  placeholder,
  type,
  size,
  readOnly,
  onSearchChange,
  ...props
}: SearchBarProps) {
  const [value, setValue] = React.useState('');
  useEffect(() => {
    clearInputValue && setValue('');
  }, [clearInputValue]);
  useEffect(() => {
    setValue(defaultValue || '');
  }, [defaultValue]);

  return (
    <div
      className={cn('relative w-full', searchBarVariants({ size }), className)}>
      <Icon
        component={MagnifyingGlassIcon}
        size="lg"
        className="absolute top-1/2 -translate-y-1/2 left-3 z-10 text-subtler cursor-pointer"
        onClick={() => {
          onSearchChange(value);
        }}
      />
      <Input
        type={type}
        placeholder={placeholder}
        rounded="full"
        size="sm"
        className={cn(
          'relative w-full !px-9 flex space-x-2 text-base shadow-none',
          {
            'focus-visible:ring-transparent': readOnly,
          },
          className,
        )}
        value={value}
        onChange={e => {
          setValue(e.target.value);
        }}
        onKeyDown={e => {
          if (e.key === 'Enter' && !(e.shiftKey || e.altKey)) {
            onSearchChange(value);
          }
        }}
        {...props}
      />
      {value && (
        <div
          className="absolute top-1/2 -translate-y-1/2 right-3 z-10 cursor-pointer flex justify-center items-center shadow-button-basic border-default border rounded-full h-5 w-5 "
          onClick={() => {
            onSearchChange('');
            setValue('');
          }}>
          <Icon component={XMarkIcon} size="sm" className="text-icon" />
        </div>
      )}
    </div>
  );
}
SearchBar.displayName = 'SearchBar';

export { SearchBar };
