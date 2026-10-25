import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";
import { z } from "https://esm.sh/zod@3.23.8";
import { getPlanStatus, makeCode } from "../_shared/training.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: Record<string, unknown>) => {
  console.log(`[TRAINING-ACCESS] ${step}${details ? ` - ${JSON.stringify(details)}` : ""}`);
};

const BodySchema = z.object({
  action: z.enum(["get", "regenerate"]).default("get"),
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
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } },
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return json({ error: "Not authenticated" }, 401);
    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    const user = userData?.user;
    if (userError || !user?.email) return json({ error: "Not authenticated" }, 401);
    logStep("User authenticated", { userId: user.id });

    let action: "get" | "regenerate" = "get";
    if (req.method === "POST") {
      const parsed = BodySchema.safeParse(await req.json().catch(() => ({})));
      if (!parsed.success) return json({ error: "Invalid request" }, 400);
      action = parsed.data.action;
    }

    // Source of truth: live Stripe subscription (same as check-subscription).
    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
    const plan = await getPlanStatus(stripe, user.email);
    const isProfessional = plan.status !== null && plan.plan === "professional";
    if (!isProfessional) {
      return json({ professional: false, plan: plan.plan, subscription_status: plan.status });
    }

    const { data: codes, error: codeErr } = await supabase
      .from("training_access_codes")
      .select("id, code, status, created_at, redeemed_at")
      .eq("user_id", user.id)
      .neq("status", "revoked")
      .order("created_at", { ascending: false })
      .limit(1);
    if (codeErr) throw codeErr;
    const existing = codes?.[0] ?? null;

    if (action === "get") {
      if (existing) {
        return json({ professional: true, code: existing.code, code_status: existing.status });
      }
      // Lazy auto-provision: active Professional subscriber with no code yet.
      const code = makeCode();
      const { error: insErr } = await supabase
        .from("training_access_codes")
        .insert({ user_id: user.id, code });
      if (insErr) throw insErr;
      logStep("Code issued", { userId: user.id });
      return json({ professional: true, code, code_status: "issued" });
    }

    // regenerate
    if (!existing) {
      const code = makeCode();
      const { error: insErr } = await supabase
        .from("training_access_codes")
        .insert({ user_id: user.id, code });
      if (insErr) throw insErr;
      return json({ professional: true, code, code_status: "issued" });
    }
    if (existing.status === "redeemed") {
      return json({ error: "Code already redeemed. Contact support to move it." }, 409);
    }
    const { error: revErr } = await supabase
      .from("training_access_codes")
      .update({ status: "revoked" })
      .eq("id", existing.id);
    if (revErr) throw revErr;
    const code = makeCode();
    const { error: insErr } = await supabase
      .from("training_access_codes")
      .insert({ user_id: user.id, code });
    if (insErr) throw insErr;
    logStep("Code regenerated", { userId: user.id });
    return json({ professional: true, code, code_status: "issued" });
  } catch (error) {
    logStep("ERROR", { message: error instanceof Error ? error.message : String(error) });
    return json({ error: "An internal error occurred. Please try again." }, 500);
  }
});
