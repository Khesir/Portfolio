---
id: issue-001
title: "Feature flag + route scaffold for dashboard homepage"
feature: dashboard-home
status: qa
created_at: 2026-07-13
tags: [afk, p1]
---

# [001] Feature flag + route scaffold for dashboard homepage

**Type:** AFK
**Priority:** P1
**Blocked by:** None
**User stories covered:** 12, 13, 17, 18

---

## What to build

Introduce a build-time env flag, `VITE_HOME_LAYOUT`, with values `"multi"` (default/current behavior) and `"single"`. Wire the app's index (`/`) route so that:

- `VITE_HOME_LAYOUT` unset or `"multi"` → renders the existing `TerminalHomePage` exactly as today (no behavior change).
- `VITE_HOME_LAYOUT=single` → renders a new page, `TerminalDashboardPage`, in a new module `src/app/module/dashboard/`.

Create `TerminalDashboardPage` as a minimal shell for now (a bare container, no shared site chrome — it must NOT use `TerminalLayout`, so no top nav and no footer). Subsequent issues build the actual sidebar and work-grid content inside this shell. All other routes (`/about`, `/work`, `/blogs`, detail routes, etc.) are untouched by this flag.

`TerminalHomePage` and its child sections are not modified, deleted, or unmounted from anywhere else — they simply stop being reachable at `/` when the flag is `"single"`.

Add `VITE_HOME_LAYOUT` to `.env.sample` with a comment noting the two valid values and the default.

---

## Acceptance criteria

- [ ] `VITE_HOME_LAYOUT` env var added to `.env.sample`
- [ ] With the flag unset (or `"multi"`), `/` renders `TerminalHomePage` (identical to current behavior)
- [ ] With the flag set to `"single"`, `/` renders the new `TerminalDashboardPage` shell instead
- [ ] `TerminalDashboardPage` renders no `TerminalLayout` chrome (no nav, no footer)
- [ ] No other route's behavior changes regardless of flag value

---

## Tests required

Yes — routing test on the index route: stub `VITE_HOME_LAYOUT` via `vi.stubEnv` and assert `TerminalDashboardPage` renders when `"single"`, and `TerminalHomePage` renders when `"multi"` or unset (this must not regress the current default). A basic smoke test on `TerminalDashboardPage` confirming it renders without nav/footer landmarks.

---

## Notes

- This is intentionally a thin scaffold — no profile, Journey, or Work grid content yet. Those are separate issues (004, 005, 006, 007) that build inside this shell.
- `import.meta.env.VITE_HOME_LAYOUT` should be read in one place for the routing decision so it's easy to audit/test.
- Reference: `issues/prd.md` — "Routing / feature flag" section.

---

## Log

_Updated as work progresses._

- Implemented `isSingleHomeLayout()` in `src/app/app.tsx` as the single read site for `import.meta.env.VITE_HOME_LAYOUT`, wired into the index route (`single` → `TerminalDashboardPage`, else → `TerminalHomePage`). Added minimal `TerminalDashboardPage` shell (`src/app/module/dashboard/TerminalDashboardPage.tsx`, no `TerminalLayout`). Added `VITE_HOME_LAYOUT` to `.env.sample` with comment.
- Tests: `src/app/__tests__/app.routing.test.tsx` (flag unset/`multi`/`single` routing + `/about` unaffected by flag, via `vi.stubEnv`) and `src/app/module/dashboard/__tests__/TerminalDashboardPage.test.tsx` (smoke render + no nav/banner/contentinfo landmarks). All new tests pass; full `npm test` shows the same 70 pre-existing failures as on a clean stash (unrelated `IntersectionObserver`/axios test-env issues), confirming no regression.

---

## Flagged

Pre-existing, unrelated to this ticket (confirmed via `git stash` to already fail on a clean tree): `window.IntersectionObserver` mock in `src/test-setup.ts` throws `not a constructor` inside `framer-motion`'s viewport observer, cascading into ~70 test failures across `terminalHomePage`, `terminalContactSection`, `terminalProjectsSection`, `terminalStackSection`, `terminalWritingSection`, `terminalWorkPage`, `terminalAboutPage`, `terminalBlogPage`, `terminalAboutJourney`, `servicePage`. Worth its own fix ticket — not addressed here.
