#!/usr/bin/env bash
# rename-media.sh: copy a folder of photos into the site's media folder with the names the site expects.
#
#   ./rename-media.sh [-n] [-r] [-t] SOURCE_FOLDER PREFIX [MEDIA_FOLDER]
#
#   PREFIX         strip        -> strip-1.jpg ... strip-16.jpg      (landing photo strip, 16 photos)
#                  bike-strip   -> bike-strip-1.jpg ... -8.jpg       (bike landing strip, 8 photos)
#                  group        -> group-1.jpg ... group-8.jpg       (crews carousel, 8 photos)
#                  tawang, bhutan, anini, tawang-bike ... -> tawang-1.jpg ... -4.jpg (trip galleries, 4 photos)
#   MEDIA_FOLDER   where to put them (default: ./media)
#   -n  dry run: only show what would be copied where
#   -r  shrink to max 1600 px and recompress (needs ImageMagick 'magick'), good for phones
#   -t  number by file date (oldest first) instead of by file name
#
# Your originals are never touched: files are copied. Needs bash 4+ and GNU find (Git Bash or WSL on Windows).
set -euo pipefail

resize=0; bytime=0; dry=0
while getopts "rtn" o; do
  case $o in r) resize=1 ;; t) bytime=1 ;; n) dry=1 ;; *) exit 1 ;; esac
done
shift $((OPTIND - 1))
src=${1:-}; prefix=${2:-}; dest=${3:-./media}
if [[ -z $src || -z $prefix ]]; then sed -n '2,15p' "$0"; exit 1; fi
[[ -d $src ]] || { echo "Folder not found: $src" >&2; exit 1; }

IM=""; command -v magick >/dev/null 2>&1 && IM=magick
if (( resize )) && [[ -z $IM ]]; then echo "ImageMagick ('magick') not found, copying without resizing." >&2; resize=0; fi

kinds=( \( -iname '*.jpg' -o -iname '*.jpeg' -o -iname '*.png' -o -iname '*.webp' -o -iname '*.heic' \) )
if (( bytime )); then
  mapfile -d '' -t files < <(find "$src" -maxdepth 1 -type f "${kinds[@]}" -printf '%T@ %p\0' | sort -z -n | cut -z -d' ' -f2-)
else
  mapfile -d '' -t files < <(find "$src" -maxdepth 1 -type f "${kinds[@]}" -print0 | sort -z -V)
fi

case $prefix in
  strip) want=16 ;; bike-strip|group) want=8 ;; tawang|bhutan|anini|*-bike) want=4 ;; *) want=0 ;;
esac
if (( want > 0 && ${#files[@]} != want )); then
  echo "Heads up: '$prefix' normally has $want photos but this folder has ${#files[@]}." >&2
fi

n=0
for f in "${files[@]}"; do
  n=$((n + 1)); out="$dest/$prefix-$n.jpg"; ext=${f##*.}; ext=${ext,,}
  if (( dry )); then echo "$(basename "$f")  ->  $out"; continue; fi
  mkdir -p "$dest"
  if [[ -n $IM ]] && { (( resize )) || [[ $ext != jpg && $ext != jpeg ]]; }; then
    "$IM" "$f" -auto-orient -strip -resize '1600x1600>' -quality 78 "$out"
  elif [[ $ext == jpg || $ext == jpeg ]]; then
    cp -f -- "$f" "$out"
  else
    echo "Skipped (needs ImageMagick to convert .$ext): $f" >&2; n=$((n - 1)); continue
  fi
  echo "$(basename "$f")  ->  $prefix-$n.jpg"
done
(( dry )) && echo "(dry run, nothing copied)" || echo "Done: $n photos in $dest"
