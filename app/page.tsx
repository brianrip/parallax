"use client";

import { useState, useRef, useEffect } from "react";
import { Bookmark, BookmarkCheck, Menu, X } from "lucide-react";
import TopicBar from "@/components/TopicBar";
import SituationSummary from "@/components/SituationSummary";
import BriefingPanel from "@/components/BriefingPanel";
import PulsePanel from "@/components/PulsePanel";
import WatchlistPanel from "@/components/WatchlistPanel";
import PanelTabs from "@/components/PanelTabs";
import HistoryPanel from "@/components/HistoryPanel";
import ParallaxLogo from "@/components/ParallaxLogo";
import type { BriefingResponse, PulseResponse, WatchlistItem, HistoryItem } from "@/lib/types";

const WATCHLIST_KEY = "parallax_watchlist";
const HISTORY_KEY = "parallax_history";
const MAX_WATCHLIST = 10;
const MAX_HISTORY = 20;

export default function Home() {
  const [topic, setTopic] = useState("");
  const [briefing, setBriefing] = useState<BriefingResponse | null>(null);
  const [pulse, setPulse] = useState<PulseResponse | null>(null);
  const [briefingLoading, setBriefingLoading] = useState(false);
  const [pulseLoading, setPulseLoading] = useState(false);
  const [briefingError, setBriefingError] = useState<string | null>(null);
  const [pulseError, setPulseError] = useState<string | null>(null);
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [activeTab, setActiveTab] = useState<"briefing" | "pulse" | "tracked">("briefing");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const hasResults = briefing || pulse;
  const isLoading = briefingLoading || pulseLoading;

  useEffect(() => {
    try {
      const stored = localStorage.getItem(WATCHLIST_KEY);
      if (stored) setWatchlist(JSON.parse(stored));
    } catch { /* ignore */ }
    try {
      const stored = localStorage.getItem(HISTORY_KEY);
      if (stored) setHistory(JSON.parse(stored));
    } catch { /* ignore */ }
  }, []);

  const persistWatchlist = (next: WatchlistItem[]) => {
    setWatchlist(next);
    localStorage.setItem(WATCHLIST_KEY, JSON.stringify(next));
  };

  const persistHistory = (next: HistoryItem[]) => {
    setHistory(next);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
  };

  const addToHistory = (topicInput: string) => {
    const next: HistoryItem[] = [
      { topic: topicInput, queriedAt: new Date().toISOString() },
      ...history.filter((h) => h.topic !== topicInput),
    ].slice(0, MAX_HISTORY);
    persistHistory(next);
  };

  const clearHistory = () => persistHistory([]);

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
    setMobileMenuOpen(false);

    addToHistory(topicInput);

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

  const goHome = () => {
    setBriefing(null);
    setPulse(null);
    setBriefingError(null);
    setPulseError(null);
    setTopic("");
    setActiveTab("briefing");
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
    <div className="min-h-screen min-h-[100dvh] text-[var(--color-text-primary)]">
      {/* ── LANDING STATE ─────────────────────────────────────── */}
      {!hasResults && !isLoading && (
        <div className="min-h-screen min-h-[100dvh] flex flex-col items-center justify-center px-6 py-12 sm:py-16">
          <div className="w-full max-w-2xl">
            {/* Logo + Wordmark */}
            <div className="text-center mb-8 sm:mb-10">
              <div className="flex justify-center mb-4">
                <ParallaxLogo size={64} />
              </div>
              <h1
                className="text-[var(--color-text-primary)] mb-3"
                style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 5vw, 42px)", fontWeight: 800, letterSpacing: "-0.02em" }}
              >
                Parallax
              </h1>
              <p
                className="text-[var(--color-text-tertiary)] uppercase"
                style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.15em" }}
              >
                Same event. Every angle.
              </p>
            </div>

            {/* Search */}
            <TopicBar onAnalyze={analyze} loading={isLoading} />

            {/* History */}
            {history.length > 0 && (
              <div className="mt-4">
                <HistoryPanel history={history} onSelect={analyze} onClear={clearHistory} />
              </div>
            )}

            {/* Panel preview */}
            <div className="mt-8 sm:mt-10 grid grid-cols-2 gap-6 border-t border-[var(--color-border)] pt-6 sm:pt-8">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-block w-0.5 h-3 bg-[var(--color-amber)]" />
                  <span
                    className="uppercase text-[var(--color-amber)]"
                    style={{ fontFamily: "var(--font-mono)", fontSize: "10px", fontWeight: 500, letterSpacing: "0.2em" }}
                  >
                    Briefing
                  </span>
                </div>
                <p
                  className="text-[var(--color-text-tertiary)] leading-relaxed"
                  style={{ fontFamily: "var(--font-body)", fontSize: "12px" }}
                >
                  Formal press coverage from across the political spectrum. Each article bias-rated
                  and cited. One truth, many framings.
                </p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-block w-0.5 h-3 bg-[var(--color-amber)]" />
                  <span
                    className="uppercase text-[var(--color-amber)] inline-flex items-center gap-1.5"
                    style={{ fontFamily: "var(--font-mono)", fontSize: "10px", fontWeight: 500, letterSpacing: "0.2em" }}
                  >
                    Pulse
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--sentiment-hopeful)] animate-pulse" />
                  </span>
                </div>
                <p
                  className="text-[var(--color-text-tertiary)] leading-relaxed"
                  style={{ fontFamily: "var(--font-body)", fontSize: "12px" }}
                >
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
        <div className="min-h-screen min-h-[100dvh] flex flex-col">
          {/* Sticky header */}
          <header
            className="sticky top-0 z-30 border-b border-[var(--color-border)]
              px-4 sm:px-10 py-3 sm:py-4 flex items-center justify-between gap-2"
            style={{ background: "var(--color-surface)" }}
          >
            <button
              onClick={goHome}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity shrink-0"
            >
              <ParallaxLogo size={32} />
              <span
                className="hidden sm:inline text-[var(--color-text-primary)]"
                style={{ fontFamily: "var(--font-display)", fontSize: "18px", fontWeight: 800, letterSpacing: "-0.02em" }}
              >
                Parallax
              </span>
            </button>
            <p
              className="text-[var(--color-text-tertiary)] hidden md:block uppercase"
              style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.15em" }}
            >
              Same event. Every angle.
            </p>
            <div className="flex items-center gap-3">
              {topic && (
                <button
                  onClick={isWatched ? () => removeFromWatchlist(topic) : saveToWatchlist}
                  className={`transition-colors inline-flex items-center gap-1.5 ${
                    isWatched
                      ? "text-[var(--color-amber)] hover:text-[var(--color-text-secondary)]"
                      : "text-[var(--color-text-tertiary)] hover:text-[var(--color-amber)]"
                  }`}
                  style={{ fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: "0.05em" }}
                  title={isWatched ? "Remove from tracked" : "Track this topic"}
                >
                  {isWatched ? <BookmarkCheck size={14} strokeWidth={1.5} /> : <Bookmark size={14} strokeWidth={1.5} />}
                  <span className="hidden sm:inline">{isWatched ? "TRACKED" : "TRACK"}</span>
                </button>
              )}
              <button
                onClick={() => setMobileMenuOpen((v) => !v)}
                className="xl:hidden text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)]
                  transition-colors border border-[var(--color-border)] p-2"
                aria-label="Menu"
              >
                {mobileMenuOpen ? <X size={16} strokeWidth={1.5} /> : <Menu size={16} strokeWidth={1.5} />}
              </button>
            </div>
          </header>

          {/* Mobile slide-down panel */}
          {mobileMenuOpen && (
            <div
              className="xl:hidden border-b border-[var(--color-border)] px-4 py-4 space-y-4 z-20"
              style={{ background: "var(--color-surface)" }}
            >
              <WatchlistPanel
                watchlist={watchlist}
                activeTopic={topic}
                onSelect={(t) => { analyze(t); setMobileMenuOpen(false); }}
                onRemove={removeFromWatchlist}
              />
              {history.length > 0 && (
                <HistoryPanel
                  history={history}
                  onSelect={(t) => { analyze(t); setMobileMenuOpen(false); }}
                  onClear={clearHistory}
                />
              )}
            </div>
          )}

          <div className="flex-1 px-4 sm:px-10 py-6 max-w-[1400px] mx-auto w-full">
            <TopicBar onAnalyze={analyze} loading={isLoading} />

            {topic && (
              <p
                className="text-[var(--color-text-tertiary)] mb-4 uppercase"
                style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.2em" }}
              >
                Topic: <span className="text-[var(--color-text-secondary)]">{topic.toUpperCase()}</span>
              </p>
            )}

            <SituationSummary briefing={briefing} pulse={pulse} />
            <PanelTabs activeTab={activeTab} onTabChange={setActiveTab} />

            <div className="grid grid-cols-1 md:grid-cols-[1fr_1px_1fr] xl:grid-cols-[1fr_1px_1fr_220px] gap-0">
              <div className={`pb-6 sm:pb-8 md:pr-6 ${activeTab !== "briefing" ? "hidden md:block" : ""}`}>
                <BriefingPanel briefing={briefing} loading={briefingLoading} error={briefingError} />
              </div>

              <div className="hidden md:block bg-[var(--color-border)] self-stretch" />

              <div className={`pb-6 sm:pb-8 md:pl-6 ${activeTab !== "pulse" ? "hidden md:block" : ""}`}>
                <PulsePanel pulse={pulse} loading={pulseLoading} error={pulseError} />
              </div>

              <div className="hidden xl:block pl-6 border-l border-[var(--color-border)] space-y-6">
                <WatchlistPanel watchlist={watchlist} activeTopic={topic} onSelect={analyze} onRemove={removeFromWatchlist} />
                {history.length > 0 && (
                  <HistoryPanel history={history} onSelect={analyze} onClear={clearHistory} />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
