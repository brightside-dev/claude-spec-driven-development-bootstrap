---
description: Build a planned change, phase by phase, with tests and commits.
argument-hint: <change-slug>
---

Implement the change **$ARGUMENTS** from `spec/changes/$ARGUMENTS/tasks.md`.

Work **layer by layer**, in dependency order:

1. For each layer, spawn one `spec-engineer` per phase (parallel only when the
   phases share no files). Each engineer: write the test, make it pass, tick the
   task, commit — per task, not per phase.
2. Delegate {{STACK_LABEL}} detail to the stack agents ({{STACK_AGENTS}}).
3. After each layer lands, reconcile shared types / contracts before the next.
4. Run `{{TEST_COMMAND}}` and keep it green.

Never start a later layer before its earlier layer is committed. Push before two
commits pile up.

Next: `/{{PROJECT_NAME}}:review $ARGUMENTS`.
