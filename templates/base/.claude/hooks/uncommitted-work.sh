#!/usr/bin/env bash
# Stop - surface uncommitted or unpushed work at the end of a turn.
#
# Advisory (systemMessage), never blocking: a blocking Stop hook fights every
# legitimate pause and can loop.
set -uo pipefail

cat >/dev/null
cd "$(git rev-parse --show-toplevel 2>/dev/null)" 2>/dev/null || exit 0

# Files that are routinely dirty and are not deliverables. Without this filter
# most reminders list nothing but noise, and a reminder that is usually noise
# gets ignored when it matters.
dirty="$(git status --porcelain 2>/dev/null \
  | grep -vE '\.claude/(scheduled_tasks\.lock|settings\.local\.json)$' \
  | grep -vE '^\?\? (node_modules|worktrees)/' || true)"

branch="$(git rev-parse --abbrev-ref HEAD 2>/dev/null)"
unpushed=""
if [ "$branch" != "HEAD" ]; then
  if git rev-parse --verify --quiet "origin/$branch" >/dev/null; then
    n="$(git rev-list --count "origin/$branch"..HEAD 2>/dev/null || echo 0)"
    [ "$n" -gt 0 ] && unpushed="$n commit(s) not pushed to origin/$branch."
  elif git remote | grep -q .; then
    n="$(git rev-list --count HEAD --not --remotes 2>/dev/null || echo 0)"
    [ "$n" -gt 0 ] && unpushed="$n commit(s) on a branch with no upstream."
  fi
fi

[ -z "$dirty" ] && [ -z "$unpushed" ] && exit 0

msg=""
if [ -n "$dirty" ]; then
  count="$(printf '%s\n' "$dirty" | grep -c .)"
  msg="${count} uncommitted change(s) on ${branch}:
$(printf '%s\n' "$dirty" | head -10 | sed 's/^/  /')
"
fi
[ -n "$unpushed" ] && msg="${msg}${unpushed}
"

jq -nc --arg m "$msg" '{systemMessage: ($m + "\nCommit after every completed task and push before two pile up (.claude/rules/shipping.md).")}'
