import { Skeleton } from '@shellagent/ui';

export default function FormSkeleton() {
  return (
    <div className="w-full flex flex-col gap-y-5">
      <Skeleton className="w-32 h-6" />
      <Skeleton className="w-full h-8" />
      <Skeleton className="w-full h-8" />
      <Skeleton className="w-full h-8" />
    </div>
  );
}
