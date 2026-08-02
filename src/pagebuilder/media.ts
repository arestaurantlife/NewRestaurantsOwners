import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const MEDIA_BUCKET = "site-media";
export const MEDIA_PREFIX = "media:";

export interface MediaAsset {
  id: string;
  kind: string;
  title: string;
  storage_path: string;
  bucket: string;
  mime: string | null;
  size: number | null;
  tags: string[];
  created_at: string;
}

export const isMediaRef = (v?: string | null) =>
  typeof v === "string" && v.startsWith(MEDIA_PREFIX);

export const mediaRef = (bucket: string, path: string) =>
  `${MEDIA_PREFIX}${bucket}/${path}`;

const parseRef = (v: string) => {
  const rest = v.slice(MEDIA_PREFIX.length);
  const idx = rest.indexOf("/");
  return { bucket: rest.slice(0, idx), path: rest.slice(idx + 1) };
};

const cache = new Map<string, string>();
const inflight = new Map<string, Promise<string>>();

/** Resolves a stored value to a usable src. External URLs pass through. */
export async function resolveMediaUrl(value?: string | null): Promise<string> {
  if (!value) return "";
  if (!isMediaRef(value)) return value;
  const hit = cache.get(value);
  if (hit) return hit;
  const pending = inflight.get(value);
  if (pending) return pending;

  const { bucket, path } = parseRef(value);
  const promise = supabase.storage
    .from(bucket)
    .createSignedUrl(path, 60 * 60 * 24 * 7)
    .then(({ data }) => {
      const url = data?.signedUrl ?? "";
      if (url) cache.set(value, url);
      inflight.delete(value);
      return url;
    });
  inflight.set(value, promise);
  return promise;
}

/** Hook version — returns "" until resolved (external URLs resolve instantly). */
export function useMediaUrl(value?: string | null) {
  const [url, setUrl] = useState(() => (isMediaRef(value) ? cache.get(value!) ?? "" : value ?? ""));

  useEffect(() => {
    let cancelled = false;
    if (!value) {
      setUrl("");
      return;
    }
    if (!isMediaRef(value)) {
      setUrl(value);
      return;
    }
    const cached = cache.get(value);
    if (cached) {
      setUrl(cached);
      return;
    }
    resolveMediaUrl(value).then((u) => {
      if (!cancelled) setUrl(u);
    });
    return () => {
      cancelled = true;
    };
  }, [value]);

  return url;
}

const kindFor = (file: File) => {
  if (file.type.startsWith("image/")) return "image";
  if (file.type.startsWith("video/")) return "video";
  if (file.type === "application/pdf") return "pdf";
  return "file";
};

export async function uploadMedia(file: File, title?: string) {
  const { data: userData } = await supabase.auth.getUser();
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safeName}`;

  const { error: upErr } = await supabase.storage
    .from(MEDIA_BUCKET)
    .upload(path, file, { cacheControl: "3600", upsert: false, contentType: file.type });
  if (upErr) throw upErr;

  const { data, error } = await supabase
    .from("media_assets")
    .insert({
      kind: kindFor(file),
      title: title || file.name,
      storage_path: path,
      bucket: MEDIA_BUCKET,
      mime: file.type,
      size: file.size,
      created_by: userData.user?.id ?? null,
    })
    .select()
    .single();
  if (error) throw error;
  return data as MediaAsset;
}

export async function listMedia(kind?: string) {
  let query = supabase
    .from("media_assets")
    .select("*")
    .order("created_at", { ascending: false });
  if (kind) query = query.eq("kind", kind);
  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as MediaAsset[];
}

export async function deleteMedia(asset: MediaAsset) {
  await supabase.storage.from(asset.bucket).remove([asset.storage_path]);
  const { error } = await supabase.from("media_assets").delete().eq("id", asset.id);
  if (error) throw error;
  cache.delete(mediaRef(asset.bucket, asset.storage_path));
}

/** Extract a YouTube/Vimeo embed URL, or null when the value isn't an embeddable link. */
export function embedUrl(value?: string | null): string | null {
  if (!value || isMediaRef(value)) return null;
  const yt = value.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{6,})/,
  );
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
  const vimeo = value.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;
  return null;
}
