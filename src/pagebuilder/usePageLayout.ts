import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Block } from "./types";
import { defaultBlocks } from "./registry";

const parseBlocks = (raw: unknown): Block[] | null => {
  if (!Array.isArray(raw)) return null;
  const blocks = raw.filter(
    (b): b is Block => !!b && typeof b === "object" && typeof (b as Block).type === "string",
  );
  return blocks.length ? blocks : null;
};

export function usePageLayout(
  status: "draft" | "published",
  slug = "home",
  fallback?: () => Block[],
) {
  const makeFallback = fallback ?? (() => (slug === "home" ? defaultBlocks() : []));
  const [blocks, setBlocks] = useState<Block[] | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("page_layouts")
      .select("blocks")
      .eq("page_slug", slug)
      .eq("status", status)
      .maybeSingle();
    const parsed = parseBlocks(data?.blocks);
    // A saved-but-empty layout is a legitimate state for custom pages.
    setBlocks(parsed ?? (data ? [] : makeFallback()));
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, slug]);

  useEffect(() => {
    load();
  }, [load]);

  return { blocks, setBlocks, loading, reload: load };
}

export async function saveLayout(
  status: "draft" | "published",
  blocks: Block[],
  slug = "home",
) {
  const { data: userData } = await supabase.auth.getUser();
  const { error } = await supabase.from("page_layouts").upsert(
    {
      page_slug: slug,
      status,
      blocks: blocks as unknown as never,
      updated_by: userData.user?.id ?? null,
    },
    { onConflict: "page_slug,status" },
  );
  if (error) throw error;
}
