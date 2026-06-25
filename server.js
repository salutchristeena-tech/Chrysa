const http = require("http");
const fs = require("fs/promises");
const path = require("path");
const crypto = require("crypto");

const PORT = Number(process.env.PORT || 3000);
const HOST = process.env.HOST || "0.0.0.0";
const ROOT = __dirname;
const DB_DIR = process.env.DATA_DIR || path.join(ROOT, "db");
const DB_FILE = path.join(DB_DIR, "dashboard-events.jsonl");

const SYSTEM_PROMPT = `
You are Chrysa, the AI command centre for modern marketing teams.
The name is inspired by a chrysalis: transformation from fragmented marketing signals into clear, confident action.
You synthesize connected website analytics, paid media, PR coverage, influencer activity, agency reports, campaign budgets, content performance, ROI, and projections.
You are not primarily a diagnosis tool. You are an executive-grade marketing intelligence dashboard and strategist.
Return concise, structured JSON with useful summaries, risks, changes, budget shifts, agency follow-up questions, and next actions.
`;

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8"
};

function send(res, status, body, type = "application/json; charset=utf-8") {
  const payload = typeof body === "string" || Buffer.isBuffer(body) ? body : JSON.stringify(body);
  res.writeHead(status, {
    "Content-Type": type,
    "Cache-Control": "no-store",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  });
  res.end(payload);
}

async function readJson(req) {
  let body = "";
  for await (const chunk of req) {
    body += chunk;
    if (body.length > 2_000_000) throw new Error("Request too large.");
  }
  return JSON.parse(body || "{}");
}

async function saveEvent(type, payload) {
  await fs.mkdir(DB_DIR, { recursive: true });
  const record = {
    id: crypto.randomUUID(),
    type,
    createdAt: new Date().toISOString(),
    payload
  };
  await fs.appendFile(DB_FILE, `${JSON.stringify(record)}\n`, "utf8");
  return record;
}

function totals(data) {
  const campaigns = data.campaigns || [];
  const spend = campaigns.reduce((sum, item) => sum + Number(item.spend || 0), 0);
  const revenue = campaigns.reduce((sum, item) => sum + Number(item.revenue || 0), 0);
  const roi = spend ? revenue / spend : 0;
  const coverage = data.coverage || [];
  const influencers = data.influencers || [];
  const uploads = data.uploads || [];
  return { campaigns, spend, revenue, roi, coverage, influencers, uploads };
}

function fallbackAI(data, kind) {
  const t = totals(data);
  const lowestCampaign = [...t.campaigns].sort((a, b) => (Number(a.revenue || 0) / Math.max(1, Number(a.spend || 0))) - (Number(b.revenue || 0) / Math.max(1, Number(b.spend || 0))))[0];
  const highestCampaign = [...t.campaigns].sort((a, b) => (Number(b.revenue || 0) / Math.max(1, Number(b.spend || 0))) - (Number(a.revenue || 0) / Math.max(1, Number(a.spend || 0))))[0];

  const insights = [
    `Marketing activity is producing an estimated ${t.roi.toFixed(1)}x ROI across ${t.campaigns.length} tracked campaigns.`,
    `${highestCampaign?.name || "The strongest campaign"} is the clearest scale candidate based on return versus spend.`,
    `${lowestCampaign?.name || "The lowest-return campaign"} should be reviewed for creative, targeting, or budget efficiency.`,
    `${t.coverage.length} PR coverage items and ${t.influencers.length} influencer deliverables are now visible in the same performance view.`,
    `${t.uploads.length} connected report sources can be used to build executive reporting and agency follow-up questions.`
  ];

  const nextActions = [
    `Shift a test budget toward ${highestCampaign?.name || "the top ROI campaign"} and watch ROI movement over 7 days.`,
    `Ask agencies to explain the drivers behind ${lowestCampaign?.name || "the lowest-performing activity"} and propose one corrective action.`,
    "Connect campaign spend, PR reach, influencer deliverables, and content metrics in one leadership report.",
    "Ensure every synced report has owner, date range and channel metadata so Chrysa can compare month-on-month change.",
    "Prepare next-month actions around the top channel, weakest channel, and biggest reporting gap."
  ];

  const report = [
    "Chrysa Leadership Report",
    "",
    `Snapshot: ${t.campaigns.length} campaigns, $${t.spend.toLocaleString()} spend, $${t.revenue.toLocaleString()} return, ${t.roi.toFixed(1)}x ROI.`,
    "",
    "What changed:",
    ...insights.map(item => `- ${item}`),
    "",
    "Risks:",
    `- Budget may be over-weighted toward lower-return activity${lowestCampaign ? ` such as ${lowestCampaign.name}` : ""}.`,
    "- Agency, PR, influencer, and content data still need consistent naming and dates for stronger comparisons.",
    "",
    "Recommended next actions:",
    ...nextActions.map(item => `- ${item}`)
  ].join("\n");

  return {
    summaryTitle: "Unified marketing intelligence readout",
    summary: `Chrysa combined campaign ROI, PR coverage, influencer deliverables and connected report context into one view. Current blended ROI is ${t.roi.toFixed(1)}x, with ${highestCampaign?.name || "one campaign"} showing the strongest scaling signal.`,
    insights,
    nextActions,
    report,
    agencyQuestions: [
      "Which metric changed most since the last reporting period, and why?",
      "What budget shift would you make if performance had to improve in 14 days?",
      "Which activity should be stopped, not optimised?"
    ]
  };
}

function fallbackUrlOverview(payload) {
  const rawUrl = payload.url || "";
  const parsed = new URL(rawUrl);
  const host = parsed.hostname.replace(/^www\./, "");
  const isSocial = /instagram|tiktok|linkedin|facebook|whatsapp|threads|messenger|x\.com|twitter/.test(host);

  return {
    title: `${host} marketing roadmap`,
    summary: isSocial
      ? "Chrysa treats this as a connected social source and builds the first roadmap around audience clarity, creative consistency, conversion cues and campaign focus."
      : "Chrysa treats this as the primary website source and builds the first roadmap around positioning, conversion paths, content gaps, acquisition channels and measurable campaign priorities.",
    gaps: [
      "Clarify the core offer above the fold so visitors understand what to do next within five seconds.",
      "Add stronger proof points: client results, testimonials, case studies, press mentions, or measurable outcomes.",
      "Map every page to one conversion action so traffic can become leads, bookings, demos, or enquiries.",
      "Audit search visibility: keywords, technical SEO, backlinks, content gaps, local search, and competitor ranking movement.",
      "Audit generative AI visibility: whether AI answer engines mention, cite, or ignore the brand on high-intent topics.",
      "Connect analytics, paid media, PR, content, influencer, Meta ecosystem, SEO, GEO, and CRM data into one reporting view."
    ],
    campaigns: [
      "Awareness campaign: explain the brand promise with one clear message across paid, social, PR, and email.",
      "Conversion campaign: retarget warm visitors with proof-led creative and a direct call to action.",
      "SEO campaign: build high-intent pages around priority keywords, competitor gaps, and local/category demand.",
      "GEO campaign: publish answer-ready content that improves brand mentions, citations, and authority in AI-generated responses.",
      "Meta ecosystem campaign: connect Facebook, Instagram, WhatsApp Business, Messenger, Threads, and Meta Ads into one lead journey.",
      "Content campaign: publish educational pillars that answer buyer objections and build trust.",
      "PR and influencer campaign: use credible third-party voices to support the brand story."
    ],
    roadmap30: [
      "Week 1: audit the website journey, analytics setup, conversion points, SEO health, AI visibility, and top missing proof.",
      "Week 2: define campaign messaging, audience segments, content pillars, keyword priorities, AI-answer topics, and paid-media tests.",
      "Week 3: launch one conversion-focused campaign, one SEO/GEO authority sprint, and one Meta ecosystem retargeting flow.",
      "Week 4: review ROI, rankings, AI answer mentions, Meta journey movement, creative performance, and next-month budget shifts."
    ],
    nextActions: [
      "Connect Google Analytics, Search Console, SEMrush-style SEO/GEO data, Meta Ads, Facebook, Instagram, WhatsApp Business, Messenger, Threads, PR monitoring, social, CRM, and agency reports.",
      "Choose one revenue goal for the next 30 days and align every campaign to it.",
      "Ask Chrysa which search topics and AI answer gaps are most likely to influence demand this month.",
      "Ask Chrysa to generate a leadership-ready report after the first synced performance cycle."
    ],
    recommendation: "Start with conversion path, proof gaps, SEO health, and AI visibility first, then launch one awareness campaign, one SEO/GEO authority sprint, and one Meta ecosystem conversion campaign before expanding spend."
  };
}

function fallbackCmoAnswer(payload) {
  const question = String(payload.question || "").trim();
  const t = totals(payload.dashboard || {});
  const highestCampaign = [...t.campaigns].sort((a, b) => (Number(b.revenue || 0) / Math.max(1, Number(b.spend || 0))) - (Number(a.revenue || 0) / Math.max(1, Number(a.spend || 0))))[0];
  const lowestCampaign = [...t.campaigns].sort((a, b) => (Number(a.revenue || 0) / Math.max(1, Number(a.spend || 0))) - (Number(b.revenue || 0) / Math.max(1, Number(b.spend || 0))))[0];

  return [
    `For "${question || "your next marketing decision"}", I would start with the clearest performance signal: ${highestCampaign?.name || "your highest ROI campaign"}.`,
    `Current blended ROI is ${t.roi.toFixed(1)}x across ${t.campaigns.length} tracked campaigns, with ${lowestCampaign?.name || "the lowest-return activity"} needing the first review.`,
    "Next move: compare paid, SEO, GEO, Meta ecosystem, PR, influencer, content, and budget data in one view, then ask the responsible agency or channel owner for the single change they would make in the next 7 days."
  ].join(" ");
}

async function callLLM(data, kind) {
  if (!process.env.OPENAI_API_KEY) {
    return { output: fallbackAI(data, kind), usedFallback: true };
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: `Generate ${kind} for this unified marketing dashboard. Return JSON with summaryTitle, summary, insights array, nextActions array, report string, agencyQuestions array.\n${JSON.stringify(data, null, 2)}`
        }
      ]
    })
  });

  if (!response.ok) {
    throw new Error((await response.text()).slice(0, 300));
  }
  const json = await response.json();
  return { output: JSON.parse(json.choices?.[0]?.message?.content || "{}"), usedFallback: false };
}

async function handleStatic(req, res) {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const pathname = url.pathname === "/" ? "/index.html" : url.pathname;
  const safePath = path.normalize(path.join(ROOT, pathname));
  if (!safePath.startsWith(ROOT)) {
    send(res, 403, "Forbidden", "text/plain; charset=utf-8");
    return;
  }
  try {
    const file = await fs.readFile(safePath);
    send(res, 200, file, mimeTypes[path.extname(safePath)] || "application/octet-stream");
  } catch {
    send(res, 404, "Not found", "text/plain; charset=utf-8");
  }
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://localhost:${PORT}`);

    if (req.method === "OPTIONS") {
      send(res, 204, "");
      return;
    }

    if (req.method === "GET" && url.pathname === "/api/health") {
      send(res, 200, {
        ok: true,
        service: "Chrysa",
        version: "0.1.0",
        time: new Date().toISOString()
      });
      return;
    }

    if (req.method === "POST" && /^\/api\/(campaigns|coverage|influencers|uploads)$/.test(url.pathname)) {
      const type = url.pathname.split("/").pop();
      const payload = await readJson(req);
      const record = await saveEvent(type, payload);
      send(res, 200, record);
      return;
    }

    if (req.method === "POST" && url.pathname === "/api/signup") {
      const payload = await readJson(req);
      if (!payload.email || !payload.website) {
        send(res, 400, { error: "Email and website are required." });
        return;
      }
      const record = await saveEvent("early-access-signup", payload);
      send(res, 200, record);
      return;
    }

    if (req.method === "POST" && url.pathname === "/api/url-overview") {
      const payload = await readJson(req);
      if (!payload.url) {
        send(res, 400, { error: "URL is required." });
        return;
      }
      const overview = fallbackUrlOverview(payload);
      await saveEvent("url-overview", { payload, overview });
      send(res, 200, overview);
      return;
    }

    if (req.method === "POST" && url.pathname === "/api/cmo") {
      const payload = await readJson(req);
      const answer = fallbackCmoAnswer(payload);
      await saveEvent("cmo-question", { payload, answer });
      send(res, 200, { answer });
      return;
    }

    const aiMatch = url.pathname.match(/^\/api\/ai\/(summary|actions|report)$/);
    if (req.method === "POST" && aiMatch) {
      const payload = await readJson(req);
      const result = await callLLM(payload, aiMatch[1]);
      await saveEvent(`ai-${aiMatch[1]}`, result);
      send(res, 200, result);
      return;
    }

    await handleStatic(req, res);
  } catch (error) {
    send(res, 500, { error: error.message || "Server error" });
  }
});

server.listen(PORT, HOST, () => {
  console.log(`Chrysa dashboard running on ${HOST}:${PORT}`);
});
