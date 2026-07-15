---
id: issue-007
title: "Dashboard Work grid: category filter tabs"
feature: dashboard-home
status: qa
created_at: 2026-07-13
tags: [afk, p1]
---

# [007] Dashboard Work grid: category filter tabs

**Type:** AFK
**Priority:** P1
**Blocked by:** 003, 006
**User stories covered:** 6, 15, 16

---

## What to build

Add category filter tabs above the Work grid built in issue 006: "All", "Dev", "Illustration", "Tech Art". "All" is selected by default and shows every project regardless of category, including ones with no `category` set (from issue 003).

Selecting a specific tab filters the grid client-side to only projects whose `category` matches (`'dev'`, `'illustration'`, or `'tech-art'`); projects with no category set are hidden by any specific-category filter (they only ever appear under "All").

Each card also displays its `category` as a role-pill badge, rendered as the human-readable label ("Dev" / "Illustration" / "Tech Art"). No separate freeform "role" field is introduced — the category value is the only source for this pill.

---

## Acceptance criteria

- [ ] Filter tabs render: All, Dev, Illustration, Tech Art
- [ ] "All" is selected by default and shows every project, including uncategorized ones
- [ ] Selecting Dev/Illustration/Tech Art shows only matching projects
- [ ] Uncategorized projects are hidden under any specific-category filter
- [ ] Each card shows its category as a role-pill badge with the correct label

---

## Tests required

Yes — component test: clicking each filter tab shows the expected subset of mocked projects (including a case with a mix of categorized and uncategorized projects), and the role-pill label renders correctly per category.

---

## Notes

- Depends on issue 003 (category field must exist and be settable) and issue 006 (grid must exist to filter).
- Reference: `issues/prd.md` — "Project category field" section.

---

## Log

_Updated as work progresses._

- Implemented via TDD: added `activeCategory` state and client-side filter to `DashboardWorkGrid.tsx`, plus `CATEGORY_FILTERS`/`CATEGORY_LABELS` constants and a role-pill in `ProjectCard` sourced solely from `p.category`.
- Added filter-tab and role-pill styles to `terminal-dashboard.css` (`.dash-work-filters`, `.dash-work-filter-tab(.active)`, `.dash-work-role-pill`).
- Tests: 7 new cases in `DashboardWorkGrid.test.tsx` (tab rendering, default-All-shows-uncategorized, per-category filtering incl. hiding uncategorized, All-Dev-All toggle, role-pill labels/no-pill). Full dashboard suite: 26/26 passing (19 pre-existing + 7 new).
