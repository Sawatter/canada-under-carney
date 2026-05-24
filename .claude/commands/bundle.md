---
description: Regenerate the Perplexity / Comet review bundle and copy to ~/Downloads and ~/Desktop. The bundle is verbatim content of every git-tracked text file in the repo.
allowed-tools: Bash
---

Run the bundle generator:

```bash
npm run bundle
```

After it completes, confirm:

1. The script reports a single matching MD5 hash for all three copies.
2. Report the dashboard version, file count, line count, size, and git ref (including whether the working tree was dirty).
3. If the git ref shows "uncommitted changes", note explicitly that the bundle reflects the working tree, not HEAD — useful for handing review to Comet or Perplexity before commit.

If the script fails, surface the exact error. Do not attempt to patch the script or skip files.

Output path the user uploads to Comet / Perplexity: `~/Downloads/perplexity-bundle.md`.
