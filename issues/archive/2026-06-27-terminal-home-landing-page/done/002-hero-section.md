---
id: issue-002
title: "Hero section"
feature: terminal-home
status: done
created_at: 2026-06-26
tags: [afk, p1]
---

# 002 Hero section

**Type:** AFK
**Priority:** P1
**Blocked by:** 001
**User stories covered:** 2, 3, 4, 5, 6, 7, 23

---

## What to build

Implement the hero section inside the terminal homepage. The hero is a two-column grid: left column holds the identity content, right column holds the neofetch terminal window.

**Left column:**
- Terminal prompt line (`aj@khesir:~$ whoami`)
- Name (`config.name`) in large serif type
- Role (`config.role`) in monospace
- Blurb (`config.description`)
- Two CTA buttons: "View work →" linking to `/projects`, and "$ cat about.me" linking to `/about`
- Tag row: location/timezone tag and any additional static tags (agentic AI, APIs & tooling)
- "available for work" badge in the header derived from `config.status` — show green dot + label when `status.type === 'online'`, adjust dot color and label for other states

**Right column (neofetch terminal window):**
- macOS-style traffic-light dots + title bar
- `neofetch` command line with cursor
- Profile image (`config.profileImageUrl`, fallback `/img/Mee.png`) as the avatar
- Info rows: Role (from `config.role`), plus hardcoded rows for Uptime, Editor, Lang, Stack, Locale (no CMS equivalent exists for these)
- Color swatch strip

All data comes from `useHomeConfig()`.

---

## Acceptance criteria

- [ ] Hero renders in two columns on desktop; stacks to a single column on mobile (≤860px).
- [ ] Name, role, and blurb reflect live `useHomeConfig()` data.
- [ ] "View work →" navigates to `/projects`; "$ cat about.me" navigates to `/about`.
- [ ] The "available for work" badge shows in the header with a green dot when `status.type === 'online'`.
- [ ] The neofetch window renders with the profile image, username header, and info rows.
- [ ] Profile image falls back to `/img/Mee.png` when `config.profileImageUrl` is empty.

---

## Tests required

Yes — render with mocked `useHomeConfig` data, assert that name, role, and description appear in the output; assert CTA links have correct `href` values; assert the status badge renders for `online` status.

---

## Notes

- The neofetch rows for Editor, Uptime, Lang, Stack, and Locale are hardcoded — no CMS field maps to them.
- The `status` field on `HomeConfig` has types: `'online' | 'idle' | 'dnd' | 'custom'`. Only `online` maps to the green "available for work" label — decide the label and dot for other states.
- The accent color in the hero gradient is driven by `--accent` from `mock.css`/`terminal.css`; it defaults to blue and requires no runtime override.

---

## Log

_Updated as work progresses._

Implemented hero section with left column (name, role, blurb, CTAs, meta tags) and neofetch terminal window. Status badge in header made dynamic from config.status. Tests added for name/role/description rendering, CTA hrefs, status badge, and profile image fallback.

QA approved by user on 2026-06-27.
