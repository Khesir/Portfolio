---
id: issue-003
title: "CMS layout shell"
feature: terminal-cms
status: qa
created_at: 2026-06-27
tags: [afk, p1]
---

# [003] CMS layout shell

**Type:** AFK
**Priority:** P1
**Blocked by:** None
**User stories covered:** 23–24

---

## What to build

Bring `terminal-cms.css` into the project and rewrite `CmsLayout` to use the terminal CMS shell structure. This is the foundation all other CMS reskin issues (004–007) depend on.

**CSS**
Add `terminal-cms.css` to `src/css/` and import it in `CmsLayout`. The file defines `.cms-shell`, `.cms-aside`, `.cms-brand`, `.cms-nav`, `.cms-group`, `.glabel`, `.cms-foot`, `.cms-main`, `.cms-top`, `.cms-h1`, and all other shared CMS primitives used across every CMS page.

**Layout structure**
Replace the current Tailwind flex-sidebar layout with the `.cms-shell` / `.cms-aside` / `.cms-main` grid from the design. The sidebar contains:
- Brand block (`.cms-brand`): avatar image, `khesir.cms` wordmark, `admin` badge.
- Nav (`.cms-nav`): grouped sections with `.glabel` labels matching the existing nav structure — no section or link is added or removed, only class names and markup change.
  - Group 1 (no label): Dashboard
  - Group 2 label "Data": Blogs, Projects, Experiences, Posts
  - Group 3 label "Pages": Home, About, Services
- Footer (`.cms-foot`): Dev mode toggle button (calls existing `toggleMode`), "← Back to site" link (href="/"), Logout button (calls existing `logout`).

Active nav item receives the `.on` class. The `NavLink` `isActive` logic is preserved — only the class applied changes from the Tailwind string to `"on"`.

All existing auth logic (`useCmsAuth`, `CmsLoginGate`) is untouched. The `<Outlet />` renders inside `.cms-main`.

---

## Acceptance criteria

- [ ] CMS shell renders the `.cms-aside` sidebar and `.cms-main` content area with correct layout.
- [ ] Brand block shows avatar, `khesir.cms` wordmark, and `admin` badge.
- [ ] All nav links are present and grouped correctly (Dashboard / Data / Pages).
- [ ] Active page's nav link has the `.on` class; inactive links do not.
- [ ] Dev mode toggle button toggles mode and updates its label (Dev mode / Production) as before.
- [ ] "← Back to site" link navigates to `/`.
- [ ] Logout button logs out and redirects to login gate as before.
- [ ] No Tailwind sidebar classes remain in `CmsLayout`.
- [ ] Unauthenticated users still see `CmsLoginGate` (auth flow unchanged).
- [ ] All existing CMS routes still render their page content inside `.cms-main`.

---

## Tests required

Yes.

- Active nav item receives `.on` class for the current route; other items do not.
- Dev mode toggle button calls `toggleMode` on click.
- Logout button calls `logout` on click.

---

## Notes

- `terminal-cms.css` should be placed in `src/css/` and imported only by `CmsLayout`.
- The `.grid-bg` background div from the terminal theme — add it inside the CMS shell if `terminal-cms.css` expects it (the design HTML includes `<div class="grid-bg"></div>` inside `.cms-shell`).
- SVG icons in the sidebar nav are defined inline in the design HTML — use the same SVG paths for the nav icons, or the existing lucide icons if they match closely enough visually.
- Do not remove or rename any routes in `CmsApp` — only the layout shell changes.

---

## Log

- **2026-06-27** — Implemented. Created `src/css/terminal-cms.css` with the full terminal CMS design system. Rewrote `CmsLayout.tsx` to use `.cms-shell` grid, `.cms-aside` sidebar with brand block + grouped nav + footer, and `.cms-main` outlet. All Tailwind and shadcn imports removed. `NavLink` active class uses `'on'`. Hooks `useCmsAuth` and `useEnvironment` preserved unchanged.
