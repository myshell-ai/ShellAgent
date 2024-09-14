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
import { useRequest } from 'ahooks';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

import FileUploader from '@/components/common/uploader';
import { APIFetch } from '@/services/base';
import { importFormComfyUI } from '@/services/workflow';
import { useWorkflowStore } from '@/stores/workflow/workflow-provider';

const ImportModal: React.FC<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
}> = ({ open, onOpenChange }) => {
  const [fileUrl, setFileUrl] = useState<string | undefined>();
  const [workflow, setWorkflow] = useState<Workflow | undefined>();
  const { importWorkflow } = useWorkflowStore(state => ({
    importWorkflow: state.importWorkflow,
  }));

  useEffect(() => {
    if (fileUrl) {
      APIFetch.get(`/api/files/${fileUrl}`)
        .then(result => {
          setWorkflow(result as Workflow);
        })
        .catch(() => {
          setWorkflow(undefined);
          setFileUrl(undefined);
          toast.error(`Read JSON Error, Please try again later!`, {
            position: 'top-center',
            autoClose: 1000,
            hideProgressBar: true,
            pauseOnHover: true,
            closeButton: false,
          });
        });
    }
  }, [fileUrl]);

  const { run: runImportWorkflow, loading } = useRequest(importFormComfyUI, {
    manual: true,
    onSuccess: (result, request) => {
      if (result.data) {
        try {
          importWorkflow({
            workflow: result.data,
            comfyui: request?.[0]?.data,
          });
          toast.success(`Import Success!`, {
            position: 'top-center',
            autoClose: 1000,
            hideProgressBar: true,
            pauseOnHover: true,
            closeButton: false,
          });
          onOpenChange(false);
        } catch (error: any) {
          toast.error(`Import Error! ${error?.message || ''}`, {
            position: 'top-center',
            autoClose: 1000,
            hideProgressBar: true,
            pauseOnHover: true,
            closeButton: false,
          });
        }
      } else {
        toast.error(`Import Error：${result.error_message || ''}`, {
          position: 'top-center',
          autoClose: 1000,
          hideProgressBar: true,
          pauseOnHover: true,
          closeButton: false,
        });
      }
    },
    onError: error => {
      toast.error(error.message);
    },
  });

  const handleConfirm = () => {
    if (!workflow) {
      return;
    }
    runImportWorkflow({
      data: workflow,
    });
  };

  const onChange = (resourceUrl?: string | string[]) => {
    if (!resourceUrl) {
      setWorkflow(undefined);
      setFileUrl(undefined);
    } else {
      setFileUrl(Array.isArray(resourceUrl) ? resourceUrl[0] : resourceUrl);
    }
  };

  return (
    <Dialog modal open={open} onOpenChange={onOpenChange}>
      <DialogContent onClose={() => onOpenChange(false)} autoFocus={false}>
        <DialogHeader>
          <DialogTitle>
            <Heading size="h2">Import from ComfyUI</Heading>
          </DialogTitle>
        </DialogHeader>
        <Separator />
        <DialogDescription className="px-3 pt-1 pb-3 grid gap-y-1.5 h-28 overflow-y-auto">
          <FileUploader
            onChange={onChange}
            value={fileUrl || ''}
            defaultValue={fileUrl || ''}
            accept={{
              'application/json': ['.json'],
            }}
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
            loading={loading}
            className="min-w-[92px] px-[24px]"
            disabled={!workflow}
            onClick={handleConfirm}>
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImportModal;
