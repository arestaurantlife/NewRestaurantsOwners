-- PAGES
CREATE TABLE public.pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  meta_description text,
  nav_label text,
  show_in_nav boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  is_system boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.pages TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.pages TO authenticated;
GRANT ALL ON public.pages TO service_role;

ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view pages" ON public.pages FOR SELECT USING (true);
CREATE POLICY "Admins can insert pages" ON public.pages FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update pages" ON public.pages FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete pages" ON public.pages FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_pages_updated_at BEFORE UPDATE ON public.pages
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- MEDIA ASSETS
CREATE TABLE public.media_assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kind text NOT NULL DEFAULT 'image',
  title text NOT NULL,
  storage_path text NOT NULL,
  bucket text NOT NULL DEFAULT 'site-media',
  mime text,
  size bigint,
  width integer,
  height integer,
  tags text[] NOT NULL DEFAULT '{}'::text[],
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.media_assets TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.media_assets TO authenticated;
GRANT ALL ON public.media_assets TO service_role;

ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view media assets" ON public.media_assets FOR SELECT USING (true);
CREATE POLICY "Admins can insert media assets" ON public.media_assets FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update media assets" ON public.media_assets FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete media assets" ON public.media_assets FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_media_assets_updated_at BEFORE UPDATE ON public.media_assets
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- SITE THEME
CREATE TABLE public.site_theme (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  status text NOT NULL,
  tokens jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (status)
);

GRANT SELECT ON public.site_theme TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_theme TO authenticated;
GRANT ALL ON public.site_theme TO service_role;

ALTER TABLE public.site_theme ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published theme" ON public.site_theme FOR SELECT USING (status = 'published');
CREATE POLICY "Admins can view all themes" ON public.site_theme FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert theme" ON public.site_theme FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update theme" ON public.site_theme FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete theme" ON public.site_theme FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_site_theme_updated_at BEFORE UPDATE ON public.site_theme
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- SEED SYSTEM PAGES
INSERT INTO public.pages (slug, title, nav_label, show_in_nav, sort_order, is_system) VALUES
  ('home', 'Home', 'Home', false, 0, true),
  ('features/financial-operations', 'Financial Operations', null, false, 1, true),
  ('features/food-cost-control', 'Food Cost Control', null, false, 2, true),
  ('features/labor-cost-management', 'Labor Cost Management', null, false, 3, true),
  ('features/employee-training', 'Employee Training', null, false, 4, true),
  ('features/essential-forms', 'Essential Forms', null, false, 5, true),
  ('features/community-support', 'Community Support', null, false, 6, true);