'use client';

import { NodeIdEnum } from '@shellagent/flow-engine';
import { TValues, getDefaultValueBySchema } from '@shellagent/form-engine';
import {
  Sheet,
  SheetTitle,
  SheetContent,
  SheetHeader,
  SheetFooter,
  Button,
} from '@shellagent/ui';
import { usePrevious } from 'ahooks';
import { isEmpty, isEqual, difference, keys, omit } from 'lodash-es';
import { useEffect } from 'react';

import NodeForm from '@/components/workflow/node-form';
import { getSchemaByInputs } from '@/stores/workflow/utils/get-run-schema';
import { useWorkflowStore } from '@/stores/workflow/workflow-provider';

const RunSheet: React.FC<{
  onRun: () => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  container: HTMLElement | null;
}> = ({ open, onOpenChange, onRun, container }) => {
  const { userInputs, setUserInputs, nodeData, loading } = useWorkflowStore(
    state => ({
      userInputs: state.userInputs,
      setUserInputs: state.setUserInputs,
      nodeData: state.nodeData,
      loading: state.loading,
    }),
  );
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
      open
    ) {
      setUserInputs(defaultValues);
    }
  }, [open, runSchema, loading]);

  return (
    <Sheet modal={false} open={open}>
      <SheetContent
        onClose={() => onOpenChange(false)}
        container={container}
        className="!w-[400px] !max-w-[400px] p-3 flex flex-col gap-y-2">
        <SheetHeader className="flex justify-start">
          <SheetTitle className="text-lg text-left">Test Run</SheetTitle>
        </SheetHeader>
        <NodeForm
          key={JSON.stringify(runSchema)}
          loading={loading.getProConfig || loading.getReactFlow}
          schema={runSchema}
          values={userInputs}
          onChange={setUserInputs}
        />
        <SheetFooter>
          <Button
            className="w-full"
            onClick={onRun}
            loading={loading.workflowRunning}>
            Run
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default RunSheet;
