interface ErrorStateProps {
  message: string;
  side: "briefing" | "pulse";
}

export default function ErrorState({ message, side }: ErrorStateProps) {
  return (
    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] border-l-2 border-l-[var(--color-amber)] px-5 py-4">
      <p
        className="text-[var(--color-amber)] mb-1 uppercase"
        style={{ fontFamily: "var(--font-mono)", fontSize: "10px", fontWeight: 500, letterSpacing: "0.2em" }}
      >
        {side === "briefing" ? "Briefing" : "Pulse"} Unavailable
      </p>
      <p
        className="text-[var(--color-text-secondary)]"
        style={{ fontFamily: "var(--font-body)", fontSize: "13px" }}
      >
        {message}
      </p>
    </div>
  );
}
