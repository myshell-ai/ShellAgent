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
import { ExportBotResponse } from '@/services/app/type';
import { APIFetch } from '@/services/base';

const ImportModal: React.FC<{
  open: boolean;
  comfirmLoading?: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (data: ExportBotResponse['data']) => Promise<any>;
}> = ({ open, comfirmLoading, onOpenChange, onConfirm }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [fileUrl, setFileUrl] = useState<string | undefined>();
  const [shellAgent, setShellAgent] = useState<
    ExportBotResponse['data'] | undefined
  >();

  useEffect(() => {
    if (fileUrl) {
      setLoading(true);
      APIFetch.get<ExportBotResponse>(`/api/files/${fileUrl}`)
        .then(({ data, success }) => {
          if (!success) {
            throw new Error('');
          }
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
          setShellAgent(data);
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

  const handleConfirm = (data?: ExportBotResponse['data']) => {
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
