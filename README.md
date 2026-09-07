# Claude Spec-Driven Development

A language- and stack-agnostic **Spec-Driven Development (SDD)** framework for
[Claude Code](https://claude.com/claude-code). Run one pretty CLI wizard, pick a
stack, and get a ready-to-use workspace: default agents, example skills, a
namespaced command set, and a spec workflow - all tailored to your stack.

```
  ┌────────────────────────────────────────────────┐
  │  CSDD   Claude Spec-Driven Development         │
  │  ─────────────────────────────────────────     │
  │  Project name?     › project1                  │
  │  Which stack?      › Web · NestJS + Nuxt 3     │
  │  Where?            › ./project1                │
  │  ✔ Workspace ready.                            │
  └────────────────────────────────────────────────┘
```

## Quick start

```bash
# from this framework directory
npm install
npm run setup          # or: node bin/setup.mjs
```

Answer three questions (project name, stack, location) and it scaffolds a new
project. Then:

```bash
cd project1
claude                 # open Claude Code
```

Inside Claude Code, everything is under your project's namespace:

```
/project1 <describe what you want to build>     # the one entry point
/project1:propose      capture intent as a spec
/project1:plan         architect the change
/project1:implement    build it, phase by phase
/project1:review       review against the spec
/project1:archive      fold the delta into the specs
```

## What "spec-driven" means here

The spec is the source of truth; code is how the spec comes true. Every change
runs one loop:

```
propose  ->  plan  ->  implement  ->  review  ->  archive
  spec       tasks       code+tests    verdict     specs/ updated
```

- **`spec/specs/`** - canonical, current behaviour (one folder per capability).
- **`spec/changes/`** - proposals in flight, each carrying a *delta*.
- **`spec/changes/archive/`** - shipped changes, kept for history.

At any moment: `specs/` = truth, `changes/` = intent, `archive/` = history.

## The stacks

| Stack | What you get | Data + dev services |
|---|---|---|
| **Web** | NestJS API + Nuxt 3 frontend (TypeScript), shared-types contract | MySQL 8 via Docker Compose |
| **iOS** | Swift + SwiftUI, MVVM, async/await | Supabase (Postgres) via Supabase CLI |
| **Android** | Kotlin + Jetpack Compose, MVVM + unidirectional data flow | Supabase (Postgres) via Supabase CLI |
| **Desktop** | Python + PySide6 (Qt), Qt-free testable core | Embedded SQLite (+ headless test/CI Docker image) |

Each stack adds its own engineer and designer agents on top of the four defaults.

## Databases & Docker

Every stack ships with a local data layer and a one-command way to bring up its
dev services. The wizard prints the exact command; here is what each stack lands
with.

| Stack | Database | Start local services |
|---|---|---|
| **Web** | MySQL 8 (runs in Docker; the app runs on the host) | `docker compose up -d` |
| **iOS / Android** | Supabase / Postgres (full stack in Docker via the CLI) | `supabase start` |
| **Desktop** | SQLite - an embedded file, no server, no container | (none needed) |

- **Web** gets a root `docker-compose.yml` (MySQL 8 on `localhost:3306`, data in a
  named volume) and a `.env.example`. Copy it to `.env`, run `docker compose up
  -d`, then `pnpm dev`. Schema changes go through migrations, never
  `synchronize: true`.
- **iOS / Android** get a `supabase/config.toml`. Install the Supabase CLI once,
  then `supabase start` boots Postgres + Auth + Storage + Studio in Docker;
  `supabase status` prints the local API URL and anon key. Schema changes are
  migrations under `supabase/migrations/`.
- **Desktop** uses embedded SQLite - a file next to the app, no Docker for the DB.
  A `Dockerfile` is included only to run the test suite headlessly in CI
  (`QT_QPA_PLATFORM=offscreen`); the GUI itself runs on the host.

## What gets generated

```
project1/
├── CLAUDE.md                    # project brief for Claude Code
├── .claude/
│   ├── agents/                  # spec-architect, spec-engineer, spec-reviewer,
│   │                            #   spec-qa + your stack's agents
│   ├── commands/
│   │   ├── project1.md          # /project1  (the entry point)
│   │   └── project1/            # /project1:propose, :plan, :implement, ...
│   ├── skills/                  # spec-status, new-capability
│   └── rules/                   # core, spec-workflow, testing, shipping, stack
└── spec/
    ├── project.md               # fill this in first
    ├── specs/                   # canonical capabilities
    ├── changes/                 # active + archive/
    └── templates/               # proposal, tasks, design, spec-delta
```

Plus stack-specific dev files: **Web** adds `docker-compose.yml` + `.env.example`
(MySQL), **iOS/Android** add `supabase/config.toml` (Supabase CLI), and
**Desktop** adds a headless `Dockerfile` for CI.

## Adding a stack

1. Add an entry to [`lib/stacks.mjs`](lib/stacks.mjs).
2. Create `templates/stacks/<id>/` with a `.claude/rules/stack.md`, your stack
   agents under `.claude/agents/`, and a `.gitignore`.

The base template tree is copied first; your stack overlay is copied on top.
Files use `{{VARS}}` (substituted from the stack entry) and the `__PROJECT__`
path token (renamed to the project namespace).

See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for how the pieces fit.
