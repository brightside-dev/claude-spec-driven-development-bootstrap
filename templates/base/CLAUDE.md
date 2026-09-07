# {{PROJECT_TITLE}}

A **{{STACK_LABEL}}** project ({{STACK_HINT}}), built with
**{{FRAMEWORK_NAME}}**.

## How work happens here

This project is spec-driven. **Nothing reaches the main branch without a spec
behind it.** The spec is the source of truth; the code is how the spec comes
true. When they disagree, one of them is a bug.

There is **one entry point** for any work: the `/{{PROJECT_NAME}}` command.
Describe what you want in plain language and it classifies the work, plans it,
asks the questions it needs in one round, then runs the spec-driven loop.

| You want to... | Run |
|---|---|
| Anything — build, fix, investigate | `/{{PROJECT_NAME}} <describe it>` |
| Capture intent as a spec | `/{{PROJECT_NAME}}:propose <what should change>` |
| Turn a proposal into a plan | `/{{PROJECT_NAME}}:plan <change-slug>` |
| Build a planned change | `/{{PROJECT_NAME}}:implement <change-slug>` |
| Review a change against its spec | `/{{PROJECT_NAME}}:review <change-slug>` |
| Fold a finished change into the specs | `/{{PROJECT_NAME}}:archive <change-slug>` |

## The loop

```
propose  ->  plan  ->  implement  ->  review  ->  archive
  spec       tasks       code+tests    verdict     specs/ updated
```

Full contract in [`.claude/rules/spec-workflow.md`](.claude/rules/spec-workflow.md).

## The team (agents)

Default agents handle the workflow; stack agents handle the code.

- `spec-architect` — turns a proposal into a layered, testable plan.
- `spec-engineer` — implements one planned phase: code, tests, commit.
- `spec-reviewer` — reviews a diff against the spec and quality lenses.
- `spec-qa` — judges whether the change is tested to the bar; writes failing
  tests first in debug mode.

Stack agents for **{{STACK_LABEL}}**: {{STACK_AGENTS}}.

## Stack

- **Platform:** {{PLATFORM}}
- **Language:** {{LANGUAGE}}
- **Database:** {{DATABASE}}
- **Dev services:** `{{DEV_SERVICES}}`
- **Test:** `{{TEST_COMMAND}}`
- **Build:** `{{BUILD_COMMAND}}`
- **Run:** `{{RUN_COMMAND}}`

Stack-specific conventions live in
[`.claude/rules/stack.md`](.claude/rules/stack.md).

## Standing rules (always loaded)

- [`core.md`](.claude/rules/core.md) — the non-negotiables.
- [`spec-workflow.md`](.claude/rules/spec-workflow.md) — how the loop runs.
- [`testing.md`](.claude/rules/testing.md) — the coverage bar.
- [`shipping.md`](.claude/rules/shipping.md) — commits, branches, PRs.
- [`stack.md`](.claude/rules/stack.md) — {{STACK_LABEL}} specifics.

## Where the specs live

```
spec/
  project.md          # what this product is, for
  specs/              # canonical, current truth — one folder per capability
  changes/            # active proposals, not yet shipped
  changes/archive/    # shipped changes, kept for history
  templates/          # proposal / tasks / design / spec-delta skeletons
```
