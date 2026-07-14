import { capabilities, projects, websiteKnowledge } from "@/lib/site-content";

export type AssistantMessage = {
  role: "user" | "assistant";
  content: string;
};

export type AssistantSource = "booting" | "local-llm" | "bedrock" | "site-knowledge" | "error";

export const assistantName = "Reuben's Assistant";
export const assistantTitle = "Site assistant";

export const assistantSystemPrompt = `
You are ${assistantName}, a plainspoken ${assistantTitle.toLowerCase()} for rmoddel.com.
Your job is to answer questions about Reuben Moddel's background, positioning, capabilities, work themes, resume, project examples, and contact path.
Use the website knowledge below as the source of truth.
Do not invent credentials, timelines, deliverables, pricing, client names, or portfolio claims.
If the user asks something not supported by the website knowledge, say that clearly and redirect to the contact form.
Keep answers concise, useful, and direct.
Prefer short paragraphs and simple bullet lists when they improve clarity.

Website knowledge:
${websiteKnowledge}
`.trim();

function includesAny(text: string, needles: string[]) {
  return needles.some((needle) => text.includes(needle));
}

function listCapabilities() {
  return capabilities.map((capability) => `${capability.title}: ${capability.body}`).join(" ");
}

function listProjects() {
  return projects.map((project) => `${project.title}: ${project.summary}`).join(" ");
}

export function buildFallbackReply(question: string) {
  const normalized = question.toLowerCase();

  if (includesAny(normalized, ["price", "pricing", "cost", "budget", "package", "packages"])) {
    return "This site does not publish service packages or pricing. It is mainly a personal portfolio and working profile. For a service inquiry, send the context through the contact form and Reuben can respond directly.";
  }

  if (includesAny(normalized, ["service", "offer", "help with", "what do you do", "capability", "capabilities"])) {
    return `Reuben is useful across four lanes: ${listCapabilities()} The common thread is helping people think clearly and turn messy work into practical movement.`;
  }

  if (includesAny(normalized, ["project", "work sample", "case study", "portfolio", "example", "work"])) {
    return `The site highlights a few project types: ${listProjects()} They are presented as honest examples rather than inflated case studies.`;
  }

  if (includesAny(normalized, ["who is reuben", "about reuben", "about you", "background"])) {
    return "Reuben is positioned as a product operations and technical leader who helps people make sense of messy work. His background runs from web development into software analysis, technical operations, product operations, and technical leadership.";
  }

  if (includesAny(normalized, ["ai", "workflow", "automation", "internal tool", "sop"])) {
    return "The site presents AI as useful when guided by real context. Reuben focuses first on human understanding, workflow reality, and practical judgment, then uses AI where it can speed up drafting, structure, analysis, or repetitive work.";
  }

  if (includesAny(normalized, ["contact", "book", "session", "call", "start", "hire", "job", "recruit"])) {
    return "Use the contact form for job opportunities, recruiting conversations, collaborations, or relevant service inquiries. The site is mainly a personal portfolio, with contact left open for the right fit.";
  }

  if (includesAny(normalized, ["audience", "who is this for", "who do you work with"])) {
    return "The site is mainly for prospective employers, hiring teams, collaborators, and people who may have a relevant project or service inquiry.";
  }

  return "I can answer questions about Reuben's background, capabilities, work themes, AI workflow perspective, resume, and how to get in touch. If you need something more specific than what the site states, use the contact form.";
}
