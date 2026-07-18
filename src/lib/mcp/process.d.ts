// Ambient declaration for `process.env` used inside MCP tool handlers.
// The MCP entry (src/lib/mcp/index.ts) is bundled by @lovable.dev/mcp-js into a
// Supabase Edge Function (Deno), where `process.env` is provided at runtime.
// This file only satisfies the browser-side TypeScript check.
declare const process: {
  env: Record<string, string | undefined>;
};
