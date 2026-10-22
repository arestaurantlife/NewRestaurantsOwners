DROP POLICY IF EXISTS "Anyone can submit contact form" ON public.contact_submissions;
REVOKE INSERT ON public.contact_submissions FROM anon, authenticated;
GRANT ALL ON public.contact_submissions TO service_role;