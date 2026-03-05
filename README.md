# Parallax

> Same event. Every angle.

A dual-source news intelligence dashboard that shows any topic through two simultaneous lenses:

- **Briefing** — Formal journalism from across the political spectrum, bias-rated by AI
- **Pulse** — Real-time X/Twitter discourse, breaking signals, on-the-ground accounts

Built with Next.js, Anthropic API, and Grok (xAI).

## Setup

1. Clone the repo
2. `cp .env.example .env` and fill in your API keys
3. `npm install`
4. `npm run dev`

## API Keys Required

- `ANTHROPIC_API_KEY` — [console.anthropic.com](https://console.anthropic.com)
- `XAI_API_KEY` — [console.x.ai](https://console.x.ai)

## Deploy

Deployed on Vercel. Set both env vars in your Vercel project settings.

## Architecture
```
POST /api/briefing  →  Anthropic claude-sonnet-4 + web search  →  BriefingResponse
POST /api/pulse     →  Grok 3 (xAI) + X data                  →  PulseResponse
```

Both calls fire in parallel. Each panel renders independently as results arrive.
```

---

## File 4: `.env.example`
```
ANTHROPIC_API_KEY=your_anthropic_key_here
XAI_API_KEY=your_xai_key_here
```

---

## How to kick off the Claude Code session

Once files are in place and you've `git init`'d:
```
Read CLAUDE.md and PLAN.md in full before doing anything.

Then execute the PLAN.md task list top to bottom, checking off each item as you complete it. Build the full Parallax app exactly to the spec in CLAUDE.md.

Start with: npm create-next-app scaffolding, then work through lib/, then API routes (smoke test both before moving on), then components, then page.tsx.

Do not skip ahead. Do not build anything not in the spec.