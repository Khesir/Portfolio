---
name: implement-issues
description: >
  Reads issues/ready/ and implements all open issues using a TDD multi-agent
  loop. Issues physically move between folders as they progress. Runs until
  every issue is in qa/ or done/. Does not stop to ask the user unless truly
  blocked.
---

# Implement Issues

Reads `issues/ready/` and implements all open issues using a TDD multi-agent loop.
Issues physically move between folders as they progress.
Runs until every issue is in `qa/` or `done/`. Does not stop to ask the user unless truly blocked.

---

## Before starting

Ensure the following folders exist, create any that are missing:

```
issues/
  backlog/
  ready/
  in-progress/
  qa/
  done/
```

Read `issues/kanban.md` in full.
Scan all folders: `backlog/`, `ready/`, `in-progress/`, `qa/`, `done/`.
Build a full picture of the dependency graph before touching any code.

If `issues/ready/` is empty and `issues/backlog/` is also empty, stop and tell the user there is nothing to implement.

---

## Folder rules

| Folder | Meaning |
|--------|---------|
| `backlog/` | Has unresolved blockers. Do not touch. |
| `ready/` | No blockers. Pick these up. |
| `in-progress/` | Currently being worked on by a sub-agent. |
| `qa/` | Implementation done. Tests pass. Waiting for human. |
| `done/` | Human approved. Fully complete. |

---

## The loop

Repeat until `ready/`, `backlog/`, and `in-progress/` are all empty:

1. Scan `issues/ready/` — collect all issue files
2. Sort by priority: P1 first, then P2, then P3
3. Move each file from `ready/` to `in-progress/` — physically move the file, and update its frontmatter `status: inprogress` to match
4. Update `issues/kanban.md` to reflect the move
5. Dispatch a sub-agent per issue in `in-progress/` (parallel where possible)
6. Each sub-agent follows the TDD cycle below
7. When an issue passes all tests, move the file from `in-progress/` to `qa/`, and update its frontmatter `status: qa`
8. Update `issues/kanban.md` to reflect the move
9. Scan `issues/backlog/` — check if any blockers are now in `qa/` or `done/`
10. Move newly unblocked issues from `backlog/` to `ready/`, and update each one's frontmatter `status: ready`
11. Update `issues/kanban.md` to reflect any moves
12. Repeat

---

## TDD cycle (each sub-agent follows this)

Each sub-agent delegates to the `/tdd` skill for the full red-green-refactor
cycle. Before starting, read the issue file and extract:

- **Acceptance criteria** → these become the behaviors to test in `/tdd`'s planning phase. Before passing them to `/tdd`, scan for visual criteria — anything about appearance, layout, animations, or rendering. Mark those as "Visual — requires human QA" and exclude them from the test plan entirely. Do not attempt to automate them, launch the app, or take screenshots to verify them.
- **Tests required** field → if `Yes`, the behaviors and prior art described there feed directly into `/tdd`'s planning phase
- **What to build** → this is the interface and scope to confirm in `/tdd`'s planning phase
- **Notes** → constraints and patterns to follow during implementation

Then follow `/tdd` in full:

1. **Planning** — confirm interface changes, confirm which behaviors to test (from acceptance criteria), identify deep module opportunities, get the issue's scope confirmed before writing anything
2. **Tracer bullet** — one test → one implementation, proves the path end-to-end
3. **Incremental loop** — one behavior at a time, red → green, until all acceptance criteria are covered
4. **Refactor** — after all tests pass, clean up duplication, deepen modules, run tests after each step

When the full `/tdd` cycle is complete:

- Append a short log entry to the issue file (2-3 lines: what was implemented, what was tested)
- Physically move the file from `in-progress/` to `qa/`
- Update `issues/kanban.md` to reflect the move and update _Last updated_ date

---

## Handling rejected issues (issues returning from QA)

When picking up an issue from `ready/` that contains a `## Bug` section, it
means this issue was previously rejected during visual QA.

In this case:

1. Read the `## Bug` section carefully before anything else
2. In `/tdd`'s planning phase, treat the bug as the primary behavior to fix — confirm the failing test that reproduces the bug before writing any fix
3. Follow `/tdd`: write a failing test that reproduces the bug first, then fix the implementation until it passes
4. Re-verify all original acceptance criteria still pass
5. Append to the Log: `Bug fixed on [date]. [Short description of what was changed].`
6. Move to `qa/` as normal

Do not remove the `## Bug` section from the file — leave it as history.

---

## Scope discipline

Each sub-agent touches only files relevant to its issue.
If an agent notices something unrelated that needs fixing, it appends a `## Flagged` section to the issue file.
It does not fix it. It does not go out of scope.

---

## No assumptions

Before claiming a file exists, read it.
Before claiming a function works, verify it.
If something is missing that the issue depends on, append a `## Flagged` section to the issue file, move it back to `backlog/`, and update the kanban. Do not guess or invent.

---

## When the loop ends

When `ready/`, `backlog/`, and `in-progress/` are all empty, print a final summary:
- What was built
- Which files were touched
- All issues now in `qa/` waiting for your review
- Anything flagged during implementation

Then stop. QA is your job.