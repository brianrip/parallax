import BiasLegend from "./BiasLegend";
import ArticleCard from "./ArticleCard";
import LoadingSkeleton from "./LoadingSkeleton";
import ErrorState from "./ErrorState";
import type { BriefingResponse } from "@/lib/types";

interface BriefingPanelProps {
  briefing: BriefingResponse | null;
  loading: boolean;
  error: string | null;
}

export default function BriefingPanel({ briefing, loading, error }: BriefingPanelProps) {
  return (
    <div className="min-w-0">
      {/* Section header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 h-px bg-slate-800" />
        <span className="text-xs font-mono tracking-widest text-amber-400">BRIEFING</span>
        <div className="flex-1 h-px bg-slate-800" />
      </div>

      {/* Subheading */}
      <p className="text-xs text-slate-500 mb-4 text-center">
        Formal press · Bias-rated · Across the spectrum
      </p>

      {loading && <LoadingSkeleton side="briefing" rows={4} />}
      {error && !loading && <ErrorState message={error} side="briefing" />}

      {briefing && !loading && (
        <>
          <BiasLegend />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {briefing.articles.map((article, i) => (
              <ArticleCard key={i} article={article} />
            ))}
          </div>
          <p className="text-xs font-mono text-slate-700 mt-4 text-right">
            {new Date(briefing.fetchedAt).toLocaleTimeString()}
          </p>
        </>
      )}
    </div>
  );
}
