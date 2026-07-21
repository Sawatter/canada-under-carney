# MCP vs. Scripts, APIs, CLIs, and Skills

**Decision date:** 2026-07-19
**Research cutoff:** 2026-07-19
**Scope:** How Canada Under Carney should give AI reviewers access to repo and
browser context. This does not change the dashboard runtime, grades, scoring,
sources, or public UI.

## Bottom line

The LinkedIn post points at a useful default, but its blanket conclusion does
not hold.

- **Use scripts, direct APIs, and CLIs for repeatable work.** They are easier to
  test, run in CI, review in Git, and reproduce without spending model context
  on tool descriptions.
- **Use skills for reusable instructions.** A skill tells an agent which process
  and scripts to use. It does not replace the file, network, browser, or API
  access those scripts need.
- **Keep MCP only as a narrow adapter.** Its useful role here is selective,
  read-only repo access for an external AI client that can launch a trusted
  local server. It is not part of the dashboard and should not become part of
  the build, source monitor, scoring, or deployment path.
- **Do not add Playwright MCP to this repo.** Existing Playwright tests, the
  Playwright evidence generator, and browser-capable review sessions cover the
  need with less duplication.
- **Pause every current filesystem MCP launch mode.** The snapshot is read-only
  but copies ignored local files, direct modes expose mutating tools, and the
  public tunnel uses a secret URL path instead of real authentication. The
  launcher now exits without starting a server. Rebuilding a narrow local
  connector is need-gated rather than assumed.

The recommended operating model is therefore **script-first, skills-guided,
MCP-optional**. Ditching MCP entirely would save little because it is already
outside the product. Building a custom REST service to replace one optional
filesystem bridge would add more code and operating burden than it removes.

## What the post compares

The post treats four different layers as substitutes. They overlap, but they do
different jobs.

| Layer | What it is | Best use here |
|---|---|---|
| Script or CLI | A repeatable command with explicit inputs, outputs, and exit status | Builds, tests, source pulls, evidence generation, and review wrappers |
| Direct API or REST service | A programmatic interface to one known service | Tavily, Anthropic, GitHub, public data, and other fixed integrations |
| Skill | Instructions, metadata, and optional scripts or reference files loaded when relevant | Teaching an agent the monthly cycle, source rules, or review process |
| MCP | A standard AI-client protocol for discovering and invoking tools or reading resources | Optional selective file access across compatible external AI clients |

MCP can sit in front of a REST API, CLI, script, browser, or filesystem. A skill
can tell an agent when and how to use any of them. Replacing MCP with a direct
API can be simpler when one known client calls one known service, but it gives
up the cross-client tool discovery and invocation contract that MCP provides.

## Claim-by-claim assessment

| Claim in or implied by the post | Assessment | Reason |
|---|---|---|
| "MCP days are gone" | **Rejected** | The latest official specification is dated 2025-11-25, the project published a 2026 roadmap, and current OpenAI, Anthropic, GitHub, Microsoft, and Playwright products support it. That does not prove every MCP use is good, but it contradicts an ecosystem-wide end-of-life claim. |
| "Use Python or Bash around an API or CLI" | **Accepted as the default for this repo** | That is already how builds, tests, monitoring, evidence collection, and cross-AI review work. These paths are deterministic and version-controlled. |
| "Ditch MCP for good REST servers" | **Conditionally rejected** | Direct REST is simpler for one stable integration. It is not a drop-in replacement for local filesystem access or one adapter used by several AI clients. Building a new REST service for this repo would create an unnecessary hosted attack surface. |
| "Ditch MCP for skills" | **Rejected as a category error** | Skills package instructions and optional scripts. They still need an execution environment and access mechanism. Official Anthropic and MCP guidance describes skills as complementary to tools and MCP, not a universal replacement. |
| "Do not use Playwright MCP for research" | **Mostly accepted for this repo** | Microsoft now recommends Playwright CLI plus skills for high-throughput coding agents because it uses less model context. Microsoft still describes Playwright MCP as useful for persistent exploratory loops. Canada Under Carney already has Playwright CLI tests and evidence generation, so adding the MCP server would duplicate them. |
| "Be worried about MCP certification" | **Accepted as a warning about false trust signals** | No official MCP certification program was found in the official documentation checked on 2026-07-19. The official Registry verifies publisher namespaces and metadata, not server quality or safety. Its moderation policy explicitly permits buggy and vulnerable servers to remain listed. |

Absence of an official certification page is dated evidence, not proof that no
third party uses the word "certification" for a course, badge, or private
review.

## What current primary sources show

### MCP is active, but still maturing

The [latest MCP specification](https://modelcontextprotocol.io/specification/2025-11-25)
defines a current client-server protocol with capability negotiation, tools,
resources, prompts, and JSON-RPC messaging. The project's
[2026 roadmap](https://blog.modelcontextprotocol.io/posts/2026-mcp-roadmap/)
says its current priorities are transport scaling, agent communication,
governance, and enterprise readiness. The maintainers also acknowledge gaps in
stateful scaling, audit trails, SSO, gateway behaviour, and configuration
portability.

Current vendor support is broad:

- [OpenAI supports remote MCP servers in the Responses API](https://openai.com/index/new-tools-and-features-in-the-responses-api/).
- [Anthropic documents MCP across its API and Claude products](https://docs.anthropic.com/en/docs/mcp).
- [GitHub documents MCP across Copilot IDE, CLI, app, cloud-agent, and code-review surfaces](https://docs.github.com/en/copilot/concepts/context/mcp).
- [Microsoft maintains Playwright MCP](https://github.com/microsoft/playwright-mcp)
  while also publishing a Playwright agent CLI.

This is evidence of present support, not a forecast that MCP will remain the
winning standard.

### The strongest criticism is security and operating cost

Official MCP guidance does not present the protocol as automatically safe.

- The [security guidance](https://modelcontextprotocol.io/docs/tutorials/security/security_best_practices)
  describes local command execution, data loss, data exfiltration, DNS
  rebinding, session hijacking, confused-deputy problems, and overly broad
  scopes. It recommends local `stdio`, sandboxing, restricted filesystem and
  network access, explicit consent, and real authorization for HTTP servers.
- The [latest transport specification](https://modelcontextprotocol.io/specification/2025-11-25/basic/transports)
  defines `stdio` and Streamable HTTP as the two standard transports. It says
  local HTTP servers should bind to `127.0.0.1`, validate `Origin`, and use
  authentication. The older HTTP+SSE transport was replaced; separate SSE mode
  is now a compatibility path, not the modern default.
- The [official Registry](https://modelcontextprotocol.io/registry/about) is in
  preview, verifies namespace ownership rather than implementation safety, and
  delegates code scanning elsewhere. Its
  [moderation policy](https://modelcontextprotocol.io/registry/moderation-policy)
  says consumers should assume minimal moderation and that low-quality, buggy,
  or vulnerable servers are not generally removed.
- The [official reference-server security page](https://github.com/modelcontextprotocol/servers/security)
  says those servers are educational reference implementations, not
  production-ready solutions. It also records past high-severity path and
  symlink validation advisories.

MCP also has context and latency costs. The official
[client best-practices guide](https://modelcontextprotocol.io/docs/develop/clients/client-best-practices)
says naive clients can waste context on tool schemas and intermediate results.
It recommends progressive tool discovery and sandboxed programmatic tool
calling when tool counts become large. For this repo's one filesystem server,
that overhead is modest, but it is still unnecessary for deterministic CI
work.

### Playwright's own comparison supports a narrower MCP role

The [Playwright MCP project](https://github.com/microsoft/playwright-mcp#playwright-mcp-vs-playwright-cli)
says CLI plus skills is more token-efficient for coding agents, while MCP stays
useful for persistent state, rich introspection, exploratory automation,
self-healing tests, and long-running loops. The
[Playwright CLI capability guide](https://playwright.dev/agent-cli/capabilities)
says its CLI and MCP server share the same underlying tools.

That makes the choice for this dashboard straightforward:

- Use `npm run test:browser` and Playwright Test for reproducible checks.
- Use `npm run review:evidence` for screenshots, manifests, and a PDF packet.
- Use a browser-capable reviewer for scroll, focus, responsive layout, and
  interaction.
- Do not install Playwright MCP unless a future workflow specifically needs a
  persistent exploratory browser loop that the current browser tools cannot
  provide.

## What this repo actually uses

| Work | Current path | MCP involved? |
|---|---|---|
| React dashboard runtime | React and Vite in [`package.json`](../package.json) | No |
| Build and deploy | npm scripts and GitHub Actions in [`deploy.yml`](../.github/workflows/deploy.yml) | No |
| Browser regression | Playwright Test via `npm run test:browser` | No |
| Review screenshots and PDF | [`generate-review-evidence.mjs`](../scripts/generate-review-evidence.mjs) | No |
| Monthly source monitoring | Python, direct public endpoints, Tavily API, Anthropic API, and GitHub CLI in [`monthly-source-scout.yml`](../.github/workflows/monthly-source-scout.yml) | No |
| Claude adversarial review | [`claude-bridge.sh`](../scripts/claude-bridge.sh) | No |
| Repeatable AI operating methods | Repo-local skills in [`.claude/skills`](../.claude/skills) | No requirement |
| One-file external review handoff | [`build-bundle.sh`](../scripts/build-bundle.sh) | No |
| Held filesystem connector for Perplexity, Comet, or Claude Desktop | [`start-perplexity-filesystem-mcp.sh`](../scripts/start-perplexity-filesystem-mcp.sh) | Blocked pending the reopen gates below |

Removing MCP would therefore not change the live dashboard, scoring, source
monitor, browser tests, build, deployment, or normal Codex and Claude work. It
would only remove one optional way to hand repository context to an external
AI client.

## Repo-specific risk found during this review

### P0: the read-only snapshot protects integrity, not confidentiality

The pre-hold snapshot function in
[`start-perplexity-filesystem-mcp.sh`](../scripts/start-perplexity-filesystem-mcp.sh)
used `rsync` over the whole working directory and excluded only `.git`,
`node_modules`, `dist`, the snapshot itself, and `.DS_Store`. It then
removed write permission. That implementation was replaced by the blocking
guard in the same decision pass.

That means the snapshot includes ignored local-only files now, not only files
that might appear later. At the 2026-07-19 review point, `tmp/` alone was about
315 MB and contained hundreds of paths. The eligible copy included:

- most of `tmp/`, including a roughly 4 MB copy of the full tracked-file
  review bundle, session handoffs, review prompts, screenshots, and scratch
  scripts
- `scripts/output/` fetch and source-monitor output
- `test-results/` browser-test artifacts
- local personal-context files under `.claude/context/`
- `.identity-patterns`, which contains editor identity literals kept out of
  this public repo
- local `.mcp/*.json` files with machine-specific absolute paths

Read-only permissions prevent the reviewer from editing those files. They do
not prevent the reviewer or anyone reaching the tunnel from reading them.

The pre-hold remote connector compounded the issue:

- `--readonly-snapshot-tunnel` exposes the snapshot on a public URL.
- The documented secret-path workaround is an unguessable URL, not protocol
  authorization.
- The filesystem package is version-pinned, but `mcp-proxy` is launched through
  unpinned `npx -y`; neither MCP tool is installed through this repo's lockfile.
- Direct modes expose normal filesystem write, edit, and move tools. The
  [filesystem server README](https://github.com/modelcontextprotocol/servers/blob/main/src/filesystem/README.md)
  confirms those mutating tools are part of the server.

**Immediate hold:** do not use any launch mode in the current wrapper. The
launcher now exits non-zero instead of exposing the live tree, old snapshot, or
proxy. The setup guide no longer recommends direct, snapshot, HTTP, SSE, or
tunnel modes. Use the tracked-file bundle, targeted attachments, live browser
tab, and rendered evidence pack instead.

## Recommended target state

### Decision rule

1. If the job must be repeatable, testable, or run in CI, use a script, CLI, or
   direct API.
2. If the job needs reusable agent instructions, add or use a skill that calls
   the canonical script.
3. If one trusted external AI client needs repeated selective reads across many
   repo files and can launch a local `stdio` process, use a hardened read-only
   filesystem MCP adapter.
4. If the review is one-off or the client is remote-only, attach the minimum
   needed tracked files, the generated bundle, and/or the evidence packet.
5. If the job is a reproducible browser check, use Playwright Test or the
   Playwright CLI. Use MCP only for a proven persistent exploratory need.

### Keep

- npm, Python, Bash, direct APIs, and GitHub CLI as the production and
  operations source of truth.
- Repo-local skills as concise instructions around those canonical scripts.
- The option to design a local `stdio`, read-only MCP adapter if repeated
  selective-read work later demonstrates a need.
- The bundle and evidence pack as the remote-review fallback.

### Do not add

- A custom REST service for repository filesystem access.
- Playwright MCP for existing browser tests or routine UI review.
- MCP in the dashboard runtime, build, deploy, monitor, or scoring path.
- Any reliance on an MCP registry listing or third-party certificate as a
  security approval.

### Retire or block

- Every current direct, snapshot, HTTP, and tunnel launch mode.
- Public MCP tunnels without real authentication.
- Separate SSE instructions except as a clearly labelled legacy compatibility
  path.
- Runtime package fetching through unpinned `npx -y` where a retained tool can
  instead be locked and installed before use.

## Exact follow-up work and gates

### Immediate safety correction

1. The launcher blocks all connector modes and points reviewers to the bundle
   and evidence commands.
2. The setup guide removes the direct and tunnel recommendations, documents the
   present ignored-file exposure, and makes the bundle plus evidence workflow
   the default.
3. The bundle never dereferences tracked symlinks and reports untracked files in
   its dirty-state metadata without including them.
4. Existing connector templates remain historical references and should not be
   activated during the hold.

### Need-gated replacement only

Do not build a replacement simply to preserve an optional path. First record a
repeated review where selective local file reads provide a material advantage
over targeted attachments or the bundle. If that evidence appears:

1. Build the review snapshot from Git-tracked files plus explicitly allowed,
   non-ignored untracked files. Modified tracked files must remain visible.
2. Reject symlinks and special files unless a later design provides a safe,
   tested policy.
3. Keep the connector local and read-only over `stdio`.
4. Pin retained packages through a lockfile or an equivalently reviewable
   package-integrity mechanism. An exact `npx -y` version still fetches and
   executes upstream code on first use; version pinning alone is not integrity
   pinning.
5. Add a smoke test proving that modified tracked files are included while
   `.identity-patterns`, `.claude/context`, local `.mcp/*.json`, `.git`,
   `node_modules`, `dist`, `scripts/output`, `test-results`, and `tmp`
   are absent.

Filtering the snapshot would reduce exposure, but it would not remove the
upstream filesystem server from the trust boundary. Its path handling and
package integrity would remain part of the security decision.

### Gates

- The blocked launcher passes shell syntax and hold-behaviour checks.
- The bundle regression test proves tracked changes are included, untracked
  dirtiness is disclosed, symlinked files or ancestors cannot disclose external
  files, and generated copies must remain byte-for-byte identical.
- CI runs the review-handoff test, including every retired launcher mode, before
  building a deployable artifact.
- Any need-gated replacement passes its snapshot smoke test.
- A different AI reviews the risk analysis and proposed boundary.
- Any need-gated replacement proves local `stdio` read access against its
  filtered snapshot.
- Any external remote connector requires a fresh editor approval and an
  authenticated design. A secret URL alone does not pass this gate.
- No grade, threshold, formula, promise status, source stack, or dimension-model
  surface changes as part of this work.

## Different-AI review

Claude reviewed the memo and repo mechanism read-only in two passes on
2026-07-19.

- Round 1 returned **REVISE**. It found that the memo understated the present
  ignored-file exposure, the hold was not operative while setup text still
  recommended the tunnel, a replacement build was premature without measured
  need, and version pinning was being treated too closely to integrity pinning.
- The accepted fixes named the current exposure, replaced the launcher with a
  blocking guard, rewrote the setup guide around non-MCP review paths, made any
  replacement need-gated, and kept the upstream server inside the stated trust
  boundary.
- Round 2 returned **APPROVED** and confirmed that all first-round findings were
  closed. It also found two non-blocking stale references: the generated
  evidence prompt still mentioned MCP and bundle-size wording had drifted.
  Both were corrected in the same pass.

## Project-room record

### Source inventory

| Source | Role in the decision |
|---|---|
| Supplied LinkedIn screenshot | Exact claim under review; no linked evidence or full comment thread was available |
| MCP specification, architecture, transports, security guide, client guide, Registry, and 2026 roadmap | Current protocol scope, maturity, costs, and stated mitigations |
| OpenAI, Anthropic, GitHub, Microsoft, and Playwright official docs | Current vendor support and Playwright's own CLI-vs-MCP position |
| Official filesystem server README, release, and security page | Tool permissions, current pinned release, reference-server warning, and advisory history |
| Repo package, workflows, scripts, skills, bundle, and MCP setup | Actual dashboard dependency boundary and local risk mechanism |
| Parallel repo and ecosystem review agents | Independent evidence gathering; findings were checked against the primary sources and local files before inclusion |

### Conflict log

| Conflict | Resolution |
|---|---|
| Post says MCP is over; official projects and vendors actively support it | Treat the post as an opinion about workflow efficiency, not evidence of ecosystem end-of-life |
| Post presents REST, scripts, skills, and MCP as substitutes | Separate the layers; prefer scripts by default while retaining MCP only where its cross-client adapter role is useful |
| Repo setup calls direct filesystem mode recommended, but review guidance calls read-only safer | The direct recommendation is wrong for external review and should be removed |
| Read-only snapshot sounds safe, but it copies ignored files | Read-only protects against mutation, not disclosure; block the current implementation and rebuild only after a demonstrated need |
| MCP is selective, while the bundle is safer | Use the bundle for current remote and one-off review; keep a hardened local adapter as a future option only after repeated need is demonstrated |

### Missing context

- The original LinkedIn URL, complete comment thread, and any evidence the author
  used were not provided. The screenshot is enough to assess the quoted claim,
  not the author's broader argument.
- No official MCP certification program was found. This does not rule out
  third-party training or private review badges.
- Perplexity's exact current connector implementation and authentication roadmap
  were not independently tested in this pass.
- The repo does not record connector usage frequency, latency, token cost, or
  incidents, so the cost comparison is architectural rather than measured.
- No current workflow has demonstrated a need for persistent Playwright MCP
  browser state.

### Duplicates report

- MCP and the bundle can both deliver repo context. Keep the bundle active now
  and retain MCP only as a decision option because selective local reads and
  one-file remote handoff have different safety and context-cost profiles.
- Playwright Test, the evidence pack, and browser-capable review overlap, but
  each has a distinct role: deterministic regression, static visual evidence,
  and live interaction.
- Skills and scripts overlap in workflow names, but the skill should point to
  the script rather than copy its implementation.
- A custom REST filesystem service would duplicate the optional MCP adapter and
  should not be built.

## Revisit conditions

Revisit this decision if one of these becomes true:

- External AI clients stop supporting local `stdio` MCP and repeated selective
  repo reading remains necessary.
- Repeated reviews show that targeted files and the bundle are insufficient for
  selective repo reading.
- A remote client supports compatible authentication and shows a clear advantage
  over the bundle and evidence packet.
- A browser workflow proves it needs persistent exploratory state that current
  Playwright CLI and browser tools cannot provide.
- Measured review cost or context use contradicts the architectural comparison
  in this memo.
