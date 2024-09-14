import { PropsWithChildren } from 'react';

import { WorkflowStoreProvider } from '@/stores/workflow/workflow-provider';

export default function WorkflowLayout({
  children,
}: PropsWithChildren): JSX.Element {
  return <WorkflowStoreProvider>{children}</WorkflowStoreProvider>;
}
