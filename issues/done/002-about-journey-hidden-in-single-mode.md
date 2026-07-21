---
id: issue-002
title: "About page suppresses Journey section in single mode"
feature: dashboard-home
status: qa
created_at: 2026-07-13
tags: [afk, p2]
---

# [002] About page suppresses Journey section in single mode

**Type:** AFK
**Priority:** P2
**Blocked by:** 001
**User stories covered:** 14

---

## What to build

`TerminalAboutPage` reads the same `VITE_HOME_LAYOUT` flag introduced in issue 001. When the flag is `"single"`, the page omits its own "journey" section entirely (the `03 — journey` block, including renumbering the remaining numbered section headers so there's no gap). When the flag is `"multi"` or unset, `/about` renders its Journey section exactly as it does today — no change from current behavior.

This avoids showing the same career history in two places once the dashboard (issue 005) becomes the canonical place to see Journey.

---

## Acceptance criteria

- [ ] `VITE_HOME_LAYOUT=single` → `/about` does not render its Journey section
- [ ] `VITE_HOME_LAYOUT=single` → remaining section numbering on `/about` has no gap where Journey used to be
- [ ] `VITE_HOME_LAYOUT` unset or `"multi"` → `/about` renders Journey exactly as it does today (no regression)
- [ ] No other section of `/about` (bio, off_the_clock, skills) is affected

---

## Tests required

Yes — extend the existing About page/journey test coverage to assert Journey section presence/absence under both flag states.

---

## Notes

- Does not depend on the dashboard's own Journey UI (issue 005) actually being built — only on the flag existing (issue 001).
- Reference: `issues/prd.md` — "Routing / feature flag" section.

---

## Log

_Updated as work progresses._

- Implemented: `TerminalAboutPage.tsx` now reads `import.meta.env.VITE_HOME_LAYOUT` via a local `isSingleHomeLayout()` helper; when `"single"`, it skips fetching experiences and omits the `03 — journey` header + `.exp` section entirely (journey was already the last numbered section, so no renumbering was needed — `01 off_the_clock` and `02 skills` are untouched).
- Tested: extended `terminalAboutJourney.test.tsx` (flag=single hides journey/heading/rows; flag=multi and unset still render it) and `terminalAboutPage.test.tsx` (bio/off_the_clock/skills still render under flag=single, and section numbers `01`/`02` present with `03`/"journey" absent). Also fixed a scoped, test-file-local `IntersectionObserver` mock (the shared one in `test-setup.ts` isn't a valid constructor for framer-motion's `whileInView`) so these two files' assertions run instead of erroring — pre-existing, out of scope to fix globally.
- All target tests pass except 2 pre-existing `AnimatePresence` collapse-timing failures in `terminalAboutJourney.test.tsx` (verified via git-stash bisection to predate this change, unrelated to the flag logic).

---

## Flagged

Pre-existing, unrelated to this ticket (confirmed via git-stash bisection): 2 `AnimatePresence` collapse-timing failures in `terminalAboutJourney.test.tsx`, plus the broader shared-`IntersectionObserver`-mock issue already flagged on issue 001. Not fixed here — same root cause as 001's flag.
