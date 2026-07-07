# Chrysa — Connect your apps (live data)

The dashboard **Sources** view is now a real connections page. Every key is
stored **only in the visitor's browser** and sent per-request over HTTPS —
nothing is saved on a server.

## What works when

| App | How it connects | Ready when |
|---|---|---|
| GA4 | Google sign-in (read-only scope) | after the 2 Google steps below |
| Slack | Incoming-webhook URL paste | immediately |
| Meta Ads | System-user token paste | after ~20 min Business-Manager setup |
| HubSpot | Private-app token paste | needs the data proxy (below) |
| Klaviyo / SEMrush / SimilarWeb / Modash / Notion | API-key paste | needs the data proxy (below) |
| Google Ads | Developer token (Google approval, 1–3 days) | tell me when approved |
| TikTok Ads | Developer app + audit | tell me when you have the app |
| Muck Rack | Enterprise API — ask your CSM | tell me when you have a key |

Until an app is connected, its dashboard numbers stay clearly labelled
**Sample data**.

## Step 1 — Deploy the data proxy (≈5 min, once)

Key-based APIs block browser calls, so a tiny read-only proxy forwards them.

1. Supabase → **Edge Functions** → **Deploy a new function → Via editor**
2. Name it exactly **`connector-proxy`**
3. Paste the contents of `supabase/functions/connector-proxy/index.ts` → Deploy
4. Copy the function URL (`https://<ref>.functions.supabase.co/connector-proxy`)
5. Open `marc/connect.js`, paste it at the top: `const PROXY_URL = "…";`
   — or just paste the URL to me in chat and I'll set it.

## Step 2 — GA4 (your first live source, ≈5 min)

In **console.cloud.google.com**, same project as your Google sign-in:
1. **APIs & Services → Library** → enable **Google Analytics Data API** and
   **Google Analytics Admin API**
2. **OAuth consent screen → Data access** → Add scope →
   `https://www.googleapis.com/auth/analytics.readonly`

Then on the live dashboard → Sources → **GA4 → Connect** → sign in → pick your
property. The Reach KPI flips to live GA4 numbers with a "live" label.

## Where each key lives (shown in the connect dialogs too)

- **HubSpot**: ⚙ Settings → Integrations → Private apps → Create → scopes
  `crm.objects.deals.read`, `crm.objects.contacts.read` → copy `pat-…`
- **Klaviyo**: Account → Settings → API keys → Create **private** key (read-only)
- **SEMrush**: profile → Subscription info → API units → copy key
- **SimilarWeb**: account.similarweb.com → API management → generate key
- **Modash**: marketer.modash.io → Settings → API (API add-on required)
- **Notion**: notion.so/my-integrations → New internal integration → copy
  secret → share your campaign pages with it
- **Slack**: api.slack.com/apps → Create app → Incoming Webhooks → activate →
  add webhook to a channel → copy `https://hooks.slack.com/…`
- **Meta Ads**: business.facebook.com → Business settings → System users →
  Add → Generate token → asset: your ad account → permission `ads_read`

## Notes

- OAuth flows (GA4) only complete on the **live site**, not in the design preview.
- GA4 access tokens expire after ~1 h; the card shows **Reconnect to refresh**
  (cached numbers stay, with a timestamp).
- The proxy is read-only (GET only) and only to the whitelisted APIs above.
