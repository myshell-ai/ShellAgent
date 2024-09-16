import { useReactFlowStore, NodeIdEnum } from '@shellagent/flow-engine';
import { TValues } from '@shellagent/form-engine';
import { isEmpty } from 'lodash-es';
import { useMemo } from 'react';
import { useContextSelector, createContext } from 'use-context-selector';

import { IButtonType } from '@/components/app/node-form/widgets/button-editor';
import { useAppStore } from '@/stores/app/app-provider';
import { getRefNodes } from '@/stores/app/utils/data-transformer';

interface TVariable {
  label: string;
  value: string;
  field_type?: string;
  children?: TVariable[];
}

export type TScope = TVariable[];

interface VariableProps {
  input?: TScope;
  context?: TScope;
  output?: TScope;
  tasks?: TScope;
  states?: TScope;
  payloads?: TScope;
}

const VariableContext = createContext<VariableProps>({});

export const useVariableContext = <T,>(
  selector: (store: VariableProps) => T,
): T => {
  return useContextSelector(VariableContext, selector);
};

export interface VariableProviderProps {
  id: string;
  eventKey?: string;
  children: React.ReactNode | React.ReactNode[];
}

export const VariableProvider: React.FC<VariableProviderProps> = ({
  id,
  eventKey,
  children,
}) => {
  const edges = useReactFlowStore(state => state.edges);
  const nodes = useReactFlowStore(state => state.nodes);

  const nodeData = useAppStore(state => state.nodeData);
  const input = useMemo<TScope>(() => {
    const inputDataMap: Record<string, TValues> = nodeData[id]?.input || {};

    if (isEmpty(inputDataMap)) return [];
    return [
      {
        label: 'Input',
        value: '',
        children: Object.entries(inputDataMap).map(([key, data]) => ({
          label: data?.name || key,
          value: key,
          field_type: 'string',
        })),
      },
    ];
  }, [nodeData, id]);

  const output = useMemo<TScope>(() => {
    const outputDataMap: Record<string, TValues> = nodeData[id]?.output || {};
    if (isEmpty(outputDataMap)) return [];
    return [
      {
        label: 'Output',
        value: '',
        children: Object.entries(outputDataMap).map(([key, data]) => ({
          label: data?.name || key,
          value: key,
          field_type: 'string',
        })),
      },
    ];
  }, [nodeData, id]);

  const tasks = useMemo<TScope>(() => {
    const tasksData: TValues[] = nodeData[id]?.blocks || [];
    if (!tasksData.length) return [];
    return [
      {
        label: 'Task',
        value: '',
        children: tasksData.map(data => {
          return {
            label: data?.display_name || '',
            value: data?.name,
            children: Object.entries(
              (data?.outputs?.display || {}) as Record<string, string>,
            ).map(([label, value]) => ({
              label,
              value: `${data?.name}.${label}`,
              field_type: value || 'string',
            })),
          };
        }),
      },
    ];
  }, [nodeData, id]);

  const context = useMemo<TScope>(() => {
    const contextDataMap: Record<string, TValues> =
      nodeData[NodeIdEnum.start]?.context || {};

    if (isEmpty(contextDataMap)) return [];

    return [
      {
        label: 'Start-Context',
        value: '',
        children: Object.entries(contextDataMap).map(([key, data]) => ({
          label: data?.name || key,
          value: `__context__${key}__`,
          field_type: 'string',
        })),
      },
    ];
  }, [nodeData]);

  const states = useMemo(() => {
    return getRefNodes({ edges, id, nodes, nodeData });
  }, [edges, id, nodes, nodeData]);

  const payloads = useMemo<TScope>(() => {
    const buttons: IButtonType[] = nodeData[id]?.render?.buttons || [];
    const button = buttons.find(
      button => (button.on_click as any)?.event === eventKey,
    ) || { on_click: {} };
    const payload = (button?.on_click as any)?.payload || {};

    if (isEmpty(payload)) {
      return [];
    }

    return [
      {
        label: 'Payload',
        value: '',
        children: Object.entries(payload).map(
          ([value, data]: [string, any]) => ({
            label: data?.name,
            value,
            field_type: 'string',
          }),
        ),
      },
    ];
  }, [nodeData, id, eventKey]);

  const values = useMemo(
    () => ({
      input,
      output,
      context,
      states,
      tasks,
      payloads,
    }),
    [input, context, output, states, tasks, payloads],
  );

  return (
    <VariableContext.Provider value={values}>
      {children}
    </VariableContext.Provider>
  );
};

VariableProvider.displayName = 'VariableProvider';
