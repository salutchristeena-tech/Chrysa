# Publishing Chrysa to chrysa.ai

This `deploy/` folder is your live website. Everything is self-contained and
ready to host. Pages:
- `index.html` — landing page
- `dashboard.html` — beta command centre
- `checkout.html` — checkout (Stripe Payment Links — see `PAYMENTS.md`)
- `marc/index.html` — working demo (behind early-access auth)

Sign-ups already write to your Supabase project (configured in `auth.js`).

## Step 1 — Put the site online (Netlify, ~5 min, free)

1. Go to **app.netlify.com** and sign up (free).
2. Click **Add new site → Deploy manually**.
3. Drag this entire **`deploy/` folder** onto the upload area.
4. Netlify gives you a temporary URL like `glittering-lotus-123.netlify.app`.
   Open it — your site is live.

(Vercel, Cloudflare Pages, GitHub Pages all work the same way — upload the
folder, keep `index.html` at the root.)

## Step 2 — Connect chrysa.ai

1. In Netlify: **Domain settings → Add a domain → `chrysa.ai`**.
2. Netlify shows DNS records (or nameservers). Log in to wherever you bought
   the domain and either:
   - point the **nameservers** to Netlify's (easiest), or
   - add the **A / CNAME records** Netlify lists.
3. Wait for DNS to propagate (minutes to a couple hours). HTTPS is automatic.

Done — `https://chrysa.ai` now serves the landing.

## Step 3 — Connect payments (before charging anyone)

Follow `PAYMENTS.md`: create two Stripe Payment Links (Solo $29, Growth $129)
and paste their URLs into the config block at the top of `checkout.html`.
Use Stripe test mode for today's beta.

## Step 4 — Get sign-ups in your inbox (optional fallback)

Right now sign-ups are stored in each visitor's browser only. To receive them:

1. Create a free form endpoint at **formspree.io** or **tally.so**.
2. Open **`auth.js`** (in this folder), find the line near the top:
   `const SIGNUP_ENDPOINT = "";`
3. Paste your endpoint URL between the quotes, save, and re-upload the folder.

Every early-access submission will then email you. Until then, you can pull
stored sign-ups by opening the site and running `MarcAuth.exportCSV()` in the
browser console.

## Notes
- Fonts load from Google Fonts; the demo's AI copilot runs live where the
  Claude API is available and shows graceful sample content otherwise.
- To update the site later, just re-drag the folder into Netlify.
