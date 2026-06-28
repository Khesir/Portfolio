---
id: issue-005
title: "About bio fields"
feature: about-config
status: ready
created_at: 2026-06-28
tags: [afk, p1]
---

# [005] About bio fields

**Type:** AFK
**Priority:** P1
**Blocked by:** None
**User stories covered:** 10, 11, 12, 13

---

## What to build

Add two new fields to the about config that cover the currently hardcoded bio prose on the about page. Wire them to the public page. Add the corresponding CMS editor fields.

End-to-end: `UpdateAboutConfigDto` → mock data → `useAboutConfig` hook defaults → CMS About Config editor → `TerminalAboutPage` prose section.

**New fields:**
- `bioTagline: string` — the bold lead sentence rendered as `.lead` paragraph ("I build software — and I build the tools that build software.")
- `bioBody: string` — markdown/textarea for the body paragraphs below the tagline

`professionalSummary` is untouched — it continues to power the `.plede` subtitle in the page header.

**CMS editor:** Insert `bioTagline` (single-line input) and `bioBody` (textarea) between the profile image upload and the existing `professionalSummary` field, so the form reads in the same top-to-bottom order as the page.

**Public page:** Replace the hardcoded `<p className="lead">` and the two hardcoded `<p>` paragraphs in the `.prose` div with `config.bioTagline` and a rendered `bioBody`. Since `bioBody` is markdown, use the existing `MarkDownComponent` or preserve newlines via whitespace — whichever matches the current visual output.

**No cross-referencing:** The about config's `profileImageUrl` is already independent from home config. No change needed there.

---

## Acceptance criteria

- [ ] `bioTagline` and `bioBody` are added to `UpdateAboutConfigDto`, mock data, and `useAboutConfig` defaults
- [ ] Default mock values match the current hardcoded text so the page looks identical before any CMS edit
- [ ] CMS About Config shows `bioTagline` input and `bioBody` textarea between profile image and `professionalSummary`
- [ ] `TerminalAboutPage` renders `bioTagline` from config in the `.lead` paragraph
- [ ] `TerminalAboutPage` renders `bioBody` from config in place of the hardcoded paragraphs
- [ ] `professionalSummary` still renders in the `.plede` position in the page header, unchanged

---

## Tests required

Yes — `TerminalAboutPage` test: mock `useAboutConfig` returning custom `bioTagline` and `bioBody` values and assert they appear in the DOM. Assert `professionalSummary` still renders separately.

---

## Notes

`bioBody` should support at minimum line-break rendering. If `MarkDownComponent` is used, the existing import in `experienceSection.tsx` is prior art.

---

## Log

_Updated as work progresses._
