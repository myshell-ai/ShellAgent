/* eslint-disable react/destructuring-assignment */

'use client';

import {
  getDefaultValueBySchema,
  TFieldMode,
  TValues,
} from '@shellagent/form-engine';
import { isEmpty, merge } from 'lodash-es';
import { useCallback, useEffect, useMemo } from 'react';

import NodeForm from '@/components/app/node-form';
import { getPlugin } from '@/components/app/plugins';
import { getSchemaByWidget } from '@/stores/app/utils/get-widget-schema';
import { useWorkflowStore } from '@/stores/workflow/workflow-provider';
import { useInjection } from 'inversify-react';
import { observer } from 'mobx-react-lite';
import { AppBuilderModel } from '@/components/app/app-builder.model';

export interface WidgetConfigProps {
  values: TValues | undefined;
  parent: string;
  id: string;
  onChange: (values: TValues) => void;
}

export interface CommonWidgetConfigProps extends WidgetConfigProps {
  onModeChange: (name: string, mode: TFieldMode) => void;
  modeMap: Record<string, TFieldMode>;
}

const CustomWidgetConfig: React.FC<CommonWidgetConfigProps> = props => {
  const { values } = props;
  if (!values) {
    return null;
  }

  const PluginComponent = getPlugin(values.widget_class_name);
  if (PluginComponent) {
    return <PluginComponent {...props} />;
  }

  return null;
};

const StandardWidgetConfig: React.FC<CommonWidgetConfigProps> = ({
  values,
  parent,
  onChange,
  onModeChange,
  modeMap,
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

  const schema = useMemo(() => {
    const schema = getSchemaByWidget({
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
      modeMap={modeMap}
    />
  );
};

export const WidgetConfig: React.FC<WidgetConfigProps> = observer(props => {
  const appBuilder = useInjection<AppBuilderModel>('AppBuilderModel');

  const { id, parent } = props;

  const onModeChange = useCallback(
    (name: string, mode: TFieldMode) => {
      appBuilder.setFieldsModeMap({ id: `${id}.${parent}`, name, mode });
    },
    [id, appBuilder.setFieldsModeMap, parent],
  );

  const modeMap = appBuilder.config.fieldsModeMap?.[`${id}.${parent}`] || {};
  if (props.values?.custom) {
    return (
      <CustomWidgetConfig
        {...props}
        onModeChange={onModeChange}
        modeMap={modeMap}
      />
    );
  }

  return (
    <StandardWidgetConfig
      {...props}
      onModeChange={onModeChange}
      modeMap={modeMap}
    />
  );
});
