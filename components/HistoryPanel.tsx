"use client";

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
        <span className="text-xs font-mono tracking-widest text-slate-500">RECENT</span>
        <button
          onClick={onClear}
          className="text-xs font-mono text-slate-600 hover:text-slate-400 transition-colors"
        >
          CLEAR
        </button>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {history.map((item, i) => (
          <button
            key={`${item.topic}-${i}`}
            onClick={() => onSelect(item.topic)}
            className="text-xs font-mono border border-slate-800 text-slate-400
              hover:border-amber-400/50 hover:text-amber-400 px-2.5 py-1
              transition-colors bg-slate-900/50 flex items-center gap-2"
            title={`Queried ${timeAgo(item.queriedAt)}`}
          >
            <span className="truncate max-w-[140px]">{item.topic}</span>
            <span className="text-slate-600 shrink-0">{timeAgo(item.queriedAt)}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
