---
id: issue-001
title: "Service config schema extension"
feature: service-card
status: done
created_at: 2026-06-29
tags: [afk, p1]
---

# [001] Service config schema extension

**Type:** AFK
**Priority:** P1
**Blocked by:** None
**User stories covered:** 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25

---

## What to build

Extend the service config data layer end-to-end with 7 new fields needed by the flip card. No UI changes in this slice — this is the foundation that issues 002 and 003 both depend on.

**New fields to add:**
- `greeting: string` — front face greeting line (e.g. "Hey —")
- `headline: string` — front face headline (e.g. "here's what I can help with.")
- `roleLabel: string` — front face role/identity line
- `siteUrl: string` — front face URL label
- `profileImageUrl: string` — front face avatar image URL
- `contactEmail: string` — back footer preferred email
- `socialLinks: SocialLink[]` — back footer icon links; reuse the existing `SocialLink` type from `HomeConfig`, do not duplicate the type definition

End-to-end: `UpdateServiceConfigDto` → `fetchServiceConfig` mock data → `ServiceConfig` interface → `DEFAULT_SERVICE` in `use-home-config.ts`.

The backend guide comment in `cms.ts` for the service config endpoint should be updated to document the new fields.

---

## Acceptance criteria

- [ ] All 7 new fields are added to `UpdateServiceConfigDto`
- [ ] `ServiceConfig` interface is extended with all 7 new fields
- [ ] `DEFAULT_SERVICE` includes sensible defaults for all 7 new fields
- [ ] `fetchServiceConfig` dev mock returns all 7 new fields with realistic default values
- [ ] `SocialLink` type is imported/reused — not duplicated
- [ ] Backend guide comment in `cms.ts` documents the new fields
- [ ] TypeScript compiles without errors (no implicit `any` on the new fields)

---

## Tests required

No — this slice is pure type and data layer. The consuming components (issues 002 and 003) carry the tests.

---

## Notes

`SocialLink` is currently defined in `cms.ts` and re-exported from `use-home-config.ts`. Import from whichever is the canonical export — do not create a second definition.

Default mock values should match what the design showed: greeting `"Hey —"`, headline `"here's what I can help with."`, a realistic role label, `"khesir.dev"` as siteUrl, empty string for profileImageUrl (avatar falls back gracefully), a contact email, and at least two social links (X/Twitter and one other).

---

## Log

Implemented 2026-06-29. Extended UpdateServiceConfigDto, ServiceConfig interface, DEFAULT_SERVICE, and fetchServiceConfig mock with 7 new fields (greeting, headline, roleLabel, siteUrl, profileImageUrl, contactEmail, socialLinks). Updated CmsServiceConfig state/save handler to carry new fields. Updated backend guide comment in cms.ts.
QA approved by user on 2026-06-30.
