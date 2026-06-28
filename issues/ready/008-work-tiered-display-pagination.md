---
id: issue-008
title: "Work page tiered display + server pagination"
feature: work
status: ready
created_at: 2026-06-28
tags: [afk, p1]
---

# [008] Work page tiered display + server pagination

**Type:** AFK
**Priority:** P1
**Blocked by:** None
**User stories covered:** 18, 19, 20, 21, 22

---

## What to build

Replace the current `TerminalWorkPage` layout (one featured hero + flat all-projects dump) with a tiered, paginated list. Pinned projects appear first, followed by non-pinned projects fetched page-by-page. Start with 5 visible items total and load more on demand.

End-to-end: `fetchFeaturedProjects` + updated `fetchProjects` (with pagination params) → tiered merge with de-duplication → `TerminalWorkPage` render → show-more fetches next page.

**Display order:**
1. Pinned projects — from `fetchFeaturedProjects()`, rendered in API order
2. Non-pinned projects — from `fetchProjects({ page, pageSize })`, filtered client-side to exclude any IDs already in the pinned set

**Initial render:** Show the first 5 items across the combined tiered list. If there are 3 pinned projects, the remaining 2 slots are filled from page 1 of the non-pinned fetch.

**Show more:** Fetches the next page of non-pinned projects and appends them. The button is hidden when the last page returns fewer items than `pageSize`.

**`fetchProjects` update:** Add `page: number` and `pageSize: number` params. In production mode, append `?page={page}&pageSize={pageSize}` to the request. In dev mode, slice `mockProjects` accordingly to simulate pagination.

**Backend contract (update `cms.ts` guide comment):**
- `GET /projects?page=1&pageSize=5` — returns lightweight project cards; the `markdown` field must be excluded from this response
- `GET /projects/:id` — returns the full object including `markdown`

---

## Acceptance criteria

- [ ] `fetchProjects` accepts `page` and `pageSize` parameters and passes them as query params
- [ ] Dev mode mock slices `mockProjects` by the requested page/pageSize
- [ ] `TerminalWorkPage` renders pinned projects first, then non-pinned projects
- [ ] No project appears in both the pinned and non-pinned sections (de-duplication by ID)
- [ ] Initial render shows at most 5 projects total across both tiers
- [ ] A "show more" button appears when more non-pinned projects may exist
- [ ] Clicking "show more" fetches the next page and appends results below the existing list
- [ ] "Show more" button is hidden when the last page is exhausted
- [ ] Backend guide comment in `cms.ts` documents the paginated endpoint and markdown exclusion rule

---

## Tests required

Yes — `TerminalWorkPage` test:
- Mock `fetchFeaturedProjects` returning pinned projects and `fetchProjects` returning non-pinned
- Assert pinned projects appear before non-pinned in the DOM
- Assert no project ID appears twice
- Assert only 5 items shown initially
- Assert "show more" button triggers a second `fetchProjects` call with incremented page
- Assert de-duplication: a project in the pinned list is not rendered again in the non-pinned section

---

## Notes

The current work page calls both `fetchFeaturedProjects` and `fetchProjects` separately. The new implementation consolidates them: pinned set is fetched once and its IDs are used to filter subsequent paginated calls.

The previous "featured hero" (single large card for the first pinned project) is replaced by the tiered list — no special hero treatment for the first pinned item.

---

## Log

_Updated as work progresses._
