# core rules — always on

These hold for every change, at every size. Scope never relaxes them.

1. **Spec first.** Every behavioural change traces to a proposal in
   `spec/changes/` or an archived change synced into `spec/specs/`. No spec, no
   merge. Docs-only, config-only, and test-only changes are exempt.

2. **One change = one concern = one branch.** Small and focused beats big and
   mixed. Branch names: `feature/<slug>`, `fix/<slug>`, `chore/<slug>`.

3. **The spec is the contract.** When code and spec disagree, stop and decide
   which is wrong — do not silently follow the code.

4. **Ask in one round, up front.** Every open question is asked before a branch
   is cut, phrased for the person who lives with the decision, not the engineer
   who implements it. After that, an unresolved judgement becomes a recorded
   assumption in the change, never a mid-run interruption.

5. **Tests are part of the change, not a follow-up.** See
   [`testing.md`](./testing.md). A change without its tests is not done.

6. **Commit after every task.** Kill-loss is bounded to the last task, not the
   last hour. See [`shipping.md`](./shipping.md).

7. **Report faithfully.** If tests fail, say so and show the output. If a step
   was skipped, say which and why. Never call partial work complete.

8. **Least surprise.** Code does what its name says. Prefer the simplest thing
   that works over the clever thing that impresses.
