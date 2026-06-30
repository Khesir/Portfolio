---
id: issue-003
title: "Work page — featured card hover"
feature: terminal-hover-polish
status: done
created_at: 2026-06-27
tags: [afk, p1]
---

# [003] Work page — featured card hover

**Type:** AFK
**Priority:** P1
**Blocked by:** None
**User stories covered:** 1

---

## What to build

Add hover treatment to the `.feature` card on the work page (`TerminalWorkPage`). Currently the card has no transition or hover state — it sits flat while the `.proj` rows below it already lift and brighten on hover.

Two CSS changes to `terminal-theme.css`:

1. Add `transition: border-color .18s, transform .18s, box-shadow .18s` to the existing `.feature` rule.
2. Add `.feature:hover` — lift `translateY(-3px)`, border brightens to `rgba(var(--accent-rgb),.4)`, and append `0 0 40px rgba(var(--accent-rgb),.12)` to `var(--shadow-lg)` for a subtle radial glow.

This is slightly stronger than the `.proj` row hover (which lifts 2px) because the featured card deserves more visual weight.

---

## Acceptance criteria

- [ ] Hovering the featured card lifts it 3px and brightens its border to accent at 40% opacity
- [ ] A faint accent glow appears behind the card on hover
- [ ] The transition is smooth at 180ms on all three properties
- [ ] No layout shift — surrounding content does not move on hover
- [ ] `.proj` row hover behaviour is unchanged

---

## Tests required

No — pure CSS change. Verify visually during QA.

---

## Notes

- Only `terminal-theme.css` is modified. No component changes needed.
- The `.feature` card is already `cursor: pointer` via the `onClick` in `TerminalWorkPage` — the hover visual now matches that intent.
- Design reference: `terminal-work.html` in the claude.ai/design project (featured card section).

---

## Log

_Updated as work progresses._

## Log
Implemented on 2026-06-27. Added transition and .feature:hover rule to terminal-theme.css — lift 3px, accent border, radial glow.
QA approved by user on 2026-06-27.
