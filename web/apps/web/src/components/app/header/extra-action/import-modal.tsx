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
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useShallow } from 'zustand/react/shallow';

import FileUploader from '@/components/common/uploader';
import { APIFetch } from '@/services/base';
import { useAppStore } from '@/stores/app/app-provider';
import { ShellAgent } from '@/stores/app/app-store';
import { GetShellAgentResponse } from '@/services/app/type';

const ImportModal: React.FC<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
}> = ({ open, onOpenChange }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [fileUrl, setFileUrl] = useState<string | undefined>();
  const [shellAgent, setShellAgent] = useState<ShellAgent | undefined>();
  const { initAppBuilder } = useAppStore(
    useShallow(state => ({
      initAppBuilder: state.initAppBuilder,
    })),
  );

  useEffect(() => {
    if (fileUrl) {
      setLoading(true);
      APIFetch.get<GetShellAgentResponse>(`/api/files/${fileUrl}`)
        .then(({ data, success }) => {
          if (!success) {
            throw new Error('');
          }
          setShellAgent({
            reactflow: data?.reactflow?.reactflow,
            config: data?.reactflow?.config,
            metadata: data?.metadata,
            automata: data?.automata,
          });
        })
        .catch(() => {
          setShellAgent(undefined);
          setFileUrl(undefined);
          toast.error('read json error, please try again later!', {
            position: 'top-center',
            autoClose: 1000,
            hideProgressBar: true,
            pauseOnHover: true,
            closeButton: false,
          });
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [fileUrl]);

  const handleConfirm = (data?: ShellAgent) => {
    if (!data) {
      return;
    }
    try {
      initAppBuilder(data);
      onOpenChange(false);
      setShellAgent(undefined);
      setFileUrl(undefined);
      toast.success(`import success!`, {
        position: 'top-center',
        autoClose: 1000,
        hideProgressBar: true,
        pauseOnHover: true,
        closeButton: false,
      });
    } catch (error: any) {
      toast.error(`import error: ${error?.message}`, {
        position: 'top-center',
        autoClose: 1000,
        hideProgressBar: true,
        pauseOnHover: true,
        closeButton: false,
      });
    }
  };

  const onChange = (resourceUrl?: string | string[]) => {
    if (!resourceUrl) {
      setShellAgent(undefined);
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
            <Heading size="h2">Import from ShellAgent</Heading>
          </DialogTitle>
        </DialogHeader>
        <Separator />
        <DialogDescription className="px-3 grid gap-y-1.5 overflow-y-auto">
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
            className="min-w-[92px] px-[24px]"
            disabled={!shellAgent || loading}
            onClick={() => handleConfirm(shellAgent)}>
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImportModal;
