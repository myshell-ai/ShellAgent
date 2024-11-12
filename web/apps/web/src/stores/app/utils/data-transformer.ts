import {
  IFlow,
  NodeIdEnum,
  NodeTypeEnum,
  Edge,
  EdgeData,
  Node,
  NodeData,
} from '@shellagent/flow-engine';
import { TValues } from '@shellagent/form-engine';
import { Automata, State } from '@shellagent/pro-config';
import { uniq } from 'lodash-es';

import {
  EdgeDataTypeEnum,
  ICustomEdge,
  CustomEdgeData,
} from '@/components/app/edges';
import {
  transformChoicesToValues,
  transformValuesToChoices,
} from '@/utils/data-transformer';

import { AppStore } from '../app-store';

export const contextTempReg = /__context__([a-z0-9_]+)__/g;
export const contextReg = /context\.([a-z0-9_]+)/g;

function replaceContext2Form(data: any) {
  const jsonString = JSON.stringify(data);
  const replacedString = jsonString.replace(contextReg, '__context__$1__');
  const replacedData = JSON.parse(replacedString);

  return replacedData;
}

function replaceContext2Api(data: any) {
  const jsonString = JSON.stringify(data);
  const replacedString = jsonString.replace(contextTempReg, 'context.$1');
  const replacedData = JSON.parse(replacedString);

  return replacedData;
}

// 根据automata生成nodeData
export const genNodeData = (automata: Automata): AppStore['nodeData'] => {
  const nodeData: AppStore['nodeData'] = {
    [NodeIdEnum.start]: {
      id: NodeIdEnum.start,
      type: NodeTypeEnum.start,
      context: automata.context || {},
    },
  };

  if (automata.blocks) {
    Object.entries(automata.blocks).forEach(([key, block]) => {
      if (block.type === 'state') {
        const state = block as State;
        nodeData[key as Lowercase<string>] = {
          id: key,
          type: NodeTypeEnum.state,
          name: state.name,
          render: state.render,
          inputs: transformValuesToChoices(state.inputs),
          outputs: state.outputs,
          blocks: Array.isArray(state.blocks)
            ? state.blocks?.map((item: any) => ({
                ...item,
                mode: item.mode === 'comfy_workflow' ? 'widget' : item.mode,
              }))
            : state.blocks,
        };
      }
    });
  }
  return replaceContext2Form(nodeData);
};

// 根据生成automata
export const genAutomata: (
  flow: IFlow,
  nodeData: AppStore['nodeData'],
) => Automata = (flow, nodeData) => {
  const initial =
    (flow.edges.find(edge => edge.source === NodeIdEnum.start)
      ?.target as Lowercase<string>) || '';
  const blocks: Automata['blocks'] = {};

  flow.nodes
    .filter(node => node.type === NodeTypeEnum.state)
    .forEach(node => {
      const transitions: Record<string, any> = {};
      const targetEdges = (flow.edges as ICustomEdge[]).filter(
        edge => edge.source === node.id,
      );
      targetEdges.forEach(edge => {
        const data = edge.data as CustomEdgeData;
        const transitionKey =
          data.type && data.type !== EdgeDataTypeEnum.STATE
            ? data.type
            : (data.event_key as string);

        if (!transitions[transitionKey]) {
          transitions[transitionKey] = [];
        }

        const transitionItems = data?.conditions?.length
          ? data.conditions.map(item => ({
              target: edge.target,
              // 空字符串不传
              condition: item?.condition || undefined,
              target_inputs: item?.target_inputs,
            }))
          : [{ target: edge.target }];

        transitions[transitionKey].push(...transitionItems);
      });

      blocks[node.id as Lowercase<string>] = {
        type: nodeData[node.id]?.type || 'state',
        name: nodeData[node.id]?.name,
        render: nodeData[node.id]?.render,
        blocks: nodeData[node.id]?.blocks,
        inputs: transformChoicesToValues(nodeData[node.id]?.inputs || {}),
        outputs: nodeData[node.id]?.outputs,
        transitions,
      } as State;
    });

  return replaceContext2Api({
    type: 'automata',
    properties: {
      cache: false,
    },
    context: nodeData[NodeIdEnum.start]?.context || {},
    initial,
    blocks,
    transitions: {},
  });
};

export const getDelPathInfo = (
  inputs: TValues,
  id: string,
  basePath = '',
): Record<string, string | undefined> => {
  if (typeof inputs !== 'object' || inputs === null) return {};

  const refReg = new RegExp(`{{.*(${id})(\\.)(.*)}}`, 'g');
  const rawReg = new RegExp(`{{.*(${id})(.*)}}`, 'g');

  const paths: Record<string, string | undefined> = {};

  Object.entries(inputs).forEach(([key, value]) => {
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

interface TVariable {
  label: string;
  value: string;
  children?: TVariable[];
}

type IGetInputNodesProps = (data: {
  edges: Edge<EdgeData>[];
  nodes: Node<NodeData>[];
  id: string;
  nodeData: AppStore['nodeData'];
}) => TVariable[];

function getPrevPrevNodes(
  id: string,
  edges: Edge<EdgeData>[],
  targetNodes: string[],
  visited: Set<string> = new Set(),
) {
  // 如果当前节点已经访问过，直接返回
  if (visited.has(id)) {
    return;
  }

  // 将当前节点标记为已访问
  visited.add(id);

  const currentEdges = edges.filter(edge => edge.target === id);
  if (currentEdges.length) {
    currentEdges.forEach(currentEdge => {
      const prevPrevNodeId = currentEdge.source;
      if (prevPrevNodeId && prevPrevNodeId !== NodeIdEnum.start) {
        targetNodes.push(prevPrevNodeId);
        // 递归调用时传入visited集合
        getPrevPrevNodes(prevPrevNodeId, edges, targetNodes, visited);
      }
    });
  }
}

export const getRefNodes: IGetInputNodesProps = ({
  edges = [],
  id,
  nodes,
  nodeData,
}) => {
  const targetNodes: string[] = [];
  getPrevPrevNodes(id, edges, targetNodes);

  // 其余代码保持不变
  return uniq(targetNodes)
    .map(id => {
      const { display_name: label = '' } =
        nodes.find(node => node.id === id)?.data || {};
      return {
        value: id,
        label,
        children: Object.entries(
          (nodeData?.[id]?.outputs as Record<string, any>) || {},
        )?.map(([key, { name }]) => {
          return {
            label: name,
            value: key.startsWith('__context__') ? key : `${id}.${key}`,
          };
        }),
      };
    })
    .filter(state => state.children?.length > 0);
};
