---
description: Build a planned change, phase by phase, with tests and commits.
argument-hint: <change-slug>
---

Implement the change **$ARGUMENTS** from `spec/changes/$ARGUMENTS/tasks.md`.

Work **layer by layer**, in dependency order:

1. For each layer, spawn one `spec-engineer` per phase (parallel only when the
   phases share no files). Each engineer: write the test, make it pass, tick the
   task, commit - per task, not per phase.
2. Brief each engineer with its phase and the commit range the previous phase
   landed (`<first-sha>^..<last-sha>`), not a prose summary of it. The engineer
   reads the work with `git diff`.
3. If an engineer returns `split:`, spawn a fresh engineer for the remaining
   tasks. Never re-spawn the same over-sized phase.
4. Delegate {{STACK_LABEL}} detail to the stack agents ({{STACK_AGENTS}}).
5. After each layer lands, reconcile shared types / contracts before the next.
6. Run `{{TEST_COMMAND}}` and keep it green.

Never start a later layer before its earlier layer is committed. Push before two
commits pile up.

Next: `/{{PROJECT_NAME}}:review $ARGUMENTS`.
