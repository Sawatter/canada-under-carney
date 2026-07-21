#!/usr/bin/env bash
# build-bundle.sh — Regenerate the Perplexity / Comet review bundle.
#
# Concatenates every regular git-tracked text file in the repo into a single
# markdown document. Skips binaries (images, fonts, archives), does not
# dereference symlinks, and excludes the bundle output itself. Includes the
# working-tree content of tracked files, so uncommitted tracked changes are
# captured.
#
# Output:
#   tmp/perplexity-bundle.md  (project, gitignored)
#   ~/Downloads/perplexity-bundle.md  (for upload to Comet / Perplexity)
#   ~/Desktop/perplexity-bundle.md    (best-effort backup)
#
# Usage:
#   bash scripts/build-bundle.sh
#   npm run bundle
#
# The bundle is several MB and tens of thousands of lines. Comet and Perplexity Pro
# both accept it as a single .md upload. Drop into the chat, then paste
# the standard review prompt.

set -euo pipefail

verify_identical_copies() {
  if [ "$#" -lt 2 ]; then
    echo "Usage: $0 --verify-copies <source> <copy> [copy ...]" >&2
    return 2
  fi

  local source="$1"
  shift
  local copy
  for copy in "$@"; do
    if ! cmp -s -- "${source}" "${copy}"; then
      echo "Bundle copy differs from source: ${copy}" >&2
      return 1
    fi
  done
}

if [ "${1:-}" = "--verify-copies" ]; then
  shift
  verify_identical_copies "$@"
  exit
fi

has_symlinked_ancestor() {
  local path="$1"
  local parent="${path%/*}"

  [ "${parent}" = "${path}" ] && return 1
  while [ -n "${parent}" ] && [ "${parent}" != "." ]; do
    [ -L "${parent}" ] && return 0
    case "${parent}" in
      */*) parent="${parent%/*}" ;;
      *) break ;;
    esac
  done
  return 1
}

# Anchor to repo root regardless of cwd
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
cd "${REPO_ROOT}"

OUT="tmp/perplexity-bundle.md"
mkdir -p tmp

VERSION=$(python3 -c "import json; print(json.load(open('src/data/meta.json'))['version'])")
LAST_UPDATED=$(python3 -c "import json; print(json.load(open('src/data/meta.json'))['lastUpdated'])")
GEN_DATE=$(date '+%Y-%m-%d %H:%M %Z')

# Get git short hash and dirty status for transparency
GIT_REF=$(git rev-parse --short HEAD 2>/dev/null || echo "no-git")
GIT_DIRTY=""
if [ -n "$(git status --porcelain --untracked-files=normal 2>/dev/null)" ]; then
  GIT_DIRTY=" (working tree has uncommitted or untracked changes — bundle reflects tracked working-tree files, not HEAD)"
fi

# File-type extensions to skip (binaries, derived)
SKIP_EXT_REGEX='\.(png|jpg|jpeg|gif|ico|pdf|zip|woff|woff2|ttf|otf|eot|svg)$'
# Files to explicitly skip (auto-generated, recursive, lock files)
SKIP_FILE_REGEX='^(public/visitor-count\.json|public/rss\.xml|tmp/perplexity-bundle\.md|package-lock\.json)$'

# Build the bundle
{
  echo '# CANADA UNDER CARNEY — FULL REPO BUNDLE'
  echo
  echo "Generated: ${GEN_DATE}"
  echo "Dashboard version: ${VERSION}"
  echo "meta.json lastUpdated: ${LAST_UPDATED}"
  echo "Git ref: ${GIT_REF}${GIT_DIRTY}"
  echo 'Live URL: https://sawatter.github.io/canada-under-carney/'
  echo 'Repo: https://github.com/Sawatter/canada-under-carney'
  echo
  echo 'This bundle contains the working-tree content of regular git-tracked'
  echo 'text files. Tracked symlinks are listed but never dereferenced.'
  echo 'Untracked files are not included and must be attached separately.'
  echo 'Binary files (images, fonts, SVG icons) and auto-generated files'
  echo '(visitor count, RSS feed, lock files) are excluded.'
  echo
  echo '---'
  echo
  echo '# TABLE OF CONTENTS'
  echo
  git ls-files \
    | grep -v -E "${SKIP_EXT_REGEX}" \
    | grep -v -E "${SKIP_FILE_REGEX}" \
    | sort \
    | awk '{print "- " $0}'
  echo
  echo '---'
  echo

  # Concatenate each file with a clear header and a code fence
  TOTAL=0
  while IFS= read -r f; do
    if [ -L "$f" ]; then
      TOTAL=$((TOTAL + 1))
      echo
      echo "## FILE: ${f}"
      echo
      echo '```text'
      echo "Tracked symlink (not dereferenced): $(readlink "$f")"
      echo '```'
      continue
    fi
    if has_symlinked_ancestor "$f"; then
      TOTAL=$((TOTAL + 1))
      echo
      echo "## FILE: ${f}"
      echo
      echo '```text'
      echo 'Tracked path skipped because a parent directory is a symlink.'
      echo '```'
      continue
    fi
    [ -f "$f" ] || continue
    TOTAL=$((TOTAL + 1))
    echo
    echo "## FILE: ${f}"
    echo
    # Pick a code fence language from extension for syntax hinting
    case "${f##*.}" in
      js|mjs)   FENCE='js'   ;;
      jsx)      FENCE='jsx'  ;;
      json)     FENCE='json' ;;
      md)       FENCE=''     ;;
      css)      FENCE='css'  ;;
      html|xsl) FENCE='html' ;;
      sh)       FENCE='bash' ;;
      py)       FENCE='python' ;;
      yml|yaml) FENCE='yaml' ;;
      *)        FENCE=''     ;;
    esac
    echo '```'"${FENCE}"
    cat "$f"
    # ensure code fence on its own line even if file lacks trailing newline
    echo ''
    echo '```'
  done < <(git ls-files \
            | grep -v -E "${SKIP_EXT_REGEX}" \
            | grep -v -E "${SKIP_FILE_REGEX}" \
            | sort)

  echo
  echo '---'
  echo
  echo "## END OF BUNDLE"
  echo
  echo "Files included: see Table of Contents above."
  echo "Generated by scripts/build-bundle.sh."
} > "${OUT}"

# Copy to common upload locations. Downloads is the primary handoff location;
# Desktop is only a convenience backup and may be blocked by local permissions.
cp "${OUT}" "${HOME}/Downloads/perplexity-bundle.md"
COPIES=("${OUT}" "${HOME}/Downloads/perplexity-bundle.md")
DESKTOP_COPY="${HOME}/Desktop/perplexity-bundle.md"
if cp "${OUT}" "${DESKTOP_COPY}" 2>/dev/null; then
  COPIES+=("${DESKTOP_COPY}")
else
  DESKTOP_COPY=""
fi

# Report
LINES=$(wc -l < "${OUT}" | tr -d ' ')
SIZE=$(du -h "${OUT}" | awk '{print $1}')
FILES_IN=$(git ls-files | grep -v -E "${SKIP_EXT_REGEX}" | grep -v -E "${SKIP_FILE_REGEX}" | wc -l | tr -d ' ')

echo "Bundle generated: ${OUT}"
echo "  Dashboard version: ${VERSION}"
echo "  Files included:    ${FILES_IN}"
echo "  Lines:             ${LINES}"
echo "  Size:              ${SIZE}"
echo "  Git ref:           ${GIT_REF}${GIT_DIRTY}"
echo ""
echo "Copies:"
for copy in "${COPIES[@]:1}"; do
  echo "  ${copy}"
done
if [ -z "${DESKTOP_COPY}" ]; then
  echo "  ${HOME}/Desktop/perplexity-bundle.md (skipped: permission denied or Desktop unavailable)"
fi
echo ""
echo "Verify generated copies identical:"
verify_identical_copies "${COPIES[@]}"
echo "  byte-for-byte match"
echo ""
echo "Checksums:"
if command -v md5 >/dev/null 2>&1; then
  md5 -q "${COPIES[@]}"
elif command -v md5sum >/dev/null 2>&1; then
  md5sum "${COPIES[@]}"
else
  shasum -a 256 "${COPIES[@]}"
fi
