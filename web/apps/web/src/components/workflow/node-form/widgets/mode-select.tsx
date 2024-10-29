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
import { useState } from 'react';

// import { useVariableContext } from '@/stores/workflow/variable-provider';

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
}

export function ModeSelect({ defaultValue, onChange }: IModeSelectProps) {
  const [value, setValue] = useState<TFieldMode>(defaultValue);

  const IconMode = ModeOptions.find(item => item.value === (value || 'ui'))
    ?.icon!;

  const handleChange = (value: TFieldMode) => {
    setValue(value);
    onChange?.(value);
  };

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
          {ModeOptions.map(item => (
            <DropdownMenuItem
              key={item.label}
              className="flex justify-between hover:bg-surface-container rounded-lg py-1 px-2 mt-1"
              onClick={() => handleChange(item.value)}>
              <div className="flex items-center">
                <item.icon className="w-5 h-5" />
                <Text className="ml-1.5">{item.label}</Text>
              </div>
              {value === item.value ? (
                <CheckIcon className="w-5 h-5 text-primary" />
              ) : null}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenuPortal>
    </DropdownMenu>
  );
}

ModeSelect.displayName = 'ModeSelect';
