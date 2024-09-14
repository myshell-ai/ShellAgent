import { Heading } from '@shellagent/ui';

import { useSchemaContext } from '@/stores/workflow/schema-provider';

import { Display, Collapse } from './display';

export const Render = () => {
  const { output } = useSchemaContext(state => ({
    output: state.output,
  }));

  if (!output) {
    return null;
  }

  return (
    <Collapse
      defaultExpand
      className="bg-surface-subtle p-2 rounded-xl"
      header={
        <Heading size="h4" lineClamp={1}>
          Render
        </Heading>
      }
      content={<Display output={output} />}
    />
  );
};
