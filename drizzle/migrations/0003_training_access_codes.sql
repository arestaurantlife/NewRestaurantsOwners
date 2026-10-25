CREATE TABLE public.training_access_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  code text NOT NULL UNIQUE,
  status text NOT NULL DEFAULT 'issued' CHECK (status IN ('issued', 'redeemed', 'revoked')),
  created_at timestamptz NOT NULL DEFAULT now(),
  redeemed_at timestamptz,
  redeemed_org_ref text
);

-- At most one non-revoked (active) code per member
CREATE UNIQUE INDEX training_access_codes_one_active_per_user
  ON public.training_access_codes (user_id)
  WHERE status <> 'revoked';

GRANT SELECT ON public.training_access_codes TO authenticated;
GRANT ALL ON public.training_access_codes TO service_role;

ALTER TABLE public.training_access_codes ENABLE ROW LEVEL SECURITY;

-- Members can read only their own codes; no client-side insert/update/delete policies.
CREATE POLICY "Members can view their own training codes"
  ON public.training_access_codes
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);