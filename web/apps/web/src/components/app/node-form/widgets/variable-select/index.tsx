import { ISelectProps, Cascader, CascaderOption } from '@shellagent/ui';

import { useSelectOptions } from './use-select-options';

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

  return (
    <Cascader
      className="w-44"
      emptyText="No variable"
      {...rest}
      placeholder="Please select variable"
      showParentLabel
      options={options as CascaderOption[]}
      value={value}
      onValueChange={val => onChange?.({ target: { value: val } })}
    />
  );
};

VariableSelect.displayName = 'VariableSelect';

export { VariableSelect };
