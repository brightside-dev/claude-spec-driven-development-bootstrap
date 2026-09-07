# testing rules — always on

## The bar is behavioural, not numeric

**Every requirement has a test. Every unit of logic has a happy path and a
failure path. Every user-visible change has an end-to-end test.** That is the
whole bar. There is no line-coverage percentage to chase — a number is a
diagnostic, never a gate.

Run tests with: `{{TEST_COMMAND}}`

## Hard rules (a violation fails review)

1. Every numbered requirement has a test referenced by its ID or its behaviour.
2. Every added or changed function with logic has happy **and** failure tests.
3. Every added or changed public entry point (endpoint, screen, command) has a
   test that runs **through** its real boundary, not around it.
4. Every user-visible change has an end-to-end / UI test.
5. Tests assert **behaviour**, not implementation. A test that only checks a mock
   was called, or snapshots an internal detail, is a finding — same severity as a
   missing test.

## What fails review

- A mocked dependency where a real integration test was the point.
- Skipped or disabled tests left in the tree.
- Shared mutable state between tests.
- Changing an assertion to make it pass when the expectation was actually right.

## When requirements change

Update the tests to the new expectation. Do not patch around a stale test — a
test that no longer describes the wanted behaviour is worse than no test.
