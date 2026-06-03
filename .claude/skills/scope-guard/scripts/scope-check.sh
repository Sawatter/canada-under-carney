#!/usr/bin/env bash
set -euo pipefail

echo "== Scope guard =="

echo "1. Running data + frozen-surface tests"
npm run test:data

echo
echo "2. Checking dimension model"
node - <<'NODE'
const fs = require('fs');
const dims = JSON.parse(fs.readFileSync('src/data/dimensions.json', 'utf8'));
const trackers = dims.filter((d) => d.excludeFromGPA);
const graded = dims.filter((d) => !d.excludeFromGPA);
const promise = dims.find((d) => d.id === 'promise-delivery' || d.name === 'Promise Delivery');
console.log(`Dimensions: ${dims.length} (expected 12)`);
console.log(`Graded: ${graded.length} (expected 11)`);
console.log(`Trackers: ${trackers.length} (expected 1)`);
if (dims.length !== 12 || graded.length !== 11 || trackers.length !== 1) {
  process.exit(1);
}
if (!promise || !promise.excludeFromGPA || promise.grade) {
  console.error('Promise Delivery tracker invariant failed');
  process.exit(1);
}
console.log('Promise Delivery tracker invariant OK');
NODE

echo
echo "3. Checking frozen-surface diff markers"
if git rev-parse --verify origin/main >/dev/null 2>&1; then
  frozen_range="origin/main...HEAD"
else
  frozen_range="HEAD"
fi
echo "Frozen-surface diff range: ${frozen_range}"
if git diff "${frozen_range}" -- src/utils.js src/constants.js src/data/dimensions.json docs/Scoring-Rubric-v1.1.md \
  | grep -E "(gpaToGrade|calculateOverallGPA|calculatePocketbookGPA|gpaPointsForGrade|POCKETBOOK_DIMS|GRADES|thresholds|modifierRules|modifierEffects|penalty|\"band\"[[:space:]]*:|scoring\\.thresholds)" \
  > /tmp/cuc-scope-guard-frozen-diff.txt; then
  echo "Potential frozen-surface changes found:"
  head -40 /tmp/cuc-scope-guard-frozen-diff.txt
  echo "Stop unless the current turn has explicit editor approval."
  exit 1
else
  echo "No frozen-surface diff markers found."
fi

echo
echo "4. Checking staged whitespace"
git diff --cached --check

echo
echo "5. Running staged personal-identifier scan"
# Universal patterns (absolute local paths + emails) are inline. Editor-identity
# patterns (name, city) live in the gitignored .identity-patterns so those
# literals never enter this public repo; they are merged in if the file exists.
root=$(git rev-parse --show-toplevel 2>/dev/null || echo .)
scan_re='(/Users/[A-Za-z]|/home/[A-Za-z]|@[A-Za-z0-9._%+-]+\.[A-Za-z]{2,})'
if [ -f "$root/.identity-patterns" ]; then
  extra=$(paste -sd'|' "$root/.identity-patterns")
  [ -n "$extra" ] && scan_re="${scan_re%)}|${extra})"
fi
if git diff --cached -G "$scan_re" -- '*.md' '*.js' '*.jsx' '*.json' '*.css' '*.sh' > /tmp/cuc-scope-guard-personal.txt; then
  if [ -s /tmp/cuc-scope-guard-personal.txt ]; then
    echo "Potential personal-identifier matches found in staged diff:"
    cat /tmp/cuc-scope-guard-personal.txt
    exit 1
  fi
fi
echo "No staged personal-identifier matches."

echo
echo "Scope guard passed."
