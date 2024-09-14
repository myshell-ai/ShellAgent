'use client';

import { Heading, Text, Spinner } from '@shellagent/ui';
import { useScroll } from 'ahooks';
import { useRef } from 'react';
import useSWR from 'swr';

import { CreateDialog } from '@/components/home/create-dialog';
import { FlowCard } from '@/components/home/flow-card';
import { fetchList } from '@/services/home';
import { cn } from '@/utils/cn';

import '../reflect-metadata-client-side';

export default function WorkflowPage() {
  const contentRef = useRef(null);
  const position = useScroll(contentRef);

  const { data, isLoading, mutate } = useSWR('/api/list', () =>
    fetchList({ type: 'workflow' }),
  );

  const onRefresh = () => {
    mutate();
  };

  return (
    <div className="h-full flex flex-col">
      <div
        className={cn(
          'h-16 flex justify-between items-center px-6 border-b',
          position?.top && position?.top > 0
            ? 'border-default'
            : 'border-transparent',
        )}>
        <Heading size="h2">Workflow</Heading>
        <div className="flex items-center gap-x-2">
          <CreateDialog onSuccess={onRefresh} type="workflow" />
        </div>
      </div>
      <main className="w-full h-full overflow-auto" ref={contentRef}>
        {isLoading && (
          <div className="w-full h-full flex items-center justify-center">
            <Spinner className="text-brand" />
          </div>
        )}
        {!isLoading && data?.data.length ? (
          <div className="px-6 py-4 grid lg:grid-cols-3 large:grid-cols-4 2xl:grid-cols-5 gap-4 mb-6">
            {data?.data.map(item => (
              <FlowCard
                type="workflow"
                key={item.id}
                {...item}
                onSuccess={onRefresh}
              />
            ))}
          </div>
        ) : null}
        {!isLoading && !data?.data.length && (
          <div className="grow w-full h-full flex flex-col justify-center items-center">
            <Heading size="h2">Create your first workflow</Heading>
            <Text size="sm" color="subtle" className="mt-1.5 mb-6">
              Click button to create a workflow
            </Text>
            <CreateDialog size="lg" onSuccess={onRefresh} type="workflow" />
          </div>
        )}
      </main>
    </div>
  );
}
