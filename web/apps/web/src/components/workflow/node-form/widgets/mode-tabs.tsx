import { getDefaultValueBySchema } from '@shellagent/form-engine';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  Description,
  useFormContext,
} from '@shellagent/ui';
import clsx from 'clsx';
import { useFormEngineContext } from 'node_modules/@shellagent/form-engine/src/components/provider';
import React from 'react';

import { useSchemaContext } from '@/stores/workflow/schema-provider';
import { isDeepEmpty } from '@/utils/common-helper';

export enum SchemaModeEnum {
  Basic = 'basic',
  Advanced = 'advanced',
}

const tabs = [
  {
    label: 'Basic',
    value: SchemaModeEnum.Basic,
  },
  {
    label: 'Advanced',
    value: SchemaModeEnum.Advanced,
  },
];

interface ModeTabsProps {
  name: string;
}

const ModeTabs = ({ name }: ModeTabsProps) => {
  const { schemaMode, setSchemaMode } = useSchemaContext(state => ({
    schemaMode: state.schemaMode,
    setSchemaMode: state.setSchemaMode,
  }));
  const { fields } = useFormEngineContext();
  const { setValue, getValues } = useFormContext();
  const { parent } = fields[name];

  const onModeChange = (mode: SchemaModeEnum) => {
    setSchemaMode(mode);
    const nextKey = `${parent}.${mode}`;
    const nextValues = getValues(nextKey);
    if (isDeepEmpty(nextValues)) {
      const nextSchema = fields[nextKey].schema;
      setValue(nextKey, getDefaultValueBySchema(nextSchema, false));
    }
  };

  return (
    <Tabs
      className="p-0.5 h-6 w-44 bg-surface-container-default rounded-full border-default border"
      defaultValue={SchemaModeEnum.Basic}>
      <TabsList className="p-0 w-full h-full flex items-center justify-between">
        {tabs.map(tab => (
          <TabsTrigger
            onClick={() => onModeChange(tab.value)}
            key={tab.value}
            value={tab.value}
            style={{ width: 88 }}
            className={clsx('flex items-center border-none !w-22 h-full !m-0', {
              'border-default rounded-full shadow-surface-default bg-surface-search-field':
                tab.value === schemaMode,
            })}>
            <Description
              size="lg"
              className={clsx('!w-22 text-subtler font-medium', {
                'text-surface-primary-default': tab.value === schemaMode,
              })}>
              {tab.label}
            </Description>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};

ModeTabs.displayName = 'ModeTabs';

export { ModeTabs };
