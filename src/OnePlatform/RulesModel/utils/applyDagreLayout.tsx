import dagre from "dagre";
import { Node, Edge } from "@xyflow/react";

export function applyDagreLayout(nodes: Node[], edges: Edge[], direction: "TB" | "LR" = "TB") {
  const g = new dagre.graphlib.Graph().setGraph({ rankdir: direction });
  g.setDefaultEdgeLabel(() => ({}));

  nodes.forEach((n) => g.setNode(n.id, { width: 180, height: 60 }));
  edges.forEach((e) => g.setEdge(e.source, e.target));

  dagre.layout(g);

  return {
    nodes: nodes.map((n) => {
      const { x, y } = g.node(n.id);
      return { ...n, position: { x, y } };
    }),
    edges,
  };
}

export function centerNodes(nodes: Node[]) {
  const xs = nodes.map((n) => n.position.x);
  const ys = nodes.map((n) => n.position.y);
  const cx = (Math.min(...xs) + Math.max(...xs)) / 2;
  const cy = (Math.min(...ys) + Math.max(...ys)) / 2;
  return nodes.map((n) => ({
    ...n,
    position: { x: n.position.x - cx, y: n.position.y - cy },
  }));
}
