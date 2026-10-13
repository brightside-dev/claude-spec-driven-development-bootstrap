# .claude/hooks - rules that enforce themselves

Wired up in [`../settings.json`](../settings.json). A rule in prose is a
request; a hook is a guarantee.

**Requires `jq`.** Without it every hook here exits silently and you get no
guards and no warning. `brew install jq` / `apt-get install -y jq` /
`winget install jqlang.jq`.

| Hook | Event | Verdict |
|---|---|---|
| `main-checkout-guard.sh` | PreToolUse(Bash), `git *` only | **deny** switching to the default branch while this branch has work not on origin |
| `context-ceiling.sh` | PostToolUse(*) | tells the session (or subagent) its context size at 150k / 250k / 400k, once each |
| `uncommitted-work.sh` | Stop | advisory: lists uncommitted files and unpushed commits |

## Writing a new hook

1. Silence is success: exit 0 and print nothing on the happy path.
2. A hook that speaks spends context - make it speak **once per session**
   (latch on `session_id`, and on `agent_id` inside a subagent).
3. Filter with `"if": "Bash(git *)"` in `settings.json` so the process only
   spawns for commands it cares about. Every hook is a process spawn on every
   matching tool call.
4. To deny, print `permissionDecision: "deny"` with a reason that says **what to
   do instead**. Never print `"allow"` to be helpful: it bypasses the user's
   permission prompt. Use `additionalContext` for advice.
5. Never block a Stop hook - it can loop.
6. Use a here-string, not a pipe, into `while read` when the loop sets a flag.
7. Test both directions by piping a payload built with `jq -n`, not a format
   string (a newline in the command makes the JSON invalid and the test passes
   having exercised nothing):

```bash
jq -nc '{tool_input: {command: "git checkout main"}}' | bash .claude/hooks/main-checkout-guard.sh
```

A malformed `settings.json` silently disables every hook in it. Check with
`jq . .claude/settings.json`.
