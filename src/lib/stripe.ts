// Stripe pricing tiers configuration
export const PRICING_TIERS = {
  starter: {
    name: "Starter",
    price_id: "price_1SnFjL7hlrnyTBF1Yy2TWm9C",
    product_id: "prod_TklF0dW7NLmDbW",
    price: 47,
  },
  professional: {
    name: "Professional",
    price_id: "price_1SnFjg7hlrnyTBF1ZJ5this6",
    product_id: "prod_TklGmoEjtrJEhN",
    price: 97,
  },
  enterprise: {
    name: "Enterprise",
    price_id: "price_1SnFkL7hlrnyTBF1VP2iYmm3",
    product_id: "prod_TklGsn7x8cQTbx",
    price: 197,
  },
} as const;

export type TierKey = keyof typeof PRICING_TIERS;
