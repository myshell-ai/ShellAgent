import CodeBracketSquareIcon from '@heroicons/react/24/outline/CodeBracketSquareIcon';
import React, { forwardRef } from 'react';

export const EventButton = forwardRef<
  HTMLDivElement,
  {
    style: React.CSSProperties;
    onClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  }
>(function EventButton({ style, onClick }, ref) {
  return (
    <div
      ref={ref}
      style={{
        ...style,
        pointerEvents: 'all',
      }}
      onClick={onClick}
      className="absolute nodrag nopan border rounded-md border-default bg-white font-medium text-xs z-99 px-1.5 py-0.5 cursor-pointer hover:bg-surface-hovered pointer-events-all">
      <CodeBracketSquareIcon className="w-3.5 h-3.5 pointer-events-none" />
    </div>
  );
});
