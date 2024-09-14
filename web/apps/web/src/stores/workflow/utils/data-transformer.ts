import {
  IFlow,
  NodeIdEnum,
  NodeTypeEnum,
  EdgeData,
  Edge,
  Node,
  NodeData,
  NodeId,
  getNodeName,
  EdgeTypeEnum,
} from '@shellagent/flow-engine';
import { TValues } from '@shellagent/form-engine';
import { Workflow, Task } from '@shellagent/pro-config';
import { get, isArray, isEmpty, set, uniq, uniqBy } from 'lodash-es';
import { v4 as uuidv4 } from 'uuid';

import { initState as defaultSchemaState } from '@/stores/workflow/schema-provider';
import { removeNulls } from '@/utils/common-helper';
import {
  transformChoicesToValues,
  transformValuesToChoices,
} from '@/utils/data-transformer';

import { getTypesFromSchema } from './get-widget-schema';
import { WorkflowStore } from '../workflow-store';

export const genNodeData: (
  workflow: Workflow,
) => WorkflowStore['nodeData'] = workflow => {
  const nodeData: WorkflowStore['nodeData'] = {
    [NodeIdEnum.start]: {
      id: NodeIdEnum.start,
      type: NodeTypeEnum.start,
      input: transformValuesToChoices(workflow?.inputs || {}),
      context: workflow?.context || {},
    },
    [NodeIdEnum.end]: {
      id: NodeIdEnum.end,
      type: NodeTypeEnum.end,
      output: workflow?.outputs,
    },
  };
  (workflow.blocks as any)?.forEach((block: Task) => {
    if (
      block.name &&
      block.name !== NodeIdEnum.start &&
      block.name !== NodeIdEnum.end
    ) {
      // 如果有多schema，schemaMode不为空
      const schemaMode = block.inputs?.inputs_schema_mode as string;

      const input = schemaMode ? { [schemaMode]: block.inputs } : block.inputs;

      const undefinedTask =
        block.mode === 'undefined'
          ? {
              input_names: block.input_names,
              input_types: block.input_types,
              output_names: block.output_names,
              output_types: block.output_types,
              mode: 'undefined',
            }
          : {};
      nodeData[block.name] = {
        name: block.name,
        input,
        output: block.outputs,
        ...undefinedTask,
      };
    }
  });

  return nodeData;
};

export const genWorkflowData = (workflow: Workflow) => {
  const data = { ...workflow };
  Object.keys(data.context || {}).forEach(key => {
    if (typeof data.context?.[key as Lowercase<string>] === 'string') {
      set(data.context, key, {
        name: key,
        type: 'text',
        value: get(data.context, key),
      });
    }
  });
  Object.keys(data.outputs || {}).forEach(key => {
    if (typeof data.outputs?.[key as Lowercase<string>] === 'string') {
      set(data.outputs, key, {
        name: key,
        type: 'text',
        value: get(data.outputs, key),
      });
    }
  });
  return data;
};

export const genWorkflow: (
  flow: IFlow,
  nodeData: WorkflowStore['nodeData'],
  widgetSchema: Record<string, any>,
  schemaModeMap: WorkflowStore['config']['schemaModeMap'],
) => Workflow = (flow, nodeData, widgetSchema, schemaModeMap = {}) => {
  flow.edges.forEach(({ source, sourceHandle, target, targetHandle }) => {
    if (source && sourceHandle && target && targetHandle) {
      let value = `{{${source}.${sourceHandle}}}`;
      if (source === NodeIdEnum.start) {
        value = `{{${sourceHandle.replace('input.', '').replace('.value', '')}}}`;
      }
      if (target === NodeIdEnum.end) {
        set(nodeData, [target, ...targetHandle.split('.'), 'value'], value);
      } else {
        set(nodeData, [target, 'input', targetHandle], value);
      }
    }
  });

  const workflow: Workflow = {
    type: 'workflow',
    blocks: flow?.nodes
      .filter(
        node => node.id !== NodeIdEnum.start && node.id !== NodeIdEnum.end,
      )
      .map(node => {
        // 如果有多schema，schemaMode不为空
        const multiSchema =
          widgetSchema[node?.data.name || '']?.multi_input_schema || false;
        const schemaMode =
          schemaModeMap[node.id] || defaultSchemaState.schemaMode;
        const inputs = removeNulls(
          multiSchema
            ? {
                // 后端保留字
                inputs_schema_mode: schemaMode,
                ...(nodeData[node.id]?.input?.[schemaMode] || {}),
              }
            : nodeData[node.id]?.input || {},
        ) as any;
        const undefinedTask =
          nodeData[node.id].mode === 'undefined'
            ? {
                input_names: nodeData[node.id].input_names,
                input_types: nodeData[node.id].input_types,
                output_names: nodeData[node.id].output_names,
                output_types: nodeData[node.id].output_types,
                mode: 'undefined',
              }
            : {};
        return {
          type: 'task',
          mode: 'widget',
          name: node.data.id,
          widget_class_name: node.data.name,
          inputs,
          ...undefinedTask,
          transitions: {
            ALWAYS: uniqBy(
              flow.edges
                .filter(edge => edge.source === node.id)
                .map(edge => ({
                  target: edge.target,
                })),
              'target',
            ) as any,
          },
        };
      }) as any,

    inputs:
      transformChoicesToValues(nodeData[NodeIdEnum.start]?.input || {}) || {},
    outputs: nodeData[NodeIdEnum.end]?.output || {},
    context: nodeData[NodeIdEnum.start]?.context || {},
  };
  return workflow;
};

// 导入proconfig
export const genReactFlow: (
  workflow: Workflow,
  setNodeData: WorkflowStore['setNodeData'],
  setFieldsModeMap: WorkflowStore['setFieldsModeMap'],
  comfyui: any,
) => IFlow = (workflow, setNodeData, setFieldsModeMap, comfyui) => {
  const STEP_SIZE = 600;
  const nodes: IFlow['nodes'] = [];
  const edges: IFlow['edges'] = [];
  if (workflow.type === 'workflow') {
    // start节点
    let x = 0;
    const y = 0;
    nodes.push({
      id: NodeIdEnum.start,
      type: NodeTypeEnum.start,
      selectable: true,
      focusable: true,
      draggable: true,
      data: {
        id: NodeIdEnum.start,
        type: NodeTypeEnum.start,
        name: NodeTypeEnum.start,
      },
      position: { x, y },
    });
    x += STEP_SIZE;
    // 写入input&context
    setNodeData({
      id: NodeIdEnum.start,
      data: {
        id: NodeIdEnum.start,
        name: NodeTypeEnum.start,
        input: workflow.inputs || {},
        context: workflow.context || {},
      },
    });

    // widget节点
    if (workflow.blocks) {
      const widgetIndexMap = new Map<string, number>();
      if (isArray(workflow.blocks)) {
        workflow.blocks.forEach(block => {
          const id = block.name as NodeId;
          const type = NodeTypeEnum.widget;
          const widgetName = (block as any).widget_class_name;
          let widgetIndex: number;
          if (widgetIndexMap.get(widgetName)) {
            widgetIndex = widgetIndexMap.get(widgetName) || 1;
          } else {
            widgetIndex = 1;
            widgetIndexMap.set(widgetName, widgetIndex);
          }
          const idx = comfyui.nodes?.findIndex(
            (item: any) => `node_${item.id}` === block.name,
          );
          const pos = get(comfyui, ['nodes', idx, 'pos']);
          const size = get(comfyui, ['nodes', idx, 'size']);
          let xScale = size[0] ? 500 / size[0] : 1.3;
          if (xScale < 1) {
            xScale = 1.3;
          }
          nodes.push({
            id,
            type,
            selectable: true,
            focusable: true,
            draggable: true,
            data: {
              type,
              id,
              display_name: getNodeName(widgetName, widgetIndex),
              name: widgetName,
            },
            position: {
              x: pos?.[0] ? pos[0] * 1.3 + 200 : x,
              y: pos?.[1] ? pos[1] * 1.3 : y,
            },
          });
          x += STEP_SIZE;
          const input = block.inputs;
          if (block.mode === 'undefined') {
            setNodeData({
              id,
              data: {
                input,
                output: block.outputs,
                mode: block.mode,
                input_names: block.input_names,
                input_types: block.input_types,
                output_names: block.output_names,
                output_types: block.output_types,
                name: widgetName,
                id,
              },
            });
          } else {
            setNodeData({
              id,
              data: {
                input,
                output: block.outputs,
                name: widgetName,
                id,
              },
            });
          }

          if (!isEmpty(input) && block.name) {
            Object.entries(input as object).forEach(([targetHandle, value]) => {
              const match =
                typeof value === 'string' ? value.match(/\{\{(.*?)\}\}/) : null; // 正则匹配 {{}} 中的内容
              if (match) {
                const [source, sourceHandle] = match[1].split('.'); // 以小数点分割 source 和 sourceHandle
                edges.push({
                  id: uuidv4(),
                  source,
                  sourceHandle,
                  target: block.name!,
                  targetHandle,
                  type: 'custom_edge',
                  animated: false,
                });
                setFieldsModeMap({
                  id: block.name!,
                  name: targetHandle,
                  mode: 'ref',
                });
              }
            });
          }
        });
      }
    }

    // end节点
    nodes.push({
      id: NodeIdEnum.end,
      type: NodeTypeEnum.end,
      selectable: true,
      focusable: true,
      draggable: true,
      data: {
        id: NodeIdEnum.end,
        type: NodeTypeEnum.end,
        name: NodeTypeEnum.end,
      },
      position: { x, y },
    });
    //
    setNodeData({
      id: NodeIdEnum.end,
      data: {
        id: NodeIdEnum.end,
        name: NodeTypeEnum.end,
        output: workflow.outputs || {},
      },
    });
  }

  // 将起始节点没有连线的widget节点连接到start节点
  // 将target节点没有连线的widget节点连接到end节点
  const widgetNodes = nodes.filter(
    node =>
      node.id !== NodeIdEnum.start &&
      node.id !== NodeIdEnum.end &&
      node.type === NodeTypeEnum.widget,
  );

  widgetNodes.forEach(node => {
    // 找到target为node.id的edge
    if (!edges.find(edge => edge.target === node.id)) {
      edges.push({
        id: uuidv4(),
        source: NodeIdEnum.start,
        target: node.id,
        type: EdgeTypeEnum.default,
        animated: false,
        data: {},
      });
    }
    if (!edges.find(edge => edge.source === node.id)) {
      edges.push({
        id: uuidv4(),
        source: node.id,
        target: NodeIdEnum.end,
        type: EdgeTypeEnum.default,
        animated: false,
        data: {},
      });
    }
  });

  return {
    nodes,
    edges,
    viewport: {
      x: 0,
      y: 100,
      zoom: 0.4,
    },
  };
};

type IGetInputNodesProps = (data: {
  edges: Edge<EdgeData>[];
  nodes: Node<NodeData>[];
  widgetSchema: Record<string, any>;
  id: string;
}) => TVariable[];

interface TVariable {
  label: string;
  value: string;
  children?: TVariable[];
}

function getPrevPrevNodes(
  id: string,
  edges: Edge<EdgeData>[],
  targetNodes: string[],
) {
  const currentEdges = edges.filter(edge => edge.target === id);
  if (currentEdges.length) {
    currentEdges.forEach(currentEdge => {
      const prevPrevNodeId = currentEdge.source;
      if (prevPrevNodeId && prevPrevNodeId !== NodeIdEnum.start) {
        targetNodes.push(prevPrevNodeId);
        getPrevPrevNodes(prevPrevNodeId, edges, targetNodes);
      }
    });
  }
}

export const getRefNodes: IGetInputNodesProps = ({
  edges = [],
  id,
  nodes,
  widgetSchema,
}) => {
  const targetNodes: string[] = [];
  getPrevPrevNodes(id, edges, targetNodes);

  return uniq(targetNodes).map(id => {
    const { name = '', display_name: label = '' } =
      nodes.find(node => node.id === id)?.data || {};
    return {
      value: id,
      label,
      children: Object.entries(
        getTypesFromSchema(widgetSchema[name]?.output_schema),
      )?.map(([outputName, field_type]) => {
        return {
          label: outputName,
          value: `${id}.${outputName}`,
          field_type,
        };
      }),
    };
  });
};

type IGetSaveKeysProps = (data: {
  edges: Edge<EdgeData>[];
  nodes: Node<NodeData>[];
  nodeData: WorkflowStore['nodeData'];
  schemaModeMap: WorkflowStore['config']['schemaModeMap'];
  widgetSchema: Record<string, any>;
  id: string;
}) => TVariable[];

export const getSaveKeys: IGetSaveKeysProps = ({
  edges = [],
  id,
  nodes,
  nodeData,
  widgetSchema,
  schemaModeMap,
}) => {
  const targetNodes: string[] = [];
  getPrevPrevNodes(id, edges, targetNodes);
  return uniq(targetNodes).map(id => {
    let saveKeys: string[] = [];
    const { display_name: label = '', name } =
      nodes.find(node => node.id === id)?.data || {};
    const input = get(nodeData, [id, 'input'], {});

    // 如果有多schema，schemaMode不为空
    const multiSchema = widgetSchema[name || '']?.multi_input_schema || false;
    const schemaMode = schemaModeMap?.[id] || defaultSchemaState.schemaMode;
    if (multiSchema) {
      saveKeys = [
        ...saveKeys,
        ...get(input, [schemaMode, 'save_config', 'save_keys'], []),
      ];
    } else {
      saveKeys = [...saveKeys, ...get(input, ['save_config', 'save_keys'], [])];
    }
    return {
      value: id,
      label,
      children: uniq(saveKeys).map(key => {
        return {
          label: `${key}_path`,
          value: `${id}.${key}_path`,
          field_type: 'string',
        };
      }),
    };
  });
};

export const getDelPathInfo = (
  input: TValues,
  id: string,
  basePath = '',
): Record<string, string | undefined> => {
  if (typeof input !== 'object' || input === null) return {};

  const refReg = new RegExp(`{{.*(${id})(\\.)(.*)}}`, 'g');
  const rawReg = new RegExp(`{{.*(${id})(.*)}}`, 'g');

  const paths: Record<string, string | undefined> = {};

  Object.entries(input).forEach(([key, value]) => {
    const currentPath = basePath ? `${basePath}.${key}` : key;

    if (typeof value === 'string' && rawReg.test(value)) {
      paths[currentPath] = value.replaceAll(rawReg, '');
    } else if (typeof value === 'string' && refReg.test(value)) {
      paths[currentPath] = undefined;
    } else if (typeof value === 'object') {
      const nestedFirstLevelPaths = getDelPathInfo(value, id, currentPath);
      Object.assign(paths, nestedFirstLevelPaths);
    }
  });

  return paths;
};
