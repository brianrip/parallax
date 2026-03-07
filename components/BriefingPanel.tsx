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
      <div className="flex items-center gap-2 mb-4">
        <span className="inline-block w-0.5 h-3 bg-[var(--color-amber)]" />
        <span
          className="uppercase text-[var(--color-amber)]"
          style={{ fontFamily: "var(--font-mono)", fontSize: "10px", fontWeight: 500, letterSpacing: "0.2em" }}
        >
          Briefing
        </span>
      </div>

      {loading && <LoadingSkeleton side="briefing" rows={4} />}
      {error && !loading && <ErrorState message={error} side="briefing" />}

      {briefing && !loading && (
        <>
          <BiasLegend />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0.5">
            {briefing.articles.map((article, i) => (
              <ArticleCard key={i} article={article} index={i} />
            ))}
          </div>
          <p
            className="text-[var(--color-text-tertiary)] mt-4 text-right"
            style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.05em" }}
          >
            {new Date(briefing.fetchedAt).toLocaleTimeString()}
          </p>
        </>
      )}
    </div>
  );
}
