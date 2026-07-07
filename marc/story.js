/* ============================================================
   Chrysa — Product story scroll scrubber
   Maps scroll position within .story-track to an active step index,
   crossfading the big background line, the browser mockup panel,
   and the foreground caption together.
   ============================================================ */
(function () {
  "use strict";
  const track = document.querySelector(".story-track");
  const stage = document.querySelector(".story-stage");
  if (!track || !stage) return;

  const bigtexts = Array.from(document.querySelectorAll(".story-bigtext .sbt"));
  const panels = Array.from(document.querySelectorAll(".win-panel"));
  const caps = Array.from(document.querySelectorAll(".story-caption .cap"));
  const curEl = document.querySelector(".story-progress .cur");
  const steps = bigtexts.length || 1;
  const reduce = window.matchMedia("(prefers-reduced-motion:reduce)").matches;

  let raf = null;
  function apply(idx) {
    [bigtexts, panels, caps].forEach((group) => {
      group.forEach((el) => {
        el.classList.toggle("active", Number(el.dataset.i) === idx);
      });
    });
    if (curEl) curEl.textContent = String(idx + 1).padStart(2, "0");
  }

  function update() {
    raf = null;
    const rect = track.getBoundingClientRect();
    const vh = window.innerHeight;
    const total = rect.height - vh;
    let p = total > 0 ? (-rect.top) / total : 0;
    p = Math.max(0, Math.min(1, p));
    const idx = Math.max(0, Math.min(steps - 1, Math.round(p * (steps - 1))));
    apply(idx);
  }

  function onScroll() {
    if (!raf) raf = requestAnimationFrame(update);
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  update();
  if (reduce) apply(0);
})();
