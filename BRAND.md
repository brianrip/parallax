# Parallax — Brand System

## Concept & Voice

**Product:** Dual-source news intelligence dashboard
**Tagline:** *Same event. Every angle.*
**Positioning:** Where serious people check the news. Not a consumer app — an intelligence tool.
**Tone:** Precise. Confident. Neutral. Never sensational. Think Reuters wire meets a terminal dashboard.

---

## Logo — The Prism Mark

The mark is a prism motif: one amber input line enters from the left, hits an origin point, and splits into a spectrum of five output lines — two above, the amber center line continuing straight through, two below. This encodes the product's core metaphor: *one event, multiple perspectives*.

### SVG Mark (canonical)

```svg
<svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Input line -->
  <line x1="4" y1="22" x2="18" y2="22" stroke="#F5A623" stroke-width="2.5" stroke-linecap="round"/>
  <!-- Origin point -->
  <circle cx="18" cy="22" r="2.5" fill="#F5A623"/>
  <!-- Output spectrum -->
  <line x1="18" y1="22" x2="40" y2="8"  stroke="#F0F4FF" stroke-width="2"   stroke-linecap="round" opacity="0.95"/>
  <line x1="18" y1="22" x2="40" y2="14" stroke="#F0F4FF" stroke-width="2"   stroke-linecap="round" opacity="0.80"/>
  <line x1="18" y1="22" x2="40" y2="22" stroke="#F5A623" stroke-width="2.5" stroke-linecap="round"/>
  <line x1="18" y1="22" x2="40" y2="30" stroke="#F0F4FF" stroke-width="2"   stroke-linecap="round" opacity="0.80"/>
  <line x1="18" y1="22" x2="40" y2="36" stroke="#F0F4FF" stroke-width="2"   stroke-linecap="round" opacity="0.95"/>
</svg>
```

### Usage Rules
- **Mark alone**: Use as favicon (32×32, 16×16), app icon, loading spinner
- **Mark + wordmark**: Use in header, OG images, marketing
- **Mark + wordmark + tagline**: Use on landing page hero only
- **Minimum size**: 16px — below this, use a simplified 3-line version
- **Clear space**: Always maintain padding equal to the mark's height on all sides
- **Never**: Rotate, recolor, add drop shadows, or alter proportions

### Wordmark
- Font: **Syne** weight 800
- Tracking: `-0.02em`
- Color: `#F0F4FF` on dark, `#050810` on light
- Size relative to mark: wordmark cap-height ≈ 60% of mark height

---

## Color System

### Core Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-base` | `#050810` | Page background |
| `--color-surface` | `#0D1117` | Cards, panels |
| `--color-surface-raised` | `#131920` | Hover states, elevated cards |
| `--color-border` | `#1E2530` | Borders, dividers |
| `--color-border-subtle` | `#151C26` | Subtle separators |
| `--color-amber` | `#F5A623` | Primary accent — interactive elements, highlights, the "truth line" |
| `--color-amber-dim` | `#C47D10` | Hover state for amber elements |
| `--color-amber-glow` | `rgba(245,166,35,0.08)` | Subtle amber backgrounds, focus rings |
| `--color-text-primary` | `#F0F4FF` | Headlines, primary text |
| `--color-text-secondary` | `#8892A4` | Supporting text, metadata |
| `--color-text-tertiary` | `#4A5568` | Placeholder text, disabled states |

### Bias Rating Colors (fixed — do not vary)

| Rating | Background | Text | Token |
|--------|-----------|------|-------|
| Left | `#1D4ED8` | `#F0F4FF` | `--bias-left` |
| Center-Left | `#0F766E` | `#F0F4FF` | `--bias-center-left` |
| Center | `#475569` | `#F0F4FF` | `--bias-center` |
| Center-Right | `#C2410C` | `#F0F4FF` | `--bias-center-right` |
| Right | `#B91C1C` | `#F0F4FF` | `--bias-right` |
| State-Affiliated | `#6D28D9` | `#F0F4FF` | `--bias-state` |

### Signal Sentiment Colors (Pulse panel)

| Sentiment | Color |
|-----------|-------|
| Alarming | `#F87171` |
| Cautious | `#FB923C` |
| Neutral | `#8892A4` |
| Hopeful | `#2DD4BF` |

### Verification Status

| Status | Background | Text |
|--------|-----------|------|
| Unverified | `rgba(185,28,28,0.15)` | `#F87171` |
| Plausible | `rgba(194,65,12,0.15)` | `#FB923C` |
| Confirmed | `rgba(15,118,110,0.15)` | `#2DD4BF` |

---

## Typography

### Font Stack

```css
--font-display: 'Syne', sans-serif;        /* Logo wordmark, section headers */
--font-mono:    'DM Mono', monospace;      /* Metadata, timestamps, labels, badges */
--font-body:    'IBM Plex Sans', sans-serif; /* Body text, summaries, descriptions */
```

Load via Google Fonts:
```
https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Mono:wght@400;500&family=IBM+Plex+Sans:wght@400;500;600&display=swap
```

### Type Scale

| Role | Font | Size | Weight | Tracking | Color |
|------|------|------|--------|----------|-------|
| Logo wordmark | Syne | 24px | 800 | -0.02em | `--color-text-primary` |
| Section label | DM Mono | 10px | 500 | 0.2em | `--color-amber` |
| Article headline | IBM Plex Sans | 15px | 600 | -0.01em | `--color-text-primary` |
| Source name | DM Mono | 11px | 500 | 0.05em | `--color-text-secondary` |
| Body / summary | IBM Plex Sans | 13px | 400 | 0 | `--color-text-secondary` |
| Framing text | IBM Plex Sans | 12px | 400 | 0 | `--color-text-tertiary` (italic) |
| Timestamp / meta | DM Mono | 10px | 400 | 0.05em | `--color-text-tertiary` |
| Badge text | DM Mono | 10px | 500 | 0.1em | white |
| Button | IBM Plex Sans | 13px | 500 | 0.02em | — |

### Section Labels
All section labels (e.g. "WHAT'S ACTUALLY HAPPENING", "BRIEFING", "PULSE") use:
- DM Mono, 10px, weight 500
- `--color-amber`
- Letter-spacing: `0.2em`
- All caps
- Preceded by a 2px × 12px amber vertical bar

---

## Spacing & Layout

### Base Unit
`4px` — all spacing is multiples of 4.

### Key Spacing Tokens

```css
--space-1:  4px
--space-2:  8px
--space-3:  12px
--space-4:  16px
--space-5:  20px
--space-6:  24px
--space-8:  32px
--space-10: 40px
--space-12: 48px
--space-16: 64px
```

### Layout

- **Max content width**: `1400px`
- **Page padding**: `24px` mobile, `40px` desktop
- **Card padding**: `20px`
- **Grid gap**: `2px` (cards sit flush with hairline gaps — intentional, creates a panel/dashboard feel)
- **Article grid**: 2 columns desktop (`minmax(320px, 1fr)`), 1 column mobile

---

## Component Patterns

### Cards
```css
background: var(--color-surface);
border: 1px solid var(--color-border);
border-radius: 0;  /* No border radius — sharp corners throughout */
padding: 20px;
transition: border-color 150ms ease, box-shadow 150ms ease;
```

Hover state:
```css
border-color: rgba(245, 166, 35, 0.4);
box-shadow: 0 0 0 1px rgba(245, 166, 35, 0.08);
```

Active/expanded state:
```css
border-color: rgba(245, 166, 35, 0.6);
border-left: 2px solid var(--color-amber);
```

### Buttons

Primary:
```css
background: var(--color-amber);
color: #050810;
font: 500 13px/1 'IBM Plex Sans';
letter-spacing: 0.02em;
padding: 10px 20px;
border-radius: 0;
border: none;
cursor: pointer;
transition: background 150ms;
```
Hover: `background: var(--color-amber-dim)`

Ghost:
```css
background: transparent;
color: var(--color-text-secondary);
border: 1px solid var(--color-border);
```
Hover: `border-color: var(--color-amber); color: var(--color-text-primary)`

### Badges (Bias + Signal type)
```css
display: inline-flex;
align-items: center;
padding: 2px 8px;
border-radius: 999px;  /* Only element with border-radius */
font: 500 10px/1 'DM Mono';
letter-spacing: 0.1em;
text-transform: uppercase;
white-space: nowrap;
```

### Input / Search Bar
```css
background: var(--color-surface);
border: 1px solid var(--color-border);
border-radius: 0;
padding: 12px 16px;
font: 400 14px 'IBM Plex Sans';
color: var(--color-text-primary);
width: 100%;
outline: none;
transition: border-color 150ms;
```
Focus: `border-color: var(--color-amber)`

### Section Dividers
```css
border: none;
border-top: 1px solid var(--color-border);
margin: 0;
```

Amber accent bar (precedes section labels):
```css
width: 2px;
height: 12px;
background: var(--color-amber);
display: inline-block;
margin-right: 8px;
vertical-align: middle;
```

---

## Motion

**Philosophy:** One well-orchestrated entrance. Subtle persistent interactions. Nothing gratuitous.

### Page Load Sequence
```css
/* Stagger cards on initial load */
.article-card {
  animation: fadeUp 300ms ease forwards;
  opacity: 0;
}
.article-card:nth-child(1) { animation-delay: 0ms }
.article-card:nth-child(2) { animation-delay: 50ms }
.article-card:nth-child(3) { animation-delay: 100ms }
/* etc. */

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
```

### Loading Skeleton Pulse
```css
@keyframes shimmer {
  0%   { background-position: -400px 0; }
  100% { background-position: 400px 0; }
}
.skeleton {
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

### Interactions
- Card hover: `150ms ease` border + shadow
- Button hover: `150ms ease` background
- Expand/collapse: `200ms ease` height with `overflow: hidden`
- No bounces, no springs, no elastic easing

---

## Logo Animation (header only)

On page load, the prism mark animates once:
1. Input line draws in from left → right over 300ms
2. Origin dot fades in at 300ms
3. Output lines fan out from origin, staggered 40ms each, over 250ms

```css
/* Draw-on effect using stroke-dasharray */
.logo-input-line {
  stroke-dasharray: 20;
  stroke-dashoffset: 20;
  animation: drawLine 300ms ease forwards;
}
.logo-output-line {
  stroke-dasharray: 30;
  stroke-dashoffset: 30;
  animation: drawLine 250ms ease forwards;
}
.logo-output-line:nth-child(1) { animation-delay: 300ms }
.logo-output-line:nth-child(2) { animation-delay: 340ms }
.logo-output-line:nth-child(3) { animation-delay: 380ms }
.logo-output-line:nth-child(4) { animation-delay: 420ms }
.logo-output-line:nth-child(5) { animation-delay: 460ms }

@keyframes drawLine {
  to { stroke-dashoffset: 0; }
}
```

---

## Iconography

Use **Lucide** icons throughout (`lucide-react`). Stroke width: `1.5px`. Size: `16px` in UI, `14px` inline with text.

Key icons:
- Refresh: `RefreshCw`
- External link: `ArrowUpRight`
- Save/watchlist: `Bookmark` / `BookmarkCheck`
- Expand: `ChevronDown`
- Close: `X`
- Breaking: `Zap`
- Official: `Landmark`
- Journalist: `Newspaper`
- On the ground: `MapPin`
- Discourse: `MessageSquare`
- Contrarian: `ArrowLeftRight`

---

## What to Avoid

| ❌ Never | ✅ Instead |
|---------|-----------|
| Border radius on cards/containers | Sharp corners only |
| Inter, Roboto, system-ui font | Syne + DM Mono + IBM Plex Sans |
| Purple gradients | Amber accents on dark slate |
| Glows, blurs, backdrop-filter | Solid borders, flat depth |
| Emoji in UI chrome | Lucide icons |
| Rounded buttons | Square buttons |
| Drop shadows | Border-based elevation |
| Colorful backgrounds | Amber is the only color — rest is slate |
| Animated numbers / counters | Static, load-once |
| Toast notifications | Inline error/status states |

---

## CSS Variables — Full Reference

Paste this into your `globals.css`:

```css
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

  /* Typography */
  --font-display: 'Syne', sans-serif;
  --font-mono:    'DM Mono', monospace;
  --font-body:    'IBM Plex Sans', sans-serif;

  /* Spacing */
  --space-1:  4px;  --space-2:  8px;  --space-3:  12px;
  --space-4:  16px; --space-5:  20px; --space-6:  24px;
  --space-8:  32px; --space-10: 40px; --space-12: 48px;
  --space-16: 64px;
}
```

---

## OG Image / Social

- Dimensions: `1200 × 630px`
- Background: `#050810`
- Centered prism mark at `80px`
- Wordmark in Syne 800 at `48px` below mark
- Tagline in DM Mono at `16px`, `--color-text-secondary`
- Bottom-left: current topic being analyzed in amber
- No gradients, no photography
