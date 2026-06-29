---
id: issue-003
title: "Home preview counts configurable"
feature: home-config
status: qa
created_at: 2026-06-28
tags: [afk, p2]
---

# [003] Home preview counts configurable

**Type:** AFK
**Priority:** P2
**Blocked by:** 001
**User stories covered:** 5, 6

---

## What to build

Add `selectedWorkCount` and `writingCount` to the home config and use them to control how many items the home page previews in the selected work and writing sections.

End-to-end: `UpdateHomeConfigDto` → mock data → `useHomeConfig` defaults → CMS Hero section number fields → `TerminalProjectsSection` and `TerminalWritingSection` slice limits.

**New fields:**
- `selectedWorkCount: number` — how many pinned projects to show in the home "Selected Work" section. Default: `3`
- `writingCount: number` — how many blogs to show in the home "Writing" section. Default: `3`

**CMS editor:** Two number inputs in the Hero section, labelled "Selected work preview count" and "Writing preview count". Minimum value 1.

**Public page:** Pass `selectedWorkCount` from `config` into `TerminalProjectsSection` and `writingCount` into `TerminalWritingSection`. Both components currently hardcode their slice to 3 — replace with the prop value.

---

## Acceptance criteria

- [ ] `selectedWorkCount` and `writingCount` are added to `UpdateHomeConfigDto`, mock data, and `useHomeConfig` defaults (both defaulting to 3)
- [ ] CMS Home Config Hero section shows two number inputs for the counts
- [ ] `TerminalProjectsSection` accepts and respects a `count` prop (or reads from config) instead of hardcoding 3
- [ ] `TerminalWritingSection` accepts and respects a `count` prop (or reads from config) instead of hardcoding 3
- [ ] Changing `selectedWorkCount` to 5 in mock data causes 5 pinned projects to appear on the home page (if available)
- [ ] Changing `writingCount` to 1 in mock data causes 1 blog to appear on the home page

---

## Tests required

Yes:
- `TerminalProjectsSection` test: existing "shows at most 3 projects" test updated to drive the cap from a config value rather than a hardcoded 3
- `TerminalWritingSection` test: same pattern — assert count from config controls the slice

---

## Notes

The existing `terminalProjectsSection.test.tsx` has a test "shows at most 3 projects" — this will need to be updated to assert against whatever count is in the mocked config, not a hardcoded 3.

---

## Log

Implemented 2026-06-29. Added selectedWorkCount and writingCount to DTO, mock (defaults 3), HomeConfig interface, and DEFAULT_HOME. TerminalProjectsSection and TerminalWritingSection accept a count prop (default 3). TerminalHomePage passes config values as props. CmsHomeConfig Hero section has two number inputs for the counts. Updated and extended tests in both section test files.
