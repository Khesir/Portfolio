# PRD: Terminal Design — Reading Views & CMS Reskin

**Status:** Draft
**Date:** 2026-06-27

---

## Problem Statement

The portfolio site has a "Terminal" design direction already partially applied to the home, about, blog list, and work list pages. However, the reading views (individual blog post page and individual project page) still use the old Tailwind/shadcn UI, creating a jarring visual break the moment a visitor clicks into any piece of content. The CMS also retains the old Tailwind/shadcn shell, making it visually inconsistent with the public terminal aesthetic and the design spec.

---

## Solution

Complete the Terminal design rollout by:

1. Replacing the shared `ReadPage` with two purpose-built terminal-styled reading views — one for blog posts, one for projects — each with the correct aside (ToC + heart for blogs; repo/demo links + heart for projects), functional prev/next navigation, and markdown rendered inside the terminal article shell.
2. Reskinning the entire CMS (layout, all list pages, all config pages, and all editor pages) to match the `terminal-cms.css` design spec, while keeping all existing data wiring, auth, and editor functionality intact.

---

## User Stories

1. As a visitor, I want the blog post reading view to look and feel like the rest of the terminal-themed site, so that the experience is visually consistent from list to article.
2. As a visitor, I want a "back to /blog" link at the top of a blog post, so that I can return to the list without using the browser back button.
3. As a visitor, I want to see the post title rendered in Instrument Serif at large scale, so that it matches the terminal editorial aesthetic.
4. As a visitor, I want to see the publish date, estimated read time, view count, and heart count in the article header, so that I have context before reading.
5. As a visitor, I want to see the post's tags as styled pills in the article header, so that I can understand the topic at a glance.
6. As a visitor, I want a 21:9 hero image rendered below the article header when one is available, so that the post has a strong visual opening.
7. As a visitor, I want the article body to render markdown with terminal-styled prose (serif body, mono headings with numbered prefix, custom blockquote, styled lists), so that the content feels native to the design.
8. As a visitor, I want inline code to render with an amber-tinted monospace style, so that it stands out from body text.
9. As a visitor, I want code blocks to render inside a terminal window shell (dark background, traffic-light dots, language label), so that code feels at home in the terminal theme.
10. As a visitor, I want syntax inside code blocks to be highlighted with colors that match the terminal palette, so that the code is readable and visually consistent.
11. As a visitor, I want a sticky aside panel on desktop that shows a heart button and a "on this page" table of contents, so that I can like the post and jump to sections without scrolling back to the top.
12. As a visitor, I want the table of contents to list all `##` and `###` headings from the article as anchor links, so that I can navigate long posts quickly.
13. As a visitor, I want clicking a ToC link to scroll the article to the correct heading, so that navigation is instant.
14. As a visitor, I want the aside to hide on mobile, so that the layout is clean on small screens.
15. As a visitor, I want prev/next navigation cards at the bottom of a blog post, showing the adjacent post's title, so that I can continue reading without going back to the list.
16. As a visitor, I want a "stay in the loop" contact CTA at the bottom of every blog post, so that there is a clear next action after finishing an article.
17. As a visitor, I want the project reading view to share the same article shell and prose styles as the blog reading view, so that the two content types feel unified.
18. As a visitor, I want a "back to /work" link at the top of a project page, so that I can return to the work list.
19. As a visitor, I want the project aside on desktop to show a meta card with "source" and "live demo" links (when available), so that I can access the project's repository and deployment directly from the reading view.
20. As a visitor, I want the heart button in the project aside to let me like the project, so that I can express appreciation without leaving the page.
21. As a visitor, I want prev/next navigation at the bottom of a project page, sorted by the same order as the work list (pinned first), so that browsing projects is sequential.
22. As a visitor, I want a "let's build" contact CTA at the bottom of every project page, consistent with the work list page.
23. As a site owner, I want the CMS to have the same terminal visual identity as the public site, so that the admin experience feels cohesive.
24. As a site owner, I want the CMS sidebar to use the terminal nav structure (brand, grouped nav sections, dev-mode toggle, back-to-site link, logout), so that it matches the `terminal-cms.html` design.
25. As a site owner, I want the CMS dashboard to show site traffic stats (total visits, today, 7-day bar chart) and content counts linking to each section, consistent with `terminal-cms.html`.
26. As a site owner, I want the blogs list page to have search and All/Published/Drafts filter tabs, with Edit and Delete actions per row, consistent with `terminal-cms-blogs.html`.
27. As a site owner, I want the projects list page to have a Feature/Unfeature toggle per project in addition to Edit and Delete, consistent with `terminal-cms-projects.html`.
28. As a site owner, I want the experiences list page to show position, company, period, and a "current" badge where applicable, with Edit and Delete, consistent with `terminal-cms-experiences.html`.
29. As a site owner, I want the posts (short-form) list page to render cards with pin, edit, and delete actions, with draft and pinned badge support, consistent with `terminal-cms-posts.html`.
30. As a site owner, I want the Home config page to render as a terminal-style form with sections for availability banner, status pill, profile, and tech stack repeater, consistent with `terminal-cms-home.html`.
31. As a site owner, I want the About config page to render as a terminal-style form with sections for professional summary (markdown), skill categories (chips), and core competencies, consistent with `terminal-cms-about.html`.
32. As a site owner, I want the Services config page to render as a terminal-style form with a draggable service list (icon, title, tag, description, stack chips), consistent with `terminal-cms-services.html`.
33. As a site owner, I want the blog editor, project editor, experience editor, and post editor to use the terminal form styling (`.cms-form`, `.fsection`, `.field`) derived from the config page pattern, so that every CMS page feels consistent.
34. As a site owner, I want all existing editor wiring (create, update, image upload, draft toggle, tag input, markdown editor) to continue working after the reskin, so that no functionality is lost.

---

## Implementation Decisions

### CSS Strategy
- Bring `terminal-article.css` and `terminal-cms.css` directly from the design project into `src/css/` as-is — no Tailwind translation.
- `terminal-article.css` is imported only by the two reading view components.
- `terminal-cms.css` is imported only by the CMS layout component.
- Existing `terminal-theme.css` and `terminal-mock.css` are already in place and used by `TerminalLayout`.

### Reading Views — Split and Purpose-Built
- The shared `ReadPage` is replaced by two separate components: `BlogReadPage` and `ProjectReadPage`.
- Both are moved out of the `BaseLayout` route group and registered at the top level (same as `TerminalBlogPage`, `TerminalWorkPage`), so they render inside `TerminalLayout` directly.
- Routes remain `blogs/view/:title?id=<id>` and `projects/view/:title?id=<id>` — URL structure unchanged.

### Markdown Rendering
- `react-markdown` with `rehype-raw`, `rehype-sanitize`, and `remark-gfm` is kept as-is.
- `react-syntax-highlighter` is kept; its `code` renderer wraps output in the `.codeblock` terminal window shell (dark bar with traffic-light dots, language label, `#0e0d13` background) to match the design.
- The syntax theme is set to approximate the terminal palette (`var(--blue)` keywords, `var(--amber)` functions, `var(--plum)` types, muted comments).
- The `MarkDownComponent` is updated with new custom renderers for all prose elements matching `.article` class rules from `terminal-article.css` (blockquote, lists with `›` bullets, numbered `ol`, inline `code` in amber, `img` with border/radius).

### Table of Contents
- Heading IDs are injected into the `h2` and `h3` renderers inside `MarkDownComponent` by slugifying the heading text.
- The ToC is built by parsing `##` and `###` lines from the raw markdown string before render, producing `{ level, text, id }` entries.
- Rendered in the aside as anchor links (`href="#<id>"`), indented by level.
- The aside is hidden on screens narrower than 960px (handled by `terminal-article.css` media query).

### Prev / Next Navigation
- Both reading views fetch the full list (`fetchBlogs()` or `fetchProjects()`) on mount, relying on `ApiCache` to avoid redundant network calls.
- The current item is located by matching `id` from the URL search param.
- For projects, the list is sorted pinned-first (matching work page order) before finding adjacent items.
- If no previous or next exists, that card renders as a disabled/empty state.

### Engagement
- Views and hearts in the article header use the existing `EngagementBar` component, styled to slot into `.ameta` row.
- The aside heart button uses the existing `toggleHeart` / `fetchEngagement` hooks — same logic as `StickyHeart` but rendered in the `.htbtn` style from `terminal-article.css`.
- The floating `StickyHeart` is removed from the reading views; desktop shows the aside button, mobile shows nothing (aside is hidden by CSS — acceptable per the design spec).

### Featured Content
- Blog list page: featured card = first item in `fetchBlogs()` response (most recently released). Already implemented in `TerminalBlogPage`.
- Work page: featured card = first pinned project from `fetchFeaturedProjects()`. Already implemented in `TerminalWorkPage`. All-projects list is sorted pinned-first.

### CMS Reskin
- `CmsLayout` is rewritten to use the `.cms-shell` / `.cms-aside` / `.cms-main` structure from `terminal-cms.html`, importing `terminal-cms.css`.
- All shadcn `NavLink` / `Button` / `Tooltip` usage in the layout shell is replaced with native elements styled by `terminal-cms.css` classes.
- Each CMS page (dashboard, list pages, config pages, editors) has its container and typography classes updated to match the terminal CMS design (`.cms-top`, `.cms-h1`, `.cms-table`, `.lrow`, `.cms-form`, `.fsection`, `.field`, etc.).
- All existing state, API calls, form handlers, image upload, markdown editor, tag input, draft toggle, and engagement toggles remain wired exactly as before — only class names and markup structure change.
- Editors (blog editor, project editor, experience editor, post editor) adopt the `.cms-form` / `.fsection` pattern from the config pages for structural consistency.
- `CmsLoginGate` is out of scope for reskin (not in the design spec).

### Data Contracts — No Changes
- All API hooks (`fetchBlogs`, `fetchBlogsByID`, `fetchProjects`, `fetchProjectsByID`, `fetchEngagement`, `trackView`, `toggleHeart`, CMS CRUD functions) are unchanged.
- `CreateBlogDto`, `CreateProjectDto`, `CreateExperienceDto`, `PostDto`, all config DTOs — unchanged.

---

## Testing Decisions

### What Makes a Good Test
- Test observable behavior from the component boundary — what renders given certain data, what is called when a user interacts — not internal implementation details like state variables or helper functions.
- Prefer integration-level component tests over unit tests of pure functions.

### Modules to Test

**BlogReadPage**
- Renders article header (title, date, read time, tags) from API response data.
- Renders hero image when `imageUrl` is present; renders nothing when absent.
- Renders prev/next cards with correct titles from the adjacent items in the list.
- Disables prev card when current item is the first; disables next card when last.
- ToC renders correct heading links matching `##` / `###` headings in the markdown.
- Heart button calls `toggleHeart` on click.

**ProjectReadPage**
- Renders project title, year, tags, views, hearts.
- Renders "source" link using `url` field and "live demo" link using `deployment` field; hides each when the field is absent.
- Prev/next order matches pinned-first sort.

**CmsLayout**
- Active nav item receives `.on` class matching the current route.
- Dev mode toggle calls `toggleMode`.
- Logout button calls `logout`.

### Prior Art
- Existing component tests in the project (if present) for `TerminalBlogPage` or `BlogList` serve as the structural reference for how reading view tests should be written.
- API calls in tests should be mocked at the module boundary (`fetchBlogs`, `fetchBlogsByID`, etc.).

---

## Out of Scope

- `CmsLoginGate` visual reskin — not covered by the design files.
- Mobile heart button fallback below article body — design hides the aside on mobile with no replacement; accepted as-is.
- Tags/category filter on the public blog list page — not in the current design.
- Actual ToC scroll-spy (highlighting the active section as the user scrolls) — ToC links work but active state tracking is not in scope.
- Any backend changes — the API contracts and data models are frozen for this work.
- Drag-to-reorder on service cards in `CmsServiceConfig` — the design shows draggable handles but the existing implementation is kept; only visual reskin applies.

---

## Further Notes

- `terminal-article.css` defines the `.alayout` grid as `1fr minmax(0, 720px) 1fr` — the aside occupies the third column. This means the article body is constrained to 720px max-width, centred. Both reading views must adopt this layout exactly.
- The `.codeblock` terminal window must wrap whatever `react-syntax-highlighter` produces. The wrapper div is rendered in the `code` custom component, and the traffic-light colors are hardcoded (`#ff5f57`, `#febc2e`, `#28c840`) as in the design.
- The `terminal-cms.css` file does not include editor-specific form patterns beyond what the config pages establish. The editor pages should reuse `.cms-form`, `.fsection`, `.field`, `.frow`, `.rep`, `.rep-row`, and `.save-bar` — all defined in `terminal-cms.css` via the config page markup.
- `TerminalAboutPage` is already implemented and is not touched by this work.
- Existing dev-mode mock data paths in all API hooks remain unchanged and must continue to work during development.
