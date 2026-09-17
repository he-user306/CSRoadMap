import { useRef } from "react";
import type { Node, Edge } from "@xyflow/react";
import type { EditorNodeData } from "./EditorNode";

const EMOJI_SUGGESTIONS = [
  "📖", "🎨", "⚙️", "🤖", "🛡️", "🏆", "🧠", "🔐", "📊", "🌐",
  "🚀", "⚛️", "🐍", "☕", "🐳", "🐧", "📘", "🎓", "💻", "⌨️",
];

interface EditorSidebarProps {
  nodes: Node<EditorNodeData>[];
  edges: Edge[];
  roadmapTitle: string;
  roadmapId: string;
  roadmapIcon: string;
  selectedNodeId: string | null;
  onMetadataChange: (field: "roadmapTitle" | "roadmapId" | "roadmapIcon", value: string) => void;
  onAddNode: () => void;
  onAutoLayout: () => void;
  onLoadFile: (file: File) => void;
  onLoadExisting: (roadmapId: string) => void;
  onExport: () => string;
  onDownload: () => void;
  onSelectNode: (nodeId: string) => void;
}

export function EditorSidebar({
  nodes,
  edges,
  roadmapTitle,
  roadmapId,
  roadmapIcon,
  selectedNodeId,
  onMetadataChange,
  onAddNode,
  onAutoLayout,
  onLoadFile,
  onLoadExisting,
  onExport,
  onDownload,
  onSelectNode,
}: EditorSidebarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <aside className="mc-panel flex flex-col w-[220px] flex-shrink-0">
      <div className="px-3 py-2 border-b-2 border-[#0a0a0a] bg-[#151515]">
        <h2 className="text-xs font-bold uppercase tracking-wider text-[#666]">
          编辑器
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Metadata */}
        <div className="editor-sidebar-section">
          <div className="editor-sidebar-title">路线信息</div>
          <input
            className="prop-input mb-1"
            placeholder="路线标题"
            value={roadmapTitle}
            onChange={(e) => onMetadataChange("roadmapTitle", e.target.value)}
          />
          <input
            className="prop-input mb-1"
            placeholder="路线 ID"
            value={roadmapId}
            onChange={(e) => onMetadataChange("roadmapId", e.target.value)}
          />
          <div>
            <label className="text-[10px] text-[#555]">图标</label>
            <div className="flex gap-1 flex-wrap mt-1">
              {EMOJI_SUGGESTIONS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  className={`emoji-chip-sm ${roadmapIcon === emoji ? "ring-1 ring-[#e8903c]" : ""}`}
                  onClick={() => onMetadataChange("roadmapIcon", emoji)}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="editor-sidebar-section">
          <div className="editor-sidebar-title">操作</div>
          <div className="flex flex-col gap-1">
            <button type="button" className="editor-btn editor-btn-primary" onClick={onAddNode}>
              + 添加节点
            </button>
            <button type="button" className="editor-btn" onClick={onAutoLayout}>
              自动布局
            </button>
            <button type="button" className="editor-btn" onClick={() => fileInputRef.current?.click()}>
              导入 JSON 文件
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onLoadFile(file);
                if (e.target) e.target.value = "";
              }}
            />
            <button type="button" className="editor-btn" onClick={onDownload}>
              下载 .json
            </button>
            <button
              type="button"
              className="editor-btn"
              onClick={() => {
                const json = onExport();
                navigator.clipboard.writeText(json);
              }}
            >
              复制 JSON
            </button>
          </div>
        </div>

        {/* Load existing */}
        <div className="editor-sidebar-section">
          <div className="editor-sidebar-title">加载内置路线</div>
          <div className="flex flex-col gap-1">
            {[
              { id: "common", label: "通用基础" },
              { id: "frontend", label: "前端开发" },
              { id: "backend", label: "后端开发" },
              { id: "ai", label: "人工智能" },
              { id: "security", label: "网络安全" },
              { id: "algorithm", label: "算法竞赛" },
            ].map((r) => (
              <button
                key={r.id}
                type="button"
                className="editor-btn text-left text-[11px]"
                onClick={() => onLoadExisting(r.id)}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {/* Node list */}
        <div className="editor-sidebar-section">
          <div className="editor-sidebar-title">
            节点列表 ({nodes.length}) / 连线 ({edges.length})
          </div>
          <div className="flex flex-col gap-0.5 max-h-[200px] overflow-y-auto">
            {nodes.map((node) => (
              <button
                key={node.id}
                type="button"
                className={`text-left px-2 py-1 text-[11px] rounded transition ${
                  selectedNodeId === node.id
                    ? "bg-[#e8903c]/20 text-[#e8903c]"
                    : "text-[#888] hover:bg-[#222]"
                }`}
                onClick={() => onSelectNode(node.id)}
              >
                <span className="mr-1">{node.data.icon ?? "📋"}</span>
                {node.data.title}
              </button>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
