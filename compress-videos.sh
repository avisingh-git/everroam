#!/usr/bin/env bash
# compress-videos.sh: Compress videos in-place to under 25MB.
# Usage: bash ./compress-videos.sh ./media

set -euo pipefail

media_dir=${1:-.}

[[ -d $media_dir ]] || { echo "Folder not found: $media_dir" >&2; exit 1; }

command -v ffmpeg >/dev/null 2>&1 || { echo "ffmpeg not found." >&2; exit 1; }
command -v ffprobe >/dev/null 2>&1 || { echo "ffprobe not found." >&2; exit 1; }

target_mb=23.5 

# Use native bash file matching instead of the external 'find' command
shopt -s nullglob nocaseglob
files=("$media_dir"/*.mp4 "$media_dir"/*.mov "$media_dir"/*.mkv "$media_dir"/*.webm)

if (( ${#files[@]} == 0 )); then
  echo "No videos found in $media_dir. (Check your folder path!)"
  exit 0
fi

for f in "${files[@]}"; do
  filename=$(basename "$f")
  
  # Check if already under 24MB
  size_bytes=$(wc -c < "$f")
  if (( size_bytes < 24000000 )); then
    echo "Skipping $filename (Already under 24MB)."
    continue
  fi
  
  echo "--- Compressing: $filename ---"
  
  duration=$(ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "$f")
  
  if [[ -z $duration || $duration == "N/A" ]]; then
    echo "Skipping: Could not read duration."
    continue
  fi
  
  total_bitrate_k=$(awk -v dur="$duration" -v mb="$target_mb" 'BEGIN { printf "%d", (mb * 8192) / dur }')
  video_bitrate_k=$((total_bitrate_k - 128))
  
  if (( video_bitrate_k < 100 )); then
    echo "Warning: Video is very long. Output quality will be extremely low."
    video_bitrate_k=100
  fi
  
  temp_out="${f%.*}_temp.mp4"
  final_out="${f%.*}.mp4"
  
  # 2-Pass Encoding
  ffmpeg -y -v error -stats -i "$f" -c:v libx264 -b:v "${video_bitrate_k}k" -pass 1 -an -f null -
  ffmpeg -y -v error -stats -i "$f" -c:v libx264 -b:v "${video_bitrate_k}k" -pass 2 -c:a aac -b:a 128k "$temp_out"
  
  if [[ -f "$temp_out" ]]; then
    if [[ "$f" != "$final_out" ]]; then
       rm -f "$f"
    fi
    mv -f "$temp_out" "$final_out"
    echo "Successfully replaced with under-25MB version: $(basename "$final_out")"
  fi
done

rm -f ffmpeg2pass-0.log ffmpeg2pass-0.log.mbtree
echo "Done! All videos in $media_dir are now under 25MB."