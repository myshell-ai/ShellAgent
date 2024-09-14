import { IFlow, NodeTypeEnum, NodeIdEnum } from '@shellagent/flow-engine';
import { Workflow } from '@shellagent/pro-config';

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
      width: 619,
      height: 432,
      id: NodeIdEnum.end,
      position: {
        x: 1186.00341796875,
        y: 164.00347137451172,
      },
      type: NodeTypeEnum.end,
      selectable: true,
      focusable: true,
      draggable: true,
      data: {
        type: NodeTypeEnum.end,
        id: NodeIdEnum.end,
      },
      selected: true,
      positionAbsolute: {
        x: 1186.00341796875,
        y: 164.00347137451172,
      },
      dragging: true,
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
