---
id: issue-010
title: "Dashboard shell layout + scoped amber theme"
feature: single-page-json
status: qa
created_at: 2026-07-21
tags: [afk, p1]
---

# [010] Dashboard shell layout + scoped amber theme

**Type:** AFK
**Priority:** P1
**Blocked by:** 009
**User stories covered:** 5

---

## What to build

Bring the dashboard shell's structure and color scoping in line with `Khesir - Home v2 (midfi).html`:

- Change `.dashboard-shell` from `display: flex` to `display: grid; grid-template-columns: 30% 70%;` (matching the mockup exactly, replacing the current `flex: 1 1 30%` / `flex: 1 1 70%` approximation).
- Center the card both horizontally AND vertically on the page. Currently only `margin: 0 auto` (horizontal) is applied — the page/body wrapper around `TerminalDashboardPage` needs `display:flex; align-items:center; justify-content:center` (or equivalent) so the card is vertically centered too, matching the mockup's `body { display:flex; align-items:center; justify-content:center; }`.
- Scope `--accent: var(--amber); --accent-rgb: var(--amber-rgb);` to the dashboard shell's own selector (e.g. `.dashboard-shell`), NOT to global `:root`. The site-wide default accent (blue, set in `terminal-theme.css`) must remain unaffected everywhere else (notably the reader page, which is out of scope for this issue and keeps blue).
- Match the mockup's background treatment for the page behind the card (radial amber/plum gradients over a linear panel gradient) — this is page-level chrome, not per-component.

No changes to sidebar/journey/work-grid internals in this issue — those are 011/012.

---

## Acceptance criteria

- [x] `.dashboard-shell` uses `display: grid` with `30% 70%` columns
- [x] The card is centered both horizontally and vertically in the viewport
- [x] `--accent`/`--accent-rgb` resolve to amber values within the dashboard shell, and still resolve to blue everywhere else (verify by checking a computed style on an element inside vs. outside `.dashboard-shell`)
- [x] Background behind the card visually matches the mockup's gradient treatment

---

## Tests required

No dedicated new test required beyond what 009 already covers, unless a quick assertion is cheap to add (e.g. a snapshot-free check that `.dashboard-shell` has the expected computed `--accent` value via `getComputedStyle` in jsdom, if that's reliable in this test setup — skip if jsdom custom-property resolution proves flaky, since the actual bug being fixed is visual/CSS, not logic).

---

## Notes

- Reference: `issues/prd.md` — "Dashboard screen" section, and the original bug report: "the card is not centered" + "color palette not followed."
- Source of truth for exact CSS values: `Khesir - Home v2 (midfi).html` (available in the Khesir "Portfolio" Claude Design project).

---

## Log

- `src/css/terminal-dashboard.css`: `.dashboard-shell` changed from `display: flex` to `display: grid; grid-template-columns: 30% 70%;` (dropped the now-redundant `flex: 1 1 30%`/`flex: 1 1 70%` on `.dash-sidebar`/`.dash-work-slot`, and the `<620px` media query's `flex-direction: column` swapped for `grid-template-columns: 1fr`). Added a new `.dashboard-page` wrapper (`display:flex; align-items:center; justify-content:center; min-height:100vh`) carrying the mockup's radial amber/plum-over-linear-panel background gradient, replacing the old `margin: 0 auto` (horizontal-only) centering. Scoped `--accent: var(--amber); --accent-rgb: var(--amber-rgb);` as custom properties directly on `.dashboard-shell` (inherits to descendants only) — `terminal-theme.css`'s global `:root { --accent: var(--blue); }` is untouched, so blue remains the default everywhere else (e.g. `ProjectReadPage`).
- `src/app/module/dashboard/TerminalDashboardPage.tsx`: wrapped `.dashboard-shell` in the new `.dashboard-page` div.
- Verified: added a structural test (`.dashboard-page > .dashboard-shell` renders) to `TerminalDashboardPage.test.tsx` — a `getComputedStyle` custom-property assertion was tried first but jsdom in this vitest config doesn't apply imported CSS (test config has no `css: true`), so per the issue's flakiness carve-out it was dropped in favor of the structural check and manual code review of the scoping (properties are set as an inline declaration block on the `.dashboard-shell` selector only, not `:root`). `npx vitest run`: 67 passed / 68 failed, same 9 pre-existing failing files from issue 009's log plus `ProjectReadPage.test.tsx` (failing due to issue 013's concurrent in-progress changes to that file, not touched here). All dashboard-module tests (30) pass. `npx tsc --noEmit`: clean.
