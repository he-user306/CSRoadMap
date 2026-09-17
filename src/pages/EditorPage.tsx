import { useCallback, useMemo, useState } from "react";
import {
  useNodesState,
  useEdgesState,
  type Connection,
  type Edge,
  type Node,
} from "@xyflow/react";
import { EditorSidebar } from "../components/EditorSidebar";
import { EditorCanvas } from "../components/EditorCanvas";
import { EditorNodePanel } from "../components/EditorNodePanel";
import { EditorSelectionContext, type EditorNodeData } from "../components/EditorNode";
import { roadmaps } from "../data/roadmaps";
import { getDagreLayout } from "../utils/layout";
import { pickIcon } from "../utils/icons";
import type { RoadmapInput } from "../types/roadmap";

let nodeCounter = 0;

function makeNodeId(): string {
  nodeCounter++;
  return `node-${nodeCounter}-${Date.now()}`;
}

function buildDefaultNode(): Node<EditorNodeData> {
  const id = makeNodeId();
  return {
    id,
    type: "editorNode",
    position: { x: 100 + Math.random() * 200, y: 100 + Math.random() * 200 },
    data: { id, title: "新节点", icon: "📋" },
  };
}

function roadmapToFlow(roadmap: RoadmapInput): {
  nodes: Node<EditorNodeData>[];
  edges: Edge[];
} {
  const flowNodes: Node<EditorNodeData>[] = roadmap.nodes.map((node) => ({
    id: node.id,
    type: "editorNode",
    position: { x: 0, y: 0 },
    data: {
      id: node.id,
      title: node.title,
      description: node.description,
      stage: node.stage,
      icon: pickIcon(node.title, node.icon),
    },
  }));

  const edges: RoadmapInput["edges"] = roadmap.edges;
  const flowEdges: Edge[] = (edges ?? []).map((edge) => ({
    id: `${edge.source}-${edge.target}`,
    source: edge.source,
    target: edge.target,
    type: "smoothstep",
    style: { stroke: "#5a5a5a", strokeWidth: 2 },
  }));

  return getDagreLayout(flowNodes, flowEdges, "TB");
}

export function EditorPage() {
  const [initialNodes, initialEdges] = useMemo(() => {
    const sample: RoadmapInput = {
      id: "custom-roadmap",
      title: "自定义路线",
      description: "",
      icon: "📋",
      nodes: [],
      edges: [],
    };
    return [roadmapToFlow(sample).nodes, roadmapToFlow(sample).edges];
  }, []);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);
  const [roadmapTitle, setRoadmapTitle] = useState("自定义路线");
  const [roadmapId, setRoadmapId] = useState("custom-roadmap");
  const [roadmapIcon, setRoadmapIcon] = useState("📋");

  const selectedNode = useMemo(
    () => nodes.find((n) => n.id === selectedNodeId) ?? null,
    [nodes, selectedNodeId],
  );

  const selectedEdge = useMemo(
    () => edges.find((e) => e.id === selectedEdgeId) ?? null,
    [edges, selectedEdgeId],
  );

  const handleConnect = useCallback(
    (connection: Connection) => {
      if (!connection.source || !connection.target) return;
      const exists = edges.some(
        (e) => e.source === connection.source && e.target === connection.target,
      );
      if (!exists) {
        const newEdge: Edge = {
          id: `${connection.source}-${connection.target}`,
          source: connection.source,
          target: connection.target,
          type: "smoothstep",
          style: { stroke: "#5a5a5a", strokeWidth: 2 },
        };
        setEdges((eds) => [...eds, newEdge]);
      }
    },
    [edges, setEdges],
  );

  const handleAddNode = useCallback(() => {
    setNodes((nds) => [...nds, buildDefaultNode()]);
  }, [setNodes]);

  const handleAutoLayout = useCallback(() => {
    const result = getDagreLayout(
      nodes as Node[],
      edges as Edge[],
      "TB",
    );
    setNodes(result.nodes as Node<EditorNodeData>[]);
    setEdges([...result.edges]);
  }, [nodes, edges, setNodes, setEdges]);

  const handleLoadExisting = useCallback(
    (id: string) => {
      const roadmap = roadmaps.find((r) => r.id === id);
      if (!roadmap) return;
      const result = roadmapToFlow(roadmap);
      setNodes(result.nodes);
      setEdges(result.edges);
      setRoadmapTitle(roadmap.title);
      setRoadmapId(roadmap.id);
      setRoadmapIcon(roadmap.icon ?? "📋");
      setSelectedNodeId(null);
      setSelectedEdgeId(null);
    },
    [setNodes, setEdges],
  );

  const handleLoadFile = useCallback(
    (file: File) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string) as RoadmapInput;
          const result = roadmapToFlow(data);
          setNodes(result.nodes);
          setEdges(result.edges);
          setRoadmapTitle(data.title ?? "导入路线");
          setRoadmapId(data.id ?? "imported");
          setRoadmapIcon(data.icon ?? "📋");
          setSelectedNodeId(null);
          setSelectedEdgeId(null);
        } catch {
          alert("JSON 文件格式不正确，请检查后重试。");
        }
      };
      reader.readAsText(file);
    },
    [setNodes, setEdges],
  );

  const handleExport = useCallback((): string => {
    const exportData: RoadmapInput = {
      id: roadmapId || "custom-roadmap",
      title: roadmapTitle || "自定义路线",
      description: "",
      icon: roadmapIcon,
      nodes: nodes.map((node) => ({
        id: node.data.id || node.id,
        title: node.data.title,
        description: node.data.description ?? "",
        stage: node.data.stage,
        icon: node.data.icon,
      })),
      edges: edges.map((edge) => ({
        source: edge.source,
        target: edge.target,
      })),
    };
    return JSON.stringify(exportData, null, 2);
  }, [nodes, edges, roadmapTitle, roadmapId, roadmapIcon]);

  const handleDownload = useCallback(() => {
    const json = handleExport();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${roadmapId || "roadmap"}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [handleExport, roadmapId]);

  const handleUpdateNode = useCallback(
    (nodeId: string, patch: Partial<EditorNodeData>) => {
      setNodes((nds) =>
        nds.map((n) =>
          n.id === nodeId ? { ...n, data: { ...n.data, ...patch } } : n,
        ),
      );
    },
    [setNodes],
  );

  const handleDeleteNode = useCallback(
    (nodeId: string) => {
      setNodes((nds) => nds.filter((n) => n.id !== nodeId));
      setEdges((eds) =>
        eds.filter((e) => e.source !== nodeId && e.target !== nodeId),
      );
      setSelectedNodeId(null);
    },
    [setNodes, setEdges],
  );

  const handleDeleteEdge = useCallback(
    (edgeId: string) => {
      setEdges((eds) => eds.filter((e) => e.id !== edgeId));
      setSelectedEdgeId(null);
    },
    [setEdges],
  );

  const handleMetadataChange = useCallback(
    (field: "roadmapTitle" | "roadmapId" | "roadmapIcon", value: string) => {
      if (field === "roadmapTitle") setRoadmapTitle(value);
      else if (field === "roadmapId") setRoadmapId(value);
      else setRoadmapIcon(value);
    },
    [],
  );

  const selectionAPI = useMemo(
    () => ({
      selectNode: (nodeId: string) => {
        setSelectedNodeId(nodeId);
        setSelectedEdgeId(null);
      },
      selectEdge: (edgeId: string) => {
        setSelectedEdgeId(edgeId);
        setSelectedNodeId(null);
      },
    }),
    [],
  );

  return (
    <EditorSelectionContext.Provider value={selectionAPI}>
      <main className="flex-1 flex flex-col min-h-0">
        <div className="flex-1 flex min-h-0 p-3 gap-3">
          <EditorSidebar
            nodes={nodes}
            edges={edges}
            roadmapTitle={roadmapTitle}
            roadmapId={roadmapId}
            roadmapIcon={roadmapIcon}
            selectedNodeId={selectedNodeId}
            onMetadataChange={handleMetadataChange}
            onAddNode={handleAddNode}
            onAutoLayout={handleAutoLayout}
            onLoadFile={handleLoadFile}
            onLoadExisting={handleLoadExisting}
            onExport={handleExport}
            onDownload={handleDownload}
            onSelectNode={(id) => {
              setSelectedNodeId(id);
              setSelectedEdgeId(null);
            }}
          />
          <EditorCanvas
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={handleConnect}
            onSelectEdge={(id) => {
              setSelectedEdgeId(id);
              setSelectedNodeId(null);
            }}
            onDeselect={() => {
              setSelectedNodeId(null);
              setSelectedEdgeId(null);
            }}
          />
          <EditorNodePanel
            selectedNode={selectedNode}
            selectedEdge={selectedEdge}
            allNodes={nodes}
            onUpdateNode={handleUpdateNode}
            onDeleteNode={handleDeleteNode}
            onDeleteEdge={handleDeleteEdge}
          />
        </div>
      </main>
    </EditorSelectionContext.Provider>
  );
}
