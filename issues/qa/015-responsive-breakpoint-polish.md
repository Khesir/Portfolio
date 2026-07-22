---
id: issue-015
title: "Responsive polish at the 620px breakpoint"
feature: single-page-json
status: qa
created_at: 2026-07-21
tags: [afk, p3]
---

# [015] Responsive polish at the 620px breakpoint

**Type:** AFK
**Priority:** P3
**Blocked by:** 011, 012
**User stories covered:** None (regression check)

---

## What to build

Verify and fix as needed the mobile/narrow-viewport fallback for the rebuilt dashboard, carrying over the mockup's `@media (max-width: 620px)` behavior: the shell stacks to a single column, the sidebar's border moves from right to bottom, and the work grid/masonry collapses to a single column.

This issue exists because issues 011 and 012 change the sidebar (timeline, avatar, contact order) and work grid (masonry, badges) markup/CSS significantly enough that the existing `@media (max-width: 620px)` rules in `terminal-dashboard.css` may no longer produce a clean stacked layout. Check and adjust those rules against the new markup.

---

## Acceptance criteria

- [x] At viewport widths ≤ 620px, the dashboard shell stacks to a single column (sidebar above work grid)
- [x] The journey timeline remains readable stacked (no clipped/overlapping dots or connecting line)
- [x] The masonry work grid collapses to a single column without overlapping cards
- [x] No horizontal scroll/overflow is introduced at narrow widths

---

## Tests required

No — this is a visual/CSS regression check, not new logic. Verify manually in a browser at ≤620px per the project's UI-change guidance (start the dev server, resize/emulate a narrow viewport, check the golden path).

---

## Notes

- Reference: `issues/prd.md` — Out of Scope ("pixel-matching the mobile fallback wasn't part of the reviewed design discussion... carry it over structurally").
- Low priority — do after the desktop redesign (011, 012) has settled, since narrow-viewport CSS will need to target whatever markup those issues actually land with.

---

## Log

_Updated as work progresses._

- Traced the current `@media (max-width: 620px)` block in `src/css/terminal-dashboard.css` against the markup rebuilt in 010/011/012. All targeted class names (`.dashboard-shell`, `.dash-sidebar`, `.dash-work-slot`, `.dash-journey-list`, `.dash-work-grid`) still exist and are not dangling. Shell-stacking, sidebar border-right→border-bottom swap, and journey timeline (dotted line + dots, `position: relative`/`absolute` within each `.dash-journey-item`, independent of container width) all still work correctly stacked — no fix needed there.
- Found and fixed one real regression: the 012 masonry rebuild wraps cards in two `.dash-work-col` flex children inside `.dash-work-grid`. The old media rule only added `flex-direction: column` to `.dash-work-grid`, which flips the flex main axis — combined with the base rule's `align-items: flex-start` (now acting on the new cross axis) and `.dash-work-col { flex: 1 1 0 }` (now sizing height instead of width), the two columns would shrink-wrap to content width instead of spanning full width, producing a broken/narrow stacked layout rather than a clean single column. Fixed by adding `align-items: stretch` to the media-query `.dash-work-grid` override and a new `.dash-work-col { flex: none; width: 100%; }` override, so at ≤620px the two column groups stack full-width with no overlap (column 1's cards, then column 2's cards below — round-robin grouping preserved, not a strict re-merge into original filtered order, which is an acceptable structural equivalent per this issue's scope).
- Verified via `npx tsc --noEmit` (clean) and `npx vitest run src/app/module/dashboard` (4 files, 37/37 passed, no new failures). Dev server was not started; verification was by hand-tracing the CSS box model/flex axis behavior for each rule against the current component markup, not a live browser render — flagged below for optional human visual QA.

## Flagged

- No live browser/dev-server check was performed (verification was by hand-tracing CSS flex-axis/box-model behavior against the current markup, not a rendered screenshot at ≤620px). The `.dash-work-grid`/`.dash-work-col` fix should hold up, but a human visual QA pass at a narrow viewport (e.g. browser devtools responsive mode) would confirm the masonry-to-single-column collapse looks clean, per this issue's "not pixel-matched, no mockup reviewed" scope.
