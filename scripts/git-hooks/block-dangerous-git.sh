#!/bin/sh
# git-guardrails — Claude Code PreToolUse hook.
# Blocks destructive git commands before the agent runs them.
#
# Reads the tool-call JSON on stdin and greps the raw payload (dependency-free,
# no jq). Exit 2 = BLOCK (stderr is shown to the agent); exit 0 = allow.
# Identity-neutral by design: contains no names or paths (this is a public repo).
#
# Blocks: force push (allows --force-with-lease), reset --hard, clean -f,
# branch -D, push --delete / push :ref, filter-branch, update-ref -d,
# reflog expire --expire=now. Normal add/commit/push/status/log/diff/checkout
# are NOT blocked.

payload=$(cat)

# Only inspect Bash tool calls; let everything else through untouched.
case "$payload" in
  *'"tool_name":"Bash"'*|*'"tool_name": "Bash"'*) : ;;
  *) exit 0 ;;
esac

block() {
  echo "git-guardrails: BLOCKED — $1" >&2
  echo "Destructive git is disabled for the agent. If this is genuinely intended, run it yourself." >&2
  exit 2
}

# Force push — but allow --force-with-lease (the [^-] after 'force' excludes it).
printf '%s' "$payload" | grep -Eq 'push[^"]*--force([^-]|$)'      && block "force push (git push --force)"
printf '%s' "$payload" | grep -Eq 'push[^"]*[[:space:]]-f([[:space:]]|")' && block "force push (git push -f)"
# Hard reset.
printf '%s' "$payload" | grep -Eq 'reset[^"]*--hard'             && block "hard reset (git reset --hard)"
# Clean with a force flag (-f, -fd, -fx, -xf ...).
printf '%s' "$payload" | grep -Eq 'clean[^"]*[[:space:]]-[A-Za-z]*f' && block "force clean (git clean -f)"
# Force-delete a branch.
printf '%s' "$payload" | grep -Eq 'branch[^"]*[[:space:]]-D'     && block "force branch delete (git branch -D)"
# Delete a remote ref.
printf '%s' "$payload" | grep -Eq 'push[^"]*--delete'           && block "remote ref delete (git push --delete)"
printf '%s' "$payload" | grep -Eq 'push[^"]*[[:space:]]:[A-Za-z]' && block "remote ref delete (git push :ref)"
# History rewrites and ref/reflog destruction.
printf '%s' "$payload" | grep -Eq 'filter-branch'               && block "history rewrite (git filter-branch)"
printf '%s' "$payload" | grep -Eq 'update-ref[^"]*[[:space:]]-d' && block "ref deletion (git update-ref -d)"
printf '%s' "$payload" | grep -Eq 'reflog[^"]*expire[^"]*--expire=now' && block "reflog purge (git reflog expire --expire=now)"

exit 0
