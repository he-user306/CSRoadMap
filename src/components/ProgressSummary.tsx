import type { NodeStatus, Roadmap } from "../types/roadmap";

interface ProgressSummaryProps {
  roadmap: Roadmap;
  getStatus: (nodeId: string) => NodeStatus;
  onResetProgress: () => void;
}

export function ProgressSummary({
  roadmap,
  getStatus,
  onResetProgress,
}: ProgressSummaryProps) {
  const totalCount = roadmap.nodes.length;
  const completedCount = roadmap.nodes.filter(
    (node) => getStatus(node.id) === "completed",
  ).length;
  const learningCount = roadmap.nodes.filter(
    (node) => getStatus(node.id) === "learning",
  ).length;
  const percent =
    totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  return (
    <div className="status-bar px-3 sm:px-4 py-2 sm:py-2.5 flex items-center justify-between text-[11px] sm:text-[12px] gap-2 flex-wrap">
      <div className="flex items-center gap-3 sm:gap-5 flex-wrap">
        <span className="text-[#666] font-mono hidden sm:inline">
          {roadmap.title}
        </span>
        <span className="text-[#4a8c3f] font-bold">
          已掌握 {completedCount}/{totalCount}
        </span>
        <span className="text-[#c8a84e]">
          学习中 {learningCount}
        </span>
        <span className="text-[#888] font-mono">
          {percent}%
        </span>
      </div>

      <button
        type="button"
        onClick={onResetProgress}
        className="text-[10px] sm:text-[11px] text-[#555] hover:text-[#c8c8c8] transition px-2 py-1 border border-transparent hover:border-[#3a3a3a] flex-shrink-0"
      >
        重置进度
      </button>
    </div>
  );
}
