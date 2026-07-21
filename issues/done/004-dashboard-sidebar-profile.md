---
id: issue-004
title: "Dashboard sidebar: profile, availability, bio, contact/social"
feature: dashboard-home
status: qa
created_at: 2026-07-13
tags: [afk, p1]
---

# [004] Dashboard sidebar: profile, availability, bio, contact/social

**Type:** AFK
**Priority:** P1
**Blocked by:** 001
**User stories covered:** 1, 9

---

## What to build

Inside the `TerminalDashboardPage` shell (from issue 001), build the top portion of the left sidebar panel (the ~30% column from the reference mockup): avatar, name, role, an availability status indicator, a short bio, and location — all sourced from `useHomeConfig`/`useAboutConfig`, matching the pattern already used elsewhere on the site (e.g. `TerminalLayout`'s status dot, `TerminalAboutPage`'s bio rendering).

Below that, build the contact/social section: email (mailto link) and social links, wired to `config.socialLinks` and the real contact email — not the reference mockup's placeholder `href="#"` links.

The Journey timeline (also part of this left column in the mockup) is a separate issue (005) — leave a slot for it but don't implement it here.

---

## Acceptance criteria

- [ ] Avatar, name, role, status, bio, and location render from real config data
- [ ] Contact section renders real email + social links from `config.socialLinks`, not placeholders
- [ ] No shared site chrome (no nav/footer) — panel is self-contained within `TerminalDashboardPage`
- [ ] Visual structure follows the reference mockup's left-column proportions and spacing

---

## Tests required

Yes — component test mocking `useHomeConfig`/`useAboutConfig`, asserting profile fields and contact links render from the mocked config values.

---

## Notes

- Reuses existing config hooks — no new data-fetching pattern needed here.
- Reference mockup: `Khesir Portfolio - Standalone.html` (decoded during the design review in the PRD's grilling session) — treat it as the visual source of truth for layout/spacing/tokens, but replace all placeholder copy/links with real data.
- Reference: `issues/prd.md` — "New module & page" section.

---

## Log

_Updated as work progresses._

- Implemented `src/app/module/dashboard/DashboardSidebar.tsx` (new) and wired it into `TerminalDashboardPage.tsx`: avatar, name, role, online-availability indicator (`STATUS_DOT` pattern from `TerminalLayout`), bio, location, mailto contact link, and `config.socialLinks` (icon-or-label, `target=_blank rel=noopener noreferrer`). Left `dash-journey-slot` and `dash-work-slot` empty divs for issues 005/other.
- Tests: `src/app/module/dashboard/__tests__/DashboardSidebar.test.tsx` (9 new tests, TDD red-green per behavior) mocking `useHomeConfig`/`useAboutConfig`; pre-existing `TerminalDashboardPage.test.tsx` smoke test (4 tests, no nav/banner/contentinfo) still passes unmodified. All 13 dashboard tests green; `tsc --noEmit` clean.
- Bio decision: used `about.bioTagline` (short) rather than `bioBody`, since this is a dense sidebar panel, not the full About page — matches the ticket's suggested lean.
