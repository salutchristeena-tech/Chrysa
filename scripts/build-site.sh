#!/bin/sh
# Builds the PUBLIC website into site-dist/ and zips it for a Netlify drag-and-drop deploy.
# Only the files the website needs are included. Setup notes, schema files, edge-function
# source, duplicates and build leftovers stay out of the live site.
# Changes nothing online: upload the zip yourself in Netlify (Deploys -> drag and drop).
set -eu
cd "$(dirname "$0")/.."
rm -rf site-dist
mkdir -p site-dist
for f in index.html checkout.html auth.js auth.css landing2.css \
         privacy.html terms.html data-deletion.html netlify.toml _redirects; do
  cp "$f" site-dist/
done
# Only the assets the public pages use. The demo dashboard (dashboard.html, marc/dashboard.*,
# marc/connect.*) and the old demo app (marc/index.html, app.js, data.js, styles.css, *.jsx)
# are hidden until the real app opens at app.chrysa.ai.
mkdir -p site-dist/marc
for f in chrysa-emblem.png landing2.css landing2.js landing3.css story.css story.js image-slot.js; do
  cp "marc/$f" site-dist/marc/
done
cp -R marc/img site-dist/marc/img
zip_path="${1:-$HOME/Desktop/chrysa-site-$(date +%Y-%m-%d).zip}"
rm -f "$zip_path"
(cd site-dist && zip -qr "$zip_path" .)
echo "Built site-dist/ ($(find site-dist -type f | wc -l | tr -d ' ') files) and $zip_path"
