import PulseItem from "./PulseItem";
import LoadingSkeleton from "./LoadingSkeleton";
import ErrorState from "./ErrorState";
import type { PulseResponse } from "@/lib/types";

interface PulsePanelProps {
  pulse: PulseResponse | null;
  loading: boolean;
  error: string | null;
}

export default function PulsePanel({ pulse, loading, error }: PulsePanelProps) {
  return (
    <div className="min-w-0">
      {/* Section header with LIVE dot */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 h-px bg-slate-800" />
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono tracking-widest text-cyan-400">PULSE</span>
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
        </div>
        <div className="flex-1 h-px bg-slate-800" />
      </div>

      {/* Subheading */}
      <p className="text-xs text-slate-500 mb-4 text-center">
        X discourse · Breaking signals · On the ground
      </p>

      {loading && <LoadingSkeleton side="pulse" rows={4} />}
      {error && !loading && <ErrorState message={error} side="pulse" />}

      {pulse && !loading && (
        <>
          {/* Discourse snapshot */}
          <div className="border border-slate-800 border-l-2 border-l-cyan-500/40 bg-slate-900 px-4 py-3 mb-4">
            <p className="text-xs font-mono tracking-widest text-cyan-400/70 mb-1">DISCOURSE SNAPSHOT</p>
            <p className="text-xs text-slate-300 leading-relaxed">{pulse.discourseSnapshot}</p>
          </div>

          <div className="space-y-3">
            {pulse.signals.map((signal, i) => (
              <PulseItem key={i} signal={signal} />
            ))}
          </div>

          <p className="text-xs font-mono text-slate-700 mt-4 text-right">
            {new Date(pulse.fetchedAt).toLocaleTimeString()}
          </p>
        </>
      )}
    </div>
  );
}
