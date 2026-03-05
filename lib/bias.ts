import type { BiasRating, SignalType } from "./types";

export const BIAS_COLORS: Record<BiasRating, string> = {
  "Left":             "bg-blue-600",
  "Center-Left":      "bg-teal-500",
  "Center":           "bg-slate-500",
  "Center-Right":     "bg-orange-500",
  "Right":            "bg-red-600",
  "State-Affiliated": "bg-purple-600",
};

export const BIAS_TEXT_COLORS: Record<BiasRating, string> = {
  "Left":             "text-blue-400",
  "Center-Left":      "text-teal-400",
  "Center":           "text-slate-400",
  "Center-Right":     "text-orange-400",
  "Right":            "text-red-400",
  "State-Affiliated": "text-purple-400",
};

// Text labels — no emoji
export const SIGNAL_TYPE_LABELS: Record<SignalType, string> = {
  breaking:    "BREAKING",
  official:    "OFFICIAL",
  journalist:  "JOURNALIST",
  discourse:   "DISCOURSE",
  contrarian:  "CONTRARIAN",
  ontheground: "ON THE GROUND",
};

// Colored pill classes per signal type
export const SIGNAL_TYPE_COLORS: Record<SignalType, string> = {
  breaking:    "text-red-400 bg-red-950 border-red-800",
  official:    "text-sky-400 bg-sky-950 border-sky-800",
  journalist:  "text-amber-400 bg-amber-950 border-amber-800",
  discourse:   "text-slate-300 bg-slate-800 border-slate-700",
  contrarian:  "text-violet-400 bg-violet-950 border-violet-800",
  ontheground: "text-teal-400 bg-teal-950 border-teal-800",
};

export const SENTIMENT_COLORS: Record<string, string> = {
  alarming: "text-red-400",
  cautious:  "text-orange-400",
  neutral:   "text-slate-400",
  hopeful:   "text-teal-400",
};
