import { cn } from '../../lib/utils';

function Skeleton({
  className,
  animate = true,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { animate?: boolean }) {
  return (
    <div
      className={cn(
        'rounded-md bg-surface-container-hovered dark:bg-surface-container-pressed',
        className,
        animate && 'animate-pulse ',
      )}
      {...props}
    />
  );
}

export { Skeleton };
