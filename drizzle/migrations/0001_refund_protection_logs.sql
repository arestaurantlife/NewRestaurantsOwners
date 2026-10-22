CREATE TABLE public.checkout_consents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  email text NOT NULL,
  product text NOT NULL,
  stripe_session_id text,
  terms_version text NOT NULL,
  refund_policy_version text NOT NULL,
  accepted_at timestamptz NOT NULL DEFAULT now(),
  ip_address text,
  user_agent text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.checkout_consents TO authenticated;
GRANT ALL ON public.checkout_consents TO service_role;
ALTER TABLE public.checkout_consents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can view checkout consents" ON public.checkout_consents FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE INDEX checkout_consents_user_idx ON public.checkout_consents(user_id);

CREATE TABLE public.content_access_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  email text,
  content_id text NOT NULL,
  content_title text NOT NULL,
  content_type text NOT NULL,
  action text NOT NULL,
  accessed_at timestamptz NOT NULL DEFAULT now(),
  ip_address text,
  user_agent text
);
GRANT SELECT ON public.content_access_log TO authenticated;
GRANT ALL ON public.content_access_log TO service_role;
ALTER TABLE public.content_access_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can view all access logs" ON public.content_access_log FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can view their own access logs" ON public.content_access_log FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE INDEX content_access_log_user_idx ON public.content_access_log(user_id, accessed_at);