'use client';

import { NodeIdEnum } from '@shellagent/flow-engine';
import {
  getDefaultValueBySchema,
  TFieldMode,
  TValues,
} from '@shellagent/form-engine';
import { merge } from 'lodash-es';
import { useCallback, useEffect, useMemo } from 'react';

import NodeForm from '@/components/app/node-form';
import { useAppStore } from '@/stores/app/app-provider';
import { getWorkflowSchema } from '@/stores/app/utils/get-workflow-schema';
import { useWorkflowStore } from '@/stores/workflow/workflow-provider';

interface WorkflowConfigProps {
  values: TValues | undefined;
  parent: string;
  id: string;
  onChange: (values: TValues) => void;
}

export const WorkflowConfig: React.FC<WorkflowConfigProps> = ({
  values,
  parent,
  id,
  onChange,
}) => {
  const {
    nodeData: workflowNodeData,
    getProConfig,
    loading,
  } = useWorkflowStore(state => ({
    nodeData: state.nodeData,
    getProConfig: state.getProConfig,
    loading: state.loading,
  }));

  const { setFieldsModeMap, fieldsModeMap } = useAppStore(state => ({
    setFieldsModeMap: state.setFieldsModeMap,
    fieldsModeMap: state.config?.fieldsModeMap,
  }));

  const options = useAppStore(state => state.flowList).map(flow => ({
    label: flow.metadata?.name,
    value: `${flow.id}/latest`,
  }));

  // 获取workflow详情
  const inputs = useMemo(
    () => workflowNodeData[NodeIdEnum.start]?.input as Record<string, TValues>,
    [workflowNodeData],
  );
  const outputs = useMemo(
    () => workflowNodeData[NodeIdEnum.end]?.output as Record<string, TValues>,
    [workflowNodeData],
  );

  const schema = useMemo(
    () =>
      getWorkflowSchema({
        options,
        inputs,
        outputs,
      }),
    [options, inputs, outputs],
  );

  const defaultValues = useMemo(
    () => getDefaultValueBySchema(schema, false),
    [schema],
  );

  useEffect(() => {
    onChange(merge({}, defaultValues, values));
  }, [schema]);

  useEffect(() => {
    if (values?.workflow_id) {
      const flow_id = (values?.workflow_id as string)?.split('/')?.[0];
      getProConfig({
        flow_id,
      });
    }
  }, [values?.workflow_id, getProConfig]);

  const handleOnChange = useCallback(
    (newValues: TValues) => {
      onChange(merge({}, defaultValues, newValues));
    },
    [defaultValues, onChange],
  );

  const onModeChange = useCallback(
    (name: string, mode: TFieldMode) => {
      setFieldsModeMap({ id: `${id}.${parent}`, name, mode });
    },
    [id, setFieldsModeMap, parent],
  );

  if (!values) {
    return null;
  }

  return (
    <NodeForm
      key={JSON.stringify(schema)}
      parent={parent}
      schema={schema}
      values={values}
      onChange={handleOnChange}
      loading={loading.getProConfig}
      onModeChange={onModeChange}
      modeMap={fieldsModeMap?.[`${id}.${parent}`] || {}}
    />
  );
};
