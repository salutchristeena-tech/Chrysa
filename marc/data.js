/* MarC — content model · hospitality & F&B launch (Casa Limón Marina) */
window.MARC = {
  // Launch Command — today's flags
  priorities: [
    { score: "97", title: "Opening night is in 12 days — close the 3 readiness blockers", detail: "Press-dinner guest list, final menu photography, and Google Business verification are still open.", tag: "Readiness" },
    { score: "93", title: "Creator tasting is Thursday — confirm the last 3 of 8 creators", detail: "Shortlist ranks local reach and food-content fit; five confirmed, UGC rights cleared.", tag: "Creators" },
    { score: "88", title: "Opening press release needs the chef story signed off", detail: "The 'farm-to-fire' angle is approved by the GM; chef quote and imagery pending.", tag: "PR" },
    { score: "84", title: "Pre-opening reservations at 41% of target — send the waitlist drop", detail: "4,800 waitlist subscribers; drop is drafted and scheduled for T-7.", tag: "Bookings" },
    { score: "79", title: "Sequence opening week — don't stack the announcements", detail: "Press dinner → creator wave → public booking drop, each 48 hours apart.", tag: "Launch" }
  ],

  // Right rail — bookings by channel
  channels: [
    { name: "Instagram & creators", spend: "$14K", impact: "44% of reservations sourced", value: 84 },
    { name: "Google & Maps",        spend: "$8K",  impact: "27% — search & directions",   value: 58 },
    { name: "PR & listings",        spend: "$6K",  impact: "15% — earned coverage",       value: 36 },
    { name: "Email & waitlist",     spend: "$2K",  impact: "9% — owned list",             value: 24 },
    { name: "Delivery apps",        spend: "$5K",  impact: "5% — off-premise trial",      value: 16 }
  ],

  // Live now
  campaigns: [
    { title: "Opening: Casa Limón Marina",   status: "T-minus 12", detail: "Readiness 86% · 3 blockers open · press dinner set" },
    { title: "Creator tastings — wave two",  status: "Running",    detail: "8 creators · 2.1M local reach · UGC rights cleared" },
    { title: "Waitlist → booking drop",      status: "Scheduled",  detail: "4,800 subscribers · drop lands at T-7" }
  ],

  // Guests & Positioning — segments
  ideas: [
    { title: "Food-scene tastemakers — local", detail: "The first hundred tables set the narrative. Message: 'the table everyone's talking about.'", meta: ["Primary launch", "Creators + PR", "Fit 9/10"] },
    { title: "After-work professionals — nearby offices", detail: "Weeknight covers within walking distance. Message: 'golden hour on the marina.'", meta: ["Weeknight covers", "Instagram + email", "Fit 8/10"] },
    { title: "Weekend families & brunch", detail: "Daytime volume once the room is proven. Message: 'long lunches, short waits.'", meta: ["Daytime covers", "Maps + paid local", "Fit 8/10"] },
    { title: "Hotel guests & visitors", detail: "High spend per head, zero loyalty cost. Message: 'the local table concierges recommend.'", meta: ["High spend", "Concierge + guides", "Fit 7/10"] }
  ],

  newIdea: { title: "Celebrations — birthdays & groups", detail: "Review mining shows large-party demand unserved within 3km; prepaid set menus de-risk the kitchen.", meta: ["Exploratory", "Email + Maps", "Fit TBD"] },

  // Launch lifecycle
  timeline: [
    ["Position", "Lock the story: the chef, the room, and the three dishes people will photograph."],
    ["Enable",   "Menus, photography, listings, booking links, and the press kit — ready before the noise."],
    ["Announce", "Press dinner, creator tastings, then the public booking drop, in sequence."],
    ["Convert",  "Waitlist email, paid local, and Maps capture the demand within 48 hours."],
    ["Measure",  "Covers, show rate, review scores, and repeat visits feed the next push."]
  ],

  // Channels & Campaigns (grid)
  creatives: [
    { title: "Creators — opening tastings",  format: "Creators", ratio: "CR",  hook: 28,  hold: 6.2, cpl: "$9K", spend: "Running",   verdict: "Scale",    state: "win" },
    { title: "Paid local — 3km radius",      format: "Paid",     ratio: "GEO", hook: 412, hold: 4.1, cpl: "$6K", spend: "Running",   verdict: "Scale",    state: "win" },
    { title: "Maps & local search",          format: "Search",   ratio: "MAP", hook: 188, hold: 9.4, cpl: "$2K", spend: "Running",   verdict: "On track", state: "hold" },
    { title: "PR — opening coverage",        format: "Press",    ratio: "PR",  hook: 12,  hold: 31,  cpl: "$6K", spend: "Running",   verdict: "Watch",    state: "watch" },
    { title: "Waitlist email drop",          format: "Email",    ratio: "EM",  hook: 48,  hold: 12,  cpl: "$1K", spend: "Scheduled", verdict: "Hold",     state: "hold" },
    { title: "Delivery launch — week 3",     format: "Delivery", ratio: "DLV", hook: 0,   hold: 0,   cpl: "$5K", spend: "Planning",  verdict: "Hold",     state: "hold" }
  ],

  testing: [
    { title: "Message test: 'golden hour'", detail: "The sunset-terrace reel outperforms food close-ups 2.4× on saves — rolling into paid this week." },
    { title: "Top channel: creators", detail: "Tasting UGC drives profile visits at $3.10 each — the best efficiency in the mix." },
    { title: "Watch: brunch awareness", detail: "Weekend searches are rising but profile-to-booking lags; the brunch menu page isn't live yet." }
  ],

  research: [
    { title: "Review mining", detail: "Competitor reviews within 3km cite wait times and noise — both are positioning openings for us." },
    { title: "Pricing sweet spot", detail: "$58–72 per head reads as 'special but repeatable' in guest interviews." },
    { title: "Group demand", detail: "Birthdays and celebrations are unserved nearby; prepaid set menus test next month." }
  ],

  // Bookings & Revenue — funnel
  funnel: [
    { stage: "Local reach",    count: "1.4M",  value: "All channels, this month",   bar: 100, conv: "3.1% to profile" },
    { stage: "Profile visits", count: "43K",   value: "Instagram + Maps",           bar: 62,  conv: "9% to booking" },
    { stage: "Reservations",   count: "3,860", value: "Opening month on the books", bar: 34,  conv: "88% show rate" },
    { stage: "Seated covers",  count: "3,420", value: "Projected, opening month",   bar: 22,  conv: "$76 avg spend" }
  ],

  // Launch readiness board
  sla: [
    { channel: "Casa Limón Marina — opening", time: "T-12",    note: "86% ready · 3 blockers",          state: "warn", sub: "Opens June 23" },
    { channel: "Weekend brunch launch",       time: "T-33",    note: "Menu in tasting",                 state: "good", sub: "Weekends from July" },
    { channel: "Delivery launch",             time: "T-26",    note: "Platform onboarding",             state: "warn", sub: "Two apps at launch" },
    { channel: "Loyalty soft launch",         time: "Shipped", note: "1,200 waitlist members enrolled", state: "good", sub: "Last week" }
  ],

  // Source quality table
  sources: [
    ["Instagram & creators", "1,690", "86%", "31%"],
    ["Google & Maps",        "1,040", "91%", "38%"],
    ["PR & listings",        "580",   "84%", "22%"],
    ["Email & waitlist",     "350",   "94%", "46%"]
  ],

  // Assets & Partners
  agencySummary: [
    { label: "Launch assets live",     figure: "18",  note: "Menus, photography, press kit" },
    { label: "Avg. creator reach",     figure: "86K", note: "Per tasting post" },
    { label: "Active partners",       figure: "7",   note: "Delivery, concierge, guides" },
    { label: "Partner-sourced covers", figure: "640", note: "This quarter" }
  ],

  agencies: [
    { name: "Menu & photography kit",  discipline: "Hero dishes + the room",  region: "All channels", retainer: "v3", deliverables: "42 assets",         perf: 94, status: "Live",     state: "ontrack" },
    { name: "Press kit — chef story",  discipline: "Opening narrative",       region: "Media",        retainer: "v2", deliverables: "Kit + imagery",     perf: 88, status: "Live",     state: "ontrack" },
    { name: "Creator tasting kit",     discipline: "UGC brief + rights",      region: "Creators",     retainer: "v2", deliverables: "Brief + terms",     perf: 82, status: "Updating", state: "renewing" },
    { name: "Booking links & landing", discipline: "Reservation funnel",      region: "All channels", retainer: "v1", deliverables: "Pages + tracking",  perf: 58, status: "Blocked",  state: "review" },
    { name: "Concierge one-pager",     discipline: "Hotel referral network",  region: "Concierges",   retainer: "v1", deliverables: "Print + QR",        perf: 76, status: "Live",     state: "ontrack" }
  ],

  bench: [
    ["OpenTable",        "Reservations platform", "City-wide",  "Active",     "Opening-week boost placement"],
    ["Deliveroo",        "Delivery partner",      "3km radius", "Onboarding", "Launch in week three"],
    ["Tourism board",    "City guides",           "Visitors",   "Active",     "Summer dining guide feature"],
    ["Hotel concierges", "Referral network",      "5 hotels",   "Ramping",    "Tasting for head concierges"]
  ],

  creators: [
    { title: "Sourcing",     detail: "Creators, concierges, and guides mapped to the neighbourhood and the menu." },
    { title: "Enabling",     detail: "Tasting invites, UGC briefs, booking links, and usage rights in partners' hands." },
    { title: "Co-promoting", detail: "Seven active partners; opening-week features locked." },
    { title: "Measuring",    detail: "Partner-sourced covers and repeat visits tracked separately from paid." }
  ],

  // Marketing Stack
  integrations: [
    ["Instagram",        "Content, creators, DMs · 44% of bookings sourced", "Live",    "IG"],
    ["Google Business",  "Maps, search, reviews · directions & calls",       "Live",    "GB"],
    ["OpenTable",        "Reservations, show rates, guest notes",            "Live",    "OT"],
    ["Meta Ads",         "Paid local · 3km radius campaigns",                "Live",    "MA"],
    ["Mailchimp",        "Waitlist, booking drops, post-visit flows",        "Live",    "MC"],
    ["TikTok",           "Short-form · tastings & room reveals",             "Live",    "TT"],
    ["SevenRooms",       "Guest profiles, tags, repeat behaviour",           "Pending", "SR"],
    ["Deliveroo",        "Off-premise orders & menu mix",                    "Pending", "DL"],
    ["TripAdvisor",      "Reviews & visitor demand",                         "Pending", "TA"],
    ["Toast POS",        "Covers, spend per head, menu mix",                 "Manual",  "TP"],
    ["WhatsApp Business","Group bookings & the concierge line",              "Manual",  "WA"],
    ["Canva",            "Menus, stories, and print",                        "Manual",  "CV"]
  ],

  // Competitive Set — category-aware (any ambitious brand)
  competitive: {
    beauty: {
      label: "Beauty & Skincare",
      you: { name: "Luméa", tagline: "Your brand", rating: "4.6", reviews: "12.4K", followers: "318K", growth: "+4.2%", sov: 22, rank: "#3 of 5" },
      headline: [
        { label: "Share of voice", figure: "22%", note: "+3 pts this month", state: "good" },
        { label: "Rating vs set",  figure: "4.6", note: "Set average 4.5", state: "good" },
        { label: "Follower growth", figure: "+4.2%", note: "Fastest in the set", state: "good" },
        { label: "Press momentum", figure: "#2", note: "Behind Gloria", state: "warn" }
      ],
      rivals: [
        { name: "Gloria", rating: "4.7", rdelta: "+0.1", social: "612K", sdelta: "+2.1%", sov: 34, momentum: 84, note: "Owns the 'clean beauty' story; heavy creator seeding", state: "win" },
        { name: "Aera", rating: "4.4", rdelta: "−0.1", social: "286K", sdelta: "+1.4%", sov: 18, momentum: 52, note: "Price-led; discount cadence fatiguing the audience", state: "watch" },
        { name: "Norr", rating: "4.5", rdelta: "+0.2", social: "204K", sdelta: "+6.8%", sov: 14, momentum: 71, note: "Surging on TikTok with a single hero serum", state: "win" },
        { name: "Veil", rating: "4.3", rdelta: "0.0", social: "150K", sdelta: "−0.5%", sov: 12, momentum: 33, note: "Stalled — little new content this quarter", state: "down" }
      ],
      signals: [
        { tag: "Social", text: "Norr's hero-serum reel hit 2.1M views — TikTok is where the set is shifting." },
        { tag: "Reviews", text: "Gloria's rating dipped 0.1 on shipping complaints — a service opening for you." },
        { tag: "Press", text: "Three set rivals featured in a 'clean beauty' roundup; you were not included." }
      ],
      move: "Norr is winning TikTok with one hero product. Run a single-hero creator wave on your best-reviewed serum this month — and pitch the 'clean beauty' roundup editor while Gloria's shipping complaints are live."
    },
    hospitality: {
      label: "Hospitality & F&B",
      you: { name: "Casa Limón", tagline: "Your venue", rating: "4.7", reviews: "1.9K", followers: "48K", growth: "+11%", sov: 28, rank: "#2 of 5" },
      headline: [
        { label: "Share of voice", figure: "28%", note: "+6 pts pre-opening", state: "good" },
        { label: "Rating vs set",  figure: "4.7", note: "Highest in the set", state: "good" },
        { label: "Follower growth", figure: "+11%", note: "Opening buzz building", state: "good" },
        { label: "Booking demand", figure: "#2", note: "Behind Marea", state: "warn" }
      ],
      rivals: [
        { name: "Marea", rating: "4.6", rdelta: "0.0", social: "92K", sdelta: "+1.2%", sov: 31, momentum: 76, note: "Incumbent; strong weekend brunch reputation", state: "win" },
        { name: "Lido", rating: "4.4", rdelta: "−0.2", social: "61K", sdelta: "+0.4%", sov: 19, momentum: 48, note: "Slipping on wait-time and noise complaints", state: "watch" },
        { name: "Sable", rating: "4.5", rdelta: "+0.1", social: "54K", sdelta: "+5.1%", sov: 13, momentum: 69, note: "Rising fast with sunset-terrace content", state: "win" },
        { name: "Quay", rating: "4.2", rdelta: "0.0", social: "38K", sdelta: "−1.0%", sov: 9, momentum: 30, note: "Quiet — minimal social or press activity", state: "down" }
      ],
      signals: [
        { tag: "Reviews", text: "Lido's rating fell on wait-time complaints — your pacing fix is a direct counter-message." },
        { tag: "Social", text: "Sable's sunset-terrace reels are outperforming — your 'golden hour' angle competes head-on." },
        { tag: "Press", text: "Marea landed the city's summer dining guide; you can still pitch the opening-night angle." }
      ],
      move: "Lido is bleeding on wait-times and Sable is winning with sunset content. Lead opening week with your 'golden hour, no wait' angle, and pitch the dining-guide editor a fresh opening-night story before Marea owns the season."
    },
    dtc: {
      label: "DTC & Tech",
      you: { name: "Northwind", tagline: "Your product", rating: "4.5", reviews: "3.2K", followers: "126K", growth: "+7.4%", sov: 19, rank: "#3 of 5" },
      headline: [
        { label: "Share of voice", figure: "19%", note: "+2 pts this month", state: "good" },
        { label: "Rating vs set",  figure: "4.5", note: "Set average 4.4", state: "good" },
        { label: "Follower growth", figure: "+7.4%", note: "Second fastest", state: "good" },
        { label: "Review volume", figure: "#4", note: "Thin vs leaders", state: "warn" }
      ],
      rivals: [
        { name: "Cardinal", rating: "4.6", rdelta: "+0.1", social: "410K", sdelta: "+3.2%", sov: 33, momentum: 81, note: "Category leader; strong founder-led content", state: "win" },
        { name: "Beacon", rating: "4.3", rdelta: "−0.1", social: "240K", sdelta: "+0.8%", sov: 21, momentum: 50, note: "Heavy paid spend, weak organic pull", state: "watch" },
        { name: "Tally", rating: "4.4", rdelta: "+0.3", social: "98K", sdelta: "+9.1%", sov: 15, momentum: 74, note: "Breaking out via a referral loop", state: "win" },
        { name: "Mesa", rating: "4.1", rdelta: "0.0", social: "70K", sdelta: "−0.7%", sov: 12, momentum: 31, note: "Losing momentum after a pricing change", state: "down" }
      ],
      signals: [
        { tag: "Social", text: "Tally's referral loop drove +9% follower growth — the set's fastest organic engine." },
        { tag: "Reviews", text: "Cardinal added 600 reviews this month; your volume is thin and under-credits your 4.5." },
        { tag: "Press", text: "Beacon is buying reach but getting little earned coverage — an organic opening for you." }
      ],
      move: "Cardinal wins on review volume and Tally on referral loops. Launch a post-purchase review-and-refer flow this month — it closes your review-volume gap and borrows Tally's growth engine while Beacon's paid-only play leaves earned coverage open."
    }
  },

  // Reporting
  reports: {
    monthly: {
      heading: "Casa Limón Marina — Opening Readout (T-12)",
      lede: "Opening month holds 3,860 reservations (41% of target) with creators and Maps doing the heavy lifting. Three readiness blockers stand between today and a clean opening night.",
      diagnosis: { label: "Channel readout", body: "Creator tastings deliver profile visits at $3.10 — the best efficiency in the mix — and the 'golden hour' message beats food close-ups 2.4× on saves. The booking landing page is the bottleneck: it's blocked, and every channel funnels through it." },
      recommendation: "Close the three blockers this week, send the waitlist drop at T-7, and sequence opening week — press dinner, then the creator wave, then the public booking drop, 48 hours apart."
    },
    campaign: {
      heading: "Owner Brief — Marketing Performance",
      lede: "Revenue on the books stands at $612K for opening month at $76 average spend per head, with an 88% projected show rate.",
      diagnosis: { label: "Ownership view", body: "The channel mix is healthy but concentrated: Instagram sources 44% of reservations. Maps and email are the cheapest covers and growing. The principal risk is opening-night execution — service pacing was flagged at the soft launch." },
      recommendation: "Approve opening-week spend as planned, hold brunch advertising until the menu is final, and greenlight the delivery launch for week three once the room finds its rhythm."
    },
    board: {
      heading: "Guest & Review Summary — Pre-opening",
      lede: "Soft-launch feedback averaged 4.7/5 with the terrace and the squid-ink rice cited most; service pacing and noise are the two flags to fix before the press dinner.",
      diagnosis: { label: "Patterns", body: "Photographable dishes drive saves and shares — the three hero dishes account for 70% of tagged content. Competitor reviews nearby complain about waits and noise, which our pacing fix and room treatment directly answer." },
      recommendation: "Fix pacing before the press dinner, seed review requests to the first 200 covers, and mine reviews weekly so the menu and messaging keep learning."
    }
  }
};
