---
description: Review a change against its spec and quality lenses.
argument-hint: <change-slug>
---

Review the change **$ARGUMENTS**.

1. Cut the diff once, against a fresh remote - never a local `main`, which may
   be stale or not exist:

   ```bash
   git fetch --quiet origin
   base="$(git symbolic-ref --short refs/remotes/origin/HEAD 2>/dev/null || echo origin/main)"
   dir="$(mktemp -d)"; echo "$dir"
   git diff --name-only "$base"...HEAD > "$dir/diff.files"
   git diff "$base"...HEAD > "$dir/diff.patch"
   git rev-parse HEAD
   ```

2. Spawn **one** `spec-reviewer` with the paths to `diff.files` and
   `diff.patch`, the HEAD sha, and the spec delta in
   `spec/changes/$ARGUMENTS/specs/`. It covers every lens, tests included, in
   one reading. Do not spawn one reviewer per lens.
3. For each finding, either fix it (via `spec-engineer`) or record why it
   stands. Re-run `{{TEST_COMMAND}}`.

Do not open a PR until the review is clean or every open finding is a recorded,
justified decision.

Next: ship the PR, then `/{{PROJECT_NAME}}:archive $ARGUMENTS` on merge.
