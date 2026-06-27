---
id: issue-003
title: "Tech stack section"
feature: terminal-home
status: done
created_at: 2026-06-26
tags: [afk, p2]
---

# 003 Tech stack section

**Type:** AFK
**Priority:** P2
**Blocked by:** 001
**User stories covered:** 8, 9

---

## What to build

Implement the `tech_stack` section below the hero. The section renders a panel with one row per skill category from `useAboutConfig().config.technicalSkills`.

Each entry in `technicalSkills` is `{ category: string, items: string[] }`. Render each as a `stack-row`: the `category` string as the left-column label, and `items` as a flex-wrapped set of chips on the right.

Include the section label row (`01 / tech_stack / ── / // what I build with`) above the panel.

---

## Acceptance criteria

- [ ] Section renders a row for each `SkillCategoryDto` entry from `useAboutConfig`.
- [ ] Each row shows the `category` as the left label and `items` as individual chips.
- [ ] Renders correctly when `technicalSkills` is empty (section still shows, rows are absent).
- [ ] Section label row ("01", "tech_stack", rule, comment) renders above the panel.

---

## Tests required

Yes — render with mocked `useAboutConfig` returning two skill categories, assert both category labels and their items appear in the output.

---

## Notes

- `useAboutConfig` is already defined in `src/hooks/use-home-config.ts` — no new hook needed.
- The section is purely presentational; no navigation or click interactions.

---

## Log

Created TerminalStackSection component rendering section label and skill category rows from useAboutConfig().technicalSkills. Tests verify category labels, chip items, and empty state.

QA approved by user on 2026-06-27.
