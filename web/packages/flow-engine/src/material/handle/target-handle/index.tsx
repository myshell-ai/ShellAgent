import PlusCircleIcon from '@heroicons/react/24/solid/esm/PlusCircleIcon';
import clsx from 'clsx';
import React from 'react';
import { Handle, Position } from 'reactflow';

import { IHandle } from '../../../types';

const TargetHandle: React.FC<IHandle> = ({ id }) => {
  return (
    <Handle
      isConnectable
      type="target"
      id={id}
      position={Position.Left}
      className={clsx(
        `!w-5 !h-5 z-[1] absolute !bg-transparent !rounded-none !outline-none !border-none !-left-[10px]`,
      )}>
      <PlusCircleIcon className="text-icon-brand pointer-events-none" />
    </Handle>
  );
};

TargetHandle.displayName = 'TargetHandle';

export default React.memo(TargetHandle);
