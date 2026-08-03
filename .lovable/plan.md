## What's happening

Signing in works — your account `arestaurant.life@gmail.com` is authenticated. The problem is roles: I checked the `user_roles` table and **no account in the project has the `admin` role**. All three users (including yours) are set to `user`.

Every admin surface (the "Edit page" toolbar, Pages, Media library, Theme editor, PDF manager) is gated behind `useIsAdmin`, which looks for an `admin` row in `user_roles`. With no admin row, the buttons never render — which is exactly what you're seeing.

Also note: new signups are auto-assigned `user` by the signup trigger, so the first admin has to be set deliberately.

## The fix

1. Insert an `admin` role row in `user_roles` for `arestaurant.life@gmail.com` (user id `122d7fd6-…`). Your existing `user` row stays; roles are additive.
2. You sign out and back in (or reload) so the role check re-runs.
3. Verify: on the homepage you should see the floating **Edit page** control; opening it gives Pages / Media / Theme / Save draft / Publish.

## Optional add-on

If you'd like, I can add a small "Admin" entry in the dashboard header that only appears for admins, so there's an obvious way in rather than relying on the floating edit button.

## Technical notes

- Single migration: `INSERT INTO public.user_roles (user_id, role) VALUES ('122d7fd6-f97d-4fd7-b1c0-942631d4688e', 'admin') ON CONFLICT DO NOTHING;`
- No schema, policy, or grant changes needed — `has_role()` and the existing RLS policies already handle admin correctly.
- Admin status stays server-side in the database; nothing is stored client-side.
