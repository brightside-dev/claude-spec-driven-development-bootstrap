# Tasks: <change title>

Ordered by dependency layer. Tick each box in the same commit as the work.
Every task names its files and the test that proves it.

## Layer 1 — <foundation>

- [ ] T1.1 <task> — files: `<...>` — test: `<...>` — satisfies R-<n>
- [ ] T1.2 <task> — files: `<...>` — test: `<...>` — satisfies R-<n>

## Layer 2 — <depends on layer 1>

- [ ] T2.1 <task> — files: `<...>` — test: `<...>` — satisfies R-<n>

## Definition of done

- [ ] Every numbered requirement has passing tests.
- [ ] `{{TEST_COMMAND}}` is green.
- [ ] Spec delta matches what shipped.
