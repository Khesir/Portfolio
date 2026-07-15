# qa-approve

Moves one or all issues from `issues/qa/` to `issues/done/`.

Usage:
- /qa-approve 003       → approves a single issue
- /qa-approve all       → approves everything currently in qa/

---

## Single issue: /qa-approve [number]

1. Find the file matching the issue number in `issues/qa/`
   If it does not exist there, stop and tell the user.

2. Append to the issue file's Log section:
   `QA approved by user on [date].`

3. Update the issue file's frontmatter `status: done`

4. Physically move the file from `issues/qa/` to `issues/done/`

5. Update `issues/kanban.md` — move the issue from QA to Done.
   Update _Last updated_ date.

6. Tell the user: issue NNN moved to done/.

Then stop.

---

## All issues: /qa-approve all

1. Scan `issues/qa/` — if empty, stop and tell the user there is nothing to approve.

2. For each file in `issues/qa/`:
   - Append to the Log section: `QA approved by user on [date].`
   - Update the file's frontmatter `status: done`
   - Physically move the file to `issues/done/`

3. Update `issues/kanban.md`:
   - Move all approved issues from QA to Done
   - Update _Last updated_ date

4. Tell the user:
   - How many issues were approved
   - All are now in done/
   - If issues/ backlog, ready, and in-progress are also empty — the feature is fully shipped

Then stop.