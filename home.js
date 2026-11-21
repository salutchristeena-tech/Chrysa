/* chrysa homepage behaviour: opening, reveals, product views, the free check form, billing.
   No dependencies. Every block fails safe: if one part breaks, the page still reads and works. */
(function () {
  "use strict";
  window.__chrysaHome = true;
  var html = document.documentElement;
  var reduced = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }

  /* ---------- reveals ---------- */
  var revealed = false;
  function startReveals() {
    if (revealed) return; revealed = true;
    var els = $$(".rv");
    if (!("IntersectionObserver" in window)) { els.forEach(function (e) { e.classList.add("in"); }); return; }
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.08, rootMargin: "0px 0px -6% 0px" });
    els.forEach(function (e) { io.observe(e); });
  }

  /* ---------- opening ---------- */
  (function intro() {
    var veil = $("#intro");
    if (!veil) { startReveals(); return; }
    // A tab opened in the background waits, then plays the first time it is looked at
    // (unless the visitor has already scrolled into the page).
    if (html.getAttribute("data-intro") === "pending") {
      startReveals();
      var onVis = function () {
        if (document.visibilityState !== "visible") return;
        document.removeEventListener("visibilitychange", onVis);
        html.removeAttribute("data-intro");
        if (scrollY > 40) return;
        html.classList.add("intro");
        play();
      };
      document.addEventListener("visibilitychange", onVis);
      return;
    }
    if (!html.classList.contains("intro")) { startReveals(); return; }
    play();

    function play() {
      var done = false, timer;
      function finish(fast) {
        if (done) return; done = true; clearTimeout(timer);
        try { localStorage.setItem("chrysa-intro", String(Date.now())); } catch (e) {}
        veil.classList.add("leaving"); if (fast) veil.classList.add("fast");
        // Let the page breathe in as the veil lifts.
        setTimeout(function () { html.classList.remove("intro"); startReveals(); }, fast ? 120 : 380);
        setTimeout(function () { if (veil.parentNode) veil.parentNode.removeChild(veil); }, fast ? 600 : 1100);
        removeEventListener("keydown", onKey); removeEventListener("wheel", onSkip); removeEventListener("touchmove", onSkip);
      }
      function onKey(e) { if (e.key === "Escape" || e.key === "Enter" || e.key === " " || e.key === "ArrowDown" || e.key === "PageDown") { e.preventDefault(); finish(true); } }
      function onSkip() { finish(true); }
      $("#intro-skip").addEventListener("click", function () { finish(true); });
      addEventListener("keydown", onKey);
      addEventListener("wheel", onSkip, { passive: true });
      addEventListener("touchmove", onSkip, { passive: true });
      timer = setTimeout(function () { finish(false); }, 4200);
    }
  })();

  /* ---------- Chrysa's faces ---------- */
  var Face = (function () {
    var avs = $$(".av");
    // Each Chrysa blinks on its own rhythm.
    avs.forEach(function (a) { a.style.setProperty("--bd", (-Math.random() * 5.6).toFixed(2) + "s"); });
    function set(a, face) {
      if (!a || a.dataset.face === face) return;
      a.dataset.face = face;
      var u = a.querySelector("use"); if (u) u.setAttribute("href", "#face-" + face);
      if (!reduced) { a.classList.remove("swap"); void a.offsetWidth; a.classList.add("swap"); }
    }
    // Curious faces follow the pointer with their eyes (fine pointers only).
    var lookers = $$(".av[data-look]");
    if (lookers.length && !reduced && window.matchMedia && matchMedia("(pointer:fine)").matches) {
      var px = 0, py = 0, raf = 0;
      var update = function () {
        raf = 0;
        lookers.forEach(function (a) {
          var r = a.getBoundingClientRect();
          if (r.bottom < -50 || r.top > innerHeight + 50) return;
          var dx = px - (r.left + r.width * 0.65), dy = py - (r.top + r.height * 0.45);
          var d = Math.sqrt(dx * dx + dy * dy) || 1, k = Math.min(1, d / 260);
          a.style.setProperty("--lx", (dx / d * 13 * k).toFixed(1) + "px");
          a.style.setProperty("--ly", (dy / d * 9 * k).toFixed(1) + "px");
        });
      };
      addEventListener("pointermove", function (e) { px = e.clientX; py = e.clientY; if (!raf) raf = requestAnimationFrame(update); }, { passive: true });
    }
    return { set: set };
  })();

  /* ---------- nav ---------- */
  var nav = $("#nav");
  function onScroll() { nav && nav.classList.toggle("scrolled", scrollY > 8); }
  addEventListener("scroll", onScroll, { passive: true }); onScroll();

  /* Every "free check" link lands on the form with the cursor in the first field. */
  $$("[data-to-check]").forEach(function (a) {
    a.addEventListener("click", function (e) {
      var target = $("#reading"), input = $("#rf-site");
      if (!target || !input) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
      if (history.replaceState) history.replaceState(null, "", "#reading");
      setTimeout(function () { try { input.focus({ preventScroll: true }); } catch (x) { input.focus(); } }, reduced ? 0 : 650);
    });
  });

  /* ---------- hero: the note that shows what the check does ---------- */
  (function note() {
    var lines = $$("#note-lines span"); if (lines.length < 2 || reduced) return;
    var i = 0;
    setInterval(function () {
      if (document.hidden) return;
      lines[i].classList.remove("on"); i = (i + 1) % lines.length; lines[i].classList.add("on");
    }, 2800);
  })();

  /* ---------- hero: the mascot leans gently toward the pointer ---------- */
  (function lean() {
    var m = $("#hero-mascot");
    if (!m || reduced || !(window.matchMedia && matchMedia("(pointer:fine)").matches)) return;
    var tx = 0, ty = 0, x = 0, y = 0, raf = 0;
    function tick() {
      x += (tx - x) * 0.08; y += (ty - y) * 0.08;
      m.style.transform = "translate3d(" + x.toFixed(2) + "px," + y.toFixed(2) + "px,0) rotate(" + (x / 6).toFixed(2) + "deg)";
      raf = Math.abs(tx - x) > 0.05 || Math.abs(ty - y) > 0.05 ? requestAnimationFrame(tick) : 0;
    }
    addEventListener("pointermove", function (e) {
      var r = m.getBoundingClientRect();
      if (r.bottom < 0 || r.top > innerHeight) return;
      tx = Math.max(-10, Math.min(10, (e.clientX - (r.left + r.width / 2)) / 40));
      ty = Math.max(-6, Math.min(6, (e.clientY - (r.top + r.height / 2)) / 60));
      if (!raf) raf = requestAnimationFrame(tick);
    }, { passive: true });
  })();

  /* ---------- product views (accessible tabs) ---------- */
  (function tabs() {
    var list = $("[role=tablist]"); if (!list) return;
    var tabs = $$("[role=tab]", list);
    var side = $$(".screen-side [data-side]");
    function select(t, focus) {
      tabs.forEach(function (x) {
        var on = x === t, p = document.getElementById(x.getAttribute("aria-controls"));
        x.setAttribute("aria-selected", on ? "true" : "false");
        x.tabIndex = on ? 0 : -1;
        if (!p) return;
        if (on) { p.hidden = false; p.classList.remove("enter"); void p.offsetWidth; p.classList.add("enter"); }
        else { p.hidden = true; p.classList.remove("enter"); }
      });
      var key = t.id.replace(/^t-/, "");
      Face.set($("#peek"), { check: "curious", presence: "delighted", approvals: "wink", ask: "thinking" }[key] || "curious");
      side.forEach(function (s) { s.classList.toggle("on", s.dataset.side === key); });
      if (focus) t.focus();
    }
    tabs.forEach(function (t, i) {
      t.addEventListener("click", function () { select(t); });
      t.addEventListener("keydown", function (e) {
        var n = e.key === "ArrowRight" ? i + 1 : e.key === "ArrowLeft" ? i - 1 : e.key === "Home" ? 0 : e.key === "End" ? tabs.length - 1 : null;
        if (n === null) return; e.preventDefault(); select(tabs[(n + tabs.length) % tabs.length], true);
      });
    });
    side.forEach(function (s) { s.classList.toggle("on", s.dataset.side === "check"); });
  })();

  /* ---------- the free AI visibility check ---------- */
  (function check() {
    var READING_API = "https://app.chrysa.ai/api/reading";
    var form = $("#reading-form"); if (!form) return;
    var alertBox = $("#rf-error"), btn = $("#rf-submit"), lbl = btn.querySelector(".lbl");
    function site(v) {
      v = (v || "").trim(); if (!v) return null;
      if (!/^https?:\/\//i.test(v)) v = "https://" + v;
      try { var u = new URL(v); return /\./.test(u.hostname) ? u.origin + u.pathname.replace(/\/$/, "") : null; } catch (e) { return null; }
    }
    function fieldError(input, msg) {
      var err = document.getElementById(input.id + "-err");
      input.setAttribute("aria-invalid", msg ? "true" : "false");
      if (err) err.textContent = msg || "";
    }
    function busy(on) {
      btn.disabled = on;
      lbl.textContent = on ? "Starting your check…" : "Check my visibility";
      var arr = btn.querySelector(".arr, .spin");
      if (arr) arr.className = on ? "spin" : "arr", arr.textContent = on ? "" : "→";
    }
    var perch = $("#perch");
    form.addEventListener("focusin", function () { if (!btn.disabled) Face.set(perch, "reading"); });
    form.addEventListener("focusout", function () { setTimeout(function () { if (!btn.disabled && !form.contains(document.activeElement)) Face.set(perch, "curious"); }, 0); });
    // Clear a field's error as soon as it is corrected.
    ["rf-site", "rf-name", "rf-email"].forEach(function (id) {
      var i = document.getElementById(id);
      i.addEventListener("input", function () { if (i.getAttribute("aria-invalid") === "true") fieldError(i, ""); });
    });
    form.addEventListener("submit", function (e) {
      e.preventDefault(); alertBox.hidden = true;
      var f = function (n) { return form.elements[n]; };
      if (f("company_hp").value) return; // bot trap
      var url = site(f("site").value), name = f("name").value.trim(), email = f("email").value.trim();
      var first = null;
      fieldError(f("site"), url ? "" : "Enter your website, for example yourbrand.com."); if (!url) first = first || f("site");
      fieldError(f("name"), name ? "" : "Enter your name."); if (!name) first = first || f("name");
      var okEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      fieldError(f("email"), okEmail ? "" : "Enter a valid work email."); if (!okEmail) first = first || f("email");
      if (first) { first.focus(); return; }
      var rival = f("rival").value.trim();
      var data = { at: new Date().toISOString(), name: name, email: email, company: url, role: "", teamSize: "", regions: "",
        challenge: "Free AI visibility check" + (rival ? " | loses to: " + rival : ""), method: "free_reading" };
      try { if (window.MarcAuth && window.MarcAuth.save) window.MarcAuth.save(data); } catch (x) {}
      busy(true); Face.set(perch, "thinking");
      function saved() { // the check service could not be reached: the request is still in the sign-up list
        form.hidden = true;
        var done = $("#reading-done"); done.hidden = false;
        $("#rf-done-text").textContent = "We have your request for " + url.replace(/^https?:\/\//, "") + ". We’ll write to " + email + " shortly.";
      }
      fetch(READING_API, { method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ site: url, name: name, email: email, rival: rival }) })
        .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { return { status: r.status, body: j }; }); })
        .then(function (res) {
          if (res.status === 201 && res.body && res.body.link) {
            form.hidden = true; $("#reading-done").hidden = false;
            setTimeout(function () { location.href = res.body.link; }, reduced ? 0 : 700);
            return;
          }
          busy(false); Face.set(perch, "reading");
          if (res.status >= 500) { saved(); return; }
          alertBox.textContent = (res.body && res.body.message) || "Something went wrong. Please try again.";
          alertBox.hidden = false;
        })
        .catch(function () { busy(false); saved(); });
    });
  })();

  /* ---------- billing period ---------- */
  (function billing() {
    var wrap = $("#pricing .billing"); if (!wrap) return;
    var btns = $$("button[data-bill]", wrap);
    function set(b) {
      btns.forEach(function (x) { var on = x.dataset.bill === b; x.classList.toggle("on", on); x.setAttribute("aria-pressed", on ? "true" : "false"); });
      var k = b === "year" ? "y" : "m";
      $$("#pricing [data-m]").forEach(function (el) { el.textContent = el.dataset[k]; });
      $$("#pricing [data-plan-link]").forEach(function (a) {
        var u = new URL(a.getAttribute("href"), location.href); u.searchParams.set("bill", b);
        a.setAttribute("href", "checkout.html" + u.search);
      });
      try { localStorage.setItem("chrysa-bill", b); } catch (e) {}
    }
    btns.forEach(function (x) { x.addEventListener("click", function () { set(x.dataset.bill); }); });
    var saved = null; try { saved = localStorage.getItem("chrysa-bill"); } catch (e) {}
    set(saved === "year" ? "year" : "month");
  })();

  var yr = $("#yr"); if (yr) yr.textContent = String(new Date().getFullYear());
})();
