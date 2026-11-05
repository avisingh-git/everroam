# batch-web.ps1
$Src     = "P:\randotron\everroam-site\pre_processing"                    # folder with your source videos
$Out     = "P:\randotron\everroam-site\media"         # your site's media/ folder
$TrimSec = 0            # 0 = keep full clip, else trim to N seconds (heroes: 12–20)
$CRF     = 20           # 18 = visually lossless, 20 = sweet spot, 23 = lighter
$Preset  = "veryslow"   # run once, ignore the wait
$Tune    = "film"       # landscape/travel footage; "grain" if very noisy

New-Item -ItemType Directory -Force -Path $Out | Out-Null
$exts = '.mp4','.mov','.m4v','.mkv','.webm','.avi','.mts','.m2ts','.wmv'

Get-ChildItem -Path $Src -Recurse -File |
  Where-Object { $exts -contains $_.Extension.ToLower() } |
  ForEach-Object {
    $in   = $_.FullName
    $base = $_.BaseName

    # probe once — first line only, force ints
    $lines = (& ffprobe -v error -select_streams v:0 `
              -show_entries stream=width,height -of csv=p=0:s=x $in | Out-String).Trim() -split "`r?`n"
    $dims  = $lines[0] -split 'x'
    $w     = [int]$dims[0]
    $h     = [int]$dims[1]
    $portrait = $h -gt $w

    Write-Host "`n=== $($_.Name)  (${w}x${h}) ===" -ForegroundColor Cyan
    $trim = if ($TrimSec -gt 0) { @('-t', "$TrimSec") } else { @() }

    foreach ($r in @(@{n='1080'; max=1920}, @{n='720'; max=1280})) {
      # cap the LONG edge — portrait and landscape both handled
      $vf = if ($portrait) { "scale=w=-2:h='min($($r.max),ih)':flags=lanczos" }
            else          { "scale=w='min($($r.max),iw)':h=-2:flags=lanczos" }

      $dst = Join-Path $Out "$base-$($r.n).mp4"
      & ffmpeg -hide_banner -loglevel warning -y -i $in @trim -vf $vf `
        -c:v libx264 -preset $Preset -tune $Tune -crf $CRF -pix_fmt yuv420p `
        -movflags +faststart -an $dst

      if (Test-Path $dst) {
        $mb = [math]::Round((Get-Item $dst).Length / 1MB, 1)
        Write-Host "    $($r.n): ${mb} MB  ->  $base-$($r.n).mp4" -ForegroundColor Green
      } else { Write-Host "    $($r.n): FAILED" -ForegroundColor Red }
    }

    # alias so existing card code (media/{slug}.mp4) keeps working
    Copy-Item "$Out\$base-1080.mp4" "$Out\$base.mp4" -Force -ErrorAction SilentlyContinue

    # poster from the 1080 rendition
    & ffmpeg -hide_banner -loglevel error -y -ss 00:00:02 -i "$Out\$base-1080.mp4" `
      -frames:v 1 -q:v 3 "$Out\$base-poster.jpg"
  }