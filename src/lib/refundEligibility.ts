// Refund Policy rule for the first paid month: within 14 days of the first paid charge,
// 3 or fewer distinct items accessed, and no access to restricted titles or full bundles.
export interface AccessRow {
  content_id: string;
  content_title: string;
  content_type: string;
  action: string;
  accessed_at: string;
}

const RESTRICTED = [/psychology of restaurant theft/i, /pre-?shift playbook/i, /\bbundle\b/i, /\bcombo\b/i];
export const REFUND_WINDOW_DAYS = 14;
export const MAX_ITEMS = 3;

export function checkRefundEligibility(firstPaidAt: string | null, logs: AccessRow[], now = new Date()) {
  const reasons: string[] = [];
  if (!firstPaidAt) {
    reasons.push("No paid charge found.");
  } else {
    const days = (now.getTime() - new Date(firstPaidAt).getTime()) / 86_400_000;
    if (days > REFUND_WINDOW_DAYS) reasons.push(`More than ${REFUND_WINDOW_DAYS} days since the first paid charge.`);
  }
  const distinct = new Set(logs.map((l) => l.content_id));
  if (distinct.size > MAX_ITEMS) reasons.push(`${distinct.size} items accessed (limit ${MAX_ITEMS}).`);
  const restricted = logs.filter((l) => l.content_type === "bundle" || RESTRICTED.some((r) => r.test(l.content_title)));
  if (restricted.length) reasons.push(`Accessed restricted content: ${[...new Set(restricted.map((r) => r.content_title))].join(", ")}.`);
  return { eligible: reasons.length === 0, reasons, itemCount: distinct.size };
}
