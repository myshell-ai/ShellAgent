import { memo } from 'react';
import cn from 'clsx';

const Placeholder = ({
  compact,
  value,
  className,
}: {
  compact?: boolean;
  value?: string;
  className?: string;
}) => {
  return (
    <div className="absolute top-0 left-3 h-full w-full text-sm select-none pointer-events-none flex items-center text-gray-400">
      {value}
    </div>
  );
};

export default memo(Placeholder);
