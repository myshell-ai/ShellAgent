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

import FileUploader from '@/components/common/uploader';
import { APIFetch } from '@/services/base';
import { ShellAgent } from '@/stores/app/app-store';
import { GetShellAgentResponse } from '@/services/app/type';

const ImportModal: React.FC<{
  open: boolean;
  comfirmLoading?: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (data: ShellAgent) => Promise<any>;
}> = ({ open, comfirmLoading, onOpenChange, onConfirm }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [fileUrl, setFileUrl] = useState<string | undefined>();
  const [shellAgent, setShellAgent] = useState<ShellAgent | undefined>();

  useEffect(() => {
    if (fileUrl) {
      setLoading(true);
      APIFetch.get<GetShellAgentResponse>(`/api/files/${fileUrl}`)
        .then(({ data, success }) => {
          if (!success) {
            throw new Error('');
          }
          console.log('data: ', data);
          if (!data?.reactflow) {
            toast.error(
              'Import error, please upload the exported data of the latest ShellAgent version!',
              {
                position: 'top-center',
                autoClose: 1000,
                hideProgressBar: true,
                pauseOnHover: true,
                closeButton: false,
              },
            );
            return;
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
          toast.error('Read json error, please try again later!', {
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
    onConfirm?.(data)?.then(() => {
      onOpenChange(false);
      setShellAgent(undefined);
      setFileUrl(undefined);
    });
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
            <Heading size="h2">Import</Heading>
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
            loading={comfirmLoading}
            disabled={!shellAgent || loading || comfirmLoading}
            onClick={() => handleConfirm(shellAgent)}>
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImportModal;
