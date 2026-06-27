---
id: issue-004
title: "Projects section"
feature: terminal-home
status: done
created_at: 2026-06-26
tags: [afk, p2]
---

# 004 Projects section

**Type:** AFK
**Priority:** P2
**Blocked by:** 001
**User stories covered:** 10, 11, 12, 13

---

## What to build

Implement the `selected_work` section. Call `fetchFeaturedProjects()` directly (same fetch used by the existing `TopProjects` component), filter to `pinned === true`, and take the first 3 results.

Render each project using the terminal `.proj` row markup: a zero-padded index number, a column with the project name, type badge, description, and tech tags, and a year on the right. The entire row is clickable and navigates to `/projects/view/:name?id=:id`.

Include the section label row (`02 / selected_work / ── / all projects →`) above the list. The "all projects →" link navigates to `/projects`.

Show a neutral empty state if no pinned projects are returned.

---

## Acceptance criteria

- [ ] Section fetches featured projects and filters to `pinned === true`, showing at most 3.
- [ ] Each row renders index, name, type badge, description, tech tags, and year.
- [ ] Clicking a row navigates to the project detail page.
- [ ] "all projects →" link navigates to `/projects`.
- [ ] Empty state renders when no pinned projects exist.
- [ ] Loading state does not crash the page.

---

## Tests required

Yes — render with `fetchFeaturedProjects` mocked to return two pinned projects, assert both project names appear; mock returning an empty array and assert the empty state renders.

---

## Notes

- `fetchFeaturedProjects` is already used by `TopProjects` — import it from the same location.
- The existing `TopProjects` component is not reused here; only the data fetch is shared.
- Project fields to use: `name`, `type` (for the badge), `description`, `languages` (for tags), `releasedDate` (extract year), `_id`/`id`.

---

## Log

Created TerminalProjectsSection fetching pinned projects and rendering .proj rows with index, name, language tags, and year. No type/description fields exist on projects. Tests verify pinned filter, 3-item limit, empty state, and navigation link.

QA approved by user on 2026-06-27.
