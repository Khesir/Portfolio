---
id: issue-001
title: "Home config schema cleanup + hero buttons wired"
feature: home-config
status: qa
created_at: 2026-06-28
tags: [afk, p1]
---

# [001] Home config schema cleanup + hero buttons wired

**Type:** AFK
**Priority:** P1
**Blocked by:** None
**User stories covered:** 4, 7, 8, 9

---

## What to build

Remove stale fields from the home config that no longer have a corresponding element on the public page. Restructure the CMS Home Config editor to reflect what the page actually uses. Wire the renamed hero buttons to the hero CTA row on the public page.

End-to-end: DTO shape → mock data defaults → `useHomeConfig` hook defaults → CMS editor layout → `TerminalHomePage` hero CTA row.

**Fields to remove:** `bannerTitle`, `bannerSubtitle`, `languages`

**Field to rename:** `bannerButtons` → `heroButtons` (same `BannerButton[]` shape)

**CMS editor restructure:**
- Remove the "Availability Banner" section heading and its title/subtitle inputs
- Remove the "Languages / Tech Stack" section entirely
- Move `bannerImageUrl` upload into the existing "Profile" section
- Rename the remaining buttons editor label to "Hero Buttons"
- The backend guide comment in `cms.ts` should be updated to reflect the removed and renamed fields

**Public page change:** The hero CTA row (`<div className="hacts">`) currently renders two hardcoded `<Link>` elements. Replace them with a render of `config.heroButtons`, mapping each button through the same routing/action logic as `BannerButtonEditor` supports (to, href, action).

---

## Acceptance criteria

- [ ] `bannerTitle`, `bannerSubtitle`, and `languages` are removed from `UpdateHomeConfigDto`, the mock data, and `useHomeConfig` defaults
- [ ] `bannerButtons` is renamed to `heroButtons` everywhere (DTO, mock, hook, CMS editor, public page)
- [ ] CMS Home Config page no longer shows the Availability Banner title/subtitle inputs or the Languages/Tech Stack section
- [ ] `bannerImageUrl` upload field appears inside the Profile section in the CMS
- [ ] The hero CTA buttons on the public home page render from `config.heroButtons` instead of hardcoded links
- [ ] Default mock `heroButtons` preserve the existing two buttons ("View work →" linking to `/work`, "$ cat about.me" linking to `/about`)
- [ ] Backend guide comment in `cms.ts` is updated to match the new shape

---

## Tests required

Yes — update `terminalHomePage.test.tsx`: assert hero CTA buttons render from config values rather than matching hardcoded text. Existing tests that assert on "View work" or "cat about.me" should be updated to drive from mock config.

---

## Notes

This is the foundation slice. Issues 002, 003, and 004 all add new fields to the same DTO and CMS editor — they must wait for this to land first.

The `BannerButton` type supports `to` (internal route), `href` (external link), `action` ('contact'), and `variant`. The hero row renderer should handle all four.

---

## Log

_Updated as work progresses._

Implemented 2026-06-29. Removed bannerTitle, bannerSubtitle, languages from DTO/hook/CMS editor; renamed bannerButtons → heroButtons everywhere. Hero CTA buttons on public page now render dynamically from config.heroButtons. Updated terminalHomePage.test.tsx to drive button assertions from mock config.
