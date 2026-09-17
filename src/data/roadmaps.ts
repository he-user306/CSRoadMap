import type { Roadmap, RoadmapEdge, RoadmapInput } from "../types/roadmap";

const modules = import.meta.glob<{ default: RoadmapInput }>(
  "./roadmaps/*.json",
  { eager: true },
);

function buildEdges(nodeIds: string[]): RoadmapEdge[] {
  const edges: RoadmapEdge[] = [];
  for (let i = 0; i < nodeIds.length - 1; i++) {
    edges.push({ source: nodeIds[i], target: nodeIds[i + 1] });
  }
  return edges;
}

function toRoadmap(input: RoadmapInput): Roadmap {
  return {
    ...input,
    nodes: input.nodes.map((node) => ({ ...node, x: 0, y: 0 })),
    edges: input.edges ?? buildEdges(input.nodes.map((n) => n.id)),
  };
}

export const roadmaps: Roadmap[] = Object.values(modules).map((m) =>
  toRoadmap(m.default),
);
