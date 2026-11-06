import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

// Exercise the deployed gate expressions without loading Deno's HTTP servers or Stripe.
const root = new URL("../../../", import.meta.url);
const gates = [
  {
    name: "dashboard",
    path: "src/components/TrainingAccessCard.tsx",
    pattern: /if \((!subscription\.subscribed[^\n]+)\)/,
    context: (tier: string | null, active: boolean) => ({ subscription: { subscribed: active, tier } }),
    denied: true,
  },
  {
    name: "code issuance and regeneration",
    path: "supabase/functions/training-access/index.ts",
    pattern: /const isProfessional = ([^;]+);/,
    context: (tier: string | null, active: boolean) => ({ plan: { status: active ? "active" : null, plan: tier } }),
    denied: false,
  },
  {
    name: "code verification, redemption and status",
    path: "supabase/functions/verify-training-code/index.ts",
    pattern: /const activeProfessional = ([^;]+);/,
    context: (tier: string | null, active: boolean) => ({ subscription_status: active ? "active" : null, plan: tier }),
    denied: false,
  },
];

for (const gate of gates) {
  describe(gate.name, () => {
    const source = readFileSync(new URL(gate.path, root), "utf8");
    const match = source.match(gate.pattern);
    if (!match) throw new Error(`Missing training eligibility gate in ${gate.path}`);
    const expression = match[1];
    const allowed = (tier: string | null, active: boolean) => {
      const context = gate.context(tier, active);
      const result = Function(...Object.keys(context), `return (${expression});`)(...Object.values(context));
      return result !== gate.denied;
    };

    test("active Enterprise inherits Professional staff training", () => {
      expect(allowed("enterprise", true)).toBe(true);
    });
    test("active Professional retains staff training", () => {
      expect(allowed("professional", true)).toBe(true);
    });
    test("Starter does not receive staff training", () => {
      expect(allowed("starter", true)).toBe(false);
    });
    test("inactive or missing subscriptions do not receive staff training", () => {
      expect(allowed("enterprise", false)).toBe(false);
      expect(allowed("professional", false)).toBe(false);
      expect(allowed(null, false)).toBe(false);
    });
  });
}