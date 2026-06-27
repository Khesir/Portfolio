---
id: issue-006
title: "Contact CTA + footer"
feature: terminal-home
status: done
created_at: 2026-06-26
tags: [afk, p2]
---

# 006 Contact CTA + footer

**Type:** AFK
**Priority:** P2
**Blocked by:** 001
**User stories covered:** 18, 19, 20

---

## What to build

Implement the contact CTA section and footer at the bottom of the terminal homepage.

**CTA section:**
- Eyebrow label (`// get in touch`)
- Heading: "Let's build something & make it faster."
- Subtext: "Open for engineering work and collaborations."
- Email button linking to `mailto:${config.contactEmail}` — uses `useHomeConfig()`.
- Four social icon links with `href="#"` as placeholders (GitHub, LinkedIn, X/Twitter, email or similar). Icons should use the existing `@iconify/react` package or plain Unicode/SVG symbols as in the design.
- Radial glow decorative element behind the section.

**Footer:**
- Left: `© 2026 AJ — Khesir`
- Right: `direction B — "Terminal" · tech-first`

---

## Acceptance criteria

- [ ] CTA section renders with heading, subtext, and email button.
- [ ] Email button `href` is `mailto:` + `config.contactEmail` from `useHomeConfig`.
- [ ] Email button does not render when `config.contactEmail` is empty.
- [ ] Four social links render with `href="#"`.
- [ ] Footer renders with copyright text on the left and direction label on the right.

---

## Tests required

Yes — render with mocked `useHomeConfig` returning a contact email, assert the mailto link is present with the correct href; assert the email button is absent when `contactEmail` is empty.

---

## Notes

- Social links are intentional `href="#"` placeholders — no CMS field exists for social URLs in the current scope.
- The glow element is a purely decorative `<div class="glow">` — no logic required.

---

## Log

_Updated as work progresses._

Created TerminalContactSection component with dynamic mailto link from useHomeConfig().contactEmail, static social placeholders, and CTA copy. Tests verify mailto href, conditional email button, and social links.

QA approved by user on 2026-06-27.
