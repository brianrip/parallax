import { BIAS_COLORS } from "@/lib/bias";
import type { BiasRating } from "@/lib/types";

const BIAS_LABELS: BiasRating[] = [
  "Left",
  "Center-Left",
  "Center",
  "Center-Right",
  "Right",
  "State-Affiliated",
];

export default function BiasLegend() {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-4">
      {BIAS_LABELS.map((rating) => (
        <div key={rating} className="flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-sm ${BIAS_COLORS[rating]}`} />
          <span className="text-xs font-mono text-slate-500">{rating}</span>
        </div>
      ))}
    </div>
  );
}
