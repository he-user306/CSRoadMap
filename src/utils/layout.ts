import dagre from "dagre";
import type { Node, Edge } from "@xyflow/react";

const NODE_WIDTH = 110;
const NODE_HEIGHT = 110;

const SNAKE_COLS = 3;
const SNAKE_COL_GAP = 210;
const SNAKE_ROW_GAP = 180;

function isLinearChain(edges: Edge[]): boolean {
  if (edges.length === 0) return true;
  const outDegree = new Map<string, number>();
  const inDegree = new Map<string, number>();
  for (const e of edges) {
    outDegree.set(e.source, (outDegree.get(e.source) ?? 0) + 1);
    inDegree.set(e.target, (inDegree.get(e.target) ?? 0) + 1);
  }
  for (const [, count] of outDegree) {
    if (count > 1) return false;
  }
  for (const [, count] of inDegree) {
    if (count > 1) return false;
  }
  return true;
}

function snakeLayout<T extends Node>(nodes: T[], edges: Edge[]): { nodes: T[]; edges: Edge[] } {
  const idToIndex = new Map<string, number>();
  nodes.forEach((node, i) => idToIndex.set(node.id, i));

  // Topological sort to get linear order
  const inDegree = new Map<string, number>();
  const children = new Map<string, string>();
  for (const e of edges) {
    inDegree.set(e.target, (inDegree.get(e.target) ?? 0) + 1);
    children.set(e.source, e.target);
  }
  // Find root (no incoming edges)
  const ordered: string[] = [];
  let current = nodes.find((n) => !inDegree.has(n.id))?.id ?? nodes[0]?.id;
  while (current) {
    ordered.push(current);
    current = children.get(current) ?? "";
  }
  // Append any disconnected nodes
  for (const node of nodes) {
    if (!ordered.includes(node.id)) ordered.push(node.id);
  }

  // Position in snake pattern
  const orderMap = new Map(ordered.map((id, i) => [id, i]));
  const positioned = nodes.map((node) => {
    const idx = orderMap.get(node.id) ?? 0;
    const col = idx % SNAKE_COLS;
    const row = Math.floor(idx / SNAKE_COLS);
    const offset = row % 2 === 0 ? 0 : SNAKE_COL_GAP / 2;
    return {
      ...node,
      position: {
        x: col * SNAKE_COL_GAP + offset,
        y: row * SNAKE_ROW_GAP,
      },
    };
  });

  return { nodes: positioned, edges };
}

export function getDagreLayout<T extends Node>(
  nodes: T[],
  edges: Edge[],
  direction: "TB" | "LR" = "TB",
): { nodes: T[]; edges: Edge[] } {
  if (isLinearChain(edges)) {
    return snakeLayout(nodes, edges);
  }

  const g = new dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));
  g.setGraph({
    rankdir: direction,
    nodesep: 40,
    ranksep: 60,
    marginx: 24,
    marginy: 24,
  });

  for (const node of nodes) {
    g.setNode(node.id, { width: NODE_WIDTH, height: NODE_HEIGHT });
  }
  for (const edge of edges) {
    g.setEdge(edge.source, edge.target);
  }

  dagre.layout(g);

  const layoutedNodes = nodes.map((node) => {
    const dagreNode = g.node(node.id);
    return {
      ...node,
      position: {
        x: dagreNode.x - NODE_WIDTH / 2,
        y: dagreNode.y - NODE_HEIGHT / 2,
      },
    };
  });

  return { nodes: layoutedNodes, edges };
}
