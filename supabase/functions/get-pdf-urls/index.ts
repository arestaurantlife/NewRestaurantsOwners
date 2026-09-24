import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { auth: { persistSession: false } },
    );
    const token = (req.headers.get("Authorization") ?? "").replace("Bearer ", "");
    if (!token) return json({ allowed: false, reason: "signin" });
    const { data: u } = await admin.auth.getUser(token);
    const user = u?.user;
    if (!user?.email) return json({ allowed: false, reason: "signin" });

    const { featureSlug } = await req.json().catch(() => ({}));
    if (typeof featureSlug !== "string" || !featureSlug || featureSlug.length > 100) {
      return json({ error: "Invalid request" }, 400);
    }

    const { data: roleRow } = await admin
      .from("user_roles").select("role").eq("user_id", user.id).eq("role", "admin").maybeSingle();
    let allowed = !!roleRow;

    if (!allowed) {
      const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, { apiVersion: "2023-10-16" });
      const customers = await stripe.customers.list({ email: user.email, limit: 1 });
      if (customers.data.length) {
        for (const status of ["active", "trialing"] as const) {
          const subs = await stripe.subscriptions.list({ customer: customers.data[0].id, status, limit: 1 });
          if (subs.data.length) { allowed = true; break; }
        }
      }
    }
    if (!allowed) return json({ allowed: false, reason: "subscribe" });

    const { data: rows } = await admin
      .from("feature_pdfs").select("id, feature_slug, title, description, storage_path, sort_order, tags, created_at").eq("feature_slug", featureSlug)
      .order("sort_order", { ascending: true }).order("created_at", { ascending: true });
    const urls: Record<string, string> = {};
    await Promise.all((rows ?? []).map(async (r) => {
      const { data } = await admin.storage.from("feature-pdfs").createSignedUrl(r.storage_path, 3600);
      if (data?.signedUrl) urls[r.id] = data.signedUrl;
    }));
    return json({ allowed: true, urls, rows: rows ?? [] });
  } catch (e) {
    console.error("[GET-PDF-URLS]", e);
    return json({ error: "Could not load documents" }, 500);
  }
});
