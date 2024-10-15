import {
  IFlow,
  NodeTypeEnum,
  NodeIdEnum,
  MaterialListType,
} from '@shellagent/flow-engine';
import { Workflow } from '@shellagent/pro-config';

import { CustomEdge, EdgeTypeEnum } from '@/components/app/edges';
import { StartNode, StateNode } from '@/components/app/nodes';

export const nodeTypes = {
  [NodeTypeEnum.start]: StartNode,
  [NodeTypeEnum.state]: StateNode,
};

export const edgeTypes = {
  [EdgeTypeEnum.custom]: CustomEdge,
};

export const defaultFlow: IFlow = {
  nodes: [
    {
      width: 377,
      height: 185,
      id: NodeIdEnum.start,
      position: {
        x: 18.00341796875,
        y: 290.0034713745117,
      },
      type: NodeTypeEnum.start,
      selectable: true,
      focusable: true,
      draggable: true,
      data: {
        type: NodeTypeEnum.start,
        id: NodeIdEnum.start,
      },
      selected: false,
      positionAbsolute: {
        x: 18.00341796875,
        y: 290.0034713745117,
      },
      dragging: false,
    },
  ],
  edges: [],
  viewport: {
    x: 100,
    y: 100,
    zoom: 0.5,
  },
};

export const defaultProConfig: Workflow = {
  type: 'workflow',
  blocks: [],
};

export const materialList: MaterialListType = [
  {
    plain: true,
    items: [
      {
        name: 'State',
        display_name: 'State',
        type: NodeTypeEnum.state,
      },
    ],
  },
  {
    plain: true,
    no_border: true,
    items: [
      {
        display_name: 'Workflow Runner',
        name: 'Workflow Runner',
        type: NodeTypeEnum.workflow,
        undraggable: true,
      },
    ],
  },
  {
    title: 'Large Language Model',
    plain: true,
    no_border: true,
    items: [
      {
        name: 'GPTWidget',
        display_name: 'GPT',
        type: NodeTypeEnum.widget,
        undraggable: true,
      },
      {
        name: 'ClaudeWidget',
        display_name: 'Claude',
        type: NodeTypeEnum.widget,
        undraggable: true,
      },
    ],
  },
  {
    title: 'Tools',
    plain: true,
    no_border: true,
    items: [
      {
        name: 'ImageCanvasWidget',
        display_name: 'Image Canvas',
        type: NodeTypeEnum.widget,
        undraggable: true,
      },
      {
        name: 'XWidget',
        display_name: 'X (Twitter)',
        type: NodeTypeEnum.widget,
        undraggable: true,
      },
      {
        name: 'ImageTextFuserWidget',
        display_name: 'Image Text Fuser (Deprecated)',
        type: NodeTypeEnum.widget,
        undraggable: true,
      },
    ],
  },
];

export const inputSourceHandle = 'custom_message-input-source-handle';

export const buttonSourceHandle = 'custom_button-source-handle';
