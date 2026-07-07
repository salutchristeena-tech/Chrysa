# Chrysa AI — Supabase Setup (sign-ups + live AI)

This makes Chrysa fully functional: real sign-ups in a database, and a live
"Ask Chrysa" copilot. Two parts — do Part A first (5 min), Part B when ready.

---

## Part A — Real sign-ups (≈5 minutes)

1. **Create the account & project**
   - Go to **supabase.com** → *Start your project* → sign in with GitHub.
   - *New project* → name `chrysa`, set a strong DB password, pick a region
     near you (**Frankfurt** or **Bahrain** are closest to Dubai). Wait ~2 min.

2. **Create the table**
   - Left sidebar → **SQL Editor** → *New query*.
   - Paste the contents of **`supabase-schema.sql`** (in this folder) → **Run**.
   - This makes the `signups` table and locks it so the public can submit but
     not read the list.

3. **Get your two keys**
   - **Project Settings → API**:
     - **Project URL**  (e.g. `https://abcdxyz.supabase.co`)
     - **anon / public** key
   - Open **`auth.js`** and paste them at the top:
     ```js
     const SUPABASE_URL  = "https://abcdxyz.supabase.co";
     const SUPABASE_ANON = "eyJhbGci...";   // the anon public key
     ```
   - That's it — every sign-up now lands in your Supabase table.

4. **See your sign-ups**
   - Supabase → **Table Editor → signups**. Export to CSV from there anytime.
   - (The in-app `MarcAuth.exportCSV()` still works as a local backup.)

> The **anon key is safe** in front-end code — Row Level Security (from the
> SQL) only allows inserts, never reads. Your data stays private.

---

## Part B — Live "Ask Chrysa" AI (≈15 minutes, no command line)

The copilot needs a tiny server so your Anthropic key is never exposed.
You can deploy it entirely from the Supabase dashboard.

1. **Get an Anthropic API key**
   - **console.anthropic.com** → API keys → create one. Add ~$5 credit and set
     a monthly budget cap so costs can't surprise you.

2. **Deploy the function from the dashboard**
   - Supabase → **Edge Functions** → **Deploy a new function** → **Via editor**.
   - Name it exactly **`ask-chrysa`**.
   - Delete the sample code, then paste the entire contents of
     **`supabase/functions/ask-chrysa/index.ts`** (in this folder). Click **Deploy**.

3. **Add your key as a secret**
   - Edge Functions → **Secrets** (Manage secrets) → add:
     - Name: `ANTHROPIC_API_KEY`  ·  Value: `sk-ant-...` (your key)

4. **Point Chrysa at it**
   - On the function's page, copy its URL:
     `https://<your-ref>.functions.supabase.co/ask-chrysa`
   - Open **`marc/app.js`**, find `CHRYSA_AI_ENDPOINT` near the top of the AI
     section, and paste the URL:
     ```js
     const CHRYSA_AI_ENDPOINT = "https://<your-ref>.functions.supabase.co/ask-chrysa";
     ```
   - Now "Ask Chrysa", report generation, and the move-of-the-week run live
     against Claude. Paste the URL here and I'll set it for you.

> **CLI alternative** (if you prefer the terminal): `npm i -g supabase` →
> `supabase login` → `supabase link --project-ref <ref>` →
> `supabase functions new ask-chrysa` (replace index.ts) →
> `supabase secrets set ANTHROPIC_API_KEY=sk-ant-...` →
> `supabase functions deploy ask-chrysa --no-verify-jwt`

---

## Part C — Google & LinkedIn sign-in (≈15 min)

The two buttons are already wired through Supabase Auth. They work as soon as
each provider is enabled in your dashboard:

**First — tell Supabase where your site lives** (once)
- Supabase → **Authentication → URL Configuration**:
  - **Site URL**: `https://chrysa.ai`
  - **Redirect URLs**: add `https://chrysa.ai/**` and
    `https://YOUR-SITE.netlify.app/**` (your Netlify subdomain).

**Google (≈10 min)**
1. **console.cloud.google.com** → create/pick a project →
   **APIs & Services → OAuth consent screen** → External → app name
   `Chrysa` + your support email → Save.
2. **Credentials → Create credentials → OAuth client ID → Web application**:
   - Authorized redirect URI:
     `https://vjmwdantethceolpexyk.supabase.co/auth/v1/callback`
3. Copy the **Client ID** and **Client secret**.
4. Supabase → **Authentication → Providers → Google** → enable, paste both, Save.

**LinkedIn (≈5 min)**
1. **developer.linkedin.com** → *Create app* (requires a LinkedIn company page).
2. **Products** tab → add **“Sign In with LinkedIn using OpenID Connect”**.
3. **Auth** tab → Authorized redirect URL:
   `https://vjmwdantethceolpexyk.supabase.co/auth/v1/callback`
4. Copy Client ID + secret → Supabase → **Providers → LinkedIn (OIDC)** →
   enable, paste, Save.

> Test on the **live site** — OAuth redirects can't complete inside the design
> preview. Until a provider is enabled, its button shows a friendly
> "continue with email" note instead of breaking.

---

## What's already wired for you
- `auth.js` → writes sign-ups to Supabase (with localStorage fallback so a
  sign-up is never lost, even offline).
- `marc/app.js` → `complete()` uses your Edge Function when set, otherwise the
  in-preview helper.
- `supabase-schema.sql` → one-click table + security.
- `supabase/functions/ask-chrysa/index.ts` → the AI proxy.

## Costs (rough)
- Supabase: free tier is plenty to launch.
- Anthropic: a few cents per copilot answer; set a budget cap in the console.
