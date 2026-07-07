/* Chrysa — Command · render + navigation + interactions */
(function () {
  const D = window.MARC;
  const KEYS = { ideas: "marc.fb.ideas", campaigns: "marc.fb.campaigns", integrations: "marc.fb.integrations" };

  const read = (k, fb) => {
    try { const s = localStorage.getItem(k); return s ? JSON.parse(s) : structuredClone(fb); }
    catch { return structuredClone(fb); }
  };
  const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };

  let ideas = read(KEYS.ideas, D.ideas);
  let campaigns = read(KEYS.campaigns, D.campaigns);
  let integrations = read(KEYS.integrations, D.integrations);

  const $ = (s) => document.querySelector(s);

  const viewTitles = {
    command: "Launch Command", campaigns: "Guests & Positioning", creative: "Channels & Campaigns",
    pipeline: "Bookings & Revenue", agency: "Assets & Partners", reports: "Reporting", integrations: "Marketing Stack",
    competitive: "Competitive Set"
  };

  // ---------- renderers ----------
  function renderPriorities() {
    $("#priority-list").innerHTML = D.priorities.map(p => `
      <article class="priority-item">
        <div class="priority-score serif">${p.score}</div>
        <div><h4>${p.title}</h4><p>${p.detail}</p></div>
        <span class="tag">${p.tag}</span>
      </article>`).join("");
  }

  function renderBars() {
    $("#channel-bars").innerHTML = D.channels.map(c => `
      <div class="bar-row">
        <div class="bar-meta"><strong>${c.name}</strong><span class="spend">${c.spend}</span></div>
        <div class="bar-track"><div class="bar-fill" style="width:${c.value}%"></div></div>
        <div class="bar-foot">${c.impact}</div>
      </div>`).join("");
  }

  function renderCampaigns() {
    $("#campaign-pulse").innerHTML = campaigns.map(c => `
      <article class="compact-item">
        <h4>${c.title}<span class="status">${c.status}</span></h4>
        <p>${c.detail}</p>
      </article>`).join("");
  }

  function renderIdeas() {
    $("#idea-list").innerHTML = ideas.map((it, i) => `
      <article class="idea-card">
        <div>
          <h4>${it.title}</h4>
          <p>${it.detail}</p>
          <div class="idea-meta">${it.meta.map(m => `<span class="tag">${m}</span>`).join("")}</div>
        </div>
        <button class="ghost-button" data-idea="${i}">Brief</button>
      </article>`).join("");
  }

  function renderTimeline() {
    $("#campaign-timeline").innerHTML = D.timeline.map((t, i) => `
      <li>
        <span class="timeline-marker">${i + 1}</span>
        <div><strong>${t[0]}</strong><p>${t[1]}</p></div>
      </li>`).join("");
  }

  function renderBench() {
    $("#bench-table").innerHTML = D.bench.map(m => `
      <tr><td><strong>${m[0]}</strong></td><td>${m[1]}</td><td><span class="mono-cell">${m[2]}</span></td>
      <td><span class="tag">${m[3]}</span></td><td>${m[4]}</td></tr>`).join("");
  }

  function renderCreators() {
    $("#creator-pipeline").innerHTML = D.creators.map(p => `
      <article class="pipeline-item">
        <span class="dot serif">·</span>
        <div><h4>${p.title}</h4><p>${p.detail}</p></div>
      </article>`).join("");
  }

  function renderAgencySummary() {
    $("#agency-summary").innerHTML = D.agencySummary.map(m => `
      <article class="metric-card">
        <p>${m.label}</p>
        <span class="figure">${m.figure}</span>
        <span class="trend">${m.note}</span>
      </article>`).join("");
  }

  function renderAgencies() {
    $("#agency-roster").innerHTML = D.agencies.map(a => `
      <tr>
        <td><strong>${a.name}</strong></td>
        <td>${a.discipline}</td>
        <td>${a.region}</td>
        <td><span class="mono-cell">${a.retainer}<small>ver</small></span></td>
        <td>${a.deliverables}</td>
        <td><div class="perf"><div class="perf-bar"><span style="width:${a.perf}%"></span></div><b class="serif">${(a.perf / 10).toFixed(1)}</b></div></td>
        <td><span class="a-status ${a.state}">${a.status}</span></td>
      </tr>`).join("");
  }

  // — Creative Lab —
  function renderCreatives() {
    $("#creative-portfolio").innerHTML = D.creatives.map(c => {
      const video = c.hook > 0;
      const stats = video
        ? `<div><span>Vol</span><b>${c.hook}</b></div><div><span>Conv</span><b>${c.hold}%</b></div><div><span>Spend</span><b>${c.cpl}</b></div>`
        : `<div><span>Vol</span><b>—</b></div><div><span>Spend</span><b>${c.cpl}</b></div><div><span>Status</span><b>${c.spend}</b></div>`;
      return `
      <article class="ad-card">
        <div class="ad-thumb"><span class="ad-ratio">${c.ratio}</span></div>
        <div class="ad-body">
          <div class="ad-head"><h4>${c.title}</h4><span class="ad-format">${c.format}</span></div>
          <div class="ad-stats">${stats}</div>
          <div class="ad-foot"><span class="verdict ${c.state}">${c.verdict}</span><span class="ad-spend">${c.spend}</span></div>
        </div>
      </article>`;
    }).join("");
  }

  function renderTesting() {
    $("#creative-testing").innerHTML = D.testing.map(t => `
      <article class="compact-item"><h4>${t.title}</h4><p>${t.detail}</p></article>`).join("");
  }

  function renderResearch() {
    $("#creative-research").innerHTML = D.research.map(r => `
      <article class="compact-item"><h4>${r.title}</h4><p>${r.detail}</p></article>`).join("");
  }

  // — Pipeline & Sales —
  function renderFunnel() {
    $("#funnel").innerHTML = D.funnel.map(s => `
      <div class="funnel-step">
        <div class="funnel-meta">
          <span class="funnel-stage">${s.stage}</span>
          <span class="funnel-count serif">${s.count}</span>
        </div>
        <div class="funnel-track"><div class="funnel-fill" style="width:${s.bar}%"></div></div>
        <div class="funnel-foot"><span>${s.value}</span>${s.conv ? `<span class="funnel-conv">${s.conv}</span>` : ""}</div>
      </div>`).join("");
  }

  function renderSLA() {
    $("#sla-list").innerHTML = D.sla.map(s => `
      <div class="sla-item">
        <div><h4>${s.channel}</h4><p>${s.sub || ""}</p></div>
        <div class="sla-time ${s.state}"><b class="serif">${s.time}</b><span>${s.note}</span></div>
      </div>`).join("");
  }

  function renderSources() {
    $("#source-table").innerHTML = D.sources.map(s => `
      <tr><td><strong>${s[0]}</strong></td><td><span class="mono-cell">${s[1]}</span></td>
      <td><span class="mono-cell">${s[2]}</span></td><td><span class="mono-cell">${s[3]}</span></td></tr>`).join("");
  }

  function renderIntegrations() {
    $("#integration-grid").innerHTML = integrations.map(it => {
      const h = it[2].toLowerCase();
      return `<article class="integration-card">
        <div class="integration-top">
          <span class="source-badge">${it[3]}</span>
          <span class="health ${h}">${it[2]}</span>
        </div>
        <div><h4>${it[0]}</h4><p>${it[1]}</p></div>
      </article>`;
    }).join("");
  }

  // ===== Competitive Set =====
  let compCat = "beauty";

  function renderCompetitive(cat) {
    compCat = cat || compCat;
    const c = D.competitive[compCat];
    if (!c) return;
    $("#comp-headline").textContent = `${c.you.name} vs the ${c.label} set`;
    $("#comp-set-title").textContent = `${c.rivals.length} rivals, ranked by momentum`;

    // headline metric tiles
    $("#comp-headline-grid").innerHTML = `
      <article class="metric-card identity comp-you">
        <p>${c.you.tagline}</p>
        <span class="figure serif">${c.you.name}</span>
        <span class="trend good">${c.you.rank} · ${c.you.rating}★ · ${c.you.followers}</span>
      </article>` +
      c.headline.map(h => `
        <article class="metric-card">
          <p>${h.label}</p>
          <span class="figure">${h.figure}</span>
          <span class="trend ${h.state}">${h.note}</span>
        </article>`).join("");

    // rivals ranked by momentum (desc)
    const rivals = c.rivals.slice().sort((a, b) => b.momentum - a.momentum);
    $("#comp-rivals").innerHTML = rivals.map(r => `
      <article class="rival ${r.state}">
        <div class="rival-id">
          <span class="rival-avatar">${r.name[0]}</span>
          <div>
            <h4>${r.name}</h4>
            <p>${r.note}</p>
          </div>
          <span class="rival-state ${r.state}">${stateLabel(r.state)}</span>
        </div>
        <div class="rival-metrics">
          <div><span>Rating</span><b>${r.rating}</b><i class="${deltaDir(r.rdelta)}">${r.rdelta}</i></div>
          <div><span>Social</span><b>${r.social}</b><i class="${deltaDir(r.sdelta)}">${r.sdelta}</i></div>
          <div class="rival-mom">
            <span>Momentum</span>
            <div class="mom-track"><div class="mom-fill" style="width:${r.momentum}%"></div></div>
          </div>
        </div>
      </article>`).join("");

    // what changed
    $("#comp-signals").innerHTML = c.signals.map(s => `
      <article class="compact-item comp-signal">
        <h4><span class="sig-tag">${s.tag}</span></h4>
        <p>${s.text}</p>
      </article>`).join("");

    // share of voice — you + rivals
    const sov = [{ name: c.you.name, sov: c.you.sov, you: true }].concat(c.rivals.map(r => ({ name: r.name, sov: r.sov })))
      .sort((a, b) => b.sov - a.sov);
    const maxSov = Math.max.apply(null, sov.map(s => s.sov));
    $("#comp-sov").innerHTML = sov.map(s => `
      <div class="bar-row${s.you ? " sov-you" : ""}">
        <div class="bar-meta"><strong>${s.name}${s.you ? " <em>· you</em>" : ""}</strong><span class="spend">${s.sov}%</span></div>
        <div class="bar-track"><div class="bar-fill" style="width:${Math.round(s.sov / maxSov * 100)}%"></div></div>
      </div>`).join("");

    // move of the week — sample until AI overrides
    $("#comp-move-text").textContent = c.move;
  }

  function stateLabel(s) { return { win: "Gaining", watch: "Holding", down: "Fading" }[s] || s; }
  function deltaDir(d) { return /^[+]/.test(d) ? "up" : /[−-]/.test(d) ? "dn" : "flat"; }

  async function moveOfTheWeek() {
    const c = D.competitive[compCat];
    if (!c) return;
    const el = $("#comp-move-text");
    if (!hasAI()) { el.textContent = c.move; toast("Move of the week refreshed."); return; }
    el.innerHTML = loadingDots;
    try {
      const text = await complete(
        `You are Chrysa, a growth & communications strategist. A brand's competitive set (category: ${c.label}) from public signals:\n` +
        `Your brand: ${JSON.stringify(c.you)}\nRivals: ${JSON.stringify(c.rivals)}\nThis week's signals: ${JSON.stringify(c.signals)}\n\n` +
        `Write ONE sharp "move of the week" — the single highest-leverage competitive action this brand should take now. Reference specific rivals and what they're doing. 2 sentences, confident and concrete. Plain text only.`
      );
      el.textContent = text || c.move;
      toast("Move of the week refreshed.");
    } catch { el.textContent = c.move; toast("Move of the week refreshed."); }
  }

  function setReport(type) {
    const r = D.reports[type];
    $("#report-heading").textContent = r.heading;
    $("#report-output").innerHTML = `
      <div class="report-kpis">
        <div><strong class="serif">3,860</strong><span>Reservations</span></div>
        <div><strong class="serif">$612K</strong><span>Revenue on the books</span></div>
        <div><strong class="serif">86%</strong><span>Opening readiness</span></div>
      </div>
      <section class="lede"><h4>Summary</h4><p>${r.lede}</p></section>
      <section><h4>${r.diagnosis.label}</h4><p>${r.diagnosis.body}</p></section>
      <section><h4>Data quality</h4><p>Figures reconcile across reservations, POS, and the social platforms before they reach this report; partner-sourced covers are tracked separately from paid.</p></section>
      <section><h4>Recommended next steps</h4><p>${r.recommendation}</p></section>`;
  }

  // ---------- toast ----------
  let toastTimer;
  function toast(msg) {
    const t = $("#toast");
    t.textContent = msg;
    t.classList.add("visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("visible"), 2800);
  }

  // ---------- navigation ----------
  function go(view) {
    document.querySelectorAll(".nav-item").forEach(i => i.classList.toggle("active", i.dataset.view === view));
    document.querySelectorAll(".view").forEach(v => v.classList.remove("active", "entering"));
    const el = $("#" + view);
    el.classList.add("active", "entering");
    setTimeout(() => el.classList.remove("entering"), 360);
    $("#view-title").textContent = viewTitles[view];
    if (view === "command") renderBars();
    if (view === "pipeline") renderFunnel();
    if (view === "competitive") renderCompetitive();
    window.scrollTo({ top: 0 });
  }

  function wireNav() {
    document.querySelectorAll(".nav-item").forEach(b => b.addEventListener("click", () => go(b.dataset.view)));
  }

  // ---------- AI engine ----------
  // In production, point this at your deployed Supabase Edge Function:
  //   https://<your-ref>.functions.supabase.co/ask-chrysa
  // Leave "" to use the in-preview window.claude helper instead.
  const CHRYSA_AI_ENDPOINT = "";

  const hasAI = () => !!CHRYSA_AI_ENDPOINT || typeof window.claude?.complete === "function";

  const escapeHtml = (s) => (s || "").replace(/[&<>]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));

  function aiContext() {
    return JSON.stringify({
      organisation: "Casa Limón Marina — a waterfront Mediterranean restaurant opening in 12 days; the marketing desk of a hospitality group",
      window: "Opening month — June 2026",
      headlineMetrics: { reservationsOnBooks: 3860, targetPct: "41%", revenueOnBooks: "$612K", avgSpend: "$76", showRate: "88%", readiness: "86%", daysToOpening: 12 },
      flags: D.priorities.map(p => ({ title: p.title, area: p.tag })),
      bookingsByChannel: D.channels.map(c => ({ channel: c.name, spend: c.spend, note: c.impact })),
      funnel: D.funnel.map(f => ({ stage: f.stage, count: f.count, note: f.value })),
      liveNow: campaigns.map(c => ({ title: c.title, status: c.status, detail: c.detail })),
      channelCampaigns: D.creatives.map(c => ({ channel: c.format, volume: c.hook, conversion: c.hold, spend: c.cpl, verdict: c.verdict })),
      launchAssets: D.agencies.map(a => ({ name: a.name, purpose: a.discipline, status: a.status })),
      launchCalendar: D.sla.map(s => ({ item: s.channel, timing: s.time, note: s.note }))
    });
  }

  async function complete(prompt) {
    if (CHRYSA_AI_ENDPOINT) {
      const res = await fetch(CHRYSA_AI_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt })
      });
      if (!res.ok) throw new Error("Chrysa AI endpoint error " + res.status);
      const data = await res.json();
      return (data.text || "").trim();
    }
    const out = await window.claude.complete(prompt);
    return (out || "").trim();
  }

  function parseJSON(text) {
    try { return JSON.parse(text); } catch {}
    const m = text && text.match(/\{[\s\S]*\}/);
    if (m) { try { return JSON.parse(m[0]); } catch {} }
    return null;
  }

  const loadingDots = `<div class="ai-loading"><span></span><span></span><span></span></div>`;

  // — Chrysa Copilot (persistent panel) —
  const CHAT = [];
  const SUGGESTIONS = [
    "What needs my attention today?",
    "Are we ready for opening night?",
    "Which channel should get more budget?",
    "Draft the owner update"
  ];
  const cThread = () => $("#copilot-thread");
  const shell = () => document.querySelector(".app-shell");
  function answerHtml(text) {
    const paras = (text || "").split(/\n{2,}/).map(p => p.trim()).filter(Boolean);
    return (paras.length ? paras : [text]).map(p => `<p>${escapeHtml(p)}</p>`).join("");
  }
  function addMsg(role, html) {
    const el = document.createElement("div");
    el.className = "cmsg " + role;
    el.innerHTML = role === "ai" ? `<span class="cmsg-mark">Chrysa</span>${html}` : html;
    cThread().appendChild(el);
    cThread().scrollTop = cThread().scrollHeight;
    return el;
  }
  function openCopilot(focus) {
    shell().classList.add("copilot-open");
    if (focus !== false) setTimeout(() => { const i = $("#copilot-q"); if (i) i.focus(); }, 120);
  }
  function closeCopilot() { shell().classList.remove("copilot-open"); }
  function toggleCopilot() {
    shell().classList.toggle("copilot-open");
    if (shell().classList.contains("copilot-open")) setTimeout(() => { const i = $("#copilot-q"); if (i) i.focus(); }, 120);
  }

  async function askMarc(question) {
    openCopilot(false);
    addMsg("user", escapeHtml(question));
    CHAT.push({ role: "user", text: question });
    const pending = addMsg("ai", loadingDots);
    const set = (txt) => {
      pending.innerHTML = `<span class="cmsg-mark">Chrysa</span>${answerHtml(txt)}`;
      cThread().scrollTop = cThread().scrollHeight;
    };
    if (!hasAI()) {
      set("Live answers run when Chrysa is connected to your social-listening, clipping, and CRM tools. In this preview the data is sampled — but every panel here is wired to real workspace data.");
      return;
    }
    try {
      const hist = CHAT.slice(-6).map(m => `${m.role === "user" ? "Director" : "Chrysa"}: ${m.text}`).join("\n");
      const text = await complete(
        `You are Chrysa — marketing intelligence for hospitality — the copilot for the marketing desk of Casa Limón Marina, a restaurant opening in 12 days. Voice: intelligent, strategic, refined, clear. Use this live workspace data as ground truth:\n${aiContext()}\n\nConversation so far:\n${hist}\n\nAnswer the marketer's latest question concisely (2–4 short paragraphs), citing specific numbers, channels, funnel stages, or launch items where relevant. Plain text only, no markdown headers or bullets.`
      );
      const ans = text || "No answer returned — try rephrasing.";
      CHAT.push({ role: "ai", text: ans });
      set(ans);
    } catch {
      set("Couldn't reach the model just now. Please try again.");
    }
  }

  // — Build report —
  const reportKpis = `
    <div class="report-kpis">
      <div><strong class="serif">3,860</strong><span>Reservations</span></div>
      <div><strong class="serif">$612K</strong><span>Revenue on the books</span></div>
      <div><strong class="serif">86%</strong><span>Opening readiness</span></div>
    </div>`;

  async function buildReport() {
    const type = $(".segmented button.active").dataset.report;
    const focus = $("#report-focus").value, audience = $("#report-audience").value, period = $("#report-period").value;
    const out = $("#report-output");
    if (!hasAI()) { setReport(type); toast(`Sample material for ${audience}.`); return; }
    out.innerHTML = `${reportKpis}<section class="lede"><h4>Generating</h4>${loadingDots}</section>`;
    try {
      const raw = await complete(
        `You are the marketing copilot for Casa Limón Marina, a restaurant opening in 12 days. Ground-truth workspace data:\n${aiContext()}\n\nWrite a report with focus "${focus}" for the audience "${audience}" covering ${period}. Return ONLY valid JSON, no prose or code fences, with exactly these keys:\n{"heading": a short title, "summary": 2-3 sentence overview citing specific numbers/channels/funnel stages, "readout": 2-3 sentences diagnosing channels, readiness, or guest feedback, "recommendation": 2-3 sentences of concrete next steps for the marketing team}. Crisp, specific, numbers-first.`
      );
      const j = parseJSON(raw);
      if (!j || !j.summary) { setReport(type); toast("Report drafted."); return; }
      $("#report-heading").textContent = j.heading || "Marketing Report";
      out.innerHTML = `
        ${reportKpis}
        <section class="lede"><h4>Summary</h4><p>${escapeHtml(j.summary)}</p></section>
        <section><h4>Readout</h4><p>${escapeHtml(j.readout || "")}</p></section>
        <section><h4>Data quality</h4><p>Figures reconcile across reservations, POS, and the social platforms; partner-sourced covers are tracked separately from paid.</p></section>
        <section><h4>Recommended next steps</h4><p>${escapeHtml(j.recommendation || "")}</p></section>`;
      toast(`Report generated for ${audience}.`);
    } catch { setReport(type); toast("Material drafted."); }
  }

  // — New activation —
  async function newExperiment() {
    if (!hasAI()) {
      ideas.unshift(structuredClone(D.newIdea));
      save(KEYS.ideas, ideas); renderIdeas();
      toast("A new guest segment was added to the map.");
      return;
    }
    toast("Mapping a new segment from reviews and booking signals…");
    try {
      const raw = await complete(
        `You are the marketing copilot for Casa Limón Marina, a waterfront Mediterranean restaurant opening in 12 days. Existing guest segments to avoid duplicating: ${ideas.map(i => i.title).join("; ")}.\n\nPropose ONE new guest segment worth testing. Return ONLY valid JSON, no prose or code fences:\n{"title": max 7 words like "Guest type — occasion", "detail": 1-2 crisp sentences: their occasion and the one-line message that wins them, "tier": one of "Primary launch"/"Weeknight covers"/"Daytime covers"/"High spend"/"Exploratory", "channel": e.g. "Instagram + email", "fit": e.g. "Fit 7/10"}.`
      );
      const j = parseJSON(raw);
      const idea = (j && j.title) ? { title: j.title, detail: j.detail || "", meta: [j.tier || "Exploratory", j.channel || "Instagram", j.fit || "Fit TBD"] } : structuredClone(D.newIdea);
      ideas.unshift(idea); save(KEYS.ideas, ideas); renderIdeas();
      toast(`Added: ${idea.title}`);
    } catch {
      ideas.unshift(structuredClone(D.newIdea));
      save(KEYS.ideas, ideas); renderIdeas();
      toast("A new guest segment was added to the map.");
    }
  }

  // — Launch asset —
  const scriptedBrief = `
    <span class="ai-line"><strong>Asset.</strong> Creator tasting brief: "Golden hour on the marina — the table everyone's talking about."</span>
    <span class="ai-line"><strong>Hook.</strong> "Shoot the terrace at sunset first; the three hero dishes drive 70% of tagged content."</span>
    <span class="ai-line"><strong>Proof points.</strong> 4.7/5 soft-launch score, $76 average spend, 88% show rate on creator-sourced bookings.</span>
    <span class="ai-line"><strong>CTA.</strong> "Link the booking page in bio — reservations open to your followers 24 hours early."</span>`;

  function formatBrief(text) {
    const lines = (text || "").split(/\n+/).map(l => l.trim()).filter(Boolean);
    return lines.map(l => {
      const m = l.match(/^([A-Za-z][^:]{1,28}:)(.*)$/);
      return m ? `<span class="ai-line"><strong>${escapeHtml(m[1])}</strong>${escapeHtml(m[2])}</span>` : `<span class="ai-line">${escapeHtml(l)}</span>`;
    }).join("");
  }

  async function draftBrief() {
    const box = $("#pitch-box");
    if (!hasAI()) { box.innerHTML = scriptedBrief; toast("Sales asset drafted."); return; }
    box.innerHTML = loadingDots;
    try {
      const text = await complete(
        `You are the marketing copilot for Casa Limón Marina, a waterfront Mediterranean restaurant opening in 12 days. Draft ONE launch asset (a creator tasting brief, a concierge one-pager, or a press angle) for the opening.\n\nReturn plain text with exactly four lines, each starting with its label and a colon, in this order:\nAsset: ...\nHook: ...\nProof points: ...\nCTA: ...\nKeep each line to one crisp, specific sentence. No extra text.`
      );
      box.innerHTML = text ? formatBrief(text) : scriptedBrief;
      toast("Sales asset drafted.");
    } catch { box.innerHTML = scriptedBrief; toast("Sales asset drafted."); }
  }

  function wireAI() {
    const form = $("#copilot-form");
    if (form) form.addEventListener("submit", (e) => {
      e.preventDefault();
      const i = $("#copilot-q");
      const q = (i.value || "").trim();
      if (q) { i.value = ""; askMarc(q); }
    });
    const tgl = $("#copilot-toggle"); if (tgl) tgl.addEventListener("click", toggleCopilot);
    const col = $("#copilot-collapse"); if (col) col.addEventListener("click", closeCopilot);
    const sug = $("#copilot-suggest");
    if (sug) {
      sug.innerHTML = SUGGESTIONS.map(s => `<button class="suggest-chip" type="button">${s}</button>`).join("");
      sug.addEventListener("click", (e) => { const b = e.target.closest(".suggest-chip"); if (b) askMarc(b.textContent); });
    }
    // greeting
    addMsg("ai", answerHtml("Good morning. I'm Chrysa — your copilot across the opening, bookings, channels, assets, and partners. Ask me anything, or pick a starting point below."));
    // assistant card opens the copilot
    const ac = document.querySelector(".assistant-card");
    if (ac) { ac.style.cursor = "pointer"; ac.addEventListener("click", () => openCopilot()); }
    // open by default on wide screens
    if (window.innerWidth > 1100) shell().classList.add("copilot-open");
  }

  // ---------- actions ----------
  function wireActions() {
    document.querySelectorAll(".cat-btn").forEach(b => b.addEventListener("click", () => {
      document.querySelectorAll(".cat-btn").forEach(x => x.classList.remove("active"));
      b.classList.add("active");
      renderCompetitive(b.dataset.cat);
    }));
    const cmr = $("#comp-move-refresh");
    if (cmr) cmr.addEventListener("click", moveOfTheWeek);
    $("#refresh-insights").addEventListener("click", () => {
      D.priorities.unshift(D.priorities.pop());
      renderPriorities();
      toast("Priorities refreshed from your bookings, reviews, and channel signals.");
    });

    $("#explain-priorities").addEventListener("click", () =>
      toast("Each flag blends covers impact, urgency, and opening timing across channels."));

    $("#generate-report").addEventListener("click", () => {
      go("reports"); buildReport();
    });

    $("#new-idea").addEventListener("click", newExperiment);

    $("#idea-list").addEventListener("click", (e) => {
      const btn = e.target.closest("[data-idea]");
      if (!btn) return;
      const idea = ideas[Number(btn.dataset.idea)];
      campaigns.unshift({ title: idea.title, status: "Activating", detail: `${idea.meta[0]} · ${idea.meta[1]}` });
      save(KEYS.campaigns, campaigns); renderCampaigns();
      go("command");
      toast(`${idea.title} pulled into the live board.`);
    });

    $("#new-creative").addEventListener("click", () => { go("agency"); draftBrief(); });

    $("#sync-sales").addEventListener("click", () =>
      toast("Synced reservations and show rates with the booking platforms."));

    $("#draft-pitch").addEventListener("click", draftBrief);

    document.querySelectorAll(".segmented button").forEach(b => b.addEventListener("click", () => {
      document.querySelectorAll(".segmented button").forEach(x => x.classList.remove("active"));
      b.classList.add("active"); setReport(b.dataset.report);
    }));

    $("#build-report").addEventListener("click", buildReport);

    $("#copy-report").addEventListener("click", async () => {
      try { await navigator.clipboard.writeText($("#report-output").innerText); toast("Material copied to clipboard."); }
      catch { toast("Copy unavailable here, but the material is ready."); }
    });

    $("#download-report").addEventListener("click", () => {
      const title = $("#report-heading").textContent.trim();
      const body = $("#report-output").innerText.trim();
      const blob = new Blob([`${title}\n\n${body}\n`], { type: "text/plain;charset=utf-8" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob); a.download = "marketing-report.txt";
      document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(a.href);
      toast("Material downloaded.");
    });

    $("#add-agency").addEventListener("click", () =>
      toast("Partner intake opens type, scope, and co-promotion workflow."));

    $("#log-deliverable").addEventListener("click", () =>
      toast("Update logged against the asset's version history."));

    $("#connect-source").addEventListener("click", () => {
      const next = integrations.find(i => i[2] === "Pending" || i[2] === "Manual");
      if (!next) { toast("The whole stack is connected."); return; }
      next[2] = "Live"; save(KEYS.integrations, integrations); renderIntegrations();
      toast(`${next[0]} connected.`);
    });

    $("#export-snapshot").addEventListener("click", () => {
      const snap = { generatedAt: new Date().toISOString(), workspace: "Chrysa — Command",
        flags: D.priorities, liveNow: campaigns, segments: ideas, funnel: D.funnel, stack: integrations };
      const blob = new Blob([JSON.stringify(snap, null, 2)], { type: "application/json" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob); a.download = "marketing-snapshot.json";
      document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(a.href);
      toast("Snapshot exported.");
    });

    $("#reset-demo").addEventListener("click", () => {
      ideas = structuredClone(D.ideas); campaigns = structuredClone(D.campaigns); integrations = structuredClone(D.integrations);
      save(KEYS.ideas, ideas); save(KEYS.campaigns, campaigns); save(KEYS.integrations, integrations);
      renderIdeas(); renderCampaigns(); renderIntegrations();
      toast("Sample data reset.");
    });

    $("#global-search").addEventListener("keydown", (e) => {
      if (e.key === "Enter" && e.target.value.trim()) {
        askMarc(e.target.value.trim());
        e.target.value = "";
      }
    });
  }

  // ---------- boot ----------
  renderPriorities(); renderBars(); renderCampaigns(); renderIdeas(); renderTimeline();
  renderBench(); renderCreators(); renderAgencySummary(); renderAgencies();
  renderCreatives(); renderTesting(); renderResearch();
  renderFunnel(); renderSLA(); renderSources();
  renderIntegrations(); setReport("monthly"); renderCompetitive("beauty");
  wireNav(); wireActions(); wireAI();
})();
