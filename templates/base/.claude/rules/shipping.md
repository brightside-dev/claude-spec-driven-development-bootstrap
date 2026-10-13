# shipping rules — always on

## Commits

- Conventional subjects: `type(scope): summary`, imperative, lower-case, no
  trailing period. Types: `feat`, `fix`, `refactor`, `test`, `docs`, `chore`,
  `spec`, `perf`.
- **Commit after every completed task**, before starting the next. Don't bundle.
- Tick the matching box in `tasks.md` in the same commit as the work.

## Branches

- Never work on `main`. Branch first.
- One branch per unit of delivery.
- Push before you have two unpushed commits — an unpushed commit is work a lost
  session cannot recover.

## Pull requests

- Open the PR **last**: run the local test gate, review the diff, fix, then push
  and open. A PR opened first burns a CI run on every push.
- One PR per change: the spec delta, the implementation, and the archive move
  travel together.
- The PR body says, in plain language: what someone can now do differently,
  which requirements it satisfies, and any recorded assumptions.

## Waiting on CI

Poll CI in the background (`run_in_background`) about every 4 minutes, not in a
tight loop. Each poll is a turn that re-reads the whole context, and a gap over
5 minutes lets the prompt cache expire, so the next turn re-writes it at many
times the read price. Under 5 minutes and spaced out is the cheap band.

## Never

- Cut a release or deploy to production. That is a human decision; an agent
  stops at a merged PR.

- Force-push without explicit approval.
- Skip or suppress a failing check.
- Disable a lint rule to fix a lint failure — fix the code.
- Leave uncommitted work at the end of a session.
