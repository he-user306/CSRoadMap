import { useMemo, useState } from "react";
import { ProgressSummary } from "../components/ProgressSummary";
import { RoadmapSelector } from "../components/RoadmapSelector";
import { RoadmapView } from "../components/RoadmapView";
import { SkillDetailPanel } from "../components/SkillDetailPanel";
import { roadmaps } from "../data/roadmaps";
import { useProgress } from "../hooks/useProgress";
import type { Roadmap } from "../types/roadmap";

function getRoadmapById(id: string): Roadmap {
  return roadmaps.find((r) => r.id === id) ?? roadmaps[0];
}

export function RoadmapPage() {
  const [selectedRoadmapId, setSelectedRoadmapId] = useState(roadmaps[0].id);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const { getStatus, setStatus, resetProgress } = useProgress();

  const selectedRoadmap = useMemo(
    () => getRoadmapById(selectedRoadmapId),
    [selectedRoadmapId],
  );

  const selectedNode = useMemo(
    () =>
      selectedNodeId
        ? selectedRoadmap.nodes.find((n) => n.id === selectedNodeId) ?? null
        : null,
    [selectedNodeId, selectedRoadmap.nodes],
  );

  const selectedStatus = selectedNode
    ? getStatus(selectedNode.id)
    : "not_started";

  function handleSelectRoadmap(id: string) {
    setSelectedRoadmapId(id);
    setSelectedNodeId(null);
  }

  const mobileTabs = (
    <div className="sm:hidden flex gap-1 overflow-x-auto pb-1.5 px-1 scrollbar-none">
      {roadmaps.map((roadmap) => {
        const isSelected = roadmap.id === selectedRoadmapId;
        return (
          <button
            key={roadmap.id}
            type="button"
            onClick={() => handleSelectRoadmap(roadmap.id)}
            className={`flex-shrink-0 flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-semibold transition border-2 whitespace-nowrap rounded ${
              isSelected
                ? "bg-[#2a2a2a] border-[#0a0a0a] border-t-[#3d3d3d] border-l-[#3d3d3d] text-[#e8903c]"
                : "border-transparent text-[#707070] bg-[#1a1a1a]"
            }`}
          >
            <span className="text-xs">{roadmap.icon ?? "📋"}</span>
            {roadmap.title}
          </button>
        );
      })}
    </div>
  );

  return (
    <main className="flex-1 flex flex-col min-h-0">
      {/* Mobile tabs */}
      {mobileTabs}

      {/* Main content */}
      <div className="flex-1 flex min-h-0 p-2 sm:p-3 gap-2 sm:gap-3">
        {/* Desktop sidebar */}
        <div className="hidden sm:block w-[220px] flex-shrink-0 h-full">
          <RoadmapSelector
            roadmaps={roadmaps}
            selectedRoadmapId={selectedRoadmapId}
            onSelect={handleSelectRoadmap}
          />
        </div>
        <RoadmapView
          roadmap={selectedRoadmap}
          getStatus={getStatus}
          onSelectNode={setSelectedNodeId}
          selectedNodeId={selectedNodeId}
        />
      </div>

      {/* Bottom status bar */}
      <ProgressSummary
        roadmap={selectedRoadmap}
        getStatus={getStatus}
        onResetProgress={resetProgress}
      />

      {/* Quest detail modal */}
      <SkillDetailPanel
        node={selectedNode}
        status={selectedStatus}
        onStatusChange={(status) => {
          if (selectedNode) {
            setStatus(selectedNode.id, status);
          }
        }}
        onClose={() => setSelectedNodeId(null)}
      />
    </main>
  );
}
