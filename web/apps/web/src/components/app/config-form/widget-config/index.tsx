'use client';

import {
  getDefaultValueBySchema,
  TFieldMode,
  TValues,
} from '@shellagent/form-engine';
import { isEmpty, merge } from 'lodash-es';
import { useCallback, useEffect, useMemo } from 'react';

import NodeForm from '@/components/app/node-form';
import { useAppStore } from '@/stores/app/app-provider';
import { getSchemaByWidget } from '@/stores/app/utils/get-widget-schema';
import { useWorkflowStore } from '@/stores/workflow/workflow-provider';

interface WidgetConfigProps {
  values: TValues | undefined;
  parent: string;
  id: string;
  onChange: (values: TValues) => void;
}

export const WidgetConfig: React.FC<WidgetConfigProps> = ({
  values,
  parent,
  id,
  onChange,
}) => {
  const { setFieldsModeMap, fieldsModeMap } = useAppStore(state => ({
    setFieldsModeMap: state.setFieldsModeMap,
    fieldsModeMap: state.config?.fieldsModeMap,
  }));
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

  const schema = useMemo(() => {
    const schema = getSchemaByWidget({
      mode: 'basic',
      ...widgetSchema[values?.widget_class_name],
    });
    // Special process ImageCanvasWidget
    if (values?.widget_class_name === 'ImageCanvasWidget') {
      if (schema?.properties?.inputs?.properties?.config) {
        schema.properties.inputs.properties.config['x-component'] =
          'OpenImageCanvas';
        schema.properties.inputs.properties.config['x-component-props'] = {};
      }
    }
    return schema;
  }, [widgetSchema, values?.widget_class_name]);

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

  const onModeChange = useCallback(
    (name: string, mode: TFieldMode) => {
      setFieldsModeMap({ id: `${id}.${parent}`, name, mode });
    },
    [id, setFieldsModeMap, parent],
  );

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
      onModeChange={onModeChange}
      modeMap={fieldsModeMap?.[`${id}.${parent}`] || {}}
    />
  );
};
