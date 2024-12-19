import {
  IFlow,
  NodeTypeEnum,
  NodeIdEnum,
  MaterialListType,
  MarkerType,
} from '@shellagent/flow-engine';
import { Workflow } from '@shellagent/pro-config';

import { DefaultEdge, CustomEdge, EdgeTypeEnum } from '@/components/app/edges';
import { StartNode, StateNode, IntroNode } from '@/components/app/nodes';

export const nodeTypes = {
  [NodeTypeEnum.start]: StartNode,
  [NodeTypeEnum.state]: StateNode,
  [NodeTypeEnum.intro]: IntroNode,
};

export const edgeTypes = {
  [EdgeTypeEnum.default]: DefaultEdge,
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
    {
      id: 'intro',
      position: {
        x: 592.1845769352449,
        y: 290.0034713745117,
      },
      type: 'intro',
      selectable: true,
      focusable: true,
      draggable: true,
      data: {
        type: 'intro',
        id: NodeIdEnum.intro,
        name: 'Intro',
        display_name: 'Intro',
      },
      width: 500,
      height: 218,
      selected: true,
      positionAbsolute: {
        x: 592.1845769352449,
        y: 290.0034713745117,
      },
      dragging: false,
    },
  ],
  edges: [
    {
      type: 'default_edge',
      style: {
        strokeWidth: 2,
        stroke: '#d1d5db',
      },
      markerEnd: {
        color: '#5A646Es',
        height: 25,
        strokeWidth: 2,
        type: MarkerType.ArrowClosed,
        width: 10,
      },
      source: NodeIdEnum.start,
      sourceHandle: NodeIdEnum.start,
      target: 'intro',
      targetHandle: 'intro',
      animated: false,
      id: 'reactflow__edge-@@@start@@@start-introintro',
    },
  ],
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
        widget_name: '@myshell_llm/1744218088699596812',
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
        display_name: 'Twitter',
        type: NodeTypeEnum.widget,
        undraggable: true,
        widget_name: '@myshell/1784206090390036480',
      },
      {
        name: 'Html2ImgWidget',
        display_name: 'HTML to Image',
        type: NodeTypeEnum.widget,
        undraggable: true,
        widget_name: '@myshell/1850127954369142784',
      },
      {
        name: 'ImageTextFuserWidget',
        display_name: 'Image Text Fuser',
        type: NodeTypeEnum.widget,
        undraggable: true,
      },
    ],
  },
  {
    title: 'Plugins',
    plain: true,
    no_border: true,
    items: [
      {
        name: 'ComfyUIWidget',
        display_name: 'ComfyUI',
        type: NodeTypeEnum.widget,
        custom: true,
        undraggable: true,
      },
    ],
  },
];

export const inputSourceHandle = 'custom_message-input-source-handle';

export const buttonSourceHandle = 'custom_button-source-handle';
