DROP POLICY IF EXISTS "Anyone can view media assets" ON public.media_assets;
CREATE POLICY "Admins can view media assets" ON public.media_assets FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Anyone can view pages" ON public.pages;
CREATE POLICY "Anyone can view live pages" ON public.pages FOR SELECT USING (
  is_system OR EXISTS (SELECT 1 FROM public.page_layouts l WHERE l.page_slug = pages.slug AND l.status = 'published')
);
CREATE POLICY "Admins can view all pages" ON public.pages FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Anyone can read site media" ON storage.objects;
CREATE POLICY "Anyone can read published site media" ON storage.objects FOR SELECT USING (
  bucket_id = 'site-media' AND (
    EXISTS (SELECT 1 FROM public.page_layouts l WHERE l.status = 'published' AND strpos(l.blocks::text, 'media:site-media/' || storage.objects.name) > 0)
    OR EXISTS (SELECT 1 FROM public.site_theme t WHERE t.status = 'published' AND strpos(t.tokens::text, 'media:site-media/' || storage.objects.name) > 0)
  )
);
CREATE POLICY "Admins can read all site media" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'site-media' AND public.has_role(auth.uid(), 'admin'::public.app_role));