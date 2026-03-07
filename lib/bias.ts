import type { BiasRating, SignalType } from "./types";

export const BIAS_COLORS: Record<BiasRating, string> = {
  "Left":             "#1D4ED8",
  "Center-Left":      "#0F766E",
  "Center":           "#475569",
  "Center-Right":     "#C2410C",
  "Right":            "#B91C1C",
  "State-Affiliated": "#6D28D9",
};

export const SIGNAL_TYPE_LABELS: Record<SignalType, string> = {
  breaking:    "BREAKING",
  official:    "OFFICIAL",
  journalist:  "JOURNALIST",
  discourse:   "DISCOURSE",
  contrarian:  "CONTRARIAN",
  ontheground: "ON THE GROUND",
};

export const SIGNAL_TYPE_COLORS: Record<SignalType, string> = {
  breaking:    "text-red-400 bg-red-950 border-red-800",
  official:    "text-sky-400 bg-sky-950 border-sky-800",
  journalist:  "text-amber-400 bg-amber-950 border-amber-800",
  discourse:   "text-slate-300 bg-slate-800 border-slate-700",
  contrarian:  "text-violet-400 bg-violet-950 border-violet-800",
  ontheground: "text-teal-400 bg-teal-950 border-teal-800",
};

export const SIGNAL_TYPE_ICONS: Record<SignalType, string> = {
  breaking:    "Zap",
  official:    "Landmark",
  journalist:  "Newspaper",
  discourse:   "MessageSquare",
  contrarian:  "ArrowLeftRight",
  ontheground: "MapPin",
};

export const SENTIMENT_COLORS: Record<string, string> = {
  alarming: "text-[var(--sentiment-alarming)]",
  cautious: "text-[var(--sentiment-cautious)]",
  neutral:  "text-[var(--sentiment-neutral)]",
  hopeful:  "text-[var(--sentiment-hopeful)]",
};

export const VERIFICATION_STYLES: Record<string, { bg: string; text: string }> = {
  unverified: { bg: "rgba(185,28,28,0.15)", text: "#F87171" },
  plausible:  { bg: "rgba(194,65,12,0.15)", text: "#FB923C" },
  confirmed:  { bg: "rgba(15,118,110,0.15)", text: "#2DD4BF" },
};
