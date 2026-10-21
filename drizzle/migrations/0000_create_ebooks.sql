CREATE TABLE public.ebooks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  description text,
  cover_path text,
  storage_path text,
  min_tier text NOT NULL DEFAULT 'starter',
  price_cents integer,
  stripe_price_id text,
  published boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.ebooks TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ebooks TO authenticated;
GRANT ALL ON public.ebooks TO service_role;
ALTER TABLE public.ebooks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view published ebooks" ON public.ebooks FOR SELECT USING (published = true);
CREATE POLICY "Admins can view all ebooks" ON public.ebooks FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert ebooks" ON public.ebooks FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update ebooks" ON public.ebooks FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete ebooks" ON public.ebooks FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.ebooks_reset_price()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF NEW.price_cents IS DISTINCT FROM OLD.price_cents THEN NEW.stripe_price_id = NULL; END IF;
  NEW.updated_at = now();
  RETURN NEW;
END; $$;
CREATE TRIGGER ebooks_before_update BEFORE UPDATE ON public.ebooks FOR EACH ROW EXECUTE FUNCTION public.ebooks_reset_price();

CREATE POLICY "Admins manage ebook files select" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'ebooks' AND has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage ebook files insert" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'ebooks' AND has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage ebook files update" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'ebooks' AND has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage ebook files delete" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'ebooks' AND has_role(auth.uid(), 'admin'));