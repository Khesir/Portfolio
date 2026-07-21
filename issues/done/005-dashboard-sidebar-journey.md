---
id: issue-005
title: "Dashboard sidebar: Journey timeline (static, scrollable)"
feature: dashboard-home
status: qa
created_at: 2026-07-13
tags: [afk, p1]
---

# [005] Dashboard sidebar: Journey timeline (static, scrollable)

**Type:** AFK
**Priority:** P1
**Blocked by:** 001
**User stories covered:** 2, 3

---

## What to build

Inside the left sidebar panel of `TerminalDashboardPage`, add the Journey timeline: fetch career history via the existing `fetchExperiences` API (same source used by `/about`) and render each entry (role, company, duration, description/skills) in a vertical list.

Unlike `/about`'s Journey rows, entries here are **static** — no click-to-expand markdown detail. This is an intentional interaction difference from `/about` to match the reference mockup exactly.

The list scrolls independently within its own panel region when it overflows (internal scroll, not page scroll) — matching the mockup's themed thin-scrollbar treatment for this region.

---

## Acceptance criteria

- [ ] Journey entries render from `fetchExperiences`
- [ ] Entries are static — clicking a row does not expand/show additional detail
- [ ] The Journey list scrolls internally within its panel when content overflows, independent of the rest of the page
- [ ] Visual treatment (spacing, timeline markers, scrollbar styling) matches the reference mockup

---

## Tests required

Yes — component test mocking `fetchExperiences`, asserting entries render and that clicking a row does not trigger any expand/detail behavior (contrast with `/about`'s existing expand test).

---

## Notes

- Same data source as `/about`'s Journey section — any future change to `fetchExperiences`'s shape affects both surfaces (noted in the PRD's Further Notes).
- Reference: `issues/prd.md` — "New module & page" section ("Journey items in the dashboard sidebar are static...").

---

## Log

_Updated as work progresses._

- Implemented `src/app/module/dashboard/DashboardJourney.tsx` (new): fetches via `fetchExperiences(5)`, renders each entry statically (position, company · jobType, duration year range via the same `startYr`/`endYr` logic as `TerminalAboutPage`, plus `highlightSkills`) with no `onClick`/expand state — reuses `pageMd` only insofar as it's ignored. Wired into `DashboardSidebar.tsx` in place of the `dash-journey-slot` placeholder (kept the class on the wrapper). Added `src/css/terminal-dashboard.css` (new, imported from `DashboardSidebar.tsx`) with `overflow-y: auto` + `max-height: 320px` on `.dash-journey-list` for internal scroll.
- Tests (TDD, red-green per behavior): `src/app/module/dashboard/__tests__/DashboardJourney.test.tsx` — entries render from mocked `fetchExperiences`, highlight skills render, and clicking a row does not show `pageMd`/detail content (contrast with `/about`'s expand test). Also mocked `fetchExperiences` in the pre-existing `DashboardSidebar.test.tsx` and `TerminalDashboardPage.test.tsx` to keep those suites free of unhandled-network-error noise now that they transitively render the Journey component.
- All 16 dashboard tests pass (9 pre-existing `DashboardSidebar` + 4 pre-existing `TerminalDashboardPage` + 3 new `DashboardJourney`); `tsc --noEmit` clean.
