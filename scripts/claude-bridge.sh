#!/usr/bin/env bash
# Claude bridge - let Codex get a read-only cross-model review from Claude Code
# NON-INTERACTIVELY, so it can never hang.
#
# Why this exists: bare `claude` starts an INTERACTIVE session and waits forever
# for input. When Codex runs it from `exec` (no TTY, no interactive stdin) it
# just hangs with no output. This wrapper always uses --print (-p) headless mode,
# closes stdin, runs read-only, and self-kills after a timeout, so it returns a
# real review or a clear non-zero failure, never an infinite hang.
#
# Usage (Codex should call exactly one of these, never bare `claude`):
#   bash scripts/claude-bridge.sh "review prompt text ..."
#   bash scripts/claude-bridge.sh -f /path/to/prompt.txt
#   echo "review prompt ..." | bash scripts/claude-bridge.sh
#
# Output: Claude's review on stdout.
# Exit:   0 = real review; 124 = timed out; other = failure. Any non-zero means
#         "no review". Report it, and do NOT treat a hang/timeout as a pass.
#
# Tunables (env):
#   CLAUDE_BRIDGE_TIMEOUT  hard cap in seconds (default 600)
#   CLAUDE_BRIDGE_MODEL    model alias/id (default claude-opus-4-8)
#   CLAUDE_BRIDGE_PERM     permission mode (default plan = read-only review)
set -uo pipefail

TIMEOUT="${CLAUDE_BRIDGE_TIMEOUT:-600}"
MODEL="${CLAUDE_BRIDGE_MODEL:-claude-opus-4-8}"
PERM="${CLAUDE_BRIDGE_PERM:-plan}"

# --- resolve the prompt: -f FILE, first arg, or piped stdin ---
if [ "${1:-}" = "-f" ] && [ -n "${2:-}" ]; then
  PROMPT="$(cat "$2")"
elif [ -n "${1:-}" ]; then
  PROMPT="$1"
elif [ ! -t 0 ]; then
  PROMPT="$(cat)"
else
  echo "claude-bridge: no prompt. Pass text, '-f FILE', or pipe via stdin." >&2
  exit 2
fi

if ! command -v claude >/dev/null 2>&1; then
  echo "claude-bridge: 'claude' CLI not found on PATH." >&2
  exit 127
fi

OUT="$(mktemp)"; trap 'rm -f "$OUT"' EXIT

# Headless: --print (never interactive), stdin closed (never waits on input),
# read-only permission mode (never prompts for edits), explicit model + format.
claude --print --output-format text --permission-mode "$PERM" --model "$MODEL" \
  -p "$PROMPT" </dev/null >"$OUT" 2>&1 &
PID=$!

# Portable timeout (macOS has no `timeout`): watchdog that TERM/KILLs on overrun.
( sleep "$TIMEOUT"; kill -TERM "$PID" 2>/dev/null; sleep 3; kill -KILL "$PID" 2>/dev/null ) &
WPID=$!

wait "$PID" 2>/dev/null; RC=$?
kill -TERM "$WPID" 2>/dev/null; wait "$WPID" 2>/dev/null || true

if [ "$RC" -ge 128 ]; then
  echo "claude-bridge: TIMED OUT / killed after ${TIMEOUT}s (rc=$RC). Treat as NO REVIEW." >&2
  exit 124
fi
if [ "$RC" -ne 0 ] || [ ! -s "$OUT" ]; then
  echo "claude-bridge: claude exited $RC with no usable output. Treat as NO REVIEW." >&2
  sed -n '1,8p' "$OUT" >&2
  exit "${RC:-1}"
fi

cat "$OUT"
