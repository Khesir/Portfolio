# PRD: Backend-free single-page portfolio (Khesir Home v2)

**Status:** Draft
**Date:** 2026-07-21

---

## Problem Statement

The portfolio currently depends on a remote backend (`VITE_API_URL`, Notion-backed content, a custom CMS) for every piece of content — projects, journey/experience, blogs, certifications, recommendations, home/about/service config. That backend does not exist as part of this repo and is a maintenance/hosting burden the owner (Khesir) no longer wants for a personal site. The site is also spread across a dozen routes (`/about`, `/blogs`, `/certifications`, `/recommendations`, `/experiences`, `/services`, `/skillset`, `/progress-report`, `/guest-book`, `/posts`, `/sandbox`, `/cms/*`) even though the actual content the owner cares about showing — who they are, their career journey, and their work — fits in one screen, per the new design mockup `Khesir - Home v2 (midfi).html`.

Additionally, the in-progress implementation of that new design (`TerminalDashboardPage` behind `VITE_HOME_LAYOUT=single`) does not match the mockup: wrong accent color (blue instead of amber), circular avatar instead of rounded-square, a flat list instead of a dotted timeline for the journey section, Contact rendered before Journey instead of after, and a uniform grid instead of a 2-column masonry work layout.

---

## Solution

1. Rebuild the dashboard/home screen (`TerminalDashboardPage` and its children) to pixel-match `Khesir - Home v2 (midfi).html`: amber accent scoped to this screen, rounded-square avatar, dotted timeline journey (current entry highlighted), Contact after Journey, 2-column masonry work grid with pinned (`feat`/star badge) and multi-image (`stack`/count badge) treatment.
2. Strip `app.tsx` down to two routes: `/` (the dashboard) and `/work/view/:title` (the project reader page). All other route registrations are removed; their module folders and code are left in place, untouched, just unreachable.
3. Rebuild the project reader page (`ProjectReadPage`) without the `TerminalLayout` nav/footer chrome (bare wrapper) and without the views/hearts engagement feature (no legitimate way to persist a shared counter without some backend, and a fake/local-only counter was rejected as more confusing than none).
4. Replace every remaining data dependency (projects, journey/experience) with static JSON files shipped in the frontend under a `data/` folder, read directly (no `axios`, no `VITE_API_URL`, no CMS, no mock/dev-branching indirection). Project data gains an `images: string[]` field to support the mockup's multi-image gallery badge and reader-page gallery.

---

## User Stories

1. As a visitor, I want to land on a single dashboard-style screen showing who Khesir is, their career journey, and their work, so that I don't have to click through multiple pages to get the essentials.
2. As a visitor, I want the profile avatar shown as a rounded-square image, so that the visual identity matches the intended brand design.
3. As a visitor, I want to see Khesir's career journey as a vertical timeline with the current role visually distinguished, so that I can quickly scan their progression and see what they're doing now.
4. As a visitor, I want the "Get in touch" contact block to appear after the journey timeline (not before it), so that the reading order matches profile → journey → contact.
5. As a visitor, I want the work section to show project cards in a 2-column masonry layout with the amber accent color, so that it matches the intended design instead of the current blue uniform-grid look.
6. As a visitor, I want to filter the work grid by category (All / Dev / Illustration / Tech Art), so that I can narrow down to the kind of work I'm interested in.
7. As a visitor, I want pinned projects visually marked with a star badge, so that I can see which work Khesir considers most representative.
8. As a visitor, I want projects with more than one image to show a "multiple images" badge, so that I know there's a gallery to explore.
9. As a visitor, I want to click a project card and land on a dedicated reader page for that project, so that I can read its full write-up.
10. As a visitor, I want the project reader page to show a bare page (no site navbar or footer), so that it reads like a focused article/reader view rather than a full site page.
11. As a visitor, I want the project reader page to show all of a project's images (not just one), so that I can see the full visual gallery for projects that have one.
12. As a visitor navigating the reader page, I want the "no more page-to-page navigation" reality reflected honestly — i.e. no leftover links to now-removed routes (`/about`, `/work`, `/blog` nav, "back to /work" link) — so that I never hit a dead link.
13. As the site owner, I want all content (projects, journey entries, profile info) to live in local JSON files inside the frontend, so that I can edit and redeploy the site without running or paying for a backend.
14. As the site owner, I want the previous CMS, API client, mock-data layer, and environment-based dev/prod branching removed from the data-fetching path, so that the codebase doesn't carry dead complexity for a backend that no longer exists.
15. As the site owner, I want the unused route modules (about, blogs, certifications, recommendations, experiences, services, skillset, progress, guest-book, posts, sandbox, cms) left on disk untouched, so that their code/content is available to revisit later without a git-archaeology exercise.
16. As the site owner, I want to avoid shipping a fake or non-persistent hearts/views counter, so that visitors are never shown numbers that don't mean anything.
17. As a developer maintaining this codebase, I want the new JSON-reading data functions to have the same call shape as the functions they replace (e.g. still return arrays/objects the components already expect), so that component code doesn't need a parallel rewrite beyond the data source swap.

---

## Implementation Decisions

### Routing (`src/app/app.tsx`)
- Remove all `<Route>` entries except: index route → `TerminalDashboardPage`, and `path="work/view/:title"` → `ProjectReadPage`.
- Remove the `VITE_HOME_LAYOUT` single/multi flag and `isSingleHomeLayout()` — the dashboard is now the only home, unconditionally.
- Remove the `ConditionalLoadingScreen`'s now-dead branches for `/cms` and `/services` (those routes no longer exist) — simplify to always wrap in `LoadingScreen`, or drop `LoadingScreen` entirely if it was only relevant for backend fetch latency (verify before removing — check whether `LoadingScreen` has other responsibilities beyond gating on network fetches).
- All removed feature module folders (`src/app/module/aboutme`, `blogs`, `certifications`, `dashboard` sibling pages not reused, `experiences`, `guestChat`, `notFound`, `posts`, `progress`, `recommendations`, `services`, `skillset`, `sandbox`, `src/app/cms/**`) stay on disk as-is. No file deletion in this pass.

### Data layer — new `data/` folder
- New directory (e.g. `src/data/`) holding hand-authored JSON:
  - `projects.json` — array of project records: `id`, `name`, `category` (`dev` | `illustration` | `tech-art`), `role` (display label for the pill, e.g. "tech art"), `description`, `tags: string[]`, `year`, `pinned: boolean`, `images: string[]` (first entry is the card thumbnail; empty/missing → existing placeholder pattern, not the mockup's labeled demo placeholder), `url?`, `deployment?`, `markdown` (reader-page body content).
  - `journey.json` — array of journey/experience entries: `yearRange` (display string, e.g. "2025 — Present"), `title`, `company`, `current: boolean` (drives the highlighted timeline dot), `description`, `skills: string[]`.
  - `profile.json` — `role`, `bio`, `location`, `contactEmail`, `socialLinks: {label, href}[]`, `status` (`online` | other), `avatarSrc`. The stylized brand wordmark ("Khe*sir*") is NOT data — it stays hardcoded JSX/CSS in the sidebar component, since it's a fixed brand identity, not editable content.
- New plain functions (not the old `fetch*` async/axios pattern) that import the JSON and return typed data synchronously, e.g. `getProjects()`, `getProjectById(id)`, `getFeaturedProjects()`, `getJourney()`, `getProfile()`. These replace `src/app/api/projects.ts`, the project-related parts of `src/app/api/cms.ts`/`experience.ts`, and `src/hooks/use-home-config.ts`'s home-config loading — keeping equivalent return shapes so consuming components need minimal changes beyond the import swap and dropping `await`/loading-state handling where it's no longer needed.
- Delete the now-dead indirection this replaces: `src/app/api/projects.ts`, `src/app/api/experience.ts`, `src/lib/apiCache.ts`, `src/lib/mockData.ts`, `src/hooks/use-environment-store.ts` usage for this data path, and the engagement/analytics/CMS-CRUD exports in `src/app/api/cms.ts` that only existed to serve the backend/CMS (auth, upload, blogs/certifications/recommendations/posts/analytics CRUD) — since their consuming routes are also being removed, they become dead code; remove them rather than leave unused exports behind (this differs from the "leave module folders alone" rule, which is about page/feature folders, not this now-orphaned API/lib plumbing that nothing will import anymore).
- `axios` dependency can be removed from `package.json` once nothing imports it (verify with a repo-wide search before removing).

### Dashboard screen (`TerminalDashboardPage` + children)
- Layout: two-column `grid-template-columns: 30% 70%` (matching the mockup exactly) inside a centered card — the current flex-based `.dashboard-shell` becomes a `display:grid` shell, and the outer page wrapper must horizontally *and* vertically center the card (`display:flex; align-items:center; justify-content:center` on the page container), which the current implementation is missing (only horizontal `margin:0 auto`).
- Accent color: scope `--accent: var(--amber); --accent-rgb: var(--amber-rgb);` to the dashboard shell's own selector (not global `:root`) so the rest of the site (e.g. the reader page, which keeps the default blue accent from `terminal-theme.css`) is unaffected.
- Sidebar (`DashboardSidebar`): avatar 46×46px, `border-radius: 12px` (rounded square, not circle); order becomes profile → status → bio → locale → divider → Journey → Contact (Contact moves after Journey, reversing current order).
- Journey (`DashboardJourney`): rebuilt as a vertical dotted timeline — a connecting vertical line, a dot per entry, the `current: true` entry's dot rendered in amber with a glow, each entry showing year range, title, company (amber), description, and skill tags. Reads from `getJourney()`.
- Work grid (`DashboardWorkGrid`): 2-column masonry (two flex/`.pcol` columns, items distributed across them — round-robin by filtered index is sufficient and matches the mockup's manual split closely enough), pinned project gets the `.feat` amber-tinted card treatment with a star "Pinned" badge (top-left, per mockup — current code puts it top-right with no icon), projects with `images.length > 1` get a stack-icon "×N" badge (top-right). Category filter tabs (`All`/`Dev`/`Illustration`/`Tech Art`) keep existing filter behavior, restyled to the mockup's amber "on" state. Card click still navigates to `/work/view/:title?id=...`.

### Project reader page (`ProjectReadPage`)
- Replace the `TerminalLayout` wrapper with a bare wrapper (no header/nav/footer). Reuse `terminal-article.css` styling for the article body, drop only the chrome.
- Remove the "back to /work" link (target route no longer exists) — replace with a link back to `/`, or drop it, since the design has no reader-page mockup to follow here (see Further Notes).
- Remove `fetchEngagement`, `trackView`, `toggleHeart` calls and the heart button/view-count UI entirely.
- Render all of `images: string[]` (gallery), not just a single `imageUrl`, including in the lightbox.
- Prev/next project navigation stays, now sourced from `getProjects()`.

### Removed
- `VITE_HOME_LAYOUT` env flag and its branch in `app.tsx`.
- Engagement (views/hearts) feature end-to-end: UI, API functions, types.
- CMS module (`src/app/cms/**`) stays on disk but is unreachable (no route) and its API surface in `cms.ts` is trimmed to dead code removal per above.

---

## Testing Decisions

- Good tests here assert observable behavior (rendered text, roles, hrefs, class states) against a given data/config shape — not internal implementation details — matching the existing pattern in `src/app/module/home/__tests__/terminalHomePage.test.tsx` and `src/app/module/services/__tests__/servicePage.test.tsx` (React Testing Library + `MemoryRouter`, mocking the data-source hook/module rather than the network).
- `src/app/module/dashboard/__tests__/` (already exists as an empty dir) — add/extend tests for:
  - `DashboardSidebar`: renders rounded-square avatar (assert class/style, not just presence), renders Journey before Contact in DOM order, renders profile fields from a given `profile.json`-shaped fixture.
  - `DashboardJourney`: renders one timeline row per entry, marks the `current: true` entry distinctly (e.g. a specific class), renders skills/company/description from fixture data.
  - `DashboardWorkGrid`: category filter shows/hides the correct cards, pinned card gets the pin badge, a project with `images.length > 1` gets the multi badge and one with exactly 1 doesn't, card click navigates to the expected `/work/view/:title?id=` URL (assert via a mocked `useNavigate` or by checking the rendered link/onClick target, following whatever pattern nearby tests already use for navigation assertions).
- New data-layer functions (`getProjects`, `getJourney`, `getProfile`, etc. in `src/data/` or wherever they land) are pure functions over an imported JSON fixture — test them directly with `vitest` (no rendering, no mocking needed) asserting shape and filtering/derivation logic (e.g. `getFeaturedProjects()` only returns `pinned: true` entries).
- `ProjectReadPage`: test that no nav/footer chrome renders, that heart/view UI is entirely absent, that all `images` render, and that prev/next links point at the correct adjacent project.
- `app.tsx`: a smoke test (or extend an existing one, if any covers routing) asserting that navigating to a removed path (e.g. `/about`) no longer renders the old page — this can be a `NotFoundPage`/wildcard fallback check, or simply asserting the route table only contains the two expected paths, whichever is cheaper to keep accurate over time.

---

## Out of Scope

- Reintroducing any backend, serverless function, or third-party managed service (Firebase/Supabase/etc.) for engagement tracking — explicitly rejected.
- Building out the about/skills/certifications/blog/recommendations/services/progress/guest-book/posts/sandbox/CMS features as sections of the single page — their route registrations are removed, their code stays but is not wired to anything, and no design exists yet for how (or whether) they'd fold into the one-page layout.
- A CMS or any authoring UI for editing the new local JSON — content is edited by hand-editing the JSON files in the repo.
- Deleting the now-unreachable module folders from disk — explicitly kept for later reference.
- Any design work for the project reader page beyond removing the nav/footer chrome and the engagement UI — no mockup was provided for the reader page itself, so its existing visual structure (article layout, meta row, prev/next, sidebar tools) is otherwise preserved as-is.
- Responsive/mobile design verification against the mockup — the mockup includes a `@max-width: 620px` stacked fallback; carry it over structurally but pixel-matching it wasn't part of the reviewed design discussion.

---

## Further Notes

- The reference design was originally shared as a bundled/exported artifact HTML (`Khesir Portfolio - Standalone.html`) that couldn't be statically read; the actual buildable source was retrieved via the Claude Design MCP from the "Portfolio" design project (`Khesir - Home v2 (midfi).html`), which is what this PRD is built against. That project also contains other home variants (`Khesir - Home.html`, `Khesir - Home v2 (lofi).html`, a `Khesir - Design System.html`) and per-page mockups (`terminal-about.html`, `terminal-work.html`, etc.) that may be useful reference if the "fold other sections into the single page" question comes back up later.
- The pinned-badge position differs between the mockup (top-left) and the current implementation (top-right) — implementation should follow the mockup (top-left).
- No decision was made on whether the project reader page (`/work/view/:title`) should also switch to the amber accent for visual consistency with the home screen it's linked from, or keep the site-default blue from `terminal-theme.css`. Current decision defaults to leaving it blue (unchanged) since no reader-page mockup was reviewed; revisit if the visual seam between amber home → blue reader page reads as inconsistent once built.
