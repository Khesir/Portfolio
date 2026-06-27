---
id: issue-004
title: "CMS dashboard"
feature: terminal-cms
status: qa
created_at: 2026-06-27
tags: [afk, p2]
---

# [004] CMS dashboard

**Type:** AFK
**Priority:** P2
**Blocked by:** 003
**User stories covered:** 25

---

## What to build

Reskin `CmsDashboard` to match `terminal-cms.html`. All existing data fetching (`fetchAnalytics`, `fetchBlogEngagementSummary`) and wiring is preserved — only markup and class names change.

**Traffic section (`.cms-sec`)**
Two stat cards (`.cms-stat`): total visits and today's visits, each with a colored icon box (`.ic.blue`, `.ic.green`). One chart card (`.cms-stat.chart`) rendering the 7-day bar chart as `.cms-chart` with `.col` / `<b>` bar elements — height set as an inline style percentage of the max value.

**Content counts section (`.cms-sec`)**
Four count cards (`.cms-count`) linking to their respective CMS list pages: Blogs, Projects, Experiences, Posts. Each shows the count and a "Manage →" label.

**Latest blogs table (`.cms-sec`)**
Header row with "Latest blogs" label and "View all →" link. Rows (`.cms-row`) show title, date, live/draft status badge (`.st.live` / `.st.draft`), view count, and heart count — sourced from `fetchBlogEngagementSummary`.

**Top bar (`.cms-top`)**
Page title "Dashboard", terminal subtitle `aj@khesir:~$ ./cms --status · all systems nominal`, and a production sync indicator on the right.

---

## Acceptance criteria

- [ ] Dashboard renders traffic stats (total visits, today's visits, 7-day chart) from `fetchAnalytics` response.
- [ ] Chart bars render with heights proportional to their visit counts.
- [ ] Content count cards show correct counts and link to their respective CMS list pages.
- [ ] Latest blogs table renders rows from `fetchBlogEngagementSummary` with correct title, date, status badge, views, and hearts.
- [ ] Live posts show `.st.live` badge; drafts show `.st.draft` badge.
- [ ] "View all →" link navigates to `/cms/blogs`.
- [ ] No Tailwind classes remain in `CmsDashboard`.
- [ ] Page renders in dev mode with mock data.

---

## Tests required

No — the dashboard is a pure data-display page with no user interactions beyond navigation links, which are covered by the routing.

---

## Notes

- Bar chart height calculation: `(visits / maxVisits) * 100`% where `maxVisits` is the max in the 7-day dataset.
- The "production · synced Xm ago" indicator is display-only; no real sync timestamp is needed — use a static label or omit if the API doesn't return it.

---

## Log

- 2026-06-27: Implemented. Rewrote CmsDashboard markup to use terminal-cms CSS classes. Removed all Tailwind and shadcn/lucide imports. Replaced lucide icons with inline SVGs. Preserved all data fetching and state exactly. Chart bar heights calculated as `(visits / maxVisits) * 100`%. All blog rows default to `.st.live` badge since BlogEngagementSummary has no draft field. Moved to qa.
