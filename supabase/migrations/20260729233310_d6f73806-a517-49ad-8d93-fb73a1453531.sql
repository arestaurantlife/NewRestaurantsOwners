CREATE TABLE public.page_layouts (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page_slug text NOT NULL,
  status text NOT NULL CHECK (status IN ('draft','published')),
  blocks jsonb NOT NULL DEFAULT '[]'::jsonb,
  updated_by uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE (page_slug, status)
);

GRANT SELECT ON public.page_layouts TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.page_layouts TO authenticated;
GRANT ALL ON public.page_layouts TO service_role;

ALTER TABLE public.page_layouts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published layouts"
  ON public.page_layouts FOR SELECT
  USING (status = 'published');

CREATE POLICY "Admins can view all layouts"
  ON public.page_layouts FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert layouts"
  ON public.page_layouts FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update layouts"
  ON public.page_layouts FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete layouts"
  ON public.page_layouts FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_page_layouts_updated_at
  BEFORE UPDATE ON public.page_layouts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();