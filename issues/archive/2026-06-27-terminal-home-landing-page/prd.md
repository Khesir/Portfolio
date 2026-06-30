# PRD: Terminal Home Landing Page

**Status:** Draft
**Date:** 2026-06-26

---

## Problem Statement

The current homepage (`/`) sits inside `BaseLayout` and renders a generic light/dark Tailwind-styled card layout — profile image, CTA, pinned projects, recent micro-posts, and a contact block. It does not reflect the intended terminal-themed visual identity of the portfolio and conflicts with the `Banner` component's own hero rendering at `/`. The design direction chosen is "Direction B — Terminal," a dark full-page layout with a neofetch-style hero, accent-color theming, and monospace typography throughout.

---

## Solution

Replace the existing homepage with a standalone terminal-themed landing page that is rendered outside `BaseLayout`. The page is built as a React component with the designer's `terminal.css` and `mock.css` brought in as-is (scoped to avoid leaking into the rest of the app). Content is sourced from existing CMS hooks and API fetches. The theme dock (preview-only color switcher) is excluded from production.

---

## User Stories

1. As a visitor, I want to see a dark terminal-themed landing page so that the portfolio's visual identity is immediately clear.
2. As a visitor, I want to see the portfolio owner's name, role, and blurb in the hero so that I understand who this is within seconds.
3. As a visitor, I want to see a neofetch-style terminal window in the hero so that the terminal aesthetic is reinforced interactively.
4. As a visitor, I want to see the owner's profile image inside the neofetch window so that I can put a face to the name.
5. As a visitor, I want to see an "available for work" badge in the header that reflects the CMS status so that I know at a glance whether the owner is open to opportunities.
6. As a visitor, I want to click "View work →" to navigate to the projects page so that I can explore featured work.
7. As a visitor, I want to click "$ cat about.me" to navigate to the about page so that I can read the owner's full story.
8. As a visitor, I want to see the tech stack displayed in categorized rows with chip labels so that I understand what technologies the owner works with.
9. As a visitor, I want the tech stack rows and chips to come from the CMS about config's `technicalSkills` so that they stay current without a redeploy.
10. As a visitor, I want to see up to 3 featured (pinned) projects listed in numbered rows so that I can quickly scan the most important work.
11. As a visitor, I want each project row to show its name, type label, description, tech tags, and year so that I can evaluate it without clicking through.
12. As a visitor, I want to click a project row and navigate to its detail page so that I can read more.
13. As a visitor, I want to see an "all projects →" link that navigates to `/projects` so that I can explore the full portfolio.
14. As a visitor, I want to see up to 3 recent blog articles listed in a writing section so that I can find content to read.
15. As a visitor, I want each blog row to show its date, title, first tag as category, and read time so that I can decide whether to read it.
16. As a visitor, I want to click a blog row and navigate to its detail page so that I can read the article.
17. As a visitor, I want to see an "all posts →" link that navigates to `/blogs` so that I can browse all writing.
18. As a visitor, I want to see a contact CTA section at the bottom with the owner's email so that I can reach out easily.
19. As a visitor, I want the contact email to link to `mailto:` so that I can start an email in one click.
20. As a visitor, I want to see social icon links in the CTA area so that I can find the owner on other platforms.
21. As a visitor, I want a nav bar with links to Home, About, Work, and Blog so that I can navigate the site from any scroll position.
22. As a visitor, I want the currently active nav link to be visually highlighted so that I know which page I am on.
23. As a visitor, I want a grid background and radial gradient that use the accent color so that the page feels atmospheric and designed.
24. As a visitor, I want the page to be responsive on mobile so that it is usable on small screens (hero stacks vertically, nav collapses).
25. As a visitor, I want Google Fonts (JetBrains Mono, Instrument Serif, Space Grotesk) to be preloaded so that the typography renders correctly without flash.

---

## Implementation Decisions

- **Standalone route:** The terminal homepage is registered at `/` outside the `<Route element={<BaseLayout />}>` wrapper in `app.tsx`, mirroring how `SandBoxPage` is mounted. This gives the page full-page control (its own header, grid background, footer) without inheriting `Banner`, `Layout`, or the dark/light mode toggle.

- **CSS strategy:** `terminal.css` and `mock.css` from the designer's files are added verbatim to `src/css/`. They are imported inside the terminal homepage component file only, not in a global entrypoint, so their custom property declarations and class names do not leak into the rest of the app's Tailwind-based styles.

- **Fonts:** The three Google Fonts (`Instrument Serif`, `Space Grotesk`, `JetBrains Mono`) are added as `<link rel="preconnect">` and `<link rel="stylesheet">` tags in `index.html`, matching the designer's original markup.

- **Hero data:** `useHomeConfig()` provides `name`, `role`, `description`, `contactEmail`, `status`, and `profileImageUrl`. The `status` field drives the "available for work" badge visibility and dot color. `profileImageUrl` (with fallback to `/img/Mee.png`) is used in both the brand logo and the neofetch avatar.

- **Neofetch window:** The neofetch rows (Role, Uptime, Editor, Lang, Stack, Locale) are partially dynamic. `role` comes from `useHomeConfig()`. Other rows (Editor, Uptime) are hardcoded as they have no CMS equivalent. The window is purely decorative/presentational.

- **Tech stack section:** Uses `useAboutConfig().config.technicalSkills` — an array of `{ category: string, items: string[] }`. Each entry renders as one stack row: `category` as the left label, `items` as the right chips. This maps directly to the design's two-column `stack-row` layout.

- **Projects section:** Calls `fetchFeaturedProjects()` directly (same fetch as the existing `TopProjects` component), filters for `pinned === true`, takes the first 3. Each project is rendered using the terminal `.proj` markup (index number, name, type badge, description, tags, year). Clicking navigates to `/projects/view/:name?id=:id`.

- **Writing section:** Calls `fetchBlogs()` directly (same fetch as `BlogList`), takes the first 3 results. Each blog is rendered using the terminal `.post` markup (date formatted as `YYYY.MM.DD`, title, first tag as category chip, `minRead` + " min"). No description blurb is shown — blogs have no description field. Clicking navigates to `/blogs/view/:name?id=:id`.

- **Social links:** The four social icon links in the CTA section use `href="#"` as placeholders. No CMS field exists for social URLs in the current scope.

- **Theme dock:** Excluded entirely. The fixed accent-color switcher and heading font toggle from the designer's file are preview-only tools and are not implemented.

- **Nav links:** Map to existing React Router routes — `~/home` → `/`, `/about` → `/about`, `/work` → `/projects`, `/blog` → `/blogs`. Active state is determined by comparing current route.

---

## Testing Decisions

- **What makes a good test:** Tests should verify externally observable behavior — what renders given certain data states — not internal implementation (hooks called, state shape). Prefer testing the rendered output and user interactions.

- **Modules to test:**
  - The terminal homepage component: verify it renders the hero name/role from `useHomeConfig`, renders stack rows from `useAboutConfig`, renders project cards from `fetchFeaturedProjects`, renders blog rows from `fetchBlogs`, and shows the contact email.
  - Nav active state: verify the correct nav link receives the active class at `/`.
  - Status badge: verify the badge renders when `status.type === 'online'` and changes label/color correctly.

- **Prior art:** The existing component tests in the project mock CMS API calls and assert on rendered text. The same pattern (mock `fetchBlogs`, `fetchFeaturedProjects`, `useHomeConfig`, `useAboutConfig` at the module boundary, render the component, assert on visible text and links) applies here.

---

## Out of Scope

- Implementing the About, Work, or Blog pages in the terminal design — only the landing page (`/`) is in scope.
- CMS changes: no new fields, no new endpoints, no schema changes.
- The bento status widgets (osu!, reading card, status card) — commented out in the designer's file and flagged as CMS feature-flag dependent.
- The theme dock accent color switcher and heading font toggle.
- Social link CMS management — URLs remain `href="#"` placeholders.
- Animations or typing effects in the terminal window.
- Any page transitions or scroll animations beyond what the CSS provides.

---

## Further Notes

- The designer's file includes a `<template id="__bundler_thumbnail">` block used by the design tool's preview. This is not rendered by browsers and should be omitted from the React implementation.
- The `data-screen-label="Home"` attribute on `<body>` in the design file is also a design tool artifact — not needed.
- Image asset `assets/Mee.png` in the design maps to `/img/Mee.png` in this project's `public/` directory.
- The `dateParser` utility already exists in `src/lib/utils.ts` but formats dates differently. A local formatter producing `YYYY.MM.DD` output will be needed for the writing section.
