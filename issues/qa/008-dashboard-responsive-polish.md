---
id: issue-008
title: "Dashboard responsive layout & visual/chrome parity polish"
feature: dashboard-home
status: qa
created_at: 2026-07-13
tags: [afk, p2]
---

# [008] Dashboard responsive layout & visual/chrome parity polish

**Type:** AFK
**Priority:** P2
**Blocked by:** 004, 005, 006, 007

---

## What to build

Final cross-cutting pass over `TerminalDashboardPage` once all content panels exist (issues 004–007):

- Implement the reference mockup's responsive breakpoint: below the mockup's defined width, the two-column layout (sidebar + work grid) reflows into a single scrollable column instead of the fixed two-pane card with internal scroll regions.
- Verify and finalize the themed thin-scrollbar styling on both internal-scroll regions (Journey list, Work grid) at all viewport sizes.
- Confirm final visual parity with the reference mockup: spacing, OKLCH color tokens, `Instrument Serif`/`JetBrains Mono` typography, card treatments — reusing the existing Terminal design system tokens already defined in the codebase (not new/duplicated values).
- Confirm no shared site chrome leaks in anywhere (no top nav, no footer) at any viewport size.

---

## Acceptance criteria

- [ ] Below the mockup's breakpoint, layout reflows to a single scrollable column
- [ ] Both internal-scroll regions use the themed scrollbar styling at all sizes
- [ ] No top nav or footer renders on `TerminalDashboardPage` at any viewport size
- [ ] Visual spacing/typography/color matches the reference mockup and reuses existing design tokens (no new duplicate CSS variables)

---

## Tests required

No automated test beyond what issues 004–007 already cover (this is primarily CSS/visual). Manual/visual review recommended before this issue moves out of QA, consistent with the project's existing visual-QA workflow for design-driven changes.

---

## Notes

- This issue intentionally comes last — it depends on all dashboard content panels existing so the responsive/visual pass can be judged holistically rather than piecemeal.
- Reference: `issues/prd.md` — "New module & page" section and "Further Notes".

---

## Log

_Updated as work progresses._

- Added base two-column `.dashboard-shell`/`.dash-sidebar` layout (flex 30/70, card container with `--radius`/`--shadow-lg` tokens) plus sidebar-internals styling (avatar, name/role, availability dot, bio, location, email, social row) to `src/css/terminal-dashboard.css` — these classes previously had zero CSS.
- Added themed thin scrollbars (`scrollbar-width: thin` + `::-webkit-scrollbar` accent-tinted thumb, transparent track) to `.dash-journey-list` and `.dash-work-grid`.
- Added `@media (max-width: 620px)` breakpoint: shell stacks to a single column, internal panel scroll (`max-height`/`overflow-y`) is relaxed to `overflow: visible` in favor of normal page scroll, work grid drops to 1 column.
- Flag: `terminal-mock.css`/`terminal-theme.css` (which define the real `--bg`/`--panel`/`--ink`/`--accent`/`--line`/`--serif`/`--mono` tokens) are not imported anywhere in the dashboard module chain — only `terminal-dashboard.css` is loaded, so all token references there resolve to their fallback values, not the real Terminal palette. Left as-is per scope instructions (no import added).
- Verified: `npx vitest run src/app/module/dashboard` → 26/26 passing; `npx tsc --noEmit` → clean.
- Orchestrator follow-up: applied the fix for the flagged token-import gap directly — added `import '../../../css/terminal-mock.css';` and `import '../../../css/terminal-theme.css';` to `TerminalDashboardPage.tsx` (same pattern as `TerminalLayout.tsx`), so `var(--accent)` etc. now resolve to the real Terminal palette instead of fallback values. Re-verified: 26/26 dashboard tests still pass, `tsc --noEmit` clean, no nav/footer landmarks introduced (importing CSS doesn't add DOM elements).
