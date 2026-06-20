#!/usr/bin/env bash
# ask-claude.sh — let Codex (or any script) get a READ-ONLY second opinion from Claude Code.
#
# Why: this repo's cross-model loop normally runs Claude -> Codex (Claude shells out to
# `codex exec`). This is the reverse bridge so Codex -> Claude works too.
#
# Prerequisites (one-time, in the environment where Codex runs — a human must do these;
# they cannot be scripted from inside another agent):
#   1. Install the Claude Code CLI:   npm install -g @anthropic-ai/claude-code
#   2. Authenticate it:               claude login        (interactive, once)
#        ...or for headless/CI:       export ANTHROPIC_API_KEY=sk-ant-...   (do NOT commit it)
#
# Usage:
#   scripts/ask-claude.sh "your prompt here"        # prompt as an argument
#   echo "your prompt" | scripts/ask-claude.sh      # prompt via stdin
#
# Safety: Claude runs in PLAN (read-only) mode here — it reads files / git diff and
# answers, but does NOT edit files or run commands. Keep it that way for a review bridge.
set -euo pipefail

# 1. Resolve the claude binary (PATH first, then common install locations).
CLAUDE_BIN="$(command -v claude 2>/dev/null || true)"
if [ -z "$CLAUDE_BIN" ]; then
  for cand in "$HOME/.claude/local/claude" /usr/local/bin/claude /opt/homebrew/bin/claude; do
    if [ -x "$cand" ]; then CLAUDE_BIN="$cand"; break; fi
  done
fi
if [ -z "$CLAUDE_BIN" ]; then
  {
    echo "ask-claude: the 'claude' CLI is not installed in this environment."
    echo "  Install it once:   npm install -g @anthropic-ai/claude-code"
    echo "  Then authenticate: claude login   (or export ANTHROPIC_API_KEY=...)"
  } >&2
  exit 2
fi

# 2. Read the prompt from args or stdin.
if [ "$#" -gt 0 ]; then
  PROMPT="$*"
else
  PROMPT="$(cat)"
fi
if [ -z "${PROMPT//[[:space:]]/}" ]; then
  echo "ask-claude: no prompt given (pass it as an argument or pipe it via stdin)." >&2
  exit 1
fi

# 3. Ask Claude, read-only. --permission-mode plan = analyze + answer, no edits/commands.
#    (If your claude version rejects this flag, run `claude --help` and adjust.)
ERRLOG="$(mktemp)"
trap 'rm -f "$ERRLOG"' EXIT
if ! "$CLAUDE_BIN" -p "$PROMPT" --permission-mode plan 2>"$ERRLOG"; then
  {
    echo "ask-claude: the claude run failed — most likely it is not authenticated."
    echo "  Fix: run 'claude login' once (or set ANTHROPIC_API_KEY) in this environment."
    echo "  Raw error:"; sed 's/^/    /' "$ERRLOG"
  } >&2
  exit 3
fi
