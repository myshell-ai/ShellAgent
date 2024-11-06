import { ISelectProps, Cascader, CascaderOption } from '@shellagent/ui';
import { RefSceneEnum } from '@shellagent/shared/protocol/app-scope';
import { useCallback } from 'react';
import { useSelectOptions } from './use-select-options';
import { useInjection } from 'inversify-react';
import { AppBuilderModel } from '@/components/app/app-builder.model';
import { useSchemaContext } from '@/stores/app/schema-provider';
interface IVariableValue {
  target: { value: string };
}

interface VariableSelectProps extends ISelectProps {
  name: string;
  value?: string;
  onChange?: (e: IVariableValue) => void;
  className?: string;
  placeholder?: string;
}

const VariableSelect = (props: VariableSelectProps) => {
  const { name, onChange, value, ...rest } = props;
  const options = useSelectOptions(name);
  const appBuilder = useInjection(AppBuilderModel);
  const stateId = useSchemaContext(state => state.id);

  const handleChange = useCallback(
    (val: string) => {
      onChange?.({ target: { value: val } });
      appBuilder.hanldeRefScene({
        scene: RefSceneEnum.Enum.set_nodedata_key_val,
        params: {
          stateName: stateId as Lowercase<string>,
          key: name,
          newValue: val,
          mode: 'ref',
        },
      });
    },
    [appBuilder.hanldeRefScene, stateId, name],
  );

  return (
    <Cascader
      className="w-44"
      emptyText="No variable"
      {...rest}
      placeholder="Please select variable"
      showParentLabel
      options={options as CascaderOption[]}
      value={value}
      onValueChange={handleChange}
    />
  );
};

VariableSelect.displayName = 'VariableSelect';

export { VariableSelect };
