import {
  CheckIcon,
  CodeBracketSquareIcon,
  RectangleStackIcon,
  Square3Stack3DIcon,
} from '@heroicons/react/24/outline';
import {
  FieldModeEnum,
  FieldMode,
} from '@shellagent/shared/protocol/extend-config';
import { RefSceneEnum } from '@shellagent/shared/protocol/app-scope';

import { useInjection } from 'inversify-react';
import { AppBuilderModel } from '@/components/app/app-builder.model';
import { useSchemaContext } from '@/stores/app/schema-provider';
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
  value: FieldMode;
  icon: HeroIcon;
}> = [
  {
    label: 'UI Mode',
    value: FieldModeEnum.Enum.ui,
    icon: RectangleStackIcon,
  },
  {
    label: 'Ref Mode',
    value: FieldModeEnum.Enum.ref,
    icon: Square3Stack3DIcon,
  },
  {
    label: 'Code mode',
    value: FieldModeEnum.Enum.raw,
    icon: CodeBracketSquareIcon,
  },
];

interface IModeSelectProps {
  name: string;
  defaultValue: FieldMode;
  onChange?: (value: FieldMode) => void;
  defaultOptions?: string[];
}

export function ModeSelect({
  defaultValue,
  onChange,
  defaultOptions,
  name,
}: IModeSelectProps) {
  const [value, setValue] = useState<FieldMode>(defaultValue);
  const appBuilder = useInjection(AppBuilderModel);
  const stateId = useSchemaContext(state => state.id);

  const options = useMemo(() => {
    if (!defaultOptions) {
      return ModeOptions;
    }
    return ModeOptions.filter(option => defaultOptions?.includes(option.value));
  }, [defaultOptions]);

  const IconMode = useMemo(
    () =>
      options.find(item => item.value === (value || FieldModeEnum.Enum.ui))
        ?.icon!,
    [options, value],
  );

  const handleChange = useCallback(
    (value: FieldMode) => {
      setValue(value);
      onChange?.(value);
      appBuilder.hanldeRefScene({
        scene: RefSceneEnum.Enum.change_nodedata_mode,
        params: {
          stateName: stateId as Lowercase<string>,
          mode: value,
          key: name,
        },
      });
    },
    [appBuilder.hanldeRefScene, name, stateId],
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
