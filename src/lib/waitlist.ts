import { z } from "zod";

export const WAITLIST_CONSENT = "I agree to receive the launch announcement and first-month promotional offer from NewRestaurantsOwners.com by email. I can unsubscribe at any time.";
export const waitlistSchema = z.object({
  name: z.string().trim().min(1, "Please enter your name.").max(100),
  email: z.string().trim().email("Please enter a valid email.").max(255).transform((s) => s.toLowerCase()),
  marketingConsent: z.literal(true, { error: "Please agree to receive the launch offer." }),
  website: z.string().max(0).optional(),
});