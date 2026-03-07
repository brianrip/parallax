"use client";

import { RefreshCw } from "lucide-react";
import type { HistoryItem } from "@/lib/types";

interface HistoryPanelProps {
  history: HistoryItem[];
  onSelect: (topic: string) => void;
  onClear: () => void;
}

function timeAgo(dateStr: string): string {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function HistoryPanel({ history, onSelect, onClear }: HistoryPanelProps) {
  if (history.length === 0) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="inline-block w-0.5 h-3 bg-[var(--color-amber)]" />
          <span
            className="uppercase text-[var(--color-amber)]"
            style={{ fontFamily: "var(--font-mono)", fontSize: "10px", fontWeight: 500, letterSpacing: "0.2em" }}
          >
            Recent
          </span>
        </div>
        <button
          onClick={onClear}
          className="text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)] transition-colors"
          style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.05em" }}
        >
          CLEAR
        </button>
      </div>
      <div className="flex flex-wrap gap-px">
        {history.map((item, i) => (
          <button
            key={`${item.topic}-${i}`}
            onClick={() => onSelect(item.topic)}
            className="border border-[var(--color-border)] text-[var(--color-text-secondary)]
              bg-[var(--color-surface)]
              hover:border-[var(--color-amber)] hover:text-[var(--color-amber)]
              hover:bg-[var(--color-amber-glow)]
              px-2.5 py-1.5 transition-all flex items-center gap-2"
            style={{ fontFamily: "var(--font-mono)", fontSize: "11px" }}
            title={`Queried ${timeAgo(item.queriedAt)}`}
          >
            <RefreshCw size={10} strokeWidth={1.5} className="opacity-40" />
            <span className="truncate max-w-[140px]">{item.topic}</span>
            <span className="text-[var(--color-text-tertiary)] shrink-0" style={{ fontSize: "10px" }}>
              {timeAgo(item.queriedAt)}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
