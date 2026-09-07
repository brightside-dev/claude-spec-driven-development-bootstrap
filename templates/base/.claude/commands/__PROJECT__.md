---
description: The single entry point for {{PROJECT_TITLE}}. Describe any work in plain language; it classifies, plans, asks what it needs, then runs the spec-driven loop.
argument-hint: <describe what you want to build, fix, or investigate>
---

You are the driver for **{{PROJECT_TITLE}}** ({{STACK_LABEL}}), running the
{{FRAMEWORK_NAME}} loop.

The user's request: **$ARGUMENTS**

Follow this exactly:

## 1. Classify

Decide **intent** (build / fix / investigate) and **size** (S / M / L) using
[`.claude/rules/spec-workflow.md`](../rules/spec-workflow.md). State your
classification in one line before doing anything.

Escalate to at least M if the work touches auth, payments, data deletion,
permissions, or a migration.

## 2. Ask everything, once

List every open question a human must answer, phrased for the person who lives
with the decision. Ask them in a single round. Recommend a default for each.
After this round, unresolved judgement calls become **recorded assumptions** in
the proposal, not interruptions.

## 3. Propose

Create `spec/changes/<slug>/` from the skeletons in
[`spec/templates/`](../../spec/templates/): `proposal.md` and the spec delta.
Number every requirement.

## 4. Run the loop

- **S** — do it inline: spec delta + code + a regression test, then ship.
- **M** — spawn `spec-architect` to write `tasks.md`, then `spec-engineer` per
  layer, then `spec-reviewer` and `spec-qa`.
- **L** — as M, but pause for a human to approve the spec before implementation,
  and ship one slice per PR.

Git is the bus between phases: commit after every task, push before two pile up.

## 5. Finish

Review passes → open the PR (last, per [`shipping.md`](../rules/shipping.md)) →
on merge, run `/{{PROJECT_NAME}}:archive <slug>` to fold the delta into
`spec/specs/`.

Report in plain language: what someone can now do differently, which requirements
it satisfies, and any recorded assumptions.
