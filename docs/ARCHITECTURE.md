# Framework architecture

How this scaffolder is put together, so you can extend it.

## The two halves

1. **The wizard** (`bin/setup.mjs` + `lib/`) — a pretty, interactive CLI that
   asks three questions and writes a project.
2. **The templates** (`templates/`) — the content that becomes the project.

The wizard is small on purpose; almost everything a generated project contains
lives in `templates/` as plain files, so you edit prose, not code.

```
claude-spec-driven-development-framework/
├── bin/setup.mjs        # the CLI wizard (@clack/prompts + picocolors)
├── lib/
│   ├── stacks.mjs       # the stack registry — the menu + per-stack variables
│   └── scaffold.mjs     # the copy+substitute engine
├── templates/
│   ├── base/            # copied for every project (stack-agnostic)
│   └── stacks/<id>/     # overlay copied on top for the chosen stack
└── docs/ARCHITECTURE.md
```

## How generation works

```
                 ┌──────────────┐
   answers  ───► │ buildVars()  │ ──► { PROJECT_NAME, STACK_LABEL, TEST_COMMAND, … }
                 └──────────────┘
                        │
                        ▼
   templates/base/  ──► copyTree ──►  targetDir
   templates/stacks/<id>/ ──► copyTree ──► targetDir   (on top)
```

`copyTree` does two substitutions:

- **In file *contents*:** every `{{KEY}}` where `KEY` is in the allowlist is
  replaced. Unknown `{{...}}` is left untouched, so template code samples survive.
- **In file/dir *names*:** the token `__PROJECT__` becomes the project namespace.
  That is how `commands/__PROJECT__.md` becomes `commands/project1.md` (the
  `/project1` command) and `commands/__PROJECT__/` becomes the sub-command
  namespace.

## The variables

Defined in `buildVars()` (`lib/scaffold.mjs`) from the chosen stack entry:

| Variable | Source |
|---|---|
| `PROJECT_NAME` | slug of the project name — also the command namespace |
| `PROJECT_TITLE` | the name as typed |
| `STACK_ID` / `STACK_LABEL` / `STACK_HINT` | the stack entry |
| `PLATFORM` / `LANGUAGE` | the stack entry |
| `DATABASE` | the stack's datastore (MySQL / SQLite / Supabase) |
| `DEV_SERVICES` | command that starts local dev services (Docker / Supabase CLI) |
| `TEST_COMMAND` / `BUILD_COMMAND` / `RUN_COMMAND` | the stack entry |
| `STACK_AGENTS` | comma-joined agent names for the stack |
| `DATE` | today |

## Why base + overlay (not one template per stack)

The workflow — the loop, the rules, the four default agents, the spec model — is
identical across stacks. Keeping it in `base/` means a change to the workflow is
made **once**, not four times. A stack only contributes what is genuinely
stack-specific: its rules and its engineer/designer agents.

## Extending

- **New stack:** add to `lib/stacks.mjs`, create `templates/stacks/<id>/`.
- **New default agent/skill/command:** add it under `templates/base/.claude/`.
- **New workflow stage:** add a command under
  `templates/base/.claude/commands/__PROJECT__/` and wire it into the entry
  command and `spec-workflow.md`.
- **New template variable:** add it to `buildVars()` and use `{{IT}}` anywhere.
