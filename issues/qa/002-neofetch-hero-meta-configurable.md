---
id: issue-002
title: "Neofetch rows + hero meta tags configurable"
feature: home-config
status: qa
created_at: 2026-06-28
tags: [afk, p2]
---

# [002] Neofetch rows + hero meta tags configurable

**Type:** AFK
**Priority:** P2
**Blocked by:** 001
**User stories covered:** 1, 2, 3

---

## What to build

Add `neofetchRows`, `location`, and `tags` to the home config. Wire them to the public home page. Add the corresponding CMS editor fields.

End-to-end: `UpdateHomeConfigDto` → mock data → `useHomeConfig` defaults → CMS Hero/Neofetch sections → `TerminalHomePage` neofetch terminal and `.hmeta` row.

**New fields:**
- `neofetchRows: { key: string; value: string }[]` — rendered as the key-value rows inside the neofetch terminal window. Default values must match the current hardcoded rows exactly: `[{key: 'Role', value: 'Full-Stack · Toolmaker'}, {key: 'Uptime', value: 'building since 2020'}, {key: 'Editor', value: 'VS Code · Cursor'}, {key: 'Lang', value: 'TypeScript · C# · Py'}, {key: 'Stack', value: 'React · Flutter · Node'}, {key: 'Locale', value: 'PH · UTC+8'}]`
- `location: string` — rendered as the first `.hmeta` tag with a colored dot. Default: `'Philippines · UTC+8'`
- `tags: string[]` — rendered as plain `.hmeta` tags after the location tag. Default: `['agentic AI', 'APIs & tooling']`

**CMS editor — Neofetch section:** Free-form key-value list editor using the same `rep-row` pattern as the existing (now removed) languages editor. Each row has a key input and a value input, with add/remove/reorder controls.

**CMS editor — Hero section:** Add `location` text input and `tags` tag-input (same `TagInput` component already in the project) below the heroButtons editor.

**Public page:** Replace the hardcoded `.nf-rows` content with a `.map()` over `config.neofetchRows`. Replace the hardcoded `.hmeta` spans with `config.location` (with dot) and `config.tags.map(...)`.

---

## Acceptance criteria

- [ ] `neofetchRows`, `location`, and `tags` are added to `UpdateHomeConfigDto`, mock data, and `useHomeConfig` defaults
- [ ] Default values produce a visually identical page before any CMS edit
- [ ] CMS Home Config shows a Neofetch section with a key-value list editor (add, remove, reorder rows)
- [ ] CMS Home Config Hero section includes a location text input and a tags input
- [ ] `TerminalHomePage` neofetch terminal renders rows from `config.neofetchRows`
- [ ] The `.hmeta` location tag renders `config.location` with a dot indicator
- [ ] The `.hmeta` plain tags render from `config.tags`
- [ ] An empty `neofetchRows` array renders no rows (no crash)
- [ ] An empty `tags` array renders no plain tags (no crash)

---

## Tests required

Yes — `TerminalHomePage` test: mock `useHomeConfig` with custom `neofetchRows`, `location`, and `tags` values and assert they appear in the DOM in the correct positions.

---

## Notes

The neofetch terminal currently has a hardcoded `.nf-head` row (`aj @ khesir`) and a separator line above the rows — these are structural and should remain hardcoded. Only the data rows below the separator come from `neofetchRows`.

The `TagInput` component is already used in `CmsProjects` and `CmsBlogs` — reuse it for the tags field.

---

## Log

Implemented 2026-06-29. Added neofetchRows, location, tags to UpdateHomeConfigDto, fetchHomeConfig mock, HomeConfig interface, and DEFAULT_HOME. TerminalHomePage now renders neofetch rows from config.neofetchRows and .hmeta from config.location/tags. CmsHomeConfig has new Neofetch section (key-value list editor) and Hero section extensions (location, tags, count inputs). Added 5 tests to terminalHomePage.test.tsx.
