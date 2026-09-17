import type { Node, Edge } from "@xyflow/react";
import type { EditorNodeData } from "./EditorNode";

const EMOJI_SUGGESTIONS = [
  "📖", "🎨", "⚙️", "🤖", "🛡️", "🏆", "🧠", "🔐", "📊", "🌐",
  "🚀", "⚛️", "🐍", "☕", "🐳", "🐧", "📘", "🎓", "💻", "⌨️",
];

interface EditorNodePanelProps {
  selectedNode: Node<EditorNodeData> | null;
  selectedEdge: Edge | null;
  allNodes: Node<EditorNodeData>[];
  onUpdateNode: (nodeId: string, data: Partial<EditorNodeData>) => void;
  onDeleteNode: (nodeId: string) => void;
  onDeleteEdge: (edgeId: string) => void;
}

export function EditorNodePanel({
  selectedNode,
  selectedEdge,
  allNodes,
  onUpdateNode,
  onDeleteNode,
  onDeleteEdge,
}: EditorNodePanelProps) {
  if (!selectedNode && !selectedEdge) {
    return (
      <aside className="mc-panel w-[280px] flex-shrink-0 flex items-center justify-center">
        <p className="text-[#555] text-xs px-4 text-center">
          选中节点或连线进行编辑
        </p>
      </aside>
    );
  }

  if (selectedEdge) {
    const sourceNode = allNodes.find((n) => n.id === selectedEdge.source);
    const targetNode = allNodes.find((n) => n.id === selectedEdge.target);
    return (
      <aside className="mc-panel w-[280px] flex-shrink-0 flex flex-col">
        <div className="px-4 py-3 border-b-2 border-[#0a0a0a] bg-[#151515]">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#666]">
            连线属性
          </h3>
        </div>
        <div className="flex-1 p-4 flex flex-col gap-3">
          <div className="prop-field">
            <label>来源</label>
            <div className="text-[13px] text-[#c8c8c8]">{sourceNode?.data.title ?? selectedEdge.source}</div>
          </div>
          <div className="prop-field">
            <label>目标</label>
            <div className="text-[13px] text-[#c8c8c8]">{targetNode?.data.title ?? selectedEdge.target}</div>
          </div>
          <button
            type="button"
            className="editor-btn editor-btn-danger mt-2"
            onClick={() => onDeleteEdge(selectedEdge.id)}
          >
            删除这条连线
          </button>
        </div>
      </aside>
    );
  }

  // Node editing
  if (!selectedNode) return null;
  const node = selectedNode;
  const data = node.data;

  return (
    <aside className="mc-panel w-[280px] flex-shrink-0 flex flex-col">
      <div className="px-4 py-3 border-b-2 border-[#0a0a0a] bg-[#151515]">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#666]">
          节点属性
        </h3>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <div className="prop-field">
          <label>节点 ID</label>
          <input
            className="prop-input"
            value={data.id ?? ""}
            onChange={(e) => onUpdateNode(node.id, { id: e.target.value })}
          />
        </div>
        <div className="prop-field">
          <label>标题</label>
          <input
            className="prop-input"
            value={data.title ?? ""}
            onChange={(e) => onUpdateNode(node.id, { title: e.target.value })}
          />
        </div>
        <div className="prop-field">
          <label>描述</label>
          <textarea
            className="prop-input"
            rows={3}
            value={data.description ?? ""}
            onChange={(e) => onUpdateNode(node.id, { description: e.target.value })}
          />
        </div>
        <div className="prop-field">
          <label>阶段标签</label>
          <input
            className="prop-input"
            placeholder="入门 / 进阶 / 大一上"
            value={data.stage ?? ""}
            onChange={(e) => onUpdateNode(node.id, { stage: e.target.value })}
          />
        </div>
        <div className="prop-field">
          <label>图标</label>
          <input
            className="prop-input"
            maxLength={2}
            value={data.icon ?? ""}
            placeholder="自动检测"
            onChange={(e) => onUpdateNode(node.id, { icon: e.target.value })}
          />
          <div className="flex gap-1 flex-wrap mt-1">
            {EMOJI_SUGGESTIONS.map((emoji) => (
              <button
                key={emoji}
                type="button"
                className={`emoji-chip-sm ${data.icon === emoji ? "ring-1 ring-[#e8903c]" : ""}`}
                onClick={() => onUpdateNode(node.id, { icon: emoji })}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          className="editor-btn editor-btn-danger w-full mt-3"
          onClick={() => onDeleteNode(node.id)}
        >
          删除节点
        </button>
      </div>
    </aside>
  );
}
