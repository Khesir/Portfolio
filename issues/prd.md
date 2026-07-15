# PRD: Dashboard Home — single-screen profile + journey + work view

**Status:** Draft
**Date:** 2026-07-13

---

## Problem Statement

The current `/` (`TerminalHomePage`) is a long, vertically-scrolling page (hero/neofetch → stack → selected work → writing → certifications → recommendations → contact). A visitor who wants the essentials — who Khesir is, their career journey, and what they've built — has to scroll through several unrelated sections to piece it together, and the actual project list on `/work` is a flat text-row list with no visual preview grid or way to filter by discipline (dev / illustration / tech art).

A new design mockup ("Khesir Portfolio - Standalone.html", internal label `Home v2 — midfi`) proposes a single, non-scrolling dashboard screen that puts profile, career journey, and a filterable project grid in one view, replacing the current scrolling homepage experience.

---

## Solution

Build a new page, `TerminalDashboardPage`, that renders the two-pane dashboard from the mockup: a left sidebar (avatar, role, availability status, bio, location, a scrollable Journey timeline, and contact/social links) and a right panel (a "Work" heading with piece count, category filter tabs — All / Dev / Illustration / Tech Art — and a two-column card grid of projects with pinned and role badges). The page has no shared site chrome (no top nav, no footer) — it is rendered exactly as designed, standalone.

This page becomes the `/` route only when a new build-time flag, `VITE_HOME_LAYOUT=single`, is set. When unset or set to `"multi"` (the default), `/` continues to render the existing `TerminalHomePage` unchanged. The existing `/about`, `/work`, `/blog`, and detail routes are untouched and remain reachable in both modes, except that `/about` suppresses its own Journey section when `VITE_HOME_LAYOUT=single` (since Journey is now canonically shown on the dashboard).

`TerminalHomePage` and its sections (stack, writing, certifications, recommendations, hero/neofetch) are not deleted — they simply stop being mounted at any route when the flag is `"single"`.

A new `category` field (`'dev' | 'illustration' | 'tech-art'`) is added to projects so the filter tabs and per-card role badge have real data to work with, editable via a new `<select>` in the CMS project editor. This is a frontend + CMS change only — the `personal-backend` repo is a separate codebase and is out of scope; the field is expected to be stored there as a plain string column (no new table/enum type needed at the DB layer), and the CMS/frontend will treat it as a plain string.

---

## User Stories

1. As a visitor landing on `/` with the dashboard enabled, I want to see Khesir's profile (avatar, name, role, availability, bio, location) at a glance, so that I immediately understand who they are without scrolling.
2. As a visitor, I want to see a career Journey timeline in the same view as the profile, so that I can understand their background without navigating to a separate About page.
3. As a visitor, I want the Journey list to scroll independently within its own panel when it overflows, so that browsing my career history doesn't require scrolling the whole page.
4. As a visitor, I want to see all of Khesir's work in a visual card grid (not a flat text list) with thumbnail, title, description, tags, and year, so that I can quickly scan their portfolio.
5. As a visitor, I want pinned/featured work to be visually marked, so that I know which pieces the owner considers most representative.
6. As a visitor, I want to filter the work grid by category (All / Dev / Illustration / Tech Art), so that I can find the kind of work I'm interested in without scrolling past everything else.
7. As a visitor, I want the work grid to scroll independently within its own panel when it overflows, so that browsing the full portfolio doesn't require scrolling the whole page.
8. As a visitor, I want to reach a project's full detail page by clicking its card, so that I can read the complete case study.
9. As a visitor, I want contact and social links (email, Discord, X) sourced from the site's real configuration (not placeholder links), so that they actually work.
10. As a visitor on a narrow/mobile viewport, I want the dashboard to reflow into a single scrollable column, so that the experience remains usable on small screens.
11. As the site owner, I want the previous homepage (hero, stack, writing, certifications, recommendations) preserved in the codebase but not linked from anywhere, so that I don't lose the work already shipped and can restore it by flipping an env var if needed.
12. As the site owner, I want to control which homepage experience is live via a single build-time environment variable (`VITE_HOME_LAYOUT`), so that I can switch between the multi-page and single-dashboard experience per environment without a code change or redeploself.
13. As the site owner, I want `/about`, `/work`, `/blog`, and all detail pages to keep working exactly as they do today regardless of which homepage mode is active, so that existing deep links and site navigation aren't broken.
14. As the site owner, I want `/about`'s Journey section hidden automatically when the dashboard is live, so that I don't maintain (or visually duplicate) the same career history in two places.
15. As the site owner, I want to assign a category (Dev / Illustration / Tech Art) to each project from the CMS, so that the dashboard's filter tabs and role badges reflect real, intentional categorization rather than guesswork.
16. As the site owner, I want projects created before this change (with no category set) to still appear under "All" without breaking the page, so that I don't have to backfill data before this ships.
17. As a developer, I want the new dashboard page isolated in its own module (`src/app/module/dashboard/`), so that it doesn't get tangled with the existing `home` or `terminal` module's components, which have different layouts and data needs.
18. As a developer, I want the env-flag read in one place per concern (routing choice, About's Journey visibility) rather than scattered inline checks, so that the flag's behavior is easy to audit and test.

---

## Implementation Decisions

**New module & page**
- New module `src/app/module/dashboard/` containing `TerminalDashboardPage.tsx` and its own subcomponents for the sidebar (profile + Journey) and the work grid (filterable card list). These are new components, not extensions of `terminalProjectsSection.tsx` or `TerminalWorkPage.tsx`, since the layout, card design, and interaction model (internal scroll regions, masonry-style two-column grid, filter tabs) differ substantially from both existing implementations.
- `TerminalDashboardPage` renders with no shared chrome — it does not use `TerminalLayout` (no top nav, no footer). It is visually a centered card matching the mockup's proportions and internal structure (30/70 split, internal scroll on both the Journey list and the Work grid, filter tabs, two-column card masonry, responsive single-column stacking below the mockup's existing `620px` breakpoint).
- Data sources reuse existing hooks/APIs: `useHomeConfig`/`useAboutConfig` for profile, avatar, bio, location, status, and contact/social data; `fetchExperiences` for Journey; `fetchFeaturedProjects` + `fetchProjects` for the Work grid (fetched without pagination — all pinned and all non-pinned projects loaded in one pass, since the panel relies on internal scroll rather than a show-more control, matching the mockup's design).
- Journey items in the dashboard sidebar are static (no click-to-expand), unlike `/about`'s Journey rows which expand inline to show `pageMd`. This intentionally differs from `/about`'s interaction model to match the mockup as designed.
- Contact/social section is wired to `config.socialLinks` and the real contact email instead of the mockup's placeholder `href="#"` links.

**Routing / feature flag**
- New build-time env var `VITE_HOME_LAYOUT`, values `"multi"` (default/current behavior) or `"single"`. Read via `import.meta.env.VITE_HOME_LAYOUT`.
- In `App`'s router, the index (`/`) route renders `TerminalDashboardPage` when the flag is `"single"`, otherwise renders the existing `TerminalHomePage` (current behavior, unchanged).
- All other routes (`/about`, `/work`, `/blogs`, `/work/view/:title`, `/blogs/view/:title`, etc.) are unaffected by the flag and continue to render exactly as they do today, with one exception: `TerminalAboutPage` reads the same flag and omits its own "journey" section (`03 — journey`, including its section-list numbering) when the flag is `"single"`, since Journey becomes canonical on the dashboard. When the flag is `"multi"`, `/about` renders its Journey section exactly as it does today.
- `TerminalHomePage` and its child sections (`TerminalStackSection`, `TerminalProjectsSection`, `TerminalWritingSection`, `TerminalCertificationsSection`, `TerminalRecommendationsSection`) are not modified or removed — they simply become unreachable via routing when the flag is `"single"`.

**Project category field**
- New field `category` on the project data model: one of `'dev' | 'illustration' | 'tech-art'`, optional (existing/legacy projects may have it unset).
- CMS: `CmsProjectEditor` gets a new `<select>` input (fixed 3 options, matching the enum) alongside the existing fields (`name`, `releasedDate`, `imageUrl`, `languages`, `url`, `deployment`, `markdown`, `draft`, `pinned`), included in the save payload as `category`.
- Frontend dashboard: the Work grid's filter tabs (All / Dev / Illustration / Tech Art) filter client-side on `project.category`; the "All" tab is selected by default and shows every project regardless of category (including ones with no category set). Selecting a specific category tab hides projects whose `category` doesn't match, including uncategorized ones.
- The same `category` value is displayed as the card's role-pill text (rendered as "Dev" / "Illustration" / "Tech Art"), replacing the mockup's more varied freeform labels ("web app", "backend", "tooling", etc.) — no separate freeform "role" field is introduced.
- Backend/database change (adding the `category` column) is explicitly out of scope for this repo/PRD — it lives in the separate `personal-backend` repository. The expectation communicated to that work: a plain string column on the existing projects table, no new table or DB-level enum required, since validation of the 3 allowed values happens at the CMS/frontend layer.

**Pinned badge & scope trims**
- The mockup's "PINNED" badge is real and implemented as-is, sourced from the existing `pinned` boolean already used on `/work`.
- The mockup's multi-image/gallery count badge is dropped — projects only support a single `imageUrl` today, and adding gallery support is out of scope for this PRD.

---

## Testing Decisions

Tests should assert on rendered output and user-facing behavior (what's on screen, what happens on interaction), not internal implementation details — consistent with the existing component test style in `terminalWorkPage.test.tsx` and `terminalHomePage.test.tsx` (React Testing Library + Vitest, mocking hooks/API modules, `MemoryRouter` wrapper).

- **`TerminalDashboardPage`** (new test file in `src/app/module/dashboard/__tests__/`): mock `useHomeConfig`/`useAboutConfig`, `fetchExperiences`, `fetchFeaturedProjects`, `fetchProjects`. Cover:
  - profile/bio/status/location render from config
  - Journey entries render from `fetchExperiences`, with no expand-on-click behavior
  - Work grid renders pinned projects with a pinned indicator, and non-pinned projects without one
  - clicking a category filter tab shows only matching projects (plus verifying "All" shows everything, including uncategorized projects)
  - clicking a project card navigates to its detail route (same pattern as `TerminalWorkPage`'s row click)
  - no nav or footer elements are present (asserting absence of `TerminalLayout`'s brand link/nav landmarks)
- **Routing (`App` / index route)**: test that `VITE_HOME_LAYOUT=single` (via `vi.stubEnv`) renders `TerminalDashboardPage` at `/`, and that `"multi"` or unset renders `TerminalHomePage` at `/` (current default behavior must not regress).
- **`TerminalAboutPage`** (extend existing `terminalAboutJourney.test.tsx` / `terminalAboutPage.test.tsx`): test that the Journey section is present when `VITE_HOME_LAYOUT` is `"multi"`/unset, and absent when `"single"`.
- **`CmsProjectEditor`**: test that selecting a category option includes `category` in the save payload, and that an existing project with a saved category pre-selects it on load.

---

## Out of Scope

- Any change to the `personal-backend` repository (schema/migration for the `category` column, API validation, etc.) — noted as a follow-up handoff, not implemented here.
- Multi-image/gallery support for projects (the mockup's image-count badge).
- Any change to `TerminalHomePage`'s internal sections (stack, writing, certifications, recommendations, hero/neofetch) — they are preserved as-is, only unmounted from routing.
- Click-to-expand detail view for Journey items on the dashboard (remains an `/about`-only interaction).
- Show-more/pagination controls on the dashboard's Work grid (relies on internal scroll instead, per the mockup).
- A UI-level (in-app) toggle for switching homepage layouts — this is a build-time env var only, not a runtime/user-facing setting.
- Removing or redirecting `/about` or `/work` as standalone routes — they remain reachable in both layout modes.
- Any top-nav/footer chrome on the dashboard page — intentionally omitted to match the mockup exactly.

---

## Further Notes

- The reference mockup (`Khesir Portfolio - Standalone.html` at the repo root) is a self-contained, bundled static export (not directly readable as source) — its actual markup/CSS was extracted by decoding its embedded `__bundler/template` payload during design review. It should be treated as the visual source of truth for spacing, color tokens (already aligned with the existing Terminal design system's OKLCH palette and `Instrument Serif`/`JetBrains Mono` fonts), and structure, but its inline demo copy, placeholder links, and fabricated `data-cat`/multi-image attributes are not meant to be copied literally — they're replaced by real config/API data per the decisions above.
- Because `/about` and the new dashboard both source Journey data from `fetchExperiences`, any future change to that API's shape affects both surfaces.
