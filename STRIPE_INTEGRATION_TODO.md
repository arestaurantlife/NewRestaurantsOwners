# Stripe Integration TODO

## Values to Replace

There are no placeholder values. All `mode`, `success_url`, `cancel_url`, and `line_items` values are real and were preserved exactly, including subscription Price IDs, the bundle's existing `price_data`, and the individual eBook Price ID.

## Configured Parameters

- [Subscription checkout](supabase/functions/create-checkout/index.ts)
- [eBook checkout (bundle and single eBook)](supabase/functions/ebook-checkout/index.ts)

| Parameter | create-checkout | ebook-checkout (both calls) |
| --- | --- | --- |
| `mode` | `"subscription"` (preserved) | `"payment"` (preserved) |
| `ui_mode` | `"hosted"` | `"hosted"` |
| `billing_address_collection` | `"auto"` | `"auto"` |
| `phone_number_collection` | `{ enabled: false }` | `{ enabled: false }` |
| `automatic_tax` | `{ enabled: false }` | `{ enabled: false }` |
| `integration_identifier` | `"hosted_web_0001"` | `"hosted_web_0001"` |
| `origin_context` | `"web"` | `"web"` |
| `allow_promotion_codes` | `true` (preserved) | `false` |
| `payment_method_collection` | `"always"` (unconditional) | Not added |
| `submit_type` | Not added | `"auto"` |

`allow_promotion_codes` stays `true` for subscriptions by owner decision; Checkout Studio had `false`.

Existing customer parameters, line items, return URLs, consent/product/user metadata, subscription metadata and conditional Starter `trial_period_days: 7`, and eBook `payment_intent_data` were preserved. Minimal `Stripe.Checkout.SessionCreateParams` casts accommodate fields absent from the older SDK types without changing the SDK or API version.

## Notes

- `ui_mode` is `"hosted"` because the SDK is `stripe@14.21.0`. Switch to `"hosted_page"` only if the SDK is upgraded to `21.0.0+`. API version remains `"2023-10-16"`.
- Automatic tax is disabled. Review sales-tax obligations for digital subscriptions with an accountant before launch.
- Compatibility verification (2026-11-06): both functions deployed successfully. Authenticated requests to subscription checkout (Starter) and bundle checkout returned HTTP 200 with Stripe hosted Checkout URLs; no payment was made. Stripe accepted `integration_identifier` and `origin_context` in both exercised calls and `submit_type: "auto"` in bundle checkout; no fields were removed. Subscription logs confirm session creation without unknown-parameter errors; the eBook log query returned no entries, so its HTTP 200 response is the behavior evidence. The individual-eBook branch has identical added parameters but was not exercised: there is no published eligible single eBook with an existing Stripe Price ID, and testing must not create products/prices or change the catalog. Its runtime acceptance remains unverified.

## Setup and Next Steps

- `STRIPE_SECRET_KEY` stays in Supabase secrets (Lovable Cloud Project Settings → Secrets), never in `.env` or client code. Only a publishable key would ever use a `VITE_` prefix.
- Subscription flow: pricing page → `create-checkout` → Stripe hosted page → `stripe-webhook` → dashboard. The existing webhook and membership logic were not changed.
- eBook flow: library → `ebook-checkout` → Stripe → library. Existing purchase/access logic was not changed.
- In Stripe **test mode only**, use `4242 4242 4242 4242` with any future expiry and valid CVC; use `4000 0000 0000 9995` for a declined card. Never submit test cards to live-mode Checkout.
- Going live requires the business bank account and live keys, with matching live products/prices and webhook configuration.
- Resources: https://support.stripe.com and https://docs.stripe.com/mcp