"use client";

import { useState } from "react";
import { BIAS_COLORS, BIAS_TEXT_COLORS } from "@/lib/bias";
import type { Article } from "@/lib/types";

interface ArticleCardProps {
  article: Article;
}

export default function ArticleCard({ article }: ArticleCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="group bg-slate-900 border border-slate-800 p-4 cursor-pointer
        transition-all duration-150 hover:border-amber-400/40 hover:-translate-y-0.5"
      onClick={() => setExpanded((v) => !v)}
    >
      {/* Source + bias badge */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="text-xs font-mono text-slate-500 uppercase tracking-wider truncate">
          {article.source}
        </span>
        <span
          className={`shrink-0 text-xs font-mono px-2 py-0.5 rounded-sm ${BIAS_COLORS[article.biasRating]} text-white`}
        >
          {article.biasRating}
        </span>
      </div>

      {/* Headline */}
      <h3 className="text-sm font-semibold text-white leading-snug mb-1">
        {article.headline}
      </h3>

      {/* Framing */}
      <p className="text-xs italic text-slate-400 mb-2 leading-relaxed">
        {article.framing}
      </p>

      {/* Summary */}
      <p
        className={`text-xs text-slate-300 leading-relaxed ${expanded ? "" : "line-clamp-3"}`}
      >
        {article.summary}
      </p>

      {/* Expanded bias explanation */}
      {expanded && (
        <div className="mt-3 pt-3 border-t border-slate-800">
          <p className={`text-xs font-mono tracking-wider mb-1 ${BIAS_TEXT_COLORS[article.biasRating]}`}>
            BIAS ANALYSIS
          </p>
          <p className="text-xs text-slate-400 leading-relaxed">{article.biasExplanation}</p>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between mt-3">
        <span className="text-xs font-mono text-slate-600">{article.publishedAt}</span>
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          title="Link provided by AI — verify before citing"
          className="text-xs font-mono text-amber-400 hover:text-amber-300 transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          Read →
        </a>
      </div>
    </div>
  );
}
