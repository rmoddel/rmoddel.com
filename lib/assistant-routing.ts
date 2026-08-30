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

const outOfScopeReplies = [
  "That is a good question for a different kind of chatbot—I keep this one focused on Reuben's work, experience, and approach. Try asking about roles, projects, leadership, AI, or process improvement.",
  "I can’t help much with that one, but I can be very useful on the Reuben-related stuff. His background, projects, strengths, and the kinds of problems he likes to solve are all fair game.",
  "That question wandered a little outside my lane. No hard feelings—I’m the resume concierge, not the internet’s all-purpose oracle. Ask me about Reuben’s experience or work instead.",
  "I’ll leave that mystery to a more general-purpose assistant. Here, I can help with Reuben’s professional background, projects, leadership style, or fit for an opportunity."
];

function includesAny(text: string, terms: string[]) {
  return terms.some((term) => text.includes(term));
}

function chooseOutOfScopeReply(question: string) {
  const index = [...question].reduce((total, character) => total + character.charCodeAt(0), 0) % outOfScopeReplies.length;
  return outOfScopeReplies[index];
}

/**
 * A fast, local resume-chat experience. This intentionally has no network or
 * model dependency, so visitors always get a useful response in production.
 */
export function getSimulatedAssistantReply(question: string) {
  const normalizedQuestion = normalizeAssistantIdentity(question);
  const fixedReply = getDeterministicAssistantReply(normalizedQuestion);

  if (fixedReply) {
    return fixedReply;
  }

  const normalized = normalizeForMatch(normalizedQuestion);

  if (includesAny(normalized, ["can you code", "can he code", "can reuben code", "are you a developer", "do you code"])) {
    return "Yes. I can code and enjoy working hands-on. I’m a solid developer, while my strongest fit combines that technical ability with operations, people, process, communication, and ownership of outcomes.";
  }

  if (includesAny(normalized, ["like coding", "enjoy coding", "like programming", "enjoy programming"])) {
    return "Yes—I enjoy coding. I see it as one of several useful tools for solving a real client or operational problem, alongside clear process, communication, and follow-through.";
  }

  if (includesAny(normalized, ["programming language", "technical stack", "tech stack", "what technologies", "what tools"])) {
    return "My hands-on background includes web development and software delivery, with practical experience using JavaScript/TypeScript, React, Next.js, APIs, databases, automation, and AI-enabled tools. I focus on choosing the technology that makes the workflow simpler and more useful.";
  }

  if (includesAny(normalized, ["coding-only", "coding only", "strictly programming", "strictly coding", "programming-only", "programming only"])) {
    return "Not as my primary fit. I enjoy coding and can work hands-on, but I’m strongest where technical judgment is combined with operations, people, process improvement, communication, and responsibility for a useful outcome.";
  }

  if (normalized.includes("gparency")) {
    return "At GPARENCY, I was Director of Product Operations and Technical Lead from November 2021 through June 2025. I built and scaled an agile development team, hired and mentored contributors, translated product and business priorities into executable work for an MVP marketplace, coordinated internal and overseas developers, and created systems and analytics that gave leadership clearer visibility.";
  }

  if (normalized.includes("eastern union")) {
    return "At Eastern Union, I was Technical Operations Manager. I helped move work from third-party tools into internal systems, led onboarding and training for junior team members, supported reliable operations and adoption, and improved workflows across business units.";
  }

  if (normalized.includes("cardcash")) {
    return "At CardCash, I worked as a Software Analyst, developing automated workflows to reduce manual processing and operational friction. I collaborated across departments on systems improvements, testing, analytics, data integrity, and documentation.";
  }

  if (includesAny(normalized, ["education", "degree", "njit", "school"])) {
    return "I earned a Master of Science in Management Information Systems from the New Jersey Institute of Technology, completed in January 2011. I also completed Dale Carnegie’s Skills for Success program in 2019.";
  }

  if (includesAny(normalized, ["role fits", "role fit", "what kind of role", "best role", "what roles", "interested in a role", "opportunity fit"])) {
    return "I’m strongest in roles that connect operations, people, systems, and execution—such as operations or solutions leadership, implementation, program or project management, customer success, AI operations, and client-facing technical operations. The details of the responsibilities matter most.";
  }

  if (includesAny(normalized, ["manage", "management", "leadership", "lead a team", "leader"])) {
    return "My leadership approach combines empathy with accountability: understand the people and pressures first, clarify priorities and ownership, then keep work moving with practical follow-through. My experience includes hiring and mentoring, coordinating internal and overseas contributors, and stakeholder communication.";
  }

  if (includesAny(normalized, ["process", "workflow", "improve", "improvement", "adoption"])) {
    return "I start by understanding the real workflow and the people affected by it, then identify the constraint and make the simplest useful improvement. The goal is a solution that works in daily use—not just one that looks good in a demo.";
  }

  if (includesAny(normalized, ["ai", "artificial intelligence", "software", "automation", "personalized solution"])) {
    return "I use AI and software as delivery capabilities, not decoration. If they reduce friction in a real workflow, I may use automation, forms, dashboards, document intelligence, integrations, or a tailored tool—with simple controls for the people using it.";
  }

  if (includesAny(normalized, ["project", "flyer", "broadcast", "matzah", "zen health", "medflo"])) {
    return "The public project examples are practical workflow tools: a self-service flyer generator that produces print-ready PDFs, and a community announcement broadcast system with guided controls for messages, recipients, delivery settings, and costs. I also completed recent client website work for MedFlo AI, Zen Health Care Services, and Matzah.store.";
  }

  if (includesAny(normalized, ["experience", "background", "career", "worked", "employment", "resume", "who is reuben", "tell me about yourself"])) {
    return "I bring 15+ years across business systems, operations, software delivery, process improvement, and team leadership. The throughline is practical execution: understand the real problem, align people and technology, and deliver something useful.";
  }

  if (includesAny(normalized, ["working style", "work style", "value at work", "values", "approach different", "how do you work"])) {
    return "My style is honest, direct, practical, and people-aware. I listen before prescribing, take time to understand the pressures around a process, and care whether the final result actually works for the people who have to live with it.";
  }

  if (includesAny(normalized, ["skill", "strength", "good at", "most useful"])) {
    return "My strongest skills sit at the intersection of operations, people, systems, and execution: process improvement, cross-functional leadership, requirements discovery, AI-enabled solutions, software fluency, clear communication, and follow-through.";
  }

  if (includesAny(normalized, ["contact", "reach", "email", "hire", "talk"])) {
    return "I’d be glad to connect. Please use the contact page and share a little context about the role, project, or process you are working through.";
  }

  return chooseOutOfScopeReply(normalized);
}
