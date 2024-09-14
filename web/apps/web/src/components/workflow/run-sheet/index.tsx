'use client';

import { NodeIdEnum, IFlow } from '@shellagent/flow-engine';
import { TValues, getDefaultValueBySchema } from '@shellagent/form-engine';
import { Button, Drawer } from '@shellagent/ui';
import { usePrevious } from 'ahooks';
import { isEmpty, isEqual, difference, keys, omit } from 'lodash-es';
import { useEffect, useCallback } from 'react';

import NodeForm from '@/components/workflow/node-form';
import { runWorkflow } from '@/services/workflow';
import { useWorkflowState } from '@/stores/workflow/use-workflow-state';
import { genWorkflow } from '@/stores/workflow/utils/data-transformer';
import { getSchemaByInputs } from '@/stores/workflow/utils/get-run-schema';
import { useWorkflowStore } from '@/stores/workflow/workflow-provider';

const RunSheet: React.FC = () => {
  const {
    userInputs,
    setUserInputs,
    nodeData,
    loading,
    flowInstance,
    widgetSchema,
    config,
    clearRuntimeData,
    setRunLoading,
    onWorkflowMessage,
  } = useWorkflowStore(state => ({
    userInputs: state.userInputs,
    setUserInputs: state.setUserInputs,
    nodeData: state.nodeData,
    loading: state.loading,
    flowInstance: state.flowInstance,
    widgetSchema: state.widgetSchema,
    config: state.config,
    clearRuntimeData: state.clearRuntimeData,
    setRunLoading: state.setRunLoading,
    onWorkflowMessage: state.onWorkflowMessage,
  }));

  const { runSheetOpen, setRunSheetOpen } = useWorkflowState(state => state);

  const inputs = nodeData[NodeIdEnum.start]?.input as Record<string, TValues>;
  const runSchema = getSchemaByInputs(inputs);
  const prevInputs = usePrevious(inputs);

  useEffect(() => {
    if (!isEqual(prevInputs, inputs)) {
      const diffKeys = difference(keys(inputs), keys(prevInputs));
      setUserInputs(omit(userInputs, diffKeys));
    }
  }, [inputs, prevInputs]);

  useEffect(() => {
    const defaultValues = getDefaultValueBySchema(runSchema, false);
    if (
      !isEmpty(defaultValues) &&
      isEmpty(userInputs) &&
      !(loading.getProConfig || loading.getReactFlow) &&
      runSheetOpen
    ) {
      setUserInputs(defaultValues);
    }
  }, [runSheetOpen, runSchema, loading]);

  const handleWorkflowRun = useCallback(() => {
    const reactflow = flowInstance?.toObject() as IFlow;
    const workflow = genWorkflow(
      reactflow,
      nodeData,
      widgetSchema,
      config?.schemaModeMap,
    );

    clearRuntimeData();
    setRunSheetOpen(false);
    setRunLoading(true);
    runWorkflow(
      { workflow, user_input: userInputs },
      {
        onMessage: onWorkflowMessage,
      },
    );
  }, [userInputs, flowInstance, nodeData, config?.schemaModeMap, widgetSchema]);

  return (
    <Drawer
      style={{
        transform: 'translateX(-12px) translateY(12px)',
        height: 'calc(100% - 24px)',
      }}
      className="rounded-lg"
      placement="right"
      width={375}
      mask={false}
      getContainer={false}
      title="Test Run"
      onClose={() => setRunSheetOpen(false)}
      onClick={(e: any) => e.stopPropagation()}
      open={runSheetOpen}
      autoFocus={false}
      push={false}>
      <div className="flex flex-col gap-y-4">
        <NodeForm
          key={JSON.stringify(runSchema)}
          loading={loading.getProConfig || loading.getReactFlow}
          schema={runSchema}
          values={userInputs}
          onChange={setUserInputs}
        />
        <Button
          className="w-full"
          onClick={handleWorkflowRun}
          loading={loading.workflowRunning}>
          Run
        </Button>
      </div>
    </Drawer>
  );
};

export default RunSheet;
