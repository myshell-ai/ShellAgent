'use client';

import { TValues, getDefaultValueBySchema } from '@shellagent/form-engine';
import { isEmpty, merge } from 'lodash-es';
import { useEffect, useMemo, useCallback } from 'react';

import NodeForm from '@/components/app/node-form';
import { getSchemaByWidget } from '@/stores/app/utils/get-widget-schema';
import { useWorkflowStore } from '@/stores/workflow/workflow-provider';

interface WidgetConfigProps {
  values: TValues | undefined;
  parent: string;
  onChange: (values: TValues) => void;
}

export const WidgetConfig: React.FC<WidgetConfigProps> = ({
  values,
  parent,
  onChange,
}) => {
  const { loading, getWidgetSchema, widgetSchema } = useWorkflowStore(
    state => ({
      loading: state.loading.getWidgetSchema,
      getWidgetSchema: state.getWidgetSchema,
      widgetSchema: state.widgetSchema,
    }),
  );

  useEffect(() => {
    if (values?.widget_class_name && !widgetSchema[values.widget_class_name]) {
      getWidgetSchema({ widget_name: values.widget_class_name });
    }
  }, [values?.widget_class_name, getWidgetSchema, widgetSchema]);

  const schema = useMemo(
    () =>
      getSchemaByWidget({
        mode: 'basic',
        ...widgetSchema[values?.widget_class_name],
      }),
    [widgetSchema, values?.widget_class_name],
  );

  const defaultValues = useMemo(
    () => getDefaultValueBySchema(schema, false),
    [schema],
  );

  const handleOnChange = useCallback(
    (newValues: TValues) => {
      onChange(merge({}, defaultValues, newValues));
    },
    [defaultValues, onChange],
  );

  useEffect(() => {
    if (
      !loading?.[values?.widget_class_name] &&
      isEmpty(values?.inputs) &&
      !isEmpty(defaultValues) &&
      values
    ) {
      onChange({
        ...values,
        ...defaultValues,
      });
    }
  }, [
    schema,
    loading?.[values?.widget_class_name],
    defaultValues,
    onChange,
    values,
  ]);

  if (!values) {
    return null;
  }

  return (
    <NodeForm
      schema={schema}
      values={values}
      parent={parent}
      onChange={handleOnChange}
      loading={loading?.[values.widget_class_name]}
    />
  );
};
