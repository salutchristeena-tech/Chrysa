// Supabase Edge Function: connector-proxy
// Read-only proxy for Chrysa app connections (SEMrush, Klaviyo, HubSpot,
// Modash, SimilarWeb, Notion). The browser sends {service, path, query, key};
// this function forwards a GET to the whitelisted API with the right auth
// style and returns the JSON. Keys are used per-request, never stored.
//
// Deploy (dashboard, no CLI): Supabase → Edge Functions → Deploy new function
// → name it exactly `connector-proxy` → paste this file → Deploy.
// Then paste the function URL into marc/connect.js → PROXY_URL.

type Svc = { base: string; headers?: (k: string) => Record<string, string>; param?: string };

const SERVICES: Record<string, Svc> = {
  hubspot:    { base: "https://api.hubapi.com/",     headers: (k) => ({ Authorization: `Bearer ${k}` }) },
  klaviyo:    { base: "https://a.klaviyo.com/",      headers: (k) => ({ Authorization: `Klaviyo-API-Key ${k}`, revision: "2024-10-15" }) },
  modash:     { base: "https://api.modash.io/",      headers: (k) => ({ Authorization: `Bearer ${k}` }) },
  notion:     { base: "https://api.notion.com/",     headers: (k) => ({ Authorization: `Bearer ${k}`, "Notion-Version": "2022-06-28" }) },
  semrush:    { base: "https://api.semrush.com/",    param: "key" },
  similarweb: { base: "https://api.similarweb.com/", param: "api_key" },
};

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, content-type, apikey",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...CORS, "Content-Type": "application/json" } });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  if (req.method !== "POST") return json({ error: "POST only" }, 405);
  try {
    const { service, path, query, key } = await req.json();
    const svc = SERVICES[service];
    if (!svc) return json({ error: "unknown service: " + service }, 400);
    if (typeof key !== "string" || key.length < 8) return json({ error: "missing key" }, 400);
    if (typeof path !== "string" || path.includes("..") || path.startsWith("http")) return json({ error: "bad path" }, 400);

    const url = new URL(svc.base + path.replace(/^\/+/, ""));
    for (const [k, v] of Object.entries((query as Record<string, unknown>) || {})) url.searchParams.set(k, String(v));
    if (svc.param) url.searchParams.set(svc.param, key);

    const upstream = await fetch(url.toString(), { headers: svc.headers ? svc.headers(key) : {} }); // GET only — read-only proxy
    const body = await upstream.text();
    return new Response(body, {
      status: upstream.status,
      headers: { ...CORS, "Content-Type": upstream.headers.get("Content-Type") || "application/json" },
    });
  } catch (e) {
    return json({ error: String(e) }, 500);
  }
});
