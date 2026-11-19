// Shared timing helpers for the Chrysa film series.
// Every film exposes window.render(t) so render.js can capture it frame by frame.
// Add ?v to the URL for the 9:16 layout (laid out at 864x1536, rendered at 1.25x).
const $ = id => document.getElementById(id);
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const seg = (t, a, b) => clamp((t - a) / (b - a));
const lerp = (a, b, p) => a + (b - a) * p;
const eio = p => p < .5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
const eout = p => 1 - Math.pow(1 - p, 3);
const eout5 = p => 1 - Math.pow(1 - p, 5);
const back = p => { const c1 = 1.55, c3 = c1 + 1; return 1 + c3 * Math.pow(p - 1, 3) + c1 * Math.pow(p - 1, 2); };

const V = new URLSearchParams(location.search).has('v');
if (V) document.documentElement.classList.add('v');
const SW = V ? 864 : 1920, SH = V ? 1536 : 1080;

function vis(el, on) { el.style.visibility = on ? 'visible' : 'hidden'; }
function fade(el, p, dy = 24, blur = 14) {
  el.style.opacity = p;
  el.style.filter = `blur(${(1 - p) * blur}px)`;
  el.style.transform = `translateY(${(1 - p) * dy}px)`;
}
function typeOn(el, text, t, start, rate) {
  const n = Math.floor(clamp((t - start) / rate, 0, text.length));
  el.textContent = text.slice(0, n);
  return n;
}
// Panel that slides in from one side and out the other. dir: 'up' | 'left' | 'right'
function panel(el, t, a, b, inDir = 'right', outDir = 'left', dur = 0.35) {
  const pin = eio(seg(t, a, a + dur)), pout = eio(seg(t, b, b + dur));
  const off = d => d === 'up' ? [0, SH] : d === 'down' ? [0, -SH] : d === 'right' ? [SW, 0] : [-SW, 0];
  const [ix, iy] = off(inDir), [ox, oy] = off(outDir);
  el.style.transform = `translate(${(1 - pin) * ix + pout * ox}px, ${(1 - pin) * iy + pout * oy}px)`;
  vis(el, t > a && t < b + dur);
}
function makeConfetti(canvas, n, seed) {
  canvas.width = SW; canvas.height = SH;
  let s = seed; const R = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
  const cols = ['#C98F34', '#41628F', '#7A3B2B', '#93A18E', '#E8C77E', '#A5BCD6', '#E2603A'];
  const ps = [];
  for (let i = 0; i < n; i++) ps.push({ x: R() * SW, y: -30 - R() * 500, vx: (R() - .5) * 260, vy: 380 + R() * 480, r: R() * 6.28, vr: (R() - .5) * 10, w: 10 + R() * 10, h: 16 + R() * 14, c: cols[i % cols.length] });
  return dt => {
    const g = canvas.getContext('2d'); g.clearRect(0, 0, SW, SH);
    if (dt < 0 || dt > 1.8) return;
    const f = 1 - seg(dt, 1.2, 1.8);
    ps.forEach(p => {
      g.save(); g.globalAlpha = f;
      g.translate(p.x + p.vx * dt, p.y + p.vy * dt + 140 * dt * dt); g.rotate(p.r + p.vr * dt);
      g.fillStyle = p.c; g.fillRect(-p.w / 2, -p.h / 2, p.w, p.h * Math.abs(Math.cos(p.r + dt * 6)));
      g.restore();
    });
  };
}
// Closing card: wordmark types in, mascot pops, then the line and the address.
function endCard(t, a) {
  vis($('end'), t >= a);
  typeOn($('endWord'), 'Chrysa', t, a, 0.075);
  const lp = seg(t, a + 0.5, a + 1.0);
  const img = $('endImg');
  img.style.width = lerp(0, 104, eout5(lp)) + 'px';
  img.style.marginRight = lerp(0, 18, eout5(lp)) + 'px';
  img.style.opacity = lp;
  img.style.transform = `scale(${lerp(0.4, 1, back(lp))}) rotate(${(1 - eout(lp)) * -14}deg)`;
  fade($('endSub'), eout(seg(t, a + 0.8, a + 1.2)), 14);
  fade($('endUrl'), eout(seg(t, a + 1.05, a + 1.45)), 10);
}
function boot(render, dur) {
  window.render = render;
  window.__ready = document.fonts.ready
    .then(() => Promise.all([...document.images].map(i => i.complete ? 1 : new Promise(r => { i.onload = r; }))))
    .then(() => render(0));
  if (!navigator.webdriver) {
    const t0 = performance.now();
    (function loop() { window.__ready.then(() => render(((performance.now() - t0) / 1000) % (dur + 0.5))); requestAnimationFrame(loop); })();
  }
}
