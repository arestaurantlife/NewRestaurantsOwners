CREATE TABLE public.feature_pdfs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  feature_slug TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  storage_path TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX feature_pdfs_slug_idx ON public.feature_pdfs(feature_slug, sort_order);

GRANT SELECT ON public.feature_pdfs TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.feature_pdfs TO authenticated;
GRANT ALL ON public.feature_pdfs TO service_role;

ALTER TABLE public.feature_pdfs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view feature pdfs"
  ON public.feature_pdfs FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert feature pdfs"
  ON public.feature_pdfs FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update feature pdfs"
  ON public.feature_pdfs FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete feature pdfs"
  ON public.feature_pdfs FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_feature_pdfs_updated_at
  BEFORE UPDATE ON public.feature_pdfs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Storage policies for the feature-pdfs bucket (bucket itself created via tool)
CREATE POLICY "Public can read feature pdfs"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'feature-pdfs');

CREATE POLICY "Admins can upload feature pdfs"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'feature-pdfs' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update feature pdfs files"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'feature-pdfs' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete feature pdfs files"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'feature-pdfs' AND public.has_role(auth.uid(), 'admin'));
