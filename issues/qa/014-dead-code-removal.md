---
id: issue-014
title: "Dead code removal: old API/lib plumbing"
feature: single-page-json
status: qa
created_at: 2026-07-21
tags: [afk, p3]
---

# [014] Dead code removal: old API/lib plumbing

**Type:** AFK
**Priority:** P3
**Blocked by:** 009, 011, 012, 013
**User stories covered:** 14

---

## What to build

Once nothing in the reachable app (`/` and `/work/view/:title`) depends on the old backend-facing data layer, remove it:

- Delete `src/app/api/projects.ts` and `src/app/api/experience.ts`.
- Delete `src/lib/apiCache.ts` and `src/lib/mockData.ts`.
- Trim `src/app/api/cms.ts`: remove the engagement (views/hearts) exports, the analytics exports, and the CRUD exports (blogs/projects/experiences/posts/certifications/recommendations/service-config/home-config/about-config, auth, image upload) that only ever existed to serve the now-unreachable CMS. Verify nothing outside the removed/unreachable module folders imports any of these before deleting — the module folders themselves stay on disk per the PRD, but if any of them still imports from `cms.ts`, leave the specific export(s) they need in place rather than breaking dead-but-present code.
- Remove `src/hooks/use-environment-store.ts` usage from the data path (delete the file only if nothing else references it after the above).
- Search the repo for any remaining `axios` import; if none remain, remove `axios` from `package.json` dependencies.

This is cleanup only — no behavior change to the reachable app.

---

## Acceptance criteria

- [x] `src/app/api/projects.ts`, `src/app/api/experience.ts`, `src/lib/apiCache.ts`, `src/lib/mockData.ts` no longer exist
- [x] `src/app/api/cms.ts` no longer exports engagement/analytics/CRUD functions that nothing calls (verified via repo-wide reference search first)
- [x] `axios` removed from `package.json` if no import remains — N/A, verified an import remains (see Log)
- [x] The app at `/` and `/work/view/:title` builds and behaves identically to before this issue
- [x] Untouched module folders (about, blogs, certifications, etc.) are not deleted, even if some of their internal imports now point at trimmed/removed exports (acceptable since they're already unreachable dead code — do not spend effort fixing their internal references)

---

## Tests required

No new tests — this is deletion of already-unused code. Run the full existing test suite after removal to confirm nothing reachable broke; a test failing only inside an already-unreachable module folder's own test file is acceptable and doesn't need fixing (note it in the Log if it happens, don't silently leave it unmentioned).

---

## Notes

- Reference: `issues/prd.md` — "Removed" section under Implementation Decisions and Out of Scope ("deleting the now-unreachable module folders... explicitly kept for later reference" — that rule is about page/feature folders, NOT this orphaned API/lib plumbing, which nothing will import once 009/011/012/013 land).
- Do this last, after 009/011/012/013, so the reference search for "does anything still import this" is accurate.

---

## Log

- Verified via repo-wide grep before deleting anything. Deleted `src/app/api/projects.ts`, `src/app/api/experience.ts`, `src/lib/apiCache.ts`, `src/lib/mockData.ts` outright — all remaining importers (blogs.ts/certifications.ts/recommendations.ts api files, and every module folder listed as unreachable) are not on the reachable `/`  or `/work/view/:title` import graph.
- Trimmed `src/app/api/cms.ts` down to `fetchHomeConfig`, `fetchAboutConfig`, `fetchServiceConfig` and the type declarations they need (`ServiceDto`, `SkillCategoryDto`, `StatusConfig`, `StatusType`, `BannerButton`, `LanguageEntry`, `NeofetchRow`, `SocialLink`, `OffTheClockItem`). Removed auth (`cmsVerifyAuth`), image upload (`cmsUploadImage`), all CRUD (blogs/projects/experiences/posts/certifications/recommendations, plus the `cmsUpdate*Config` mutators), and engagement/analytics (`fetchEngagement`/`trackView`/`toggleHeart`/`fetchAnalytics`/`fetchBlogEngagementSummary` + their types) — none of these have any remaining caller outside the already-unreachable module folders.
- Reason `fetchHomeConfig`/`fetchAboutConfig`/`fetchServiceConfig` had to stay: `ProjectReadPage` renders `TerminalContactSection`, which calls `useHomeConfig()` (`src/hooks/use-home-config.ts`), which calls `fetchHomeConfig`/`fetchAboutConfig`/`fetchServiceConfig` from `cms.ts`. This is a real, reachable dependency chain, not dead code — trimming it would have broken the reader page. Because of this, `axios` (still imported by the three surviving fetchers) and `src/hooks/use-environment-store.ts` (still imported by `cms.ts` for the dev-mode short-circuit) were **kept**, not removed — both have a live reference after the trim.
- `src/app/_components/readPage/readingPage.tsx` is imported by `ProjectReadPage` (for `MarkDownComponent`/`ImageLightbox`) so it counts as reachable, but it also contained a dead, never-imported `ReadPage` component whose only callers were the files being deleted (`fetchProjectsByID` from `api/projects.ts`, `fetchBlogsByID` from `api/blogs.ts`, `EngagementType` from `cms.ts`, plus `EngagementBar`/`StickyHeart`/`useEnvironment`/etc.). Confirmed via grep that `ReadPage` has zero importers anywhere in the repo, then deleted that function and its now-orphaned imports (and the `generateRandomSkeletons` helper it alone used) so the file — which genuinely is reachable — stays `tsc`-clean. `MarkDownComponent`/`ImageLightbox` and their dependencies (`isVideoLink`/`isTweetLink`/`VideoComponent`/`getId`/`CopyButton`) were untouched.
- `npx tsc --noEmit`: errors remain only in already-unreachable files — `src/app/cms/**`, `src/app/module/{posts,home/experienceSection,home/recentPosts,home/topProjects,home/terminalProjectsSection,terminal/TerminalAboutPage,terminal/TerminalWorkPage,terminal/BlogReadPage}`, `src/app/_components/projectsList.tsx`, `src/app/api/{blogs,certifications,recommendations}.ts`, `src/components/{EngagementBar,StickyHeart,LoadingScreen}.tsx`, `src/hooks/{use-cms-auth-store,use-engagement}.ts`, and the test files for those modules. Nothing in `src/app/module/dashboard`, `src/app/module/terminal/{ProjectReadPage,TerminalLayout}.tsx`, or `src/data/*` reports an error.
- `npx vitest run`: 9 test files passed / 11 failed (91 tests: 62 passed, 29 failed). The 11 failing files are the 9 pre-existing `IntersectionObserver`/framer-motion failures from issue 001/009/013's logs (`terminalHomePage`, `terminalContactSection`, `terminalProjectsSection`, `terminalStackSection`, `terminalWritingSection`, `servicePage`, `terminalAboutJourney`, `terminalBlogPage`, `terminalWorkPage`) plus two newly-broken-further files inside already-unreachable folders (`terminalAboutPage.test.tsx`, `CmsProjectEditor.test.tsx`) whose modules depend on the now-deleted `api/experience.ts`/`api/projects.ts`/removed `cms.ts` CRUD — acceptable per the issue's acceptance criteria (unreachable modules may get slightly worse). Ran `src/app/module/dashboard` and `ProjectReadPage.test.tsx` directly: 45/45 pass. `app.routing.test.tsx`: 4/4 pass.
- `axios` was **not** removed from `package.json` — a live import remains in the trimmed `cms.ts` (see above).
- `src/hooks/use-environment-store.ts` was **not** deleted — a live import remains in the trimmed `cms.ts` (see above).
