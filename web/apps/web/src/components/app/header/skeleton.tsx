import { Skeleton } from '@shellagent/ui';
import React from 'react';

export default function VersionSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      <Skeleton className="w-full h-7" />
      <Skeleton className="w-full h-7" />
      <Skeleton className="w-full h-7" />
      <Skeleton className="w-full h-7" />
    </div>
  );
}
