interface ErrorStateProps {
  message: string;
  side: "briefing" | "pulse";
}

export default function ErrorState({ message, side }: ErrorStateProps) {
  const accentColor = side === "briefing" ? "border-l-amber-600/50" : "border-l-cyan-600/50";
  const labelColor = side === "briefing" ? "text-amber-600" : "text-cyan-600";

  return (
    <div className={`border border-slate-800 border-l-2 ${accentColor} bg-slate-900 px-4 py-3`}>
      <p className={`text-xs font-mono tracking-widest mb-1 ${labelColor}`}>FEED UNAVAILABLE</p>
      <p className="text-sm text-slate-400">{message}</p>
    </div>
  );
}
