#!/usr/bin/env bash
# PreToolUse(Bash) - block switching to the default branch while the current
# branch still carries work that is not on origin.
#
# Uncommitted changes are not checked: git already refuses a switch that would
# overwrite them. What git does NOT warn about is stranding commits unique to
# the branch, so that is the only thing checked. Containment is tested by
# CONTENT, not ancestry, so a squash-merged branch can still leave freely.
#
# Allowed: `git checkout <default> -- <path>`, `-b/-c` from the default branch,
# `--detach`, `origin/<default>`, and `ALLOW_MAIN_CHECKOUT=1 git ...`.
set -uo pipefail

cmd="$(jq -r '.tool_input.command // ""' 2>/dev/null)"
[ -z "$cmd" ] && exit 0
repo="${CLAUDE_PROJECT_DIR:-.}"

default="$(git -C "$repo" symbolic-ref --short refs/remotes/origin/HEAD 2>/dev/null)"
default="${default#origin/}"
if [ -z "$default" ]; then
  default=main
  git -C "$repo" rev-parse --verify --quiet origin/master >/dev/null && default=master
fi

deny() {
  jq -nc --arg r "$1" '{hookSpecificOutput: {hookEventName: "PreToolUse",
    permissionDecision: "deny", permissionDecisionReason: $r}}'
  exit 0
}

# A here-string, not a pipe: a piped `while` runs in a subshell and loses the flag.
targets=0
while IFS= read -r seg; do
  seg="$(printf '%s' "$seg" | tr -s '[:space:]' ' ' | sed 's/^ //; s/ $//')"
  printf '%s' "$seg" | grep -qE '^([A-Za-z_][A-Za-z0-9_]*=[^ ]* )*git (checkout|switch)( |$)' || continue
  case "$seg" in
    *" -- "*|*" -b "*|*" -B "*|*" -c "*|*" -C "*|*" --create "*|*" --detach"*) continue ;;
  esac
  printf '%s' "$seg" | grep -qE "(^| )${default}( |\$)" && targets=1
done <<<"$(printf '%s\n' "$cmd" | tr ';&|' '\n')"

[ "$targets" -eq 0 ] && exit 0
printf '%s' "$cmd" | grep -qE '(^| )ALLOW_MAIN_CHECKOUT=1( |$)' && exit 0

current="$(git -C "$repo" symbolic-ref --quiet --short HEAD 2>/dev/null)"
[ "$current" = "$default" ] && exit 0

# No remote yet (fresh project): nothing to compare against, nothing to guard.
git -C "$repo" rev-parse --verify --quiet "origin/$default" >/dev/null || exit 0

git -C "$repo" diff --quiet "origin/$default"...HEAD 2>/dev/null && exit 0
git -C "$repo" diff --quiet "origin/$default" HEAD 2>/dev/null && exit 0

deny "Refusing to switch to ${default}: this branch carries work that is not in origin/${default}, and switching would strand it.

Read from ${default} without switching:
  git show origin/${default}:<path>
  git diff origin/${default}...HEAD

If the branch is finished, ship it. If it is merged but behind, run git merge origin/${default}.
To leave the work behind deliberately: ALLOW_MAIN_CHECKOUT=1 git checkout ${default}"
