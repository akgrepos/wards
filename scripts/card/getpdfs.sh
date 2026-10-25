#!/bin/zsh
# getpdfs.sh: downloads PDF sources named in a urls file and converts them to text. Usage: getpdfs.sh urls.txt outdir
mkdir -p "$2"
while IFS=$'\t' read -r label url; do
  case "$url" in
    *.pdf*) curl -sL -A "Mozilla/5.0" -o "$2/$label.pdf" "$url" && swift "$(dirname $0)/pdftext.swift" "$2/$label.pdf" "$2/$label.txt" && echo "$label ok" ;;
  esac
done < "$1"
