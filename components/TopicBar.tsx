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
      <form onSubmit={handleSubmit} className="flex gap-2 mb-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter a topic..."
          maxLength={200}
          disabled={loading}
          className="flex-1 bg-slate-900 border border-slate-700 focus:border-amber-400/50
            focus:outline-none text-white placeholder:text-slate-600 font-mono text-sm
            px-4 py-2.5 transition-colors disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="bg-amber-400 text-slate-950 font-mono font-semibold text-sm px-5 py-2.5
            hover:bg-amber-300 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? "..." : "→"}
        </button>
      </form>

      {/* Preset chips */}
      <div className="flex flex-wrap gap-2">
        {PRESET_TOPICS.map((topic) => (
          <button
            key={topic}
            onClick={() => handleChip(topic)}
            disabled={loading}
            className="text-xs font-mono border border-slate-700 text-slate-400
              hover:border-amber-400/50 hover:text-amber-400 px-3 py-1
              transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {topic}
          </button>
        ))}
      </div>
    </div>
  );
}
