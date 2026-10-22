# Architecture rules
- Keep owner-approved legal policies as static app-owned HTML rendered by public `/privacy`, `/terms` and `/refunds` routes; policy copy is not generated from backend capabilities.
- Use `PrivacyNotice` for registration/email-capture and purchase agreement links so the wording and new-tab behavior stay consistent.
- Existing pages own their shared footer; `SupplementalFooter` supplies it only on auth, password reset, dashboard and OAuth consent routes that otherwise lack one, avoiding duplicate footers.- Checkout consent and content-access audit rows are written only by Edge Functions via `supabase/functions/_shared/audit.ts` (service role); clients never insert, so the records stay tamper-proof for disputes.
- Every purchase function must reject requests without `acceptedTerms: true`; the UI `TermsConsent` checkbox is a convenience, the server check is the enforcement.
