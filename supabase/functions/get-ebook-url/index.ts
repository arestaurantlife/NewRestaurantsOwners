import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

const TIER_RANK: Record<string, number> = { starter: 1, professional: 2, enterprise: 3 };
const PRODUCT_TIERS: Record<string, string> = {
  prod_TklF0dW7NLmDbW: "starter",
  prod_TklGmoEjtrJEhN: "professional",
  prod_TklGsn7x8cQTbx: "enterprise",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, {
      auth: { persistSession: false },
    });
    const body = await req.json().catch(() => ({}));

    // Public cover mode: signed URLs for covers of published eBooks.
    if (body?.covers === true) {
      const { data: rows } = await admin.from("ebooks").select("id, cover_path").eq("published", true).not("cover_path", "is", null);
      const urls: Record<string, string> = {};
      await Promise.all((rows ?? []).map(async (r) => {
        const { data } = await admin.storage.from("ebooks").createSignedUrl(r.cover_path!, 3600);
        if (data?.signedUrl) urls[r.id] = data.signedUrl;
      }));
      return json({ urls });
    }

    const id = body?.id;
    if (typeof id !== "string" || id.length > 64) return json({ error: "Invalid request" }, 400);

    const token = (req.headers.get("Authorization") ?? "").replace("Bearer ", "");
    if (!token) return json({ allowed: false, reason: "signin" });
    const { data: u } = await admin.auth.getUser(token);
    const user = u?.user;
    if (!user?.email) return json({ allowed: false, reason: "signin" });

    const { data: roleRow } = await admin.from("user_roles").select("role").eq("user_id", user.id).eq("role", "admin").maybeSingle();
    const isAdmin = !!roleRow;

    const { data: book } = await admin.from("ebooks").select("id, min_tier, storage_path, published").eq("id", id).maybeSingle();
    if (!book || (!book.published && !isAdmin)) return json({ error: "Not found" }, 404);

    let allowed = isAdmin;
    if (!allowed) {
      const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, { apiVersion: "2023-10-16" });
      const customers = await stripe.customers.list({ email: user.email, limit: 1 });
      if (customers.data.length) {
        const cid = customers.data[0].id;
        const subs = await stripe.subscriptions.list({ customer: cid, status: "all", limit: 100 });
        let best = 0;
        for (const s of subs.data) {
          if (s.status !== "active" && s.status !== "trialing") continue;
          best = Math.max(best, TIER_RANK[PRODUCT_TIERS[s.items.data[0]?.price.product as string]] ?? 0);
        }
        if (best >= (TIER_RANK[book.min_tier] ?? 1)) allowed = true;
        if (!allowed) {
          const sessions = await stripe.checkout.sessions.list({ customer: cid, limit: 100 });
          allowed = sessions.data.some(
            (s) => s.mode === "payment" && s.payment_status === "paid" && s.metadata?.ebook_id === book.id,
          );
        }
      }
    }
    if (!allowed) return json({ allowed: false, reason: "purchase", min_tier: book.min_tier });
    if (!book.storage_path) return json({ allowed: true, url: null });

    const { data } = await admin.storage.from("ebooks").createSignedUrl(book.storage_path, 3600, { download: true });
    return json({ allowed: true, url: data?.signedUrl ?? null });
  } catch (e) {
    console.error("[GET-EBOOK-URL]", e);
    return json({ error: "Could not load eBook" }, 500);
  }
});
