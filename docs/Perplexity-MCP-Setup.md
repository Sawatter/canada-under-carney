# Perplexity / Comet / Claude Review Setup

## Current hold

The repo's filesystem MCP connector is paused as of 2026-07-19. Do not use the
direct, snapshot, HTTP, SSE, or tunnel modes. The launcher exits without
starting a server.

The decision record is
[MCP-vs-Scripts-Decision-2026-07-19.md](MCP-vs-Scripts-Decision-2026-07-19.md).
It found that:

- MCP is not part of the dashboard runtime, build, deployment, source monitor,
  scoring, or browser-test path.
- The old read-only snapshot copied ignored local files, including identity
  patterns, personal AI context, machine-specific MCP configs, generated
  output, test results, and most of `tmp/`.
- Read-only permissions blocked edits but did not block reading those files.
- Direct modes exposed write-capable filesystem tools.
- Public tunnel modes used a secret URL path instead of compatible
  authentication.

The committed `.mcp/*.json.template` files remain only as historical
configuration references. Local `.mcp/*.json` files are gitignored. Neither
should be activated while this hold is in place.

## Safe review paths

Use the smallest path that gives the reviewer the evidence it needs:

| Review need | Current path |
|---|---|
| Repo, methodology, source-chain, or architecture review | Tracked-file bundle or individually attached files |
| Live layout and interaction review | Open the rendered dashboard in a browser-capable review session |
| Static desktop and mobile evidence | Generated review PDF and manifest |
| Repeatable browser regression | Playwright Test through `npm run test:browser` |
| Claude adversarial review | Read-only `scripts/claude-bridge.sh` workflow |

### Repo bundle

Generate a fresh bundle:

```bash
npm run bundle
```

The upload copy is written to:

```text
~/Downloads/perplexity-bundle.md
```

The bundle contains the working-tree content of regular Git-tracked text files.
It reports untracked files through its dirty-state metadata but does not include
them. Tracked symlinks are listed without reading their targets. Attach a new
untracked file separately when it is part of the review.

Before relying on the bundle, check the metadata at its top:

- target version
- Git commit
- whether the working tree was dirty when generated

### Rendered evidence pack

Generate a fresh evidence pack:

```bash
npm run review:evidence
```

By default it captures:

```text
https://sawatter.github.io/canada-under-carney/
```

Before trusting the default live capture, confirm the visible live version
matches `src/data/meta.json`. If local metadata is ahead of the deployed site,
wait for Pages or capture a local preview.

Each run writes to a timestamped folder under:

```text
tmp/review-evidence/<timestamp>/
```

Attach these files from the newest completed folder:

```text
review-evidence.pdf
manifest.md
```

The PDF is the visual packet. The manifest records the URL, dashboard version,
viewports, and exact screenshots. Use these files for visible layout claims,
not for claims about code, methodology, or live interaction.

To capture a local preview:

```bash
REVIEW_EVIDENCE_URL=http://127.0.0.1:4173/canada-under-carney/ npm run review:evidence
```

To change the expanded dimension in the packet:

```bash
REVIEW_EVIDENCE_DIMENSION=housing-supply npm run review:evidence
```

## Live dashboard review in Comet

For UI review, open
`https://sawatter.github.io/canada-under-carney/` in the Comet browser and
point the review at the open tab. A fetch-only request can return mostly the
React app shell and miss the rendered interface.

Use this workflow:

1. Open the dashboard in Comet and let it finish loading.
2. Point the chat at the open tab with `@tab` or the current-tab picker.
3. Attach the fresh bundle for repo context when needed.
4. Attach the fresh evidence PDF and manifest if the reviewer cannot inspect a
   required viewport directly.
5. Ask the reviewer to separate live-tab evidence, bundle evidence, rendered
   packet evidence, and anything it could not inspect.

Live-access smoke test:

```text
Before reviewing, prove you can inspect the live rendered tab. Report the
visible version string, the active navigation label, the two headline-score
cards, and one thing that changes after opening a dimension card. Confirm that
the visible version matches the target review version. If you cannot scroll,
click, or read the current rendered tab, stop and say LIVE-TAB ACCESS FAILED
instead of reviewing from URL fetch results.
```

Deep-review prompt:

```text
Assume the editor wants disagreement, not reassurance.

Review the open @tab for https://sawatter.github.io/canada-under-carney/ as a
live rendered dashboard, not as a raw URL fetch. Use the attached
perplexity-bundle.md for repo, methodology, source-chain, and architecture
claims. Use the attached review-evidence.pdf and manifest.md only for visible
layout evidence that you can point to.

First prove live-tab access. Report the visible version string, active
navigation label, the two headline-score cards, and one visible change after
opening a dimension card. Confirm the visible version matches the target review
version. If you cannot scroll, click, or read the rendered tab, stop and say
LIVE-TAB ACCESS FAILED.

Then inspect the reachable dashboard surfaces: header, trust frame, headline
score cards, score math expanders, status block, navigation, promise controls,
change-log filters, methodology and About links, dimension cards, dimension
drawer sections, source and download controls, desktop viewport, mobile
viewport if available, and keyboard or focus behaviour if available.

For every finding, label the evidence source as one of:
- Live-tab evidence
- Bundle evidence
- Rendered-packet evidence
- Needs live interaction
- Not inspected

For every UI claim, name the viewport used. Do not generalize desktop findings
to mobile or mobile findings to desktop. If you sampled a surface, say what was
sampled and what remains.

End with:
1. A coverage matrix.
2. Ranked findings with concrete fixes.
3. Claims you retract or narrow because the evidence does not support them.
4. Open questions where the evidence is insufficient.
```

## Reopen gates for MCP

Do not rebuild the connector only because the old code existed. Reconsider a
local read-only MCP adapter after a repeated review need shows that selective
reads are materially better than the bundle or targeted attachments.

If that need appears, the replacement design must:

1. Use local `stdio` by default.
2. Copy only Git-tracked files plus explicitly allowed, non-ignored untracked
   files.
3. Include modified tracked files without copying ignored local context.
4. Reject symlinks and special files unless a narrower policy is designed and
   tested.
5. Install retained packages through a lockfile or another reviewable integrity
   mechanism rather than fetching unpinned tools at runtime.
6. Add a smoke test proving sensitive ignored paths and scratch output are
   absent.
7. Receive a different-AI review before it is treated as available.

A remote connector also needs compatible authentication and a fresh editor
approval. A secret URL alone does not pass that gate. Separate SSE mode should
not return as the default because the current MCP specification replaced the
older HTTP+SSE transport with Streamable HTTP.

The upstream filesystem server remains a trusted-code dependency even after
local filtering. A safe input snapshot reduces exposure but does not remove the
need to review and pin the server implementation itself.
