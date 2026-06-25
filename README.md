# Chrysa

Chrysa is an early MVP for an AI-powered marketing intelligence dashboard and command centre.

Positioning:

> Marketing that connects. Creativity that converts.

Core promise:

> One dashboard for every marketing decision.

The current MVP helps users:

- request early access
- enter a website URL and receive a marketing roadmap
- see subscription plan options
- understand which marketing apps Chrysa will connect
- ask "Chrysa, your CMO" for campaign and reporting guidance
- preview a connected marketing command centre

## Run Locally

```bash
npm start
```

Then open:

```text
http://localhost:3000
```

Do not use the `file://` page for testing backend actions. Use the local server URL.

## Backend Endpoints

- `GET /api/health` checks whether the server is running.
- `POST /api/signup` saves early-access signups.
- `POST /api/url-overview` generates a website marketing roadmap.
- `POST /api/cmo` answers marketing questions from the AI CMO panel.
- `POST /api/ai/summary`, `/api/ai/actions`, `/api/ai/report` generate dashboard summaries.

For now, signups and events are saved locally in:

```text
db/dashboard-events.jsonl
```

The `db/` folder is ignored by git so private signup data is not committed.

## Publishing Goal

The immediate launch goal is to get 10 early users who are willing to:

- enter their website URL
- review the roadmap output
- tell you what is useful or missing
- share which integrations they need first
- join a beta interview or onboarding call

## Recommended First Deployment

Use a Node hosting platform such as Render, Railway, Fly.io, or a small VPS.

The app needs:

- build command: none
- start command: `npm start`
- health check path: `/api/health`

For a real public beta, move signup storage from local JSONL to a persistent tool such as Supabase, Airtable, HubSpot, Beehiiv, or Mailchimp.

## Next Product Steps

See [BETA_BUILD_PLAN.md](./BETA_BUILD_PLAN.md) for the full beta roadmap.

Priority order:

1. Add persistent database for waitlist users and workspace data.
2. Add authentication and company workspaces.
3. Add Stripe Payment Links or Stripe Checkout for paid beta access.
4. Replace placeholder roadmap logic with real website crawling and AI analysis.
5. Connect the first live data sources: Google Analytics, Meta Ads, Google Sheets.
6. Add SEMrush, Modash, and Muck Rack as the next connector layer.
7. Add email notifications when someone joins the waitlist.
8. Add an admin view for leads, payments, connectors, and roadmap requests.
9. Turn the roadmap output into a downloadable PDF.
