---
id: issue-005
title: "CMS list pages"
feature: terminal-cms
status: qa
created_at: 2026-06-27
tags: [afk, p2]
---

# [005] CMS list pages

**Type:** AFK
**Priority:** P2
**Blocked by:** 003
**User stories covered:** 26–29

---

## What to build

Reskin the four CMS list pages — `CmsBlogs`, `CmsProjects`, `CmsExperiences`, `CmsPosts` — to match the terminal CMS list page designs. All existing data fetching, search state, filter state, and action handlers (create, edit, delete, feature/unfeature, pin) are preserved — only markup and class names change.

**Shared list page pattern**
Each page uses `.cms-top` (page title + terminal subtitle + action button), `.cms-toolbar` (search input with icon + filter pill buttons), `.cms-table` with `.cms-listhead` and `.lrow` rows.

**Blogs (`CmsBlogs` → `terminal-cms-blogs.html`)**
- Filter tabs: All / Published / Drafts.
- Each `.lrow`: title (with `.cbadge.draft` when draft), release date, Edit link + Delete button.
- "Draft" badge visible only on draft entries.

**Projects (`CmsProjects` → `terminal-cms-projects.html`)**
- Filter tabs: All / Featured / Drafts.
- Each `.lrow`: title (with `.cbadge.feat` when pinned), year, Feature/Unfeature toggle button (`.feat.on` when pinned, `.feat` when not), Edit link, Delete button.
- Clicking Feature/Unfeature calls the existing `cmsUpdateProject` with `{ pinned: !current }`.

**Experiences (`CmsExperiences` → `terminal-cms-experiences.html`)**
- Filter tabs: All / Current / Drafts.
- Each `.lrow`: position title + company/type sub-label (`.lsub`), period (`durationStart — durationEnd` or "now"), `.cbadge.feat` "current" badge when `durationEnd` is null, Edit link, Delete button.

**Posts (`CmsPosts` → `terminal-cms-posts.html`)**
- No table — card feed (`.cms-posts`) with `.cpost` cards.
- Each card: content text, relative timestamp, draft/pinned badges, hashtag pills.
- Actions per card: pin toggle (calls existing `cmsUpdatePost` with `{ pinned: !current }`), edit button (navigates to editor), delete button.
- Pinned card shows `.cbadge.pin` badge and `.pin.on` button state.
- "New Post" button navigates to the post editor.

---

## Acceptance criteria

- [ ] `CmsBlogs` renders all blogs in `.lrow` rows; draft entries show the `.cbadge.draft` badge.
- [ ] Blog search input filters rows by title (client-side filter on existing state).
- [ ] Blog filter tabs (All / Published / Drafts) filter the visible rows correctly.
- [ ] Blog Edit link navigates to the correct editor route; Delete button calls `cmsDeleteBlog` and removes the row.
- [ ] `CmsProjects` renders all projects; pinned entries show `.cbadge.feat` and `.feat.on` button.
- [ ] Feature toggle calls `cmsUpdateProject` with the correct `{ pinned }` payload and updates button state.
- [ ] `CmsExperiences` renders all experiences with position, company, period, and "current" badge where `durationEnd` is null.
- [ ] `CmsPosts` renders post cards with content, timestamp, badges, and hashtag pills.
- [ ] Post pin toggle calls `cmsUpdatePost` and updates `.pin.on` state.
- [ ] "New" buttons on all pages navigate to the correct editor routes.
- [ ] No Tailwind classes remain in any of the four list pages.
- [ ] All pages render in dev mode (dev mode returns empty arrays — empty state is handled gracefully).

---

## Tests required

Yes.

- `CmsBlogs`: given a mock list with mixed draft/live entries, draft rows show the `.cbadge.draft` badge; live rows do not. Delete button calls `cmsDeleteBlog` with the correct id.
- `CmsProjects`: Feature button calls `cmsUpdateProject` with `{ pinned: true }` for an unpinned project.
- `CmsPosts`: Pin button calls `cmsUpdatePost` with `{ pinned: true }` for an unpinned post.

---

## Notes

- Search filtering is already implemented client-side in the existing pages — preserve the filter logic, only change the rendered markup.
- The "current" badge on experiences is derived from `durationEnd` being `null` or absent — no new API field needed.
- Relative timestamps for posts (e.g. "2h ago", "1d ago") use the existing `createdAt` field — keep whatever utility is already in use.

---

## Log

- 2026-06-27: Implemented. Removed CmsTable, Button, lucide-react, and shadcn imports from all four pages. Added search + filter state to CmsBlogs, CmsProjects, CmsExperiences (none existed previously). CmsPosts reskinned to card feed (.cms-posts / .cpost). All Tailwind classes replaced with terminal-cms.css classes. Handlers preserved exactly.
