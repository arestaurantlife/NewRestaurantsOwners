CREATE TABLE public.waitlist_submissions (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 name text NOT NULL CHECK (char_length(name) BETWEEN 1 AND 100),
 email text NOT NULL UNIQUE CHECK (char_length(email) BETWEEN 3 AND 255),
 marketing_consent boolean NOT NULL CHECK (marketing_consent = true),
 consent_text text NOT NULL,
 ip_hash text NOT NULL,
 created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, DELETE ON public.waitlist_submissions TO authenticated;
GRANT ALL ON public.waitlist_submissions TO service_role;
ALTER TABLE public.waitlist_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can view waitlist" ON public.waitlist_submissions FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete waitlist" ON public.waitlist_submissions FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE INDEX waitlist_ip_created_idx ON public.waitlist_submissions (ip_hash, created_at);