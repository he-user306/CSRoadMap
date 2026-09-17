interface HomePageProps {
  onStart: () => void;
}

const directions = [
  { icon: "🖥️", label: "选择方向" },
  { icon: "🗺️", label: "查看路线" },
  { icon: "🎯", label: "点击节点" },
  { icon: "💾", label: "保存进度" },
];

export function HomePage({ onStart }: HomePageProps) {
  return (
    <main className="flex-1 flex items-center justify-center px-4 py-8 sm:py-12">
      <div className="w-full max-w-2xl text-center">
        <p className="text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-[#c8a84e] mb-4 sm:mb-6">
          ⚔ 学习路线图 ⚔
        </p>

        <h1 className="text-3xl sm:text-5xl md:text-7xl font-black tracking-tight text-[#d8d8d8] mb-3 sm:mb-4 home-title-glow">
          CS Roadmap
        </h1>

        <p className="text-base sm:text-lg md:text-xl text-[#888] mb-3 sm:mb-4">
          给计算机新生使用的学习路线图
        </p>

        <p className="text-xs sm:text-sm text-[#666] max-w-md mx-auto leading-relaxed mb-8 sm:mb-10">
          选择方向，查看路线，点亮已掌握技能，记录自己的学习进度。
        </p>

        <button
          type="button"
          onClick={onStart}
          className="mc-panel-raised px-6 py-2.5 sm:px-8 sm:py-3 text-sm font-bold text-[#c8a84e] hover:text-[#dbb85c] transition-all hover:brightness-110 active:scale-[0.98]"
        >
          开始查看 Roadmap
        </button>

        <div className="mt-10 sm:mt-14 grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
          {directions.map((d) => (
            <div key={d.label} className="mc-panel px-2 py-3 sm:px-3 sm:py-4 text-center">
              <span className="text-xl sm:text-2xl block mb-1 sm:mb-2">{d.icon}</span>
              <span className="text-[10px] sm:text-[11px] font-semibold text-[#888]">
                {d.label}
              </span>
            </div>
          ))}
        </div>

        <p className="mt-10 sm:mt-12 text-[10px] sm:text-[11px] text-[#444] font-mono">
          v1.1.0 — MCP Edition
        </p>
      </div>
    </main>
  );
}
