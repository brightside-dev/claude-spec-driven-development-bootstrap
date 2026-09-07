# Specs for {{PROJECT_TITLE}}

The source of truth for what this product does. Code makes these true.

```
spec/
  project.md          # what this product is, and for whom
  specs/              # canonical, current behaviour - one folder per capability
  changes/            # proposals in flight
  changes/archive/    # shipped changes, kept for history
  templates/          # skeletons: proposal, tasks, design, spec-delta
```

## The rule

`spec/specs/` always describes the product **as it is on main**. A change lives
in `spec/changes/<slug>/` while in flight and carries a *delta* (what it ADDs,
CHANGEs, REMOVEs). On merge, `/{{PROJECT_NAME}}:archive` folds the delta into
`spec/specs/` and moves the change into `archive/`.

So at any moment: `specs/` = truth, `changes/` = intent, `archive/` = history.
