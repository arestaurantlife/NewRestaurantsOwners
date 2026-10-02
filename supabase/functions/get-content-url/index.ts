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

const BUCKET = "content-media";
const THUMB_PREFIX = "content:";
const TIER_RANK: Record<string, number> = { starter: 1, professional: 2, enterprise: 3 };
const PRODUCT_TIERS: Record<string, string> = {
  prod_TklF0dW7NLmDbW: "starter",
  prod_TklGmoEjtrJEhN: "professional",
  prod_TklGsn7x8cQTbx: "enterprise",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { auth: { persistSession: false } },
    );
    const body = await req.json().catch(() => ({}));

    // Thumbnail mode: signed URLs for thumbnails of published items (public).
    if (Array.isArray(body?.thumbnails)) {
      const refs = (body.thumbnails as unknown[])
        .filter((v): v is string => typeof v === "string" && v.startsWith(THUMB_PREFIX) && v.length < 500)
        .slice(0, 100);
      if (!refs.length) return json({ urls: {} });
      const { data: rows } = await admin
        .from("content_items").select("thumbnail").eq("published", true).in("thumbnail", refs);
      const urls: Record<string, string> = {};
      await Promise.all((rows ?? []).map(async (r) => {
        const path = String(r.thumbnail).slice(THUMB_PREFIX.length);
        const { data } = await admin.storage.from(BUCKET).createSignedUrl(path, 3600);
        if (data?.signedUrl) urls[r.thumbnail] = data.signedUrl;
      }));
      return json({ urls });
    }

    const slug = body?.slug;
    if (typeof slug !== "string" || !slug || slug.length > 200) {
      return json({ error: "Invalid request" }, 400);
    }

    // Identify the caller (optional for free items).
    const token = (req.headers.get("Authorization") ?? "").replace("Bearer ", "");
    let user: { id: string; email?: string } | null = null;
    if (token) {
      const { data: u } = await admin.auth.getUser(token);
      user = u?.user ?? null;
    }
    let isAdmin = false;
    if (user) {
      const { data: roleRow } = await admin
        .from("user_roles").select("role").eq("user_id", user.id).eq("role", "admin").maybeSingle();
      isAdmin = !!roleRow;
    }

    const { data: item } = await admin
      .from("content_items")
      .select("id, slug, access, min_tier, media_url, storage_path, published")
      .eq("slug", slug)
      .maybeSingle();
    if (!item || (!item.published && !isAdmin)) return json({ error: "Not found" }, 404);

    if (item.access === "subscriber" && !isAdmin) {
      if (!user?.email) return json({ allowed: false, reason: "signin" });
      const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, { apiVersion: "2023-10-16" });
      const customers = await stripe.customers.list({ email: user.email, limit: 1 });
      let best = 0;
      if (customers.data.length) {
        const subs = await stripe.subscriptions.list({ customer: customers.data[0].id, status: "all", limit: 100 });
        for (const s of subs.data) {
          if (s.status !== "active" && s.status !== "trialing") continue;
          const product = s.items.data[0]?.price.product as string;
          best = Math.max(best, TIER_RANK[PRODUCT_TIERS[product]] ?? 0);
        }
      }
      if (best < (TIER_RANK[item.min_tier] ?? 1)) {
        return json({ allowed: false, reason: "subscribe", min_tier: item.min_tier });
      }
    }

    let url: string | null = null;
    let type: "embed" | "file" | null = null;
    if (item.storage_path) {
      const { data } = await admin.storage.from(BUCKET).createSignedUrl(item.storage_path, 3600);
      url = data?.signedUrl ?? null;
      type = "file";
    } else if (item.media_url) {
      url = item.media_url;
      type = "embed";
    }
    return json({ allowed: true, url, type });
  } catch (e) {
    console.error("[GET-CONTENT-URL]", e);
    return json({ error: "Could not load content" }, 500);
  }
});
