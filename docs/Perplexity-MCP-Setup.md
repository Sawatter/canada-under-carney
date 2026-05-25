# Perplexity / Comet / Claude MCP Setup

This repo can be exposed to Perplexity or Comet through the generic MCP
filesystem server. The connector is scoped only to this repository:

```text
<REPLACE-WITH-YOUR-LOCAL-REPO-PATH>
```

Throughout this doc, `<REPLACE-WITH-YOUR-LOCAL-REPO-PATH>` is the absolute
path to your local clone of this repository (for example,
`/Users/you/code/canada-under-carney` or `/home/you/repos/canada-under-carney`).
Replace it everywhere it appears before wiring up your MCP client.

Do not add broader paths like the entire home folder, the entire Downloads
folder, or the filesystem root. Scope the connector to the repo only.

## Local working config files

The MCP runtime reads from `.mcp/perplexity-filesystem-direct.json` and
`.mcp/perplexity-filesystem-readonly-snapshot.json`. Those files are
**gitignored** because the absolute paths in them are specific to each
contributor's machine. The repo ships `.json.template` versions that you
copy and edit:

```bash
cd <REPLACE-WITH-YOUR-LOCAL-REPO-PATH>
cp .mcp/perplexity-filesystem-direct.json.template \
   .mcp/perplexity-filesystem-direct.json
cp .mcp/perplexity-filesystem-readonly-snapshot.json.template \
   .mcp/perplexity-filesystem-readonly-snapshot.json
```

Then open each `.json` file and replace `<REPLACE-WITH-YOUR-LOCAL-REPO-PATH>`
with your actual repo path. The shell script that the JSON points at uses
relative paths internally, so once the JSON is correct, no other edits are
needed.

## Recommended connector: direct repo filesystem

Use this when Perplexity supports local command-based MCP connectors and you
want Comet to inspect the live working tree. The generic filesystem server
exposes write/edit tools inside this repo.

Command:

```text
/bin/bash
```

Args:

```text
<REPLACE-WITH-YOUR-LOCAL-REPO-PATH>/scripts/start-perplexity-filesystem-mcp.sh
```

Equivalent JSON lives at:

```text
.mcp/perplexity-filesystem-direct.json
```

## Claude Desktop local connector

Claude Desktop can launch the MCP server locally by command, so it does not
need the public tunnel. First create or refresh the read-only snapshot:

```bash
cd <REPLACE-WITH-YOUR-LOCAL-REPO-PATH>
scripts/start-perplexity-filesystem-mcp.sh --prepare-readonly-snapshot
```

Then add this server to:

```text
~/Library/Application Support/Claude/claude_desktop_config.json
```

```json
{
  "mcpServers": {
    "canada-under-carney-readonly": {
      "command": "/opt/homebrew/bin/npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem@2026.1.14",
        "<REPLACE-WITH-YOUR-LOCAL-REPO-PATH>/tmp/mcp-readonly-snapshot"
      ]
    }
  }
}
```

Restart Claude Desktop after editing the config. Then test in Claude:

```text
Use the canada-under-carney-readonly MCP server. Read this exact file:
<REPLACE-WITH-YOUR-LOCAL-REPO-PATH>/tmp/mcp-readonly-snapshot/src/data/meta.json

Tell me the dashboard version.
```

Do not point Claude Desktop at the wrapper script directly. Some Claude Desktop
sandboxes refuse to open scripts from `~/Downloads` with `Operation not
permitted`. Launching the pinned filesystem MCP package directly avoids that
launcher failure.

## Safer review connector: read-only snapshot

Use this when Perplexity supports local command-based MCP connectors and you
want Comet to review the repo but not edit the live working tree. The wrapper
creates a read-only snapshot under:

```text
tmp/mcp-readonly-snapshot
```

Command:

```text
/bin/bash
```

Args:

```text
<REPLACE-WITH-YOUR-LOCAL-REPO-PATH>/scripts/start-perplexity-filesystem-mcp.sh
--readonly-snapshot
```

Equivalent JSON lives at:

```text
.mcp/perplexity-filesystem-readonly-snapshot.json
```

## URL-based connector screen

If Perplexity shows an "MCP server URL" field with transport choices like
"Streamable HTTP" and "SSE", start the local HTTP proxy first:

```bash
cd <REPLACE-WITH-YOUR-LOCAL-REPO-PATH>
scripts/start-perplexity-filesystem-mcp.sh --readonly-snapshot-http
```

Then use these settings in Perplexity:

```text
MCP server URL: http://127.0.0.1:8080/mcp
Transport: Streamable HTTP
Authentication: None / No authentication
```

If Streamable HTTP does not connect, use the fallback:

```text
MCP server URL: http://127.0.0.1:8080/sse
Transport: SSE
Authentication: None / No authentication
```

Direct live-working-tree mode is also available:

```bash
cd <REPLACE-WITH-YOUR-LOCAL-REPO-PATH>
scripts/start-perplexity-filesystem-mcp.sh --http
```

The URLs are the same. The difference is that `--http` points to the live repo,
while `--readonly-snapshot-http` points to a non-writable copy.

## Remote custom connector screen

If Perplexity rejects `127.0.0.1` with `[FETCHER_HTML_STATUS_CODE_ERROR]`, it is
validating the connector from Perplexity's cloud instead of from your Mac. Use a
temporary HTTPS tunnel with a secret path:

```bash
cd <REPLACE-WITH-YOUR-LOCAL-REPO-PATH>
export MCP_PROXY_SECRET_PATH="cuc-$(openssl rand -hex 16)"
echo "Secret MCP path: ${MCP_PROXY_SECRET_PATH}"
scripts/start-perplexity-filesystem-mcp.sh --readonly-snapshot-tunnel
```

The command prints a public `https://...` tunnel host. In Perplexity, use:

```text
MCP server URL: https://<tunnel-host>/<secret-path>/mcp
Transport: Streamable HTTP
Authentication: None / No authentication
```

If Streamable HTTP does not connect, keep the same tunnel host and use:

```text
MCP server URL: https://<tunnel-host>/<secret-path>/sse
Transport: SSE
Authentication: None / No authentication
```

Keep the terminal running while Comet uses the connector. Stop it with
`Control-C` when finished. The recommended tunnel mode points at a read-only
snapshot, not the live working tree.

Note: `mcp-proxy --apiKey` expects the `X-API-Key` header. Perplexity remote
connectors send API-key auth as `api-key`, so the secret-path tunnel is the
working remote-connector pattern unless Perplexity adds custom header support.

## Print connector JSON

From the repo root:

```bash
scripts/start-perplexity-filesystem-mcp.sh --print-config
scripts/start-perplexity-filesystem-mcp.sh --print-readonly-config
scripts/start-perplexity-filesystem-mcp.sh --print-http-config
scripts/start-perplexity-filesystem-mcp.sh --print-sse-config
```

## Privacy and safety boundary

- The MCP server is launched with only this repo path as its allowed directory.
- The generic filesystem server includes read, write, edit, move, and directory
  tools. That is why the direct connector should be used only when you are
  comfortable giving Comet write-capable access to this repo folder.
- The read-only snapshot mode is better for external review because filesystem
  writes should fail at the OS permission layer.
- The wrapper pins `@modelcontextprotocol/server-filesystem@2026.1.14`.
  Older filesystem-server versions had public path/symlink bypass advisories.
- Do not paste secrets into repo files before launching this connector.
- `node_modules`, `dist`, `.git`, and the snapshot folder are excluded from the
  read-only snapshot mode.

## Suggested Comet prompt

```text
Use the Canada Under Carney filesystem MCP connector. Read CLAUDE.md first.
Inspect only files under <REPLACE-WITH-YOUR-LOCAL-REPO-PATH>.
Do not edit, write, move, or delete files unless I explicitly ask.

Task:
[paste review task here]
```
