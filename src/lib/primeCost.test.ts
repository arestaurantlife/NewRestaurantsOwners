/// <reference types="node" />
import { describe, test } from "node:test";
import { strict as assert } from "node:assert";
import { calculatePrimeCost, PRIME_COST_DEFAULTS, PRIME_COST_TARGET } from "./primeCost";

const expect = (actual: unknown) => ({ toBe: (expected: unknown) => assert.equal(actual, expected) });

describe("prime cost estimates", () => {
  test("default 65000 sales, 34% food and 35% labor produce a 7150 monthly and 85800 annual gap", () => {
    const result = calculatePrimeCost(PRIME_COST_DEFAULTS.sales, PRIME_COST_DEFAULTS.food, PRIME_COST_DEFAULTS.labor);
    expect(PRIME_COST_TARGET).toBe(58);
    expect(result.primeCost).toBe(69);
    expect(result.monthlyGap).toBe(7150);
    expect(result.annualGap).toBe(85800);
  });
  test("costs below the target never produce a negative leak", () => {
    const result = calculatePrimeCost(65000, 28, 28);
    expect(result.monthlyGap).toBe(0);
    expect(result.annualGap).toBe(0);
  });
  test("status boundaries handle fractional percentages without gaps", () => {
    expect(calculatePrimeCost(65000, 30, 30).status).toBe("controlled");
    expect(calculatePrimeCost(65000, 30, 30.1).status).toBe("moderate");
    expect(calculatePrimeCost(65000, 30, 35).status).toBe("moderate");
    expect(calculatePrimeCost(65000, 30, 35.1).status).toBe("critical");
  });
  test("3 to 5 percentage point scenarios are based on annual sales", () => {
    const result = calculatePrimeCost(65000, 34, 35);
    expect(result.savingsLow).toBe(23400);
    expect(result.savingsHigh).toBe(39000);
  });
  test("zero sales gives zero dollar estimates", () => {
    const result = calculatePrimeCost(0, 34, 35);
    expect(result.annualGap).toBe(0);
    expect(result.savingsHigh).toBe(0);
  });
});