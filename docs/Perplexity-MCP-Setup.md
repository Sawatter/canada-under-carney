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

## Live dashboard review in Comet

If the goal is for Comet to inspect the rendered dashboard at
`https://sawatter.github.io/canada-under-carney/`, do not rely on the fetch-only
URL tool by itself. This project is a React SPA. A plain URL fetch can return
mostly the app shell and miss the JavaScript-rendered UI.

Use this primary workflow instead:

1. Open the dashboard URL in the Comet browser itself and let the page finish
loading.
2. If you want file-level repo context too, enable the local filesystem MCP
connector from this doc first. Read-only snapshot mode is the safer default for
review. Refresh the snapshot before the review so Comet is not reading an older
copy of the repo:
   ```bash
   scripts/start-perplexity-filesystem-mcp.sh --prepare-readonly-snapshot
   ```
3. In the Comet chat, point the model at the open tab instead of only pasting
the URL. Use `@tab` or the current-tab picker so the prompt is grounded in the
rendered page Comet can already see.
4. Tell Comet which mode you expect:
   - `Rendered tab review` for layout, hierarchy, interaction, copy, and trust
     surface feedback.
   - `Repo review via MCP` for methodology, source-chain, and architecture
     feedback.
   - `Both` when you want one pass that uses the live tab plus the repo files.

Suggested live-review opener:

```text
Review the open @tab for canada-under-carney as a live rendered dashboard, not
as a raw URL fetch. If you need repo context, also use the Canada Under Carney
filesystem MCP connector. Be explicit about which findings come from the live
rendered tab versus which are inferred from repo files. First confirm the live
tab version matches the version I asked you to review. If the live tab, bundle,
and MCP files disagree on version, report the mismatch before giving findings.
```

Live-access smoke test:

```text
Before reviewing, prove you can inspect the live rendered tab. Report the
visible version string, the active navigation label, the two headline-score
cards, and one thing that changes after opening a dimension card. Confirm that
the visible version matches the target review version. If you cannot scroll,
click, or read the current rendered tab, stop and say LIVE-TAB ACCESS FAILED
instead of reviewing from URL fetch results.
```

Copy/paste prompt for a deep Comet pass:

```text
Assume the editor wants disagreement, not reassurance.

Review the open @tab for https://sawatter.github.io/canada-under-carney/ as a
live rendered dashboard, not as a raw URL fetch. Also use the Canada Under
Carney read-only filesystem MCP connector for repo, methodology, source-chain,
and architecture claims. If MCP is unavailable, use the attached
perplexity-bundle.md instead.

First prove live-tab access. Report the visible version string, active
navigation label, the two headline-score cards, and one visible change after
opening a dimension card. Confirm the visible version matches the target review
version. If you cannot scroll, click, or read the rendered tab, stop and say
LIVE-TAB ACCESS FAILED.

Then review every visible and interactive dashboard surface you can reach:
header, trust frame, KPI cards, score math expanders, status block, all tabs,
promise controls, change-log filters, methodology/about links, all dimension
cards, dimension drawer sections, jump navigation, source/download affordances,
desktop viewport, mobile viewport if available, and keyboard/focus behavior if
available.

For every finding, label the evidence source as one of:
- Rendered-tab evidence
- Repo evidence
- Bundle evidence
- Needs live interaction
- Not inspected

For every UI claim, label the viewport used. Do not generalize desktop findings
to mobile or mobile findings to desktop. If you sampled instead of exhausting a
surface, say exactly what was sampled and what remains not inspected.

End with:
1. A coverage matrix.
2. Ranked findings with concrete fixes.
3. Claims you retract or narrow because live evidence does not support them.
4. Open questions where the evidence is still insufficient.
```

What this fixes:

- Comet can comment on the rendered page it is actually viewing in-browser.
- The MCP connector can supply the underlying files and docs at the same time.

What this does not fix:

- A fetch-only tool still will not become a full browser.
- If Comet is not being used inside the Comet browser, or is not pointed at the
  open tab, it may still fall back to URL/document reading instead of live page
  inspection.

## Rendered evidence pack fallback

This is a fallback, not the preferred path for a full UI review. When Comet
cannot inspect the live tab, attach rendered evidence instead of asking it to
infer UI quality from source files. It is useful for a bounded second opinion,
but it is not efficient for exhaustive interaction review.

Generate a fresh evidence pack:

```bash
npm run review:evidence
```

By default this captures the live GitHub Pages site:

```text
https://sawatter.github.io/canada-under-carney/
```

Before trusting the default live capture, confirm the live header version
matches `src/data/meta.json`. If local `meta.json` is ahead of the deployed
site, either wait for Pages to deploy or capture local preview with
`REVIEW_EVIDENCE_URL`.

The output is written under:

```text
tmp/review-evidence/
```

Attach these files to Comet:

```text
review-evidence.pdf
manifest.md
```

The PDF is the one-file visual packet. The manifest records the URL, dashboard
version, viewports, and exact screenshots. Individual PNGs are also generated
in the same folder if a reviewer needs to zoom into a specific view.

If the MCP connector is not available, also attach the repo bundle. Refresh it
first so Comet sees the current working tree:

```bash
npm run bundle
```

The bundle is copied to:

```text
~/Downloads/perplexity-bundle.md
```

Use the bundle for repo, method, source-chain, and architecture claims. Use the
evidence PDF only for rendered visual evidence.

To capture a local preview instead of the live site, start preview separately
and pass the URL:

```bash
REVIEW_EVIDENCE_URL=http://127.0.0.1:4173/canada-under-carney/ npm run review:evidence
```

To change the expanded dimension included in the packet:

```bash
REVIEW_EVIDENCE_DIMENSION=housing-supply npm run review:evidence
```

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
