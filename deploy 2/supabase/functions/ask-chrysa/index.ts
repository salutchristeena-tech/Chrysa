// ============================================================
//  Chrysa AI — "ask-chrysa" Supabase Edge Function
//  Safely calls Claude with your Anthropic key (kept server-side).
//
//  EASIEST DEPLOY — no command line (Supabase dashboard):
//   1. Supabase → Edge Functions → "Deploy a new function" →
//      "Via editor".
//   2. Name it exactly:  ask-chrysa
//   3. Delete the sample code, paste THIS whole file, click Deploy.
//   4. Edge Functions → Secrets (Manage secrets) → add:
//        Name:  ANTHROPIC_API_KEY    Value: sk-ant-...your key...
//   5. Your function URL appears on the function's page, like:
//        https://<your-ref>.functions.supabase.co/ask-chrysa
//      Paste it into CHRYSA_AI_ENDPOINT in marc/app.js.
//
//  (CLI alternative: supabase functions deploy ask-chrysa --no-verify-jwt)
// ============================================================

import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const MODEL = "claude-sonnet-4-5";
const ANTHROPIC_KEY = Deno.env.get("ANTHROPIC_API_KEY") ?? "";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });

  try {
    const { prompt, system, max_tokens } = await req.json();
    if (!prompt) {
      return new Response(JSON.stringify({ error: "Missing prompt" }), {
        status: 400, headers: { ...cors, "Content-Type": "application/json" },
      });
    }
    if (!ANTHROPIC_KEY) {
      return new Response(JSON.stringify({ error: "Server missing ANTHROPIC_API_KEY" }), {
        status: 500, headers: { ...cors, "Content-Type": "application/json" },
      });
    }

    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: max_tokens ?? 1024,
        system: system ?? "You are Chrysa, a sharp, refined marketing-intelligence copilot. Write in clear British English. Be concise and practical.",
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await r.json();
    const text = data?.content?.[0]?.text ?? "";
    return new Response(JSON.stringify({ text }), {
      headers: { ...cors, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500, headers: { ...cors, "Content-Type": "application/json" },
    });
  }
});
