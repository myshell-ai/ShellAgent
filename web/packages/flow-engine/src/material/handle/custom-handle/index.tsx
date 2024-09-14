import React, { forwardRef } from 'react';
import { Handle, HandleProps } from 'reactflow';

type ICustomHandle = HandleProps & {
  children?: React.ReactNode;
  className?: string;
};

const CustomHandle = forwardRef<HTMLDivElement, ICustomHandle>(
  ({ children, className, ...handleProps }, ref) => {
    return (
      <Handle ref={ref} isConnectable className={className} {...handleProps}>
        {children}
      </Handle>
    );
  },
);

CustomHandle.displayName = 'CustomHandle';

export default React.memo(CustomHandle);
