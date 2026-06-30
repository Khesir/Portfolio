---
id: issue-001
title: "LoadingScreen — terminal reskin + blogs prefetch"
feature: terminal-hover-polish
status: done
created_at: 2026-06-27
tags: [afk, p1]
---

# [001] LoadingScreen — terminal reskin + blogs prefetch

**Type:** AFK
**Priority:** P1
**Blocked by:** None
**User stories covered:** 5, 6, 7, 8

---

## What to build

Replace the current Framer Motion + Tailwind markup inside `LoadingScreen` with the terminal card aesthetic from the design prototype (`terminal-cms-loading.html`). Create a new `terminal-cms-gate.css` file containing the shared `.tcard`, `.tc-bar`, `.bstep`, `.boot-*`, `.cursor`, and progress bar rules — this stylesheet will be shared with `CmsLoginGate` in issue 002.

The boot sequence should run four real steps sequentially:

1. `prefetchAll()` — label: "Profile & config"
2. `fetchProjects()` — label: "Featured projects"
3. `fetchBlogs()` — label: "Content & writing"
4. Synthetic 300ms — label: "Mounting routes"

Each step transitions its `.bstep` from `pending → active → done` as its fetch resolves. The progress bar fills incrementally: ~30% after step 1, ~55% after step 2, ~80% after step 3, 100% after step 4. The log line and percentage text update to match.

After step 4, the terminal card fades out and children (the actual page) are revealed.

Add `.bstep.done:hover` — faint `rgba(255,255,255,.03)` background highlight on done steps only. Active and pending steps have no hover response.

The exit animation should be a simple CSS opacity fade (~300ms) on the card, not the split-panel wipe from the current Framer Motion implementation. Framer Motion can be kept or removed — whichever is cleaner after the reskin.

---

## Acceptance criteria

- [ ] First load shows a terminal card (dark background, traffic-light dots, monospace font) instead of the generic white card
- [ ] Four boot steps appear sequentially, each transitioning pending → active → done as its real fetch resolves
- [ ] Progress bar and percentage text advance in sync with step completion
- [ ] `fetchBlogs` is called during boot and its result is cached so `TerminalBlogPage` does not double-fetch
- [ ] Hovering a `done` step shows a faint background highlight; active and pending steps have no hover effect
- [ ] After all steps complete the terminal card fades out and the requested page renders
- [ ] `terminal-cms-gate.css` exists and contains all shared `.tcard`, `.bstep`, and `.boot-*` rules

---

## Tests required

Yes — render `LoadingScreen` with mocked `prefetchAll`, `fetchProjects`, `fetchBlogs` resolving immediately. Assert all four steps gain `done` class. Assert children are visible after exit. Follow existing component test patterns.

---

## Notes

- `prefetchAll` (in `use-home-config.ts`) already deduplicates via module-level promise cache — no changes needed there.
- `fetchBlogs` should be wrapped with the same deduplication pattern (or use `ApiCache`) so `TerminalBlogPage` hits the cache on mount.
- The `.tcard` shell and `.bstep` rules created here will be imported by `CmsLoginGate` in issue 002 — keep them generic enough to cover both use cases.
- Design reference: `terminal-cms-loading.html` in the claude.ai/design project.

---

## Log

_Updated as work progresses._

## Log
Implemented on 2026-06-27. Replaced Framer Motion/Tailwind LoadingScreen with terminal card aesthetic. Created terminal-cms-gate.css with shared .tcard/.bstep/.login-* rules. Added fetchBlogs as step 3. Exit via CSS fade animation.
QA approved by user on 2026-06-27.
