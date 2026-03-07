type Side = "briefing" | "pulse";

interface LoadingSkeletonProps {
  side: Side;
  rows?: number;
}

export default function LoadingSkeleton({ side, rows = 4 }: LoadingSkeletonProps) {
  const label = side === "briefing" ? "ACCESSING BRIEFING..." : "SCANNING PULSE...";

  return (
    <div className="space-y-4">
      <p
        className="text-[var(--color-text-tertiary)]"
        style={{ fontFamily: "var(--font-mono)", fontSize: "10px", fontWeight: 500, letterSpacing: "0.2em" }}
      >
        {label}
      </p>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="bg-[var(--color-surface)] border border-[var(--color-border)] p-4 space-y-2.5"
        >
          <div className="skeleton-shimmer h-2 rounded-sm w-2/5" />
          <div className="skeleton-shimmer h-3 rounded-sm w-4/5" />
          <div className="skeleton-shimmer h-3 rounded-sm w-full" />
          <div className="skeleton-shimmer h-3 rounded-sm w-5/6" />
        </div>
      ))}
    </div>
  );
}
