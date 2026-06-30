# PRD: Config-Public Route Sync & Rendering Rules

**Status:** Draft
**Date:** 2026-06-28

---

## Problem Statement

The public-facing pages and the CMS config pages have drifted out of sync. The home CMS config contains fields that no longer exist on the public page (banner title/subtitle, languages/tech stack), while the public page has hardcoded content that should be editable (neofetch rows, hero meta tags, contact section, footer). The about page's bio prose is fully hardcoded. The work and blog pages dump all data at once with no pagination, which will grow into a payload problem as content scales — especially since project records contain full markdown. The "Get In Touch" card and footer have placeholder social links that go nowhere.

---

## Solution

Restructure the home config to match what the public page actually renders: replace the stale banner fields with a neofetch rows editor, hero meta tags, and configurable hero buttons. Add bio fields to the about config. Add server-side pagination to the work page (tiered by featured → all) and a client-side show-more to the blog page. Wire social links and footer text to a new "Footer & Contact" section in the home config. Add an inline-expand for experience markdown on the about page journey section.

---

## User Stories

1. As a site owner, I want to edit the neofetch terminal rows (key-value pairs) in the CMS, so that the terminal window on the home page reflects accurate and current info without a code change.
2. As a site owner, I want a dedicated location field in the home config (displayed with a dot indicator), so that my location tag on the home page stays consistent.
3. As a site owner, I want to manage a plain tags array in the home config, so that I can update the specialty tags ("agentic AI", "APIs & tooling") shown below the hero buttons.
4. As a site owner, I want the hero CTA buttons ("View work →", "$ cat about.me") to come from a `heroButtons` config, so that I can change their labels, targets, and variants without touching code.
5. As a site owner, I want to control how many selected works are shown on the home page via a `selectedWorkCount` field, so that I can tune the preview without a deployment.
6. As a site owner, I want to control how many writing posts are shown on the home page via a `writingCount` field, so that I can tune the preview without a deployment.
7. As a site owner, I want the Languages / Tech Stack section removed from the home CMS config, so that I only manage tech stack in one place (the about config).
8. As a site owner, I want `bannerTitle` and `bannerSubtitle` removed from the home CMS config, since those fields no longer appear on the public page.
9. As a site owner, I want the banner image upload folded into the Profile section in the CMS, so that the "Availability Banner" heading no longer implies fields that don't exist.
10. As a site owner, I want to edit the bio tagline ("I build software — and I build the tools that build software.") in the about CMS config, so that the lead sentence on the about page is not hardcoded.
11. As a site owner, I want to edit the bio body paragraphs in the about CMS config, so that the prose below the tagline can be updated without a code change.
12. As a site owner, I want the about config's `bioTagline` and `bioBody` to be independent from `professionalSummary`, so that I have separate control over the hero subtitle and the portrait prose block.
13. As a site owner, I want the about page and home page to each carry their own `profileImageUrl`, so that I can show a different photo on each page without coupling the configs.
14. As a visitor, I want the about page journey section to initially show 5 experiences, so that the page loads quickly without a long list.
15. As a visitor, I want a "show more" button on the about journey section, so that I can load additional experiences on demand.
16. As a visitor, I want to click an experience row on the about page and see its full markdown description expand inline below the row, so that I can read the detail without leaving the page.
17. As a visitor, I want to collapse an expanded experience row by clicking it again, so that I can browse other entries cleanly.
18. As a visitor, I want the work page to show pinned/featured projects first, followed by non-pinned projects, so that the most important work is always at the top.
19. As a visitor, I want the work page to initially show 5 projects, so that the page loads fast.
20. As a visitor, I want a "show more" button on the work page that fetches the next batch from the server, so that I only download data I actually view.
21. As a site owner, I want the work page list endpoint to return lightweight project cards (no markdown field), so that list payloads stay small as the project count grows.
22. As a visitor, I want to open a project detail page to read its full markdown, so that the full content is only fetched when I choose to view it.
23. As a visitor, I want the blog page to initially show 5 posts, so that the page loads fast.
24. As a visitor, I want a "show more" button on the blog page that reveals more posts sorted by latest, so that I can browse without a full page reload.
25. As a site owner, I want to edit the "Get In Touch" heading and subtext in the home CMS config, so that the contact card copy can change without a code deploy.
26. As a site owner, I want to manage a `socialLinks` array (label, href, icon) in the home CMS config, so that the social icons in the contact section point to real URLs.
27. As a site owner, I want to edit the footer copyright text in the home CMS config, so that I can update the year or name without touching code.
28. As a site owner, I want to edit the footer tagline in the home CMS config, so that the theme descriptor can be changed from the CMS.
29. As a visitor, I want the social links in the footer and contact section to use the same configured URLs, so that links are consistent across the page.

---

## Implementation Decisions

### Home Config Schema Changes

Remove from `UpdateHomeConfigDto`:
- `bannerTitle`
- `bannerSubtitle`
- `languages` (tech stack; owned by about config)

Rename:
- `bannerButtons` → `heroButtons` (same `BannerButton[]` shape, wired to the hero CTA row)

Add to `UpdateHomeConfigDto`:
- `neofetchRows: { key: string; value: string }[]` — free-form key-value list; defaults match current hardcoded values (Role, Uptime, Editor, Lang, Stack, Locale)
- `location: string` — rendered with a dot indicator in `.hmeta`
- `tags: string[]` — plain tag array rendered in `.hmeta` after the location tag
- `selectedWorkCount: number` — default 3; controls how many pinned projects the home page previews
- `writingCount: number` — default 3; controls how many blogs the home page previews
- `contactHeading: string` — heading in the "Get In Touch" card
- `contactSubtext: string` — subtext in the "Get In Touch" card
- `socialLinks: { label: string; href: string; icon: string }[]` — social link entries shared by contact section and footer
- `footerCopyright: string` — e.g. "© 2026 AJ — Khesir"
- `footerTagline: string` — e.g. `direction B — "Terminal" · tech-first`

The `bannerImageUrl` field is retained; its CMS editor field moves from the "Availability Banner" section into the "Profile" section.

The CMS "Availability Banner" section is replaced by a "Hero" section (heroButtons) and a "Footer & Contact" section (contactHeading, contactSubtext, socialLinks, footerCopyright, footerTagline).

### About Config Schema Changes

Add to `UpdateAboutConfigDto`:
- `bioTagline: string` — single-line lead sentence displayed as the bold `.lead` paragraph
- `bioBody: string` — textarea/markdown block for the body paragraphs below the tagline

`professionalSummary` is retained and continues to power the `.plede` subtitle in the page header.

### CMS Home Config Page Layout (new sections)

1. **Profile** — profileImageUrl, bannerImageUrl, name, role, contactEmail, description
2. **Status** — unchanged
3. **Hero** — heroButtons editor, location, tags, selectedWorkCount, writingCount
4. **Neofetch** — free-form key-value list editor (same rep-row pattern as existing languages editor)
5. **Footer & Contact** — contactHeading, contactSubtext, socialLinks editor, footerCopyright, footerTagline

### About Page Journey Section

- Initial load: `fetchExperiences(5)`
- "Show more" button triggers `fetchExperiences(20)` (or a higher pageSize)
- Each experience row is a clickable element; clicking toggles an inline-expand below the row that renders the `pageMd` field via `MarkDownComponent`
- Only one row expanded at a time (clicking a second row collapses the first)

### Work Page Tiered Display & Pagination

Display order:
1. Pinned projects (from `fetchFeaturedProjects`, ordered by API response)
2. Non-pinned projects (from paginated `fetchProjects`, excluding IDs already shown as pinned)

Pagination:
- `fetchProjects` gains `page` and `pageSize` query params (e.g. `?page=1&pageSize=5`)
- Initial render: first 5 items across the combined tiered list
- "Show more" increments the page and appends results
- Backend contract: the `/projects` list endpoint must exclude the `markdown` field; markdown is only returned by `/projects/:id`

Backend guide comment in `cms.ts` should be updated to document:
- `GET /projects?page=1&pageSize=5` — paginated lightweight list (no markdown)
- `GET /projects/:id` — full object including markdown

### Blog Page Show-More

- Initial render: first 5 blogs from `fetchBlogs()` (all fetched client-side, reveal via slice)
- "Show more" increments the visible count by 5, sorted by latest (`releasedDate` desc)
- No server pagination needed; blog payload without markdown is small

### Footer & Contact Section

`TerminalContactSection` and `TerminalLayout` footer both read from `useHomeConfig()`:
- Contact heading, subtext, email button, and social icons rendered from config
- Footer copyright and tagline rendered from config
- Social links array is rendered as icon anchor tags in both locations

---

## Testing Decisions

Good tests assert on rendered output from the user's perspective — what appears in the DOM — not on internal state or implementation details. Mock at the API boundary (same pattern as existing tests: `vi.mock('@/app/api/...')`), never mock child components or internal hooks.

**Modules to test:**

- `TerminalHomePage` — assert neofetch rows, location tag, plain tags, and hero buttons render from config values; assert `selectedWorkCount` and `writingCount` control the slice limits passed to sub-sections
- `TerminalProjectsSection` (home) — assert count cap respects `selectedWorkCount` from config
- `TerminalWritingSection` (home) — assert count cap respects `writingCount` from config
- `TerminalWorkPage` — assert pinned projects appear before non-pinned; assert "show more" button appears and triggers a second fetch; assert markdown field is not expected in list responses
- `TerminalBlogPage` — assert first 5 are shown; assert "show more" reveals the next batch
- `TerminalAboutPage` — assert `bioTagline` and `bioBody` render from about config; assert journey section shows 5 rows initially; assert "show more" appears; assert clicking a row expands inline content; assert clicking again collapses it
- `TerminalContactSection` — assert heading, subtext, and social links render from home config values (replaces the existing placeholder assertion)
- `TerminalLayout` footer — assert copyright and tagline render from home config

**Prior art:** `src/app/module/home/__tests__/terminalProjectsSection.test.tsx` — component rendered inside `MemoryRouter`, API mocked with `vi.mock`, assertions via `screen.findByText` / `screen.getByRole`.

---

## Out of Scope

- Off-the-clock hobby cards on the about page (remain hardcoded)
- About page `coreCompetencies` and `aboutButtons` fields (no changes requested)
- Services page config
- Posts (social) page
- Individual blog/project read pages
- CMS CRUD pages for blogs, projects, experiences, posts
- Navigation links (remain hardcoded)
- Any backend implementation details beyond the API contract documented above

---

## Further Notes

The `bioTagline` / `bioBody` split on the about config means the CMS about editor will need two new fields inserted between the existing profile image and `professionalSummary` fields to maintain a logical reading order in the form.

The `neofetchRows` default values (Role, Uptime, Editor, Lang, Stack, Locale) should be seeded in both the mock data and the backend config document on first deploy to avoid a blank terminal window before the config is saved.

The work page must de-duplicate: if a pinned project appears in the `?featured=true` list, it must not also appear in the non-pinned section fetched via the paginated list endpoint. The cleanest approach is to filter the paginated list client-side by excluding IDs already rendered as pinned.
