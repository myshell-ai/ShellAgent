'use client';

import { NodeIdEnum } from '@shellagent/flow-engine';
import {
  getDefaultValueBySchema,
  TFieldMode,
  TValues,
} from '@shellagent/form-engine';
import { merge } from 'lodash-es';
import { useCallback, useEffect, useMemo } from 'react';
import { useInjection } from 'inversify-react';
import { observer } from 'mobx-react-lite';

import NodeForm from '@/components/app/node-form';
import { getWorkflowSchema } from '@/stores/app/utils/get-workflow-schema';
import { useWorkflowStore } from '@/stores/workflow/workflow-provider';
import { AppBuilderModel } from '@/components/app/app-builder.model';

interface WorkflowConfigProps {
  values: TValues | undefined;
  parent: string;
  id: string;
  onChange: (values: TValues) => void;
}

export const WorkflowConfig: React.FC<WorkflowConfigProps> = observer(
  ({ values, parent, id, onChange }) => {
    const appBuilder = useInjection(AppBuilderModel);
    const { getProConfig, loading } = useWorkflowStore(state => ({
      getProConfig: state.getProConfig,
      loading: state.loading,
    }));

    const options = appBuilder.flowList.map(flow => ({
      label: flow.metadata?.name,
      value: `${flow.id}/latest`,
    }));

    // 获取workflow详情
    const inputs = useMemo(
      () =>
        appBuilder.nodeData[NodeIdEnum.start]?.inputs as Record<
          string,
          TValues
        >,
      [appBuilder.nodeData],
    );
    const outputs = useMemo(
      () =>
        appBuilder.nodeData[NodeIdEnum.end]?.outputs as Record<string, TValues>,
      [appBuilder.nodeData],
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
        appBuilder.setFieldsModeMap({ id: `${id}.${parent}`, name, mode });
      },
      [id, appBuilder.setFieldsModeMap, parent],
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
        modeMap={appBuilder.config.fieldsModeMap?.[`${id}.${parent}`] || {}}
      />
    );
  },
);
