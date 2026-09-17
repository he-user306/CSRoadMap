export type NodeStatus = "not_started" | "learning" | "completed";

export interface RoadmapNode {
  id: string;
  title: string;
  description: string;
  stage?: string;
  icon?: string;
  x?: number;
  y?: number;
}

export interface RoadmapEdge {
  source: string;
  target: string;
}

export interface Roadmap {
  id: string;
  title: string;
  description: string;
  icon?: string;
  nodes: RoadmapNode[];
  edges: RoadmapEdge[];
}

/** JSON 文件中导入的原始路线数据（无需手动写 edges 和坐标） */
export interface RoadmapInput {
  id: string;
  title: string;
  description: string;
  icon?: string;
  nodes: Omit<RoadmapNode, "x" | "y">[];
  edges?: RoadmapEdge[];
}

export type ProgressMap = Record<string, NodeStatus>;

export const statusText: Record<NodeStatus, string> = {
  not_started: "未开始",
  learning: "学习中",
  completed: "已掌握",
};

export const statusOptions: NodeStatus[] = [
  "not_started",
  "learning",
  "completed",
];
