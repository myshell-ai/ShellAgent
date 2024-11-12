'use client';

import { Tooltip } from '@shellagent/ui';
import { useTranslations } from 'next-intl';
import {
  ChangeEvent,
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
} from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { useEffectOnce } from 'react-use';

import { cn } from '@/utils/cn';

export interface ITextInput
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  value: string;
  sendDisabled?: boolean;
  onSend?: (text: string) => void;
}

export const TextInput = forwardRef<
  {
    focus: () => void;
    blur: () => void;
  },
  ITextInput
>(
  (
    {
      value,
      disabled,
      sendDisabled,
      onChange,
      onSend,
      style,
      className,
      rows,
      autoFocus,
      ...props
    },
    ref,
  ) => {
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const compositionFlag = useRef<boolean>(false);

    const handleCompositionStart = () => {
      compositionFlag.current = true;
    };

    const handleCompositionEnd = () => {
      compositionFlag.current = false;
    };

    useImperativeHandle(ref, () => ({
      focus: () => {
        inputRef.current?.focus();
      },
      blur: () => {
        inputRef.current?.blur();
      },
    }));

    const handleInputChange: React.ChangeEventHandler<HTMLTextAreaElement> =
      useCallback(
        e => {
          if ((e?.nativeEvent as InputEvent)?.inputType !== 'insertLineBreak') {
            onChange?.(e);
          }
        },
        [onChange],
      );

    const handleSelectionRange = (range: number) => {
      inputRef?.current?.setSelectionRange(range, range);
    };

    const handleEnterPress: React.KeyboardEventHandler<HTMLTextAreaElement> =
      useCallback(
        e => {
          if (!(e.target as HTMLTextAreaElement)?.value) {
            return;
          }

          if (e.key === 'Enter') {
            if (e.shiftKey) {
              const {
                value: v,
                selectionStart,
                selectionEnd,
              } = e.target as HTMLTextAreaElement;
              const prev = v.slice(0, selectionStart);
              const next = v.slice(selectionEnd);
              onChange?.({
                target: {
                  value: `${prev}\n${next}`,
                },
              } as ChangeEvent<HTMLTextAreaElement>);
              const newRange = selectionStart + 1;
              setTimeout(() => {
                handleSelectionRange(newRange);
              });
            } else {
              e.preventDefault();

              if (compositionFlag.current) return;

              if (sendDisabled) return;

              onSend?.(value);
            }
          }
        },
        [onChange, onSend, sendDisabled, value],
      );

    useEffectOnce(() => {
      handleSelectionRange(value.length);
    });

    return (
      <TextareaAutosize
        ref={inputRef}
        className={cn(
          'flex w-full resize-none bg-surface-hovered text-sm text-default placeholder:text-subtlest focus-visible:outline-none disabled:cursor-not-allowed disabled:placeholder:text-disabled max-h-full overflow-auto',
          className,
        )}
        rows={rows || 1}
        disabled={disabled}
        value={value}
        onChange={handleInputChange}
        autoFocus={autoFocus ?? true}
        onKeyDown={handleEnterPress}
        onCompositionStart={handleCompositionStart}
        onCompositionEnd={handleCompositionEnd}
        {...props}
      />
    );
  },
);

TextInput.displayName = 'TextInput';
