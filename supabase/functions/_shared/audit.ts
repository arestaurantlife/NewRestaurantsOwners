// Server-side helpers for consent records and the content access log.
// Writes use the service-role client; users can never insert, edit or delete these rows.
export const TERMS_VERSION = "2026-12-15";
export const REFUND_POLICY_VERSION = "2026-12-15";

export const requestMeta = (req: Request) => ({
  ip_address: (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || req.headers.get("cf-connecting-ip") || null,
  user_agent: (req.headers.get("user-agent") ?? "").slice(0, 500) || null,
});

// deno-lint-ignore no-explicit-any
type Admin = any;

export async function logAccess(
  admin: Admin,
  req: Request,
  entry: { user_id: string; email?: string | null; content_id: string; content_title: string; content_type: string; action: "view" | "download" },
) {
  const { error } = await admin.from("content_access_log").insert({ ...entry, ...requestMeta(req) });
  if (error) console.error("[ACCESS-LOG] insert failed", error.message);
}

export async function recordConsent(
  admin: Admin,
  req: Request,
  entry: { user_id: string; email: string; product: string; stripe_session_id: string | null; accepted_at: string },
) {
  const { error } = await admin.from("checkout_consents").insert({
    ...entry,
    terms_version: TERMS_VERSION,
    refund_policy_version: REFUND_POLICY_VERSION,
    ...requestMeta(req),
  });
  if (error) console.error("[CONSENT] insert failed", error.message);
}

export const consentMetadata = (acceptedAt: string) => ({
  terms_accepted_at: acceptedAt,
  terms_version: TERMS_VERSION,
  refund_policy_version: REFUND_POLICY_VERSION,
});
