import { NodeIdEnum } from '@shellagent/flow-engine';
import { ISchema } from '@shellagent/form-engine';
import { isEmpty } from 'lodash-es';
import { useMemo, useEffect } from 'react';
import { useContextSelector, createContext } from 'use-context-selector';
import { useShallow } from 'zustand/react/shallow';

import { useWorkflowStore } from '@/stores/workflow/workflow-provider';
import { generateUUID } from '@/utils/common-helper';

import {
  getSchemaByWidget,
  getVariableBySchema,
} from './utils/get-widget-schema';
import { startSchema, endSchema } from './utils/schema';

type SchemaState = {
  id: string;
  schema: ISchema;
  schemaMode: string;
  output?: Record<string, any>;
  name?: string;
  inputRefTypes: Record<string, string>;
  outputRefTypes: Record<string, string>;
  inputAllTypes: Record<string, string>;
  formKey: string;
};
type SchemaAction = {
  setSchemaMode: (mode: string) => void;
};

type SchemaStore = SchemaState & SchemaAction;

export const initState: SchemaStore = {
  id: '',
  schema: {},
  schemaMode: 'basic',
  setSchemaMode: () => {},
  inputRefTypes: {},
  inputAllTypes: {},
  outputRefTypes: {},
  formKey: generateUUID(),
};

const SchemaContext = createContext<SchemaStore>(initState);

export const useSchemaContext = <T,>(
  selector: (store: SchemaStore) => T,
): T => {
  return useContextSelector(SchemaContext, selector);
};

export interface SchemaProviderProps {
  id: string;
  name?: string;
  mode?: string;
  display_name?: string;
  children: React.ReactNode | React.ReactNode[];
  output?: Record<string, any>;
}

export const SchemaProvider: React.FC<SchemaProviderProps> = ({
  name = '',
  mode,
  display_name = '',
  id,
  children,
  output,
}) => {
  const {
    fieldsModeMap,
    widgetSchema,
    getWidgetSchema,
    schemaModeMap,
    setSchemaModeMap,
    setFieldTypes,
    reloadSchemaMap,
  } = useWorkflowStore(
    useShallow(state => ({
      widgetSchema: state.widgetSchema,
      getWidgetSchema: state.getWidgetSchema,
      schemaModeMap: state.config?.schemaModeMap || {},
      setSchemaModeMap: state.setSchemaModeMap,
      fieldsModeMap: state.config?.fieldsModeMap || {},
      setFieldTypes: state?.setFieldTypes,
      reloadSchemaMap: state.reloadSchemaMap,
    })),
  );

  const currentFieldsModeMap = fieldsModeMap[id];

  const currentWidgetSchema = widgetSchema?.[name];

  const reloadSchema = reloadSchemaMap?.[name];

  const schemaMode = schemaModeMap[id] || initState.schemaMode;

  const setSchemaMode = (mode: string) => {
    setSchemaModeMap({ id, mode });
  };

  useEffect(() => {
    if (
      name &&
      !currentWidgetSchema &&
      id !== NodeIdEnum.start &&
      id !== NodeIdEnum.end
    ) {
      getWidgetSchema({ widget_name: name, id });
    }
  }, [name]);

  const memoizedData = useMemo(() => {
    const memoized = {
      schema: {} as ISchema,
      resolveRefsSchema: {},
      inputRefTypes: {} as Record<string, string>,
      outputRefTypes: {} as Record<string, string>,
      inputAllTypes: {} as Record<string, string>,
    };
    if (id === NodeIdEnum.start) {
      memoized.schema = startSchema;
    } else if (id === NodeIdEnum.end) {
      memoized.schema = endSchema;
    } else if (!isEmpty(currentWidgetSchema)) {
      const schema = getSchemaByWidget({
        name: mode === 'undefined' ? name : display_name,
        inputSchema: currentWidgetSchema?.input_schema,
        outputSchema: currentWidgetSchema?.output_schema,
        fieldsModeMap: currentFieldsModeMap,
      });
      memoized.schema = schema.formSchema;
      memoized.resolveRefsSchema = schema.resolveRefsSchema;
    }
    const { input_variable: inputVariable, output_variable: outputVariable } =
      memoized.schema.properties?.variable?.properties || {};
    memoized.inputRefTypes = getVariableBySchema(inputVariable || {});
    memoized.outputRefTypes = getVariableBySchema(outputVariable || {});
    memoized.inputAllTypes = getVariableBySchema(
      (memoized.resolveRefsSchema as ISchema) || {},
    );
    setFieldTypes?.(id, {
      inputs: memoized.inputRefTypes,
      outputs: memoized.outputRefTypes,
    });
    return memoized;
  }, [id, mode, name, display_name, currentWidgetSchema, currentFieldsModeMap]);

  const formKey = useMemo(() => {
    return `${JSON.stringify({
      ...currentFieldsModeMap,
      schemaMode,
      reloadSchema,
    })}`;
  }, [schemaMode, currentFieldsModeMap, reloadSchema]);

  const schemaValue = useMemo<SchemaStore>(
    () => ({
      id,
      schemaMode,
      setSchemaMode,
      name,
      formKey,
      output,
      ...memoizedData,
    }),
    [id, memoizedData, schemaMode, name, formKey, output],
  );

  return (
    <SchemaContext.Provider value={schemaValue}>
      {children}
    </SchemaContext.Provider>
  );
};
