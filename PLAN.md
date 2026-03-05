# PLAN.md — Parallax

## Sprint: v1 Full Scaffold

## Agent Rules
- Read CLAUDE.md and this file in full before every task
- Work top to bottom
- Check off tasks as completed with [x]
- If a decision isn't in CLAUDE.md, default to less code
- Never deviate from the type definitions in lib/types.ts

## Notes
- Model ID: use `claude-sonnet-4-6` (confirmed working). `claude-sonnet-4-5-20251101` returned 404.
- API keys in `.env` (not `.env.local`)
- Tailwind v4 is installed — uses `@tailwindcss/postcss` plugin, no `tailwind.config.js`. Use utility classes directly; custom values via `@theme` in CSS if needed.

## Tasks

### Pre-Build (complete)
- [x] Amend CLAUDE.md with architectural fixes: Grok search, state shape, token budget (8000), validation, error handling, field injection, types, design system

### Foundation (complete)
- [x] Init Next.js 14 app with TypeScript + Tailwind (App Router, no src/ dir)
- [x] Install dependencies: @anthropic-ai/sdk, openai
- [x] Create .env.example
- [x] Configure next.config.ts if needed (no changes required)

### Types & Lib (complete)
- [x] lib/types.ts — all shared types (WatchlistItem includes lastFetchedAt)
- [x] lib/topics.ts — PRESET_TOPICS configurable list
- [x] lib/anthropic-prompt.ts — briefing system prompt (exported as ANTHROPIC_SYSTEM_PROMPT)
- [x] lib/grok-prompt.ts — pulse system prompt (exported as GROK_SYSTEM_PROMPT)
- [x] lib/bias.ts — BIAS_COLORS, SIGNAL_TYPE_LABELS, SIGNAL_TYPE_COLORS, SENTIMENT_COLORS

### API Routes (complete)
- [x] app/api/briefing/route.ts — input validation, Anthropic call with web search, max_tokens 8000, JSON parse try/catch, field injection
- [x] Smoke test briefing → valid JSON with topic, fetchedAt, situationSummary, articles[] ✓
- [x] app/api/pulse/route.ts — input validation, Grok call, JSON parse try/catch, field injection
- [x] Smoke test pulse → valid JSON with signals[], live content confirmed ✓
- [x] Smoke test validation: empty topic → 400, >200 char topic → 400 ✓

### Components (complete)
- [x] components/LoadingSkeleton.tsx
- [x] components/ErrorState.tsx
- [x] components/BiasLegend.tsx
- [x] components/ArticleCard.tsx — expand on click for biasExplanation
- [x] components/BriefingPanel.tsx
- [x] components/PulseItem.tsx
- [x] components/PulsePanel.tsx
- [x] components/SituationSummary.tsx — fallback to pulse.discourseSnapshot if briefing null
- [x] components/TopicBar.tsx
- [x] components/WatchlistPanel.tsx — localStorage, lastFetchedAt, max 10
- [x] components/PanelTabs.tsx — mobile only

### Pages (complete)
- [x] app/layout.tsx — Inter font, dark base bg, dot grid texture, metadata
- [x] app/page.tsx — landing state + dashboard state, AbortController, parallel fetch, watchlist

### Polish
- [ ] Mobile responsive layout + PanelTabs switching
- [ ] Loading states per panel (independent, correctly sided colors)
- [ ] Error states per panel (independent)
- [ ] Watchlist localStorage read/write with lastFetchedAt update on analyze
- [ ] Monetization TODO stubs in place (see CLAUDE.md)
- [ ] README.md written

### Deploy
- [ ] Vercel project created
- [ ] Env vars set in Vercel dashboard
- [ ] Test deploy successful
