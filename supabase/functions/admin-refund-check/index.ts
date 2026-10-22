// Admin-only: first paid charge date (from Stripe) plus every logged access for a user email.
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
    const { data: u } = await admin.auth.getUser(token);
    if (!u?.user) return json({ error: "Please sign in" }, 401);
    const { data: roleRow } = await admin.from("user_roles").select("role").eq("user_id", u.user.id).eq("role", "admin").maybeSingle();
    if (!roleRow) return json({ error: "Admins only" }, 403);

    const { email } = await req.json().catch(() => ({}));
    if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) || email.length > 255) {
      return json({ error: "Enter a valid email" }, 400);
    }
    const target = email.trim().toLowerCase();

    const { data: profile } = await admin.from("profiles").select("user_id, email").ilike("email", target).maybeSingle();

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, { apiVersion: "2023-10-16" });
    const customers = await stripe.customers.list({ email: target, limit: 10 });
    let firstPaidAt: number | null = null;
    for (const c of customers.data) {
      const charges = await stripe.charges.list({ customer: c.id, limit: 100 });
      for (const ch of charges.data) {
        if (ch.paid && ch.status === "succeeded" && ch.amount > 0) {
          if (firstPaidAt === null || ch.created < firstPaidAt) firstPaidAt = ch.created;
        }
      }
    }

    let logs: unknown[] = [];
    if (profile?.user_id) {
      const { data } = await admin.from("content_access_log")
        .select("content_id, content_title, content_type, action, accessed_at")
        .eq("user_id", profile.user_id).order("accessed_at", { ascending: true }).limit(1000);
      logs = data ?? [];
    }
    return json({
      found: !!profile || customers.data.length > 0,
      email: target,
      first_paid_at: firstPaidAt ? new Date(firstPaidAt * 1000).toISOString() : null,
      logs,
    });
  } catch (e) {
    console.error("[ADMIN-REFUND-CHECK]", e);
    return json({ error: "Lookup failed" }, 500);
  }
});
