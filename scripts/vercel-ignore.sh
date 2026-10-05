#!/bin/sh
# Étape « Ignored Build Step » de Vercel : code 0 = ne pas construire, 1 = construire.
# Ignore uniquement les commits qui ne touchent que la documentation (relais du portage Roblox).
base="${VERCEL_GIT_PREVIOUS_SHA:-HEAD~1}"
files=$(git diff --name-only "$base" HEAD 2>/dev/null) || exit 1
[ -z "$files" ] && exit 1
for f in $files; do
  case "$f" in
    *.md|docs/*|vercel.json|scripts/vercel-ignore.sh) ;;
    *) exit 1 ;;
  esac
done
exit 0
