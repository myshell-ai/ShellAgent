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
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  IconButton,
  Text,
  HeroIcon,
  useFormContext,
} from '@shellagent/ui';
import {
  useFormEngineContext,
  getDefaultValueBySchema,
} from '@shellagent/form-engine';
import { useWorkflowStore } from '@/stores/workflow/workflow-provider';
import { useSchemaContext } from '@/stores/workflow/schema-provider';

import { useMemo, useCallback, useEffect } from 'react';

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

const rawReg = /{{.*}}/;
const refReg = /^({{).*(}})$/;

interface IModeSelectProps {
  name: string;
  onChange?: (value: FieldMode) => void;
}

export function ModeSelect({ onChange, name }: IModeSelectProps) {
  const { setFieldsModeMap, fieldsModeMap } = useWorkflowStore(state => ({
    setFieldsModeMap: state.setFieldsModeMap,
    fieldsModeMap: state.config?.fieldsModeMap,
  }));
  const id = useSchemaContext(state => state.id);

  const { parent, fields } = useFormEngineContext();
  const { setValue, getValues } = useFormContext();
  const { schema } = fields[name] || {};

  const {
    'x-raw': xRaw,
    'x-raw-default': xRawDefault,
    'x-raw-options': defaultOptions,
    'x-raw-disabled': xRawDisabled,
  } = schema;

  const defaultValue = useMemo(() => {
    if (!xRaw) {
      return FieldModeEnum.Enum.ui;
    }
    const currentValue = getValues(name);
    if (refReg.test(currentValue)) {
      return FieldModeEnum.Enum.ref;
    }
    if (rawReg.test(currentValue)) {
      return FieldModeEnum.Enum.raw;
    }
    return xRawDefault || FieldModeEnum.Enum.ui;
  }, [name, xRaw, xRawDefault]);

  const refPath = useMemo(
    () => (parent ? `${parent}.${name}` : name),
    [parent, name],
  );
  const currentMode = fieldsModeMap?.[id]?.[refPath] || defaultValue;

  // 仅作为通知外部变化
  useEffect(() => {
    if (onChange && currentMode) {
      onChange(currentMode);
    }
  }, [currentMode]);

  const options = useMemo(() => {
    if (!defaultOptions) {
      return ModeOptions;
    }
    return ModeOptions.filter(option => defaultOptions?.includes(option.value));
  }, [defaultOptions]);

  const IconMode = useMemo(
    () =>
      options.find(
        item => item.value === (currentMode || FieldModeEnum.Enum.ui),
      )?.icon!,
    [currentMode],
  );

  const handleChange = useCallback(
    (value: FieldMode) => {
      if (value === currentMode) return;

      setValue(
        name,
        value === FieldModeEnum.Enum.ui ? getDefaultValueBySchema(schema) : '',
      );

      setFieldsModeMap({
        id,
        name,
        mode: value,
      });
    },
    [name, currentMode, refPath, schema, fieldsModeMap],
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <IconButton
          size="sm"
          color="gray"
          variant="ghost"
          disabled={xRawDisabled}
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
              {currentMode === item.value && (
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
