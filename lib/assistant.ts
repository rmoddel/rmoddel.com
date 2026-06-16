import { packages, projects, services, websiteKnowledge } from "@/lib/site-content";

export type AssistantMessage = {
  role: "user" | "assistant";
  content: string;
};

export type AssistantSource = "booting" | "local-llm" | "bedrock" | "site-knowledge" | "error";

export const assistantName = "RueMode";
export const assistantTitle = "Reuben's Virtual Assistance";

export const assistantSystemPrompt = `
You are ${assistantName}, ${assistantTitle} for rmoddel.com.
Your job is to answer questions about Reuben Moddel's services, positioning, packages, project types, and contact path.
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

function listPackages() {
  return packages.map((pkg) => `${pkg.title}: ${pkg.price}. ${pkg.body}`).join(" ");
}

function listServices() {
  return services.map((service) => `${service.title}: ${service.body}`).join(" ");
}

function listProjects() {
  return projects.map((project) => `${project.title}: ${project.summary}`).join(" ");
}

export function buildFallbackReply(question: string) {
  const normalized = question.toLowerCase();

  if (includesAny(normalized, ["price", "pricing", "cost", "budget", "package", "packages"])) {
    return `Here are the current package starting points: ${listPackages()} If you want the right fit, the site suggests starting with a conversation.`;
  }

  if (includesAny(normalized, ["service", "offer", "help with", "what do you do"])) {
    return `Reuben helps across four lanes: ${listServices()} The common thread is turning rough ideas into polished, usable outputs.`;
  }

  if (includesAny(normalized, ["project", "work sample", "case study", "portfolio", "example"])) {
    return `The site highlights a few project types: ${listProjects()} They are presented as honest examples rather than inflated case studies.`;
  }

  if (includesAny(normalized, ["who is reuben", "about reuben", "about you", "background"])) {
    return "Reuben is positioned as a creative AI operator for real-world business: someone people call when they have a rough idea and need help making it make sense across writing, design direction, software thinking, and AI-assisted execution.";
  }

  if (includesAny(normalized, ["ai", "workflow", "automation", "internal tool", "sop"])) {
    return "The site presents AI as an amplifier, not a replacement for judgment. Reuben helps with workflow reviews, automation ideas, internal tools, SOP direction, dashboards, data cleanup, and document processing strategy.";
  }

  if (includesAny(normalized, ["contact", "book", "session", "call", "start"])) {
    return "The main entry point is the Idea-to-Execution Session. The site invites visitors to start with a conversation and use the contact form to share their rough idea, timeline, and budget range.";
  }

  if (includesAny(normalized, ["audience", "who is this for", "who do you work with"])) {
    return "The site is aimed at businesses, nonprofits, founders, and community organizations that need help turning rough ideas into clear, usable deliverables.";
  }

  return "I can answer questions about Reuben's services, packages, project types, AI workflow help, and how to start. If you need something more specific than what the site states, use the contact form and bring the rough version.";
}
