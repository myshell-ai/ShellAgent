import DocumentIcon from '@heroicons/react/24/solid/esm/DocumentIcon';

import { SpecificDisplayProps } from '@/components/common/uploader/display';

export default function Other({ name, size, deleteEle }: SpecificDisplayProps) {
  return (
    <>
      <div className="w-12 h-12 rounded-[10px] overflow-hidden shrink-0 flex justify-center items-center bg-[#3E94FA]">
        <DocumentIcon className="w-6 h-6 text-icon-static" />
      </div>

      <div className="flex flex-col space-y-1 grow overflow-hidden">
        <div className="text-sm font-medium text-default truncate max-w-96">
          {name}
        </div>
        {size !== undefined ? (
          <div className="text-sm text-subtler truncate">({size})</div>
        ) : null}
      </div>

      {deleteEle}
    </>
  );
}
