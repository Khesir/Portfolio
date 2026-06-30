---
id: issue-002
title: "CMS service config editor extensions"
feature: service-card
status: done
created_at: 2026-06-29
tags: [afk, p2]
---

# [002] CMS service config editor extensions

**Type:** AFK
**Priority:** P2
**Blocked by:** 001
**User stories covered:** 15, 16, 17, 18, 19, 22, 23

---

## What to build

Extend `CmsServiceConfig` with two new sections above the existing Services list so the site owner can edit all flip card copy and contact details without touching code.

**Card Copy section** — inputs for `greeting` (text), `headline` (text), `roleLabel` (text), `siteUrl` (text), and `profileImageUrl` (image upload). The image upload should follow the same pattern as the profile image upload in `CmsAboutConfig`.

**Contact section** — a `contactEmail` text input and a repeatable `socialLinks` list editor. Each social link row has `label`, `href`, and `icon` fields. Use `IconSelector` for the icon field, consistent with the rest of the CMS. Use the `rep-row` pattern already established in the existing services list.

Both new sections feed into the existing save handler. The `cmsUpdateServiceConfig` call must send the full config object — existing services array plus all new fields — in a single PUT.

---

## Acceptance criteria

- [ ] "Card Copy" section renders above the Services list with inputs for all 5 card copy fields
- [ ] Profile image upload works and stores the URL in `profileImageUrl`
- [ ] "Contact" section renders below Card Copy with a `contactEmail` input and a `socialLinks` repeatable list editor
- [ ] Each social link row has label, href, and icon (IconSelector) inputs with add and remove controls
- [ ] Saving the form sends all new fields alongside the existing `services` array
- [ ] Loading the page populates all new fields from the fetched config
- [ ] Empty `socialLinks` array is handled without error on load and save

---

## Tests required

No — consistent with the project convention that CMS editor pages are not unit-tested.

---

## Notes

Follow the `rep-row` / `rep` / `frow` / `field` CSS class patterns already used in `CmsServiceConfig` and `CmsAboutConfig` — do not introduce new class names or inline styles beyond what is already established.

`IconSelector` and `TagInput` components are already imported in `CmsServiceConfig` — they are available without new imports for the icon field.

The save handler currently only sends `{ services }`. It must be updated to send all fields. Make sure the state shape in the component matches the extended `UpdateServiceConfigDto`.

---

## Log

_Updated as work progresses._

Implemented 2026-06-29. Added "Card Copy" fsection above Services with ImageUpload for profileImageUrl and text inputs for greeting, headline, roleLabel, siteUrl. Added "Contact" fsection with contactEmail text input and a rep/rep-row socialLinks list editor where each row has label, href, and IconSelector icon fields with add/remove controls. ImageUpload imported from existing CMS component; all state and save handler were already wired from issue 001.
QA approved by user on 2026-06-30.
