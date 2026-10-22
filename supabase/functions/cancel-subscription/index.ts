// One-click cancellation: sets cancel_at_period_end on the caller's active or trialing subscription.
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });
    const token = (req.headers.get("Authorization") ?? "").replace("Bearer ", "");
    if (!token) return json({ error: "Please sign in" }, 401);
    const { data: u } = await admin.auth.getUser(token);
    const user = u?.user;
    if (!user?.email) return json({ error: "Please sign in" }, 401);

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, { apiVersion: "2023-10-16" });
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    if (!customers.data.length) return json({ error: "No subscription found" }, 404);
    const subs = await stripe.subscriptions.list({ customer: customers.data[0].id, status: "all", limit: 20 });
    const sub = subs.data.find((s) => s.status === "active" || s.status === "trialing");
    if (!sub) return json({ error: "No active subscription found" }, 404);

    const updated = sub.cancel_at_period_end
      ? sub
      : await stripe.subscriptions.update(sub.id, { cancel_at_period_end: true });
    const endTs = updated.status === "trialing" && updated.trial_end ? updated.trial_end : updated.current_period_end;
    return json({ ok: true, access_until: new Date(endTs * 1000).toISOString() });
  } catch (e) {
    console.error("[CANCEL-SUBSCRIPTION]", e);
    return json({ error: "Could not cancel. Please try again." }, 500);
  }
});
