# Architecture rules
- Keep the owner-approved Privacy Policy as static app-owned HTML rendered by the public `/privacy` route; policy copy is not generated from backend capabilities.
- Use `PrivacyNotice` for registration/email-capture and purchase agreement links so the wording and new-tab behavior stay consistent.
- Existing pages own their shared footer; `SupplementalFooter` supplies it only on auth, password reset, dashboard and OAuth consent routes that otherwise lack one, avoiding duplicate footers.