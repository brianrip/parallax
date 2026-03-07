import { ArrowUpRight, Zap, Landmark, Newspaper, MessageSquare, ArrowLeftRight, MapPin } from "lucide-react";
import { SIGNAL_TYPE_LABELS, SIGNAL_TYPE_COLORS, SENTIMENT_COLORS, VERIFICATION_STYLES } from "@/lib/bias";
import type { PulseSignal, SignalType } from "@/lib/types";

const SIGNAL_ICONS: Record<SignalType, React.ReactNode> = {
  breaking:    <Zap size={12} strokeWidth={1.5} />,
  official:    <Landmark size={12} strokeWidth={1.5} />,
  journalist:  <Newspaper size={12} strokeWidth={1.5} />,
  discourse:   <MessageSquare size={12} strokeWidth={1.5} />,
  contrarian:  <ArrowLeftRight size={12} strokeWidth={1.5} />,
  ontheground: <MapPin size={12} strokeWidth={1.5} />,
};

interface PulseItemProps {
  signal: PulseSignal;
  index?: number;
}

export default function PulseItem({ signal, index = 0 }: PulseItemProps) {
  const verifyStyle = VERIFICATION_STYLES[signal.verificationStatus];

  return (
    <div
      className="bg-[var(--color-base)] border border-[var(--color-border)] p-4
        transition-all duration-150 animate-fade-up hover:[border-color:rgba(245,166,35,0.3)]"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 border rounded-sm ${SIGNAL_TYPE_COLORS[signal.type]}`}
          style={{ fontFamily: "var(--font-mono)", fontSize: "9px", fontWeight: 500, letterSpacing: "0.15em" }}
        >
          {SIGNAL_ICONS[signal.type]}
          {SIGNAL_TYPE_LABELS[signal.type]}
        </span>
        <span
          className="inline-flex items-center px-2 py-0.5 rounded-sm uppercase"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "9px",
            fontWeight: 500,
            letterSpacing: "0.1em",
            backgroundColor: verifyStyle.bg,
            color: verifyStyle.text,
          }}
        >
          {signal.verificationStatus}
        </span>
      </div>

      <div className="flex items-baseline gap-2 mb-1.5">
        <span
          className="text-[var(--color-text-primary)]"
          style={{ fontFamily: "var(--font-body)", fontSize: "12px", fontWeight: 600 }}
        >
          {signal.sourceDescription}
        </span>
        {signal.sourceHandle && (
          <span
            className="text-[var(--color-text-tertiary)]"
            style={{ fontFamily: "var(--font-mono)", fontSize: "11px" }}
          >
            {signal.sourceHandle}
          </span>
        )}
      </div>

      <p
        className="text-[var(--color-text-secondary)] leading-relaxed mb-3"
        style={{ fontFamily: "var(--font-body)", fontSize: "12px" }}
      >
        {signal.summary}
      </p>

      <div className="flex items-center justify-between">
        <span
          className={`uppercase ${SENTIMENT_COLORS[signal.sentiment]}`}
          style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.1em" }}
        >
          {signal.sentiment}
        </span>
        {signal.url && (
          <a
            href={signal.url}
            target="_blank"
            rel="noopener noreferrer"
            title="Link provided by AI — verify before citing"
            className="text-[var(--color-amber)] hover:text-[var(--color-amber-dim)]
              transition-colors inline-flex items-center gap-1"
            style={{ fontFamily: "var(--font-mono)", fontSize: "11px", fontWeight: 500, letterSpacing: "0.05em" }}
          >
            View <ArrowUpRight size={12} strokeWidth={1.5} />
          </a>
        )}
      </div>
    </div>
  );
}
