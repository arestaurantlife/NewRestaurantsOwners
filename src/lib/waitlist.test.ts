import { test } from "node:test";
import { strict as assert } from "node:assert";
import { waitlistSchema } from "./waitlist";

test("a launch offer signup requires explicit consent", () => {
  assert.equal(waitlistSchema.safeParse({ name: "Owner", email: "owner@example.com", marketingConsent: false }).success, false);
  assert.equal(waitlistSchema.safeParse({ name: "Owner", email: "owner@example.com", marketingConsent: true }).success, true);
});
test("invalid contacts cannot enter the waiting list", () => {
  assert.equal(waitlistSchema.safeParse({ name: " ", email: "invalid", marketingConsent: true }).success, false);
});