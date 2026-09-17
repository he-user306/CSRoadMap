type Page = "home" | "roadmap" | "editor";

interface HeaderProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

export function Header({ currentPage, onNavigate }: HeaderProps) {
  return (
    <header className="border-b-2 border-[#0a0a0a] bg-[#1e1e1e] shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-3 py-2 sm:px-6 sm:py-3">
        <button
          type="button"
          onClick={() => onNavigate("home")}
          className="flex items-center gap-1.5 sm:gap-2 text-left"
        >
          <span className="text-base sm:text-lg">📖</span>
          <span className="text-sm sm:text-base font-bold tracking-wide text-[#c8c8c8]">
            CS Roadmap
          </span>
        </button>

        <nav className="flex items-center gap-0.5 sm:gap-1" aria-label="主导航">
          <button
            type="button"
            onClick={() => onNavigate("home")}
            className={`px-2.5 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold transition border-2 ${
              currentPage === "home"
                ? "bg-[#2a2a2a] border-[#0a0a0a] border-t-[#3d3d3d] border-l-[#3d3d3d] text-[#e8903c]"
                : "border-transparent text-[#707070] hover:bg-[#222] hover:text-[#c8c8c8]"
            }`}
          >
            首页
          </button>
          <button
            type="button"
            onClick={() => onNavigate("roadmap")}
            className={`px-2.5 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold transition border-2 ${
              currentPage === "roadmap"
                ? "bg-[#2a2a2a] border-[#0a0a0a] border-t-[#3d3d3d] border-l-[#3d3d3d] text-[#e8903c]"
                : "border-transparent text-[#707070] hover:bg-[#222] hover:text-[#c8c8c8]"
            }`}
          >
            Roadmap
          </button>
          <button
            type="button"
            onClick={() => onNavigate("editor")}
            className={`hidden sm:inline px-2.5 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold transition border-2 ${
              currentPage === "editor"
                ? "bg-[#2a2a2a] border-[#0a0a0a] border-t-[#3d3d3d] border-l-[#3d3d3d] text-[#e8903c]"
                : "border-transparent text-[#707070] hover:bg-[#222] hover:text-[#c8c8c8]"
            }`}
          >
            编辑器
          </button>
        </nav>
      </div>
    </header>
  );
}
