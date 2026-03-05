"use client";

type ActiveTab = "briefing" | "pulse" | "tracked";

interface PanelTabsProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
}

export default function PanelTabs({ activeTab, onTabChange }: PanelTabsProps) {
  return (
    <div className="flex border-b border-slate-800 mb-4 sm:mb-6 md:hidden">
      <button
        onClick={() => onTabChange("briefing")}
        className={`flex-1 py-3 text-xs font-mono tracking-widest transition-colors
          ${
            activeTab === "briefing"
              ? "text-amber-400 border-b-2 border-amber-400 -mb-px"
              : "text-slate-500 hover:text-slate-300"
          }`}
      >
        BRIEFING
      </button>
      <button
        onClick={() => onTabChange("pulse")}
        className={`flex-1 py-3 text-xs font-mono tracking-widest transition-colors flex items-center justify-center gap-2
          ${
            activeTab === "pulse"
              ? "text-cyan-400 border-b-2 border-cyan-400 -mb-px"
              : "text-slate-500 hover:text-slate-300"
          }`}
      >
        PULSE
        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
      </button>
    </div>
  );
}
