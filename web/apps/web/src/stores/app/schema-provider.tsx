import { NodeType, NodeTypeEnum } from '@shellagent/flow-engine';
import { ISchema, TFieldMode } from '@shellagent/form-engine';
import { isEmpty } from 'lodash-es';
import { useMemo, useEffect, useState } from 'react';
import { useContextSelector, createContext } from 'use-context-selector';

import { JsonSchema7 } from '@/services/workflow/type';
import { getStateSchema } from '@/stores/app/utils/get-state-schema';
import { getSchemaByWidget } from '@/stores/app/utils/get-widget-schema';
import { useWorkflowStore } from '@/stores/workflow/workflow-provider';
import { generateUUID } from '@/utils/common-helper';

import { startSchema } from './utils/schema';

type SchemaState = {
  id: string;
  name: string;
  schema: ISchema;
  displayName: string;
  fieldMode: Record<string, TFieldMode>;
  outputs?: Record<string, any>;
  outputSchema: JsonSchema7;
  formKey: string;
  type?: NodeType;
};

type SchemaAction = {
  setFieldMode: (field: string, mode: TFieldMode) => void;
};

type SchemaStore = SchemaState & SchemaAction;

export const initState: SchemaStore = {
  id: '',
  name: '',
  displayName: '',
  schema: {},
  fieldMode: {},
  setFieldMode: () => {},
  outputSchema: {},
  formKey: generateUUID(),
  type: NodeTypeEnum.state,
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
  type?: NodeType;
}

export const SchemaProvider: React.FC<SchemaProviderProps> = ({
  name = '',
  display_name = '',
  id,
  children,
  outputs,
  type,
}) => {
  // const context = useVariableContext(state => state.context);
  const [fieldMode = {}, setFieldModeStorage] = useState<
    Record<string, TFieldMode>
  >({});

  const setFieldMode = (field: string, mode: TFieldMode) => {
    setFieldModeStorage(prev => ({
      ...prev,
      [field]: mode,
    }));
  };

  const { widgetSchema, getWidgetSchema } = useWorkflowStore(state => ({
    widgetSchema: state.widgetSchema,
    getWidgetSchema: state.getWidgetSchema,
  }));

  useEffect(() => {
    if (name && !widgetSchema[name] && type === NodeTypeEnum.widget) {
      getWidgetSchema({ widget_name: name });
    }
  }, [name]);

  const formKey = useMemo(() => {
    return `${JSON.stringify({
      display_name,
    })}`;
  }, [display_name]);

  const schema = useMemo(() => {
    if (type === NodeTypeEnum.start) {
      return startSchema;
    }

    if (type === NodeTypeEnum.state) {
      return getStateSchema(display_name);
    }

    if (!name || !display_name || isEmpty(widgetSchema?.[name])) {
      return {};
    }

    return getSchemaByWidget({
      input_schema: widgetSchema?.[name]?.input_schema,
      output_schema: widgetSchema?.[name]?.output_schema,
    });
  }, [id, name, display_name, widgetSchema, type]);

  const outputSchema = useMemo(
    () => widgetSchema?.[name]?.output_schema,
    [widgetSchema, name],
  );

  const schemaValue = useMemo<SchemaStore>(
    () => ({
      id,
      name,
      displayName: display_name,
      schema,
      fieldMode,
      setFieldMode,
      outputs,
      outputSchema,
      formKey,
      type,
    }),
    [
      id,
      name,
      display_name,
      schema,
      fieldMode,
      setFieldMode,
      outputs,
      outputSchema,
      formKey,
      type,
    ],
  );

  return (
    <SchemaContext.Provider value={schemaValue}>
      {children}
    </SchemaContext.Provider>
  );
};

SchemaProvider.displayName = 'SchemaProvider';
