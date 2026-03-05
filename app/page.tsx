"use client";

import { useState, useRef, useEffect } from "react";
import TopicBar from "@/components/TopicBar";
import SituationSummary from "@/components/SituationSummary";
import BriefingPanel from "@/components/BriefingPanel";
import PulsePanel from "@/components/PulsePanel";
import WatchlistPanel from "@/components/WatchlistPanel";
import PanelTabs from "@/components/PanelTabs";
import type { BriefingResponse, PulseResponse, WatchlistItem } from "@/lib/types";
import { PRESET_TOPICS } from "@/lib/topics";

const WATCHLIST_KEY = "parallax_watchlist";
const MAX_WATCHLIST = 10;

export default function Home() {
  const [topic, setTopic] = useState("");
  const [briefing, setBriefing] = useState<BriefingResponse | null>(null);
  const [pulse, setPulse] = useState<PulseResponse | null>(null);
  const [briefingLoading, setBriefingLoading] = useState(false);
  const [pulseLoading, setPulseLoading] = useState(false);
  const [briefingError, setBriefingError] = useState<string | null>(null);
  const [pulseError, setPulseError] = useState<string | null>(null);
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [activeTab, setActiveTab] = useState<"briefing" | "pulse">("briefing");
  const abortRef = useRef<AbortController | null>(null);

  const hasResults = briefing || pulse;
  const isLoading = briefingLoading || pulseLoading;

  // Hydrate watchlist from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(WATCHLIST_KEY);
      if (stored) setWatchlist(JSON.parse(stored));
    } catch {
      // ignore parse errors
    }
  }, []);

  const persistWatchlist = (next: WatchlistItem[]) => {
    setWatchlist(next);
    localStorage.setItem(WATCHLIST_KEY, JSON.stringify(next));
  };

  const analyze = async (topicInput: string) => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setTopic(topicInput);
    setBriefingLoading(true);
    setPulseLoading(true);
    setBriefingError(null);
    setPulseError(null);
    setBriefing(null);
    setPulse(null);

    const [briefingResult, pulseResult] = await Promise.allSettled([
      fetch("/api/briefing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: topicInput }),
        signal: controller.signal,
      }).then((r) => r.json()),
      fetch("/api/pulse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: topicInput }),
        signal: controller.signal,
      }).then((r) => r.json()),
    ]);

    if (briefingResult.status === "fulfilled" && !briefingResult.value.error) {
      setBriefing(briefingResult.value as BriefingResponse);
    } else {
      setBriefingError("Briefing unavailable.");
    }
    setBriefingLoading(false);

    if (pulseResult.status === "fulfilled" && !pulseResult.value.error) {
      setPulse(pulseResult.value as PulseResponse);
    } else {
      setPulseError("Pulse unavailable.");
    }
    setPulseLoading(false);

    // Update watchlist lastFetchedAt if this topic is already saved
    persistWatchlist(
      watchlist.map((w) =>
        w.topic === topicInput ? { ...w, lastFetchedAt: new Date().toISOString() } : w
      )
    );
  };

  const saveToWatchlist = () => {
    if (!topic || watchlist.some((w) => w.topic === topic)) return;
    const next: WatchlistItem[] = [
      { topic, addedAt: new Date().toISOString(), lastFetchedAt: new Date().toISOString() },
      ...watchlist,
    ].slice(0, MAX_WATCHLIST);
    persistWatchlist(next);
  };

  const removeFromWatchlist = (t: string) => {
    persistWatchlist(watchlist.filter((w) => w.topic !== t));
  };

  const isWatched = watchlist.some((w) => w.topic === topic);

  // TODO: [PRO] Auto-refresh interval per watchlist topic (hourly / daily)
  // TODO: [PRO] Email digest via Resend — daily briefing on saved topics
  // TODO: [PRO] Export as PDF → jsPDF
  // TODO: [API] middleware.ts — X-API-Key check for B2B API tier
  // TODO: [DATA] Log { topic, source, biasRating, fetchedAt } → dataset product
  // TODO: [PRO] Snapshot history — save past results per topic with timestamps
  // TODO: [V2] Alert system — notify when a topic's coverage shifts significantly
  // TODO: [V2] Fetch trending topics from Grok on page load — replace PRESET_TOPICS

  return (
    <div className="min-h-screen text-white">
      {/* ── LANDING STATE ─────────────────────────────────────── */}
      {!hasResults && !isLoading && (
        <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16">
          <div className="w-full max-w-2xl">
            {/* Wordmark */}
            <div className="text-center mb-10">
              <h1 className="text-5xl font-semibold tracking-tight text-white mb-3">
                PARALLAX
              </h1>
              <p className="text-slate-400 font-mono text-sm tracking-widest">
                SAME EVENT. EVERY ANGLE.
              </p>
            </div>

            {/* Search */}
            <TopicBar onAnalyze={analyze} loading={isLoading} />

            {/* Panel preview descriptions */}
            <div className="mt-10 grid grid-cols-2 gap-6 border-t border-slate-800 pt-8">
              <div>
                <p className="text-xs font-mono tracking-widest text-amber-400 mb-2">BRIEFING</p>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Formal press coverage from across the political spectrum. Each article bias-rated
                  and cited. One truth, many framings.
                </p>
              </div>
              <div>
                <p className="text-xs font-mono tracking-widest text-cyan-400 mb-2 flex items-center gap-2">
                  PULSE
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                </p>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Live X discourse. Breaking signals, official statements, journalist threads,
                  on-the-ground accounts. Right now.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── DASHBOARD STATE ───────────────────────────────────── */}
      {(hasResults || isLoading) && (
        <div className="min-h-screen flex flex-col">
          {/* Header bar */}
          <header className="border-b border-slate-800 px-6 py-4 flex items-center justify-between">
            <button
              onClick={() => {
                setBriefing(null);
                setPulse(null);
                setBriefingError(null);
                setPulseError(null);
                setTopic("");
              }}
              className="text-sm font-semibold tracking-tight text-white hover:text-amber-400 transition-colors"
            >
              PARALLAX
            </button>
            <p className="text-xs font-mono text-slate-500 tracking-widest hidden sm:block">
              SAME EVENT. EVERY ANGLE.
            </p>
            {topic && (
              <button
                onClick={isWatched ? () => removeFromWatchlist(topic) : saveToWatchlist}
                className={`text-xs font-mono tracking-wider transition-colors ${
                  isWatched
                    ? "text-amber-400 hover:text-slate-400"
                    : "text-slate-500 hover:text-amber-400"
                }`}
                title={isWatched ? "Remove from tracked" : "Track this topic"}
              >
                {isWatched ? "★ TRACKED" : "☆ TRACK"}
              </button>
            )}
          </header>

          <div className="flex-1 px-4 sm:px-6 py-6 max-w-screen-2xl mx-auto w-full">
            {/* Topic search bar */}
            <TopicBar onAnalyze={analyze} loading={isLoading} />

            {/* Active topic label */}
            {topic && (
              <p className="text-xs font-mono text-slate-500 tracking-widest mb-4">
                TOPIC: <span className="text-slate-300">{topic.toUpperCase()}</span>
              </p>
            )}

            {/* Situation summary */}
            <SituationSummary briefing={briefing} pulse={pulse} />

            {/* Mobile tabs */}
            <PanelTabs activeTab={activeTab} onTabChange={setActiveTab} />

            {/* Main content grid */}
            <div className="grid grid-cols-1 md:grid-cols-[1fr_1px_1fr] xl:grid-cols-[1fr_1px_1fr_200px] gap-0">
              {/* Briefing panel — hidden on mobile when pulse tab active */}
              <div className={`pb-8 md:pr-6 ${activeTab === "pulse" ? "hidden md:block" : ""}`}>
                <BriefingPanel
                  briefing={briefing}
                  loading={briefingLoading}
                  error={briefingError}
                />
              </div>

              {/* Vertical divider — desktop only */}
              <div className="hidden md:block bg-slate-800 self-stretch" />

              {/* Pulse panel — hidden on mobile when briefing tab active */}
              <div className={`pb-8 md:pl-6 ${activeTab === "briefing" ? "hidden md:block" : ""}`}>
                <PulsePanel
                  pulse={pulse}
                  loading={pulseLoading}
                  error={pulseError}
                />
              </div>

              {/* Watchlist sidebar — desktop only */}
              <div className="hidden xl:block pl-6 border-l border-slate-800">
                <WatchlistPanel
                  watchlist={watchlist}
                  activeTopic={topic}
                  onSelect={analyze}
                  onRemove={removeFromWatchlist}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
