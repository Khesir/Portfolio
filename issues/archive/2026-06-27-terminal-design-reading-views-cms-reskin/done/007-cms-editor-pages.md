---
id: issue-007
title: "CMS editor pages"
feature: terminal-cms
status: done
created_at: 2026-06-27
tags: [afk, p2]
---

# [007] CMS editor pages

**Type:** AFK
**Priority:** P2
**Blocked by:** 003
**User stories covered:** 33–34

---

## What to build

Reskin the four CMS editor pages — `CmsBlogEditor`, `CmsProjectEditor`, `CmsExperienceEditor`, `CmsPostEditor` — to use the terminal form styling established by the config pages (`.cms-form`, `.fsection`, `.field`, `.frow`, `.save-bar`). The design spec does not provide dedicated editor page mockups, so the config page pattern from `terminal-cms-home.html` and `terminal-cms-about.html` is the reference. All existing editor wiring is preserved — create/update flows, markdown editor, image upload, tag input, draft toggle, engagement toggles.

**Shared editor pattern**
Each editor uses `.cms-top` (title "New Blog" / "Edit Blog" etc., terminal subtitle, optional Preview link), then `.cms-form` with `.fsection` sections grouping related fields, and a `.save-bar` at the bottom.

**Blog editor (`CmsBlogEditor`)**
Sections: metadata (name, release date, min read, image upload), tags (`TagInput`), content (`MarkdownEditor` with preview pane), settings (draft toggle, hide views toggle, hide hearts toggle). Save button calls `cmsCreateBlog` or `cmsUpdateBlog` depending on edit vs create mode.

**Project editor (`CmsProjectEditor`)**
Sections: metadata (name, release date, image upload), links (url/GitHub, deployment/live demo), languages (`TagInput`), content (`MarkdownEditor`), settings (draft toggle, pinned toggle, hide views, hide hearts). Save button calls `cmsCreateProject` or `cmsUpdateProject`.

**Experience editor (`CmsExperienceEditor`)**
Sections: role details (position, company name, job type, employment type), duration (start date, end date — empty = current), image upload, highlight skills (`TagInput`), content (`MarkdownEditor` for `pageMd`), settings (draft toggle, hide views, hide hearts). Save button calls `cmsCreateExperience` or `cmsUpdateExperience`.

**Post editor (`CmsPostEditor`)**
Sections: content (textarea for short-form text, optional image upload), tags (`TagInput`), settings (draft toggle, pinned toggle, hide views, hide hearts). Save button calls `cmsCreatePost` or `cmsUpdatePost`.

---

## Acceptance criteria

- [ ] All four editors render their form fields inside `.cms-form` / `.fsection` / `.field` structure with no Tailwind classes.
- [ ] `CmsBlogEditor` pre-populates all fields when editing an existing blog; fields are empty in create mode.
- [ ] `MarkdownEditor` component renders correctly inside the `.field` terminal form structure.
- [ ] `ImageUpload` component renders correctly inside `.img-drop` terminal wrapper.
- [ ] `TagInput` component renders correctly inside `.field` terminal wrapper.
- [ ] `DraftToggle` and `EngagementToggles` render correctly inside a `.fsection` settings section.
- [ ] Save button in each editor calls the correct API function (create or update) with the full payload.
- [ ] After a successful save, the editor navigates back to the list page (existing behavior preserved).
- [ ] Delete button (in edit mode) calls the correct delete API function and navigates back to the list.
- [ ] `.save-bar` shows "last saved X ago" after a successful save.
- [ ] No Tailwind classes remain in any of the four editor pages.
- [ ] Editors work correctly in dev mode (dev mode skips API calls — existing `devSkip` behavior preserved).

---

## Tests required

Yes.

- `CmsBlogEditor` in create mode: submitting the form calls `cmsCreateBlog` with the correct payload (name, markdown, tags, draft flag).
- `CmsBlogEditor` in edit mode: pre-populates fields from the fetched blog data; submitting calls `cmsUpdateBlog`.
- `CmsProjectEditor`: pinned toggle updates the `pinned` field in the payload on save.
- `CmsPostEditor`: submitting calls `cmsCreatePost` with content and tags.

---

## Notes

- The existing sub-components (`MarkdownEditor`, `ImageUpload`, `TagInput`, `DraftToggle`, `EngagementToggles`, `ConfirmDialog`) are not reskinned — they are dropped into the new terminal form markup as-is. Their internal Tailwind styling is acceptable to leave intact for this slice.
- The `MarkdownEditor` live preview pane should use the updated `MarkDownComponent` from issue 001 so authors see the terminal prose styles while writing.
- Edit vs create mode detection is already in place (presence of `:id` param) — do not change this logic.
- The `.save-bar` "last saved" hint uses a `savedAt` state timestamp set after a successful API response.

---

## Log

_Updated as work progresses._

### 2026-06-27 — Implementation complete

Reskinned all four editor pages (`CmsBlogEditor`, `CmsProjectEditor`, `CmsExperienceEditor`, `CmsPostEditor`).

- Removed all Tailwind classes and shadcn `Input`/`Label`/`Button`/`Textarea` imports from each editor page.
- Replaced markup with `.cms-top` / `.cms-form` / `.fsection` / `.field` / `.frow` / `.save-bar` structure.
- Added `savedAt: Date | null` state and `relativeTime()` helper; `.save-bar` shows "last saved Xm ago" after successful save.
- Added delete flow to all four editors: `btn-ol` Delete button (edit mode only) → `ConfirmDialog` → `cmsDeleteBlog/Project/Experience/Post` → navigate back.
- `CmsProjectEditor` and `CmsPostEditor` pinned toggle replaced with `.feat` button using pin SVG.
- `CmsExperienceEditor` selects use native `<select>` inside `.field` (styled by terminal-cms.css).
- All existing state, API calls, navigation, and `useEffect` pre-population logic preserved unchanged.

QA approved by user on 2026-06-27.
