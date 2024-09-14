import { DefaultEdgeOptions, MarkerType } from 'reactflow';

export const DRAGGABLE_NODE_ID = 'DRAGGABLE_NODE';

export const edgeOptions: DefaultEdgeOptions = {
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
};

export const connectionLineStyle: React.CSSProperties = {
  strokeWidth: 2,
  stroke: '#5A646Es',
};

export const defaultViewport = { x: 100, y: 100, zoom: 0.6 };
