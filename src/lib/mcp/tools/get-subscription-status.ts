import { createClient } from "@supabase/supabase-js";
import { defineTool, type ToolContext } from "@lovable.dev/mcp-js";
import { z } from "zod";

declare const process: { env: Record<string, string | undefined> };

function supabaseForUser(ctx: ToolContext) {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_PUBLISHABLE_KEY!, {
    global: { headers: { Authorization: `Bearer ${ctx.getToken()}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export default defineTool({
  name: "get_subscription_status",
  title: "Get subscription status",
  description:
    "Return the signed-in user's NewRestaurantsOwners subscription status: whether they are subscribed, the tier (Starter/Professional/Enterprise), and the current period end date.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: false, openWorldHint: true },
  handler: async (_input: z.infer<z.ZodObject<{}>>, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const supabase = supabaseForUser(ctx);
    const { data, error } = await supabase.functions.invoke("check-subscription", {
      headers: { Authorization: `Bearer ${ctx.getToken()}` },
    });
    if (error) {
      return { content: [{ type: "text", text: error.message }], isError: true };
    }
    const summary = data?.subscribed
      ? `Subscribed to ${data.tier ?? "unknown tier"}${
          data.subscription_end ? ` until ${data.subscription_end}` : ""
        }.`
      : "Not currently subscribed.";
    return {
      content: [{ type: "text", text: summary }],
      structuredContent: {
        subscribed: !!data?.subscribed,
        tier: data?.tier ?? null,
        subscription_end: data?.subscription_end ?? null,
      },
    };
  },
});
