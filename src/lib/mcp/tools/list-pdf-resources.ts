import { createClient } from "@supabase/supabase-js";
import { defineTool, type ToolContext } from "@lovable.dev/mcp-js";
import { z } from "zod";

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
    let query = supabase
      .from("feature_pdfs")
      .select("id, title, description, tags, sort_order, created_at")
      .eq("feature_slug", feature_slug)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false })
      .limit(limit);

    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }
    if (tag) {
      query = query.contains("tags", [tag.toLowerCase()]);
    }

    const { data, error } = await query;
    if (error) {
      return { content: [{ type: "text", text: error.message }], isError: true };
    }

    const rows = data ?? [];
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
