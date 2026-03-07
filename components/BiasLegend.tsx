import { BIAS_COLORS } from "@/lib/bias";
import type { BiasRating } from "@/lib/types";

const BIAS_LABELS: BiasRating[] = [
  "Left", "Center-Left", "Center", "Center-Right", "Right", "State-Affiliated",
];

export default function BiasLegend() {
  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      {BIAS_LABELS.map((rating) => (
        <div key={rating} className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: BIAS_COLORS[rating] }} />
          <span className="text-[var(--color-text-tertiary)]" style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.05em" }}>
            {rating}
          </span>
        </div>
      ))}
    </div>
  );
}
