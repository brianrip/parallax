import type { BriefingResponse, PulseResponse } from "@/lib/types";

interface SituationSummaryProps {
  briefing: BriefingResponse | null;
  pulse: PulseResponse | null;
}

export default function SituationSummary({ briefing, pulse }: SituationSummaryProps) {
  if (briefing) {
    return (
      <div className="border border-slate-800 border-l-2 border-l-amber-400/60 bg-slate-900 px-5 py-4 mb-6">
        <p className="text-xs font-mono tracking-widest text-amber-400 mb-2">
          SITUATION ASSESSMENT
        </p>
        <p className="text-sm text-slate-200 leading-relaxed">{briefing.situationSummary}</p>
      </div>
    );
  }

  if (pulse) {
    return (
      <div className="border border-slate-800 border-l-2 border-l-cyan-400/60 bg-slate-900 px-5 py-4 mb-6">
        <p className="text-xs font-mono tracking-widest text-cyan-400 mb-2">
          DISCOURSE SNAPSHOT — BRIEFING UNAVAILABLE
        </p>
        <p className="text-sm text-slate-200 leading-relaxed">{pulse.discourseSnapshot}</p>
      </div>
    );
  }

  return null;
}
