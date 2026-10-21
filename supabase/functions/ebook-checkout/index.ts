import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

const ALLOWED_ORIGINS = new Set([
  "https://newrestaurantsowners.com",
  "https://www.newrestaurantsowners.com",
  "https://newrestaurantsowners.lovable.app",
  "https://id-preview--afdb0b2d-b76f-4679-b262-a34ad03bc5a3.lovable.app",
  "http://localhost:8080",
]);
const BUNDLE_KEY = "core-3";
const BUNDLE_PRICE_CENTS = 2999;
const BUNDLE_SLUGS = ["psychology-of-restaurant-theft", "service-vs-hospitality", "science-of-restaurant-budget"];

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, {
      auth: { persistSession: false },
    });
    const token = (req.headers.get("Authorization") ?? "").replace("Bearer ", "");
    if (!token) return json({ error: "Please sign in" }, 401);
    const { data: u } = await admin.auth.getUser(token);
    const user = u?.user;
    if (!user?.email) return json({ error: "Please sign in" }, 401);

    const { id, bundle } = await req.json().catch(() => ({}));
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, { apiVersion: "2023-10-16" });
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    const origin = req.headers.get("origin") ?? "";
    const base = ALLOWED_ORIGINS.has(origin) ? origin : "https://newrestaurantsowners.com";

    if (bundle === true) {
      const session = await stripe.checkout.sessions.create({
        customer: customers.data[0]?.id,
        customer_email: customers.data[0] ? undefined : user.email,
        customer_creation: customers.data[0] ? undefined : "always",
        line_items: [{
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: BUNDLE_PRICE_CENTS,
            product_data: { name: "eBook Combo: Theft, Service vs Hospitality, Restaurant Budget" },
          },
        }],
        mode: "payment",
        metadata: { ebook_bundle: BUNDLE_KEY },
        success_url: `${base}/library?purchased=bundle`,
        cancel_url: `${base}/library`,
      });
      return json({ url: session.url });
    }

    if (typeof id !== "string" || id.length > 64) return json({ error: "Invalid request" }, 400);

    const { data: book } = await admin.from("ebooks").select("id, slug, title, description, price_cents, stripe_price_id, published").eq("id", id).maybeSingle();
    if (!book || !book.published) return json({ error: "Not found" }, 404);
    if (BUNDLE_SLUGS.includes(book.slug)) return json({ error: "This eBook is sold in the 3-eBook combo" }, 400);
    if (!book.price_cents || book.price_cents < 50) return json({ error: "This eBook is not for sale yet" }, 400);

    let priceId = book.stripe_price_id;
    if (!priceId) {
      const product = await stripe.products.create({ name: `eBook: ${book.title}`, description: book.description ?? undefined, metadata: { ebook_id: book.id } });
      const price = await stripe.prices.create({ product: product.id, unit_amount: book.price_cents, currency: "usd" });
      priceId = price.id;
      await admin.from("ebooks").update({ stripe_price_id: priceId }).eq("id", book.id);
    }
    const session = await stripe.checkout.sessions.create({
      customer: customers.data[0]?.id,
      customer_email: customers.data[0] ? undefined : user.email,
      customer_creation: customers.data[0] ? undefined : "always",
      line_items: [{ price: priceId, quantity: 1 }],
      mode: "payment",
      metadata: { ebook_id: book.id },
      success_url: `${base}/library?purchased=${book.id}`,
      cancel_url: `${base}/library`,
    });
    return json({ url: session.url });
  } catch (e) {
    console.error("[EBOOK-CHECKOUT]", e);
    return json({ error: "Could not start checkout" }, 500);
  }
});
