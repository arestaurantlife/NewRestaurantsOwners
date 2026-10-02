import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useMediaUrl } from "@/pagebuilder/media";

export type ContentKind = "video" | "course" | "podcast" | "lesson";
export type ContentAccess = "free" | "subscriber";
export type ContentTier = "starter" | "professional" | "enterprise";

export interface ContentItem {
  id: string;
  slug: string;
  kind: ContentKind;
  parent_id: string | null;
  title: string;
  description: string | null;
  thumbnail: string | null;
  duration: string | null;
  access: ContentAccess;
  min_tier: ContentTier;
  published: boolean;
  sort_order: number;
  created_at: string;
}

export interface AdminContentItem extends ContentItem {
  media_url: string | null;
  storage_path: string | null;
}

/** Public columns only — media links are delivered by the get-content-url function. */
export const PUBLIC_COLUMNS =
  "id, slug, kind, parent_id, title, description, thumbnail, duration, access, min_tier, published, sort_order, created_at";

export const CONTENT_BUCKET = "content-media";
export const CONTENT_THUMB_PREFIX = "content:";

export const KIND_LABEL: Record<ContentKind, string> = {
  video: "Video",
  course: "Course",
  podcast: "Podcast",
  lesson: "Lesson",
};

export const TIER_LABEL: Record<ContentTier, string> = {
  starter: "Starter",
  professional: "Professional",
  enterprise: "Enterprise",
};

const contentThumbCache = new Map<string, string>();

/** Resolve a thumbnail: external URL, media-library ref, or uploaded content-media file. */
export function useThumbnail(value?: string | null): string {
  const isContent = typeof value === "string" && value.startsWith(CONTENT_THUMB_PREFIX);
  const viaMedia = useMediaUrl(isContent ? "" : value ?? "");
  const [contentUrl, setContentUrl] = useState(
    isContent ? contentThumbCache.get(value as string) ?? "" : "",
  );

  useEffect(() => {
    if (!isContent || !value) return;
    const cached = contentThumbCache.get(value);
    if (cached) {
      setContentUrl(cached);
      return;
    }
    let cancelled = false;
    (async () => {
      // Admins can sign directly (covers unpublished items); everyone else goes through the function.
      const path = value.slice(CONTENT_THUMB_PREFIX.length);
      const direct = await supabase.storage.from(CONTENT_BUCKET).createSignedUrl(path, 3600);
      let url = direct.data?.signedUrl ?? "";
      if (!url) {
        const { data } = await supabase.functions.invoke("get-content-url", {
          body: { thumbnails: [value] },
        });
        url = data?.urls?.[value] ?? "";
      }
      if (url) contentThumbCache.set(value, url);
      if (!cancelled) setContentUrl(url);
    })();
    return () => {
      cancelled = true;
    };
  }, [isContent, value]);

  return isContent ? contentUrl : viaMedia;
}

export function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}
