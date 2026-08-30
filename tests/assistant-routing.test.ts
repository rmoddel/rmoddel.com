import assert from "node:assert/strict";
import test from "node:test";
import {
  getSimulatedAssistantReply,
  normalizeAssistantIdentity
} from "../lib/assistant-routing";

const ordinaryQuestions = [
  "Can Reuvain code?",
  "Can Reuben code?",
  "Can he code?",
  "Can you code?",
  "Do you like coding?",
  "Do you enjoy programming?",
  "What programming languages do you know?",
  "What is your technical stack?",
  "Are you interested in a strictly programming role?",
  "Would you want a coding-only job?",
  "What kind of role fits you best?"
];

test("normalizes common Reuben name variants", () => {
  assert.equal(normalizeAssistantIdentity("Can Reuvain code?"), "Can Reuben code?");
  assert.equal(normalizeAssistantIdentity("Can Reuven code?"), "Can Reuben code?");
});

test("answers ordinary professional questions from the local response library", () => {
  for (const question of ordinaryQuestions) {
    assert.ok(getSimulatedAssistantReply(question), question);
  }
});

test("uses a friendly response when the question is outside the profile", () => {
  assert.match(getSimulatedAssistantReply("What is the weather tomorrow?"), /different kind|all-purpose|outside my lane|general-purpose/i);
});
