const promptInjectionAnswer =
  "I can answer questions about my professional background and work: experience, strengths, projects, leadership approach, GPS philosophy, or contact information.";

function normalizeForMatch(text: string) {
  return text
    .toLowerCase()
    .replace(/[’']/g, "'")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9+#.\s/-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function normalizeAssistantIdentity(text: string) {
  return text.replace(/\b(reuvain|reuven)\b/gi, "Reuben");
}

export function getDeterministicAssistantReply(question: string) {
  const normalized = normalizeForMatch(question);

  if (
    [
      "ignore previous instructions",
      "system prompt",
      "reveal your prompt",
      "developer message",
      "private content",
      "act as chatgpt",
      "unrelated general assistant",
      "browse the web",
      "execute code"
    ].some((phrase) => normalized.includes(phrase))
  ) {
    return promptInjectionAnswer;
  }

  if (["hi", "hello", "hey", "good morning", "good afternoon"].includes(normalized)) {
    return "Hi—glad you’re here. What would you like to know about my background, the work I’ve done, or the kind of problems I enjoy solving?";
  }

  if (
    ["salary", "compensation", "rate", "price", "pricing", "cost", "budget", "package", "packages"].some(
      (term) => normalized.includes(term)
    )
  ) {
    return "I do not publish salary expectations, pricing, or budget details here. Share some context through the contact page and I can respond directly.";
  }

  return undefined;
}
