import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";
import { z } from "https://esm.sh/zod@3.23.8";
import { constantTimeEqual, getPlanStatus } from "../_shared/training.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-training-link-secret",
};

const logStep = (step: string, details?: Record<string, unknown>) => {
  console.log(`[VERIFY-TRAINING-CODE] ${step}${details ? ` - ${JSON.stringify(details)}` : ""}`);
};

// Ad-hoc per-instance rate limit: 30 requests per minute per caller IP.
// Note: approximate only — each function instance keeps its own counter.
const RATE_LIMIT = 30;
const RATE_WINDOW_MS = 60_000;
const hits = new Map<string, number[]>();
function rateLimited(key: string): boolean {
  const now = Date.now();
  const arr = (hits.get(key) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  if (arr.length >= RATE_LIMIT) {
    hits.set(key, arr);
    return true;
  }
  arr.push(now);
  hits.set(key, arr);
  return false;
}

const BodySchema = z.object({
  action: z.enum(["verify", "redeem", "status"]),
  code: z.string().min(1).max(64),
  org_ref: z.string().max(255).optional(),
});

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const json = (data: unknown, status = 200) =>
    new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status,
    });

  try {
    const expected = Deno.env.get("TRAINING_LINK_SECRET") ?? "";
    const provided = req.headers.get("x-training-link-secret") ?? "";
    if (!expected || !constantTimeEqual(provided, expected)) {
      return json({ error: "Unauthorized" }, 401);
    }

    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    if (rateLimited(ip)) {
      return json({ error: "Too many requests" }, 429);
    }

    if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

    const parsed = BodySchema.safeParse(await req.json().catch(() => null));
    if (!parsed.success) return json({ error: "Invalid request body" }, 400);
    const { action, code, org_ref } = parsed.data;

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } },
    );

    const { data: rows, error: lookupErr } = await supabase
      .from("training_access_codes")
      .select("id, user_id, code, status")
      .eq("code", code)
      .limit(1);
    if (lookupErr) throw lookupErr;
    const record = rows?.[0] ?? null;

    // Look up the owner's live subscription status (source of truth: Stripe).
    let subscription_status: string | null = null;
    let plan: string | null = null;
    let current_period_end: string | null = null;
    if (record) {
      const { data: ownerData, error: ownerErr } = await supabase.auth.admin.getUserById(record.user_id);
      if (ownerErr) throw ownerErr;
      const email = ownerData?.user?.email;
      if (email) {
        const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
        const planStatus = await getPlanStatus(stripe, email);
        subscription_status = planStatus.status;
        plan = planStatus.plan;
        current_period_end = planStatus.current_period_end;
      }
    }

    const activeProfessional = subscription_status !== null && plan === "professional";
    const valid = !!record && record.status !== "revoked" && activeProfessional;

    const payload = {
      valid,
      code_status: record?.status ?? null,
      subscription_status,
      plan,
      current_period_end,
    };

    if (action === "verify") {
      logStep("verify", { valid, code_status: payload.code_status });
      return json(payload);
    }

    if (action === "status") {
      if (!record || record.status !== "redeemed") {
        return json({ ...payload, error: "Code is not redeemed" }, 409);
      }
      return json(payload);
    }

    // redeem
    if (!record || !valid || record.status !== "issued") {
      logStep("redeem rejected", { valid, code_status: record?.status ?? null });
      return json({ ...payload, error: "Code cannot be redeemed" }, 409);
    }
    const { data: updated, error: updErr } = await supabase
      .from("training_access_codes")
      .update({
        status: "redeemed",
        redeemed_at: new Date().toISOString(),
        redeemed_org_ref: org_ref ?? null,
      })
      .eq("id", record.id)
      .eq("status", "issued") // guard against a concurrent redeem
      .select("id")
      .maybeSingle();
    if (updErr) throw updErr;
    if (!updated) {
      return json({ ...payload, code_status: "redeemed", error: "Code already redeemed" }, 409);
    }
    logStep("redeemed", { codeId: record.id });
    return json({ ...payload, code_status: "redeemed" });
  } catch (error) {
    logStep("ERROR", { message: error instanceof Error ? error.message : String(error) });
    return json({ error: "An internal error occurred. Please try again." }, 500);
  }
});
