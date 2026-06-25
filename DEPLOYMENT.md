# Publish Chrysa

This is the quickest path to publish Chrysa so real people can sign up.

## Option 1: Render

1. Create a GitHub repository for this project.
2. Push the Chrysa folder to GitHub.
3. In Render, create a new Web Service.
4. Connect the GitHub repository.
5. Use these settings:

```text
Runtime: Node
Build command: npm install
Start command: npm start
Health check path: /api/health
```

6. Deploy.
7. Open the Render URL and test:

```text
/api/health
```

8. Submit the early-access form.

## Connect www.chrysa.ai

Connect the domain only after the Render service is live:

1. Open the Chrysa service in Render.
2. Go to **Settings**, then **Custom Domains**.
3. Add:

```text
www.chrysa.ai
```

4. Render will show the exact DNS target for the service.
5. Open the DNS settings at the company where `chrysa.ai` is registered.
6. Add the `CNAME` record shown by Render for the `www` host.
7. Remove any conflicting `A`, `AAAA`, or `CNAME` records for `www`.
8. Return to Render and select **Verify**.

When `www.chrysa.ai` is added, Render can also add the root domain and
redirect `chrysa.ai` to `www.chrysa.ai`. Render provisions HTTPS
automatically after DNS verification.

Do not guess the DNS target. Copy it from the live Render service because it
is specific to that deployment.

## Option 2: Railway

1. Create a GitHub repository for this project.
2. Push the project to GitHub.
3. Create a Railway project from the repository.
4. Railway should detect Node automatically.
5. Set the start command to:

```text
npm start
```

6. Deploy and test `/api/health`.

## Beta Data

The current app saves signups and dashboard activity to:

```text
/var/data/dashboard-events.jsonl
```

The included `render.yaml` provisions a persistent Render disk at `/var/data`,
which is suitable for a small private beta. Before a wider launch, move
accounts, signups, and product data into a managed database such as Supabase
or PostgreSQL.

Back up the JSONL file regularly while the beta is running.

## Beta Checklist

Before sharing publicly:

- Test the early-access form.
- Test the website roadmap form.
- Add your real contact email or social link.
- Decide where signups should go.
- Write a short launch post.
- Pick 20 specific people to invite personally.

## Suggested Public URL Flow

For users:

1. Land on Chrysa.
2. Read the promise.
3. Join the waitlist.
4. Enter their website URL.
5. Get a roadmap.
6. Book or request a beta onboarding call.

For you:

1. Review each signup.
2. Reply personally.
3. Ask for their marketing stack.
4. Run their website roadmap together.
5. Ask what they would pay for first.
