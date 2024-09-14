import { Spinner } from '@shellagent/ui';

export default function Uploading() {
  return (
    <>
      <div className="w-12 h-12 rounded-[10px] bg-surface-accent-gray-subtlest flex justify-center items-center shrink-0">
        <Spinner size="lg" className="text-brand" />
      </div>

      <div className="flex flex-col space-y-1 grow overflow-hidden">
        <div className="text-sm font-medium text-default truncate max-w-96">
          Uploading...
        </div>
        <div className="text-sm text-subtler truncate">Remaining ~1min</div>
      </div>
    </>
  );
}
