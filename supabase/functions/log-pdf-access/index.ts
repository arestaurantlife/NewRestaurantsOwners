// Records a guide/template/form read or download. The row is written server-side
// only after confirming the caller is signed in and allowed to see feature PDFs.
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";
import { logAccess } from "../_shared/audit.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

const typeFor = (slug: string, tags: string[]) => {
  const t = tags.map((x) => x.toLowerCase());
  if (slug === "essential-forms" || t.some((x) => x.includes("form"))) return "form";
  if (t.some((x) => x.includes("template"))) return "template";
  return "guide";
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });
    const token = (req.headers.get("Authorization") ?? "").replace("Bearer ", "");
    if (!token) return json({ error: "Please sign in" }, 401);
    const { data: u } = await admin.auth.getUser(token);
    const user = u?.user;
    if (!user?.email) return json({ error: "Please sign in" }, 401);

    const { id, action } = await req.json().catch(() => ({}));
    if (typeof id !== "string" || id.length > 64 || (action !== "view" && action !== "download")) {
      return json({ error: "Invalid request" }, 400);
    }
    const { data: row } = await admin.from("feature_pdfs").select("id, feature_slug, title, tags").eq("id", id).maybeSingle();
    if (!row) return json({ error: "Not found" }, 404);

    const { data: roleRow } = await admin.from("user_roles").select("role").eq("user_id", user.id).eq("role", "admin").maybeSingle();
    let allowed = !!roleRow;
    if (!allowed) {
      const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, { apiVersion: "2023-10-16" });
      const customers = await stripe.customers.list({ email: user.email, limit: 1 });
      if (customers.data.length) {
        const subs = await stripe.subscriptions.list({ customer: customers.data[0].id, status: "all", limit: 20 });
        allowed = subs.data.some((s) => s.status === "active" || s.status === "trialing");
      }
    }
    if (!allowed) return json({ error: "Not allowed" }, 403);

    await logAccess(admin, req, {
      user_id: user.id, email: user.email, content_id: `pdf:${row.id}`, content_title: row.title,
      content_type: typeFor(row.feature_slug, row.tags ?? []), action,
    });
    return json({ ok: true });
  } catch (e) {
    console.error("[LOG-PDF-ACCESS]", e);
    return json({ error: "Could not log" }, 500);
  }
});
