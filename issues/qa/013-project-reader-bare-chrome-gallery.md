---
id: issue-013
title: "Project reader page: bare chrome + gallery, drop engagement"
feature: single-page-json
status: qa
created_at: 2026-07-21
tags: [afk, p2]
---

# [013] Project reader page: bare chrome + gallery, drop engagement

**Type:** AFK
**Priority:** P2
**Blocked by:** 009
**User stories covered:** 9, 10, 11, 12, 16

---

## What to build

Update `ProjectReadPage`:

- Replace the `TerminalLayout` wrapper with a bare wrapper — no top nav, no footer. Keep `terminal-article.css` styling for the article body itself.
- Remove the "back to /work" link (that route no longer exists). Either drop it or point it at `/`, given no reader-page-specific mockup exists to dictate the correct treatment — pick whichever reads better in context and note the choice in the Log below.
- Remove `fetchEngagement`, `trackView`, `toggleHeart` calls entirely, and the associated heart button + view-count UI in the meta row and sidebar tools.
- Render the full `images: string[]` gallery (from issue 009's project data) instead of the single `data.imageUrl` hero image — including making every image openable in the existing `ImageLightbox`.
- Prev/next project navigation stays, sourced from `getProjects()` (already wired in issue 009) — no change needed here beyond confirming it still works with the new data source.
- Reader page keeps the site's default blue accent (`terminal-theme.css`) — do NOT apply the dashboard's amber override here (see PRD Further Notes: no mockup reviewed for this page, leaving it blue is the default).

---

## Acceptance criteria

- [x] No header/nav or footer renders on `/work/view/:title`
- [x] No heart button or view-count UI renders anywhere on the page
- [x] No `fetchEngagement`/`trackView`/`toggleHeart` calls happen
- [x] All entries in a project's `images` array render on the page, each openable in the lightbox
- [x] The dead "back to /work" link no longer points at a nonexistent route
- [x] Prev/next links still navigate to the correct adjacent project
- [x] Page still uses the default (blue) accent, not amber

---

## Tests required

Yes — per PRD Testing Decisions: assert no nav/footer landmarks render, assert no heart/view UI elements exist, assert every image in a fixture project's `images` array renders an `<img>`, assert prev/next links point at the correct adjacent project's URL. Follow the existing RTL + `MemoryRouter` pattern.

---

## Notes

- Reference: `issues/prd.md` — "Project reader page" section and Out of Scope ("no mockup exists for the reader page beyond removing chrome/engagement").
- This issue does not touch `DashboardSidebar`/`DashboardJourney`/`DashboardWorkGrid` — independent of issues 010–012, only depends on 009's data layer.

---

## Log

- Confirmed via `ProjectReadPage.tsx` and issue 009's Flagged section that the engagement removal (`fetchEngagement`/`trackView`/`toggleHeart` calls, heart button, view-count UI) was already done in issue 009 — no engagement code remained to remove. The "back to /work" link was also already fixed to `to="/"` / text "back to /" by issue 009 — no dead route remained.
- Remaining scope done here: removed the `TerminalLayout` wrapper (which pulled in nav/footer chrome via `useHomeConfig()`) from all three `ProjectReadPage` return paths, replacing it with a local `BareChrome` component (`.grid-bg` decoration + `.wrap` container only, no `<header>`/`<nav>`/`<footer>`), importing `terminal-mock.css`/`terminal-theme.css` directly since those were previously pulled in as a side effect of importing `TerminalLayout.tsx`. Changed the hero image render from `images[0]` only to mapping over the full `images` array inside a new `.agallery` wrapper, each image openable in the existing `ImageLightbox`. Added a matching `.agallery`/`.ahero` CSS tweak in `terminal-article.css` (flex column, gap) since hero was previously singular. Verified prev/next navigation logic (unchanged, already sourced from `getProjects()` per issue 009) and confirmed no amber override applies to this page (`terminal-theme.css` sets `--accent: var(--blue)` by default; nothing dashboard-scoped wraps this route).
- Tests: extended `src/app/module/terminal/__tests__/ProjectReadPage.test.tsx` with 4 new tests — multi-image gallery renders every entry and each is openable in the lightbox, no header/nav/footer landmarks render, no heart/view-count UI renders, and the back link points at `/` rather than a removed route. `npx vitest run src/app/module/terminal/__tests__/ProjectReadPage.test.tsx`: 8/8 pass. Full suite `npx vitest run`: 68 passed / 67 failed across 20 files — the same 9 pre-existing failing files as issue 009's log, all tracing to the pre-existing `IntersectionObserver`/framer-motion test-env bug from issue 001; no new failing files introduced. `npx tsc --noEmit`: no errors.
