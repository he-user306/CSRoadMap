import type { Roadmap } from "../types/roadmap";

interface RoadmapSelectorProps {
  roadmaps: Roadmap[];
  selectedRoadmapId: string;
  onSelect: (id: string) => void;
}

export function RoadmapSelector({
  roadmaps,
  selectedRoadmapId,
  onSelect,
}: RoadmapSelectorProps) {
  return (
    <aside className="mc-panel flex flex-col w-full">
      <div className="px-4 py-3 border-b-2 border-[#0a0a0a] bg-[#151515]">
        <h2 className="text-xs font-bold uppercase tracking-wider text-[#666]">
          章节选择
        </h2>
      </div>
      <div className="flex-1 overflow-y-auto py-1">
        {roadmaps.map((roadmap) => {
          const isSelected = roadmap.id === selectedRoadmapId;
          return (
            <button
              key={roadmap.id}
              type="button"
              onClick={() => onSelect(roadmap.id)}
              className={`chapter-btn ${isSelected ? "chapter-btn-active" : ""}`}
            >
              <span className="chapter-btn-icon">
                {roadmap.icon ?? "📋"}
              </span>
              <div className="min-w-0">
                <span className="block text-[13px] font-semibold truncate">
                  {roadmap.title}
                </span>
                <span className="block text-[11px] text-[#555] truncate mt-0.5">
                  {roadmap.description}
                </span>
              </div>
              {isSelected && (
                <span className="ml-auto text-[#e8903c] text-xs">▶</span>
              )}
            </button>
          );
        })}
      </div>
    </aside>
  );
}
