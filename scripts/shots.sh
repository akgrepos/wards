#!/bin/bash
# scripts/shots.sh <outdir> <name...>
# Simulator screenshots with xcrun simctl only: for each name, saves light-<name>.png and dark-<name>.png at half size.
# Navigate to the screen first with the control tool (taps, Reload), then run this once per screen, e.g.
#   scripts/shots.sh docs/screenshots/2026-10-22-topic card
# It switches appearance to light, shoots, switches to dark, shoots, then restores light.
set -e
out="${1:?Usage: scripts/shots.sh <outdir> <name...>}"; shift
[ $# -ge 1 ] || { echo "Give at least one name"; exit 1; }
mkdir -p "$out"
for name in "$@"; do
  for mode in light dark; do
    xcrun simctl ui booted appearance "$mode"; sleep 2
    xcrun simctl io booted screenshot --type=png "$out/$mode-$name.png" >/dev/null 2>&1
    w=$(sips -g pixelWidth "$out/$mode-$name.png" | awk '/pixelWidth/{print $2}')
    sips --resampleWidth $((w / 2)) "$out/$mode-$name.png" >/dev/null
    echo "saved $out/$mode-$name.png"
  done
done
xcrun simctl ui booted appearance light
