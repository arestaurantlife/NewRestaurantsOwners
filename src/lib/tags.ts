export const normalizeTag = (raw: string): string =>
  raw.trim().toLowerCase().replace(/\s+/g, " ");

export const parseTagsInput = (input: string): string[] => {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const part of input.split(",")) {
    const t = normalizeTag(part);
    if (t && !seen.has(t)) {
      seen.add(t);
      out.push(t);
    }
  }
  return out;
};
