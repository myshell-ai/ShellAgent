import Dagre from '@dagrejs/dagre';

import { IEdge, INode } from '..';

const initSize = {
  width: 500,
  height: 300,
};

const getLayouted = ({
  nodes,
  edges,
  direction = 'LR',
}: {
  nodes: any[];
  edges: IEdge;
  direction?: string;
}) => {
  const g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
  g.setGraph({ rankdir: direction || 'LR' });

  edges.forEach(edge => g.setEdge(edge.source, edge.target));
  nodes.forEach(node =>
    g.setNode(node.id, {
      ...node,
      width: initSize.width,
      height: initSize.height,
    }),
  );

  Dagre.layout(g);

  return {
    nodes: nodes.map(node => {
      const position = g.node(node.id);
      // We are shifting the dagre node position (anchor=center center) to the top left
      // so it matches the React Flow node anchor point (top left).
      const x = position.x - initSize.width / 2;
      const y = position.y - initSize.height / 2;

      return { ...node, position: { x, y } };
    }),
    edges,
  };
};

export { getLayouted };
