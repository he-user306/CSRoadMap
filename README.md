# CS Roadmap

给计算机新生使用的可视化学习路线图 MVP。

本项目的 UI 设计受 Minecraft 模组 **[FTB Quests](https://github.com/FTBTeam/FTB-Quests)** 启发，使用深色 Minecraft 风格主题与六边形任务节点布局。

## 功能

- 首页和 Roadmap 页面
- 6 条计算机方向路线（通用基础 / 前端 / 后端 / AI / 网络安全 / 算法竞赛）
- **支持分支路线结构** — 节点可以有多个子节点和父节点，形成复杂学习路径
- React Flow 六边形节点图谱（dagre 自动层级布局）
- 点击节点查看详情（任务描述、阶段、状态标记）
- 手动切换节点状态（未开始 / 学习中 / 已掌握）
- 使用 localStorage 保存进度，刷新后保留
- **手机端适配** — 首页和路线页均支持移动端响应式布局（编辑器仅桌面端）
- **可视化路线编辑器** — 在 `/editor` 页面拖拽节点、连线、编辑属性、导出 JSON

## 快速开始

```bash
npm install
npm run dev
```

浏览器访问 `http://localhost:5173` 即可。

- `/` — 首页
- `/roadmap` — 学习路线图
- `/editor` — 可视化编辑器

## 构建

```bash
npm run build
```

产物输出到 `dist/` 目录。

## 技术栈

| 技术 | 用途 |
|------|------|
| React 18 + TypeScript | UI 框架 |
| Vite 5 | 开发 & 构建 |
| Tailwind CSS 3 | 原子化样式 |
| @xyflow/react (React Flow) | 节点图谱渲染 & 编辑器画布 |
| dagre | DAG 层级布局算法 |
| localStorage | 客户端进度持久化 |

## UI 设计说明

整体视觉风格以深色 Minecraft 为主题，参考了 FTB Quests 模组的交互布局：

- **左侧面板** — 路线选择器（仿 Chapter Panel 设计）
- **中央画布** — 六边形节点 + 有向边（仿 Quest Grid 设计）
- **底部状态栏** — 进度统计 + 重置按钮
- **模态详情面板** — 居中弹窗显示任务详情、状态标记（仿 ViewQuestPanel 设计）
- **状态颜色** — 金（学习中）/ 绿（已完成）/ 灰（未开始）

## 项目结构

```
src/
  main.tsx                # 入口
  App.tsx                 # 路由 & 页面切换
  index.css               # 全局样式 & Minecraft 主题变量
  types/roadmap.ts        # 类型定义
  data/
    roadmaps.ts           # 路线加载器（自动扫描 JSON 文件）
    roadmaps/             # 路线数据（每个路线一个 JSON 文件）
      common.json
      frontend.json
      ...
  utils/
    layout.ts             # dagre 层级布局算法
    icons.ts              # 图标关键词匹配
  hooks/useProgress.ts    # 进度管理 hook
  pages/
    HomePage.tsx          # 首页
    RoadmapPage.tsx       # 路线总览页
    EditorPage.tsx        # 可视化编辑器
  components/
    Header.tsx            # 顶部导航栏
    RoadmapSelector.tsx   # 路线选择（左侧面板）
    RoadmapView.tsx       # 节点图谱渲染
    SkillDetailPanel.tsx  # 技能详情弹窗
    ProgressSummary.tsx   # 底部进度条
    EditorNode.tsx        # 编辑器自定义节点
    EditorCanvas.tsx      # 编辑器画布
    EditorSidebar.tsx     # 编辑器工具栏
    EditorNodePanel.tsx   # 节点/连线属性面板
```

## 添加新路线

### 方法一：可视化编辑器（推荐）

1. 运行 `npm run dev`，访问 `http://localhost:5173/editor`
2. 在画布上添加节点、拖拽连线、编辑属性，搭建路线结构
3. 点击「下载 .json」导出文件
4. 将下载的文件放入 `src/data/roadmaps/` 目录
5. 重新运行 `npm run dev`，新路线自动出现在左侧面板

编辑器也支持「加载内置路线」— 选择一条已有路线作为起点修改，或通过「导入 JSON 文件」加载之前导出的路线继续编辑。

### 方法二：手动创建 JSON 文件

在 `src/data/roadmaps/` 目录下新建一个 `.json` 文件（文件名任意），格式如下：

```json
{
  "id": "my-roadmap",
  "title": "我的路线",
  "description": "路线说明",
  "icon": "📖",
  "nodes": [
    {
      "id": "my-node-1",
      "title": "节点名称",
      "description": "节点描述",
      "stage": "阶段名称",
      "icon": "🎯"
    },
    {
      "id": "my-node-2",
      "title": "分支 A",
      "description": "节点描述"
    },
    {
      "id": "my-node-3",
      "title": "分支 B",
      "description": "节点描述"
    }
  ],
  "edges": [
    { "source": "my-node-1", "target": "my-node-2" },
    { "source": "my-node-1", "target": "my-node-3" }
  ]
}
```

**字段说明：**

| 字段 | 必需 | 说明 |
|------|------|------|
| `id` | 是 | 英文短标识，只用小写字母和连字符 |
| `title` | 是 | 中文显示名称 |
| `description` | 否 | 路线简介 |
| `icon` | 否 | 路线 emoji 图标（默认 📋） |
| `nodes` | 是 | 节点数组，每个节点包含 `id`, `title`, `description`, `stage?`, `icon?` |
| `edges` | 否 | 连线数组，每条连线包含 `source` 和 `target`（节点 ID） |

**说明：**
- `edges` 为可选 — 如果不写，系统自动按节点顺序生成单链条连接（向后兼容）
- `stage` — 可选阶段标签，显示在节点下方（如：入门 / 进阶 / 实践 / 大一上）
- 节点 `icon` — 可选，不写则根据标题关键词自动匹配
- **无需手写坐标** — dagre 自动计算层级布局，支持任意复杂的分支和合并结构

## 移动端适配

首页和路线页已做响应式适配，在手机和平板上可正常使用：

| 页面 | 桌面端 | 手机端 |
|------|--------|--------|
| 首页 | 居中大标题 + 4 列步骤卡片 | 紧凑排版 + 2 列卡片 |
| 路线页 | 左侧竖排章节面板 + 中央画布 | 顶部横向滚动章节标签 + 全宽画布 |
| 节点弹窗 | 左右双栏（描述 / 状态按钮） | 上下堆叠单栏 |
| 状态栏 | 完整信息行 | 隐藏路线标题，紧凑排列 |
| 编辑器 | 三栏完整功能 | **仅桌面端使用**，导航栏中隐藏入口 |

**触屏交互：**
- 六边形节点在移动端缩小至 78×78px，但仍是合适的触控目标
- React Flow 缩放控件增大至 36×36px
- 画布支持捏合缩放和双指平移

## UX 设计考量

### 初始缩放策略

路线图打开时使用 `fitView` 自动适配视口，同时做了以下限制：

- **最大初始缩放 `maxZoom: 1.0`** — 防止节点少的路线（如前端 6 节点）过度放大导致单个节点占满屏幕
- **最小缩放 `minZoom: 0.3`** — 防止节点多的路线（如通用基础 10 节点）缩得过小看不清文字
- **`fitView padding: 0.15`** — 节点周围保留 15% 留白，避免边缘节点紧贴画布边界

### 布局策略

- **线性路线**（无分支）：自动使用 3 列蛇形交错排列，比单列更利用横向空间，视觉上不单调
- **分支路线**（有分支/合并）：使用 dagre 拓扑布局，自动计算节点层级、间距和连线路径
- 节点位置完全由算法生成，用户无需手动计算坐标

### 视觉反馈

| 交互 | 反馈 |
|------|------|
| 悬停节点 | 亮度提升 + 轻微放大（130% 亮度，1.08× 缩放） |
| 选中节点 | 橙色发光阴影（`drop-shadow(0 0 14px #e8903c)`） |
| 学习中状态 | 金色六边形边框 + 发光 + 连线动画（流动虚线） |
| 已完成状态 | 绿色六边形边框 + 发光 |
| 路线切换 | React Flow 完全重新挂载（`key={roadmap.id}`），避免状态残留 |

### 进度持久化

- 使用 `localStorage` 键名 `cs-roadmap-progress` 存储进度
- 初始化时自动校验数据合法性，过滤无效条目
- 进度与路线数据解耦 — 修改路线 JSON 不影响已有进度

### 分支路线的编辑器体验

- **节点点击**：通过 React Context 直接处理 DOM 点击事件，绕过 React Flow 的拖拽阈值限制，确保每次点击必定响应
- **拖拽连线**：从节点底部手柄拖出到目标节点顶部手柄，自动创建平滑曲线连线
- **加载内置路线**：可一键加载已有路线进行修改，作为新路线的起点
- **导出/导入**：JSON 格式，支持版本控制和团队协作

## 修改主题颜色

编辑 `src/index.css` 中的 `:root` 变量：

```css
:root {
  --mc-bg: #0d0d0d;         /* 背景色 */
  --mc-panel: #1e1e1e;      /* 面板色 */
  --mc-gold: #c8a84e;       /* 进行中（金色） */
  --mc-green: #4a8c3f;      /* 已完成（绿色） */
  --mc-gray: #5a5a5a;       /* 未开始（灰色） */
  --mc-accent: #e8903c;     /* 强调色（选中高亮） */
}
```

## 致谢

本项目的 UI 设计深受 [FTB Quests](https://github.com/FTBTeam/FTB-Quests) 启发。FTB Quests 是由 FTB Team 开发的 Minecraft 模组，提供高度可定制的任务系统和简洁易用的界面。感谢 FTB Team 的开源贡献。
