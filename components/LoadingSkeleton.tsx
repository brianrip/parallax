type Side = "briefing" | "pulse";

interface LoadingSkeletonProps {
  side: Side;
  rows?: number;
}

export default function LoadingSkeleton({ side, rows = 4 }: LoadingSkeletonProps) {
  const label = side === "briefing" ? "ACCESSING BRIEFING..." : "SCANNING PULSE...";
  const barColor =
    side === "briefing"
      ? "bg-amber-950/60"
      : "bg-cyan-950/60";
  const shimmer =
    side === "briefing"
      ? "bg-amber-900/30"
      : "bg-cyan-900/30";

  return (
    <div className="space-y-4">
      <p className="text-xs font-mono tracking-widest text-slate-500">{label}</p>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className={`rounded ${barColor} p-4 space-y-2 border border-slate-800`}
        >
          <div className={`h-2 rounded ${shimmer} w-1/4`} />
          <div className={`h-3 rounded ${shimmer} w-3/4`} />
          <div className={`h-3 rounded ${shimmer} w-full`} />
          <div className={`h-3 rounded ${shimmer} w-5/6`} />
        </div>
      ))}
    </div>
  );
}
