---
id: issue-006
title: "Dashboard Work grid: card list with pinned badge + click-through"
feature: dashboard-home
status: qa
created_at: 2026-07-13
tags: [afk, p1]
---

# [006] Dashboard Work grid: card list with pinned badge + click-through

**Type:** AFK
**Priority:** P1
**Blocked by:** 001
**User stories covered:** 4, 5, 7, 8

---

## What to build

Build the right panel (~70% column) of `TerminalDashboardPage`: a "Work" heading with piece count, and a two-column card grid (masonry-style, matching the reference mockup) of projects.

Fetch **all** pinned and non-pinned projects in one pass via the existing `fetchFeaturedProjects` + `fetchProjects` APIs — no pagination or show-more control here; the panel relies on internal scroll to handle overflow, matching the mockup's design (contrast with `/work`'s paginated list).

Each card shows: thumbnail image, title, description, tag pills (from `languages`), and year. Pinned projects show a "PINNED" badge (sourced from the existing `pinned` boolean, same source `/work` already uses). Clicking a card navigates to the project's detail route, same target as `/work`'s row click.

The grid scrolls internally within its own panel when content overflows, independent of page scroll — same internal-scroll treatment as the Journey list (issue 005).

Category filter tabs are explicitly **not** part of this issue — see issue 007.

---

## Acceptance criteria

- [ ] All pinned + non-pinned projects load in a single fetch (no pagination/show-more)
- [ ] Cards render thumbnail, title, description, tags, and year
- [ ] Pinned projects show a "PINNED" badge; non-pinned projects do not
- [ ] Clicking a card navigates to the correct project detail route
- [ ] Grid scrolls internally within its panel, independent of the rest of the page
- [ ] Visual structure (two-column masonry, card styling) matches the reference mockup

---

## Tests required

Yes — component test mocking `fetchFeaturedProjects`/`fetchProjects`: pinned badge presence/absence, all projects rendered without pagination, and clicking a card triggers navigation to the expected route (same assertion style as `terminalWorkPage.test.tsx`).

---

## Notes

- The reference mockup's multi-image/gallery count badge is explicitly out of scope (no gallery data model exists) — do not implement it.
- Category filter tabs and the category role-pill are issue 007, layered on top of this grid.
- Reference: `issues/prd.md` — "New module & page" and "Pinned badge & scope trims" sections.

---

## Log

_Updated as work progresses._

- Implemented `DashboardWorkGrid.tsx`: single-pass fetch via `fetchFeaturedProjects` + `fetchProjects(1, 100)`, pinned-first dedup (same `pinnedIds` Set pattern as `TerminalWorkPage`), two-column CSS grid with internal `overflow-y: auto` scroll, PINNED badge, and click-through to `/work/view/:title?id=`. Wired into `TerminalDashboardPage.tsx` in place of the `dash-work-slot` placeholder.
- TDD via 3 incremental tests in `DashboardWorkGrid.test.tsx`: all pinned+non-pinned render from one fetch with no show-more control; PINNED badge shown only on pinned cards; card click navigates to the project detail route (asserted via real route change in a `MemoryRouter`).
- Full dashboard suite (`npx vitest run src/app/module/dashboard`) passes: 19/19 across `DashboardSidebar`, `DashboardJourney`, `TerminalDashboardPage`, and `DashboardWorkGrid`. Added `fetchFeaturedProjects`/`fetchProjects` mocks to `TerminalDashboardPage.test.tsx` so it no longer fires real network calls; existing landmark assertions untouched. Typecheck (`tsc --noEmit`) clean.
