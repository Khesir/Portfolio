---
id: issue-004
title: "Footer & Contact wired to config"
feature: home-config
status: backlog
created_at: 2026-06-28
tags: [afk, p2]
---

# [004] Footer & Contact wired to config

**Type:** AFK
**Priority:** P2
**Blocked by:** 001
**User stories covered:** 25, 26, 27, 28, 29

---

## What to build

Add footer and contact fields to the home config. Wire `TerminalContactSection` and the `TerminalLayout` footer to read from config instead of hardcoded values. Add a "Footer & Contact" section to the CMS Home Config editor.

End-to-end: `UpdateHomeConfigDto` → mock data → `useHomeConfig` defaults → CMS "Footer & Contact" section → `TerminalContactSection` + `TerminalLayout` footer.

**New fields:**
- `contactHeading: string` — the `<h2>` in the contact card. Default: `"Let's build something & make it faster."`
- `contactSubtext: string` — the `<p>` below the heading. Default: `'Open for engineering work and collaborations.'`
- `socialLinks: { label: string; href: string; icon: string }[]` — rendered as icon anchor tags in both the contact section and the footer. Default values should map the current four placeholders (GitHub, LinkedIn, Twitter, Email) with empty `href` replaced by real placeholder strings so they're obvious to fill in.
- `footerCopyright: string` — left side of the footer. Default: `'© 2026 AJ — Khesir'`
- `footerTagline: string` — right side of the footer. Default: `'direction B — "Terminal" · tech-first'`

**CMS editor — Footer & Contact section:** Text inputs for `contactHeading`, `contactSubtext`, `footerCopyright`, `footerTagline`. A repeatable list editor for `socialLinks` with label, href, and icon fields per entry (use `IconSelector` for the icon field, consistent with the rest of the CMS).

**Public page:**
- `TerminalContactSection`: replace hardcoded heading, subtext, and `<a href="#">` social icons with config values. The `contactEmail` button already reads from config — keep it.
- `TerminalLayout` footer: replace hardcoded `<span>` text with `config.footerCopyright` and `config.footerTagline`. Render `config.socialLinks` as icon anchors in the footer if desired, or keep the footer text-only — either is acceptable as long as `footerCopyright` and `footerTagline` are config-driven.

---

## Acceptance criteria

- [ ] `contactHeading`, `contactSubtext`, `socialLinks`, `footerCopyright`, `footerTagline` are added to `UpdateHomeConfigDto`, mock data, and `useHomeConfig` defaults
- [ ] Default values preserve the current visual appearance before any CMS edit
- [ ] CMS Home Config shows a "Footer & Contact" section with all five fields editable
- [ ] `TerminalContactSection` renders heading, subtext, and social links from config
- [ ] Social link `href` values from config are used (no more hardcoded `#`)
- [ ] `TerminalLayout` footer renders copyright and tagline from config
- [ ] Empty `socialLinks` array renders no social icons without crashing

---

## Tests required

Yes — `TerminalContactSection` test: mock `useHomeConfig` with custom `contactHeading`, `contactSubtext`, and `socialLinks` and assert they appear in the DOM. The existing test that asserts on the `#` placeholder hrefs should be updated to assert real configured hrefs.

---

## Notes

The `icon` field in `socialLinks` is an Iconify ID string. The contact section currently uses plain unicode characters (⌥, ◆, ✕, ✉) — replace with rendered Iconify icons consistent with how `TerminalStackSection` renders tech icons, or keep as unicode symbols if the design calls for it. Confirm the visual approach before implementing.

---

## Log

_Updated as work progresses._
