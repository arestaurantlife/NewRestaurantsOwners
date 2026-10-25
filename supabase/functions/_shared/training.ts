import Stripe from "https://esm.sh/stripe@14.21.0";

// Same product -> tier mapping used by check-subscription (single source of truth).
export const PRODUCT_TIERS: Record<string, string> = {
  "prod_TklF0dW7NLmDbW": "starter",
  "prod_TklGmoEjtrJEhN": "professional",
  "prod_TklGsn7x8cQTbx": "enterprise",
};

export interface PlanStatus {
  status: string | null; // 'active' | 'trialing' | null
  plan: string | null; // 'starter' | 'professional' | 'enterprise' | null
  current_period_end: string | null;
}

// Live Stripe lookup — same approach as check-subscription.
export async function getPlanStatus(stripe: Stripe, email: string): Promise<PlanStatus> {
  const customers = await stripe.customers.list({ email, limit: 1 });
  if (customers.data.length === 0) {
    return { status: null, plan: null, current_period_end: null };
  }
  const subs = await stripe.subscriptions.list({
    customer: customers.data[0].id,
    status: "all",
    limit: 100,
  });
  const sub = subs.data.find((s) => s.status === "active" || s.status === "trialing");
  if (!sub) {
    return { status: null, plan: null, current_period_end: null };
  }
  const productId = sub.items.data[0].price.product as string;
  return {
    status: sub.status,
    plan: PRODUCT_TIERS[productId] ?? "unknown",
    current_period_end: new Date(sub.current_period_end * 1000).toISOString(),
  };
}

// NRO-XXXX-XXXX, unambiguous uppercase letters/digits only (no 0, O, 1, I, L).
const CODE_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

export function makeCode(): string {
  const bytes = new Uint8Array(8);
  crypto.getRandomValues(bytes);
  const group = (offset: number) =>
    Array.from(bytes.slice(offset, offset + 4))
      .map((b) => CODE_ALPHABET[b % CODE_ALPHABET.length])
      .join("");
  return `NRO-${group(0)}-${group(4)}`;
}

export function constantTimeEqual(a: string, b: string): boolean {
  if (!a || !b) return false;
  const enc = new TextEncoder();
  const ba = enc.encode(a);
  const bb = enc.encode(b);
  const len = Math.max(ba.length, bb.length);
  let diff = ba.length ^ bb.length;
  for (let i = 0; i < len; i++) {
    diff |= (ba[i % ba.length] ?? 0) ^ (bb[i % bb.length] ?? 0);
  }
  return diff === 0;
}
