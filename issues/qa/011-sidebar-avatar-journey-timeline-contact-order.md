---
id: issue-011
title: "Sidebar redesign: avatar, journey timeline, contact order"
feature: single-page-json
status: qa
created_at: 2026-07-21
tags: [afk, p2]
---

# [011] Sidebar redesign: avatar, journey timeline, contact order

**Type:** AFK
**Priority:** P2
**Blocked by:** 010
**User stories covered:** 2, 3, 4

---

## What to build

Rebuild `DashboardSidebar` and `DashboardJourney` to match the mockup:

- **Avatar**: 46×46px, `border-radius: 12px` (rounded square) instead of the current 72×72px circle (`border-radius: 999px`).
- **Journey timeline**: replace the current plain-row list with a vertical dotted timeline — a connecting vertical line running through all entries, a small dot per entry, and the entry where `current: true` gets its dot rendered in amber with a glow (`box-shadow`). Each entry shows: year range, title, company (amber-colored), description, and skill tags — reading from `getJourney()` (from issue 009).
- **Section order**: profile → status → bio → locale → divider → Journey → Contact. Contact must render AFTER Journey (currently it renders before `<DashboardJourney/>` — this issue reverses that order).
- Contact block itself (email button + social links) can keep its current markup/behavior, just move it after Journey in the DOM.

---

## Acceptance criteria

- [x] Avatar renders at 46×46 with 12px border-radius (not a circle)
- [x] Journey renders as a connected vertical timeline with one dot per entry
- [x] The entry with `current: true` has a visually distinct (amber, glowing) dot
- [x] Each journey entry shows year range, title, company, description, and skill tags
- [x] Contact section appears after the Journey section in the rendered DOM order
- [x] Journey data comes from `getJourney()`, not a fetch call

---

## Tests required

Yes — extend `src/app/module/dashboard/__tests__/`:
- `DashboardSidebar`: assert avatar has the rounded-square styling (class or computed `border-radius`, not just presence of the `<img>`), assert Journey's container appears before Contact's container in DOM order (e.g. via `compareDocumentPosition` or querying both and checking relative index), rendering from a `profile.json`-shaped fixture.
- `DashboardJourney`: renders one timeline row per fixture entry, the `current: true` entry gets a distinguishing class/attribute, company/description/skills render from fixture data.

Follow the RTL pattern already used in `terminalHomePage.test.tsx` (mock the data-source module, not the network).

---

## Notes

- Reference: `issues/prd.md` — "Sidebar" and "Journey" bullets under Implementation Decisions; original bug report ("icons... implemented is circle while the one in the html is rounded square", "journey doesn't follow the given layout", "contact me... supposedly after [journey]").
- Source of truth for exact CSS values/markup: `Khesir - Home v2 (midfi).html` (`.jlist`, `.jitem`, `.jhead`, `.contact` rules) in the Khesir "Portfolio" Claude Design project.

---

## Log

_Updated as work progresses._

- Avatar resized to 46×46px with `border-radius: 12px` in `.dash-avatar` (`src/css/terminal-dashboard.css`).
- `DashboardJourney.tsx` rewritten as a vertical dotted timeline: `.dash-journey-item` (+ `--current` modifier), `.dash-journey-dot` (amber + glow when current), description now rendered. `DashboardSidebar.tsx` reordered so `<DashboardJourney/>` renders before the `.dash-contact` block. DesignSync tool was unavailable; used values documented in this issue's Notes section.
- Extended `DashboardSidebar.test.tsx` (avatar class, Journey-before-Contact DOM order via `compareDocumentPosition`) and `DashboardJourney.test.tsx` (row count, `current` class, description text) — all 20 tests in these two files pass. `npx tsc --noEmit` is clean. Full `npx vitest run` has 9 pre-existing failing files unrelated to this issue's components (terminal home/services/blog pages).

---

## Bug

Visual QA (2026-07-21) found two issues:
1. The profile header (avatar + name + role) wasn't laid out as a flex row — the whole `.dash-profile` block was a single flex-column, so avatar, name, and role all stacked vertically instead of the avatar sitting beside a name/role column, per the mockup's `.who` structure.
2. Contact wasn't rendered at the very bottom of the sidebar — Journey didn't grow to fill the sidebar's available height, so Contact sat directly below Journey's content instead of being pushed to the bottom edge, leaving blank space beneath it.

**Fix (2026-07-21):** Wrapped the avatar + name/role in a new `.dash-who` (flex row) / `.dash-who-text` (flex column) structure in `DashboardSidebar.tsx`/`terminal-dashboard.css`, matching the mockup's `.who` pattern. Changed `.dash-journey-slot`/`.dash-journey-list` from a fixed `max-height: 320px` cap to `flex: 1 1 auto; min-height: ...` so Journey grows to consume the sidebar's remaining height (mirroring the mockup's `.jscroll { flex: 1 }`), which pushes `.dash-contact` (`flex-shrink: 0`) flush to the bottom. Re-ran `npx vitest run src/app/module/dashboard` (37/37 pass) and `npx tsc --noEmit` (clean) after the fix.
