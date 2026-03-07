"use client";

import { Bookmark, X } from "lucide-react";
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
      <div className="flex items-center gap-2 mb-4">
        <span className="inline-block w-0.5 h-3 bg-[var(--color-amber)]" />
        <span
          className="uppercase text-[var(--color-amber)]"
          style={{ fontFamily: "var(--font-mono)", fontSize: "10px", fontWeight: 500, letterSpacing: "0.2em" }}
        >
          Tracked Topics
        </span>
      </div>

      {watchlist.length === 0 ? (
        <p
          className="text-[var(--color-text-tertiary)] text-center py-4"
          style={{ fontFamily: "var(--font-mono)", fontSize: "11px" }}
        >
          No tracked topics.
          <br />
          <Bookmark size={14} strokeWidth={1.5} className="inline-block mt-1 opacity-40" /> Save a result to track it.
        </p>
      ) : (
        <ul className="space-y-px">
          {watchlist.map((item) => (
            <li key={item.topic}>
              <div
                className={`flex items-center justify-between gap-2 px-3 py-2
                  border transition-colors cursor-pointer
                  ${
                    activeTopic === item.topic
                      ? "border-[rgba(245,166,35,0.4)] bg-[var(--color-surface)] text-[var(--color-amber)]"
                      : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-primary)] hover:border-[var(--color-text-tertiary)]"
                  }`}
                onClick={() => onSelect(item.topic)}
              >
                <div className="min-w-0">
                  <p className="truncate" style={{ fontFamily: "var(--font-mono)", fontSize: "11px", fontWeight: 500 }}>
                    {item.topic}
                  </p>
                  {item.lastFetchedAt && (
                    <p className="text-[var(--color-text-tertiary)] mt-0.5" style={{ fontFamily: "var(--font-mono)", fontSize: "10px" }}>
                      {new Date(item.lastFetchedAt).toLocaleTimeString()}
                    </p>
                  )}
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); onRemove(item.topic); }}
                  className="shrink-0 text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] transition-colors"
                  title="Remove"
                >
                  <X size={14} strokeWidth={1.5} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
