import { auth, defineMcp } from "@lovable.dev/mcp-js";
import getMyProfile from "./tools/get-my-profile";
import listPdfResources from "./tools/list-pdf-resources";
import getSubscriptionStatus from "./tools/get-subscription-status";

// The OAuth issuer must be the direct Supabase host, built from the project ref.
// See knowledge: cloud-auth-oauth-server / app-mcp-server-authoring.
const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "newrestaurantsowners-mcp",
  title: "NewRestaurantsOwners MCP",
  version: "0.1.0",
  instructions:
    "Tools for NewRestaurantsOwners.com. Use `get_my_profile` and `get_subscription_status` to fetch the signed-in user's account context, and `list_pdf_resources` to browse operational PDF resources across the six feature areas (financial-operations, labor-cost-management, food-cost-control, employee-training, essential-forms, community-support).",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [getMyProfile, listPdfResources, getSubscriptionStatus],
});
