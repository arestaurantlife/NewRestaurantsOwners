import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface ThemeTokens {
  primary?: string;
  accent?: string;
  background?: string;
  foreground?: string;
  card?: string;
  muted?: string;
  wine?: string;
  gold?: string;
  cream?: string;
  charcoal?: string;
  radius?: string;
  headingFont?: string;
  bodyFont?: string;
}

/** Maps a token key to the CSS custom property it drives. */
const CSS_VAR: Record<string, string> = {
  primary: "--primary",
  accent: "--accent",
  background: "--background",
  foreground: "--foreground",
  card: "--card",
  muted: "--muted",
  wine: "--wine",
  gold: "--gold",
  cream: "--cream",
  charcoal: "--charcoal",
};

/** #rrggbb -> "h s% l%" (the format the design system expects). */
export function hexToHsl(hex: string): string | null {
  const m = /^#?([0-9a-f]{6}|[0-9a-f]{3})$/i.exec(hex.trim());
  if (!m) return null;
  let h = m[1];
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  const r = parseInt(h.slice(0, 2), 16) / 255;
  const g = parseInt(h.slice(2, 4), 16) / 255;
  const b = parseInt(h.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let hue = 0;
  let sat = 0;
  if (max !== min) {
    const d = max - min;
    sat = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) hue = ((g - b) / d + (g < b ? 6 : 0)) * 60;
    else if (max === g) hue = ((b - r) / d + 2) * 60;
    else hue = ((r - g) / d + 4) * 60;
  }
  return `${Math.round(hue)} ${Math.round(sat * 100)}% ${Math.round(l * 100)}%`;
}

/** "h s% l%" -> #rrggbb, for feeding native color inputs. */
export function hslToHex(hsl?: string): string {
  if (!hsl) return "#000000";
  const m = /(-?[\d.]+)\s+([\d.]+)%\s+([\d.]+)%/.exec(hsl);
  if (!m) return hsl.startsWith("#") ? hsl : "#000000";
  const h = parseFloat(m[1]) / 360;
  const s = parseFloat(m[2]) / 100;
  const l = parseFloat(m[3]) / 100;
  const hue = (p: number, q: number, t: number) => {
    let tt = t;
    if (tt < 0) tt += 1;
    if (tt > 1) tt -= 1;
    if (tt < 1 / 6) return p + (q - p) * 6 * tt;
    if (tt < 1 / 2) return q;
    if (tt < 2 / 3) return p + (q - p) * (2 / 3 - tt) * 6;
    return p;
  };
  let r = l;
  let g = l;
  let b = l;
  if (s !== 0) {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue(p, q, h + 1 / 3);
    g = hue(p, q, h);
    b = hue(p, q, h - 1 / 3);
  }
  const to = (v: number) => Math.round(v * 255).toString(16).padStart(2, "0");
  return `#${to(r)}${to(g)}${to(b)}`;
}

/** Reads the value currently applied by index.css for a token. */
export function readCssVar(name: string): string {
  if (typeof window === "undefined") return "";
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

export function applyTheme(tokens: ThemeTokens) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  Object.entries(CSS_VAR).forEach(([key, cssVar]) => {
    const value = tokens[key as keyof ThemeTokens];
    if (value) root.style.setProperty(cssVar, String(value));
  });
  if (tokens.primary) root.style.setProperty("--ring", tokens.primary);
  if (tokens.wine) {
    root.style.setProperty(
      "--gradient-hero",
      `linear-gradient(135deg, hsl(${tokens.wine}) 0%, hsl(${tokens.wine}) 100%)`,
    );
  }
  if (tokens.gold) {
    root.style.setProperty(
      "--gradient-gold",
      `linear-gradient(135deg, hsl(${tokens.gold}) 0%, hsl(${tokens.gold}) 100%)`,
    );
  }
  if (tokens.radius) root.style.setProperty("--radius", tokens.radius);
  if (tokens.headingFont) root.style.setProperty("--font-display", tokens.headingFont);
  if (tokens.bodyFont) root.style.setProperty("--font-body", tokens.bodyFont);
}

export function clearTheme() {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  [...Object.values(CSS_VAR), "--ring", "--radius", "--gradient-hero", "--gradient-gold"].forEach(
    (v) => root.style.removeProperty(v),
  );
}

export function useSiteTheme(status: "draft" | "published" = "published") {
  const [tokens, setTokens] = useState<ThemeTokens>({});
  const [loaded, setLoaded] = useState(false);

  const load = useCallback(async () => {
    const { data } = await supabase
      .from("site_theme")
      .select("tokens")
      .eq("status", status)
      .maybeSingle();
    const next = (data?.tokens ?? {}) as ThemeTokens;
    setTokens(next);
    applyTheme(next);
    setLoaded(true);
  }, [status]);

  useEffect(() => {
    load();
  }, [load]);

  return { tokens, setTokens, loaded, reload: load };
}

export async function saveTheme(status: "draft" | "published", tokens: ThemeTokens) {
  const { data: userData } = await supabase.auth.getUser();
  const { error } = await supabase.from("site_theme").upsert(
    {
      status,
      tokens: tokens as unknown as never,
      updated_by: userData.user?.id ?? null,
    },
    { onConflict: "status" },
  );
  if (error) throw error;
}
