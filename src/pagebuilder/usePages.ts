import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface SitePage {
  id: string;
  slug: string;
  title: string;
  meta_description: string | null;
  nav_label: string | null;
  show_in_nav: boolean;
  sort_order: number;
  is_system: boolean;
}

export function usePages() {
  const [pages, setPages] = useState<SitePage[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const { data } = await supabase
      .from("pages")
      .select("*")
      .order("sort_order", { ascending: true });
    setPages((data ?? []) as SitePage[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { pages, loading, reload: load };
}

export const normalizeSlug = (input: string) =>
  input
    .trim()
    .toLowerCase()
    .replace(/^\/+|\/+$/g, "")
    .replace(/[^a-z0-9/-]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/\/{2,}/g, "/");

export async function createPage(input: {
  slug: string;
  title: string;
  navLabel?: string;
  showInNav?: boolean;
}) {
  const { data, error } = await supabase
    .from("pages")
    .insert({
      slug: normalizeSlug(input.slug),
      title: input.title,
      nav_label: input.navLabel || input.title,
      show_in_nav: input.showInNav ?? false,
      sort_order: 100,
    })
    .select()
    .single();
  if (error) throw error;
  return data as SitePage;
}

export async function updatePage(id: string, patch: Partial<SitePage>) {
  const { error } = await supabase.from("pages").update(patch).eq("id", id);
  if (error) throw error;
}

export async function deletePage(page: SitePage) {
  if (page.is_system) throw new Error("Built-in pages can't be deleted.");
  await supabase.from("page_layouts").delete().eq("page_slug", page.slug);
  const { error } = await supabase.from("pages").delete().eq("id", page.id);
  if (error) throw error;
}
