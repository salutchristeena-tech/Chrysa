const state = {
  campaigns: [
    { name: "Meta Ecosystem Retargeting", channel: "Meta Ads", spend: 42000, revenue: 176000 },
    { name: "Founder PR Push", channel: "PR", spend: 9000, revenue: 64000 },
    { name: "SEO + GEO Authority Sprint", channel: "SEO / GEO", spend: 18000, revenue: 118000 },
    { name: "Instagram + WhatsApp Lead Flow", channel: "Instagram / WhatsApp", spend: 22000, revenue: 99000 },
    { name: "Restaurant Ops ABM", channel: "LinkedIn", spend: 26000, revenue: 132000 }
  ],
  coverage: [
    { title: "Regional dining tech roundup", outlet: "Gulf Business", link: "https://example.com/coverage", reach: 42000 },
    { title: "Restaurant payment trends", outlet: "Hospitality Weekly", link: "https://example.com/pr", reach: 28000 }
  ],
  influencers: [
    { name: "Maya Eats", deliverable: "2 reels + story set", status: "Live", engagement: 6.4 },
    { name: "Dubai Food Notes", deliverable: "UGC demo reel", status: "Editing", engagement: 0 }
  ],
  uploads: [
    { name: "May GA4 performance sync", type: "Google Analytics Data API", category: "Live sync" },
    { name: "Search visibility sync", type: "SEMrush-style SEO + GEO intelligence", category: "Live sync" },
    { name: "Search Console query sync", type: "Google Search Console", category: "Live sync" },
    { name: "Meta Ads insights sync", type: "Meta Marketing API", category: "Live sync" },
    { name: "Instagram profile sync", type: "Instagram Graph API", category: "Live sync" },
    { name: "WhatsApp Business lead sync", type: "WhatsApp Business Platform", category: "Live sync" },
    { name: "Facebook Pages sync", type: "Facebook Pages", category: "Live sync" },
    { name: "Threads conversation sync", type: "Threads API", category: "Planned" },
    { name: "Agency monthly report sync", type: "Agency report hub", category: "Auto-ingested" },
    { name: "PR coverage sync", type: "Media monitoring", category: "Live sync" }
  ],
  ai: null,
  actions: [
    "Shift budget toward the highest ROI campaign before the next reporting cycle.",
    "Prioritise SEO and generative AI optimisation topics where competitors appear in search and AI answers but your brand does not.",
    "Connect Instagram, Facebook, WhatsApp Business, Messenger, and Threads so Meta performance is read as one customer journey.",
    "Ask each connected agency or platform owner for source-level proof behind every top-line performance claim.",
    "Create one executive report that combines paid, PR, influencer, content, and budget performance."
  ]
};

const toast = document.querySelector("#toast");

function byId(id) {
  return document.querySelector(`#${id}`);
}

function apiBase() {
  return window.location.protocol === "file:" ? "http://localhost:3000" : "";
}

function showToast(message) {
  if (!toast) {
    console.log(message);
    return;
  }
  toast.textContent = message;
  toast.classList.add("visible");
  window.setTimeout(() => toast.classList.remove("visible"), 2600);
}

function money(value) {
  return `$${Number(value || 0).toLocaleString()}`;
}

function roi(item) {
  if (!Number(item.spend)) return 0;
  return Number(item.revenue || 0) / Number(item.spend);
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formObject(form) {
  return Object.fromEntries(new FormData(form).entries());
}

function dashboardPayload() {
  return {
    campaigns: state.campaigns,
    coverage: state.coverage,
    influencers: state.influencers,
    uploads: state.uploads
  };
}

function renderDashboard() {
  const totalSpend = state.campaigns.reduce((sum, item) => sum + Number(item.spend || 0), 0);
  const totalRevenue = state.campaigns.reduce((sum, item) => sum + Number(item.revenue || 0), 0);
  const avgRoi = totalSpend ? totalRevenue / totalSpend : 0;
  const totalReach = state.coverage.reduce((sum, item) => sum + Number(item.reach || 0), 0);

  const roiTotal = byId("roi-total");
  const coverageTotal = byId("coverage-total");
  const budgetTotal = byId("budget-total");
  const snapshotScore = byId("snapshot-score");
  if (roiTotal) roiTotal.textContent = `${avgRoi.toFixed(1)}x`;
  if (coverageTotal) coverageTotal.textContent = String(state.coverage.length);
  if (budgetTotal) budgetTotal.textContent = money(totalSpend);
  if (snapshotScore) snapshotScore.textContent = String(Math.min(96, Math.round(68 + avgRoi * 4 + state.coverage.length)));

  renderCampaigns();
  renderChannels();
  renderCoverage();
  renderInfluencers();
  renderUploads();
  renderInsights();
  renderActions();
}

function renderCampaigns() {
  const list = byId("campaign-list");
  if (!list) return;
  list.innerHTML = state.campaigns.map(item => {
    const value = Math.min(100, roi(item) * 18);
    return `
      <div class="chart-row">
        <div>
          <strong>${escapeHtml(item.name)}</strong>
          <span>${escapeHtml(item.channel)} · ${money(item.spend)} spend · ${money(item.revenue)} return</span>
        </div>
        <b>${roi(item).toFixed(1)}x</b>
        <i style="width:${value}%"></i>
      </div>
    `;
  }).join("");
}

function renderChannels() {
  const bars = byId("channel-bars");
  if (!bars) return;
  const channelTotals = new Map();
  state.campaigns.forEach(item => {
    const current = channelTotals.get(item.channel) || { spend: 0, revenue: 0 };
    current.spend += Number(item.spend || 0);
    current.revenue += Number(item.revenue || 0);
    channelTotals.set(item.channel, current);
  });
  bars.innerHTML = Array.from(channelTotals.entries()).map(([channel, totals]) => {
    const value = Math.min(100, (totals.revenue / Math.max(1, totals.spend)) * 16);
    return `
      <div class="bar-row">
        <div><strong>${escapeHtml(channel)}</strong><span>${(totals.revenue / Math.max(1, totals.spend)).toFixed(1)}x ROI</span></div>
        <em><i style="width:${value}%"></i></em>
      </div>
    `;
  }).join("");
}

function renderCoverage() {
  const list = byId("coverage-list");
  if (!list) return;
  list.innerHTML = state.coverage.map(item => `
    <div class="table-row">
      <div>
        <strong>${escapeHtml(item.title)}</strong>
        <span>${escapeHtml(item.outlet)} · ${Number(item.reach || 0).toLocaleString()} reach</span>
      </div>
      <a href="${escapeHtml(item.link)}" target="_blank" rel="noreferrer">Open</a>
    </div>
  `).join("");
}

function renderInfluencers() {
  const list = byId("influencer-list");
  if (!list) return;
  list.innerHTML = state.influencers.map(item => `
    <div class="table-row">
      <div>
        <strong>${escapeHtml(item.name)}</strong>
        <span>${escapeHtml(item.deliverable)} · ${escapeHtml(item.status || "Planned")}</span>
      </div>
      <b>${Number(item.engagement || 0).toFixed(1)}%</b>
    </div>
  `).join("");
}

function renderUploads() {
  const list = byId("upload-list");
  if (!list) return;
  list.innerHTML = state.uploads.length
    ? state.uploads.map(item => `
      <div class="table-row">
        <div>
          <strong>${escapeHtml(item.name)}</strong>
          <span>${escapeHtml(item.type || "Connected source")}</span>
        </div>
        <b>${escapeHtml(item.category || "Synced")}</b>
      </div>
    `).join("")
    : `<p class="empty-inline">No connected reports synced yet.</p>`;
}

function renderInsights() {
  const insights = state.ai?.insights || [
    "Paid, PR, influencer, content, and agency activity are syncing into one performance view.",
    "SEO and generative AI visibility are now tracked together: keywords, content gaps, AI answer mentions, citations, and competitor movement.",
    "Meta activity should be read across Ads, Facebook, Instagram, WhatsApp Business, Messenger, and Threads rather than as isolated channel reports.",
    "Agency reports are auto-ingested and should be reviewed for source-level proof and recommendations.",
    "Leadership reporting needs one combined view of ROI, coverage, content, budgets, and next actions."
  ];
  const insightList = byId("insight-list");
  if (insightList) insightList.innerHTML = insights.map(item => `<li>${escapeHtml(item)}</li>`).join("");
  if (state.ai?.summary) {
    const summaryTitle = byId("ai-summary-title");
    const summary = byId("ai-summary");
    if (summaryTitle) summaryTitle.textContent = state.ai.summaryTitle || "Unified performance summary";
    if (summary) summary.textContent = state.ai.summary;
  }
}

function renderActions() {
  const actions = state.ai?.nextActions || state.actions;
  const list = byId("action-list");
  if (!list) return;
  list.innerHTML = actions.map((item, index) => `
    <article>
      <span>${String(index + 1).padStart(2, "0")}</span>
      <p>${escapeHtml(item)}</p>
    </article>
  `).join("");
}

async function saveRecord(type, payload) {
  const response = await fetch(`${apiBase()}/api/${type}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!response.ok) throw new Error(`Could not save ${type}.`);
  return response.json();
}

byId("signup-form")?.addEventListener("submit", async event => {
  event.preventDefault();
  const form = event.currentTarget;
  const status = byId("signup-status");
  const payload = formObject(form);
  if (status) status.textContent = "Saving your early access request...";
  try {
    const data = await saveRecord("signup", payload);
    if (status) status.textContent = `You're on the waitlist. Chrysa will prioritise ${data.payload?.plan || payload.plan} access for ${payload.website}.`;
    form.reset();
    showToast("Early access request saved.");
  } catch (error) {
    if (status) status.textContent = "Could not save your request yet. Please try again.";
    showToast(error.message);
  }
});

byId("url-form")?.addEventListener("submit", async event => {
  event.preventDefault();
  const form = event.currentTarget;
  const result = byId("url-result");
  if (!result) return;
  const payload = formObject(form);
  result.innerHTML = "<p>Building your marketing roadmap...</p>";
  try {
    const data = await saveRecord("url-overview", payload);
    result.innerHTML = renderRoadmap(data);
    showToast("Website roadmap generated.");
  } catch (error) {
    result.innerHTML = "<p>Chrysa could not build that roadmap yet. Check the website URL and try again.</p>";
    showToast(error.message);
  }
});

function roadmapList(items) {
  return (items || []).map(item => `<li>${escapeHtml(item)}</li>`).join("");
}

function renderRoadmap(data) {
  return `
    <strong>${escapeHtml(data.title)}</strong>
    <p>${escapeHtml(data.summary)}</p>
    <div class="roadmap-grid">
      <section>
        <b>What is lacking</b>
        <ul>${roadmapList(data.gaps)}</ul>
      </section>
      <section>
        <b>Campaigns to work on</b>
        <ul>${roadmapList(data.campaigns)}</ul>
      </section>
      <section>
        <b>30-day roadmap</b>
        <ul>${roadmapList(data.roadmap30)}</ul>
      </section>
      <section>
        <b>Next actions</b>
        <ul>${roadmapList(data.nextActions)}</ul>
      </section>
    </div>
    <span>${escapeHtml(data.recommendation)}</span>
  `;
}

byId("cmo-form")?.addEventListener("submit", async event => {
  event.preventDefault();
  const form = event.currentTarget;
  const answer = byId("cmo-answer");
  if (!answer) return;
  const payload = { ...formObject(form), dashboard: dashboardPayload() };
  answer.textContent = "Chrysa is reading the command centre...";
  try {
    const response = await fetch(`${apiBase()}/api/cmo`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (!response.ok) throw new Error("Chrysa could not answer yet.");
    const data = await response.json();
    answer.textContent = data.answer;
    form.reset();
  } catch (error) {
    answer.textContent = "I would start by checking the highest ROI campaign, the lowest performing channel, and any agency report that does not show source-level proof.";
    showToast(error.message);
  }
});

async function generateAI(kind) {
  const response = await fetch(`${apiBase()}/api/ai/${kind}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dashboardPayload())
  });
  if (!response.ok) throw new Error("Could not generate AI output.");
  const data = await response.json();
  state.ai = data.output;
  renderDashboard();
  showToast(kind === "report" ? "Leadership report generated." : "AI insights generated.");
  if (kind === "report") {
    const blob = new Blob([data.output.report], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "chrysa-leadership-report.txt";
    link.click();
    URL.revokeObjectURL(url);
  }
}

byId("generate-summary")?.addEventListener("click", () => generateAI("summary").catch(error => showToast(error.message)));
byId("generate-actions")?.addEventListener("click", () => generateAI("actions").catch(error => showToast(error.message)));
byId("generate-report")?.addEventListener("click", () => generateAI("report").catch(error => showToast(error.message)));

renderDashboard();
