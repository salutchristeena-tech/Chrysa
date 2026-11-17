#!/bin/sh
# Builds the PUBLIC website into site-dist/ and zips it for a Netlify drag-and-drop deploy.
# Only the files the website needs are included. Setup notes, schema files, edge-function
# source, duplicates and build leftovers stay out of the live site.
# Netlify runs this on every push to main and publishes only site-dist/ (see netlify.toml).
set -eu
cd "$(dirname "$0")/.."
rm -rf site-dist
mkdir -p site-dist
for f in index.html checkout.html auth.js auth.css site.css \
         privacy.html terms.html data-deletion.html netlify.toml _redirects; do
  cp "$f" site-dist/
done
# Brand images (the chrysa mascot). The old marc/ demo files and emblem are no longer used.
cp -R brand site-dist/brand
# On Netlify (NETLIFY=true) the build stops here and Netlify publishes site-dist/.
# Locally it also makes a zip, handy for a manual upload.
if [ "${NETLIFY:-}" = "true" ]; then
  echo "Built site-dist/ ($(find site-dist -type f | wc -l | tr -d ' ') files) for Netlify"
  exit 0
fi
zip_path="${1:-$HOME/Desktop/chrysa-site-$(date +%Y-%m-%d).zip}"
rm -f "$zip_path"
(cd site-dist && zip -qr "$zip_path" .)
echo "Built site-dist/ ($(find site-dist -type f | wc -l | tr -d ' ') files) and $zip_path"
