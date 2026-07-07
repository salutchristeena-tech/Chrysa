/* ============================================================
   Chrysa — Connections engine
   Real app connections for the dashboard Sources view.
   - key/token apps  → stored locally, called through the
     connector-proxy edge function (or direct when the API allows CORS)
   - GA4             → Google OAuth via Supabase (+analytics scope),
     property picker, live Data API pulls (client-side)
   - Slack           → incoming-webhook paste + test message
   - Keys NEVER leave the browser except per-request over HTTPS.
   ============================================================ */
(function () {
  "use strict";

  /* ── config ─────────────────────────────────────────────── */
  const SUPABASE_URL  = "https://vjmwdantethceolpexyk.supabase.co";
  const SUPABASE_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZqbXdkYW50ZXRoY2VvbHBleHlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI3MTQxMzksImV4cCI6MjA5ODI5MDEzOX0.fxxprUsmwZYj6LAr4vNzA0ngpU4YKTlRMn13uwVL87g";
  // ▸ Deploy supabase/functions/connector-proxy, then paste its URL:
  //   e.g. "https://vjmwdantethceolpexyk.functions.supabase.co/connector-proxy"
  const PROXY_URL = "";

  const LS = "chrysa.connections.v1";
  const GA4_CACHE = "chrysa.ga4.cache.v1";

  /* ── app registry ───────────────────────────────────────── */
  const APPS = {
    ga4: {
      name: "GA4", kind: "google",
      scope: "https://www.googleapis.com/auth/analytics.readonly",
      blurb: "Sign in with the Google account that owns your Analytics property. Chrysa reads sessions, users and conversions — read-only.",
      setup: ["Uses your Google sign-in — no key needed.",
              "One-time: in Google Cloud, enable the “Google Analytics Data API” and “Google Analytics Admin API” for the Chrysa OAuth project (see CONNECTORS-SETUP.md)."]
    },
    hubspot: {
      name: "HubSpot", kind: "key", keyLabel: "Private-app token", placeholder: "pat-na1-…",
      blurb: "Create a free private app inside your own HubSpot — no marketplace review needed.",
      setup: ["HubSpot → ⚙ Settings → Integrations → Private apps → Create",
              "Scopes: crm.objects.deals.read, crm.objects.contacts.read",
              "Copy the token (starts pat-) and paste it here."],
      test: { service: "hubspot", path: "crm/v3/objects/deals", query: { limit: "1" } }
    },
    semrush: {
      name: "SEMrush", kind: "key", keyLabel: "API key", placeholder: "32-character key",
      blurb: "Your SEMrush API key lets Chrysa read rankings, keywords and competitor visibility.",
      setup: ["semrush.com → your profile icon → Subscription info → API units",
              "Copy the API key shown there (API units required on your plan)."],
      test: null
    },
    similarweb: {
      name: "SimilarWeb", kind: "key", keyLabel: "API key", placeholder: "Your REST API key",
      blurb: "Read competitor traffic and engagement estimates.",
      setup: ["account.similarweb.com → API management → generate key"],
      test: { service: "similarweb", path: "v1/user-capabilities", query: {} }
    },
    meta: {
      name: "Meta Ads", kind: "key", keyLabel: "System-user access token", placeholder: "EAAG…", direct: true,
      blurb: "A system-user token from your own Business Manager reads your ad accounts — no app review needed for your own data.",
      setup: ["business.facebook.com → Business settings → Users → System users → Add",
              "Generate token → pick your ad account → permission: ads_read",
              "Paste the token here (treat it like a password)."],
      test: { direct: "https://graph.facebook.com/v21.0/me/adaccounts?fields=name&access_token={KEY}" }
    },
    googleads: {
      name: "Google Ads", kind: "guided",
      blurb: "Google Ads needs a developer token approved by Google (usually 1–3 days), then OAuth.",
      setup: ["ads.google.com → Tools → API Center → apply for a developer token (Basic access)",
              "Tell me when it's approved — I'll wire the OAuth flow to it."]
    },
    tiktok: {
      name: "TikTok Ads", kind: "guided",
      blurb: "TikTok's Marketing API requires a developer app and audit for live data.",
      setup: ["business-api.tiktok.com → Become a developer → create an app",
              "Request the Reporting scope; sandbox works immediately, production after audit",
              "Send me the app ID when you have it."]
    },
    klaviyo: {
      name: "Klaviyo", kind: "key", keyLabel: "Private API key", placeholder: "pk_…",
      blurb: "Read campaign, flow and revenue performance from your Klaviyo account.",
      setup: ["klaviyo.com → Account → Settings → API keys → Create private key (read-only)"],
      test: { service: "klaviyo", path: "api/accounts", query: {} }
    },
    modash: {
      name: "Modash", kind: "key", keyLabel: "API token", placeholder: "Bearer token",
      blurb: "Read creator lists and performance from Modash.",
      setup: ["marketer.modash.io → Settings → API → copy token (API add-on required)"],
      test: { service: "modash", path: "v1/user/info", query: {} }
    },
    muckrack: {
      name: "Muck Rack", kind: "guided",
      blurb: "Muck Rack's API is enterprise-tier — ask your account manager to enable it.",
      setup: ["Ask your Muck Rack CSM for API access; paste the key here once you have it."]
    },
    slack: {
      name: "Slack", kind: "webhook", keyLabel: "Incoming webhook URL", placeholder: "https://hooks.slack.com/services/…",
      blurb: "Chrysa posts alerts and the daily digest to a channel you choose.",
      setup: ["api.slack.com/apps → Create app → From scratch",
              "Incoming Webhooks → activate → Add new webhook → pick a channel",
              "Copy the URL that starts hooks.slack.com and paste it here."]
    },
    notion: {
      name: "Notion", kind: "key", keyLabel: "Internal integration secret", placeholder: "ntn_… / secret_…",
      blurb: "Read your campaign docs and calendar databases.",
      setup: ["notion.so/my-integrations → New integration (internal)",
              "Copy the secret, then share your campaign pages with the integration."],
      test: { service: "notion", path: "v1/users/me", query: {} }
    }
  };

  /* ── store ──────────────────────────────────────────────── */
  const read = (k, fb) => { try { return JSON.parse(localStorage.getItem(k)) ?? fb; } catch { return fb; } };
  const store = () => read(LS, {});
  const save = (app, rec) => { const s = store(); s[app] = rec; localStorage.setItem(LS, JSON.stringify(s)); render(); };
  const drop = (app) => { const s = store(); delete s[app]; localStorage.setItem(LS, JSON.stringify(s)); render(); };

  const ago = (t) => {
    const m = Math.max(0, Math.round((Date.now() - t) / 60000));
    return m < 1 ? "just now" : m < 60 ? m + "m ago" : Math.round(m / 60) + "h ago";
  };

  /* ── proxy client ───────────────────────────────────────── */
  async function viaProxy(service, path, query, key) {
    if (!PROXY_URL) throw new Error("proxy-not-deployed");
    const res = await fetch(PROXY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": "Bearer " + SUPABASE_ANON },
      body: JSON.stringify({ service, path, query, key })
    });
    if (!res.ok) throw new Error("Proxy " + res.status + ": " + (await res.text()).slice(0, 180));
    return res.json();
  }

  async function testKey(app, key) {
    const t = APPS[app].test;
    if (!t) return { ok: null };                       // no cheap test — accept
    try {
      if (t.direct) {
        const res = await fetch(t.direct.replace("{KEY}", encodeURIComponent(key)));
        const j = await res.json();
        if (j.error) throw new Error(j.error.message || "rejected");
        return { ok: true };
      }
      await viaProxy(t.service, t.path, t.query, key);
      return { ok: true };
    } catch (e) {
      if (e.message === "proxy-not-deployed") return { ok: null, pending: true };
      return { ok: false, err: e.message };
    }
  }

  /* ── GA4 (client-side, via Supabase Google OAuth) ───────── */
  function ga4Start() {
    try { sessionStorage.setItem("chrysa.oauth.app", "ga4"); } catch {}
    const redirect = location.origin + location.pathname + location.search;
    location.href = SUPABASE_URL + "/auth/v1/authorize?provider=google" +
      "&scopes=" + encodeURIComponent("email " + APPS.ga4.scope) +
      "&redirect_to=" + encodeURIComponent(redirect);
  }

  async function ga4HandleReturn() {
    const h = location.hash && location.hash.slice(1);
    if (!h || h.indexOf("provider_token=") < 0) return false;
    const p = new URLSearchParams(h);
    try { history.replaceState(null, "", location.pathname + location.search); } catch {}
    if (sessionStorage.getItem("chrysa.oauth.app") !== "ga4") return false;
    sessionStorage.removeItem("chrysa.oauth.app");
    const token = p.get("provider_token");
    if (!token) return false;
    try {
      const res = await fetch("https://analyticsadmin.googleapis.com/v1beta/accountSummaries?pageSize=200",
        { headers: { Authorization: "Bearer " + token } });
      if (!res.ok) throw new Error("GA Admin API " + res.status + " — is the Analytics Admin API enabled?");
      const j = await res.json();
      const props = [];
      (j.accountSummaries || []).forEach(a => (a.propertySummaries || []).forEach(ps =>
        props.push({ id: ps.property, name: ps.displayName + " · " + (a.displayName || "") })));
      if (!props.length) throw new Error("No GA4 properties visible to this Google account.");
      pickerModal("Choose your GA4 property", props, async (prop) => {
        save("ga4", { kind: "google", token, tokenAt: Date.now(), property: prop.id, label: prop.name, at: Date.now() });
        toast("GA4 connected — pulling live data…");
        await ga4Sync();
      });
      return true;
    } catch (e) {
      toast("GA4: " + e.message, true);
      return true;
    }
  }

  async function ga4Sync() {
    const c = store().ga4;
    if (!c || !c.token) return;
    if (Date.now() - c.tokenAt > 55 * 60000) { render(); return; }   // token expired → card offers Reconnect
    try {
      const res = await fetch("https://analyticsdata.googleapis.com/v1beta/" + c.property + ":runReport", {
        method: "POST",
        headers: { Authorization: "Bearer " + c.token, "Content-Type": "application/json" },
        body: JSON.stringify({
          dateRanges: [{ startDate: "28daysAgo", endDate: "today" }, { startDate: "56daysAgo", endDate: "29daysAgo" }],
          metrics: [{ name: "activeUsers" }, { name: "sessions" }, { name: "conversions" }]
        })
      });
      if (!res.ok) throw new Error("GA Data API " + res.status + " — is the Analytics Data API enabled?");
      const j = await res.json();
      const row = (i) => (j.rows && j.rows[i] && j.rows[i].metricValues.map(v => +v.value)) || null;
      const cur = row(0), prev = row(1);
      const cache = { at: Date.now(), users: cur ? cur[0] : 0, sessions: cur ? cur[1] : 0, conv: cur ? cur[2] : 0,
                      dUsers: (cur && prev && prev[0]) ? Math.round(((cur[0] - prev[0]) / prev[0]) * 100) : null };
      localStorage.setItem(GA4_CACHE, JSON.stringify(cache));
      save("ga4", Object.assign({}, c, { at: Date.now() }));
      toast("GA4 synced — " + fmt(cache.users) + " active users (28d)");
    } catch (e) { toast("GA4 sync failed: " + e.message, true); }
  }

  const fmt = (n) => n >= 1e6 ? (n / 1e6).toFixed(1) + "M" : n >= 1e3 ? (n / 1e3).toFixed(1) + "K" : String(n);

  /* ── UI: modal + toast ──────────────────────────────────── */
  let modal = null;
  function closeModal() { if (modal) { modal.remove(); modal = null; } }

  function baseModal(title, inner) {
    closeModal();
    modal = document.createElement("div");
    modal.className = "cx-scrim";
    modal.innerHTML = '<div class="cx-card glassP" role="dialog" aria-modal="true">' +
      '<div class="cx-head"><b>' + title + '</b><button type="button" class="cx-x" aria-label="Close">✕</button></div>' + inner + "</div>";
    document.body.appendChild(modal);
    modal.querySelector(".cx-x").addEventListener("click", closeModal);
    modal.addEventListener("mousedown", (e) => { if (e.target === modal) closeModal(); });
    return modal.querySelector(".cx-card");
  }

  function connectModal(app) {
    const a = APPS[app], c = store()[app];
    const steps = (a.setup || []).map(s => "<li>" + s + "</li>").join("");
    const hasField = a.kind === "key" || a.kind === "webhook";
    const card = baseModal("Connect " + a.name,
      '<p class="cx-blurb">' + a.blurb + "</p>" +
      '<ol class="cx-steps">' + steps + "</ol>" +
      (hasField
        ? '<label class="cx-label">' + a.keyLabel + '</label>' +
          '<input class="cx-input" type="password" spellcheck="false" placeholder="' + (a.placeholder || "") + '" value="' + (c && c.key ? c.key : "") + '">' +
          '<p class="cx-fine">Stored only in this browser. Sent per-request over HTTPS — never saved on a server.</p>' +
          '<div class="cx-actions"><button type="button" class="cx-go">' + (c ? "Update" : "Connect") + "</button>" +
          (c ? '<button type="button" class="cx-drop">Disconnect</button>' : "") + "</div>"
        : a.kind === "google"
        ? '<div class="cx-actions"><button type="button" class="cx-go">Continue with Google →</button>' +
          (c ? '<button type="button" class="cx-drop">Disconnect</button>' : "") + "</div>"
        : '<div class="cx-actions">' + (c ? '<button type="button" class="cx-drop">Disconnect</button>' : '<span class="cx-fine">Tell me in chat when you have credentials — I\'ll wire it in.</span>') + "</div>"));

    const go = card.querySelector(".cx-go");
    if (go) go.addEventListener("click", async () => {
      if (a.kind === "google") { ga4Start(); return; }
      const val = card.querySelector(".cx-input").value.trim();
      if (!val) return;
      if (a.kind === "webhook") {
        if (!/^https:\/\/hooks\.slack\.com\//.test(val)) { toast("That doesn't look like a Slack webhook URL", true); return; }
        try {
          await fetch(val, { method: "POST", mode: "no-cors", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: "✳️ Chrysa connected — alerts and the daily digest will post here." }) });
          save(app, { kind: "webhook", key: val, at: Date.now(), status: "live" });
          toast("Webhook saved — check Slack for the test message");
        } catch { toast("Could not reach that webhook URL", true); }
        closeModal(); return;
      }
      go.disabled = true; go.textContent = "Testing…";
      const t = await testKey(app, val);
      if (t.ok === false) { go.disabled = false; go.textContent = "Retry"; toast(a.name + ": " + t.err, true); return; }
      save(app, { kind: a.kind, key: val, at: Date.now(),
                  status: t.ok ? "live" : (t.pending || (!APPS[app].direct && !PROXY_URL)) ? "pending-proxy" : "saved" });
      toast(t.ok ? a.name + " connected ✓" : a.name + " key saved" + (t.pending ? " — goes live once the data proxy is deployed" : ""));
      closeModal();
    });
    const dr = card.querySelector(".cx-drop");
    if (dr) dr.addEventListener("click", () => { drop(app); if (app === "ga4") localStorage.removeItem(GA4_CACHE); closeModal(); toast(a.name + " disconnected"); });
  }

  function pickerModal(title, items, onPick) {
    const card = baseModal(title,
      '<div class="cx-list">' + items.map((it, i) =>
        '<button type="button" class="cx-item" data-i="' + i + '">' + it.name + "</button>").join("") + "</div>");
    card.querySelectorAll(".cx-item").forEach(b =>
      b.addEventListener("click", () => { closeModal(); onPick(items[+b.dataset.i]); }));
  }

  let toastEl = null, toastT = null;
  function toast(msg, isErr) {
    if (!toastEl) { toastEl = document.createElement("div"); toastEl.className = "cx-toast"; document.body.appendChild(toastEl); }
    toastEl.textContent = msg;
    toastEl.classList.toggle("err", !!isErr);
    toastEl.classList.add("show");
    clearTimeout(toastT); toastT = setTimeout(() => toastEl.classList.remove("show"), 4200);
  }

  /* ── render statuses into the Sources view + KPIs ───────── */
  function statusOf(app) {
    const c = store()[app];
    if (!c) return APPS[app].kind === "guided" ? { txt: "Needs developer app", cls: "off" } : { txt: "Sample data", cls: "off" };
    if (app === "ga4") {
      if (Date.now() - c.tokenAt > 55 * 60000) return { txt: "Reconnect to refresh", cls: "stale" };
      return { txt: "Live · synced " + ago(c.at), cls: "on" };
    }
    if (c.status === "pending-proxy") return { txt: "Key saved · awaiting data proxy", cls: "stale" };
    return { txt: "Connected · " + ago(c.at), cls: "on" };
  }

  function render() {
    const s = store();
    document.querySelectorAll(".src[data-app]").forEach(card => {
      const app = card.dataset.app, st = statusOf(app);
      card.classList.remove("off", "on", "stale");
      card.classList.add(st.cls);
      const stat = card.querySelector(".sstat"); if (stat) stat.textContent = st.txt;
      const btn = card.querySelector("[data-connect]");
      if (btn) btn.textContent = s[app] ? "Manage" : (APPS[app].kind === "guided" ? "Set up" : "Connect");
    });

    const live = Object.keys(s).length;
    const syncEl = document.querySelector(".dsync");
    if (syncEl) syncEl.innerHTML = live
      ? '<span class="dot"></span>' + live + " source" + (live > 1 ? "s" : "") + " connected · rest is sample data"
      : '<span class="dot sample"></span>Sample data — connect your stack in Sources';

    // KPI: Reach ← GA4 when live
    const cache = read(GA4_CACHE, null);
    const kpi = document.querySelector(".kpis .kpi");
    if (kpi && cache && s.ga4) {
      kpi.querySelector(".v").textContent = fmt(cache.users);
      kpi.querySelector(".k").innerHTML = 'Active users <span class="src">GA4 · live</span>';
      const t = kpi.querySelector(".t");
      if (cache.dUsers != null) { t.textContent = (cache.dUsers >= 0 ? "▲ " : "▼ ") + Math.abs(cache.dUsers) + "% vs prev 28d"; t.className = "t " + (cache.dUsers >= 0 ? "up" : "down"); }
      else { t.textContent = "28 days"; t.className = "t"; }
    }
  }

  /* ── init ───────────────────────────────────────────────── */
  function init() {
    document.querySelectorAll(".src[data-app] [data-connect]").forEach(btn => {
      btn.addEventListener("click", () => connectModal(btn.closest(".src").dataset.app));
    });
    ga4HandleReturn().then((handled) => {
      if (!handled) { const c = store().ga4; if (c && Date.now() - c.tokenAt < 55 * 60000 && Date.now() - c.at > 10 * 60000) ga4Sync().then(render); }
      render();
    });
    render();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();

  window.ChrysaConnect = { store, render, sync: ga4Sync };
})();
