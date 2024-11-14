import { NodeIdEnum } from '@shellagent/flow-engine';
import { ISchema, TFieldMode } from '@shellagent/form-engine';
import { isEmpty } from 'lodash-es';
import { useMemo, useEffect, useState, useCallback } from 'react';
import { useContextSelector, createContext } from 'use-context-selector';

import { JsonSchema7 } from '@/services/workflow/type';
import { useWorkflowStore } from '@/stores/workflow/workflow-provider';

import { getSchemaByWidget } from './utils/get-widget-schema';
import { startSchema, endSchema } from './utils/schema';
import { useVariableContext } from './variable-provider';

type SchemaState = {
  id: string;
  schema: ISchema;
  schemaMode: string;
  fieldMode: Record<string, TFieldMode>;
  multiSchema: boolean;
  outputs?: Record<string, any>;
  outputSchema: JsonSchema7;
};

type SchemaAction = {
  setSchemaMode: (mode: string) => void;
  setFieldMode: (field: string, mode: TFieldMode) => void;
};

type SchemaStore = SchemaState & SchemaAction;

export const initState: SchemaStore = {
  id: '',
  schema: {},
  outputs: {},
  schemaMode: 'basic',
  setSchemaMode: () => {},
  fieldMode: {},
  setFieldMode: () => {},
  multiSchema: true,
  outputSchema: {},
};

const SchemaContext = createContext<SchemaStore>(initState);

export const useSchemaContext = <T,>(
  selector: (store: SchemaStore) => T,
): T => {
  return useContextSelector(SchemaContext, selector);
};

export interface SchemaProviderProps {
  id: string;
  name: string | undefined;
  display_name: string | undefined;
  children: React.ReactNode | React.ReactNode[];
  outputs?: Record<string, any>;
}

export const SchemaProvider: React.FC<SchemaProviderProps> = ({
  name = '',
  display_name = '',
  id,
  children,
  outputs,
}) => {
  const context = useVariableContext(state => state.context);
  const [fieldMode = {}, setFieldModeStorage] = useState<
    Record<string, TFieldMode>
  >({});

  const setFieldMode = useCallback(
    (field: string, mode: TFieldMode) => {
      setFieldModeStorage(prev => ({
        ...prev,
        [field]: mode,
      }));
    },
    [setFieldModeStorage],
  );

  const { widgetSchema, getWidgetSchema, schemaModeMap, setSchemaModeMap } =
    useWorkflowStore(state => ({
      widgetSchema: state.widgetSchema,
      getWidgetSchema: state.getWidgetSchema,
      schemaModeMap: state.config?.schemaModeMap || {},
      setSchemaModeMap: state.setSchemaModeMap,
    }));

  const schemaMode = schemaModeMap[id] || initState.schemaMode;
  const multiSchema =
    widgetSchema && name ? widgetSchema[name]?.multi_input_schema : false;
  const outputSchema = widgetSchema?.[name]?.output_schema;

  const setSchemaMode = (mode: string) => {
    setSchemaModeMap({ id, mode });
  };

  useEffect(() => {
    if (
      name &&
      !widgetSchema[name] &&
      id !== NodeIdEnum.start &&
      id !== NodeIdEnum.end
    ) {
      getWidgetSchema({ widget_name: name });
    }
  }, [name]);

  const schema = useMemo(() => {
    if (id === NodeIdEnum.start) {
      return startSchema;
    }
    if (id === NodeIdEnum.end) {
      return endSchema;
    }
    if (!name || !display_name || isEmpty(widgetSchema?.[name])) {
      return {};
    }

    return getSchemaByWidget({
      name: display_name,
      mode: schemaMode,
      input_schema: widgetSchema?.[name]?.input_schema,
      output_schema: widgetSchema?.[name]?.output_schema,
      multi_input_schema: widgetSchema?.[name]?.multi_input_schema,
    });
  }, [id, name, display_name, widgetSchema, context, schemaMode]);

  const schemaValue = useMemo<SchemaStore>(
    () => ({
      id,
      schema,
      schemaMode,
      setSchemaMode,
      fieldMode,
      setFieldMode,
      multiSchema,
      outputs,
      outputSchema,
    }),
    [
      id,
      schema,
      schemaMode,
      fieldMode,
      setFieldMode,
      multiSchema,
      outputs,
      outputSchema,
    ],
  );

  return (
    <SchemaContext.Provider value={schemaValue}>
      {children}
    </SchemaContext.Provider>
  );
};
