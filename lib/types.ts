export type BiasRating =
  | "Left"
  | "Center-Left"
  | "Center"
  | "Center-Right"
  | "Right"
  | "State-Affiliated";

export interface Article {
  headline: string;
  source: string;
  url: string;
  publishedAt: string;
  summary: string;
  biasRating: BiasRating;
  biasExplanation: string;
  framing: string;
}

export interface BriefingResponse {
  topic: string;
  situationSummary: string;
  articles: Article[];
  fetchedAt: string;
}

export type SignalType =
  | "breaking"
  | "official"
  | "journalist"
  | "discourse"
  | "contrarian"
  | "ontheground";

export interface PulseSignal {
  type: SignalType;
  summary: string;
  sourceHandle?: string;
  sourceDescription: string;
  sentiment: "alarming" | "cautious" | "neutral" | "hopeful";
  verificationStatus: "unverified" | "plausible" | "confirmed";
  url?: string;
}

export interface PulseResponse {
  topic: string;
  discourseSnapshot: string;
  signals: PulseSignal[];
  fetchedAt: string;
}

export interface WatchlistItem {
  topic: string;
  addedAt: string;
  lastFetchedAt?: string;
}

export interface ParallaxResult {
  topic: string;
  briefing: BriefingResponse | null;
  pulse: PulseResponse | null;
}

export interface HistoryItem {
  topic: string;
  queriedAt: string;
}
