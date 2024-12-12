import { IFlow, NodeIdEnum, NodeTypeEnum } from '@shellagent/flow-engine';
import { Automata, State } from '@shellagent/pro-config';
import { TValue } from '@shellagent/form-engine';
import { get } from 'lodash-es';

import {
  EdgeDataTypeEnum,
  ICustomEdge,
  CustomEdgeData,
} from '@/components/app/edges';
import { NodeDataType } from '@/types/app/types';
import {
  transformChoicesToValues,
  transformValuesToChoices,
} from '@/utils/data-transformer';

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

// 处理模板语法中的空格
function formatTemplateString(data: any): any {
  try {
    const jsonString = JSON.stringify(data);
    const formattedString = jsonString.replace(
      /\{\{([^{}]*?)\}\}/g,
      (match, content) => `{{${content.trim()}}}`,
    );

    return JSON.parse(formattedString);
  } catch (error) {
    return data;
  }
}

// 根据automata生成nodeData
export const genNodeData = (automata: Automata): NodeDataType => {
  const nodeData: NodeDataType = {
    [NodeIdEnum.start]: {
      id: NodeIdEnum.start,
      type: NodeTypeEnum.start,
      context: automata.context || {},
    },
  };

  if (automata.blocks) {
    Object.entries(automata.blocks).forEach(([key, block], index) => {
      if (key === automata.initial) {
        const state = block as State;
        nodeData[key as Lowercase<string>] = {
          id: key,
          type: NodeTypeEnum.intro,
          name: state.name,
          render: state.render,
          inputs: {},
          outputs: {},
          blocks: [],
        };
      } else if (block.type === 'state') {
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

  const result = replaceContext2Form(formatTemplateString(nodeData));

  return result;
};

// 根据生成automata
export const genAutomata: (
  flow: IFlow,
  nodeData: NodeDataType,
  comfyui_api?: string,
) => Automata = (flow, nodeData, comfyui_api) => {
  const initial =
    (flow.edges.find(edge => edge.source === NodeIdEnum.start)
      ?.target as Lowercase<string>) || '';
  const blocks: Automata['blocks'] = {};

  flow.nodes
    .filter(
      node =>
        node.type === NodeTypeEnum.state || node.type === NodeTypeEnum.intro,
    )
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
        type:
          nodeData[node.id]?.type === 'intro'
            ? 'state'
            : nodeData[node.id]?.type || 'state',
        name: nodeData[node.id]?.name,
        render: nodeData[node.id]?.render,
        blocks: nodeData[node.id]?.blocks?.map((item: any) => ({
          ...item,
          ...(item.widget_class_name === 'ComfyUIWidget'
            ? { api: comfyui_api || item.api }
            : {}),
        })),
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

export const replaceContextByAutomata = (value: TValue, automata: Automata) => {
  if (typeof value === 'string') {
    const arrayMatch = value.match(/\{\{\s*\[([^\]]+)\]\s*\}\}/);
    if (arrayMatch) {
      const items = arrayMatch[1].split(/,\s*/).map(item =>
        item.trim().replace(/__context__([a-z0-9_]+)__/g, (match, key) => {
          const field: TValue = get(automata, ['context', key]);
          if (field) {
            return typeof field === 'object' ? field.value : field;
          }
          return match;
        }),
      );
      return items;
    }

    return value.replace(
      /\{\{\s*__context__([a-z0-9_]+)__\s*\}\}/g,
      (match, key) => {
        const field: TValue = get(automata, ['context', key]);
        if (field) {
          return typeof field === 'object' ? field.value : field;
        }
        return match;
      },
    );
  }
  return value;
};

export const formatReactFlow = (reactflow: IFlow) => {
  return {
    ...reactflow,
    nodes: reactflow?.nodes?.map(item => {
      // 版本兼容
      if (item.type === NodeTypeEnum.intro) {
        return {
          ...item,
          type: NodeTypeEnum.state,
          data: {
            ...item.data,
            type: NodeTypeEnum.state,
          },
        };
      }
      return item;
    }),
  };
};
