---
id: issue-002
title: "CmsLoginGate — terminal rebuild with hover states"
feature: terminal-hover-polish
status: done
created_at: 2026-06-27
tags: [afk, p1]
---

# [002] CmsLoginGate — terminal rebuild with hover states

**Type:** AFK
**Priority:** P1
**Blocked by:** 001
**User stories covered:** 9, 10, 11, 12, 13, 14, 15

---

## What to build

Rebuild `CmsLoginGate` from its current generic Tailwind/shadcn form to match the terminal card login design (`terminal-cms-login.html`). The component keeps all existing auth logic — `useCmsAuth`, `login(password)`, error state — but the entire JSX and styling is replaced.

**Structure:**
- Outer `.boot-stage` centering wrapper (full-viewport, flex center)
- `.tcard` terminal card — same shell used by `LoadingScreen` (issue 001)
- `.tc-bar` titlebar — traffic-light dots + `khesir.cms — auth` monospace label
- `.login-body` — logo/badge header row, monospace prompt line, password form, error message, hint footer

**Form details:**
- `.lfield` label + `.lwrap` input wrapper — `$` prefix character, password input, eye toggle button
- `.lbtn` submit button — arrow icon + "Authenticate" label; in-flight state shows blinking cursor + "authenticating…"
- `.lerror` — shown on failed auth; plum-colored, monospace, with alert icon
- `.lhint` — "Encrypted session · ← back to site" link row

**Hover states (all via `terminal-cms-gate.css` created in 001):**
- `.lwrap:hover` — border steps up to `var(--line)` (above default `var(--line-2)`, below focus accent ring)
- `.lwrap:focus-within` — accent border + `0 0 0 3px rgba(var(--accent-rgb),.12)` ring
- `.lbtn:hover` — `filter: brightness(1.07)` + `box-shadow: 0 0 18px rgba(var(--accent-rgb),.35)`
- `.lbtn:active` — `transform: translateY(1px)`
- `.lwrap .eye:hover` — color shifts to `var(--ink)`
- `.lhint a:hover` — color shifts to `var(--accent)`
- `.lwrap.invalid` — border shifts to plum on auth failure

`terminal-cms-gate.css` is imported by this component (created in 001). No new CSS rules need to be added here — all rules should already exist in that file.

---

## Acceptance criteria

- [ ] Navigating to `/cms` when unauthenticated shows the terminal card login (dark background, traffic-light dots, monospace font)
- [ ] Password field is focused on mount
- [ ] Hovering the input wrapper (before clicking) brightens the border one step
- [ ] Clicking into the field shows the accent focus ring — distinct from the hover state
- [ ] Submitting with an empty field shows the plum error message and invalid border
- [ ] During auth request the button shows blinking cursor + "authenticating…" text and is disabled
- [ ] Failed auth shows the inline error without a page reload
- [ ] Successful auth navigates to the CMS dashboard as before
- [ ] Eye toggle shows/hides the password and its icon swaps correctly
- [ ] Authenticate button glows with accent box-shadow on hover
- [ ] "← back to site" link navigates to `/`

---

## Tests required

Yes — render `CmsLoginGate` in isolation. Assert password field is focused on mount. Submit empty → assert error visible. Submit with value → assert button enters disabled/loading state. Follow existing component test patterns.

---

## Notes

- Auth logic is unchanged — do not modify `useCmsAuth` or `cmsVerifyAuth`.
- The `shadcn/ui` `Input`, `Button`, and `Label` imports can be removed from this component after the rebuild.
- Design reference: `terminal-cms-login.html` in the claude.ai/design project.

---

## Log

_Updated as work progresses._

Implemented on 2026-06-27. Rebuilt CmsLoginGate JSX to match terminal-cms-login.html design. Imports terminal-cms-gate.css (created in 001). Auth logic unchanged. Added showPassword/toggleEye state for eye toggle. Removed shadcn imports.
QA approved by user on 2026-06-27.
