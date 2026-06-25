# Chrysa Early Beta Build Plan

This is the practical build path from waitlist MVP to early paid beta.

## Beta Goal

Let a small number of users pay for access, create a company workspace, connect a few marketing tools, and receive useful AI-generated marketing intelligence.

## Phase 1: Paid Beta Foundation

Build this first:

- user accounts and login
- company workspace
- plan selection
- Stripe Checkout or Stripe Payment Links
- billing status on each user account
- signup and onboarding emails
- admin view for beta users

Recommended payment path:

- start with Stripe Payment Links for the fastest beta
- move to Stripe Checkout when you need plan logic, trials, customer portal, coupons, and subscription lifecycle webhooks

Required Stripe objects:

- products: Starter, Growth, Pro, Command
- recurring prices for each plan
- checkout session or payment link per plan
- webhook for payment success, subscription created, subscription cancelled, payment failed

## Phase 2: Workspace Data Model

Core tables or collections:

- users
- companies
- memberships
- subscriptions
- connected_accounts
- websites
- campaigns
- reports
- recommendations
- roadmap_runs
- ai_messages

Every connected account should store:

- provider name
- OAuth account ID
- access token encrypted
- refresh token encrypted
- scopes
- expiry date
- connection status
- last sync time

## Phase 3: First Integrations

Build in this order:

1. Google Analytics Data API
   - sessions
   - conversions
   - traffic sources
   - landing pages
   - date comparisons

2. Meta Marketing API
   - campaigns
   - spend
   - impressions
   - clicks
   - leads or conversions
   - creative-level performance if available

3. Google Sheets
   - simplest bridge for agency reports, manual exports, PR trackers, influencer trackers, budgets

4. SEMrush
   - domain overview
   - organic keywords
   - backlink signals
   - competitor visibility
   - SEO gaps

5. Modash
   - influencer campaign tracking
   - creator lists
   - audience fit
   - deliverable status

6. Muck Rack or PR monitoring import
   - media mentions
   - journalist/outlet data
   - coverage links
   - estimated reach

## Phase 4: AI Intelligence Layer

Chrysa should produce:

- what changed this week or month
- what is underperforming
- what budget should shift
- which campaign needs attention
- what PR or influencer activity is missing
- what content pillars should be prioritized
- what questions to ask agencies
- leadership-ready summary
- 30-day action plan

## Phase 5: Beta User Experience

The beta onboarding flow:

1. User joins waitlist.
2. User pays or receives an invite.
3. User creates company workspace.
4. User enters website URL.
5. User connects at least one source.
6. Chrysa generates first roadmap.
7. User asks Chrysa for next actions.
8. User exports or shares a report.

## Recommended First Paid Beta Scope

Do not build every connector immediately.

Start with:

- Stripe
- authentication
- company workspace
- website roadmap
- Google Analytics
- Meta Ads
- Google Sheets import
- AI summary and next actions

Then add:

- SEMrush
- Modash
- Muck Rack
- CRM/email platforms

## Beta Success Criteria

You are ready to expand when:

- 10 users sign up
- 3 users connect a source
- 2 users pay
- 2 users say the roadmap helped them decide what to do next
- 1 user asks for a recurring report
