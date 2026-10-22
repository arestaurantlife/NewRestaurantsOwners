// Stripe webhook: sends the trial reminder on customer.subscription.trial_will_end
// (Stripe fires it 3 days before a trial converts). Requires STRIPE_WEBHOOK_SECRET.
import Stripe from "https://esm.sh/stripe@14.21.0";
import { sendTemplateEmail } from "../_shared/transactional-email-templates/send-email.ts";

const STARTER_PRODUCT = "prod_TklF0dW7NLmDbW";

Deno.serve(async (req) => {
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });
  const secret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
  if (!secret) {
    console.error("[STRIPE-WEBHOOK] STRIPE_WEBHOOK_SECRET is not set");
    return new Response("Webhook not configured", { status: 500 });
  }
  const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, { apiVersion: "2023-10-16" });
  const sig = req.headers.get("stripe-signature") ?? "";
  const body = await req.text();
  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(body, sig, secret, undefined, Stripe.createSubtleCryptoProvider());
  } catch (e) {
    console.error("[STRIPE-WEBHOOK] bad signature", e);
    return new Response("Invalid signature", { status: 400 });
  }

  try {
    if (event.type === "customer.subscription.trial_will_end") {
      const sub = event.data.object as Stripe.Subscription;
      const item = sub.items.data[0];
      if (item?.price.product !== STARTER_PRODUCT || !sub.trial_end) return new Response("ignored");
      const customer = await stripe.customers.retrieve(sub.customer as string);
      if (customer.deleted || !customer.email) return new Response("no email");
      const amount = item.price.unit_amount ? `$${(item.price.unit_amount / 100).toFixed(0)}/month` : "$47/month";
      const trialEnd = new Date(sub.trial_end * 1000).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });
      const result = await sendTemplateEmail("trial-ending", customer.email, {
        templateData: { name: customer.name?.split(" ")[0] ?? "", trialEnd, amount },
        idempotencyKey: `trial-ending-${sub.id}-${sub.trial_end}`,
      });
      console.log("[STRIPE-WEBHOOK] trial reminder", { sub: sub.id, result });
    }
    return new Response(JSON.stringify({ received: true }), { headers: { "Content-Type": "application/json" } });
  } catch (e) {
    console.error("[STRIPE-WEBHOOK] handler error", e);
    return new Response("Handler error", { status: 500 });
  }
});
