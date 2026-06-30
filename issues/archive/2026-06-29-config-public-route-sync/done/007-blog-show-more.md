---
id: issue-007
title: "Blog page show-more"
feature: blog
status: done
created_at: 2026-06-28
tags: [afk, p1]
---

# [007] Blog page show-more

**Type:** AFK
**Priority:** P1
**Blocked by:** None
**User stories covered:** 23, 24

---

## What to build

Add a client-side show-more pattern to `TerminalBlogPage`. The page currently renders all blogs at once. Limit the initial view to 5 posts and reveal more on demand.

End-to-end: `fetchBlogs()` call (unchanged) → client-side slice → show-more button → reveal next batch.

**Initial render:** Display the first 5 blogs from the fetched list (sorted by `releasedDate` descending, which is the current API sort order).

**Show more:** A "show more" button below the list increments the visible count by 5. The button is hidden once all blogs are visible.

No server-side pagination needed — blog list payloads are small since they don't contain markdown.

---

## Acceptance criteria

- [ ] Blog page initially renders exactly 5 posts
- [ ] A "show more" button is visible when the total blog count exceeds the current visible count
- [ ] Clicking "show more" reveals the next 5 posts
- [ ] Clicking "show more" repeatedly continues to reveal batches until all posts are shown
- [ ] "Show more" button is hidden once all posts are visible
- [ ] Sort order (latest first) is preserved across all visible posts

---

## Tests required

Yes — `TerminalBlogPage` test:
- Mock `fetchBlogs` returning more than 5 posts
- Assert only 5 are rendered initially
- Assert "show more" button is present
- Simulate click on "show more" and assert more posts appear
- Mock exactly 5 posts and assert "show more" button is absent

---

## Notes

`fetchBlogs` returns all blogs in one call — no changes needed to the API layer. The visible count is purely local component state.

---

## Log

_Updated as work progresses._

Implemented 2026-06-29. Added visibleCount state (starts at 5). Shows latest (blogs[0]) + rest.slice(0, visibleCount-1). Show-more button increments visibleCount by 5, disappears when all posts visible. Added terminalBlogPage.test.tsx with 5 tests.

QA approved by user on 2026-06-29.
