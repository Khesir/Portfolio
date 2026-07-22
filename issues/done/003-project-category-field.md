---
id: issue-003
title: "Project category field (CMS editor + data payload)"
feature: dashboard-home
status: qa
created_at: 2026-07-13
tags: [afk, p1]
---

# [003] Project category field (CMS editor + data payload)

**Type:** AFK
**Priority:** P1
**Blocked by:** None
**User stories covered:** 15, 16

---

## What to build

Add a `category` field to the project data model on the frontend/CMS side: one of `'dev' | 'illustration' | 'tech-art'`, optional (existing projects may have no value set).

In the CMS project editor, add a `<select>` input with exactly these 3 fixed options alongside the existing fields (`name`, `releasedDate`, `imageUrl`, `languages`, `url`, `deployment`, `markdown`, `draft`, `pinned`). Include `category` in the save payload sent by the editor. When editing an existing project that already has a `category` value, the select must pre-populate with that value on load.

This issue is frontend + CMS only. The actual database column/migration lives in the separate `personal-backend` repository and is explicitly out of scope here — do not attempt to modify that repo. The expectation is that it will be a plain string column (no DB-level enum, no new table), so the frontend should send/read it as a plain string and not assume backend-side validation.

---

## Acceptance criteria

- [ ] CMS project editor has a category `<select>` with options Dev / Illustration / Tech Art
- [ ] Saving a project includes `category` in the outgoing payload
- [ ] Loading an existing project with a saved `category` pre-selects the matching option
- [ ] Loading a project with no `category` set does not error and leaves the field unselected/blank
- [ ] No changes made outside this repo (`personal-backend` untouched)

---

## Tests required

Yes — CMS project editor test: selecting a category and saving includes it in the payload; loading a project with a pre-set `category` shows it pre-selected; loading a project without one doesn't break the form.

---

## Notes

- This field is consumed later by issue 007 (dashboard Work grid category filter tabs) — that issue is blocked on this one.
- Independent of the dashboard routing work (issue 001) — can be implemented and demoed in the CMS on its own.
- Reference: `issues/prd.md` — "Project category field" section.

---

## Log

_Updated as work progresses._

- Implemented via TDD: added `category` state + `<select>` (Dev/Illustration/Tech Art, empty option for unset) to `CmsProjectEditor.tsx`, wired into load (pre-populates from `res.category`) and save payload. Added `category?: string` to `CreateProjectDto` in `src/app/api/cms.ts` so the DTO doesn't silently narrow it out.
- New test file `src/app/cms/pages/__tests__/CmsProjectEditor.test.tsx` (5 tests): select renders 3 fixed options; create payload includes chosen category; edit-load pre-selects existing category; edit-load with no category leaves select blank without error; update payload includes category. All 5 pass; `npm test` shows no regressions vs. baseline (pre-existing unrelated network-error failures unchanged).
