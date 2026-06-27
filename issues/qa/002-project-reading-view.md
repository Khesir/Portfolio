---
id: issue-002
title: "Project reading view"
feature: terminal-reading-views
status: qa
created_at: 2026-06-27
tags: [afk, p1]
---

# [002] Project reading view

**Type:** AFK
**Priority:** P1
**Blocked by:** 001
**User stories covered:** 17–22

---

## What to build

Create `ProjectReadPage` — a terminal-styled reading view for individual projects — and wire it into the router in place of the old shared `ReadPage` for the `projects/view/:title` route.

This slice reuses `terminal-article.css` (landed in issue 001) and the updated `MarkDownComponent` (also from 001). The only thing that differs from `BlogReadPage` is the aside content and the prev/next ordering logic.

**Shell and layout**
Identical article shell to `BlogReadPage` (`TerminalLayout`, `.backlink`, `.ahead`, `.atitle`, `.ameta`, `.ahero`, `.alayout`). The breadcrumb reads `aj@khesir:~$ git show <slug>`. Back link navigates to `/projects`.

**Aside (desktop only, hidden < 960px)**
- `.pmeta-card` panel with "repository" heading and two links: "source ↗" using the `url` field (GitHub repo), "live demo ↗" using the `deployment` field. Each link is hidden when the respective field is absent.
- Heart button (`.htbtn`) below the meta card, wired to `toggleHeart` / `fetchEngagement`.

No ToC in the project aside — that is blog-only.

**Prev / next navigation**
Fetch the full projects list (`fetchProjects()`), sort pinned-first (matching the work page order), find the current item by `id`, derive adjacent items. Render `.anext` cards at the bottom. If no previous or next, that card is absent.

**Contact CTA**
"Let's build" CTA section at the bottom, matching the terminal CTA pattern used on `TerminalWorkPage`.

**Route change**
`projects/view/:title` is moved out of the `BaseLayout` route group and registered at the top level, rendering `ProjectReadPage` directly.

---

## Acceptance criteria

- [ ] Navigating to `/projects/view/<title>?id=<id>` renders the terminal article shell (no old Tailwind card UI).
- [ ] Article header shows project name, year, view count, heart count, and language tags.
- [ ] Hero image renders when `imageUrl` is present; absent otherwise.
- [ ] Markdown body renders with the same terminal prose styles as blog posts.
- [ ] Aside shows the `.pmeta-card` with "source" link when `url` is set; "source" link is absent when `url` is empty/null.
- [ ] Aside shows "live demo" link when `deployment` is set; absent when empty/null.
- [ ] Heart button in aside toggles the heart and updates the count.
- [ ] Aside is hidden on mobile (< 960px).
- [ ] Prev/next cards use pinned-first sort order matching the work list.
- [ ] Prev card absent when current project is first; next card absent when last.
- [ ] `← back to /work` link navigates to `/projects`.
- [ ] Page renders correctly in dev mode (mock data).
- [ ] Old `ReadPage` for `projects/view/:title` is no longer used.

---

## Tests required

Yes.

- Given a mock project API response, `ProjectReadPage` renders the project name, year, and language tags.
- "Source" link renders and points to `url` value; absent when `url` is falsy.
- "Live demo" link renders and points to `deployment` value; absent when `deployment` is falsy.
- Prev/next cards reflect pinned-first ordering of the mock project list.
- Heart button calls `toggleHeart` on click.

---

## Notes

- Do not duplicate `MarkDownComponent` — import it from wherever it was placed in issue 001.
- Pinned-first sort: `[...projects].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0))` before finding adjacent items.
- `fetchFeaturedProjects()` returns only pinned items — use `fetchProjects()` for the full list needed by prev/next.
- The project `id` comes from `item._id ?? item.id` (same pattern as `TerminalWorkPage`).

---

## Log

2026-06-27 — Implemented `ProjectReadPage.tsx`. Mirrors `BlogReadPage` shell with project-specific aside (`.pmeta-card` with conditional source/live-demo links, heart button below). Uses `data.languages` for tags, `fetchProjects()` with pinned-first sort for prev/next. Route moved from inside `BaseLayout` to top-level in `app.tsx`, replacing the old `ReadPage` entry.
