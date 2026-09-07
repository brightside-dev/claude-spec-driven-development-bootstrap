---
description: Turn a proposal into a layered, testable implementation plan.
argument-hint: <change-slug>
---

Plan the change **$ARGUMENTS**.

Spawn the `spec-architect` agent with the proposal and spec delta in
`spec/changes/$ARGUMENTS/`. It must produce:

- `spec/changes/$ARGUMENTS/tasks.md` — ordered, dependency-layered checklist.
  Every requirement maps to at least one task and one test. Tasks are small
  enough to commit individually.
- `spec/changes/$ARGUMENTS/design.md` — only if there are real trade-offs.

Confirm every numbered requirement in the delta is covered by a task before you
finish. Do not write application code.

Next: `/{{PROJECT_NAME}}:implement $ARGUMENTS`.
