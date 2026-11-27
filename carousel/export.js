// Exports carousel.html to a LinkedIn-ready PDF (one 1080x1350 page per slide)
// and, optionally, a PNG of each slide.
//   node export.js [pngDir]
const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const pngDir = process.argv[2];
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1080, height: 1350 }, deviceScaleFactor: 1 });
  await p.goto('file://' + path.resolve(__dirname, 'carousel.html'));
  await p.evaluate(() => document.fonts.ready);
  await p.pdf({ path: path.resolve(__dirname, 'chrysa-linkedin-carousel.pdf'), width: '1080px', height: '1350px', printBackground: true, margin: { top: 0, right: 0, bottom: 0, left: 0 } });
  if (pngDir) {
    const slides = await p.$$('.slide');
    for (let i = 0; i < slides.length; i++) await slides[i].screenshot({ path: path.join(pngDir, `slide${i + 1}.png`) });
  }
  await b.close();
})();
