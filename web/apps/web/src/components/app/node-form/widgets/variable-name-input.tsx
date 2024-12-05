/* eslint-disable */
import { useState } from 'react';
import {
  CheckIcon,
  RectangleStackIcon,
  Square3Stack3DIcon,
} from '@heroicons/react/24/outline';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  HeroIcon,
  IconButton,
  Input,
  Cascader,
  CascaderOption,
  Text,
  useFormContext,
} from '@shellagent/ui';
import { refTypeSchema } from '@shellagent/shared/protocol/app-scope';
import {
  FieldModeEnum,
  FieldMode,
} from '@shellagent/shared/protocol/extend-config';
import { useSchemaContext } from '@/stores/app/schema-provider';
import { removeBrackets } from '@shellagent/shared/utils';
import { contextTempReg } from '@/stores/app/utils/data-transformer';

import { useInjection } from 'inversify-react';
import { AppBuilderModel } from '@/stores/app/models/app-builder.model';

interface VariableSelectProps {
  name: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  placeholder?: string;
  schemaTypes?: string[];
}

const ModeOptions: Array<{
  label: string;
  value: FieldMode;
  icon: HeroIcon;
}> = [
  {
    label: 'Custom Output Name',
    value: FieldModeEnum.Enum.ui,
    icon: RectangleStackIcon,
  },
  {
    label: 'Select Output',
    value: FieldModeEnum.Enum.ref,
    icon: Square3Stack3DIcon,
  },
];

const VariableNameInput = (props: VariableSelectProps) => {
  const { value, onChange } = props;
  const { setValue, getValues } = useFormContext();
  const stateName = useSchemaContext(state => state.id);
  const [mode, setMode] = useState(
    getValues('name_mode') || FieldModeEnum.Enum.ui,
  );

  const IconMode = ModeOptions.find(item => item.value === mode)?.icon!;

  const appBuilder = useInjection<AppBuilderModel>('AppBuilderModel');

  const contextOptions = appBuilder.getRefOptions(
    stateName as Lowercase<string>,
    refTypeSchema.Enum.state_output_key,
  );

  const onValueChange = (value: string) => {
    const displayName = removeBrackets(
      value?.replace(contextTempReg, 'Context/$1'),
    );
    onChange?.(value);
    setValue('display_name', displayName);
  };

  const onModeChange = (value: string) => {
    if (value === mode) {
      return;
    }
    setMode(value);
    onValueChange('');
    setValue('name_mode', value);
  };

  return (
    <div className="w-full flex items-center gap-x-1.5">
      <div className="grow">
        {mode === FieldModeEnum.Enum.ref ? (
          <Cascader
            className="w-44"
            emptyText="No variable"
            placeholder="Please select variable"
            showParentLabel
            options={contextOptions as CascaderOption[]}
            value={value}
            onValueChange={onValueChange}
          />
        ) : (
          <Input onChange={e => onValueChange(e.target.value)} value={value} />
        )}
      </div>
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
          <DropdownMenuContent className="w-60" sideOffset={5}>
            {ModeOptions.map(item => (
              <DropdownMenuItem
                key={item.label}
                className="flex justify-between hover:bg-surface-container rounded-lg py-1 px-2 mt-1"
                onClick={() => onModeChange(item.value)}>
                <div className="flex items-center">
                  <item.icon className="w-5 h-5" />
                  <Text className="ml-1.5">{item.label}</Text>
                </div>
                {mode === item.value ? (
                  <CheckIcon className="w-5 h-5 text-primary" />
                ) : null}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenuPortal>
      </DropdownMenu>
    </div>
  );
};

VariableNameInput.displayName = 'VariableNameInput';

export { VariableNameInput };
