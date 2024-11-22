import { useFormEngineContext } from '@shellagent/form-engine';
import { RefSceneEnum } from '@shellagent/shared/protocol/app-scope';
import { removeBrackets } from '@shellagent/shared/utils';
import { ISelectProps, Cascader, CascaderOption } from '@shellagent/ui';
import { useInjection } from 'inversify-react';
import { useCallback } from 'react';

import { AppBuilderModel } from '@/stores/app/models/app-builder.model';
import { useSchemaContext } from '@/stores/app/schema-provider';

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

const contextReg = /__context__([a-z0-9_]+)__/g;

const VariableSelect = (props: VariableSelectProps) => {
  const { name, onChange, value, ...rest } = props;
  const options = useSelectOptions(name);
  const appBuilder = useInjection<AppBuilderModel>('AppBuilderModel');
  const stateId = useSchemaContext(state => state.id);
  const { parent } = useFormEngineContext();

  const handleChange = useCallback(
    (val: string, parentKey?: string) => {
      onChange?.({ target: { value: val } });

      // const replacedString = val.replace(contextReg, 'context.$1');

      // const newValue = contextReg.test(val)
      //   ? removeBrackets(val)
      //   : `${stateId}.${parentKey ? `${parentKey}.` : ''}${removeBrackets(
      //       val,
      //   )}`;

      // trick的写法
      const newValue =
        parentKey === 'state'
          ? removeBrackets(val)
          : contextReg.test(val)
          ? removeBrackets(val)
          : `${stateId}.${parentKey ? `${parentKey}.` : ''}${removeBrackets(
              val,
            )}`;

      // TODO 引用state output有问题
      //   {
      //     "outputs.untitled_outputs_1.value": {
      //         "currentMode": "ref",
      //         "ref": "state_2.state_1.state1_output"
      //     }
      // }

      appBuilder.handleRefScene({
        scene: RefSceneEnum.Enum.set_nodedata_key_val,
        params: {
          stateName: stateId as Lowercase<string>,
          key: `${parent ? `${parent}.` : ''}${name}`,
          newValue,
          mode: 'ref',
        },
      });
    },
    [appBuilder.handleRefScene, stateId, name],
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
