# spec-workflow rules — always on

The spec-driven loop, and what each stage owes the next.

## The loop

```
propose  ->  plan  ->  implement  ->  review  ->  archive
```

Each stage has one owner and one artifact. A stage cannot start until the
previous one's artifact exists.

| Stage | Owner | Produces | Lives in |
|---|---|---|---|
| propose | driver | proposal + spec delta | `spec/changes/<slug>/` |
| plan | `spec-architect` | `tasks.md` (+ `design.md` if non-trivial) | `spec/changes/<slug>/` |
| implement | `spec-engineer` (+ stack agents) | code + tests, tasks ticked | your source tree |
| review | `spec-reviewer` (one, all lenses) | a verdict with file:line findings | PR comment |
| archive | driver | spec deltas folded into canonical specs | `spec/specs/` |

## A change folder

```
spec/changes/<slug>/
  proposal.md      # why, what changes, who is affected
  tasks.md         # the checklist; ticked as work lands
  design.md        # optional — only when there are real trade-offs
  specs/
    <capability>/spec.md   # the delta: requirements ADDED / CHANGED / REMOVED
```

Skeletons for each are in [`spec/templates/`](../../spec/templates/).

## Sizing (S / M / L)

Size scales the ceremony, never the constraints.

- **S** — one obvious change. Driver does it inline. Still needs a spec delta and
  a regression test.
- **M** — spawn `spec-architect` to plan, `spec-engineer` to build,
  one `spec-reviewer` to review (`spec-qa` for bugs). Spec delta bundled in
  the same PR.
- **L** — as M, plus a human review gate on the spec before implementation, and
  one PR per slice.

Anything high-stakes (auth, payments, data deletion, permissions, migrations) is
treated as at least M regardless of apparent size.

## Requirement shape

Write requirements as behaviour, testable, and numbered per capability:

```
### R-3.2  A signed-out visitor cannot open a draft
- WHEN an unauthenticated request hits a draft URL
- THEN the response is 404, not 403 (existence is not leaked)
```

Every numbered requirement earns a test referenced by its ID.

Pick the next free number by scanning `spec/` on a freshly fetched
`origin/<default branch>`, not your local checkout - a scan goes stale the moment
another branch merges. Re-scan before you push. If two changes still collide,
the one with fewer ticked tasks renumbers.

## The only valid reasons to stop

1. A question that only a human can answer, asked in the one up-front round.
2. A failing test or red check that is a real defect (fix it, don't retry).
3. A blocker caused outside this branch (a commit already on the default
   branch, someone else's change). Do not work around it: stop, name the
   commit that introduced it, and ask before touching it.
4. The work is done.

A dropped network or a flaky service is retried, not handed back. A usage limit
is not a failure either: commit, push, note where you stopped in the change
folder, and pause. The run resumes from the last commit.
