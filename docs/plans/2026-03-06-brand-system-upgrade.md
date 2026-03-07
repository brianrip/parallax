# Brand System Upgrade Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Migrate the entire Parallax UI from generic Tailwind defaults to the custom brand system defined in BRAND.md — new fonts, colors, logo, icons, motion, and component styling.

**Architecture:** Foundation-first approach. Set up CSS variables + Tailwind v4 `@theme` tokens, swap fonts, then update every component to use the new design tokens. No business logic changes.

**Tech Stack:** Next.js 16 + Tailwind v4 (CSS-based config via `@theme`), next/font/google, lucide-react

---

### Task 1: Install lucide-react

**Files:**
- Modify: `package.json`

**Step 1: Install the dependency**

Run: `npm install lucide-react`
Expected: Package added to dependencies

**Step 2: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add lucide-react for brand icon system"
```

---

### Task 2: Foundation — globals.css

**Files:**
- Modify: `app/globals.css`

**Step 1: Replace globals.css with brand design tokens**

Replace the entire file with:

```css
@import "tailwindcss";

:root {
  /* Base */
  --color-base:           #050810;
  --color-surface:        #0D1117;
  --color-surface-raised: #131920;
  --color-border:         #1E2530;
  --color-border-subtle:  #151C26;

  /* Accent */
  --color-amber:          #F5A623;
  --color-amber-dim:      #C47D10;
  --color-amber-glow:     rgba(245, 166, 35, 0.08);

  /* Text */
  --color-text-primary:   #F0F4FF;
  --color-text-secondary: #8892A4;
  --color-text-tertiary:  #4A5568;

  /* Bias */
  --bias-left:            #1D4ED8;
  --bias-center-left:     #0F766E;
  --bias-center:          #475569;
  --bias-center-right:    #C2410C;
  --bias-right:           #B91C1C;
  --bias-state:           #6D28D9;

  /* Sentiment */
  --sentiment-alarming:   #F87171;
  --sentiment-cautious:   #FB923C;
  --sentiment-neutral:    #8892A4;
  --sentiment-hopeful:    #2DD4BF;

  /* Verification */
  --verify-unverified-bg: rgba(185, 28, 28, 0.15);
  --verify-unverified:    #F87171;
  --verify-plausible-bg:  rgba(194, 65, 12, 0.15);
  --verify-plausible:     #FB923C;
  --verify-confirmed-bg:  rgba(15, 118, 110, 0.15);
  --verify-confirmed:     #2DD4BF;

  /* Typography */
  --font-display: var(--font-syne), sans-serif;
  --font-mono:    var(--font-dm-mono), monospace;
  --font-body:    var(--font-ibm-plex-sans), sans-serif;

  /* Spacing */
  --space-1: 4px;  --space-2: 8px;  --space-3: 12px;
  --space-4: 16px; --space-5: 20px; --space-6: 24px;
  --space-8: 32px; --space-10: 40px; --space-12: 48px;
  --space-16: 64px;
}

@theme inline {
  --color-base: var(--color-base);
  --color-surface: var(--color-surface);
  --color-surface-raised: var(--color-surface-raised);
  --color-brand-border: var(--color-border);
  --color-brand-border-subtle: var(--color-border-subtle);
  --color-amber: var(--color-amber);
  --color-amber-dim: var(--color-amber-dim);
  --color-amber-glow: var(--color-amber-glow);
  --color-text-primary: var(--color-text-primary);
  --color-text-secondary: var(--color-text-secondary);
  --color-text-tertiary: var(--color-text-tertiary);
  --color-bias-left: var(--bias-left);
  --color-bias-center-left: var(--bias-center-left);
  --color-bias-center: var(--bias-center);
  --color-bias-center-right: var(--bias-center-right);
  --color-bias-right: var(--bias-right);
  --color-bias-state: var(--bias-state);
  --color-sentiment-alarming: var(--sentiment-alarming);
  --color-sentiment-cautious: var(--sentiment-cautious);
  --color-sentiment-neutral: var(--sentiment-neutral);
  --color-sentiment-hopeful: var(--sentiment-hopeful);
  --font-sans: var(--font-body);
  --font-mono: var(--font-mono);
  --font-display: var(--font-display);
}

body {
  background: var(--color-base);
  color: var(--color-text-primary);
  font-family: var(--font-body);
  background-image: radial-gradient(
    circle,
    rgba(148, 163, 184, 0.06) 1px,
    transparent 1px
  );
  background-size: 32px 32px;
  -webkit-tap-highlight-color: transparent;
}

/* Hide scrollbar on chip rows */
.scrollbar-none {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-none::-webkit-scrollbar {
  display: none;
}

/* ── Animations ────────────────────────────────────── */

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes shimmer {
  0%   { background-position: -400px 0; }
  100% { background-position:  400px 0; }
}

@keyframes drawLine {
  to { stroke-dashoffset: 0; }
}

@keyframes fadeIn {
  to { opacity: 1; }
}

.animate-fade-up {
  animation: fadeUp 300ms ease forwards;
  opacity: 0;
}

.skeleton-shimmer {
  background: linear-gradient(
    90deg,
    var(--color-surface) 25%,
    var(--color-surface-raised) 50%,
    var(--color-surface) 75%
  );
  background-size: 400px 100%;
  animation: shimmer 1.4s ease infinite;
}
```

**Step 2: Verify dev server starts**

Run: `npm run dev`
Expected: No CSS errors, page loads with new base color (#050810)

**Step 3: Commit**

```bash
git add app/globals.css
git commit -m "feat: brand design tokens and animations in globals.css"
```

---

### Task 3: Foundation — layout.tsx (fonts)

**Files:**
- Modify: `app/layout.tsx`

**Step 1: Replace layout.tsx with new font loading**

Replace the entire file with:

```tsx
import type { Metadata, Viewport } from "next";
import { Syne, DM_Mono, IBM_Plex_Sans } from "next/font/google";
import "./globals.css";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["700", "800"],
  display: "swap",
});

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-ibm-plex-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Parallax — Same event. Every angle.",
  description:
    "Dual-source news intelligence. Formal journalism bias-rated across the spectrum. Live X discourse and breaking signals. Side by side.",
  appleWebApp: {
    capable: true,
    title: "Parallax",
    statusBarStyle: "black-translucent",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#050810",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${syne.variable} ${dmMono.variable} ${ibmPlexSans.variable} antialiased min-h-screen`}
        style={{ fontFamily: "var(--font-body)" }}
      >
        {children}
      </body>
    </html>
  );
}
```

**Step 2: Verify fonts load**

Run: `npm run dev` and check browser — headings should use Syne, body IBM Plex Sans, labels DM Mono.

**Step 3: Commit**

```bash
git add app/layout.tsx
git commit -m "feat: swap fonts to Syne + DM Mono + IBM Plex Sans via next/font"
```

---

### Task 4: Logo — ParallaxLogo.tsx (Prism Mark)

**Files:**
- Modify: `components/ParallaxLogo.tsx`

**Step 1: Replace with prism mark + draw-on animation**

Replace the entire file with:

```tsx
export default function ParallaxLogo({ size = 40 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 44 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Input line */}
      <line
        x1="4" y1="22" x2="18" y2="22"
        stroke="#F5A623" strokeWidth="2.5" strokeLinecap="round"
        className="[stroke-dasharray:20] [stroke-dashoffset:20] [animation:drawLine_300ms_ease_200ms_forwards]"
      />
      {/* Origin point */}
      <circle
        cx="18" cy="22" r="2.5" fill="#F5A623"
        className="opacity-0 [animation:fadeIn_150ms_ease_500ms_forwards]"
      />
      {/* Output spectrum */}
      <line
        x1="18" y1="22" x2="40" y2="8"
        stroke="#F0F4FF" strokeWidth="2" strokeLinecap="round" opacity="0.95"
        className="[stroke-dasharray:32] [stroke-dashoffset:32] [animation:drawLine_220ms_ease_520ms_forwards]"
      />
      <line
        x1="18" y1="22" x2="40" y2="14"
        stroke="#F0F4FF" strokeWidth="2" strokeLinecap="round" opacity="0.80"
        className="[stroke-dasharray:28] [stroke-dashoffset:28] [animation:drawLine_220ms_ease_560ms_forwards]"
      />
      <line
        x1="18" y1="22" x2="40" y2="22"
        stroke="#F5A623" strokeWidth="2.5" strokeLinecap="round"
        className="[stroke-dasharray:24] [stroke-dashoffset:24] [animation:drawLine_220ms_ease_600ms_forwards]"
      />
      <line
        x1="18" y1="22" x2="40" y2="30"
        stroke="#F0F4FF" strokeWidth="2" strokeLinecap="round" opacity="0.80"
        className="[stroke-dasharray:28] [stroke-dashoffset:28] [animation:drawLine_220ms_ease_640ms_forwards]"
      />
      <line
        x1="18" y1="22" x2="40" y2="36"
        stroke="#F0F4FF" strokeWidth="2" strokeLinecap="round" opacity="0.95"
        className="[stroke-dasharray:32] [stroke-dashoffset:32] [animation:drawLine_220ms_ease_680ms_forwards]"
      />
    </svg>
  );
}
```

Note: The arbitrary value animation syntax with underscores may not work in Tailwind v4. If it doesn't, use inline `style` attributes instead:

```tsx
export default function ParallaxLogo({ size = 40 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 44 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <line
        x1="4" y1="22" x2="18" y2="22"
        stroke="#F5A623" strokeWidth="2.5" strokeLinecap="round"
        style={{ strokeDasharray: 20, strokeDashoffset: 20, animation: "drawLine 300ms ease 200ms forwards" }}
      />
      <circle
        cx="18" cy="22" r="2.5" fill="#F5A623"
        style={{ opacity: 0, animation: "fadeIn 150ms ease 500ms forwards" }}
      />
      <line
        x1="18" y1="22" x2="40" y2="8"
        stroke="#F0F4FF" strokeWidth="2" strokeLinecap="round" opacity="0.95"
        style={{ strokeDasharray: 32, strokeDashoffset: 32, animation: "drawLine 220ms ease 520ms forwards" }}
      />
      <line
        x1="18" y1="22" x2="40" y2="14"
        stroke="#F0F4FF" strokeWidth="2" strokeLinecap="round" opacity="0.80"
        style={{ strokeDasharray: 28, strokeDashoffset: 28, animation: "drawLine 220ms ease 560ms forwards" }}
      />
      <line
        x1="18" y1="22" x2="40" y2="22"
        stroke="#F5A623" strokeWidth="2.5" strokeLinecap="round"
        style={{ strokeDasharray: 24, strokeDashoffset: 24, animation: "drawLine 220ms ease 600ms forwards" }}
      />
      <line
        x1="18" y1="22" x2="40" y2="30"
        stroke="#F0F4FF" strokeWidth="2" strokeLinecap="round" opacity="0.80"
        style={{ strokeDasharray: 28, strokeDashoffset: 28, animation: "drawLine 220ms ease 640ms forwards" }}
      />
      <line
        x1="18" y1="22" x2="40" y2="36"
        stroke="#F0F4FF" strokeWidth="2" strokeLinecap="round" opacity="0.95"
        style={{ strokeDasharray: 32, strokeDashoffset: 32, animation: "drawLine 220ms ease 680ms forwards" }}
      />
    </svg>
  );
}
```

**Step 2: Verify logo renders**

Check dev server — prism mark should appear with draw-on animation on load.

**Step 3: Commit**

```bash
git add components/ParallaxLogo.tsx
git commit -m "feat: replace logo with prism mark SVG + draw-on animation"
```

---

### Task 5: Design Tokens — lib/bias.ts

**Files:**
- Modify: `lib/bias.ts`

**Step 1: Replace with brand hex values and Lucide icon mapping**

Replace the entire file with:

```typescript
import type { BiasRating, SignalType } from "./types";

// Bias badge background colors — inline style hex values
export const BIAS_COLORS: Record<BiasRating, string> = {
  "Left":             "#1D4ED8",
  "Center-Left":      "#0F766E",
  "Center":           "#475569",
  "Center-Right":     "#C2410C",
  "Right":            "#B91C1C",
  "State-Affiliated": "#6D28D9",
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

// Signal type pill colors — Tailwind classes
export const SIGNAL_TYPE_COLORS: Record<SignalType, string> = {
  breaking:    "text-red-400 bg-red-950 border-red-800",
  official:    "text-sky-400 bg-sky-950 border-sky-800",
  journalist:  "text-amber-400 bg-amber-950 border-amber-800",
  discourse:   "text-slate-300 bg-slate-800 border-slate-700",
  contrarian:  "text-violet-400 bg-violet-950 border-violet-800",
  ontheground: "text-teal-400 bg-teal-950 border-teal-800",
};

// Lucide icon names per signal type (import these from lucide-react in component)
export const SIGNAL_TYPE_ICONS: Record<SignalType, string> = {
  breaking:    "Zap",
  official:    "Landmark",
  journalist:  "Newspaper",
  discourse:   "MessageSquare",
  contrarian:  "ArrowLeftRight",
  ontheground: "MapPin",
};

// Sentiment text colors
export const SENTIMENT_COLORS: Record<string, string> = {
  alarming: "text-[var(--sentiment-alarming)]",
  cautious: "text-[var(--sentiment-cautious)]",
  neutral:  "text-[var(--sentiment-neutral)]",
  hopeful:  "text-[var(--sentiment-hopeful)]",
};

// Verification status badge styles
export const VERIFICATION_STYLES: Record<string, { bg: string; text: string }> = {
  unverified: { bg: "rgba(185,28,28,0.15)", text: "#F87171" },
  plausible:  { bg: "rgba(194,65,12,0.15)", text: "#FB923C" },
  confirmed:  { bg: "rgba(15,118,110,0.15)", text: "#2DD4BF" },
};
```

**Step 2: Commit**

```bash
git add lib/bias.ts
git commit -m "feat: brand hex values for bias/signal/sentiment tokens"
```

---

### Task 6: Component — TopicBar.tsx

**Files:**
- Modify: `components/TopicBar.tsx`

**Step 1: Update to brand typography and colors**

Replace the entire file with:

```tsx
"use client";

import { useState } from "react";
import { PRESET_TOPICS } from "@/lib/topics";

interface TopicBarProps {
  onAnalyze: (topic: string) => void;
  loading: boolean;
}

export default function TopicBar({ onAnalyze, loading }: TopicBarProps) {
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (trimmed) {
      onAnalyze(trimmed);
    }
  };

  const handleChip = (topic: string) => {
    setInput(topic);
    onAnalyze(topic);
  };

  return (
    <div className="mb-6">
      <form onSubmit={handleSubmit} className="flex gap-0 mb-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter any topic — Iran nuclear deal, Gaza ceasefire, Taiwan..."
          maxLength={200}
          disabled={loading}
          className="flex-1 bg-[var(--color-surface)] border border-[var(--color-border)]
            border-r-0 focus:border-[var(--color-amber)] focus:outline-none
            text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)]
            text-sm px-4 py-3 transition-colors disabled:opacity-50"
          style={{ fontFamily: "var(--font-body)" }}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="bg-[var(--color-amber)] text-[#050810] font-medium text-sm
            px-6 py-3 hover:bg-[var(--color-amber-dim)] transition-colors
            disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
          style={{ fontFamily: "var(--font-body)", letterSpacing: "0.02em" }}
        >
          {loading ? "..." : "Analyze →"}
        </button>
      </form>

      {/* Preset chips */}
      <div className="flex gap-px overflow-x-auto pb-1 scrollbar-none">
        {PRESET_TOPICS.map((topic) => (
          <button
            key={topic}
            onClick={() => handleChip(topic)}
            disabled={loading}
            className="border border-[var(--color-border)] text-[var(--color-text-secondary)]
              bg-[var(--color-base)]
              hover:border-[var(--color-amber)] hover:text-[var(--color-amber)]
              hover:bg-[var(--color-amber-glow)]
              px-3.5 py-1.5 shrink-0 transition-all duration-120
              disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ fontFamily: "var(--font-mono)", fontSize: "11px", fontWeight: 500, letterSpacing: "0.05em" }}
          >
            {topic}
          </button>
        ))}
      </div>
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add components/TopicBar.tsx
git commit -m "feat: TopicBar brand typography, flush chip layout, new button style"
```

---

### Task 7: Component — SituationSummary.tsx

**Files:**
- Modify: `components/SituationSummary.tsx`

**Step 1: Update to brand section label style**

Replace the entire file with:

```tsx
import type { BriefingResponse, PulseResponse } from "@/lib/types";

interface SituationSummaryProps {
  briefing: BriefingResponse | null;
  pulse: PulseResponse | null;
}

export default function SituationSummary({ briefing, pulse }: SituationSummaryProps) {
  if (briefing) {
    return (
      <div
        className="bg-[var(--color-surface)] border border-[var(--color-border)]
          border-l-2 border-l-[var(--color-amber)] px-6 py-5 mb-6"
      >
        <div className="flex items-center gap-2 mb-3">
          <span
            className="inline-block w-0.5 h-3 bg-[var(--color-amber)]"
          />
          <span
            className="uppercase text-[var(--color-amber)]"
            style={{ fontFamily: "var(--font-mono)", fontSize: "10px", fontWeight: 500, letterSpacing: "0.2em" }}
          >
            What&apos;s Actually Happening
          </span>
        </div>
        <p
          className="text-[var(--color-text-secondary)] leading-[1.7] max-w-[900px]"
          style={{ fontFamily: "var(--font-body)", fontSize: "14px" }}
        >
          {briefing.situationSummary}
        </p>
      </div>
    );
  }

  if (pulse) {
    return (
      <div
        className="bg-[var(--color-surface)] border border-[var(--color-border)]
          border-l-2 border-l-[var(--sentiment-hopeful)] px-6 py-5 mb-6"
      >
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-block w-0.5 h-3 bg-[var(--sentiment-hopeful)]" />
          <span
            className="uppercase text-[var(--color-amber)]"
            style={{ fontFamily: "var(--font-mono)", fontSize: "10px", fontWeight: 500, letterSpacing: "0.2em" }}
          >
            Discourse Snapshot — Briefing Unavailable
          </span>
        </div>
        <p
          className="text-[var(--color-text-secondary)] leading-[1.7]"
          style={{ fontFamily: "var(--font-body)", fontSize: "14px" }}
        >
          {pulse.discourseSnapshot}
        </p>
      </div>
    );
  }

  return null;
}
```

**Step 2: Commit**

```bash
git add components/SituationSummary.tsx
git commit -m "feat: SituationSummary brand section label + card styling"
```

---

### Task 8: Component — BiasLegend.tsx

**Files:**
- Modify: `components/BiasLegend.tsx`

**Step 1: Update to brand hex dots and DM Mono labels**

Replace the entire file with:

```tsx
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
    <div className="flex flex-wrap items-center gap-2 mb-4">
      {BIAS_LABELS.map((rating) => (
        <div key={rating} className="flex items-center gap-1.5">
          <span
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: BIAS_COLORS[rating] }}
          />
          <span
            className="text-[var(--color-text-tertiary)]"
            style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.05em" }}
          >
            {rating}
          </span>
        </div>
      ))}
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add components/BiasLegend.tsx
git commit -m "feat: BiasLegend brand hex dots + DM Mono labels"
```

---

### Task 9: Component — ArticleCard.tsx

**Files:**
- Modify: `components/ArticleCard.tsx`

**Step 1: Update to brand card styling with Lucide icon and pill badges**

Replace the entire file with:

```tsx
"use client";

import { useState } from "react";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import { BIAS_COLORS } from "@/lib/bias";
import type { Article } from "@/lib/types";

interface ArticleCardProps {
  article: Article;
  index?: number;
}

export default function ArticleCard({ article, index = 0 }: ArticleCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={`group bg-[var(--color-base)] border border-[var(--color-border)] p-5 cursor-pointer
        transition-all duration-150
        hover:[border-color:rgba(245,166,35,0.4)] hover:[box-shadow:0_0_0_1px_rgba(245,166,35,0.08)]
        ${expanded ? "border-l-2 border-l-[var(--color-amber)]" : ""}`}
      style={{ animationDelay: `${index * 50}ms` }}
      onClick={() => setExpanded((v) => !v)}
    >
      {/* Source + bias badge */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <span
          className="text-[var(--color-text-secondary)] uppercase truncate"
          style={{ fontFamily: "var(--font-mono)", fontSize: "11px", fontWeight: 500, letterSpacing: "0.05em" }}
        >
          {article.source}
        </span>
        <span
          className="shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-[#F0F4FF] whitespace-nowrap"
          style={{
            backgroundColor: BIAS_COLORS[article.biasRating],
            fontFamily: "var(--font-mono)",
            fontSize: "10px",
            fontWeight: 500,
            letterSpacing: "0.1em",
          }}
        >
          {article.biasRating.toUpperCase()}
        </span>
      </div>

      {/* Headline */}
      <h3
        className="text-[var(--color-text-primary)] leading-snug mb-1.5"
        style={{ fontFamily: "var(--font-body)", fontSize: "15px", fontWeight: 600, letterSpacing: "-0.01em" }}
      >
        {article.headline}
      </h3>

      {/* Framing */}
      <p
        className="text-[var(--color-text-tertiary)] italic mb-2 leading-relaxed"
        style={{ fontFamily: "var(--font-body)", fontSize: "12px" }}
      >
        {article.framing}
      </p>

      {/* Summary */}
      <p
        className={`text-[var(--color-text-secondary)] leading-relaxed ${expanded ? "" : "line-clamp-3"}`}
        style={{ fontFamily: "var(--font-body)", fontSize: "13px" }}
      >
        {article.summary}
      </p>

      {/* Expanded bias explanation */}
      {expanded && (
        <div className="mt-3 pt-3 border-t border-[var(--color-border-subtle)]">
          <p
            className="mb-1"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "10px",
              fontWeight: 500,
              letterSpacing: "0.2em",
              color: BIAS_COLORS[article.biasRating],
            }}
          >
            BIAS ANALYSIS
          </p>
          <p
            className="text-[var(--color-text-secondary)] leading-relaxed"
            style={{ fontFamily: "var(--font-body)", fontSize: "12px" }}
          >
            {article.biasExplanation}
          </p>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-[var(--color-border-subtle)]">
        <span
          className="text-[var(--color-text-tertiary)]"
          style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.05em" }}
        >
          {article.publishedAt}
        </span>
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          title="Link provided by AI — verify before citing"
          className="text-[var(--color-amber)] hover:text-[var(--color-amber-dim)]
            transition-colors inline-flex items-center gap-1"
          style={{ fontFamily: "var(--font-mono)", fontSize: "11px", fontWeight: 500, letterSpacing: "0.05em" }}
          onClick={(e) => e.stopPropagation()}
        >
          Read <ArrowUpRight size={12} strokeWidth={1.5} />
        </a>
      </div>
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add components/ArticleCard.tsx
git commit -m "feat: ArticleCard brand styling + pill badges + Lucide icon"
```

---

### Task 10: Component — PulseItem.tsx

**Files:**
- Modify: `components/PulseItem.tsx`

**Step 1: Update with brand tokens, Lucide icons, and verification styles**

Replace the entire file with:

```tsx
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
        transition-all duration-150 hover:[border-color:rgba(245,166,35,0.3)]"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Type pill + verification badge */}
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

      {/* Source */}
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

      {/* Summary */}
      <p
        className="text-[var(--color-text-secondary)] leading-relaxed mb-3"
        style={{ fontFamily: "var(--font-body)", fontSize: "12px" }}
      >
        {signal.summary}
      </p>

      {/* Footer: sentiment + link */}
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
```

**Step 2: Commit**

```bash
git add components/PulseItem.tsx
git commit -m "feat: PulseItem brand styling + Lucide signal icons + verification badges"
```

---

### Task 11: Component — BriefingPanel.tsx

**Files:**
- Modify: `components/BriefingPanel.tsx`

**Step 1: Update section header to brand amber bar style**

Replace the entire file with:

```tsx
import BiasLegend from "./BiasLegend";
import ArticleCard from "./ArticleCard";
import LoadingSkeleton from "./LoadingSkeleton";
import ErrorState from "./ErrorState";
import type { BriefingResponse } from "@/lib/types";

interface BriefingPanelProps {
  briefing: BriefingResponse | null;
  loading: boolean;
  error: string | null;
}

export default function BriefingPanel({ briefing, loading, error }: BriefingPanelProps) {
  return (
    <div className="min-w-0">
      {/* Section header — amber bar + label */}
      <div className="flex items-center gap-2 mb-4">
        <span className="inline-block w-0.5 h-3 bg-[var(--color-amber)]" />
        <span
          className="uppercase text-[var(--color-amber)]"
          style={{ fontFamily: "var(--font-mono)", fontSize: "10px", fontWeight: 500, letterSpacing: "0.2em" }}
        >
          Briefing
        </span>
      </div>

      {loading && <LoadingSkeleton side="briefing" rows={4} />}
      {error && !loading && <ErrorState message={error} side="briefing" />}

      {briefing && !loading && (
        <>
          <BiasLegend />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0.5">
            {briefing.articles.map((article, i) => (
              <ArticleCard key={i} article={article} index={i} />
            ))}
          </div>
          <p
            className="text-[var(--color-text-tertiary)] mt-4 text-right"
            style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.05em" }}
          >
            {new Date(briefing.fetchedAt).toLocaleTimeString()}
          </p>
        </>
      )}
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add components/BriefingPanel.tsx
git commit -m "feat: BriefingPanel brand section header + 2px grid gap"
```

---

### Task 12: Component — PulsePanel.tsx

**Files:**
- Modify: `components/PulsePanel.tsx`

**Step 1: Update with brand section header and discourse snapshot**

Replace the entire file with:

```tsx
import PulseItem from "./PulseItem";
import LoadingSkeleton from "./LoadingSkeleton";
import ErrorState from "./ErrorState";
import type { PulseResponse } from "@/lib/types";

interface PulsePanelProps {
  pulse: PulseResponse | null;
  loading: boolean;
  error: string | null;
}

export default function PulsePanel({ pulse, loading, error }: PulsePanelProps) {
  return (
    <div className="min-w-0">
      {/* Section header — amber bar + PULSE + LIVE dot */}
      <div className="flex items-center gap-2 mb-4">
        <span className="inline-block w-0.5 h-3 bg-[var(--color-amber)]" />
        <span
          className="uppercase text-[var(--color-amber)]"
          style={{ fontFamily: "var(--font-mono)", fontSize: "10px", fontWeight: 500, letterSpacing: "0.2em" }}
        >
          Pulse
        </span>
        <span className="inline-flex items-center gap-1.5 ml-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--sentiment-hopeful)] animate-pulse" />
          <span
            className="uppercase text-[var(--sentiment-hopeful)]"
            style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.2em" }}
          >
            Live
          </span>
        </span>
      </div>

      {loading && <LoadingSkeleton side="pulse" rows={4} />}
      {error && !loading && <ErrorState message={error} side="pulse" />}

      {pulse && !loading && (
        <>
          {/* Discourse snapshot */}
          <div
            className="bg-[var(--color-surface-raised)] border border-[var(--color-border)]
              border-l-2 border-l-[var(--color-border)] px-4 py-3 mb-4"
          >
            <p
              className="text-[var(--color-text-secondary)] leading-relaxed"
              style={{ fontFamily: "var(--font-body)", fontSize: "12px" }}
            >
              {pulse.discourseSnapshot}
            </p>
          </div>

          <div className="flex flex-col gap-0.5">
            {pulse.signals.map((signal, i) => (
              <PulseItem key={i} signal={signal} index={i} />
            ))}
          </div>

          <p
            className="text-[var(--color-text-tertiary)] mt-4 text-right"
            style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.05em" }}
          >
            {new Date(pulse.fetchedAt).toLocaleTimeString()}
          </p>
        </>
      )}
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add components/PulsePanel.tsx
git commit -m "feat: PulsePanel brand section header + LIVE indicator + discourse snapshot"
```

---

### Task 13: Component — LoadingSkeleton.tsx

**Files:**
- Modify: `components/LoadingSkeleton.tsx`

**Step 1: Update with brand shimmer animation**

Replace the entire file with:

```tsx
type Side = "briefing" | "pulse";

interface LoadingSkeletonProps {
  side: Side;
  rows?: number;
}

export default function LoadingSkeleton({ side, rows = 4 }: LoadingSkeletonProps) {
  const label = side === "briefing" ? "ACCESSING BRIEFING..." : "SCANNING PULSE...";

  return (
    <div className="space-y-4">
      <p
        className="text-[var(--color-text-tertiary)]"
        style={{ fontFamily: "var(--font-mono)", fontSize: "10px", fontWeight: 500, letterSpacing: "0.2em" }}
      >
        {label}
      </p>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="bg-[var(--color-surface)] border border-[var(--color-border)] p-4 space-y-2.5"
        >
          <div className="skeleton-shimmer h-2 rounded-sm w-2/5" />
          <div className="skeleton-shimmer h-3 rounded-sm w-4/5" />
          <div className="skeleton-shimmer h-3 rounded-sm w-full" />
          <div className="skeleton-shimmer h-3 rounded-sm w-5/6" />
        </div>
      ))}
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add components/LoadingSkeleton.tsx
git commit -m "feat: LoadingSkeleton brand shimmer animation"
```

---

### Task 14: Component — ErrorState.tsx

**Files:**
- Modify: `components/ErrorState.tsx`

**Step 1: Update to brand styling**

Replace the entire file with:

```tsx
interface ErrorStateProps {
  message: string;
  side: "briefing" | "pulse";
}

export default function ErrorState({ message, side }: ErrorStateProps) {
  return (
    <div
      className="bg-[var(--color-surface)] border border-[var(--color-border)]
        border-l-2 border-l-[var(--color-amber)] px-5 py-4"
    >
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
```

**Step 2: Commit**

```bash
git add components/ErrorState.tsx
git commit -m "feat: ErrorState brand styling"
```

---

### Task 15: Component — WatchlistPanel.tsx

**Files:**
- Modify: `components/WatchlistPanel.tsx`

**Step 1: Update with brand section label and Lucide icons**

Replace the entire file with:

```tsx
"use client";

import { Bookmark, X } from "lucide-react";
import type { WatchlistItem } from "@/lib/types";

interface WatchlistPanelProps {
  watchlist: WatchlistItem[];
  activeTopic: string;
  onSelect: (topic: string) => void;
  onRemove: (topic: string) => void;
}

export default function WatchlistPanel({
  watchlist,
  activeTopic,
  onSelect,
  onRemove,
}: WatchlistPanelProps) {
  return (
    <div className="min-w-0">
      <div className="flex items-center gap-2 mb-4">
        <span className="inline-block w-0.5 h-3 bg-[var(--color-amber)]" />
        <span
          className="uppercase text-[var(--color-amber)]"
          style={{ fontFamily: "var(--font-mono)", fontSize: "10px", fontWeight: 500, letterSpacing: "0.2em" }}
        >
          Tracked Topics
        </span>
      </div>

      {watchlist.length === 0 ? (
        <p
          className="text-[var(--color-text-tertiary)] text-center py-4"
          style={{ fontFamily: "var(--font-mono)", fontSize: "11px" }}
        >
          No tracked topics.
          <br />
          <Bookmark size={14} strokeWidth={1.5} className="inline-block mt-1 opacity-40" /> Save a result to track it.
        </p>
      ) : (
        <ul className="space-y-px">
          {watchlist.map((item) => (
            <li key={item.topic}>
              <div
                className={`flex items-center justify-between gap-2 px-3 py-2
                  border transition-colors cursor-pointer
                  ${
                    activeTopic === item.topic
                      ? "border-[rgba(245,166,35,0.4)] bg-[var(--color-surface)] text-[var(--color-amber)]"
                      : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-primary)] hover:border-[var(--color-text-tertiary)]"
                  }`}
                onClick={() => onSelect(item.topic)}
              >
                <div className="min-w-0">
                  <p
                    className="truncate"
                    style={{ fontFamily: "var(--font-mono)", fontSize: "11px", fontWeight: 500 }}
                  >
                    {item.topic}
                  </p>
                  {item.lastFetchedAt && (
                    <p
                      className="text-[var(--color-text-tertiary)] mt-0.5"
                      style={{ fontFamily: "var(--font-mono)", fontSize: "10px" }}
                    >
                      {new Date(item.lastFetchedAt).toLocaleTimeString()}
                    </p>
                  )}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemove(item.topic);
                  }}
                  className="shrink-0 text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] transition-colors"
                  title="Remove"
                >
                  <X size={14} strokeWidth={1.5} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add components/WatchlistPanel.tsx
git commit -m "feat: WatchlistPanel brand styling + Lucide icons"
```

---

### Task 16: Component — PanelTabs.tsx

**Files:**
- Modify: `components/PanelTabs.tsx`

**Step 1: Update with brand typography**

Replace the entire file with:

```tsx
"use client";

type ActiveTab = "briefing" | "pulse" | "tracked";

interface PanelTabsProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
}

export default function PanelTabs({ activeTab, onTabChange }: PanelTabsProps) {
  return (
    <div className="flex border-b border-[var(--color-border)] mb-4 sm:mb-6 md:hidden">
      <button
        onClick={() => onTabChange("briefing")}
        className={`flex-1 py-3 uppercase transition-colors
          ${
            activeTab === "briefing"
              ? "text-[var(--color-amber)] border-b-2 border-[var(--color-amber)] -mb-px"
              : "text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)]"
          }`}
        style={{ fontFamily: "var(--font-mono)", fontSize: "10px", fontWeight: 500, letterSpacing: "0.2em" }}
      >
        Briefing
      </button>
      <button
        onClick={() => onTabChange("pulse")}
        className={`flex-1 py-3 uppercase transition-colors flex items-center justify-center gap-2
          ${
            activeTab === "pulse"
              ? "text-[var(--color-amber)] border-b-2 border-[var(--color-amber)] -mb-px"
              : "text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)]"
          }`}
        style={{ fontFamily: "var(--font-mono)", fontSize: "10px", fontWeight: 500, letterSpacing: "0.2em" }}
      >
        Pulse
        <span className="w-1.5 h-1.5 rounded-full bg-[var(--sentiment-hopeful)] animate-pulse" />
      </button>
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add components/PanelTabs.tsx
git commit -m "feat: PanelTabs brand typography + unified amber active state"
```

---

### Task 17: Component — HistoryPanel.tsx

**Files:**
- Modify: `components/HistoryPanel.tsx`

**Step 1: Update with brand styling**

Replace the entire file with:

```tsx
"use client";

import { RefreshCw } from "lucide-react";
import type { HistoryItem } from "@/lib/types";

interface HistoryPanelProps {
  history: HistoryItem[];
  onSelect: (topic: string) => void;
  onClear: () => void;
}

function timeAgo(dateStr: string): string {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function HistoryPanel({ history, onSelect, onClear }: HistoryPanelProps) {
  if (history.length === 0) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="inline-block w-0.5 h-3 bg-[var(--color-amber)]" />
          <span
            className="uppercase text-[var(--color-amber)]"
            style={{ fontFamily: "var(--font-mono)", fontSize: "10px", fontWeight: 500, letterSpacing: "0.2em" }}
          >
            Recent
          </span>
        </div>
        <button
          onClick={onClear}
          className="text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)] transition-colors"
          style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.05em" }}
        >
          CLEAR
        </button>
      </div>
      <div className="flex flex-wrap gap-px">
        {history.map((item, i) => (
          <button
            key={`${item.topic}-${i}`}
            onClick={() => onSelect(item.topic)}
            className="border border-[var(--color-border)] text-[var(--color-text-secondary)]
              bg-[var(--color-surface)]
              hover:border-[var(--color-amber)] hover:text-[var(--color-amber)]
              hover:bg-[var(--color-amber-glow)]
              px-2.5 py-1.5 transition-all flex items-center gap-2"
            style={{ fontFamily: "var(--font-mono)", fontSize: "11px" }}
            title={`Queried ${timeAgo(item.queriedAt)}`}
          >
            <RefreshCw size={10} strokeWidth={1.5} className="opacity-40" />
            <span className="truncate max-w-[140px]">{item.topic}</span>
            <span className="text-[var(--color-text-tertiary)] shrink-0" style={{ fontSize: "10px" }}>
              {timeAgo(item.queriedAt)}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add components/HistoryPanel.tsx
git commit -m "feat: HistoryPanel brand styling + RefreshCw icon"
```

---

### Task 18: Main Page — app/page.tsx

**Files:**
- Modify: `app/page.tsx`

**Step 1: Update landing page, dashboard header, and layout to brand system**

Replace the entire file with:

```tsx
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
              <div className="hidden sm:block">
                <span
                  className="text-[var(--color-text-primary)]"
                  style={{ fontFamily: "var(--font-display)", fontSize: "18px", fontWeight: 800, letterSpacing: "-0.02em" }}
                >
                  Parallax
                </span>
              </div>
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
            <div className="xl:hidden border-b border-[var(--color-border)] px-4 py-4 space-y-4 z-20"
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
```

**Step 2: Verify full app renders**

Run: `npm run dev`
Expected: Landing page shows prism mark, Syne wordmark, new color scheme. All interactions work.

**Step 3: Commit**

```bash
git add app/page.tsx
git commit -m "feat: page.tsx brand overhaul — prism logo, Syne wordmark, Lucide icons, brand tokens"
```

---

### Task 19: Favicon — Prism mark SVG

**Files:**
- Create: `app/icon.svg`

**Step 1: Create the favicon as the prism mark SVG**

Create `app/icon.svg`:

```svg
<svg width="32" height="32" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="44" height="44" fill="#050810"/>
  <line x1="4" y1="22" x2="18" y2="22" stroke="#F5A623" stroke-width="2.5" stroke-linecap="round"/>
  <circle cx="18" cy="22" r="2.5" fill="#F5A623"/>
  <line x1="18" y1="22" x2="40" y2="8"  stroke="#F0F4FF" stroke-width="2" stroke-linecap="round" opacity="0.95"/>
  <line x1="18" y1="22" x2="40" y2="14" stroke="#F0F4FF" stroke-width="2" stroke-linecap="round" opacity="0.80"/>
  <line x1="18" y1="22" x2="40" y2="22" stroke="#F5A623" stroke-width="2.5" stroke-linecap="round"/>
  <line x1="18" y1="22" x2="40" y2="30" stroke="#F0F4FF" stroke-width="2" stroke-linecap="round" opacity="0.80"/>
  <line x1="18" y1="22" x2="40" y2="36" stroke="#F0F4FF" stroke-width="2" stroke-linecap="round" opacity="0.95"/>
</svg>
```

**Step 2: Commit**

```bash
git add app/icon.svg
git commit -m "feat: prism mark favicon"
```

---

### Task 20: Build verification

**Step 1: Run build**

Run: `npm run build`
Expected: Build completes with no errors.

**Step 2: Final commit**

```bash
git add -A
git commit -m "feat: complete brand system upgrade — Parallax v2 visual identity"
```
