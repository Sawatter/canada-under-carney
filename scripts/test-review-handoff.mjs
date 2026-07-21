import assert from "node:assert/strict";
import {
  chmodSync,
  cpSync,
  existsSync,
  mkdtempSync,
  mkdirSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

const root = mkdtempSync(join(tmpdir(), "cuc-review-handoff-"));
const repo = join(root, "repo");
const home = join(root, "home");

function runResult(command, args, cwd = repo, env = process.env) {
  return spawnSync(command, args, { cwd, env, encoding: "utf8" });
}

function run(command, args, cwd = repo, env = process.env) {
  const result = runResult(command, args, cwd, env);
  assert.equal(result.status, 0, `${command} ${args.join(" ")} failed:\n${result.stderr || result.stdout}`);
  return result.stdout;
}

try {
  mkdirSync(join(repo, "scripts"), { recursive: true });
  mkdirSync(join(repo, "src", "data"), { recursive: true });
  mkdirSync(join(repo, "nested"), { recursive: true });
  mkdirSync(join(home, "Downloads"), { recursive: true });
  mkdirSync(join(home, "Desktop"), { recursive: true });

  cpSync(join(process.cwd(), "scripts", "build-bundle.sh"), join(repo, "scripts", "build-bundle.sh"));
  cpSync(
    join(process.cwd(), "scripts", "start-perplexity-filesystem-mcp.sh"),
    join(repo, "scripts", "start-perplexity-filesystem-mcp.sh"),
  );
  writeFileSync(join(repo, "src", "data", "meta.json"), '{"version":"test","lastUpdated":"2026-07-21"}\n');
  writeFileSync(join(repo, "tracked.md"), "committed content\n");
  writeFileSync(join(repo, "nested", "tracked.md"), "committed nested content\n");
  writeFileSync(join(root, "outside-secret.txt"), "DO_NOT_DISCLOSE\n");
  symlinkSync("../outside-secret.txt", join(repo, "tracked-link.md"));

  run("git", ["init", "-q"]);
  run("git", ["config", "user.email", "review-handoff"]);
  run("git", ["config", "user.name", "Review Handoff Test"]);
  run("git", ["add", "."]);
  run("git", ["commit", "-qm", "fixture"]);

  writeFileSync(join(repo, "tracked.md"), "modified tracked content\n");
  writeFileSync(join(repo, "untracked-only.md"), "untracked content\n");
  const outsideDirectory = join(root, "outside-directory");
  mkdirSync(outsideDirectory);
  writeFileSync(join(outsideDirectory, "tracked.md"), "DO_NOT_DISCLOSE_ANCESTOR\n");
  rmSync(join(repo, "nested"), { recursive: true });
  symlinkSync(outsideDirectory, join(repo, "nested"), "dir");

  run("bash", ["scripts/build-bundle.sh"], repo, { ...process.env, HOME: home });

  const bundle = readFileSync(join(repo, "tmp", "perplexity-bundle.md"), "utf8");
  assert.match(bundle, /working tree has uncommitted or untracked changes/);
  assert.match(bundle, /modified tracked content/);
  assert.match(bundle, /## FILE: tracked-link\.md/);
  assert.match(bundle, /Tracked symlink \(not dereferenced\): \.\.\/outside-secret\.txt/);
  assert.match(bundle, /## FILE: nested\/tracked\.md/);
  assert.match(bundle, /parent directory is a symlink/);
  assert.doesNotMatch(bundle, /DO_NOT_DISCLOSE/);
  assert.doesNotMatch(bundle, /DO_NOT_DISCLOSE_ANCESTOR/);
  assert.doesNotMatch(bundle, /## FILE: untracked-only\.md/);

  const downloadCopy = readFileSync(join(home, "Downloads", "perplexity-bundle.md"), "utf8");
  assert.equal(downloadCopy, bundle);
  const desktopCopy = readFileSync(join(home, "Desktop", "perplexity-bundle.md"), "utf8");
  assert.equal(desktopCopy, bundle);

  const verifySource = join(root, "verify-source.md");
  const verifyCopy = join(root, "verify-copy.md");
  writeFileSync(verifySource, "same\n");
  writeFileSync(verifyCopy, "same\n");
  run("bash", ["scripts/build-bundle.sh", "--verify-copies", verifySource, verifyCopy]);
  writeFileSync(verifyCopy, "different\n");
  const mismatch = runResult("bash", ["scripts/build-bundle.sh", "--verify-copies", verifySource, verifyCopy]);
  assert.equal(mismatch.status, 1);
  assert.match(mismatch.stderr, /differs from source/);

  const fakeBin = join(root, "fake-bin");
  const npxMarker = join(root, "npx-called");
  mkdirSync(fakeBin);
  writeFileSync(join(fakeBin, "npx"), '#!/bin/sh\nprintf called > "$MCP_TEST_NPX_MARKER"\nexit 99\n');
  chmodSync(join(fakeBin, "npx"), 0o755);
  const launcherEnv = {
    ...process.env,
    MCP_TEST_NPX_MARKER: npxMarker,
    PATH: `${fakeBin}:${process.env.PATH}`,
  };
  const blockedModes = [
    [],
    ["--print-config"],
    ["--print-readonly-config"],
    ["--print-http-config"],
    ["--print-sse-config"],
    ["--prepare-readonly-snapshot"],
    ["--readonly-snapshot"],
    ["--http"],
    ["--readonly-snapshot-http"],
    ["--tunnel"],
    ["--readonly-snapshot-tunnel"],
  ];
  for (const args of blockedModes) {
    const result = runResult("bash", ["scripts/start-perplexity-filesystem-mcp.sh", ...args], repo, launcherEnv);
    assert.equal(result.status, 2, `launcher mode ${args[0] || "<default>"} did not stay blocked`);
    assert.match(result.stderr, /filesystem MCP is paused/);
  }
  for (const mode of ["--help", "-h", "--status"]) {
    const result = runResult("bash", ["scripts/start-perplexity-filesystem-mcp.sh", mode], repo, launcherEnv);
    assert.equal(result.status, 0, `launcher information mode ${mode} failed`);
    assert.match(result.stdout, /filesystem MCP is paused/);
  }
  assert.equal(existsSync(npxMarker), false, "blocked launcher invoked npx");

  console.log("Review-handoff tests passed (bundle disclosure boundary, copy equality, and launcher hold).");
} finally {
  rmSync(root, { recursive: true, force: true });
}
