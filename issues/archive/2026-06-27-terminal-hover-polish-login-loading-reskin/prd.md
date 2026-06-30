# PRD: Terminal Hover Polish + Login & Loading Screen Reskin

**Status:** Draft
**Date:** 2026-06-27

---

## Problem Statement

The terminal-direction public site and CMS login have unfinished interaction polish. The work page's featured card has no hover feedback despite the project rows below it having lift + border animations. The CMS login screen uses generic Tailwind/shadcn styling that is completely disconnected from the terminal aesthetic. The global loading screen (`LoadingScreen`) already prefetches real data but renders with Framer Motion + Tailwind instead of the terminal card design. These gaps make the site feel inconsistent — parts of it look polished, others look like placeholders.

---

## Solution

Apply the terminal aesthetic consistently across three surfaces:

1. **Work page** — add hover treatment to the featured card and port the project-row popover preview from the design prototype into the React component.
2. **CMS Login** — rebuild `CmsLoginGate` to match the terminal-card login design (macOS-style window chrome, monospace form, authenticate button).
3. **Global loading screen** — reskin `LoadingScreen` from Tailwind to terminal CSS classes, add a blogs prefetch step, and wire `.bstep.done:hover` polish.

---

## User Stories

1. As a visitor, I want the featured project card to lift and glow when I hover it, so that it feels like a clickable element and not a static layout block.
2. As a visitor, I want a rich popover to appear when I hover a project row on the work page, so that I can preview the project's title, role, year, description, and tech tags without navigating away.
3. As a visitor, I want the popover to track my cursor and flip sides when it would overflow the viewport, so that it is always fully visible.
4. As a visitor, I want the popover to hide on mobile, so that it does not interrupt touch navigation.
5. As a visitor on first load, I want to see a terminal-styled boot screen while global data is fetching, so that the experience feels cohesive with the rest of the terminal site.
6. As a visitor, I want the boot screen to show real progress steps (profile config, featured projects, blogs) completing one by one, so that I know the site is actually loading something.
7. As a visitor, I want the boot screen to exit smoothly and reveal the requested page once all data is ready, so that the transition feels intentional.
8. As a visitor, I want the loaded config and content to be immediately available on the terminal pages without a second network round-trip, so that pages feel instant after the boot.
9. As the site admin, I want the CMS login screen to match the terminal aesthetic (dark card, monospace font, traffic-light dots), so that the CMS feels part of the same design system.
10. As the site admin, I want the password input field to subtly brighten its border when I hover it (before clicking), so that it is visually clear the field is interactive.
11. As the site admin, I want the focused password field to show an accent-colored ring, distinct from the hover state, so that there is a clear default → hover → focused progression.
12. As the site admin, I want the Authenticate button to glow with an accent box-shadow on hover, so that it feels responsive and alive.
13. As the site admin, I want the eye toggle button to shift to full ink color on hover, so that it is clearly tappable.
14. As the site admin, I want incorrect password submission to show an inline error in the terminal style (plum-colored, monospace) without a page reload.
15. As the site admin, I want the Authenticate button to show a blinking cursor + "authenticating…" text while the request is in flight, matching the terminal aesthetic.

---

## Implementation Decisions

### 1. Work page — `.feature` card hover

Add `transition: border-color .18s, transform .18s, box-shadow .18s` to the existing `.feature` rule in `terminal-theme.css`. Add a `.feature:hover` rule: lift `translateY(-3px)`, border brightens to accent at 40% opacity, and a `0 0 40px rgba(var(--accent-rgb),.12)` radial glow appended to `var(--shadow-lg)`.

### 2. Work page — project row popover

Port the popover system from the design prototype (`terminal-work.html`) into `TerminalWorkPage`. A single shared `.pop` div is appended to the page. On `mouseenter` of a `.proj` row, populate the popover from `data-*` attributes (title, role, year, description, tags) and position it at cursor + 18px gap, flipping to the left if it would overflow the right edge. On `mouseleave` remove the `show` class. Hidden on viewports ≤ 760px via CSS. Each project row in the React component needs `data-title`, `data-role`, `data-year`, `data-desc`, `data-tags` attributes populated from the API data.

### 3. CMS Login — `CmsLoginGate` rebuild

Rebuild `CmsLoginGate` to match `terminal-cms-login.html`. Structure: outer `.boot-stage` centering wrapper → `.tcard` terminal card with `.tc-bar` (traffic-light dots + title) → `.login-body` containing logo/badge header, monospace prompt line, password form, error state, hint footer.

Styling lives in a new `terminal-cms-gate.css` local file (equivalent to the design's `terminal-cms-gate.css`), imported by `CmsLoginGate`. Auth logic stays identical to current — `login(password)` from `useCmsAuth`.

Hover states:
- `.lwrap:hover` — border steps up to `var(--line)` (one level above default `var(--line-2)`)
- `.lwrap:focus-within` — accent border + 3px accent ring (existing behaviour preserved)
- `.lbtn:hover` — `filter: brightness(1.07)` + `box-shadow: 0 0 18px rgba(var(--accent-rgb),.35)`
- `.lbtn:active` — `transform: translateY(1px)`
- `.lwrap .eye:hover` — color shifts to `var(--ink)`
- `.lhint a:hover` — color shifts to `var(--accent)`

### 4. Global loading screen — `LoadingScreen` reskin

Replace Framer Motion + Tailwind markup in `LoadingScreen` with terminal CSS classes from `terminal-mock.css` + `terminal-theme.css` (already loaded globally). The card structure mirrors `terminal-cms-loading.html`: `.tcard` with `.tc-bar`, `.tc-body`, `.boot-head`, `.boot-cmd`, `.boot-steps` (`.bstep` with `done` / `active` / `pending` states), and `.boot-prog` progress bar.

Add `fetchBlogs()` as a third sequential step between projects and the synthetic "mounting" step:

```
Step 1: prefetchAll()        → "Profile & config"    done → 30%
Step 2: fetchProjects()      → "Featured projects"   done → 55%
Step 3: fetchBlogs()         → "Content & writing"   done → 80%
Step 4: synthetic 300ms      → "Mounting routes"     done → 100%
Step 5: exit animation
```

Exit: fade-out of the terminal card (opacity 0, ~300ms), no split-panel wipe (that was the Framer Motion exit — simpler CSS transition fits the terminal aesthetic). Framer Motion dependency can be dropped from this component if no other component in the tree uses it, otherwise keep it scoped to the exit only.

`.bstep.done:hover` — faint `rgba(255,255,255,.03)` background highlight + label stays at `var(--ink)` — implemented in the shared boot/gate CSS.

The boot CSS (`.tcard`, `.bstep`, `.boot-*`, `.cursor`, `@keyframes bspin`, `@keyframes blink`) should live in `terminal-cms-gate.css` and be imported by both `LoadingScreen` and `CmsLoginGate`, since both use the shared `.tcard` card shell.

### 5. Prefetch caching

`prefetchAll()` and `fetchProjects()` already use module-level promise deduplication in `use-home-config.ts`. `fetchBlogs()` should similarly be wrapped or use the existing `ApiCache` to avoid a second fetch when `TerminalBlogPage` mounts. No new store is needed — the existing cache layer handles this.

---

## Testing Decisions

Good tests verify observable behavior from the outside — what a user sees or what the DOM exposes — not implementation details like state shape or which function was called.

### Work page popover
- Mount `TerminalWorkPage` with mocked API responses containing at least two projects.
- Simulate `mouseenter` on the first `.proj` row → assert the `.pop` element gains `show` class and its title/role/tags content matches the mocked project.
- Simulate `mouseleave` → assert `show` class is removed.
- Prior art: existing hover integration tests in the terminal module if any, otherwise follow the pattern of the blog/project card tests.

### CMS Login
- Render `CmsLoginGate` in isolation.
- Assert the password field is focused on mount.
- Submit with empty input → assert `.lerror` is visible.
- Submit with a value → assert button enters loading/disabled state.
- Prior art: existing `CmsLoginGate` tests (currently none — this is the first).

### Loading screen
- Render `LoadingScreen` with children and mock `prefetchAll`, `fetchProjects`, `fetchBlogs` to resolve immediately.
- Assert that all four steps transition to `done` class.
- Assert children are rendered (not hidden) once the exit animation completes.
- Prior art: `LoadingScreen` has no existing tests — follow integration test patterns in the component test suite.

### CSS hover states (`.feature`, `.lwrap`, `.lbtn`)
- These are pure CSS — no JS unit tests needed.
- Verify visually during the `/verify` run.

---

## Out of Scope

- Popover on mobile (hidden by CSS below 760px, no touch equivalent planned).
- CMS dashboard, sidebar, or any other CMS page styling changes.
- Any new API endpoints — all fetches use existing public endpoints.
- Animations beyond what the design specifies (no parallax, no scroll triggers).
- Blog prefetch pagination — only the default first-page response is prefetched; pagination remains CSR.

---

## Further Notes

- `terminal-cms-gate.css` will be a new local CSS file imported by both `LoadingScreen` and `CmsLoginGate`. It contains the shared `.tcard`, `.bstep`, `.boot-*`, `.login-*`, and `.lbtn` rules.
- The popover in `TerminalWorkPage` mirrors the design's inline `<style>` block and `<script>` block exactly — no abstraction needed since it is a single-use pattern on one page.
- Framer Motion is already a project dependency (used in `LoadingScreen`). The reskin can keep it for the exit fade or drop it — either is acceptable as long as the exit feels smooth.
