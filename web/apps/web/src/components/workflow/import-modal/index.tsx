import { ChevronDownIcon } from '@heroicons/react/16/solid';
import {
  ExclamationTriangleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
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
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogPortal,
  Text,
} from '@shellagent/ui';
import { useBoolean, useRequest } from 'ahooks';
import { isEmpty } from 'lodash-es';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

import FileUploader from '@/components/common/uploader';
import { APIFetch } from '@/services/base';
import { importFormComfyUI } from '@/services/workflow';
import { useWorkflowStore } from '@/stores/workflow/workflow-provider';
import { cn } from '@/utils/cn';

const ImportModal: React.FC<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
}> = ({ open, onOpenChange }) => {
  const [openTips, setOpenTips] = useBoolean(false);
  const [isExpand, isExpandAction] = useBoolean(false);
  const [fileUrl, setFileUrl] = useState<string | undefined>();
  const [workflow, setWorkflow] = useState<Workflow | undefined>();
  const { existedInfo, importWorkflow, setExistedInfo } = useWorkflowStore(
    state => ({
      existedInfo: state.existedInfo,
      setExistedInfo: state.setExistedInfo,
      importWorkflow: state.importWorkflow,
    }),
  );

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
          setExistedInfo({
            undefined_widgets: result.undefined_widgets,
            non_existed_models: result.non_existed_models,
          });
          if (
            !isEmpty(result.undefined_widgets) ||
            !isEmpty(result.non_existed_models)
          ) {
            setTimeout(() => {
              setOpenTips.setTrue();
            }, 1000);
          }
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

  const onCloseTips = () => {
    setOpenTips.setFalse();
  };

  return (
    <>
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
      <AlertDialog open={openTips}>
        <AlertDialogPortal>
          <AlertDialogContent style={{ width: '380px' }}>
            <AlertDialogHeader>
              <AlertDialogTitle>
                <div className="flex justify-between items-center">
                  <span className="rounded-full p-2 bg-surface-accent-yellow-subtler">
                    <ExclamationTriangleIcon className="w-6 h-6 text-warning" />
                  </span>
                  <div className="w-9 h-9 flex cursor-pointer justify-center items-center focus-visible:outline-0 rounded-full hover:bg-surface-hovered">
                    <XMarkIcon
                      className="w-6 h-6 text-icon-subtle"
                      onClick={onCloseTips}
                    />
                  </div>
                </div>
              </AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogDescription className="flex flex-col gap-1.5">
              <Heading size="h2">Warning</Heading>
              <Text size="sm" color="subtle">
                The following items are missing.
                <br />
                Replace it with installed models/widgets, or contact us to add
                it to the standard environment.
              </Text>
              <div
                className="flex items-center cursor-pointer"
                onClick={() => isExpandAction.toggle()}>
                <Text size="sm" color="subtler">
                  {isExpand ? 'Show Less' : 'View Detail'}
                </Text>
                <ChevronDownIcon
                  className={cn('w-4 h-4 ml-1.5 text-subtler', {
                    'rotate-180': isExpand,
                  })}
                />
              </div>
              <div
                className={cn(
                  'flex-1 rounded-lg border border-default p-3 w-[340px] max-h-60 overflow-x-hidden',
                  {
                    hidden: !isExpand,
                  },
                )}>
                {!isEmpty(existedInfo.non_existed_models) ? (
                  <div>
                    <Text size="sm" color="subtler">
                      Models
                    </Text>
                    <div className="flex flex-col mt-1 gap-2">
                      {existedInfo.non_existed_models?.map(v => (
                        <Text size="lg" className="block break-words">
                          {v as string}
                        </Text>
                      ))}
                    </div>
                  </div>
                ) : null}
                {!isEmpty(existedInfo.undefined_widgets) ? (
                  <div>
                    {!isEmpty(existedInfo.non_existed_models) ? (
                      <Separator className="my-3" />
                    ) : null}
                    <Text size="sm" color="subtler">
                      Widgets
                    </Text>
                    <div className="mt-1 gap-2">
                      {existedInfo.undefined_widgets?.map(v => (
                        <Text size="lg" className="block break-words">
                          {v as string}
                        </Text>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            </AlertDialogDescription>
            <AlertDialogFooter>
              <Button
                loading={loading}
                className="flex-1"
                color="warning"
                onClick={onCloseTips}>
                Confirm
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogPortal>
      </AlertDialog>
    </>
  );
};

export default ImportModal;
