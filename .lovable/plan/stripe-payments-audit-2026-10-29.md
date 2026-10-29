# Stripe payments audit

## Findings

1. **Connected: yes, test mode only.** The connected account is "Corporate Shield Hospitality Services sandbox", and every price is in test mode. No real money can be collected yet.
2. **Plans match.** Starter is $47/month with a 7-day trial. The trial is added at checkout, requires a card, and is limited to one per email. Professional is $97/month with the "Most Popular" label and no trial. Enterprise is $197/month with no trial. The trial is set at checkout, not on the Stripe price itself. That is fine.
3. **Checkout flow: built correctly, but not tested end to end in this audit.** The flow goes from the pricing page to Stripe Checkout, then back to the dashboard. The plan is then read live from Stripe, so it unlocks within seconds. A sandbox test-card run for each plan has not been done.
4. **Webhook: partial.** A webhook exists, but it only handles the "trial ending" reminder. It has no signing secret yet, so it is inactive. Plan changes, cancellations and failed payments still show up correctly, because access is checked live with Stripe on every login and every minute. No webhook is needed for access. But there is no email or alert when a payment fails.
5. **Billing portal: yes.** The "Manage Billing" button opens Stripe's billing portal, and there is a separate "Cancel subscription" button. In Stripe, the portal settings must allow updating cards and cancelling. This has not been checked.
6. **Legal links: yes.** Each plan has a required "I agree to the Terms of Service and Refund Policy" checkbox, with links that open in a new tab. The footer links to /terms, /privacy and /refunds. /privacy is not linked right next to the checkout buttons.

## Missing or broken

- The site is on test (sandbox) keys, so going live needs live keys and live products and prices.
- The webhook needs a signing secret and needs to handle failed payments.
- No sandbox end-to-end checkout test has been run.

## Plan to fix

1. Run a sandbox checkout with a test card for each plan, and confirm the right plan unlocks on the dashboard.
2. Add failed-payment handling to the webhook: send the member a "payment failed, update your card" email with a billing portal link. Also handle subscription updated and deleted events for logging only. Access stays based on the live Stripe check.
3. Optional: add a Privacy Policy link next to the checkbox.
4. Going live, which you do in Stripe: switch to live keys and create the live products and prices. I then update the three price and product IDs in the code. Add the webhook endpoint with these events: trial_will_end, invoice.payment_failed, and customer.subscription.updated and deleted. Save its signing secret. Turn on the billing portal's card update and cancel options.
