// Renders launch.html frame by frame. Usage:
//   node render.js <outDir> [fps=30] [scale=2] [start=0] [end=19] [v]   (v = 9:16 portrait)
// Set FILM=film2.html (or film3.html) to render another film in the series.
// Then encode with ffmpeg (see README.md in this folder).
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  const out = process.argv[2] || 'frames';
  const fps = +(process.argv[3] || 30);
  const scale = +(process.argv[4] || 2);
  const start = +(process.argv[5] || 0);
  const end = +(process.argv[6] || 19);
  const vert = process.argv[7] === 'v';
  fs.mkdirSync(out, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: vert ? { width: 864, height: 1536 } : { width: 1920, height: 1080 }, deviceScaleFactor: vert ? scale * 1.25 : scale });
  await page.goto('file://' + path.resolve(__dirname, process.env.FILM || 'launch.html') + (vert ? '?v' : ''));
  await page.evaluate(() => window.__ready);
  const n = Math.round((end - start) * fps);
  for (let i = 0; i < n; i++) {
    const t = start + i / fps;
    await page.evaluate((t) => window.render(t), t);
    await page.screenshot({ path: path.join(out, `f${String(i).padStart(4, '0')}.png`) });
    if (i % 60 === 0) console.log(`frame ${i}/${n}`);
  }
  await browser.close();
})();
