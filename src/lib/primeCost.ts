export const PRIME_COST_TARGET = 58;
export const PRIME_COST_DEFAULTS = { sales: 65000, food: 34, labor: 35 };

export function calculatePrimeCost(sales: number, food: number, labor: number) {
  const primeCost = food + labor;
  const gap = Math.max(0, primeCost - PRIME_COST_TARGET);
  const monthlyGap = sales * gap / 100;
  return {
    primeCost,
    gap,
    monthlyGap,
    annualGap: monthlyGap * 12,
    foodDollars: sales * food / 100,
    laborDollars: sales * labor / 100,
    remainingDollars: sales * (100 - primeCost) / 100,
    status: primeCost <= 60 ? "controlled" : primeCost <= 65 ? "moderate" : "critical",
    savingsLow: sales * 0.03 * 12,
    savingsHigh: sales * 0.05 * 12,
  };
}