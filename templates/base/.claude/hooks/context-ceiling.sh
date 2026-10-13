#!/usr/bin/env bash
# PostToolUse(*) - tell the session when its own context crosses a ceiling.
#
# Every turn re-reads the whole context, so cost grows with the square of session
# length. A session cannot see its own size, so the rule "hand off at 250k" is
# only followed if something says the number out loud. Fires once per threshold
# per session (or per subagent): a reminder on every call would itself be the
# leak.
set -uo pipefail

payload="$(cat)"
transcript="$(printf '%s' "$payload" | jq -r '.transcript_path // ""' 2>/dev/null)"
session="$(printf '%s' "$payload" | jq -r '.session_id // ""' 2>/dev/null | tr -cd 'A-Za-z0-9_-' | cut -c1-64)"
agent="$(printf '%s' "$payload" | jq -r '.agent_id // ""' 2>/dev/null | tr -cd 'A-Za-z0-9_-' | cut -c1-64)"
[ -z "$transcript" ] || [ -z "$session" ] && exit 0

# Inside a subagent, transcript_path is the PARENT's transcript. The subagent's
# own turns live one directory deeper; reading the parent's would report the
# driver's size to every phase agent.
key="$session"
if [ -n "$agent" ]; then
  transcript="$(dirname "$transcript")/${session}/subagents/agent-${agent}.jsonl"
  key="${session}-${agent}"
fi
[ -f "$transcript" ] || exit 0

# Only read the tail: transcripts reach hundreds of MB and this runs every call.
ctx="$(tail -c 262144 "$transcript" 2>/dev/null \
  | grep -o '"cache_read_input_tokens":[0-9]*' | tail -1 | tr -cd '0-9')"
case "$ctx" in ''|*[!0-9]*) exit 0 ;; esac

level=0
[ "$ctx" -ge 150000 ] && level=150
[ "$ctx" -ge 250000 ] && level=250
[ "$ctx" -ge 400000 ] && level=400

state="${TMPDIR:-/tmp}/claude-ctx-ceiling-${key}"
seen="$(cat "$state" 2>/dev/null || echo 0)"
case "$seen" in ''|*[!0-9]*) seen=0 ;; esac
[ "$level" -le "$seen" ] && exit 0
printf '%s' "$level" > "$state"

k=$(( ctx / 1000 ))
if [ -n "$agent" ]; then
  msg="Context is ~${k}k - past the 150k budget for one phase. Commit, push, and return now with \`split:\` naming the remaining tasks. A fresh agent is cheaper than every further turn here re-reading ${k}k."
else
  case "$level" in
    150) msg="Context is ~${k}k. Finish the task in hand, commit and push it, and stop starting new ones. Every further turn re-reads all ${k}k." ;;
    250) msg="Context is ~${k}k - the handoff ceiling. Commit and push, write where you stopped into the change folder, and end the turn with the one command the user should run in a fresh session to carry on." ;;
    *)   msg="Context is ~${k}k. Every turn now costs several times a normal one. Commit what is done and hand off immediately." ;;
  esac
fi

jq -nc --arg m "$msg" '{decision: "block", reason: ($m + "\n\nThis fires once per threshold and will not repeat.")}'
