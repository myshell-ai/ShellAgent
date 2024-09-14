import { ArrowUpTray } from '@shellagent/ui';
import { useMemo } from 'react';
import { Accept, DropEvent, FileRejection, useDropzone } from 'react-dropzone';
import { toast } from 'react-toastify';

import { FileWithId } from '@/components/common/uploader';
import { cn } from '@/utils/cn';
import { generateUUID } from '@/utils/common-helper';

export interface FileUploaderDropZoneProps {
  title?: string;
  description?: string;
  dragActiveContent?: string;
  accept?: Accept;
  minSize?: number;
  maxSize?: number;
  disabled?: boolean;
  onFileChange: (files: FileWithId[]) => Promise<void>;
}

export default function FileUploaderDropZone({
  title = 'Drop a file or click to upload',
  description,
  dragActiveContent = 'Move your file here',
  accept,
  minSize = 0,
  maxSize = Infinity,
  disabled = false,
  onFileChange,
}: FileUploaderDropZoneProps) {
  const desc = useMemo(() => {
    if (accept) {
      const types = Object.values(accept).reduce(
        (prev: string[], curr: string[]) => [
          ...prev,
          ...curr.map(item => item.substring(1).toLocaleUpperCase()),
        ],
        [],
      );

      return `Any ${types.join(', ')} up to 5MB.`;
    }
    if (description) {
      return description;
    }

    return 'Any JPG, JPEG, PNG or WEBP up to 5MB';
  }, [accept, description]);

  const onDrop: <T extends File>(
    acceptedFiles: T[],
    fileRejections: FileRejection[],
    event: DropEvent,
  ) => Promise<void> = async (acceptedFiles, fileRejections) => {
    // 如果有被拒绝的文件，按序生成报错信息
    if (fileRejections.length) {
      toast.error(fileRejections[0]?.errors?.[0]?.message);
      return;
    }

    if (acceptedFiles.length) {
      await onFileChange(
        acceptedFiles.map(file => ({
          file,
          id: generateUUID(),
        })),
      );
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    minSize,
    maxSize,
    accept,
    disabled,
  });

  return (
    <div {...getRootProps({ className: 'dropzone' })}>
      <input {...getInputProps()} />
      <div
        className={cn(
          'min-h-[82px] w-full overflow-hidden flex items-center p-4 rounded-xl border border-default bg-surface-default shadow-background-default space-x-3 hover:border-hovered active:border-pressed cursor-pointer',
          isDragActive && 'border-dashed border-pressed',
        )}>
        {isDragActive ? (
          <div className="w-full h-full flex justify-center items-center text-sm font-medium">
            {dragActiveContent}
          </div>
        ) : (
          <>
            <div className="w-12 h-12 rounded-xl bg-surface-accent-gray-subtlest flex justify-center items-center shrink-0">
              <ArrowUpTray size="2xl" color="default" />
            </div>

            <div className="flex flex-col space-y-1 grow overflow-hidden">
              <div className="text-sm font-medium text-default truncate">
                {title}
              </div>
              <div className="text-left text-sm text-subtler line-clamp-2">
                {desc}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
