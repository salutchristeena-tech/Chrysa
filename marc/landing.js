/* MarC — Landing interactions: hero video crossfade, reveal, forms */
(function () {
  /* ---- fade helper (rAF, no CSS transition) ---- */
  function fade(el, from, to, dur, done) {
    const t0 = performance.now();
    el.style.opacity = String(from);
    function step(now) {
      const p = Math.min(1, (now - t0) / dur);
      el.style.opacity = String(from + (to - from) * p);
      if (p < 1) requestAnimationFrame(step);
      else if (done) done();
    }
    requestAnimationFrame(step);
  }

  /* ---- hero video: seamless crossfade-to-black loop ---- */
  const hero = document.querySelector(".hero-video");
  if (hero) {
    let fadingOut = false, started = false;
    function start() {
      if (started) return; started = true;
      const p = hero.play(); if (p && p.catch) p.catch(() => {});
      fade(hero, 0, 1, 500);
    }
    hero.addEventListener("canplay", start, { once: true });
    hero.addEventListener("timeupdate", () => {
      if (!hero.duration) return;
      if (hero.duration - hero.currentTime <= 0.55 && !fadingOut) {
        fadingOut = true;
        fade(hero, parseFloat(hero.style.opacity || "1"), 0, 500);
      }
    });
    hero.addEventListener("ended", () => {
      hero.style.opacity = "0";
      setTimeout(() => {
        hero.currentTime = 0;
        const p = hero.play(); if (p && p.catch) p.catch(() => {});
        fadingOut = false;
        fade(hero, 0, 1, 500);
      }, 100);
    });
    /* fallback if canplay never fires (autoplay blocked / slow net) */
    setTimeout(() => { if (!started) { started = true; fade(hero, 0, 1, 500); } }, 1600);
  }

  /* ---- reveal on scroll (rect-based, robust) ---- */
  const reveals = [].slice.call(document.querySelectorAll(".reveal"));
  function checkReveals() {
    const vh = window.innerHeight || document.documentElement.clientHeight || 800;
    for (const el of reveals) {
      if (el.classList.contains("in")) continue;
      const r = el.getBoundingClientRect();
      if (r.top < vh * 0.9 && r.bottom > 0) {
        const d = parseInt(el.getAttribute("data-delay") || "0", 10);
        if (d) el.style.transitionDelay = d + "ms";
        el.classList.add("in");
      }
    }
  }
  window.addEventListener("scroll", checkReveals, { passive: true });
  window.addEventListener("resize", checkReveals);
  window.addEventListener("load", checkReveals);
  checkReveals();
  setTimeout(() => reveals.forEach((el) => el.classList.add("in")), 2600);

  /* ---- email capture ---- */
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
      toast("You're subscribed — welcome to MarC.");
    });
  });
})();
