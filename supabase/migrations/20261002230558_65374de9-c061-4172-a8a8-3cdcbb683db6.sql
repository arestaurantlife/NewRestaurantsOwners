CREATE TABLE public.content_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  kind text NOT NULL CHECK (kind IN ('video','course','podcast','lesson')),
  parent_id uuid REFERENCES public.content_items(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  thumbnail text,
  media_url text,
  storage_path text,
  duration text,
  access text NOT NULL DEFAULT 'subscriber' CHECK (access IN ('free','subscriber')),
  min_tier text NOT NULL DEFAULT 'starter' CHECK (min_tier IN ('starter','professional','enterprise')),
  published boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX content_items_parent_idx ON public.content_items(parent_id);
GRANT SELECT ON public.content_items TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.content_items TO authenticated;
GRANT ALL ON public.content_items TO service_role;
ALTER TABLE public.content_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view published content" ON public.content_items FOR SELECT USING (published = true);
CREATE POLICY "Admins can view all content" ON public.content_items FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert content" ON public.content_items FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update content" ON public.content_items FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete content" ON public.content_items FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER update_content_items_updated_at BEFORE UPDATE ON public.content_items FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE POLICY "Admins can read content media" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'content-media' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can upload content media" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'content-media' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update content media" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'content-media' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete content media" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'content-media' AND public.has_role(auth.uid(), 'admin'));