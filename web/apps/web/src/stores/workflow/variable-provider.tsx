import { useReactFlowStore, NodeIdEnum } from '@shellagent/flow-engine';
import { TValues } from '@shellagent/form-engine';
import { cloneDeep, findIndex, isEmpty, unionBy } from 'lodash-es';
import { useMemo } from 'react';
import { useContextSelector, createContext } from 'use-context-selector';

import { useWorkflowStore } from '@/stores/workflow/workflow-provider';

import { getRefNodes, getSaveKeys } from './utils/data-transformer';

interface TVariable {
  label: string;
  value: string;
  field_type?: string;
  children?: TVariable[];
}

export type TScope = TVariable[];

interface VariableProps {
  treeScope?: TScope;
  scope?: TScope;
  input?: TScope;
  context?: TScope;
  output?: TScope;
  refs?: TScope;
}

const VariableContext = createContext<VariableProps>({});

function flattenChildren(outputs: TScope, parentLabel = '') {
  return outputs.reduce((acc: TScope, output) => {
    if (output.children && output.children.length > 0) {
      acc = acc.concat(
        output.children.map(child => ({
          label: `${output.label}/${child.label}`,
          value: child.value,
        })),
      );

      // 递归处理子级的 children
      acc = acc.concat(
        flattenChildren(output.children, `${parentLabel}/${output.label}`),
      );
    }

    return acc;
  }, []);
}

export const mergeVariable = (arr1: TVariable[], arr2: TVariable[]) => {
  const merged = cloneDeep(arr1);
  arr2.forEach(item2 => {
    const index = findIndex(merged, { value: item2.value });
    if (index > -1) {
      merged[index].children = unionBy(
        merged[index].children,
        item2.children,
        'value',
      );
    } else {
      merged.push(item2);
    }
  });
  return merged;
};

export const useVariableContext = <T,>(
  selector: (store: VariableProps) => T,
): T => {
  return useContextSelector(VariableContext, selector);
};

export interface VariableProviderProps {
  id: string;
  children: React.ReactNode | React.ReactNode[];
}

export const VariableProvider: React.FC<VariableProviderProps> = ({
  id,
  children,
}) => {
  const edges = useReactFlowStore(state => state.edges);
  const nodes = useReactFlowStore(state => state.nodes);

  const nodeData = useWorkflowStore(state => state.nodeData);
  const widgetSchema = useWorkflowStore(state => state.widgetSchema);
  const schemaModeMap = useWorkflowStore(state => state.config.schemaModeMap);

  const input = useMemo<TScope>(() => {
    const inputDataMap: Record<string, TValues> =
      nodeData[NodeIdEnum.start]?.input || {};

    if (isEmpty(inputDataMap)) return [];
    return [
      {
        label: 'Start-Input',
        value: '',
        children: Object.entries(inputDataMap).map(([key, data]) => ({
          label: data?.name || key,
          value: key,
          field_type: 'string',
        })),
      },
    ];
  }, [nodeData]);

  const inputFlat = useMemo<TScope>(() => {
    const inputDataMap: Record<string, TValues> =
      nodeData[NodeIdEnum.start]?.input || {};
    return Object.entries(inputDataMap).map(([key, data]) => ({
      label: data?.name || key,
      value: key,
      field_type: 'string',
    }));
  }, [nodeData]);

  const contextFlat = useMemo<TScope>(() => {
    const contextDataMap: Record<string, TValues> =
      nodeData[NodeIdEnum.start]?.context || {};

    return Object.entries(contextDataMap).map(([key, data]) => ({
      label: `context.${data?.name || key}`,
      value: `context.${key}`,
      field_type: 'string',
    }));
  }, [nodeData]);

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
          value: `context.${key}`,
          field_type: 'string',
        })),
      },
    ];
  }, [nodeData]);

  const saveKeysRefs = getSaveKeys({
    edges,
    id,
    nodes,
    nodeData,
    schemaModeMap,
    widgetSchema,
  });

  const nodesRefs = getRefNodes({ edges, id, nodes, widgetSchema });

  const refs = mergeVariable(nodesRefs, saveKeysRefs);

  const refsFlat = flattenChildren(refs);

  const treeScope = [...inputFlat, ...contextFlat, ...refsFlat];

  const values = useMemo(
    () => ({
      treeScope,
      scope: [...input, ...context, ...refs],
      input,
      context,
      refs,
    }),
    [JSON.stringify([treeScope, input, context, refs])],
  );

  return (
    <VariableContext.Provider value={values}>
      {children}
    </VariableContext.Provider>
  );
};
