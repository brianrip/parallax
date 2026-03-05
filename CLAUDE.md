# Parallax — Full Build Specification

## Concept
Parallax is a dual-source news intelligence dashboard. It shows the same event through two simultaneous lenses:
- **Briefing** (powered by Anthropic + web search): Formal journalism, bias-rated, structured, citable
- **Pulse** (powered by Grok + X/Twitter): Raw discourse, breaking takes, journalist posts, on-the-ground accounts

The name comes from the optical phenomenon where the same object appears different depending on your viewing angle. That's the product.

Tagline: *"Same event. Every angle."*

---

## Stack
- Next.js 14 (App Router, TypeScript)
- Tailwind CSS
- `next/font` — Inter loaded locally via Next.js font optimization (no external request)
- Anthropic SDK (`@anthropic-ai/sdk`) — Briefing layer
- OpenAI SDK (`openai`) with xAI base URL — Pulse layer (Grok)
- No database in v1 — localStorage for watchlist persistence
- Vercel deployment target

---

## Environment Variables
```
ANTHROPIC_API_KEY=
XAI_API_KEY=
```

---

## Project Structure
```
parallax/
├── app/
│   ├── layout.tsx
│   ├── page.tsx                    # Main dashboard
│   └── api/
│       ├── briefing/route.ts       # POST → Anthropic (formal coverage + bias)
│       └── pulse/route.ts          # POST → Grok (X discourse + breaking)
├── components/
│   ├── TopicBar.tsx                # Search + preset chips
│   ├── SituationSummary.tsx        # Neutral "what's happening" card
│   ├── BriefingPanel.tsx           # Wrapper for article cards
│   ├── ArticleCard.tsx             # Individual article with bias badge
│   ├── PulsePanel.tsx              # Grok/X discourse panel
│   ├── PulseItem.tsx               # Individual pulse signal
│   ├── BiasLegend.tsx              # Color key
│   ├── WatchlistPanel.tsx          # Saved topics (localStorage)
│   ├── PanelTabs.tsx               # Mobile tab switcher (Briefing / Pulse)
│   ├── LoadingSkeleton.tsx
│   └── ErrorState.tsx
├── lib/
│   ├── types.ts
│   ├── topics.ts                   # Configurable preset topic chips
│   ├── anthropic-prompt.ts         # Briefing system prompt
│   ├── grok-prompt.ts              # Pulse system prompt
│   └── bias.ts                     # Bias color/label helpers
├── .env                     # gitignored
├── .env.example
├── PLAN.md
└── README.md
```

---

## Core Types (`lib/types.ts`)
```typescript
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
  summary: string;           // 2-3 sentence neutral summary
  biasRating: BiasRating;
  biasExplanation: string;   // Why this rating — cite specific framing
  framing: string;           // The angle/spin in one sentence
}

export interface BriefingResponse {
  topic: string;
  situationSummary: string;  // 3-4 sentence neutral intelligence briefing
  articles: Article[];
  fetchedAt: string;
}

// Grok/X pulse types
export type SignalType =
  | "breaking"       // Unconfirmed breaking development
  | "official"       // Statement from government/institution
  | "journalist"     // Notable journalist take or thread
  | "discourse"      // Dominant narrative or debate angle
  | "contrarian"     // Pushback or minority view getting traction
  | "ontheground";   // Eyewitness / local account

export interface PulseSignal {
  type: SignalType;
  summary: string;          // 1-2 sentence description of the signal
  sourceHandle?: string;    // @handle if from a notable account
  sourceDescription: string; // e.g. "BBC Middle East correspondent" or "Trending hashtag"
  sentiment: "alarming" | "cautious" | "neutral" | "hopeful";
  verificationStatus: "unverified" | "plausible" | "confirmed";
  url?: string;
}

export interface PulseResponse {
  topic: string;
  discourseSnapshot: string;  // 2-3 sentence summary of what X is saying overall
  signals: PulseSignal[];
  fetchedAt: string;
}

export interface WatchlistItem {
  topic: string;
  addedAt: string;
  lastFetchedAt?: string;    // Updated each time the topic is re-analyzed
}

export interface ParallaxResult {
  topic: string;
  briefing: BriefingResponse | null;
  pulse: PulseResponse | null;
}
```

---

## Preset Topics (`lib/topics.ts`)
```typescript
// Edit this list to change the preset chips in TopicBar
export const PRESET_TOPICS = [
  "Iran",
  "Gaza",
  "Ukraine",
  "Taiwan",
  "US-China Trade",
  "AI Regulation",
];

// TODO: [V2] Fetch trending topics from Grok live search on page load — replace PRESET_TOPICS
```

---

## API Route: Briefing (`app/api/briefing/route.ts`)

- POST, accepts `{ topic: string }`
- Input validation: reject if missing, non-string, empty, or >200 chars → 400
- Calls `claude-sonnet-4-5-20251101` (verify exact ID against Anthropic API docs at build time)
- Web search tool: `{ type: "web_search_20250305", name: "web_search" }`
- max_tokens: 8000
- Uses system prompt from `lib/anthropic-prompt.ts`
- Strip markdown fences before JSON.parse; wrap in try/catch — on failure log raw and return 500
- Inject `topic` and `fetchedAt: new Date().toISOString()` into parsed object before returning
- Export `const maxDuration = 30`
- Return `BriefingResponse`

```typescript
export const maxDuration = 30;

export async function POST(req: Request) {
  const { topic } = await req.json();
  if (!topic || typeof topic !== "string" || topic.trim().length === 0 || topic.length > 200) {
    return NextResponse.json({ error: "Invalid topic" }, { status: 400 });
  }
  const sanitizedTopic = topic.trim();

  // ... Anthropic call ...

  const text = /* extract text from response */;
  const cleaned = text.replace(/^```json\s*/i, "").replace(/```\s*$/i, "").trim();
  let parsed;
  try {
    parsed = JSON.parse(cleaned);
  } catch (e) {
    console.error("Briefing JSON parse failed:", text);
    return NextResponse.json({ error: "Failed to parse AI response" }, { status: 500 });
  }

  return NextResponse.json({ topic: sanitizedTopic, fetchedAt: new Date().toISOString(), ...parsed });
}
```

---

## API Route: Pulse (`app/api/pulse/route.ts`)

- POST, accepts `{ topic: string }`
- Input validation: same as briefing route
- Calls Grok via OpenAI SDK with xAI base URL
- Uses system prompt from `lib/grok-prompt.ts`
- Strip markdown fences before JSON.parse; wrap in try/catch
- Inject `topic` and `fetchedAt` before returning
- Export `const maxDuration = 30`
- Return `PulseResponse`

```typescript
import OpenAI from "openai";

export const maxDuration = 30;

const grok = new OpenAI({
  apiKey: process.env.XAI_API_KEY,
  baseURL: "https://api.x.ai/v1",
});

export async function POST(req: Request) {
  const { topic } = await req.json();
  if (!topic || typeof topic !== "string" || topic.trim().length === 0 || topic.length > 200) {
    return NextResponse.json({ error: "Invalid topic" }, { status: 400 });
  }
  const sanitizedTopic = topic.trim();

  const response = await grok.chat.completions.create({
    model: "grok-3",
    messages: [
      { role: "system", content: GROK_SYSTEM_PROMPT },
      { role: "user", content: sanitizedTopic },
    ],
    max_tokens: 2000,
    // grok-3 has live search enabled by default
    // If signals appear stale, add: search_parameters: { mode: "auto", sources: [{ type: "x" }, { type: "web" }] }
  });

  const text = response.choices[0]?.message?.content ?? "";
  const cleaned = text.replace(/^```json\s*/i, "").replace(/```\s*$/i, "").trim();
  let parsed;
  try {
    parsed = JSON.parse(cleaned);
  } catch (e) {
    console.error("Pulse JSON parse failed:", text);
    return NextResponse.json({ error: "Failed to parse AI response" }, { status: 500 });
  }

  return NextResponse.json({ topic: sanitizedTopic, fetchedAt: new Date().toISOString(), ...parsed });
}
```

---

## Anthropic System Prompt (`lib/anthropic-prompt.ts`)
```
You are a neutral news intelligence analyst. Your job is to find recent formal journalism coverage of a given topic from ideologically diverse sources and return structured data.

CRITICAL: Return ONLY valid JSON. No markdown fences. No preamble. No explanation. Just the raw JSON object.

For the given topic, use web search to find 6-8 recent news articles. You MUST include sources across the political spectrum:
- At least 1 mainstream wire service (Reuters, AP, BBC)
- At least 1 conservative-leaning outlet (Fox News, Daily Wire, NY Post, Breitbart)
- At least 1 progressive-leaning outlet (The Guardian, MSNBC, HuffPost, Democracy Now)
- At least 1 non-Western or regional outlet if relevant (Al Jazeera, South China Morning Post, RT, Times of India)
- Fill remaining slots with the highest-quality journalism available

For each article return:
- headline: The actual article headline
- source: Publication name (e.g. "BBC News")
- url: Direct article URL
- publishedAt: Approximate date (e.g. "March 4, 2026")
- summary: 2-3 sentences summarizing content factually, no spin
- biasRating: One of exactly: "Left", "Center-Left", "Center", "Center-Right", "Right", "State-Affiliated"
- biasExplanation: One sentence explaining this rating — cite specific language or framing choices from this article
- framing: One sentence on the angle or emphasis (e.g. "Focuses on civilian toll", "Emphasizes Western diplomatic failure")

Also return:
- situationSummary: 3-4 sentences describing what is factually happening. Write as a neutral intelligence briefing — no ideology, no framing, just verifiable facts.

Return this exact JSON structure:
{
  "situationSummary": "...",
  "articles": [
    {
      "headline": "...",
      "source": "...",
      "url": "...",
      "publishedAt": "...",
      "summary": "...",
      "biasRating": "...",
      "biasExplanation": "...",
      "framing": "..."
    }
  ]
}
```

---

## Grok System Prompt (`lib/grok-prompt.ts`)
```
You are a real-time social intelligence analyst monitoring X (Twitter) and live web sources. Your job is to capture the current discourse landscape around a topic — what's breaking, what journalists are saying, what narratives are forming, and what's being contested.

CRITICAL: Return ONLY valid JSON. No markdown fences. No preamble. No explanation. Just the raw JSON object.

For the given topic, search X/Twitter and live sources to identify 5-7 significant signals in the current discourse. A "signal" is a notable post, thread, trending narrative, official statement, or on-the-ground account that is shaping how people understand this topic RIGHT NOW.

Prioritize:
- Breaking developments not yet in formal news
- Statements from officials, diplomats, or military accounts
- Notable journalists or analysts with significant reach
- Contested claims or active disputes
- Non-Western or local voices that mainstream outlets aren't amplifying
- Contrarian takes gaining traction

For each signal return:
- type: One of exactly: "breaking", "official", "journalist", "discourse", "contrarian", "ontheground"
- summary: 1-2 sentences describing the signal factually
- sourceHandle: @handle if attributable to a specific account (optional)
- sourceDescription: e.g. "BBC Middle East correspondent", "Iranian state TV", "Trending hashtag with 40k posts"
- sentiment: One of exactly: "alarming", "cautious", "neutral", "hopeful"
- verificationStatus: One of exactly: "unverified", "plausible", "confirmed"
- url: Link to post or source if available (optional)

Also return:
- discourseSnapshot: 2-3 sentences summarizing the overall tone and dominant themes on X right now regarding this topic. What is the crowd focused on? What's contested?

Return this exact JSON structure:
{
  "discourseSnapshot": "...",
  "signals": [
    {
      "type": "...",
      "summary": "...",
      "sourceHandle": "...",
      "sourceDescription": "...",
      "sentiment": "...",
      "verificationStatus": "...",
      "url": "..."
    }
  ]
}
```

---

## Bias Color System (`lib/bias.ts`)
```typescript
export const BIAS_COLORS: Record<BiasRating, string> = {
  "Left":             "bg-blue-600",
  "Center-Left":      "bg-teal-500",
  "Center":           "bg-slate-500",
  "Center-Right":     "bg-orange-500",
  "Right":            "bg-red-600",
  "State-Affiliated": "bg-purple-600",
};

// Text labels used in pill badges — no emoji
export const SIGNAL_TYPE_LABELS: Record<SignalType, string> = {
  breaking:    "BREAKING",
  official:    "OFFICIAL",
  journalist:  "JOURNALIST",
  discourse:   "DISCOURSE",
  contrarian:  "CONTRARIAN",
  ontheground: "ON THE GROUND",
};

// Accent color per signal type for the label pill
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
```

---

## Main Dashboard (`app/page.tsx`)

### State
```typescript
const [topic, setTopic] = useState("");
const [briefing, setBriefing] = useState<BriefingResponse | null>(null);
const [pulse, setPulse] = useState<PulseResponse | null>(null);
const [briefingLoading, setBriefingLoading] = useState(false);
const [pulseLoading, setPulseLoading] = useState(false);
const [briefingError, setBriefingError] = useState<string | null>(null);
const [pulseError, setPulseError] = useState<string | null>(null);
const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
const [activeTab, setActiveTab] = useState<"briefing" | "pulse">("briefing"); // mobile only
const abortRef = useRef<AbortController | null>(null);
```

### Fetch behavior
Fire both API calls in parallel. Each panel loads independently. Cancel stale in-flight requests when a new search fires.
```typescript
const analyze = async (topicInput: string) => {
  // Cancel any in-flight request from a previous search
  abortRef.current?.abort();
  const controller = new AbortController();
  abortRef.current = controller;

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
    }).then(r => r.json()),
    fetch("/api/pulse", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic: topicInput }),
      signal: controller.signal,
    }).then(r => r.json()),
  ]);

  if (briefingResult.status === "fulfilled") setBriefing(briefingResult.value);
  else setBriefingError("Briefing unavailable.");
  setBriefingLoading(false);

  if (pulseResult.status === "fulfilled") setPulse(pulseResult.value);
  else setPulseError("Pulse unavailable.");
  setPulseLoading(false);

  // Update watchlist lastFetchedAt if this topic is saved
  setWatchlist(prev => prev.map(w =>
    w.topic === topicInput ? { ...w, lastFetchedAt: new Date().toISOString() } : w
  ));
};
```

### Layout
Two states: **landing** (no search yet) and **dashboard** (results).

**Landing state** — shown when `!briefing && !pulse && !briefingLoading && !pulseLoading`:
```
┌──────────────────────────────────────────────┐
│                                              │
│          PARALLAX                            │
│          Same event. Every angle.            │
│                                              │
│   ┌──────────────────────────────────────┐   │
│   │ Enter a topic...                [→]  │   │
│   └──────────────────────────────────────┘   │
│   [Iran] [Gaza] [Ukraine] [Taiwan] [US-China Trade] [AI Regulation]  │
│                                              │
│   ─────────────────────────────────────────  │
│                                              │
│   BRIEFING                  PULSE            │
│   Formal press coverage     Live X discourse │
│   Bias-rated, citable       Breaking signals │
│   Across the spectrum       On the ground    │
│                                              │
└──────────────────────────────────────────────┘
```
Landing is centered vertically. The preview description below the chips is subtle — `text-slate-500 text-sm`. This disappears once a search fires.

**Dashboard state** — shown when loading or results present:
```
┌──────────────────────────────────────────────────────┐
│  PARALLAX                    Same event. Every angle. │
├──────────────────────────────────────────────────────┤
│  [Topic input ................................] [→]   │
│  [Iran] [Gaza] [Ukraine] [Taiwan] [AI Reg]           │
├────────────────────────────────────┬─────────────────┤
│                                    │                 │
│  SITUATION ASSESSMENT              │  TRACKED        │
│  (SituationSummary card)           │  (watchlist)    │
│                                    │                 │
├──────────────────┬─────────────────┤                 │
│  BRIEFING        │  PULSE ●        │                 │
│  Formal press    │  X / Discourse  │                 │
│  Bias-rated      │  Breaking       │                 │
│  Article cards   │  Signal items   │                 │
│                  │                 │                 │
└──────────────────┴─────────────────┴─────────────────┘
```
On mobile: SituationSummary full width, then PanelTabs.

---

## BriefingPanel Component
- Section header: `── BRIEFING ──` style with amber accent label, thin flanking lines
- Bias legend bar below header
- 2-col article card grid (1-col on mobile)
- Each ArticleCard: source + bias badge, headline, framing (italic, slate-400), summary (line-clamp-3), "Read →" link
- Click card → expand biasExplanation inline
- Hover: amber left border + slight card lift (`translate-y-px`)
- Note: Article links are AI-sourced — add `title="Link provided by AI — verify before citing"` on anchor

## PulsePanel Component
- Section header: `── PULSE ──` with teal accent label + live indicator dot (pulsing teal, `animate-pulse`)
- discourseSnapshot at top in a subtle card (`bg-slate-900 border-l-2 border-l-cyan-500/40`)
- Vertical list of PulseItems
- Each PulseItem shows:
  - Signal type pill (monospace uppercase, colored per SIGNAL_TYPE_COLORS — no emoji)
  - sourceDescription (medium weight) + `@handle` in slate-400 if present
  - summary text
  - Sentiment color tag + verificationStatus badge (inline, right-aligned)
  - "View →" link if url present
- verificationStatus badges: `unverified` = red-950/red-400, `plausible` = amber-950/amber-400, `confirmed` = teal-950/teal-400

## SituationSummary Component
- Left accent border (`border-l-2 border-l-amber-400/60`)
- Label: `SITUATION ASSESSMENT` in monospace uppercase, amber-400, xs
- Text: `text-slate-200` body, slightly larger than card body text
- Fallback behavior: if `briefing` is null but `pulse` is available, show `pulse.discourseSnapshot` with label `DISCOURSE SNAPSHOT` in cyan — makes clear briefing didn't load. If both null, render nothing.

---

## Design System

### Philosophy
Intelligence terminal meets war room. The feel is: serious people tracking serious events in a beautiful, purpose-built tool. Think Palantir if it had a good design team, or a Bloomberg Terminal that was rebuilt from scratch in 2025. Clean, fast, authoritative. Every element has a reason to exist.

### Colors
- **Base**: `bg-slate-950` — near-black, deep navy tone
- **Card surface**: `bg-slate-900 border border-slate-800`
- **Briefing accent**: `amber-400` / `amber-500` — warm, analytical, structured
- **Pulse accent**: `cyan-400` / `teal-400` — electric, live, real-time
- **Section labels**: amber for BRIEFING-side elements, cyan for PULSE-side elements
- **Text hierarchy**: `white` headlines → `slate-200` body → `slate-400` secondary → `slate-500` metadata
- **Divider**: `border-slate-800` vertical line on desktop between panels

### Typography
- **Body**: Inter (via `next/font/google`, downloaded at build time — no external request in prod)
- **Data / labels**: `font-mono` for timestamps, bias ratings, verification status, signal type pills, section headers
- **Section headers**: `text-xs font-mono uppercase tracking-widest` — this is the intel aesthetic
- **No emoji anywhere in UI chrome** — signal types use text pill labels

### Background texture
Very subtle dot grid on the base layer — gives depth without noise:
```css
background-image: radial-gradient(circle, rgba(148, 163, 184, 0.06) 1px, transparent 1px);
background-size: 32px 32px;
```
Apply to `<body>` or the root div, below `bg-slate-950`.

### Section headers (flanked-line style)
```tsx
// Use this pattern for all panel headers
<div className="flex items-center gap-3 mb-4">
  <div className="flex-1 h-px bg-slate-800" />
  <span className="text-xs font-mono tracking-widest text-amber-400">BRIEFING</span>
  <div className="flex-1 h-px bg-slate-800" />
</div>
```
Swap `text-amber-400` for `text-cyan-400` on Pulse side.

### LIVE indicator (Pulse panel only)
```tsx
<span className="inline-flex items-center gap-1.5">
  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
  <span className="text-xs font-mono tracking-widest text-cyan-400">LIVE</span>
</span>
```
Place next to PULSE label in the section header.

### Card hover states
- ArticleCard hover: `hover:border-amber-400/40 hover:-translate-y-0.5 transition-all duration-150`
- PulseItem hover: `hover:border-cyan-400/30 hover:bg-slate-800/80 transition-all duration-150`

### Buttons / inputs
- Primary action button (GO / →): `bg-amber-400 text-slate-950 font-mono font-semibold text-sm px-4 py-2 hover:bg-amber-300 transition-colors`
- Topic chips: `text-xs font-mono border border-slate-700 text-slate-400 hover:border-amber-400/50 hover:text-amber-400 px-3 py-1 rounded transition-colors`
- Search input: `bg-slate-900 border border-slate-700 focus:border-amber-400/50 focus:outline-none text-white placeholder:text-slate-600 font-mono`

### Loading states
- Each panel shows its own skeleton independently
- Skeleton bars in amber hue for Briefing side, cyan hue for Pulse side
- Optional small label above skeleton: `"ACCESSING BRIEFING..."` / `"SCANNING PULSE..."` in monospace, slate-500

### Transitions
- Layout shift from landing → dashboard: `transition-all duration-300`
- Keep transitions subtle — the content is the experience, not the animation

### Rules
- No gradients in content areas
- No box shadows (except minimal `shadow-sm` if needed for depth)
- No rounded corners beyond `rounded` (4px) — sharp feels more like an instrument
- No emoji in UI chrome — text labels only
- No decorative icons not tied to data

---

## Preset Topic Chips
Imported from `lib/topics.ts` — edit that file to change chips without touching the component.

---

## Watchlist
- Save icon (star or bookmark SVG) on active result header
- Persisted in localStorage: `parallax_watchlist`
- Max 10 topics (drop oldest on overflow)
- Click saved topic → re-runs `analyze()`
- Shows `lastFetchedAt` per topic in `font-mono text-xs text-slate-500`
- Panel label: `TRACKED TOPICS` in monospace uppercase

---

## Monetization Stubs
Wire these in as TODO comments — don't build, just leave the hooks:
```
// TODO: [PRO] Auto-refresh interval per watchlist topic (hourly / daily)
// TODO: [PRO] Email digest via Resend — daily briefing on saved topics
// TODO: [PRO] Export as PDF → jsPDF
// TODO: [API] middleware.ts — X-API-Key check for B2B API tier
// TODO: [DATA] Log { topic, source, biasRating, fetchedAt } → dataset product
// TODO: [PRO] Snapshot history — save past results per topic with timestamps
// TODO: [V2] Alert system — notify when a topic's coverage shifts significantly
// TODO: [V2] Fetch trending topics from Grok on page load — replace PRESET_TOPICS
```

---

## .env.example
```
ANTHROPIC_API_KEY=your_anthropic_key_here
XAI_API_KEY=your_xai_key_here
```

---

## Do NOT Build in v1
- Auth / user accounts (design assumes it's coming)
- Database
- Email / notifications
- Mobile app
- Admin panel
- Paid tier enforcement (stubs only)

---

## Vercel Deploy Checklist
- `export const maxDuration = 30` in both API routes
- Node.js runtime (not edge)
- Set ANTHROPIC_API_KEY + XAI_API_KEY in Vercel environment variables
- Test both API routes return valid JSON before deploying
