# Chrysa — Payments setup (≈10 minutes)

The checkout flow is live: **Landing → Pricing → `Checkout.html` → Stripe**.
Card details never touch your site — Stripe hosts the payment page. No backend needed.

## 1. Create the products in Stripe
1. Sign up / log in at https://dashboard.stripe.com
2. **Product catalog → Add product**
   - `Chrysa Solo` — recurring, $29 / month
   - `Chrysa Growth` — recurring, $129 / month

## 2. Create a Payment Link for each
1. **Payment links → New** (or from each product's page)
2. Pick the product/price, enable **"Collect customers' email"**
3. Optional: set a confirmation redirect to your dashboard URL
4. Copy the link — it looks like `https://buy.stripe.com/xxxx`

## 3. Paste the links into Checkout.html
Open `Checkout.html`, near the top:

```js
window.CHRYSA_PAYMENT_LINKS = {
  solo:   "https://buy.stripe.com/xxxx",
  growth: "https://buy.stripe.com/yyyy"
};
```

Done. The pay button now redirects to Stripe's secure checkout with the
customer's email prefilled. Enterprise routes to `hello@chrysa.ai`.

## Test mode first
Use Stripe **test mode** links today (toggle in the dashboard) and card
`4242 4242 4242 4242`, any future expiry, any CVC. Swap in live links when
you're ready to charge real cards.

## Notes
- Founding-rate promise: in Stripe, prices are locked per subscription by
  default — existing subscribers keep $29/$129 even if you raise prices later.
- Refunds, invoices, dunning, tax (Stripe Tax) are all handled in the Stripe
  dashboard — nothing to build.
- When you deploy, keep `Checkout.html` at the site root so the pricing
  buttons (`Checkout.html?plan=solo|growth`) keep working.
