import clsx from 'clsx';
import { memo } from 'react';

import { getKeyboardKeyNameBySystem } from '@/utils/common-helper';

type ShortcutsNameProps = {
  keys: string[];
  className?: string;
};
const ShortcutsName = ({ keys, className }: ShortcutsNameProps) => {
  return (
    <div
      className={clsx(
        'flex items-center gap-0.5 h-4 text-xs text-gray-400',
        className,
      )}>
      {keys.map(key => (
        <div key={key} className="capitalize">
          {getKeyboardKeyNameBySystem(key)}
        </div>
      ))}
    </div>
  );
};

export default memo(ShortcutsName);
