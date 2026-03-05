"use client";

import type { WatchlistItem } from "@/lib/types";

interface WatchlistPanelProps {
  watchlist: WatchlistItem[];
  activeTopic: string;
  onSelect: (topic: string) => void;
  onRemove: (topic: string) => void;
}

export default function WatchlistPanel({
  watchlist,
  activeTopic,
  onSelect,
  onRemove,
}: WatchlistPanelProps) {
  return (
    <div className="min-w-0">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 h-px bg-slate-800" />
        <span className="text-xs font-mono tracking-widest text-slate-400">TRACKED</span>
        <div className="flex-1 h-px bg-slate-800" />
      </div>

      {watchlist.length === 0 ? (
        <p className="text-xs font-mono text-slate-600 text-center py-4">
          No tracked topics.
          <br />
          Star a result to save it.
        </p>
      ) : (
        <ul className="space-y-1">
          {watchlist.map((item) => (
            <li key={item.topic}>
              <div
                className={`flex items-center justify-between gap-2 px-3 py-2 border transition-colors cursor-pointer
                  ${
                    activeTopic === item.topic
                      ? "border-amber-400/40 bg-slate-900 text-amber-400"
                      : "border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-600"
                  }`}
                onClick={() => onSelect(item.topic)}
              >
                <div className="min-w-0">
                  <p className="text-xs font-mono truncate">{item.topic}</p>
                  {item.lastFetchedAt && (
                    <p className="text-xs font-mono text-slate-600 mt-0.5">
                      {new Date(item.lastFetchedAt).toLocaleTimeString()}
                    </p>
                  )}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemove(item.topic);
                  }}
                  className="shrink-0 text-slate-600 hover:text-slate-400 transition-colors text-xs font-mono"
                  title="Remove"
                >
                  ×
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      {/* TODO: [PRO] Auto-refresh interval per watchlist topic (hourly / daily) */}
    </div>
  );
}
