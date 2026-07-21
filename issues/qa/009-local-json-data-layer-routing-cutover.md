---
id: issue-009
title: "Local JSON data layer + routing cutover"
feature: single-page-json
status: qa
created_at: 2026-07-21
tags: [afk, p1]
---

# [009] Local JSON data layer + routing cutover

**Type:** AFK
**Priority:** P1
**Blocked by:** None
**User stories covered:** 1, 13, 14, 17

---

## What to build

Introduce a new local data layer under a `data/` folder in the frontend (e.g. `src/data/`) holding hand-authored JSON:

- `projects.json` — array of: `id`, `name`, `category` (`dev` | `illustration` | `tech-art`), `role` (pill label, e.g. "tech art"), `description`, `tags: string[]`, `year`, `pinned: boolean`, `images: string[]` (first entry is the card thumbnail; empty/missing falls back to the existing placeholder pattern), `url?`, `deployment?`, `markdown` (reader-page body).
- `journey.json` — array of: `yearRange` (display string, e.g. "2025 — Present"), `title`, `company`, `current: boolean`, `description`, `skills: string[]`.
- `profile.json` — `role`, `bio`, `location`, `contactEmail`, `socialLinks: {label, href}[]`, `status`, `avatarSrc`. The stylized brand wordmark ("Khe*sir*") is NOT data — keep it hardcoded JSX/CSS wherever it's rendered.

Add plain (non-async-fetch) functions that import this JSON and return typed data synchronously: `getProjects()`, `getProjectById(id)`, `getFeaturedProjects()`, `getJourney()`, `getProfile()`. Keep return shapes close to what `DashboardSidebar`, `DashboardJourney`, `DashboardWorkGrid`, and `ProjectReadPage` already consume, so this issue is a data-source swap, not a component rewrite — visual output should be unchanged by this issue (later issues handle the redesign).

Wire those four components to the new functions instead of `fetchProjects`/`fetchFeaturedProjects`/`fetchProjectsByID`/`fetchExperiences`/`useHomeConfig`/`useAboutConfig`.

Strip `src/app/app.tsx` down to two routes: the index route → `TerminalDashboardPage`, and `path="work/view/:title"` → `ProjectReadPage`. Remove every other `<Route>` entry. Remove the `VITE_HOME_LAYOUT` env flag and `isSingleHomeLayout()` — the dashboard becomes the unconditional home. Simplify `ConditionalLoadingScreen` since `/cms` and `/services` no longer exist as routes (verify `LoadingScreen`'s purpose before altering — if it exists solely to gate on network fetch latency that no longer applies, it may be droppable too, but that's a judgment call to make during implementation, not a mandate).

Do not delete any module folders (`src/app/module/aboutme`, `blogs`, `certifications`, `experiences`, `guestChat`, `notFound`, `posts`, `progress`, `recommendations`, `services`, `skillset`, `sandbox`, `src/app/cms/**`) — they stay on disk, just unreachable.

---

## Acceptance criteria

- [x] `src/data/projects.json`, `journey.json`, `profile.json` exist with the shapes above
- [x] `getProjects`, `getProjectById`, `getFeaturedProjects`, `getJourney`, `getProfile` exist as synchronous functions reading from that JSON
- [x] `DashboardSidebar`, `DashboardJourney`, `DashboardWorkGrid`, `ProjectReadPage` read from these functions instead of the old `fetch*`/`useHomeConfig`/`useAboutConfig` calls
- [x] No network request (`axios`/`fetch`) fires from any of the four components above
- [x] `app.tsx` only registers `/` and `/work/view/:title`
- [x] Visiting any previously-existing route (e.g. `/about`) no longer renders that page (falls through to whatever the router does with an unmatched path)
- [x] `VITE_HOME_LAYOUT` and `isSingleHomeLayout()` are gone from `app.tsx`
- [x] All untouched module folders still exist on disk, unmodified

---

## Tests required

Yes — per PRD Testing Decisions:
- Unit tests for `getProjects`, `getFeaturedProjects`, `getJourney`, `getProfile` (and `getProjectById`) as pure functions over the fixture JSON, asserting shape and filtering logic (e.g. `getFeaturedProjects()` only returns `pinned: true` entries) — no rendering needed, plain `vitest`.
- A routing test (extend or replace `src/app/__tests__/app.routing.test.tsx` if it exists) asserting the route table only contains `/` and `/work/view/:title`, following the RTL + `MemoryRouter` pattern used in `terminalHomePage.test.tsx`.

---

## Notes

- Reference: `issues/prd.md` — "Data layer" and "Routing" sections.
- This issue intentionally does NOT touch visual styling — that's issues 010–012. Keep the diff scoped to data source + routing.
- Do not delete `src/app/api/projects.ts`, `src/app/api/experience.ts`, `src/lib/apiCache.ts`, `src/lib/mockData.ts`, or the CMS API surface yet — that's issue 014, after everything else has stopped depending on them.
- A pre-existing, unrelated test-env issue (`window.IntersectionObserver` not a constructor inside `framer-motion`, cascading into ~70 failures across several page tests) exists on `main` per issue 001's log — don't treat that as a regression you introduced.

---

## Log

- Added `src/data/{projects,journey,profile}.json` fixtures plus synchronous accessors `src/data/{projects,journey,profile}.ts` (`getProjects`, `getProjectById`, `getFeaturedProjects`, `getJourney`, `getProfile`). Wired `DashboardSidebar`, `DashboardJourney`, `DashboardWorkGrid`, `ProjectReadPage` to read from these instead of `fetch*`/`useHomeConfig`/`useAboutConfig`. Stripped `app.tsx` to `/` and `/work/view/:title`, removed `VITE_HOME_LAYOUT`/`isSingleHomeLayout()` and `ConditionalLoadingScreen`/`LoadingScreen` (judgment call: it only gated on now-irrelevant backend fetch latency, so it was dropped rather than simplified).
- Tests: new unit tests for the 5 data accessors (`src/data/__tests__/*.test.ts`, 9 tests), a rewritten `src/app/__tests__/app.routing.test.tsx` asserting only the two routes render, rewritten `DashboardSidebar`/`DashboardJourney`/`DashboardWorkGrid`/`TerminalDashboardPage` tests mocking `@/data/*` instead of the old fetch/hook modules, and a new `ProjectReadPage.test.tsx`. `npm test` (`npx vitest run`): 68 passed / 62 failed across 20 files — all 62 failures are in 9 test files I did not touch (`terminalHomePage`, `terminalContactSection`, `terminalProjectsSection`, `terminalStackSection`, `terminalWritingSection`, `servicePage`, `terminalAboutJourney`, `terminalBlogPage`, `terminalWorkPage`), all tracing to the pre-existing `IntersectionObserver`/framer-motion test-env bug noted in issue 001's log. All tests in files I touched or added pass.
- Note: this worktree branch was created before the `cms-dev` commit that added the dashboard module (`feat: dashboard lookboard`); fast-forward merged `cms-dev` into the worktree branch first to pick up `DashboardSidebar`/`DashboardJourney`/`DashboardWorkGrid`/`TerminalDashboardPage` and their existing tests, then implemented this issue on top.

---

## Flagged

- `ProjectReadPage` still wraps in `TerminalLayout`, which independently calls `useHomeConfig()` (an unrelated network-backed hook for nav/footer chrome, not project data). This is pre-existing behavior that predates this issue and is unrelated to the projects/journey/profile data being swapped here; removing it is in scope for backlog issue 013 (bare chrome for the reader page), not this one.
- To satisfy this issue's "no network request fires from any of the four components" criterion, `ProjectReadPage`'s direct calls to `fetchEngagement`/`trackView`/`toggleHeart` (views/hearts) and the associated heart button/view-count UI were removed here, ahead of backlog issue 013 which was expected to own that removal per the PRD. The `cms.ts` engagement API functions and types themselves were left in place (untouched, per this issue's "don't delete API surface yet" note) — only the call sites in `ProjectReadPage` were dropped. Worth confirming issue 013 doesn't duplicate this work.
- `ProjectReadPage`'s hero image now shows only `images[0]`; rendering the full gallery is explicitly issue 013's scope per the PRD, so it wasn't done here.
- The main checkout (`cms-dev` branch, outside this worktree) has `issues/qa/001-008` still physically present on disk even though `issues/done/001-008` (and `kanban.md`) already treat them as Done — likely a leftover from an incomplete `git mv`. Not touched here since it's outside this issue's scope, but worth a cleanup pass.
