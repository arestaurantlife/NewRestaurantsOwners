# Starter-only 7-day trial and billing visibility

Billing changes only. The look of the site stays the same everywhere except the new "Your Plan" card and the small note under the Starter button.

## What changes for customers
- Only the Starter plan gets a 7-day free trial. It's limited to one trial per email: anyone who has ever had a subscription, including one that was cancelled or expired, is charged right away. A card is always required.
- Professional and Enterprise never get a trial. Their buttons say "Subscribe".
- People on a trial count as subscribers. They get full access, and the site shows "Trial" with the trial end date.
- The dashboard gets a "Your Plan" card. It shows the plan, the status (Trial / Active / None) and the trial end or renewal date. Subscribers see a "Manage Billing" button and non-subscribers see "View Plans". After checkout, the dashboard refreshes the plan and shows a welcome message.
- Checkout and billing pages send customers back to newrestaurantsowners.com instead of the lovable.app address.

## Steps
1. **create-checkout**: check the Stripe customer's subscriptions of every status. For the Starter price, when the customer has none, add `subscription_data.trial_period_days = 7` and `payment_method_collection = "always"`. New customers (no Stripe record yet) are eligible, and `customer_email` is kept for them. The "already subscribed" block now also covers `trialing`, so a trial user can't start a second checkout. Add the two newrestaurantsowners.com origins to the allowlist and use `https://newrestaurantsowners.com` as the fallback.
2. **customer-portal**: same allowlist and fallback change.
3. **check-subscription**: list subscriptions of every status and pick the first `active` or `trialing` one. Return `subscribed`, `tier`, `subscription_end`, `status` and `trial_end` (ISO or null). If there's no match, status is null.
4. **AuthContext**: add `status` and `trialEnd` to the subscription state. Remove the 60-second interval. Check on login or session change, on window focus, and when the URL has `?checkout=success`.
5. **Pricing.tsx**: Starter button "Start 7-Day Free Trial", others "Subscribe". New default subtitle as provided. Add small muted text under the Starter button: "Card required. Billed $47/month after 7 days unless cancelled."
6. **CTA.tsx defaults**: new button label and footnote as provided.
7. **Dashboard.tsx**: add the "Your Plan" card above the feature grid, using existing Card and Button styles. "Manage Billing" opens the billing page that `customer-portal` returns, in a new tab with a same-tab fallback, and shows an error toast if that fails. On `?checkout=success`, call `checkSubscription()`, show "Welcome aboard!" and remove the query from the URL.
8. Redeploy create-checkout, customer-portal and check-subscription.

## Notes
- Saved homepage layouts in the page editor keep their saved text. If the Pricing or CTA wording was already edited and published there, the new defaults won't show until you update those sections in the editor.
- The "Manage Billing" page needs the Stripe customer portal turned on in your Stripe account. If it's already on, nothing to do.

## Files
- supabase/functions/create-checkout/index.ts
- supabase/functions/customer-portal/index.ts
- supabase/functions/check-subscription/index.ts
- src/contexts/AuthContext.tsx
- src/components/Pricing.tsx
- src/components/CTA.tsx
- src/pages/Dashboard.tsx
