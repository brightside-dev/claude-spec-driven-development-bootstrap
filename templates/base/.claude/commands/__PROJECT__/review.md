---
description: Review a change against its spec and quality lenses.
argument-hint: <change-slug>
---

Review the change **$ARGUMENTS**.

1. Spawn `spec-reviewer` on the diff (`git diff main...HEAD`) with the spec delta
   in `spec/changes/$ARGUMENTS/specs/`. It reports findings with file:line and a
   concrete failure scenario each.
2. Spawn `spec-qa` to judge test coverage against
   [`testing.md`](../../rules/testing.md).
3. Collect both verdicts. For each finding, either fix it (via `spec-engineer`)
   or record why it stands. Re-run `{{TEST_COMMAND}}`.

Do not open a PR until the review is clean or every open finding is a recorded,
justified decision.

Next: ship the PR, then `/{{PROJECT_NAME}}:archive $ARGUMENTS` on merge.
