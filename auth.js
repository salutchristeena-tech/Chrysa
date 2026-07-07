/* ============================================================
   Chrysa — Auth / sign-up module
   - openSignup(): full early-access form → stores → thank-you → enter demo
   - gates pages with <body data-require-auth> until session exists
   - writes to Supabase (if configured) AND localStorage, with a fallback
     HTTP endpoint as a third option. Sign-ups are never lost.
   ============================================================ */
(function () {
  /* ────────────────────────────────────────────────────────────
     SUPABASE  ▸ paste your two values from Supabase → Project
     Settings → API.  The anon key is safe in front-end code.
     Leave both "" to store locally only.
     ──────────────────────────────────────────────────────────── */
  const SUPABASE_URL  = "https://vjmwdantethceolpexyk.supabase.co";   // Project URL
  const SUPABASE_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZqbXdkYW50ZXRoY2VvbHBleHlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI3MTQxMzksImV4cCI6MjA5ODI5MDEzOX0.fxxprUsmwZYj6LAr4vNzA0ngpU4YKTlRMn13uwVL87g";   // anon / public key
  const SUPABASE_TABLE = "signups";

  // ▸ Optional fallback: a Formspree / Tally / webhook URL.
  const SIGNUP_ENDPOINT = "";

  const LS_SIGNUPS = "marc.signups";
  const LS_SESSION = "marc.session";

  const supabaseReady = () => SUPABASE_URL && SUPABASE_ANON;

  // maps the in-app camelCase record → snake_case table columns
  function toRow(d) {
    return {
      name: d.name, email: d.email, company: d.company, role: d.role,
      team_size: d.teamSize, regions: d.regions, challenge: d.challenge,
      method: d.method, created_at: d.at
    };
  }

  async function sendToSupabase(data) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${SUPABASE_TABLE}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": SUPABASE_ANON,
        "Authorization": `Bearer ${SUPABASE_ANON}`,
        "Prefer": "return=minimal"
      },
      body: JSON.stringify(toRow(data))
    });
    if (!res.ok) throw new Error("Supabase insert failed: " + res.status);
  }

  const EMBLEM_SRC = /\/marc\//.test(location.pathname) ? "chrysa-emblem.png" : "marc/chrysa-emblem.png";
  const MONO = '<img src="' + EMBLEM_SRC + '" alt="Chrysa" style="width:100%;height:100%;object-fit:contain;display:block;">';

  const read = (k, fb) => { try { return JSON.parse(localStorage.getItem(k)) ?? fb; } catch { return fb; } };
  const hasSession = () => { try { return !!localStorage.getItem(LS_SESSION); } catch { return false; } };

  function persist(data) {
    // 1) localStorage — instant, never lost, powers the gate + CSV export
    try {
      const all = read(LS_SIGNUPS, []);
      all.push(data);
      localStorage.setItem(LS_SIGNUPS, JSON.stringify(all));
      localStorage.setItem(LS_SESSION, JSON.stringify({ email: data.email, name: data.name, at: data.at }));
    } catch {}
    // 2) Supabase — the real database (fire-and-forget; fallback on error)
    if (supabaseReady()) {
      sendToSupabase(data).catch((err) => {
        console.warn("[Chrysa] Supabase write failed, kept locally:", err.message);
        if (SIGNUP_ENDPOINT) postFallback(data);
      });
    } else if (SIGNUP_ENDPOINT) {
      postFallback(data);
    }
  }

  function postFallback(data) {
    try {
      fetch(SIGNUP_ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }).catch(() => {});
    } catch {}
  }

  function exportCSV() {
    const rows = read(LS_SIGNUPS, []);
    if (!rows.length) { alert("No sign-ups stored yet."); return; }
    const cols = ["at", "name", "email", "company", "role", "teamSize", "regions", "challenge", "method"];
    const esc = (v) => `"${String(v == null ? "" : v).replace(/"/g, '""')}"`;
    const csv = [cols.join(",")].concat(rows.map(r => cols.map(c => esc(r[c])).join(","))).join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = "chrysa-signups.csv";
    document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(a.href);
  }

  const GOOGLE = '<svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.5 12.2c0-.7-.1-1.4-.2-2H12v3.8h5.9a5 5 0 0 1-2.2 3.3v2.7h3.6c2.1-2 3.2-4.9 3.2-7.8z"/><path fill="#34A853" d="M12 23c2.9 0 5.4-1 7.2-2.7l-3.6-2.7c-1 .7-2.3 1.1-3.6 1.1-2.8 0-5.1-1.9-6-4.4H2.3v2.8A11 11 0 0 0 12 23z"/><path fill="#FBBC05" d="M6 14.3a6.6 6.6 0 0 1 0-4.2V7.3H2.3a11 11 0 0 0 0 9.8L6 14.3z"/><path fill="#EA4335" d="M12 5.5c1.6 0 3 .5 4.1 1.6l3.1-3.1A11 11 0 0 0 2.3 7.3L6 10.1c.9-2.6 3.2-4.6 6-4.6z"/></svg>';
  const LINKEDIN = '<svg width="18" height="18" viewBox="0 0 24 24"><rect x="1" y="1" width="22" height="22" rx="3" fill="#0A66C2"/><path fill="#fff" d="M7.1 9.2H4.6V19h2.5V9.2zM5.85 8.1a1.45 1.45 0 1 0 0-2.9 1.45 1.45 0 0 0 0 2.9zM19.4 13.6c0-2.9-1.55-4.6-3.85-4.6-1.35 0-2.25.62-2.75 1.5V9.2H10.3V19h2.5v-5.1c0-1.35.63-2.15 1.8-2.15 1.1 0 1.75.72 1.75 2.15V19h2.55v-5.4z"/></svg>';

  /* ── OAuth via Supabase Auth (Google · LinkedIn) ──────────────
     Works once the provider is enabled in Supabase → Authentication
     → Providers (see SUPABASE-SETUP.md, Part C). Redirects back to
     this page; the return is handled below in handleOAuthReturn(). */
  function signInWithOAuth(provider) {
    const note = scrim && scrim.querySelector(".marc-note");
    if (!supabaseReady() || location.protocol === "file:" || !/^https?:$/.test(location.protocol)) {
      if (note) { note.textContent = "Social sign-in isn't available in this preview — continue with email, or test on the live site."; note.style.display = "block"; }
      return;
    }
    const redirect = location.origin + location.pathname + location.search;
    location.href = SUPABASE_URL + "/auth/v1/authorize?provider=" + encodeURIComponent(provider) +
      "&redirect_to=" + encodeURIComponent(redirect);
  }

  async function handleOAuthReturn() {
    const h = location.hash && location.hash.slice(1);
    if (!h || (h.indexOf("access_token=") < 0 && h.indexOf("error") < 0)) return;
    const params = new URLSearchParams(h);
    try { history.replaceState(null, "", location.pathname + location.search); } catch {}

    const errd = params.get("error_description") || params.get("error");
    if (errd) {
      open({ gate: document.body.hasAttribute("data-require-auth") && !hasSession() });
      const note = scrim.querySelector(".marc-note");
      note.textContent = "Sign-in failed: " + errd.replace(/\+/g, " ") + ". You can continue with email below.";
      note.style.display = "block";
      return;
    }

    const token = params.get("access_token");
    if (!token) return;
    try {
      const res = await fetch(SUPABASE_URL + "/auth/v1/user", {
        headers: { "apikey": SUPABASE_ANON, "Authorization": "Bearer " + token }
      });
      if (!res.ok) throw new Error("user lookup failed: " + res.status);
      const u = await res.json();
      const meta = u.user_metadata || {};
      const data = {
        at: new Date().toISOString(),
        name: (meta.full_name || meta.name || (u.email || "").split("@")[0] || "").trim(),
        email: (u.email || meta.email || "").trim(),
        company: "", role: "", teamSize: "", regions: "", challenge: "",
        method: (u.app_metadata && u.app_metadata.provider) || "oauth"
      };
      const returning = read(LS_SIGNUPS, []).some((r) => r.email && r.email === data.email);
      if (returning) {
        try { localStorage.setItem(LS_SESSION, JSON.stringify({ email: data.email, name: data.name, at: data.at })); } catch {}
      } else {
        persist(data);
      }
      open({});
      showThanks(scrim.querySelector(".marc-auth-card"), data, document.body.hasAttribute("data-require-auth"));
    } catch (e) {
      console.warn("[Chrysa] OAuth sign-in could not complete:", e.message);
    }
  }

  let scrim = null;

  function close() {
    if (!scrim) return;
    scrim.classList.remove("show");
    setTimeout(() => { if (scrim) { scrim.remove(); scrim = null; } }, 280);
  }

  function open(opts) {
    opts = opts || {};
    if (scrim) { scrim.remove(); scrim = null; }
    const gate = !!opts.gate;
    const prefillEmail = typeof opts === "string" ? opts : (opts.email || "");

    scrim = document.createElement("div");
    scrim.className = "marc-auth-scrim";
    scrim.innerHTML = `
      <div class="marc-auth-card" role="dialog" aria-modal="true" aria-label="Sign up for Chrysa">
        <div class="marc-auth-head">
          <div class="marc-auth-chip">${MONO}</div>
          ${gate ? "" : '<button class="marc-auth-x" aria-label="Close">&times;</button>'}
        </div>
        <p class="marc-auth-eyebrow">${gate ? "Invite-only access" : "Request early access"}</p>
        <h2 class="marc-auth-title">${gate ? "Create your <em>Chrysa</em> access" : "Get early access to <em>Chrysa</em>"}</h2>
        <p class="marc-auth-sub">The AI command center for modern marketing. Tell us a little about your brand and step straight into the live workspace.</p>

        <div class="marc-socials">
          <button class="marc-google" type="button" data-oauth="google">${GOOGLE}<span>Continue with Google</span></button>
          <button class="marc-google" type="button" data-oauth="linkedin_oidc">${LINKEDIN}<span>Continue with LinkedIn</span></button>
        </div>
        <div class="marc-or">or</div>

        <form class="marc-form" novalidate>
          <div class="marc-field"><label>Full name</label><input name="name" type="text" placeholder="Your name"><span class="err">Please add your name</span></div>
          <div class="marc-field"><label>Company / group</label><input name="company" type="text" placeholder="Your brand or company"></div>
          <div class="marc-field full"><label>Work email</label><input name="email" type="email" placeholder="you@brand.com"><span class="err">Enter a valid email</span></div>
          <div class="marc-field"><label>Role</label><input name="role" type="text" placeholder="Marketing Director"></div>
          <div class="marc-field"><label>Team size</label>
            <select name="teamSize"><option value="">Select…</option><option>Just me</option><option>2–10</option><option>11–50</option><option>50+</option></select>
          </div>
          <div class="marc-field full"><label>Channels / markets</label><input name="regions" type="text" placeholder="e.g. paid social, creators &amp; PR across 3 markets"></div>
          <div class="marc-field full"><label>Biggest marketing challenge</label><textarea name="challenge" placeholder="What's hardest about your marketing today?"></textarea></div>
          <div class="marc-note"></div>
          <button class="marc-submit" type="submit">Create access &rarr;</button>
          <p class="marc-fine">Stored privately for your early-access onboarding. No spam, ever.</p>
        </form>
      </div>`;
    document.body.appendChild(scrim);
    void scrim.offsetWidth;
    scrim.classList.add("show");

    const card = scrim.querySelector(".marc-auth-card");
    const form = scrim.querySelector(".marc-form");
    const emailInput = form.querySelector('[name=email]');
    if (prefillEmail) emailInput.value = prefillEmail;

    const x = scrim.querySelector(".marc-auth-x");
    if (x) x.addEventListener("click", close);
    if (!gate) scrim.addEventListener("mousedown", (e) => { if (e.target === scrim) close(); });

    scrim.querySelectorAll("[data-oauth]").forEach((btn) => {
      btn.addEventListener("click", () => signInWithOAuth(btn.getAttribute("data-oauth")));
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const f = (n) => form.querySelector(`[name=${n}]`);
      let ok = true;
      const nameF = f("name").closest(".marc-field");
      const emailF = f("email").closest(".marc-field");
      if (!f("name").value.trim()) { nameF.classList.add("invalid"); ok = false; } else nameF.classList.remove("invalid");
      if (!/.+@.+\..+/.test(f("email").value.trim())) { emailF.classList.add("invalid"); ok = false; } else emailF.classList.remove("invalid");
      if (!ok) return;

      const data = {
        at: new Date().toISOString(),
        name: f("name").value.trim(), email: f("email").value.trim(),
        company: f("company").value.trim(), role: f("role").value.trim(),
        teamSize: f("teamSize").value, regions: f("regions").value.trim(),
        challenge: f("challenge").value.trim(), method: "email"
      };
      persist(data);
      showThanks(card, data, gate, opts.onEnter);
    });
  }

  function showThanks(card, data, gate, onEnter) {
    const first = (data.name || "").split(" ")[0] || "there";
    card.innerHTML = `
      <div class="marc-thanks">
        <div class="tick"><svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 13l4 4L19 7"/></svg></div>
        <h3>You're in, ${first}.</h3>
        <p>Your Chrysa workspace is ready. We'll reach out at <strong>${data.email}</strong> to get you fully set up.</p>
        <button class="enter" type="button">Enter Chrysa &rarr;</button>
      </div>`;
    card.querySelector(".enter").addEventListener("click", () => {
      if (typeof onEnter === "function") { onEnter(); return; }
      if (gate) { close(); location.reload(); }
      else { location.href = "marc/index.html"; }
    });
  }

  // ▸ auto-gate (after any OAuth return has been handled)
  function maybeGate() {
    if (scrim) return;
    if (document.body && document.body.hasAttribute("data-require-auth") && !hasSession()) {
      open({ gate: true, onEnter: () => close() });
    }
  }
  function boot() { handleOAuthReturn().finally(maybeGate); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();

  // ▸ wire any [data-signup] trigger on the page
  document.addEventListener("click", (e) => {
    const t = e.target.closest("[data-signup]");
    if (t) { e.preventDefault(); open({}); }
  });

  window.MarcAuth = { open, close, hasSession, exportCSV };
})();
