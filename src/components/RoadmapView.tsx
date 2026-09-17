import { useMemo } from "react";
import {
  Background,
  Controls,
  Handle,
  Position,
  ReactFlow,
  type Edge,
  type Node,
  type NodeProps,
} from "@xyflow/react";
import { type NodeStatus, type Roadmap } from "../types/roadmap";
import { getDagreLayout } from "../utils/layout";
import { pickIcon } from "../utils/icons";

interface RoadmapViewProps {
  roadmap: Roadmap;
  getStatus: (nodeId: string) => NodeStatus;
  onSelectNode: (nodeId: string) => void;
  selectedNodeId: string | null;
}

interface SkillNodeData extends Record<string, unknown> {
  title: string;
  stage?: string;
  status: NodeStatus;
  selected: boolean;
  icon: string;
}

const statusBadgeClass: Record<NodeStatus, string> = {
  not_started: "quest-hex-badge-not_started",
  learning: "quest-hex-badge-learning",
  completed: "quest-hex-badge-completed",
};

const statusBadgeSymbol: Record<NodeStatus, string> = {
  not_started: "?",
  learning: "✦",
  completed: "✓",
};

const edgeColors: Record<NodeStatus, string> = {
  not_started: "#3a3a3a",
  learning: "#c8a84e",
  completed: "#4a8c3f",
};

function SkillMapNode({ data }: NodeProps<Node<SkillNodeData>>) {
  const hexClass = `quest-hex quest-hex-${data.status}${data.selected ? " quest-hex-selected" : ""}`;

  return (
    <div className="flex flex-col items-center">
      <Handle type="target" position={Position.Top} className="!bg-transparent !border-0" />
      <div className={hexClass}>
        <div className="quest-hex-inner">
          <span className="quest-hex-icon">{data.icon}</span>
          <span className="quest-hex-label text-[#c8c8c8]">{data.title}</span>
        </div>
        <div className={`quest-hex-badge ${statusBadgeClass[data.status]}`}>
          {statusBadgeSymbol[data.status]}
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-transparent !border-0" />
    </div>
  );
}

const nodeTypes = { skillMapNode: SkillMapNode };

export function RoadmapView({
  roadmap,
  getStatus,
  onSelectNode,
  selectedNodeId,
}: RoadmapViewProps) {
  const { nodes: skillNodes, edges: mainEdges } = useMemo(() => {
    const rawNodes: Node<SkillNodeData>[] = roadmap.nodes.map((node) => {
      const status = getStatus(node.id);
      return {
        id: node.id,
        type: "skillMapNode",
        position: { x: 0, y: 0 },
        data: {
          title: node.title,
          stage: node.stage,
          status,
          selected: selectedNodeId === node.id,
          icon: pickIcon(node.title, node.icon),
        },
        draggable: false,
      };
    });

    const rawEdges: Edge[] = roadmap.edges.map((edge) => {
      const targetStatus = getStatus(edge.target);
      return {
        id: `${edge.source}-${edge.target}`,
        source: edge.source,
        target: edge.target,
        type: "smoothstep",
        zIndex: 5,
        animated: targetStatus === "learning",
        style: {
          stroke: edgeColors[targetStatus],
          strokeWidth: 3,
          strokeLinecap: "round",
        },
      };
    });

    return getDagreLayout(rawNodes, rawEdges, "TB");
  }, [getStatus, roadmap.nodes, roadmap.edges, selectedNodeId]);

  return (
    <section className="flex-1 flex flex-col min-h-0 mc-panel overflow-hidden">
      <div className="hidden sm:flex px-4 py-3 border-b-2 border-[#0a0a0a] bg-[#151515] items-center gap-3">
        <span className="text-lg">{roadmap.icon ?? "📋"}</span>
        <div>
          <h2 className="text-sm font-bold text-[#c8c8c8]">{roadmap.title}</h2>
          <p className="text-[11px] text-[#666]">{roadmap.description}</p>
        </div>
      </div>
      <div className="quest-canvas flex-1 min-h-0" style={{ minHeight: "280px" }}>
        <ReactFlow
          key={roadmap.id}
          nodes={skillNodes}
          edges={mainEdges}
          nodeTypes={nodeTypes}
          onNodeClick={(_, node) => {
            if (roadmap.nodes.some((n) => n.id === node.id)) {
              onSelectNode(node.id);
            }
          }}
          fitView
          fitViewOptions={{ padding: 0.15, maxZoom: 1.0 }}
          minZoom={0.3}
          maxZoom={1.6}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable
        >
          <Background gap={48} color="rgba(255,255,255,0.03)" />
          <Controls position="bottom-right" />
        </ReactFlow>
      </div>
    </section>
  );
}
