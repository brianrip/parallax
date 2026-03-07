"use client";

type ActiveTab = "briefing" | "pulse" | "tracked";

interface PanelTabsProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
}

export default function PanelTabs({ activeTab, onTabChange }: PanelTabsProps) {
  return (
    <div className="flex border-b border-[var(--color-border)] mb-4 sm:mb-6 md:hidden">
      <button
        onClick={() => onTabChange("briefing")}
        className={`flex-1 py-3 uppercase transition-colors
          ${
            activeTab === "briefing"
              ? "text-[var(--color-amber)] border-b-2 border-[var(--color-amber)] -mb-px"
              : "text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)]"
          }`}
        style={{ fontFamily: "var(--font-mono)", fontSize: "10px", fontWeight: 500, letterSpacing: "0.2em" }}
      >
        Briefing
      </button>
      <button
        onClick={() => onTabChange("pulse")}
        className={`flex-1 py-3 uppercase transition-colors flex items-center justify-center gap-2
          ${
            activeTab === "pulse"
              ? "text-[var(--color-amber)] border-b-2 border-[var(--color-amber)] -mb-px"
              : "text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)]"
          }`}
        style={{ fontFamily: "var(--font-mono)", fontSize: "10px", fontWeight: 500, letterSpacing: "0.2em" }}
      >
        Pulse
        <span className="w-1.5 h-1.5 rounded-full bg-[var(--sentiment-hopeful)] animate-pulse" />
      </button>
    </div>
  );
}
