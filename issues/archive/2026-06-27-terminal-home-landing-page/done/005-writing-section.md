---
id: issue-005
title: "Writing section"
feature: terminal-home
status: done
created_at: 2026-06-26
tags: [afk, p2]
---

# 005 Writing section

**Type:** AFK
**Priority:** P2
**Blocked by:** 001
**User stories covered:** 14, 15, 16, 17

---

## What to build

Implement the `writing` section. Call `fetchBlogs()` directly (same fetch used by `BlogList`) and take the first 3 results.

Render each blog using the terminal `.post` row markup: date on the left formatted as `YYYY.MM.DD`, a center column with the article title (`name`), and a right meta column showing the first tag as a category chip and `minRead` + " min" as the read time. No description blurb is shown — blogs have no description field. The entire row is clickable and navigates to `/blogs/view/:name?id=:id`.

Include the section label row (`03 / writing / ── / all posts →`) above the list. The "all posts →" link navigates to `/blogs`.

Show a neutral empty state if no blogs are returned.

---

## Acceptance criteria

- [ ] Section fetches blogs and shows at most 3.
- [ ] Each row renders date (as `YYYY.MM.DD`), title, first tag as category chip, and read time.
- [ ] Rows with no tags render without the category chip (no crash).
- [ ] Rows with no `minRead` render without the read time.
- [ ] Clicking a row navigates to the blog detail page.
- [ ] "all posts →" link navigates to `/blogs`.
- [ ] Empty state renders when no blogs exist.

---

## Tests required

Yes — render with `fetchBlogs` mocked to return two blogs, assert both titles and formatted dates appear; mock empty array and assert empty state renders.

---

## Notes

- The existing `dateParser` utility in `src/lib/utils.ts` formats dates differently from the design's `YYYY.MM.DD` pattern. A local formatter is needed for this section only.
- `fetchBlogs` is already used by `BlogList` — import from the same location.
- The existing `RecentPosts` component (which fetches micro-posts, not blogs) is not used here.

---

## Log

_Updated as work progresses._

Created TerminalWritingSection component fetching blogs and rendering .post rows with YYYY.MM.DD date, title, category chip (first tag), and read time. Tests verify date formatting, tag/minRead edge cases, count limit, empty state, and navigation link.

QA approved by user on 2026-06-27.
