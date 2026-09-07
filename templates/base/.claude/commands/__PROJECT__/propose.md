---
description: Capture intent as a spec proposal and delta, without implementing.
argument-hint: <what should change and why>
---

Create a new change proposal for: **$ARGUMENTS**

1. Pick a short kebab-case slug and create `spec/changes/<slug>/`.
2. Copy `spec/templates/proposal.md` → `spec/changes/<slug>/proposal.md` and fill
   it in: why now, what changes, who is affected, what is explicitly out of scope.
3. For each capability touched, copy `spec/templates/spec-delta.md` →
   `spec/changes/<slug>/specs/<capability>/spec.md` and write the requirements as
   ADDED / CHANGED / REMOVED, numbered and testable.
4. Ask any open questions in one round; record the answers, or record assumptions.
5. Do **not** write code. Stop and show the proposal for confirmation.

Next: `/{{PROJECT_NAME}}:plan <slug>`.
