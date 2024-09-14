import { ImageProviewGroup } from '@shellagent/ui';

import { SpecificDisplayProps } from '@/components/common/uploader/display';

export default function Img({
  name,
  size,
  src,
  deleteEle,
}: SpecificDisplayProps) {
  return (
    <>
      <div className="w-12 h-12 rounded-[10px] overflow-hidden shrink-0">
        <ImageProviewGroup
          images={[
            {
              src,
              width: 48,
              height: 48,
              wrapperClassName: 'w-full h-full object-cover',
            },
          ]}
        />
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
