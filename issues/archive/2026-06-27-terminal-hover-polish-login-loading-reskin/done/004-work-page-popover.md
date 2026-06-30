---
id: issue-004
title: "Work page — project row popover"
feature: terminal-hover-polish
status: done
created_at: 2026-06-27
tags: [afk, p2]
---

# [004] Work page — project row popover

**Type:** AFK
**Priority:** P2
**Blocked by:** None
**User stories covered:** 2, 3, 4

---

## What to build

Port the hover popover preview system from the design prototype (`terminal-work.html`) into `TerminalWorkPage`. When the user hovers a project row in the "all projects" list, a floating card appears near the cursor showing the project's title, role, year, description, and tech tags.

**Popover structure** (single shared element, appended once):
- Terminal window chrome: traffic-light dots + "preview" label in titlebar
- Image placeholder area with project label and year badge
- Body: role label (monospace, accent color), serif title, description text, tag pills
- Footer: `./project` path on the left, `open ↵` in accent on the right

**Behaviour:**
- `mouseenter` on a `.proj` row — populate the popover from the row's data, position it 18px to the right of the cursor, show it (opacity 1, transform to natural position)
- `mousemove` — reposition to follow the cursor
- `mouseleave` — hide (opacity 0, slight downward translate)
- If the popover would overflow the right edge of the viewport, flip it to the left of the cursor instead
- Clamp vertically so it never goes off the top or bottom of the viewport

Each `.proj` row in the React component needs `data-title`, `data-role`, `data-year`, `data-desc`, and `data-tags` (comma-separated) attributes populated from API data. The popover and its inline styles live in a `<style>` block scoped to `TerminalWorkPage` — matching the design prototype exactly.

**Hidden on mobile** — the `.pop` element is `display: none` below 760px via CSS. No touch equivalent.

---

## Acceptance criteria

- [ ] Hovering a project row shows a populated popover card near the cursor
- [ ] The popover contains the correct title, role, year, description, and tags for the hovered row
- [ ] The popover follows the cursor on `mousemove`
- [ ] The popover flips to the left of the cursor when it would overflow the right viewport edge
- [ ] The popover is vertically clamped within the viewport
- [ ] `mouseleave` hides the popover
- [ ] The popover is not visible on viewports ≤ 760px
- [ ] Only one popover element exists in the DOM regardless of how many rows are on the page

---

## Tests required

Yes — mount `TerminalWorkPage` with mocked API data. Simulate `mouseenter` on first `.proj` row → assert `.pop` has `show` class and title/role/tags content matches mock. Simulate `mouseleave` → assert `show` is removed.

---

## Notes

- The popover uses `position: fixed` and is repositioned via inline `left`/`top` style on every `mousemove` — no React state, plain DOM manipulation, matching the design prototype's implementation.
- `data-tags` is a comma-separated string (e.g. `"React,Node,PostgreSQL"`) split and rendered as individual `.tag` spans inside the popover.
- Design reference: `terminal-work.html` — the inline `<style>` block (`.pop` rules) and `<script>` block (the IIFE) at the bottom of the file.

---

## Log

_Updated as work progresses._

## Log
Implemented on 2026-06-27. Ported popover system from design prototype to TerminalWorkPage. Added data-* attributes to .proj rows, single .pop DOM element, plain DOM event handlers in useEffect with cleanup.
QA approved by user on 2026-06-27.
