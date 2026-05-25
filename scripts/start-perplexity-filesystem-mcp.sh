#!/usr/bin/env bash
set -euo pipefail

# Starts the generic Model Context Protocol filesystem server scoped to this
# repository only. The direct mode exposes the filesystem server's normal tools,
# including write/edit tools, but only inside this repo root.
#
# For review-only work, use --readonly-snapshot. That creates a read-only copy
# under tmp/ and points the filesystem server at that snapshot instead.

SERVER_PACKAGE="${MCP_FILESYSTEM_PACKAGE:-@modelcontextprotocol/server-filesystem@2026.1.14}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd -P)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd -P)"
SNAPSHOT_DIR="${MCP_READONLY_SNAPSHOT_DIR:-${REPO_ROOT}/tmp/mcp-readonly-snapshot}"

print_direct_config() {
  cat <<JSON
{
  "name": "canada-under-carney-filesystem",
  "command": "/bin/bash",
  "args": [
    "${REPO_ROOT}/scripts/start-perplexity-filesystem-mcp.sh"
  ]
}
JSON
}

print_readonly_config() {
  cat <<JSON
{
  "name": "canada-under-carney-filesystem-readonly",
  "command": "/bin/bash",
  "args": [
    "${REPO_ROOT}/scripts/start-perplexity-filesystem-mcp.sh",
    "--readonly-snapshot"
  ]
}
JSON
}

print_http_config() {
  cat <<JSON
{
  "name": "canada-under-carney-filesystem-http",
  "url": "http://127.0.0.1:8080/mcp",
  "transport": "streamable-http"
}
JSON
}

print_sse_config() {
  cat <<JSON
{
  "name": "canada-under-carney-filesystem-sse",
  "url": "http://127.0.0.1:8080/sse",
  "transport": "sse"
}
JSON
}

prepare_readonly_snapshot() {
  if ! command -v rsync >/dev/null 2>&1; then
    echo "rsync is required for --readonly-snapshot mode" >&2
    exit 1
  fi

  mkdir -p "${REPO_ROOT}/tmp"
  if [ -d "${SNAPSHOT_DIR}" ]; then
    chmod -R u+w "${SNAPSHOT_DIR}" 2>/dev/null || true
    rm -rf "${SNAPSHOT_DIR}"
  fi
  mkdir -p "${SNAPSHOT_DIR}"

  rsync -a --delete \
    --exclude ".git/" \
    --exclude "node_modules/" \
    --exclude "dist/" \
    --exclude "tmp/mcp-readonly-snapshot/" \
    --exclude ".DS_Store" \
    "${REPO_ROOT}/" \
    "${SNAPSHOT_DIR}/"

  chmod -R a-w "${SNAPSHOT_DIR}"
  echo "${SNAPSHOT_DIR}"
}

start_http_proxy() {
  local target_root="$1"
  local -a proxy_args=(
    --host "${MCP_HTTP_HOST:-127.0.0.1}"
    --port "${MCP_HTTP_PORT:-8080}"
  )

  if [ -n "${MCP_PROXY_API_KEY:-}" ]; then
    proxy_args+=(
      --apiKey "${MCP_PROXY_API_KEY}"
      --corsAddAllowedHeader X-API-Key
    )
  fi

  if [ "${MCP_PROXY_TUNNEL:-0}" = "1" ]; then
    proxy_args+=(--tunnel)
  fi

  if [ -n "${MCP_PROXY_SECRET_PATH:-}" ]; then
    proxy_args+=(
      --streamEndpoint "/${MCP_PROXY_SECRET_PATH}/mcp"
      --sseEndpoint "/${MCP_PROXY_SECRET_PATH}/sse"
    )
  fi

  exec npx -y mcp-proxy \
    "${proxy_args[@]}" \
    -- \
    npx -y "${SERVER_PACKAGE}" "${target_root}"
}

case "${1:-}" in
  --print-config)
    print_direct_config
    ;;
  --print-readonly-config)
    print_readonly_config
    ;;
  --print-http-config)
    print_http_config
    ;;
  --print-sse-config)
    print_sse_config
    ;;
  --prepare-readonly-snapshot)
    prepare_readonly_snapshot
    ;;
  --readonly-snapshot)
    readonly_root="$(prepare_readonly_snapshot)"
    exec npx -y "${SERVER_PACKAGE}" "${readonly_root}"
    ;;
  --http)
    start_http_proxy "${REPO_ROOT}"
    ;;
  --readonly-snapshot-http)
    readonly_root="$(prepare_readonly_snapshot)"
    start_http_proxy "${readonly_root}"
    ;;
  --tunnel)
    MCP_PROXY_TUNNEL=1 start_http_proxy "${REPO_ROOT}"
    ;;
  --readonly-snapshot-tunnel)
    readonly_root="$(prepare_readonly_snapshot)"
    MCP_PROXY_TUNNEL=1 start_http_proxy "${readonly_root}"
    ;;
  --help|-h)
    cat <<EOF
Usage:
  scripts/start-perplexity-filesystem-mcp.sh
      Start generic filesystem MCP scoped to the repo root.

  scripts/start-perplexity-filesystem-mcp.sh --readonly-snapshot
      Start filesystem MCP scoped to a read-only repo snapshot under tmp/.

  scripts/start-perplexity-filesystem-mcp.sh --print-config
      Print JSON connector config for direct repo mode.

  scripts/start-perplexity-filesystem-mcp.sh --print-readonly-config
      Print JSON connector config for read-only snapshot mode.

  scripts/start-perplexity-filesystem-mcp.sh --http
      Start an HTTP/SSE MCP proxy on http://127.0.0.1:8080.
      Use http://127.0.0.1:8080/mcp for Streamable HTTP or
      http://127.0.0.1:8080/sse for SSE.

  scripts/start-perplexity-filesystem-mcp.sh --readonly-snapshot-http
      Same HTTP/SSE proxy, but pointed at a read-only repo snapshot.

  scripts/start-perplexity-filesystem-mcp.sh --tunnel
      Start a public HTTPS tunnel to the live repo MCP proxy.
      Set MCP_PROXY_API_KEY first if the client supports API key auth.

  scripts/start-perplexity-filesystem-mcp.sh --readonly-snapshot-tunnel
      Start a public HTTPS tunnel to a read-only repo snapshot.
      Recommended for Perplexity remote custom connectors.

  scripts/start-perplexity-filesystem-mcp.sh --print-http-config
      Print connector hints for Streamable HTTP URL mode.

  scripts/start-perplexity-filesystem-mcp.sh --print-sse-config
      Print connector hints for SSE URL mode.
EOF
    ;;
  "")
    exec npx -y "${SERVER_PACKAGE}" "${REPO_ROOT}"
    ;;
  *)
    echo "Unknown option: $1" >&2
    echo "Run with --help for usage." >&2
    exit 2
    ;;
esac
