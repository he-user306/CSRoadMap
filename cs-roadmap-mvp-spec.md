# CS Roadmap MVP 开发说明

## 1. 项目目标

开发一个面向计算机方向新生的 **Roadmap 技能路线图网站**。

这个项目不是在线课程平台，也不是刷题系统，而是一个简单的可视化学习路线图：

- 新生可以选择不同计算机方向；
- 查看该方向的学习路线；
- 点击每个节点查看简单说明；
- 自己判断当前掌握状态；
- 手动标记为「未开始 / 学习中 / 已掌握」；
- 状态保存在浏览器本地，刷新页面后仍然存在。

## 2. MVP 核心原则

本项目第一版只做最小可行版本，禁止加入复杂功能。

### 必须实现

- 首页
- Roadmap 页面
- 多路线切换
- 技能节点图谱展示
- 点击节点显示详情
- 用户手动切换节点状态
- 使用 `localStorage` 保存进度
- 刷新页面后进度不丢失

### 不要实现

- 不要登录系统
- 不要数据库
- 不要后端 API
- 不要任务提交
- 不要作业审核
- 不要 AI 推荐
- 不要排行榜
- 不要评论区
- 不要后台管理系统
- 不要复杂权限系统

## 3. 推荐技术栈

使用最简单的前端单页应用方案。

```txt
Vite + React + TypeScript
Tailwind CSS
@xyflow/react
localStorage
```

说明：

- Vite：用于快速创建 React + TypeScript 项目；
- React：构建页面组件；
- TypeScript：保证数据结构清晰；
- Tailwind CSS：快速写样式；
- @xyflow/react：用于绘制节点和连线，也就是 Roadmap 图；
- localStorage：用于本地保存用户的节点状态。

## 4. 项目初始化命令

```bash
npm create vite@latest cs-roadmap -- --template react-ts
cd cs-roadmap
npm install
npm install @xyflow/react
npm install tailwindcss @tailwindcss/vite
```

## 5. 推荐目录结构

```txt
cs-roadmap/
├── src/
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── RoadmapSelector.tsx
│   │   ├── RoadmapView.tsx
│   │   ├── SkillDetailPanel.tsx
│   │   └── ProgressSummary.tsx
│   ├── data/
│   │   └── roadmaps.ts
│   ├── hooks/
│   │   └── useProgress.ts
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   └── RoadmapPage.tsx
│   ├── types/
│   │   └── roadmap.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── index.html
├── package.json
├── vite.config.ts
└── README.md
```

## 6. 页面设计

### 6.1 首页

首页路径：

```txt
/
```

首页内容：

- 项目标题：`CS Roadmap`
- 副标题：`给计算机新生使用的学习路线图`
- 简短介绍：
  - 选择方向；
  - 查看路线；
  - 点亮已掌握技能；
  - 记录自己的学习进度。
- 进入按钮：`开始查看 Roadmap`

首页不需要复杂动画，保持干净即可。

### 6.2 Roadmap 页面

Roadmap 页面路径：

```txt
/roadmap
```

页面布局：

```txt
┌──────────────────────────────────────────────────────┐
│ Header                                               │
├───────────────┬──────────────────────┬───────────────┤
│ 路线选择       │ Roadmap 图谱          │ 节点详情       │
│               │                      │               │
│ 通用基础       │ 节点 → 节点 → 节点     │ 标题           │
│ 前端开发       │                      │ 描述           │
│ 后端开发       │                      │ 状态按钮       │
│ 人工智能       │                      │               │
│ 网络安全       │                      │               │
│ 算法竞赛       │                      │               │
└───────────────┴──────────────────────┴───────────────┘
```

如果屏幕较窄，可以改成上下布局：

```txt
路线选择
Roadmap 图谱
节点详情
```

## 7. 数据结构设计

### 7.1 节点状态

每个技能节点有三种状态：

```ts
export type NodeStatus = "not_started" | "learning" | "completed";
```

对应中文显示：

```ts
export const statusText = {
  not_started: "未开始",
  learning: "学习中",
  completed: "已掌握",
};
```

颜色建议：

```txt
未开始：灰色
学习中：蓝色
已掌握：绿色
```

### 7.2 Roadmap 类型

在 `src/types/roadmap.ts` 中定义：

```ts
export type NodeStatus = "not_started" | "learning" | "completed";

export interface RoadmapNode {
  id: string;
  title: string;
  description: string;
  stage?: string;
  x: number;
  y: number;
}

export interface RoadmapEdge {
  source: string;
  target: string;
}

export interface Roadmap {
  id: string;
  title: string;
  description: string;
  nodes: RoadmapNode[];
  edges: RoadmapEdge[];
}

export type ProgressMap = Record<string, NodeStatus>;
```

## 8. Roadmap 静态数据

在 `src/data/roadmaps.ts` 中写死数据。

第一版建议包含 6 条路线：

- 通用基础
- 前端开发
- 后端开发
- 人工智能
- 网络安全
- 算法竞赛

每条路线控制在 6 到 10 个节点，不要太多。

示例数据：

```ts
import type { Roadmap } from "../types/roadmap";

export const roadmaps: Roadmap[] = [
  {
    id: "common",
    title: "通用基础",
    description: "适合所有计算机方向新生的基础路线。",
    nodes: [
      {
        id: "common-cs-intro",
        title: "计算机专业认知",
        description: "了解计算机专业大概要学什么，以及常见的发展方向。",
        stage: "大一上",
        x: 0,
        y: 100,
      },
      {
        id: "common-search",
        title: "搜索与提问能力",
        description: "学会使用搜索引擎、官方文档、GitHub 和 AI 工具解决问题。",
        stage: "大一上",
        x: 220,
        y: 100,
      },
      {
        id: "common-markdown",
        title: "Markdown",
        description: "能够编写 README、实验报告和简单技术文档。",
        stage: "大一上",
        x: 440,
        y: 100,
      },
      {
        id: "common-vscode",
        title: "VS Code",
        description: "熟悉编辑器、插件、终端和基本开发环境配置。",
        stage: "大一上",
        x: 660,
        y: 100,
      },
      {
        id: "common-cli",
        title: "命令行基础",
        description: "理解终端、路径、文件操作和常见命令。",
        stage: "大一上",
        x: 880,
        y: 100,
      },
      {
        id: "common-linux",
        title: "Linux 基础",
        description: "知道 Linux 是什么，能进行基本文件管理、软件安装和环境配置。",
        stage: "大一下",
        x: 1100,
        y: 100,
      },
      {
        id: "common-git",
        title: "Git / GitHub",
        description: "掌握版本控制、commit、branch、push 和 GitHub 项目协作基础。",
        stage: "大一下",
        x: 1320,
        y: 100,
      },
      {
        id: "common-programming",
        title: "编程语言入门",
        description: "至少掌握一门编程语言，例如 C、Python、Java 或 C++。",
        stage: "大一",
        x: 1540,
        y: 100,
      },
      {
        id: "common-ds",
        title: "数据结构",
        description: "理解数组、链表、栈、队列、树、图等基础结构。",
        stage: "大二上",
        x: 1760,
        y: 100,
      },
      {
        id: "common-network",
        title: "计算机网络",
        description: "理解 IP、端口、HTTP、DNS、TCP/UDP 等基础概念。",
        stage: "大二",
        x: 1980,
        y: 100,
      },
    ],
    edges: [
      { source: "common-cs-intro", target: "common-search" },
      { source: "common-search", target: "common-markdown" },
      { source: "common-markdown", target: "common-vscode" },
      { source: "common-vscode", target: "common-cli" },
      { source: "common-cli", target: "common-linux" },
      { source: "common-linux", target: "common-git" },
      { source: "common-git", target: "common-programming" },
      { source: "common-programming", target: "common-ds" },
      { source: "common-ds", target: "common-network" },
    ],
  },
  {
    id: "frontend",
    title: "前端开发",
    description: "适合想做网页、管理系统、前端应用的同学。",
    nodes: [
      {
        id: "fe-html-css",
        title: "HTML / CSS",
        description: "能够写基本网页结构和样式。",
        stage: "入门",
        x: 0,
        y: 100,
      },
      {
        id: "fe-js",
        title: "JavaScript",
        description: "理解变量、函数、DOM、事件和异步请求。",
        stage: "入门",
        x: 220,
        y: 100,
      },
      {
        id: "fe-ts",
        title: "TypeScript",
        description: "理解类型标注、接口、泛型和基本工程写法。",
        stage: "进阶",
        x: 440,
        y: 100,
      },
      {
        id: "fe-react",
        title: "React / Vue",
        description: "掌握至少一个主流前端框架。",
        stage: "进阶",
        x: 660,
        y: 100,
      },
      {
        id: "fe-api",
        title: "接口请求",
        description: "会调用后端接口，理解 JSON、REST API 和状态处理。",
        stage: "进阶",
        x: 880,
        y: 100,
      },
      {
        id: "fe-deploy",
        title: "项目部署",
        description: "能够把前端项目部署到 Vercel、Netlify 或服务器。",
        stage: "实践",
        x: 1100,
        y: 100,
      },
    ],
    edges: [
      { source: "fe-html-css", target: "fe-js" },
      { source: "fe-js", target: "fe-ts" },
      { source: "fe-ts", target: "fe-react" },
      { source: "fe-react", target: "fe-api" },
      { source: "fe-api", target: "fe-deploy" },
    ],
  },
  {
    id: "backend",
    title: "后端开发",
    description: "适合想做服务器、接口、数据库和业务系统的同学。",
    nodes: [
      {
        id: "be-language",
        title: "后端语言",
        description: "选择 Java、Go、Node.js、Python 等任意一门作为主力语言。",
        stage: "入门",
        x: 0,
        y: 100,
      },
      {
        id: "be-http",
        title: "HTTP / API",
        description: "理解请求、响应、状态码、REST API 和接口设计。",
        stage: "入门",
        x: 220,
        y: 100,
      },
      {
        id: "be-database",
        title: "数据库",
        description: "理解表、字段、SQL、索引和基础数据库设计。",
        stage: "进阶",
        x: 440,
        y: 100,
      },
      {
        id: "be-framework",
        title: "后端框架",
        description: "掌握一个后端框架，例如 Spring Boot、Express、FastAPI 或 Gin。",
        stage: "进阶",
        x: 660,
        y: 100,
      },
      {
        id: "be-auth",
        title: "身份认证",
        description: "理解登录、注册、Session、Token 和权限控制基础。",
        stage: "进阶",
        x: 880,
        y: 100,
      },
      {
        id: "be-docker",
        title: "Docker",
        description: "能够使用 Docker 打包和运行后端服务。",
        stage: "实践",
        x: 1100,
        y: 100,
      },
      {
        id: "be-deploy",
        title: "服务器部署",
        description: "能够把后端服务部署到云服务器或实验室服务器。",
        stage: "实践",
        x: 1320,
        y: 100,
      },
    ],
    edges: [
      { source: "be-language", target: "be-http" },
      { source: "be-http", target: "be-database" },
      { source: "be-database", target: "be-framework" },
      { source: "be-framework", target: "be-auth" },
      { source: "be-auth", target: "be-docker" },
      { source: "be-docker", target: "be-deploy" },
    ],
  },
  {
    id: "ai",
    title: "人工智能",
    description: "适合想学习机器学习、深度学习、大模型和计算机视觉的同学。",
    nodes: [
      {
        id: "ai-python",
        title: "Python",
        description: "掌握 Python 基础语法、函数、类和常用包管理方式。",
        stage: "入门",
        x: 0,
        y: 100,
      },
      {
        id: "ai-numpy",
        title: "NumPy / Pandas",
        description: "能够进行数组计算、表格数据处理和基础数据分析。",
        stage: "入门",
        x: 220,
        y: 100,
      },
      {
        id: "ai-math",
        title: "数学基础",
        description: "了解线性代数、概率统计和微积分中的常用概念。",
        stage: "基础",
        x: 440,
        y: 100,
      },
      {
        id: "ai-ml",
        title: "机器学习",
        description: "理解分类、回归、聚类、训练集、测试集和过拟合等概念。",
        stage: "进阶",
        x: 660,
        y: 100,
      },
      {
        id: "ai-pytorch",
        title: "PyTorch",
        description: "能够使用 PyTorch 搭建、训练和保存简单神经网络。",
        stage: "进阶",
        x: 880,
        y: 100,
      },
      {
        id: "ai-dl",
        title: "深度学习",
        description: "理解神经网络、CNN、Transformer、损失函数和优化器。",
        stage: "进阶",
        x: 1100,
        y: 100,
      },
      {
        id: "ai-cv-nlp",
        title: "CV / NLP / 大模型",
        description: "选择计算机视觉、自然语言处理或大模型方向继续深入。",
        stage: "方向",
        x: 1320,
        y: 100,
      },
      {
        id: "ai-deploy",
        title: "模型部署",
        description: "了解模型推理、API 服务、GPU 环境和基础部署流程。",
        stage: "实践",
        x: 1540,
        y: 100,
      },
    ],
    edges: [
      { source: "ai-python", target: "ai-numpy" },
      { source: "ai-numpy", target: "ai-math" },
      { source: "ai-math", target: "ai-ml" },
      { source: "ai-ml", target: "ai-pytorch" },
      { source: "ai-pytorch", target: "ai-dl" },
      { source: "ai-dl", target: "ai-cv-nlp" },
      { source: "ai-cv-nlp", target: "ai-deploy" },
    ],
  },
  {
    id: "security",
    title: "网络安全",
    description: "适合想了解 CTF、Web 安全、渗透测试和系统安全的同学。",
    nodes: [
      {
        id: "sec-linux",
        title: "Linux",
        description: "熟悉 Linux 基础命令、文件权限、进程和网络工具。",
        stage: "入门",
        x: 0,
        y: 100,
      },
      {
        id: "sec-network",
        title: "计算机网络",
        description: "理解 IP、端口、协议、HTTP、DNS、TCP/UDP 等基础知识。",
        stage: "基础",
        x: 220,
        y: 100,
      },
      {
        id: "sec-web",
        title: "Web 基础",
        description: "了解浏览器、前端、后端、接口和数据库的基本关系。",
        stage: "基础",
        x: 440,
        y: 100,
      },
      {
        id: "sec-db",
        title: "数据库基础",
        description: "理解 SQL、表结构、查询和常见数据库操作。",
        stage: "基础",
        x: 660,
        y: 100,
      },
      {
        id: "sec-web-security",
        title: "Web 安全",
        description: "了解 SQL 注入、XSS、CSRF、文件上传等常见漏洞。",
        stage: "进阶",
        x: 880,
        y: 100,
      },
      {
        id: "sec-ctf",
        title: "CTF 入门",
        description: "了解 Web、Crypto、Reverse、Pwn、Misc 等 CTF 方向。",
        stage: "实践",
        x: 1100,
        y: 100,
      },
      {
        id: "sec-pentest",
        title: "渗透测试基础",
        description: "了解信息收集、漏洞验证、权限提升和报告编写的基本流程。",
        stage: "实践",
        x: 1320,
        y: 100,
      },
    ],
    edges: [
      { source: "sec-linux", target: "sec-network" },
      { source: "sec-network", target: "sec-web" },
      { source: "sec-web", target: "sec-db" },
      { source: "sec-db", target: "sec-web-security" },
      { source: "sec-web-security", target: "sec-ctf" },
      { source: "sec-ctf", target: "sec-pentest" },
    ],
  },
  {
    id: "algorithm",
    title: "算法竞赛",
    description: "适合想打 ACM、蓝桥杯、程序设计竞赛的同学。",
    nodes: [
      {
        id: "algo-cpp",
        title: "C++ 基础",
        description: "掌握 C++ 基础语法、输入输出、函数和常用写法。",
        stage: "入门",
        x: 0,
        y: 100,
      },
      {
        id: "algo-stl",
        title: "STL",
        description: "熟悉 vector、queue、stack、map、set、priority_queue 等容器。",
        stage: "入门",
        x: 220,
        y: 100,
      },
      {
        id: "algo-complexity",
        title: "复杂度分析",
        description: "理解时间复杂度和空间复杂度，能估计算法能否通过。",
        stage: "基础",
        x: 440,
        y: 100,
      },
      {
        id: "algo-ds",
        title: "基础数据结构",
        description: "掌握数组、链表、栈、队列、树、堆、并查集等结构。",
        stage: "基础",
        x: 660,
        y: 100,
      },
      {
        id: "algo-search",
        title: "搜索",
        description: "理解 DFS、BFS、回溯和常见搜索剪枝思路。",
        stage: "进阶",
        x: 880,
        y: 100,
      },
      {
        id: "algo-dp",
        title: "动态规划",
        description: "理解状态定义、状态转移和常见 DP 类型。",
        stage: "进阶",
        x: 1100,
        y: 100,
      },
      {
        id: "algo-graph",
        title: "图论",
        description: "掌握最短路、最小生成树、拓扑排序等基础图算法。",
        stage: "进阶",
        x: 1320,
        y: 100,
      },
      {
        id: "algo-training",
        title: "竞赛训练",
        description: "通过题单、比赛和复盘持续提升算法能力。",
        stage: "实践",
        x: 1540,
        y: 100,
      },
    ],
    edges: [
      { source: "algo-cpp", target: "algo-stl" },
      { source: "algo-stl", target: "algo-complexity" },
      { source: "algo-complexity", target: "algo-ds" },
      { source: "algo-ds", target: "algo-search" },
      { source: "algo-search", target: "algo-dp" },
      { source: "algo-dp", target: "algo-graph" },
      { source: "algo-graph", target: "algo-training" },
    ],
  },
];
```

## 9. 进度保存逻辑

创建 `src/hooks/useProgress.ts`。

功能：

- 从 localStorage 读取进度；
- 修改某个节点状态；
- 保存到 localStorage；
- 计算已掌握数量和总数量。

localStorage key：

```ts
const STORAGE_KEY = "cs-roadmap-progress";
```

推荐结构：

```json
{
  "common-linux": "completed",
  "common-git": "learning",
  "ai-python": "completed"
}
```

Hook 设计：

```ts
import { useEffect, useState } from "react";
import type { NodeStatus, ProgressMap } from "../types/roadmap";

const STORAGE_KEY = "cs-roadmap-progress";

export function useProgress() {
  const [progress, setProgress] = useState<ProgressMap>({});

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        setProgress(JSON.parse(raw));
      } catch {
        setProgress({});
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  function getStatus(nodeId: string): NodeStatus {
    return progress[nodeId] ?? "not_started";
  }

  function setStatus(nodeId: string, status: NodeStatus) {
    setProgress((prev) => ({
      ...prev,
      [nodeId]: status,
    }));
  }

  function resetProgress() {
    setProgress({});
  }

  return {
    progress,
    getStatus,
    setStatus,
    resetProgress,
  };
}
```

## 10. React Flow 实现要求

使用 `@xyflow/react`。

需要实现：

- 根据当前路线渲染节点；
- 根据当前路线渲染连线；
- 节点颜色根据状态变化；
- 点击节点后设置 selectedNode；
- 右侧详情面板展示 selectedNode。

节点转换逻辑示例：

```ts
const flowNodes = roadmap.nodes.map((node) => {
  const status = getStatus(node.id);

  return {
    id: node.id,
    position: {
      x: node.x,
      y: node.y,
    },
    data: {
      label: node.title,
      status,
    },
    style: getNodeStyle(status),
  };
});
```

边转换逻辑示例：

```ts
const flowEdges = roadmap.edges.map((edge) => ({
  id: `${edge.source}-${edge.target}`,
  source: edge.source,
  target: edge.target,
  animated: true,
}));
```

节点样式示例：

```ts
function getNodeStyle(status: NodeStatus) {
  if (status === "completed") {
    return {
      border: "2px solid #22c55e",
      background: "#dcfce7",
      color: "#166534",
    };
  }

  if (status === "learning") {
    return {
      border: "2px solid #3b82f6",
      background: "#dbeafe",
      color: "#1e40af",
    };
  }

  return {
    border: "2px solid #d1d5db",
    background: "#f9fafb",
    color: "#374151",
  };
}
```

## 11. 组件职责

### 11.1 `RoadmapSelector.tsx`

负责路线切换。

Props：

```ts
interface RoadmapSelectorProps {
  roadmaps: Roadmap[];
  selectedRoadmapId: string;
  onSelect: (id: string) => void;
}
```

要求：

- 左侧显示所有路线；
- 当前选中的路线高亮；
- 点击路线后切换图谱。

### 11.2 `RoadmapView.tsx`

负责显示 React Flow 图。

Props：

```ts
interface RoadmapViewProps {
  roadmap: Roadmap;
  getStatus: (nodeId: string) => NodeStatus;
  onSelectNode: (nodeId: string) => void;
}
```

要求：

- 显示节点；
- 显示边；
- 支持拖动画布；
- 支持缩放；
- 点击节点后通知父组件；
- 默认使用 `fitView`。

### 11.3 `SkillDetailPanel.tsx`

负责显示选中节点详情。

Props：

```ts
interface SkillDetailPanelProps {
  node: RoadmapNode | null;
  status: NodeStatus;
  onStatusChange: (status: NodeStatus) => void;
}
```

要求：

- 如果没有选中节点，显示提示：`点击一个节点查看详情`；
- 显示节点标题；
- 显示建议阶段；
- 显示节点描述；
- 显示三个状态按钮：
  - 未开始
  - 学习中
  - 已掌握
- 点击按钮后更新状态。

### 11.4 `ProgressSummary.tsx`

负责显示当前路线进度。

Props：

```ts
interface ProgressSummaryProps {
  roadmap: Roadmap;
  getStatus: (nodeId: string) => NodeStatus;
}
```

显示：

```txt
当前路线：人工智能
已掌握：3 / 8
学习中：2
完成度：37%
```

完成度计算：

```ts
completedCount / totalCount
```

## 12. App 路由实现

为了保持 MVP 简单，可以不安装 React Router。

使用一个简单状态控制页面：

```ts
const [page, setPage] = useState<"home" | "roadmap">("home");
```

如果用户点击首页按钮，就切换到 Roadmap 页面。

后续如果需要真正路由，再加 React Router。

## 13. UI 风格要求

整体风格：

- 简洁；
- 白色背景；
- 卡片圆角；
- 少量阴影；
- 不要复杂动画；
- 不要过度设计。

颜色建议：

```txt
主色：蓝色
未开始：灰色
学习中：蓝色
已掌握：绿色
背景：浅灰或白色
```

页面宽度：

- 桌面端优先；
- 兼容移动端即可；
- Roadmap 图在移动端可以横向滚动。

## 14. 验收标准

完成后项目应该满足以下条件。

### 基础功能验收

- 启动项目无报错；
- 首页可以正常显示；
- 点击按钮可以进入 Roadmap 页面；
- 左侧可以切换不同路线；
- 中间可以显示节点和连线；
- 点击节点后右侧可以显示详情；
- 可以修改节点状态；
- 节点颜色会随状态变化；
- 刷新页面后状态仍然保留；
- 可以重置进度。

### 数据验收

- 至少包含 6 条路线；
- 每条路线至少包含 6 个节点；
- 每条路线都有连线关系；
- 节点标题和描述清晰；
- 节点 id 不重复。

### 代码验收

- 使用 TypeScript；
- 类型定义清楚；
- 组件拆分合理；
- 没有后端代码；
- 没有数据库代码；
- 没有多余复杂依赖；
- 没有明显重复代码。

## 15. 开发优先级

按照下面顺序开发。

### P0：必须完成

1. 初始化项目；
2. 配置 Tailwind CSS；
3. 添加 Roadmap 数据；
4. 实现首页；
5. 实现 Roadmap 页面布局；
6. 实现 React Flow 图谱；
7. 实现节点点击详情；
8. 实现节点状态切换；
9. 实现 localStorage 保存；
10. 实现路线切换。

### P1：可以完成

1. 当前路线进度统计；
2. 重置进度按钮；
3. 移动端适配；
4. 简单空状态提示；
5. 更好看的节点颜色。

### P2：暂时不要做

1. 登录；
2. 云端保存；
3. 后台管理；
4. AI 推荐；
5. 学习资料管理；
6. 用户社区；
7. 任务系统。

## 16. Codex 实现提示

请按照以下要求生成代码：

1. 使用 `Vite + React + TypeScript`。
2. 使用 `@xyflow/react` 实现 Roadmap 图。
3. 使用 `Tailwind CSS` 写样式。
4. 使用 `localStorage` 保存进度。
5. 所有 roadmap 数据写在 `src/data/roadmaps.ts`。
6. 不要实现后端。
7. 不要实现登录。
8. 不要添加数据库。
9. 不要添加复杂状态管理库，例如 Redux、Zustand。
10. 保持组件简单清晰。
11. 优先保证功能能跑通。
12. 所有按钮和页面文字使用中文。
13. 项目启动命令应为：

```bash
npm run dev
```

14. 项目构建命令应为：

```bash
npm run build
```

## 17. 最终产品描述

最终 MVP 应该是一个简单的网站：

```txt
用户打开网站
↓
看到 CS Roadmap 首页
↓
点击开始查看
↓
进入 Roadmap 页面
↓
选择方向
↓
查看节点路线
↓
点击节点
↓
查看节点说明
↓
选择自己当前状态
↓
节点颜色变化
↓
刷新页面后状态保留
```

一句话总结：

> 这是一个给计算机新生使用的可视化学习路线图，用户可以根据自己的掌握情况点亮不同技能节点。
