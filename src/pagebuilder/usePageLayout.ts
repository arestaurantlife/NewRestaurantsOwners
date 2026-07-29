import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Block } from "./types";
import { defaultBlocks } from "./registry";

const PAGE_SLUG = "home";

const parseBlocks = (raw: unknown): Block[] | null => {
  if (!Array.isArray(raw)) return null;
  const blocks = raw.filter(
    (b): b is Block => !!b && typeof b === "object" && typeof (b as Block).type === "string",
  );
  return blocks.length ? blocks : null;
};

export function usePageLayout(status: "draft" | "published") {
  const [blocks, setBlocks] = useState<Block[] | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("page_layouts")
      .select("blocks")
      .eq("page_slug", PAGE_SLUG)
      .eq("status", status)
      .maybeSingle();
    setBlocks(parseBlocks(data?.blocks) ?? defaultBlocks());
    setLoading(false);
  }, [status]);

  useEffect(() => {
    load();
  }, [load]);

  return { blocks, setBlocks, loading, reload: load };
}

export async function saveLayout(status: "draft" | "published", blocks: Block[]) {
  const { data: userData } = await supabase.auth.getUser();
  const { error } = await supabase.from("page_layouts").upsert(
    {
      page_slug: PAGE_SLUG,
      status,
      blocks: blocks as unknown as never,
      updated_by: userData.user?.id ?? null,
    },
    { onConflict: "page_slug,status" },
  );
  if (error) throw error;
}
