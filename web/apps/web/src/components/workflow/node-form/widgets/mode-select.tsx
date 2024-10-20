import {
  CheckIcon,
  CodeBracketSquareIcon,
  RectangleStackIcon,
  Square3Stack3DIcon,
} from '@heroicons/react/24/outline';
import { TFieldMode } from '@shellagent/form-engine';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  IconButton,
  Text,
  HeroIcon,
} from '@shellagent/ui';
import { useState, useMemo, useCallback } from 'react';

const ModeOptions: Array<{
  label: string;
  value: TFieldMode;
  icon: HeroIcon;
}> = [
  {
    label: 'UI Mode',
    value: 'ui',
    icon: RectangleStackIcon,
  },
  {
    label: 'Ref Mode',
    value: 'ref',
    icon: Square3Stack3DIcon,
  },
  {
    label: 'Code mode',
    value: 'raw',
    icon: CodeBracketSquareIcon,
  },
];

interface IModeSelectProps {
  defaultValue: TFieldMode;
  onChange?: (value: TFieldMode) => void;
  defaultOptions?: string[];
}

export function ModeSelect({
  defaultValue,
  onChange,
  defaultOptions,
}: IModeSelectProps) {
  const [value, setValue] = useState<TFieldMode>(defaultValue);

  const options = useMemo(() => {
    if (!defaultOptions) {
      return ModeOptions;
    }
    return ModeOptions.filter(option => defaultOptions?.includes(option.value));
  }, [defaultOptions]);

  const IconMode = useMemo(
    () => options.find(item => item.value === (value || 'ui'))?.icon!,
    [options, value],
  );

  const handleChange = useCallback(
    (value: TFieldMode) => {
      setValue(value);
      onChange?.(value);
    },
    [onChange],
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <IconButton
          size="sm"
          color="gray"
          variant="ghost"
          icon={IconMode}
          className="border-0 hover:bg-surface-accent-gray-subtle focus-visible:ring-0"
        />
      </DropdownMenuTrigger>
      <DropdownMenuPortal>
        <DropdownMenuContent className="w-44" sideOffset={5}>
          {options.map(item => (
            <DropdownMenuItem
              key={item.label}
              className="flex justify-between hover:bg-surface-container rounded-lg py-1 px-2 mt-1"
              onClick={() => handleChange(item.value)}>
              <div className="flex items-center">
                <item.icon className="w-5 h-5" />
                <Text className="ml-1.5">{item.label}</Text>
              </div>
              {value === item.value && (
                <CheckIcon className="w-5 h-5 text-primary" />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenuPortal>
    </DropdownMenu>
  );
}

ModeSelect.displayName = 'ModeSelect';
