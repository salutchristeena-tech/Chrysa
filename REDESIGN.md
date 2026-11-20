# chrysa.ai redesign, November 2026

Branch `redesign-quiet-luxury`. Not deployed. Pushing to `main` publishes chrysa.ai through Netlify, so that waits for the owner's go-ahead.

## 1. Audit: what was wrong with the old homepage

| # | Problem | Why it mattered |
|---|---|---|
| 1 | **Claims the product can't back up.** The page showed "4.1× return on Reels", "r/dubai 92% match", a Funnel screen, a Creators screen with "14 bookings", and "Listens to SEMrush, Modash, Reddit, Instagram". The FAQ said Chrysa connects to GA, Search Console, Instagram, Reddit, SEMrush and Modash. None of these exist in the app today. | A marketing director checks claims. One false number undoes the rest. |
| 2 | **Pricing promised features that don't exist.** Examples: "Creators & influencer data", "Competitor & paid-search insights", "Live campaign reporting", "Up to 10 seats", "Reddit listening". | People were being asked to pay for things they wouldn't get. |
| 3 | **Too busy.** 11 sections: hero with three floating cards, a chip strip, four feature rows, six mascot moods, promise band, FAQ of 8. Around 76 KB of HTML, mostly repeated inline SVG for mascot moods. | The value was hard to find in the first 30 seconds. |
| 4 | **The mascot was altered.** The "moods" painted new eyes over the approved glass character, and added sparkles and a red "!" badge. | It went against the brand rule: don't redesign the mascot. |
| 5 | **The free check was buried** fourth on the page, under a chip strip and the audience cards. | The main conversion path wasn't the obvious next step. |
| 6 | **Checkout showed "You save $99 a year" on monthly billing.** The CSS `display:flex` overrode the `hidden` attribute. | It was a wrong price statement at the moment of payment. |
| 7 | **"Talk to us" opened an old sign-up modal** left over from an earlier product (MarC), with its own styling. | It was a dead end that looked like a different company. |
| 8 | **Accessibility gaps.** No skip link, no visible focus style, form errors shown only as one line of text, and the reduced-motion setting still showed staggered states. | |

**What worked and is kept unchanged:**
- the free check API call (`POST app.chrysa.ai/api/reading` with site, name, email and rival, then a redirect to the private report);
- the backup copy of each request in the sign-up list (`MarcAuth.save` in auth.js);
- the bot trap;
- checkout's POST to `app.chrysa.ai/start`, which remembers the website and forwards to Stripe with the email filled in;
- the four live Stripe payment links;
- the billing toggle;
- the legal pages;
- the `/reading` → `/#reading` redirect.

## 2. Design system (`chrysa.css`)

- **Colour.** Ivory `#F8F5F1` page, paper `#FDFBF8` surfaces, cerulean `#A5BCD6` for halos, charts and tags, butter `#F5EFC6` for small notes. Oxblood `#4D0E12` is used only for the primary button and italic emphasis. Java `#231815` is the ink.
  - Secondary text `#6B5A52` passes AA at 5.6:1.
  - Cerulean text `#3E5776` is about 7:1.
- **Type.** Fraunces at weight 100 with the optical size at maximum for the wordmark and headlines, and Inter for everything else.
  - Fraunces is open source (SIL OFL), served by Google Fonts. It is the closest free match to Canela Thin.
  - Canela is a commercial Commercial Type font and is not licensed here. If you buy a web licence, change one variable: `--serif`.
- **Italics.** Used sparingly, in oxblood, on meaningful words: *next*, *found*, *free*, *less*, *time*, *today*, *useful*.
- **Motion.** Every motion uses the same easing, `cubic-bezier(.22,1,.36,1)`, with gentle fades and rises. No bounce, spin or zoom. Everything is switched off under `prefers-reduced-motion`.
- **Components:**
  - buttons: main, quiet, small;
  - pills;
  - cards;
  - form fields with error states;
  - an accessible tab set;
  - the reveal-on-scroll pattern.

## 3. Homepage structure and journeys

1. **Hero.** "Know your brand. Know what comes *next*." One supporting paragraph and one primary call to action, "Get your free AI visibility check". The secondary action is "See the product". The mascot sits to the side in a soft halo, with a quiet line that cycles through what the check does.
2. **The product.** Four tabbed views built from the real app screens: The check, Presence, Approvals, Ask Chrysa. A fictional brand (Halden) is used and clearly labelled as illustrative.
3. **How it works.** Three steps taken from the working product.
4. **Why teams keep it.** Time, repetitive tasks, avoidable costs, defensible decisions. Each is phrased as "designed to", with no statistics.
5. **Who it's for.** Independent businesses and established marketing teams. Agencies are pointed to email.
6. **Begin.** The free check form, then pricing: Free, Starter and Pro, with real prices and entitlements taken from the app.
7. **FAQ** (six honest answers), a closing call to action, and the footer.

**Main journey.** Every "free check" link scrolls to the form and puts the cursor in the first field.
- On submit, invalid fields are marked one by one.
- On success the private report opens.
- If the service can't be reached, the request is still saved and the page says so.

**Paid journey.**
1. Pricing.
2. `checkout.html`, which now defaults to Starter.
3. `app.chrysa.ai/start`.
4. Stripe.
5. Sign-in, where the plan is already active.

## 4. The opening

The opening lasts about four seconds.
1. An ivory veil.
2. The glass mascot settles in, sharpening as it rises.
3. A light sweep crosses the glass.
4. A small nod.
5. The wordmark resolves from wide spacing.
6. "A marketing mind you can *keep*." appears.
7. The veil lifts into the page.

The mascot artwork is used exactly as approved. Only position, opacity, a slight tilt and a highlight masked to its own outline are animated.

**When it plays:**
- It plays once per visitor every 30 days (localStorage).
- It never plays with reduced motion, and never on a deep link such as `/#pricing` or `/reading`.
- It is skipped if the tab opens in the background.

**How to skip it:** the visible "Skip intro" button, or any scroll, swipe, Escape, Enter or Space.

**Safety net:** a 6-second timer shows the page even if the script fails to load.

## 5. Testing done (local preview, Nov 20 2026)

- **Sizes.** Desktop 1440×900, tablet 768×1024 and phone 375×812, all with no horizontal overflow. The opening was checked on desktop and phone.
- **Every link on the homepage resolves.** In-page anchors exist, local pages return 200, and app.chrysa.ai/sign-in and the legal pages are live.
- **Free check form:**
  - empty and invalid input give per-field errors and move focus to the first one;
  - a 409 response shows the server's message;
  - 201 shows the confirmation and redirects;
  - the request body matches the live API contract.
  - Network calls and the sign-up save were **stubbed**, so no real check was started and no test row was written.
- **Checkout.** Monthly and yearly, Starter and Pro each build the correct POST to `app.chrysa.ai/start`; the form submit was stubbed. The savings row now hides on monthly.
- **Keyboard.** The product tabs support arrow keys, Home and End. The skip link and focus rings are visible.
- **No console errors.**

## 6. Not verified, and decisions for the owner

- **Starter and Pro unlock the same features in the app today.** Pro is presented honestly as "Everything in Starter, priority support, first in line for channel connections", with the connections marked as in review. Decide whether Pro should get something concrete, or whether you can stand behind "priority support".
- **"Cancel anytime" and "founding rate locked for life"** are carried over from the old site. Confirm that customers have a self-serve way to cancel, such as the Stripe customer portal. Otherwise the cancel path is by email.
- **Naming.** The brief suggested "Get your free brand reading". The site keeps "AI visibility check", which you chose after Lea's feedback.
- **Not tested on real devices:** Safari on iPhone, and slow 3G. The intro uses CSS masks and filters, which Safari supports, but they are untested there.
- **The app at app.chrysa.ai still uses Cormorant Garamond.** Bringing it onto Fraunces and this design system is a separate, small change in the chrysa-app repository.
- **Image weight.** The 480px mascot PNG is 280 KB. A WebP version would be about 60 KB, but no WebP encoder was available on this machine.
