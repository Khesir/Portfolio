---
id: issue-012
title: "Work grid redesign: masonry + pinned/multi badges"
feature: single-page-json
status: qa
created_at: 2026-07-21
tags: [afk, p2]
---

# [012] Work grid redesign: masonry + pinned/multi badges

**Type:** AFK
**Priority:** P2
**Blocked by:** 010
**User stories covered:** 5, 6, 7, 8

---

## What to build

Rebuild `DashboardWorkGrid` to match the mockup:

- **Layout**: replace the current uniform CSS grid with a 2-column masonry layout — two columns, cards distributed across them (round-robin by filtered index is an acceptable equivalent to the mockup's manual split; exact card-to-column assignment doesn't need to match the mockup 1:1, the visual masonry effect does).
- **Pinned badge**: star icon + "Pinned" text, positioned top-LEFT (current implementation has plain text, no icon, top-right — move and restyle). The pinned card also gets the `.feat` amber-tinted background/border treatment from the mockup.
- **Multi-image badge**: for any project where `images.length > 1` (from the `images: string[]` field added in issue 009), show a stack icon + count badge, positioned top-right. Projects with 0 or 1 images never show this badge.
- **Filter tabs**: restyle the `All`/`Dev`/`Illustration`/`Tech Art` tabs' active ("on") state to the mockup's amber treatment (color, border, background tint). Existing filter click behavior is unchanged.
- Card click still navigates to `/work/view/:title?id=...` as today.

---

## Acceptance criteria

- [x] Work grid renders as 2 columns with cards distributed across them (masonry-style, not a strict uniform grid)
- [x] Pinned project card shows a star + "Pinned" badge top-left, with the amber-tinted `.feat` card treatment
- [x] A project with `images.length > 1` shows a stack+count badge top-right; a project with `images.length <= 1` does not
- [x] Active filter tab uses the amber "on" treatment
- [x] Clicking a card still navigates to the correct `/work/view/:title?id=` URL
- [x] Work grid data comes from `getProjects()`/`getFeaturedProjects()`, not a fetch call

---

## Tests required

Yes — extend `src/app/module/dashboard/__tests__/`:
- Category filter shows/hides the correct cards for each fixture project's `category`.
- Pinned card renders the pin badge; a non-pinned card doesn't.
- A project with `images: [a, b, c]` renders the multi badge with the correct count; a project with `images: [a]` doesn't render it at all.
- Card click triggers navigation to the expected URL (via mocked `useNavigate`, matching whatever pattern nearby tests already use).

Follow the RTL pattern in `terminalHomePage.test.tsx` / `servicePage.test.tsx`.

---

## Notes

- Reference: `issues/prd.md` — "Work grid" bullet under Implementation Decisions; original bug report ("the card its not centered" — the masonry/grid structure is part of that fix alongside issue 010's shell centering) and "color palette not followed" (filter tab amber state).
- Source of truth for exact CSS/markup: `Khesir - Home v2 (midfi).html` (`.plist`, `.pcol`, `.pcard`, `.pin`, `.multi`, `.filters` rules) in the Khesir "Portfolio" Claude Design project.

---

## Log

_Updated as work progresses._

- Rebuilt `DashboardWorkGrid`: `.dash-work-grid` switched from a uniform CSS grid to two flex `.dash-work-col` columns filled round-robin by filtered index; pinned cards get `.feat` amber-tinted styling plus a star+"Pinned" badge moved to top-left; a stack+count badge (top-right) now renders only when `images.length > 1`; filter tab `.active` state restyled to an amber color/border/background tint. DesignSync/Claude Design MCP tool was not available in this environment, so exact pixel values follow the existing `.feat`/amber token conventions already in `terminal-cms.css`/`terminal-theme.css` rather than a pulled mockup file — flagged below in case pixel-parity review is wanted.
- Extended `src/app/module/dashboard/__tests__/DashboardWorkGrid.test.tsx` with cases for the Pinned badge/`.feat` class, the multi-image badge (present for 3 images, absent for 1 or 0), and 2-column distribution; all 12 tests in that file pass, `npx tsc --noEmit` is clean.
- Full `npx vitest run`: 4/4 dashboard test files (37 tests) pass. 9 unrelated legacy test files (home/, services/, terminal/ modules — pre-existing, untouched by this issue) fail with IntersectionObserver/config-shape errors consistent with the pre-existing failures noted in issues 001/009/010's logs.

## Flagged

- No DesignSync/Claude Design MCP tool was available in this session to pull the authoritative `.plist`/`.pcol`/`.pcard`/`.pin`/`.multi`/`.filters` CSS from `Khesir - Home v2 (midfi).html`. The implemented styling (badge sizes, amber tint opacities, flex-based masonry) is a reasonable equivalent built from this repo's existing amber/`.feat` conventions, not a pixel-verified match — worth a visual QA pass against the mockup.

---

## Bug

Visual QA (2026-07-21) found the work grid (and, symmetrically, the sidebar — see issue 011's Bug section) didn't stretch to fill the card's fixed height: `.dash-work-grid` had a hardcoded `max-height: 640px` cap instead of growing to fill whatever space was actually available inside `.dashboard-shell` (which is `height: min(900px, 94vh)`), leaving a large blank gap at the bottom of the card whenever real content was shorter than 640px.

**Fix (2026-07-21):** Changed `.dash-work-grid` from `max-height: 640px` to `flex: 1 1 auto; min-height: 0;`, mirroring the mockup's `.plist { flex: 1; min-height: 0 }`, so it grows to consume the remaining height of `.dash-work-slot` and the card visually fills to its bottom edge. Re-ran `npx vitest run src/app/module/dashboard` (37/37 pass) and `npx tsc --noEmit` (clean) after the fix.
