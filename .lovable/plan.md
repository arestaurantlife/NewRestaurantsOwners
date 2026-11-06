# Stripe audit (read-only) and steps to go live

## Findings
1. **Mode: TEST.** The connected Stripe account is named "Corporate Shield Hospitality Services sandbox", and every price reports livemode = false, so the key is a test (`sk_test`) key. Stripe secrets present: `STRIPE_SECRET_KEY` only. There is no publishable key in use (checkout is server-created), and no `STRIPE_WEBHOOK_SECRET`.
2. **Account status / bank: not verifiable here.** The available Stripe tools don't allow reading charges_enabled, payouts_enabled, requirements or the payout bank account. Because this is a sandbox, the Bluevine account is linked to the live account, not this one. Check it in Stripe under Settings → Payouts (live mode).
3. **Plans exist (test mode only):**
   - Starter $47/mo: price_1SnFjL7hlrnyTBF1Yy2TWm9C. The 7-day trial is added at checkout, not stored on the price. That's fine.
   - Professional $97/mo: price_1SnFjg7hlrnyTBF1ZJ5this6
   - Enterprise $197/mo: price_1SnFkL7hlrnyTBF1VP2iYmm3
   None of these exist in live mode. Live mode will give them new IDs.
4. **Webhook: none configured.** There are 0 endpoints and no signing secret. The site's webhook handles trial_will_end, invoice.payment_failed, subscription.updated and subscription.deleted. Until an endpoint exists, the trial reminder and failed-payment emails won't send.

## Steps to switch to live payments
1. In Stripe live mode, finish account activation and confirm payouts go to the Bluevine account.
2. Create the three live products and prices ($47, $97, $197 monthly).
3. Replace the Stripe secret key with the live `sk_live` key (Connectors / Project Settings).
4. Update the code to use the live price and product IDs. Today they are hard-coded in checkout, plan check, training, content access and webhook functions. Then clear any test `stripe_price_id` values on eBooks so live ones are created.
5. Add a live webhook endpoint for `/functions/v1/stripe-webhook` with the 4 events, and save its signing secret as `STRIPE_WEBHOOK_SECRET`.
6. In live mode, set up the customer portal (update card and cancel) and receipt emails with the /refunds and /terms links.
7. Make one small real purchase and refund it, then publish.

Approving this plan only does step 4 after you give me the live IDs. Nothing changes until then.
