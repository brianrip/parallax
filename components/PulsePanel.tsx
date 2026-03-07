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
      <div className="flex items-center gap-2 mb-4">
        <span className="inline-block w-0.5 h-3 bg-[var(--color-amber)]" />
        <span
          className="uppercase text-[var(--color-amber)]"
          style={{ fontFamily: "var(--font-mono)", fontSize: "10px", fontWeight: 500, letterSpacing: "0.2em" }}
        >
          Pulse
        </span>
        <span className="inline-flex items-center gap-1.5 ml-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--sentiment-hopeful)] animate-pulse" />
          <span
            className="uppercase text-[var(--sentiment-hopeful)]"
            style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.2em" }}
          >
            Live
          </span>
        </span>
      </div>

      {loading && <LoadingSkeleton side="pulse" rows={4} />}
      {error && !loading && <ErrorState message={error} side="pulse" />}

      {pulse && !loading && (
        <>
          <div className="bg-[var(--color-surface-raised)] border border-[var(--color-border)] border-l-2 border-l-[var(--color-border)] px-4 py-3 mb-4">
            <p
              className="text-[var(--color-text-secondary)] leading-relaxed"
              style={{ fontFamily: "var(--font-body)", fontSize: "12px" }}
            >
              {pulse.discourseSnapshot}
            </p>
          </div>

          <div className="flex flex-col gap-0.5">
            {pulse.signals.map((signal, i) => (
              <PulseItem key={i} signal={signal} index={i} />
            ))}
          </div>

          <p
            className="text-[var(--color-text-tertiary)] mt-4 text-right"
            style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.05em" }}
          >
            {new Date(pulse.fetchedAt).toLocaleTimeString()}
          </p>
        </>
      )}
    </div>
  );
}
