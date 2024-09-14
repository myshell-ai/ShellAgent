import { canConvertVariable } from '@shellagent/form-engine';
import {
  ContextMenuItem,
  ContextMenuSub,
  ContextMenuShortcut,
  ContextMenuSubTrigger,
  ContextMenuSubContent,
  Switch,
  ContextMenuLabel,
} from '@shellagent/ui';
import { get, keys } from 'lodash-es';

import { useWorkflowStore } from '@/stores/workflow/workflow-provider';

interface ConvertInputProps {
  id: string;
  inputAllTypes?: Record<string, string>;
}

export default function ConvertInput({ id, inputAllTypes }: ConvertInputProps) {
  const { fieldsModeMap, setFieldsModeMap } = useWorkflowStore(state => ({
    setFieldsModeMap: state.setFieldsModeMap,
    fieldsModeMap: state.config?.fieldsModeMap?.[id] || {},
  }));
  const list: {
    name: string;
    type: string;
    checked: boolean;
    disabled?: boolean;
  }[] = keys(inputAllTypes).map(key => {
    const isVariable =
      inputAllTypes?.[key] !== inputAllTypes?.[key]?.toLowerCase();
    return {
      name: key,
      type: inputAllTypes?.[key]?.toUpperCase() || '',
      disabled: isVariable && inputAllTypes?.[key] !== canConvertVariable,
      checked: get(fieldsModeMap, key, isVariable ? 'ref' : '') === 'ref',
    };
  });
  const onSwitchChange = (name: string, checked: boolean) => {
    setFieldsModeMap({
      id,
      name,
      mode: checked ? 'ref' : 'ui',
    });
  };

  const preventDefault = (e: any) => e.preventDefault();

  return (
    <ContextMenuSub>
      <ContextMenuSubTrigger>Inputs</ContextMenuSubTrigger>
      <ContextMenuSubContent className="min-w-36">
        <ContextMenuLabel className="text-xs text-subtlest font-normal cursor-pointer">
          Inputs
        </ContextMenuLabel>
        {list?.map(item => (
          <ContextMenuItem
            key={`${id}-${item.name}-convert`}
            onClick={preventDefault}>
            {`${item.name}(${item.type})`}
            <ContextMenuShortcut>
              <Switch
                className="ml-2"
                size="sm"
                disabled={item.disabled}
                checked={item.checked}
                onCheckedChange={checked => onSwitchChange(item?.name, checked)}
              />
            </ContextMenuShortcut>
          </ContextMenuItem>
        ))}
      </ContextMenuSubContent>
    </ContextMenuSub>
  );
}
