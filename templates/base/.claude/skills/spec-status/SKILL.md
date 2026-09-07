---
name: spec-status
description: Summarise spec-driven progress for {{PROJECT_TITLE}} — count active vs archived changes, sum task checkboxes, and print a status table. Read-only. Use when someone asks "where are we" or "what's in flight".
---

# Spec status

Produce a short, plain-language status of the spec corpus.

## Steps

1. List active changes: every folder under `spec/changes/` except `archive/`.
2. List archived changes under `spec/changes/archive/`.
3. For each active change, read its `tasks.md` and count `- [x]` vs `- [ ]`.
4. Count capabilities under `spec/specs/`.

## Output

A single table, then one sentence of takeaway:

```
Capabilities:   <n>
Active changes: <n>   (<ticked>/<total> tasks done)
Archived:       <n>

Change              Tasks     Stage
------              -----     -----
<slug>              7/12      implement
<slug>              0/4       plan
```

End with one line: what is closest to shipping, and what is blocked. Do not
modify any file — this is a read-only report.
