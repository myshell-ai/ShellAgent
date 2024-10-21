import { ISelectProps, Cascader, CascaderOption } from '@shellagent/ui';

import { useVariableContext } from '@/stores/workflow/variable-provider';

interface IVariableValue {
  target: { value: string };
}

interface VariableSelectProps extends ISelectProps {
  value?: string;
  onChange?: (e: IVariableValue) => void;
  className?: string;
  placeholder?: string;
  schemaTypes?: string[];
}

const VariableSelect = (props: VariableSelectProps) => {
  const { name, onChange, value, schemaTypes, ...rest } = props;
  const scope = useVariableContext(state => state.scope);

  const options =
    scope?.reduce((prev, item) => {
      const children = item.children?.reduce((childs, child) => {
        if (
          name?.startsWith('output.') ||
          (child.field_type && schemaTypes?.includes(child.field_type))
        ) {
          childs.push({
            label: child.label,
            value: `{{${child.value}}}`,
          });
        }
        return childs;
      }, [] as CascaderOption[]);
      if (children?.length) {
        prev.push({
          label: item.label,
          value: `{{${item.value}}}`,
          children,
        });
      }
      return prev;
    }, [] as CascaderOption[]) || [];

  return (
    <Cascader
      emptyText="No variable"
      {...rest}
      clearByDefault
      placeholder="Please select variable"
      showParentLabel
      options={options}
      value={value}
      onValueChange={val => onChange?.({ target: { value: val } })}
    />
  );
};

VariableSelect.displayName = 'VariableSelect';

export { VariableSelect };
