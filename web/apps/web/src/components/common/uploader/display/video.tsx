import { SpecificDisplayProps } from '@/components/common/uploader/display';

export default function Video({
  name,
  size,
  src,
  deleteEle,
}: SpecificDisplayProps) {
  return (
    <>
      <div className="w-12 h-12 rounded-[10px] overflow-hidden shrink-0">
        <video src={src!} className="w-full h-full object-cover" />
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
