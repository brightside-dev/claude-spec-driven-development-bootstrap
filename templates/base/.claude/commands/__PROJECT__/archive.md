---
description: Fold a finished change's deltas into the canonical specs.
argument-hint: <change-slug>
---

Archive the change **$ARGUMENTS** (run only after it has merged).

1. Confirm every box in `spec/changes/$ARGUMENTS/tasks.md` is ticked. If not,
   stop and report which are open — an unticked box reads as a gap.
2. For each delta in `spec/changes/$ARGUMENTS/specs/<capability>/spec.md`, apply
   it to the canonical spec at `spec/specs/<capability>/spec.md`:
   - ADDED requirements are inserted.
   - CHANGED requirements replace the old text.
   - REMOVED requirements are deleted.
3. Move `spec/changes/$ARGUMENTS/` → `spec/changes/archive/$ARGUMENTS/`.
4. Commit: `spec($ARGUMENTS): archive change and sync specs`.

After this, `spec/specs/` is the current truth again and the change is history.
