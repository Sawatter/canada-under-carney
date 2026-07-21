#!/usr/bin/env bash
set -euo pipefail

# The external filesystem connector is intentionally paused. The previous
# snapshot copied ignored local files, and the remote modes lacked compatible
# authentication. Keep this guard in place until the decision memo's reopen
# gates are met.

DECISION_DOC="docs/MCP-vs-Scripts-Decision-2026-07-19.md"

print_hold() {
  cat <<EOF
Canada Under Carney filesystem MCP is paused.

Do not expose the live working tree, a repo snapshot, or a local proxy through
this launcher. Use the tracked-file review bundle and rendered evidence pack:

  npm run bundle
  npm run review:evidence

Decision and reopen gates:
  ${DECISION_DOC}
EOF
}

case "${1:-}" in
  --help|-h|--status)
    print_hold
    ;;
  *)
    print_hold >&2
    exit 2
    ;;
esac
