/* ============================================================
   Chrysa — Landing v2 interactions
   Aurora canvas · scroll reveal · counters · parallax · viz fills
   ============================================================ */
(function () {
  "use strict";

  /* ---------------- Aurora canvas ---------------- */
  const canvas = document.getElementById("bg-canvas");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    const SCALE = 0.32;                  // render small, CSS-blur up = cheap + organic
    let W = 0, H = 0;
    const blobs = [
      { hue: "#D9572E", r: 0.70, x: 0.20, y: 0.28, ax: 0.10, ay: 0.08, sx: 0.00018, sy: 0.00023, p: 0 },
      { hue: "#C9706B", r: 0.62, x: 0.82, y: 0.26, ax: 0.12, ay: 0.10, sx: 0.00021, sy: 0.00016, p: 1.7 },
      { hue: "#E0A766", r: 0.58, x: 0.64, y: 0.76, ax: 0.14, ay: 0.09, sx: 0.00015, sy: 0.00025, p: 3.1 },
      { hue: "#8E5560", r: 0.60, x: 0.14, y: 0.84, ax: 0.10, ay: 0.10, sx: 0.00019, sy: 0.00014, p: 4.4 },
      { hue: "#E6BE85", r: 0.46, x: 0.50, y: 0.42, ax: 0.16, ay: 0.12, sx: 0.00024, sy: 0.00019, p: 5.6 }
    ];
    function resize() {
      W = canvas.width = Math.max(2, Math.floor(window.innerWidth * SCALE));
      H = canvas.height = Math.max(2, Math.floor(window.innerHeight * SCALE));
    }
    resize();
    window.addEventListener("resize", resize);

    function hexA(hex, a) {
      const n = parseInt(hex.slice(1), 16);
      return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
    }
    let reduce = window.matchMedia("(prefers-reduced-motion:reduce)").matches;
    function draw(t) {
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "#140C09";
      ctx.fillRect(0, 0, W, H);
      ctx.globalCompositeOperation = "lighter";
      for (const b of blobs) {
        const cx = (b.x + Math.sin(t * b.sx + b.p) * b.ax) * W;
        const cy = (b.y + Math.cos(t * b.sy + b.p) * b.ay) * H;
        const rad = b.r * Math.min(W, H);
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, rad);
        g.addColorStop(0, hexA(b.hue, 0.52));
        g.addColorStop(0.45, hexA(b.hue, 0.20));
        g.addColorStop(1, hexA(b.hue, 0));
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(cx, cy, rad, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    if (reduce) { draw(8000); }
    else {
      let raf;
      const loop = (now) => { draw(now); raf = requestAnimationFrame(loop); };
      raf = requestAnimationFrame(loop);
      document.addEventListener("visibilitychange", () => {
        if (document.hidden) cancelAnimationFrame(raf);
        else raf = requestAnimationFrame(loop);
      });
    }
  }

  /* ---------------- Nav shrink ---------------- */
  const nav = document.querySelector(".nav");
  if (nav) {
    const onScroll = () => nav.classList.toggle("shrink", window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---------------- Reveal + viz fills + counters ---------------- */
  function fillViz(root) {
    if (root.matches && (root.matches(".pcard") || root.classList)) root.classList.add("in");
    root.querySelectorAll("[data-w]").forEach((el) => { el.style.width = el.getAttribute("data-w") + "%"; });  // width instant; scaleX driven by .in cascade
    root.querySelectorAll(".fgring[data-off]").forEach((el) => { el.style.strokeDashoffset = el.getAttribute("data-off"); });
  }
  function countUp(el) {
    const target = parseFloat(el.getAttribute("data-count"));
    const dec = parseInt(el.getAttribute("data-dec") || "0", 10);
    const prefix = el.getAttribute("data-prefix") || "";
    const suffix = el.getAttribute("data-suffix") || "";
    const dur = 1500, t0 = performance.now();
    function tick(now) {
      const p = Math.min(1, (now - t0) / dur);
      const e = 1 - Math.pow(1 - p, 3);
      const val = target * e;
      el.textContent = prefix + val.toLocaleString("en-US", { minimumFractionDigits: dec, maximumFractionDigits: dec }) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  const io = ("IntersectionObserver" in window) ? new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      const el = en.target;
      el.classList.add("in");
      fillViz(el);
      el.querySelectorAll("[data-count]").forEach(countUp);
      if (el.hasAttribute("data-count")) countUp(el);
      io.unobserve(el);
    });
  }, { threshold: 0.18, rootMargin: "0px 0px -8% 0px" }) : null;

  const watched = document.querySelectorAll(".reveal, [data-count], .statband-inner, .pcard");
  if (io) watched.forEach((el) => io.observe(el));
  else watched.forEach((el) => { el.classList.add("in"); fillViz(el); el.querySelectorAll("[data-count]").forEach(countUp); });

  // hero product card fills on load (above the fold)
  const pcard = document.querySelector(".pcard");
  if (pcard) setTimeout(() => { pcard.classList.add("in"); fillViz(pcard); }, 350);

  /* ---------------- Hero card parallax ---------------- */
  const stage = document.querySelector(".hero-stage");
  const card = document.querySelector(".pcard");
  if (stage && card && !window.matchMedia("(prefers-reduced-motion:reduce)").matches && window.innerWidth > 900) {
    stage.addEventListener("pointermove", (e) => {
      const r = stage.getBoundingClientRect();
      const dx = (e.clientX - r.left) / r.width - 0.5;
      const dy = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `rotateY(${-13 + dx * 14}deg) rotateX(${7 - dy * 12}deg) translateZ(0)`;
    });
    stage.addEventListener("pointerleave", () => {
      card.style.transform = "rotateY(-13deg) rotateX(7deg)";
    });
  }

  /* ---------------- Toast + email ---------------- */
  let toastTimer;
  function toast(msg) {
    let el = document.querySelector(".toast");
    if (!el) { el = document.createElement("div"); el.className = "toast"; document.body.appendChild(el); }
    el.textContent = msg;
    requestAnimationFrame(() => el.classList.add("show"));
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("show"), 2800);
  }
  document.querySelectorAll("form.email-pill").forEach((f) => {
    f.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = f.querySelector("input");
      const v = (input.value || "").trim();
      if (!v || !/.+@.+\..+/.test(v)) { toast("Enter a valid email"); return; }
      input.value = "";
      if (window.MarcAuth) { window.MarcAuth.open({ email: v }); return; }
      toast("You're on the list — welcome to Chrysa.");
    });
  });
})();
