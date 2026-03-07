import type { BriefingResponse, PulseResponse } from "@/lib/types";

interface SituationSummaryProps {
  briefing: BriefingResponse | null;
  pulse: PulseResponse | null;
}

export default function SituationSummary({ briefing, pulse }: SituationSummaryProps) {
  if (briefing) {
    return (
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] border-l-2 border-l-[var(--color-amber)] px-6 py-5 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-block w-0.5 h-3 bg-[var(--color-amber)]" />
          <span className="uppercase text-[var(--color-amber)]" style={{ fontFamily: "var(--font-mono)", fontSize: "10px", fontWeight: 500, letterSpacing: "0.2em" }}>
            What&apos;s Actually Happening
          </span>
        </div>
        <p className="text-[var(--color-text-secondary)] leading-[1.7] max-w-[900px]" style={{ fontFamily: "var(--font-body)", fontSize: "14px" }}>
          {briefing.situationSummary}
        </p>
      </div>
    );
  }

  if (pulse) {
    return (
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] border-l-2 border-l-[var(--sentiment-hopeful)] px-6 py-5 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-block w-0.5 h-3 bg-[var(--sentiment-hopeful)]" />
          <span className="uppercase text-[var(--color-amber)]" style={{ fontFamily: "var(--font-mono)", fontSize: "10px", fontWeight: 500, letterSpacing: "0.2em" }}>
            Discourse Snapshot — Briefing Unavailable
          </span>
        </div>
        <p className="text-[var(--color-text-secondary)] leading-[1.7]" style={{ fontFamily: "var(--font-body)", fontSize: "14px" }}>
          {pulse.discourseSnapshot}
        </p>
      </div>
    );
  }

  return null;
}
