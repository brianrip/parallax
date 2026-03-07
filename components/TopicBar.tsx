"use client";

import { useState } from "react";
import { PRESET_TOPICS } from "@/lib/topics";

interface TopicBarProps {
  onAnalyze: (topic: string) => void;
  loading: boolean;
}

export default function TopicBar({ onAnalyze, loading }: TopicBarProps) {
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (trimmed) {
      onAnalyze(trimmed);
    }
  };

  const handleChip = (topic: string) => {
    setInput(topic);
    onAnalyze(topic);
  };

  return (
    <div className="mb-6">
      <form onSubmit={handleSubmit} className="flex gap-0 mb-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter any topic — Iran nuclear deal, Gaza ceasefire, Taiwan..."
          maxLength={200}
          disabled={loading}
          className="flex-1 bg-[var(--color-surface)] border border-[var(--color-border)]
            border-r-0 focus:border-[var(--color-amber)] focus:outline-none
            text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)]
            text-sm px-4 py-3 transition-colors disabled:opacity-50"
          style={{ fontFamily: "var(--font-body)" }}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="bg-[var(--color-amber)] text-[#050810] font-medium text-sm
            px-6 py-3 hover:bg-[var(--color-amber-dim)] transition-colors
            disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
          style={{ fontFamily: "var(--font-body)", letterSpacing: "0.02em" }}
        >
          {loading ? "..." : "Analyze →"}
        </button>
      </form>

      <div className="flex gap-px overflow-x-auto pb-1 scrollbar-none">
        {PRESET_TOPICS.map((topic) => (
          <button
            key={topic}
            onClick={() => handleChip(topic)}
            disabled={loading}
            className="border border-[var(--color-border)] text-[var(--color-text-secondary)]
              bg-[var(--color-base)]
              hover:border-[var(--color-amber)] hover:text-[var(--color-amber)]
              hover:bg-[var(--color-amber-glow)]
              px-3.5 py-1.5 shrink-0 transition-all duration-120
              disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ fontFamily: "var(--font-mono)", fontSize: "11px", fontWeight: 500, letterSpacing: "0.05em" }}
          >
            {topic}
          </button>
        ))}
      </div>
    </div>
  );
}
