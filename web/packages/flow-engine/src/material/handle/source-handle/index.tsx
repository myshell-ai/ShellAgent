import PlusCircleIcon from '@heroicons/react/24/solid/esm/PlusCircleIcon';
import clsx from 'clsx';
import React from 'react';
import { Handle, Position } from 'reactflow';

import { IHandle } from '../../../types';

const SourceHandle: React.FC<IHandle> = ({ id, isConnectable, ...props }) => {
  return (
    <Handle
      {...props}
      isConnectable={isConnectable ?? true}
      type="source"
      id={id}
      position={Position.Right}
      className={clsx(
        `!w-5 !h-5 z-[1] absolute !bg-transparent !rounded-none !outline-none !border-none !-right-[10px]`,
      )}>
      <PlusCircleIcon className={clsx('text-icon-brand pointer-events-none')} />
    </Handle>
  );
};

SourceHandle.displayName = 'SourceHandle';

export default React.memo(SourceHandle);
