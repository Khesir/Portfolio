---
id: issue-006
title: "About journey show-more + inline expand"
feature: about-config
status: ready
created_at: 2026-06-28
tags: [afk, p2]
---

# [006] About journey show-more + inline expand

**Type:** AFK
**Priority:** P2
**Blocked by:** None
**User stories covered:** 14, 15, 16, 17

---

## What to build

Replace the current flat journey list on `TerminalAboutPage` (which fetches 10 and dumps them all) with a capped list that starts at 5, a show-more button, and an inline expand for each row's full markdown content.

End-to-end: `fetchExperiences` call → journey section render → show-more interaction → row click expand/collapse.

**Initial load:** Call `fetchExperiences(5)` instead of `fetchExperiences(10)`.

**Show more:** A "show more" button below the list calls `fetchExperiences(20)` and replaces the list. The button disappears once the full set is loaded (i.e. when the returned count is less than 20, or equals the current count).

**Inline expand:** Each experience row becomes clickable. Clicking a row toggles an expand area directly below it that renders `pageMd` via `MarkDownComponent`. Only one row can be expanded at a time — clicking a second row collapses the first. Clicking the active row again collapses it.

The expand/collapse should be styled to fit the terminal aesthetic (no modal, no Radix Dialog — purely inline within the `.exp` section).

---

## Acceptance criteria

- [ ] Journey section initially renders exactly 5 experience rows
- [ ] A "show more" button is visible when there may be more experiences (initial count equals 5)
- [ ] Clicking "show more" loads up to 20 experiences and replaces the list
- [ ] "Show more" button is hidden after the full set is loaded
- [ ] Clicking an experience row expands an inline content area below it showing the `pageMd` markdown
- [ ] Clicking the same row again collapses the content area
- [ ] Clicking a different row collapses any currently open row and expands the new one
- [ ] Rows without `pageMd` content still render without error (show empty or a fallback message)

---

## Tests required

Yes — `TerminalAboutPage` test:
- Assert 5 rows shown initially
- Assert "show more" button present
- Assert clicking "show more" triggers `fetchExperiences(20)` call
- Assert clicking a row shows its `pageMd` content
- Assert clicking the row again hides the content
- Assert clicking a second row collapses the first

---

## Notes

`fetchExperiences` already accepts a `pageSize` number param. The existing `experienceSection.tsx` has prior art for the Dialog-based expand — use the same `MarkDownComponent` import but render inline instead of inside a Dialog.

The `.exp-row` currently has a `.box.now` marker on index 0 — preserve this styling on the first row regardless of expand state.

---

## Log

_Updated as work progresses._
