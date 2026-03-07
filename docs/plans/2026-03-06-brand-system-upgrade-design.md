# Brand System Upgrade — Design Document

**Date:** 2026-03-06
**Scope:** Full visual redesign to match BRAND.md specification

## Summary

Migrate Parallax from its current Tailwind-defaults design system to the custom brand system defined in BRAND.md. This touches every visual component but changes zero business logic or API behavior.

## Key Changes

### Fonts
- Inter → Syne (display/wordmark) + DM Mono (labels/metadata) + IBM Plex Sans (body)
- Loaded via `next/font/google` for build-time optimization

### Color Tokens
- CSS custom properties (--color-base, --color-surface, etc.) defined in globals.css
- Mapped into Tailwind config via `extend.colors` for utility class usage
- Base: #050810, Surface: #0D1117, Border: #1E2530, Amber: #F5A623

### Logo
- Replace 3-line parallax mark with prism mark (input line → origin dot → 5 output spectrum lines)
- Draw-on animation on page load via stroke-dasharray/dashoffset
- Wordmark in Syne 800

### Section Labels
- Switch from flanking horizontal lines to vertical amber bar + DM Mono uppercase label

### Components
- Zero border-radius on all containers (only badges get 999px pill radius)
- Specific brand hex values for bias ratings, sentiment colors, verification status
- Lucide icons for signal types and UI actions
- Staggered fadeUp entrance animation on cards
- Shimmer loading skeleton

### Spacing
- 4px base unit, 2px grid gaps for flush panel feel
- 20px card padding, 24px/40px page padding (mobile/desktop)

## Files Affected

Foundation: globals.css, tailwind.config.ts, layout.tsx
Logo: ParallaxLogo.tsx
Tokens: lib/bias.ts
Components: All 12 component files
Dependencies: +lucide-react

## What Does NOT Change
- API routes (briefing, pulse)
- System prompts
- Type definitions
- Business logic / state management
- Responsive breakpoints strategy
