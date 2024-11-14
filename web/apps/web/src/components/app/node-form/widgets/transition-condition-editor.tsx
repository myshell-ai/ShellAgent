import {
  PlusIcon,
  TrashIcon,
  Cog8ToothIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';
import { useReactFlowStore, NodeTypeEnum } from '@shellagent/flow-engine';
import { TFieldMode } from '@shellagent/form-engine';
import { Button, Input, Select, IconButton, Drawer } from '@shellagent/ui';
import { produce } from 'immer';
import { useRef, useState, useCallback } from 'react';
import { useInjection } from 'inversify-react';
import { observer } from 'mobx-react-lite';
import { ICondition } from '@/components/app/edges';
import NodeForm from '@/components/app/node-form';
import { ExpressionInput } from '@/components/app/node-form/widgets/expression-input';
import { useAppState } from '@/stores/app/use-app-state';
import { getSchemaByInputs } from '@/stores/app/utils/get-workflow-schema';
import { AppBuilderModel } from '@/components/app/app-builder.model';

interface ITransitionConditionEditorProps {
  value: ICondition[];
  onChange: (value: ICondition[]) => void;
}

const StateSelector = ({
  value,
  onChange,
  className,
  options,
}: {
  value: string;
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
  className?: string;
}) => (
  <div className={className}>
    <Select options={options} value={value} onValueChange={onChange} />
  </div>
);

const ConditionItem = ({
  value,
  onChange,
  onDelete,
  onOpen,
  options,
}: {
  value: ICondition;
  onChange: (value: ICondition) => void;
  onDelete: (value: ICondition) => void;
  onOpen: (open: boolean, value: ICondition) => void;
  options: { label: string; value: string }[];
}) => {
  const inputConRef = useRef(null);
  const handleChange = (field: 'condition' | 'target', newValue: string) => {
    onChange(
      produce(value, draft => {
        draft[field] = newValue;
      }),
    );
  };

  return (
    <div className="flex items-center gap-2">
      <Input value={value.source} className="hidden" />
      <div className="flex-1" ref={inputConRef}>
        <ExpressionInput
          value={value.condition}
          onChange={value =>
            handleChange('condition', value.target.value as string)
          }
          singleLine
          placeholder="Condition"
        />
      </div>
      <ArrowRightIcon className="w-4.5 h-4.5 flex-shrink-0" />
      <StateSelector
        options={options}
        value={value.target}
        onChange={v => handleChange('target', v)}
        className="w-[100px]"
      />
      <IconButton
        size="sm"
        color="gray"
        type="button"
        variant="ghost"
        icon={Cog8ToothIcon}
        onClick={() => onOpen(true, value)}
        className="flex-shrink-0 border-0 hover:bg-surface-accent-gray-subtle focus-visible:ring-0"
      />
      <IconButton
        size="sm"
        color="gray"
        type="button"
        variant="ghost"
        icon={TrashIcon}
        onClick={() => onDelete(value)}
        className="flex-shrink-0 border-0 hover:bg-surface-accent-gray-subtle focus-visible:ring-0"
      />
    </div>
  );
};

const TransitionConditionEditor = observer(
  ({ value, onChange }: ITransitionConditionEditorProps) => {
    const [index, setIndex] = useState(0);
    const [schema, setSchema] = useState({});
    const handleDelete = (condition: ICondition) => {
      onChange(value.filter(c => c !== condition));
    };

    const { source, open, setOpen } = useAppState(state => ({
      source: state.currentTransitionSource,
      open: state.targetInputsSheetOpen,
      setOpen: state.setTargetInputsSheetOpen,
    }));
    const appBuilder = useInjection(AppBuilderModel);

    const handleOpen = (open: boolean, index: number) => {
      setOpen(open);
      setIndex(index);
      const currentCondition = value[index];
      const schema = getSchemaByInputs(
        appBuilder.nodeData[currentCondition.target]?.inputs,
      );
      setSchema(schema);
    };

    const handleAdd = () => {
      onChange([
        ...value,
        {
          source,
          condition: '',
          target_inputs: {},
          target: '',
        },
      ]);
    };

    const handleChange = (index: number, condition: ICondition) => {
      onChange(
        produce(value, draft => {
          draft[index] = condition;
        }),
      );
    };

    const { nodes } = useReactFlowStore(state => ({
      nodes: state.nodes,
    }));

    const getOptions = (index: number) => {
      const includedTargets = value
        .slice(0, index)
        .map(condition => condition.target);
      return nodes
        .filter(
          node =>
            node.data.type !== NodeTypeEnum.start &&
            !includedTargets.includes(node.id),
        )
        .map(node => ({
          label: node.data.display_name || 'Untitled State',
          value: node.id,
        }));
    };

    const modeId = `${source}.condition.${index}`;

    const onModeChange = useCallback(
      (name: string, mode: TFieldMode) => {
        appBuilder.setFieldsModeMap({ id: modeId, name, mode });
      },
      [modeId, appBuilder.setFieldsModeMap],
    );

    return (
      <div className="flex gap-3 flex-col justify-center">
        {value?.map?.((condition, index) => (
          <ConditionItem
            key={condition.target}
            value={condition}
            onChange={v => handleChange(index, v)}
            onDelete={handleDelete}
            onOpen={() => handleOpen(true, index)}
            options={getOptions(index)}
          />
        ))}
        <Button
          icon={PlusIcon}
          onClick={handleAdd}
          variant="outline"
          size="sm"
          type="button"
          className="w-18 border-default rounded-full">
          Add
        </Button>
        <Drawer
          title="Target Inputs"
          open={open}
          height="95%"
          placement="bottom"
          className="rounded-lg"
          closable
          destroyOnClose
          getContainer={false}
          onClose={() => setOpen(false)}
          keyboard={false}
          autoFocus={false}>
          <NodeForm
            parent={`condition.${index}`}
            schema={schema}
            values={value?.[index]?.target_inputs}
            onModeChange={onModeChange}
            modeMap={appBuilder.config.fieldsModeMap?.[modeId] || {}}
            onChange={values =>
              onChange(
                produce(value, draft => {
                  draft[index].target_inputs = values;
                }),
              )
            }
          />
        </Drawer>
      </div>
    );
  },
);

TransitionConditionEditor.displayName = 'TransitionConditionEditor';

export { TransitionConditionEditor };
