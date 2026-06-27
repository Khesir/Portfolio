---
id: issue-001
title: "Blog reading view"
feature: terminal-reading-views
status: qa
created_at: 2026-06-27
tags: [afk, p1]
---

# [001] Blog reading view

**Type:** AFK
**Priority:** P1
**Blocked by:** None
**User stories covered:** 1–16

---

## What to build

Create `BlogReadPage` — a terminal-styled reading view for individual blog posts — and wire it into the router in place of the old shared `ReadPage` for the `blogs/view/:title` route.

This slice also brings `terminal-article.css` into the project and updates `MarkDownComponent` with terminal prose renderers and the `.codeblock` terminal window wrapper for code blocks. These shared pieces are foundational for the project reading view (issue 002).

**Shell and layout**
The page renders inside `TerminalLayout` (no `BaseLayout`). Top of page has a `← back to /blog` link (`.backlink`). Below that is the article header: terminal breadcrumb (`aj@khesir:~$ cat ./blog/<slug>.md`), large serif title (`.atitle`), meta row (`.ameta`) with date, read time, views, hearts, then tags as `.tag` pills. Below the header, a 21:9 hero image (`.ahero`) when `imageUrl` is present. Then the two-column `.alayout` grid: article body on the left column, sticky aside on the right.

**Aside (desktop only, hidden < 960px)**
- Heart button (`.htbtn`) wired to `toggleHeart` / `fetchEngagement`. Shows heart count.
- Table of contents (`.toc`) — functional: parse `##` and `###` lines from the raw markdown string before render, produce `{ level, text, id }` entries, render as anchor links in the aside.

**Markdown rendering**
`MarkDownComponent` is updated with new custom renderers matching `terminal-article.css` prose rules:
- `h2`: serif, with a leading `<span class="hh">` number prefix (01, 02 … derived from order) and `id` injected for ToC anchor linking.
- `h3`: mono, with `id` injected.
- `p`: `.article p` style (ink-2, 1.72 line-height).
- `blockquote`: left border accent, serif italic.
- `ul` / `ol`: custom `›` bullet and decimal-leading-zero counter via CSS classes; no native list markers.
- `a`: accent underline style.
- `img`: rounded border, margin.
- Inline `code`: amber tint, border, no background highlight.
- Fenced code block: wrapped in `.codeblock` shell (dark bar with traffic-light dots `#ff5f57 / #febc2e / #28c840`, language label, `#0e0d13` background) around `react-syntax-highlighter` output. Theme approximates terminal palette (blue keywords, amber functions, plum types, muted comments).

**Prev / next navigation**
On mount, fetch the full blog list (`fetchBlogs()`), find the current item by `id` from the URL search param, and derive the previous and next items. Render both as `.anext` cards at the bottom of the page. If no previous or next exists, that card is absent/disabled.

**Contact CTA**
"Stay in the loop" CTA section at the bottom, matching the terminal CTA pattern already used on `TerminalBlogPage`.

**Route change**
`blogs/view/:title` is moved out of the `BaseLayout` route group and registered at the top level (same pattern as `TerminalBlogPage`), rendering `BlogReadPage` directly.

---

## Acceptance criteria

- [ ] Navigating to `/blogs/view/<title>?id=<id>` renders the terminal article shell (no old Tailwind card UI).
- [ ] Article header shows title, date, read time, view count, heart count, and tags.
- [ ] Hero image renders when `imageUrl` is present; no placeholder shown when absent.
- [ ] Markdown body renders with terminal prose styles: serif body text, numbered h2 with `.hh` prefix, mono h3, `›` list bullets, accent blockquote, amber inline code, `.codeblock` fenced code.
- [ ] Syntax highlighting inside code blocks matches terminal palette colors.
- [ ] Aside is visible on desktop and hidden on mobile (< 960px).
- [ ] ToC lists all `##` and `###` headings as anchor links; clicking a link scrolls to the correct heading.
- [ ] Heart button in aside toggles the heart and updates the count.
- [ ] Prev card shows the previous post's title and links to it; absent when current post is first.
- [ ] Next card shows the next post's title and links to it; absent when current post is last.
- [ ] `← back to /blog` link navigates to `/blogs`.
- [ ] Page renders correctly in dev mode (mock data).
- [ ] Old `ReadPage` for `blogs/view/:title` is no longer used.

---

## Tests required

Yes.

- Given a mock blog API response, `BlogReadPage` renders the title, date, read time, and tags in the header.
- When `imageUrl` is present, the hero image is rendered; when absent, no image element appears.
- ToC renders one anchor link per `##` / `###` heading found in the markdown string.
- Prev/next cards render correct titles from the adjacent items in the mock list; first item has no prev card, last item has no next card.
- Heart button calls `toggleHeart` on click.

---

## Notes

- `terminal-article.css` should be placed in `src/css/` and imported only by `BlogReadPage` (and reused by `ProjectReadPage` in issue 002).
- `MarkDownComponent` update is shared — issue 002 will reuse the same updated component; avoid duplicating renderers.
- The floating `StickyHeart` is removed from reading views; the aside heart replaces it on desktop.
- The `.alayout` grid is `1fr minmax(0, 720px) 1fr` — article body is in column 2, aside in column 3.
- Traffic-light dot colors are hardcoded per the design: `#ff5f57`, `#febc2e`, `#28c840`.
- `ApiCache` is already in place — `fetchBlogs()` on mount for prev/next will not cause extra network hits after the first load.

---

## Log

**2026-06-27** — Implementation complete.

- Created `src/css/terminal-article.css` with all article view styles (backlink, ahead, atitle, ameta, ahero, alayout, article prose, codeblock, anext, aside-tools, pmeta-card).
- Created `src/app/module/terminal/BlogReadPage.tsx` — terminal-styled reading view inside `TerminalLayout`. Fetches blog by ID, tracks view on mount, fetches engagement (views/hearts), fetches full blog list for prev/next navigation. Parses `##`/`###` headings from raw markdown for sidebar ToC. Heart button wired to `toggleHeart`.
- Updated `MarkDownComponent` in `src/app/_components/readPage/readingPage.tsx` with terminal prose renderers: numbered `h2` with `.hh` prefix and scroll-target `id`, `h3` with `id`, bare `p`/`ul`/`ol`/`li`/`blockquote` (CSS handles all styling), `.codeblock` terminal window wrapping `SyntaxHighlighter` with `oneDark`, inline `code` with no className (`.article code` CSS handles amber tint). Switched syntax highlighter theme from `xonokai` to `oneDark`.
- Updated `src/app/app.tsx`: removed `blogs/view/:title` from `BaseLayout` group; added as top-level route rendering `BlogReadPage` (same pattern as `TerminalBlogPage`).
