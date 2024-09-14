/* eslint-disable */
import { useMemo, useState } from 'react';
import {
  CheckIcon,
  RectangleStackIcon,
  Square3Stack3DIcon,
} from '@heroicons/react/24/outline';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  IconButton,
  Text,
  HeroIcon,
  ISelectProps,
  Input,
  Select,
  useFormContext,
} from '@shellagent/ui';
import { useFormEngineContext, TFieldMode } from '@shellagent/form-engine';

import { useVariableContext } from '@/stores/app/variable-provider';
import { uuid } from '@shellagent/flow-engine';

interface VariableSelectProps extends ISelectProps {
  name: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  placeholder?: string;
  schemaTypes?: string[];
}

const ModeOptions: Array<{
  label: string;
  value: TFieldMode;
  icon: HeroIcon;
}> = [
  {
    label: 'Custom Output Name',
    value: 'ui',
    icon: RectangleStackIcon,
  },
  {
    label: 'Select Output',
    value: 'ref',
    icon: Square3Stack3DIcon,
  },
];

const VariableNameInput = (props: VariableSelectProps) => {
  const { name, value } = props;
  const context = useVariableContext(state => state.context);
  const { setValue, getValues } = useFormContext();
  const [mode, setMode] = useState(getValues('name_mode') || 'ui');
  const { parent } = useFormEngineContext();

  const IconMode = ModeOptions.find(item => item.value === mode)?.icon!;

  const options = useMemo(() => {
    return (
      (context?.[0]?.children?.map(item => ({
        label: `Start-Context/${item.label}`,
        value: item.value,
      })) as ISelectProps['options']) || []
    );
  }, [context]);

  const onValueChange = (value: string) => {
    if (value.startsWith('__context__')) {
      const item = options?.find(item => item.value === value);
      setValue(name, item?.label);
      setValue('__changeKey__', value);
    } else {
      setValue(name, value);
      if (parent?.startsWith('output.__context__') || !value) {
        setValue('__changeKey__', uuid());
      }
    }
  };
  const selectValue = parent?.replace('output.', '');

  const onModeChange = (mode: string) => {
    setMode(mode);
    onValueChange('');
    setValue('name_mode', mode);
  };

  return (
    <div className="w-full flex items-center gap-x-1.5">
      <div className="grow">
        {mode === 'ref' ? (
          <Select
            onValueChange={onValueChange}
            options={options}
            placeholder={
              options?.length ? 'Please select Output' : 'No Context'
            }
            value={
              options?.find(
                item =>
                  item.value === selectValue ||
                  item.value === getValues('__changeKey__'),
              )?.value
            }
          />
        ) : (
          <Input
            onChange={e => onValueChange(e.target.value)}
            value={value || 'Untitled'}
          />
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
