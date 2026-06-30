---
id: issue-006
title: "CMS config pages"
feature: terminal-cms
status: done
created_at: 2026-06-27
tags: [afk, p2]
---

# [006] CMS config pages

**Type:** AFK
**Priority:** P2
**Blocked by:** 003
**User stories covered:** 30–32

---

## What to build

Reskin the three CMS config pages — `CmsHomeConfig`, `CmsAboutConfig`, `CmsServiceConfig` — to match the terminal CMS config page designs. All existing form state, fetch-on-mount, and save handlers are preserved — only markup and class names change.

**Shared config page pattern**
Each config page uses `.cms-top` (page title + terminal subtitle + "Preview ↗" link), `.cms-form` wrapper, `.fsection` sections with `<h2>` headings, `.field` for individual fields, `.frow` for side-by-side fields, `.rep` / `.rep-row` for repeatable lists, and `.save-bar` at the bottom with save button and "last saved X ago" hint.

**Home config (`CmsHomeConfig` → `terminal-cms-home.html`)**
Sections:
- Availability banner: banner image upload (`.img-drop`), title + subtitle fields (`.frow`), buttons repeater (`.rep-row` with grip handle, label, action/variant sub-label, remove button, "+ Add button" trigger).
- Status: pill selector (`.status-pills`) for Online / Idle / Do Not Disturb / Custom, optional custom message field.
- Profile: profile image upload, name + role fields (`.frow`), contact email field, short description textarea.
- Tech stack: languages repeater (`.rep-row` with icon pill, label, remove button, "+ Add language" trigger).

**About config (`CmsAboutConfig` → `terminal-cms-about.html`)**
Sections:
- Professional summary: mono-font textarea for markdown content.
- Technical skills: skill category repeater — each row shows category name + chip tags; "+ Add category" trigger.
- Core competencies: chip tag input with "+ Add competency" flow.

**Services config (`CmsServiceConfig` → `terminal-cms-services.html`)**
Sections:
- Services repeater: each `.rep-row` shows icon, title + mainTag badge, description, stack chips. "+ Add service" trigger. Remove button per row.

---

## Acceptance criteria

- [ ] `CmsHomeConfig` renders all sections (banner, status, profile, tech stack) with current config values pre-populated.
- [ ] Status pill selector highlights the active status type; selecting a new type updates the form state.
- [ ] Banner and profile image upload areas call the existing `cmsUploadImage` handler on file selection.
- [ ] Buttons repeater and tech stack repeater render existing items; add/remove actions update form state.
- [ ] Save button calls `cmsUpdateHomeConfig` with the current form state.
- [ ] `CmsAboutConfig` renders professional summary textarea, skills categories with chips, and competency chip input.
- [ ] Skills category add/remove and competency chip add/remove update form state correctly.
- [ ] Save button calls `cmsUpdateAboutConfig` with the current form state.
- [ ] `CmsServiceConfig` renders all services in `.rep-row` cards with icon, title, tag, description, and stack chips.
- [ ] Add/remove service updates form state; save button calls `cmsUpdateServiceConfig`.
- [ ] "Preview ↗" links point to the correct public pages (`/`, `/about`, `/projects` respectively).
- [ ] No Tailwind classes remain in any of the three config pages.
- [ ] Pages render in dev mode (form pre-populated from mock config data).

---

## Tests required

Yes.

- `CmsHomeConfig`: Save button calls `cmsUpdateHomeConfig` with a payload containing updated form field values.
- `CmsAboutConfig`: Adding a competency tag updates the `coreCompetencies` array in form state before save.
- `CmsServiceConfig`: Removing a service updates the `services` array in form state before save.

---

## Notes

- The `.img-drop` image upload zone is a styled wrapper around the existing `ImageUpload` component — wrap it in the new markup, don't replace the upload logic.
- The `.grip` drag handle (⠿) in repeaters is visual only — drag-to-reorder is out of scope per the PRD. Render the handle as a non-interactive element.
- The "last saved X ago" hint in `.save-bar` can be derived from a `savedAt` timestamp stored in component state after a successful save, same as any existing implementation.
- `.status-pills` replaces the existing select/radio for status type — map the four pill buttons to the four `StatusType` values (`online`, `idle`, `dnd`, `custom`).

---

## Log

_Updated as work progresses._

### 2026-06-27 — Implementation complete

- Rewrote `CmsHomeConfig.tsx`: removed all Tailwind/shadcn, added `cms-top` header with Preview link, `cms-form` with four `fsection` blocks (Availability Banner, Status, Profile, Languages/Tech Stack), inline `.status-pills`, `.rep`/`.rep-row` for languages and buttons, `savedAt` + `relativeTime` save hint, `.save-bar`.
- Rewrote `CmsAboutConfig.tsx`: removed all Tailwind/shadcn/MarkdownEditor/preview dialog, added three `fsection` blocks (Professional Summary with `.field.mono` textarea, Technical Skills with `.rep` repeater, Core Competencies with `TagInput`), `savedAt` save hint. State for `location`, `lastUpdatedAt`, `profileImageUrl`, `aboutButtons` preserved in memory and sent on save.
- Rewrote `CmsServiceConfig.tsx`: removed all Tailwind/shadcn/preview dialog, `ServiceCard` now renders as `.rep-row` with `.grip`, `.ico` preview, `.rmain` (display summary + editing fields), `.rm` Remove. `savedAt` save hint. All save handlers and API calls unchanged.

QA approved by user on 2026-06-27.
