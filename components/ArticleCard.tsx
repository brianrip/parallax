"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { BIAS_COLORS } from "@/lib/bias";
import type { Article } from "@/lib/types";

interface ArticleCardProps {
  article: Article;
  index?: number;
}

export default function ArticleCard({ article, index = 0 }: ArticleCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={`group bg-[var(--color-base)] border border-[var(--color-border)] p-5 cursor-pointer
        transition-all duration-150 animate-fade-up
        hover:[border-color:rgba(245,166,35,0.4)] hover:[box-shadow:0_0_0_1px_rgba(245,166,35,0.08)]
        ${expanded ? "border-l-2 border-l-[var(--color-amber)]" : ""}`}
      style={{ animationDelay: `${index * 50}ms` }}
      onClick={() => setExpanded((v) => !v)}
    >
      <div className="flex items-center justify-between gap-2 mb-2">
        <span
          className="text-[var(--color-text-secondary)] uppercase truncate"
          style={{ fontFamily: "var(--font-mono)", fontSize: "11px", fontWeight: 500, letterSpacing: "0.05em" }}
        >
          {article.source}
        </span>
        <span
          className="shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-[#F0F4FF] whitespace-nowrap"
          style={{
            backgroundColor: BIAS_COLORS[article.biasRating],
            fontFamily: "var(--font-mono)",
            fontSize: "10px",
            fontWeight: 500,
            letterSpacing: "0.1em",
          }}
        >
          {article.biasRating.toUpperCase()}
        </span>
      </div>

      <h3
        className="text-[var(--color-text-primary)] leading-snug mb-1.5"
        style={{ fontFamily: "var(--font-body)", fontSize: "15px", fontWeight: 600, letterSpacing: "-0.01em" }}
      >
        {article.headline}
      </h3>

      <p
        className="text-[var(--color-text-tertiary)] italic mb-2 leading-relaxed"
        style={{ fontFamily: "var(--font-body)", fontSize: "12px" }}
      >
        {article.framing}
      </p>

      <p
        className={`text-[var(--color-text-secondary)] leading-relaxed ${expanded ? "" : "line-clamp-3"}`}
        style={{ fontFamily: "var(--font-body)", fontSize: "13px" }}
      >
        {article.summary}
      </p>

      {expanded && (
        <div className="mt-3 pt-3 border-t border-[var(--color-border-subtle)]">
          <p
            className="mb-1"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "10px",
              fontWeight: 500,
              letterSpacing: "0.2em",
              color: BIAS_COLORS[article.biasRating],
            }}
          >
            BIAS ANALYSIS
          </p>
          <p
            className="text-[var(--color-text-secondary)] leading-relaxed"
            style={{ fontFamily: "var(--font-body)", fontSize: "12px" }}
          >
            {article.biasExplanation}
          </p>
        </div>
      )}

      <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-[var(--color-border-subtle)]">
        <span
          className="text-[var(--color-text-tertiary)]"
          style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.05em" }}
        >
          {article.publishedAt}
        </span>
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          title="Link provided by AI — verify before citing"
          className="text-[var(--color-amber)] hover:text-[var(--color-amber-dim)]
            transition-colors inline-flex items-center gap-1"
          style={{ fontFamily: "var(--font-mono)", fontSize: "11px", fontWeight: 500, letterSpacing: "0.05em" }}
          onClick={(e) => e.stopPropagation()}
        >
          Read <ArrowUpRight size={12} strokeWidth={1.5} />
        </a>
      </div>
    </div>
  );
}
