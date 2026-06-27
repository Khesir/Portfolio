---
id: issue-001
title: "CSS + fonts + route scaffold"
feature: terminal-home
status: done
created_at: 2026-06-26
tags: [afk, p1]
---

# 001 CSS + fonts + route scaffold

**Type:** AFK
**Priority:** P1
**Blocked by:** None
**User stories covered:** 1, 21, 22, 25

---

## What to build

Lay the foundation for the terminal homepage. This slice has no visible content beyond the shell — its purpose is to prove that the route loads, the custom CSS applies correctly, and the fonts render.

- Add `terminal.css` and `mock.css` from the designer's files into `src/css/`. Import them inside the terminal homepage component file only — not in a global entrypoint — so their CSS custom properties and class names stay scoped.
- Inject the three Google Font families (Instrument Serif, Space Grotesk, JetBrains Mono) as `<link rel="preconnect">` and `<link rel="stylesheet">` tags in `index.html`, matching the designer's original markup.
- Register `/` as a standalone route directly in `app.tsx`, outside the `<Route element={<BaseLayout />}>` wrapper. Mirror the pattern used by `SandBoxPage`.
- Render a minimal page shell: `<div class="grid-bg">`, a `<header class="top">` with the brand logo (`/img/Mee.png`), nav links (`~/home`, `/about`, `/work`, `/blog` wired to existing React Router routes), and the active-link highlight on `~/home`. Include a `<footer class="foot">` at the bottom.

---

## Acceptance criteria

- [ ] Navigating to `/` renders the terminal shell without any `BaseLayout` chrome (no `Banner`, no existing nav, no dark/light toggle).
- [ ] The grid background and radial gradient render with the default blue accent color.
- [ ] All three Google Fonts load and apply to the shell text.
- [ ] The `~/home` nav link is visually highlighted as active; other links are not.
- [ ] Nav links route correctly to `/about`, `/projects`, `/blogs`, and `/`.
- [ ] No terminal CSS classes leak into other routes (visit `/about` and confirm its existing styles are unaffected).

---

## Tests required

Yes — render the homepage shell, assert the nav links are present with correct `href` values, and assert the active class is applied to the home link.

---

## Notes

- `terminal.css` and `mock.css` reference CSS custom properties defined in `mock.css` (`:root` block). Both files must be imported together, `mock.css` first.
- The designer's `<template id="__bundler_thumbnail">` and `data-screen-label` attributes are design-tool artifacts — omit them.
- Image asset `assets/Mee.png` in the design maps to `/img/Mee.png` in this project.
- The theme dock (accent color switcher) is out of scope — do not implement it.

---

## Log

_Updated as work progresses._

Implemented terminal page shell with header, nav, grid-bg, and footer. CSS files added to src/css/ and imported scoped to TerminalHomePage. Standalone route registered at / outside BaseLayout. Tests verify nav links and active state.

QA approved by user on 2026-06-27.
