import { createClient } from "@supabase/supabase-js";
import { defineTool, type ToolContext } from "@lovable.dev/mcp-js";
import { z } from "zod";

declare const process: { env: Record<string, string | undefined> };

const FEATURE_SLUGS = [
  "financial-operations",
  "labor-cost-management",
  "food-cost-control",
  "employee-training",
  "essential-forms",
  "community-support",
] as const;

function supabaseForUser(ctx: ToolContext) {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_PUBLISHABLE_KEY!, {
    global: { headers: { Authorization: `Bearer ${ctx.getToken()}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export default defineTool({
  name: "list_pdf_resources",
  title: "List PDF resources",
  description:
    "List PDF resources for a feature area of NewRestaurantsOwners. Optionally filter by a tag or search text in the title/description.",
  inputSchema: {
    feature_slug: z
      .enum(FEATURE_SLUGS)
      .describe("Which feature area to list PDFs for."),
    search: z
      .string()
      .trim()
      .max(100)
      .optional()
      .describe("Optional text to match against the PDF title or description."),
    tag: z
      .string()
      .trim()
      .max(50)
      .optional()
      .describe("Optional single tag to filter by (case-insensitive)."),
    limit: z.number().int().min(1).max(50).default(20),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ feature_slug, search, tag, limit }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const supabase = supabaseForUser(ctx);
    // feature_pdfs is admin-only under RLS; go through the access-checked
    // edge function (admin bypass, else active/trialing Stripe subscription).
    const { data: access, error: accessErr } = await supabase.functions.invoke("get-pdf-urls", {
      body: { featureSlug: feature_slug },
    });
    if (accessErr) {
      return { content: [{ type: "text", text: accessErr.message }], isError: true };
    }
    if (!access?.allowed) {
      const reason = access?.reason === "signin" ? "sign in" : "an active subscription";
      return {
        content: [{ type: "text", text: `Listing PDF resources requires ${reason}.` }],
        isError: true,
      };
    }

    let rows = ((access.rows ?? []) as any[]).map((r) => ({
      ...r,
      tags: Array.isArray(r.tags) ? r.tags : [],
    }));

    if (search) {
      const safe = search.replace(/[^\p{L}\p{N} \-'.]/gu, " ").replace(/\s+/g, " ").trim().toLowerCase();
      if (safe) {
        rows = rows.filter(
          (r) =>
            (r.title ?? "").toLowerCase().includes(safe) ||
            (r.description ?? "").toLowerCase().includes(safe),
        );
      }
    }
    if (tag) {
      const t = tag.toLowerCase();
      rows = rows.filter((r) => r.tags.includes(t));
    }
    rows = rows.slice(0, limit);
    return {
      content: [
        {
          type: "text",
          text:
            rows.length === 0
              ? `No PDFs found for ${feature_slug}.`
              : rows
                  .map(
                    (r) =>
                      `• ${r.title}${r.description ? ` — ${r.description}` : ""}${
                        r.tags?.length ? ` [${r.tags.join(", ")}]` : ""
                      }`,
                  )
                  .join("\n"),
        },
      ],
      structuredContent: { feature_slug, count: rows.length, resources: rows },
    };
  },
});
