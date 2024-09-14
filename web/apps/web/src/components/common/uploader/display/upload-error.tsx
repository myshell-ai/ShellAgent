import ArrowPathIcon from '@heroicons/react/24/outline/esm/ArrowPathIcon';
import XMarkIcon from '@heroicons/react/24/outline/esm/XMarkIcon';
import DocumentIcon from '@heroicons/react/24/solid/esm/DocumentIcon';
import { IconButton } from '@shellagent/ui';

type UploadErrorProps = {
  name: string;
  onRetry: () => Promise<void>;
  onDelete: () => void;
};

export default function UploadError({
  name,
  onRetry,
  onDelete,
}: UploadErrorProps) {
  return (
    <>
      <div className="w-12 h-12 rounded-[10px] bg-surface-accent-red-subtler flex justify-center items-center shrink-0">
        <DocumentIcon className="w-6 h-6 text-icon-critical" />
      </div>

      <div className="flex flex-col space-y-1 grow overflow-hidden">
        <div className="text-sm font-medium text-default truncate max-w-96">
          {name}
        </div>
        <div className="text-sm text-subtler truncate">
          Upload failed, please try again
        </div>
      </div>

      <IconButton
        size="sm"
        variant="ghost"
        className="text-icon-critical shrink-0"
        icon={ArrowPathIcon}
        onClick={onRetry}
      />

      <IconButton
        className="shrink-0"
        size="sm"
        variant="ghost"
        icon={XMarkIcon}
        onClick={onDelete}
      />
    </>
  );
}
