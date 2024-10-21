import { Workflow } from '@shellagent/pro-config';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Separator,
  Heading,
} from '@shellagent/ui';
import JSON5 from 'json5';
import { isObject } from 'lodash-es';
import { useState, useMemo } from 'react';

import { CodeEditor } from '@/components/common/code-editor';
import { defaultProConfig } from '@/components/workflow/constants';

const ImportModal: React.FC<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (workflow: Workflow) => void;
}> = ({ open, onOpenChange, onConfirm }) => {
  const [workflowStr, setWorkflowStr] = useState<string | undefined>('');

  const workflowData = useMemo<Workflow>(() => {
    try {
      if (!workflowStr) {
        return defaultProConfig;
      }
      const jsonData = JSON5.parse(workflowStr);
      if (isObject(jsonData)) {
        return jsonData as Workflow;
      }
      return defaultProConfig;
    } catch {
      return defaultProConfig;
    }
  }, [workflowStr]);

  const handleConfirm = () => {
    if (!workflowStr) {
      return;
    }
    onConfirm(workflowData);
  };

  return (
    <Dialog modal open={open} onOpenChange={onOpenChange}>
      <DialogContent onClose={() => onOpenChange(false)}>
        <DialogHeader>
          <DialogTitle>
            <Heading size="h2">Import Workflow</Heading>
          </DialogTitle>
        </DialogHeader>
        <Separator />
        <DialogDescription className="px-3 pt-1 pb-3 grid gap-y-1.5 h-[400px] overflow-y-auto">
          <CodeEditor
            value={workflowStr}
            onValueChange={value => setWorkflowStr(value)}
          />
        </DialogDescription>
        <Separator />
        <DialogFooter className="gap-x-4">
          <Button
            type="button"
            className="min-w-[92px] px-[24px]"
            variant="outline"
            onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            type="button"
            className="min-w-[92px] px-[24px]"
            disabled={!workflowStr}
            onClick={handleConfirm}>
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImportModal;
