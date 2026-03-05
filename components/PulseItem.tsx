import { SIGNAL_TYPE_LABELS, SIGNAL_TYPE_COLORS, SENTIMENT_COLORS } from "@/lib/bias";
import type { PulseSignal } from "@/lib/types";

interface PulseItemProps {
  signal: PulseSignal;
}

const VERIFICATION_STYLES: Record<PulseSignal["verificationStatus"], string> = {
  unverified: "text-red-400 bg-red-950 border-red-800",
  plausible:  "text-amber-400 bg-amber-950 border-amber-800",
  confirmed:  "text-teal-400 bg-teal-950 border-teal-800",
};

export default function PulseItem({ signal }: PulseItemProps) {
  return (
    <div
      className="bg-slate-900 border border-slate-800 p-4
        transition-all duration-150 hover:border-cyan-400/30 hover:bg-slate-800/80"
    >
      {/* Type pill + verification badge */}
      <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
        <span
          className={`text-xs font-mono px-2 py-0.5 border rounded-sm ${SIGNAL_TYPE_COLORS[signal.type]}`}
        >
          {SIGNAL_TYPE_LABELS[signal.type]}
        </span>
        <span
          className={`text-xs font-mono px-2 py-0.5 border rounded-sm ${VERIFICATION_STYLES[signal.verificationStatus]}`}
        >
          {signal.verificationStatus.toUpperCase()}
        </span>
      </div>

      {/* Source */}
      <div className="flex items-baseline gap-2 mb-2">
        <span className="text-xs font-medium text-slate-200">{signal.sourceDescription}</span>
        {signal.sourceHandle && (
          <span className="text-xs font-mono text-slate-500">{signal.sourceHandle}</span>
        )}
      </div>

      {/* Summary */}
      <p className="text-xs text-slate-300 leading-relaxed mb-3">{signal.summary}</p>

      {/* Footer: sentiment + link */}
      <div className="flex items-center justify-between">
        <span className={`text-xs font-mono uppercase tracking-wider ${SENTIMENT_COLORS[signal.sentiment]}`}>
          {signal.sentiment}
        </span>
        {signal.url && (
          <a
            href={signal.url}
            target="_blank"
            rel="noopener noreferrer"
            title="Link provided by AI — verify before citing"
            className="text-xs font-mono text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            View →
          </a>
        )}
      </div>
    </div>
  );
}
