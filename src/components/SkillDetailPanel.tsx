import {
  statusOptions,
  statusText,
  type NodeStatus,
  type RoadmapNode,
} from "../types/roadmap";

interface SkillDetailPanelProps {
  node: RoadmapNode | null;
  status: NodeStatus;
  onStatusChange: (status: NodeStatus) => void;
  onClose: () => void;
}

const statusColors: Record<NodeStatus, string> = {
  not_started: "bg-[#5a5a5a] border-[#3a3a3a] text-[#999]",
  learning: "bg-[#7a6820] border-[#5a4a10] text-[#c8a84e]",
  completed: "bg-[#2d5a24] border-[#1a3a14] text-[#4a8c3f]",
};

const statusRingColors: Record<NodeStatus, string> = {
  not_started: "ring-[#5a5a5a]",
  learning: "ring-[#c8a84e]",
  completed: "ring-[#4a8c3f]",
};

const statusIcons: Record<NodeStatus, string> = {
  not_started: "⬜",
  learning: "🟨",
  completed: "🟩",
};

export function SkillDetailPanel({
  node,
  status,
  onStatusChange,
  onClose,
}: SkillDetailPanelProps) {
  if (!node) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content mc-panel"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Title bar */}
        <div className="flex items-center justify-between px-4 sm:px-5 py-3 sm:py-4 border-b-2 border-[#0a0a0a] bg-[#151515]">
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="text-lg sm:text-xl">
              {status === "completed" ? "✅" :
               status === "learning" ? "📖" : "📋"}
            </span>
            <h2 className="text-base sm:text-lg font-bold text-[#d8d8d8]">{node.title}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-[#666] hover:text-[#c8c8c8] text-lg font-bold transition"
          >
            ✕
          </button>
        </div>

        {/* Content — 2 cols on desktop, stacked on mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-0">
          {/* Description */}
          <div className="p-4 sm:p-5 sm:border-r-2 border-b-2 sm:border-b-0 border-[#0a0a0a]">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#555] mb-3">
              任务描述
            </p>
            <div className="space-y-3">
              <div>
                <span className="text-[11px] text-[#555]">阶段</span>
                <p className="text-sm text-[#999] mt-0.5">
                  {node.stage ?? "未指定"}
                </p>
              </div>
              <div>
                <span className="text-[11px] text-[#555]">当前状态</span>
                <p className="text-sm text-[#999] mt-0.5">
                  {statusIcons[status]} {statusText[status]}
                </p>
              </div>
              <div>
                <span className="text-[11px] text-[#555]">说明</span>
                <p className="text-sm text-[#888] mt-0.5 leading-relaxed">
                  {node.description}
                </p>
              </div>
            </div>
          </div>

          {/* Status buttons */}
          <div className="p-4 sm:p-5">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#555] mb-3">
              标记状态
            </p>
            <div className="space-y-2">
              {statusOptions.map((option) => {
                const isActive = option === status;
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => onStatusChange(option)}
                    className={`w-full text-left px-3 py-3 text-sm font-semibold transition-all border-2 ${
                      isActive
                        ? `${statusColors[option]} ring-2 ${statusRingColors[option]} border-[#0a0a0a] border-t-[#3d3d3d] border-l-[#3d3d3d]`
                        : "bg-[#1e1e1e] border-transparent text-[#707070] hover:bg-[#252525] hover:text-[#999]"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span>{statusIcons[option]}</span>
                      <span>{statusText[option]}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="px-4 sm:px-5 py-2.5 sm:py-3 border-t-2 border-[#0a0a0a] bg-[#151515] flex items-center justify-between">
          <span className="text-[10px] sm:text-[11px] text-[#555] font-mono">
            #{node.id}
          </span>
        </div>
      </div>
    </div>
  );
}
