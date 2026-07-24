import {
  capabilities,
  outcomePoints,
  projects,
  technicalBackground,
  websiteKnowledge,
  workingPrinciples
} from "@/lib/site-content";
import {
  education,
  employmentHistory,
  leadershipSkills,
  professionalDevelopment,
  resumeIdentity,
  resumeSummary
} from "@/lib/resume-content";
import {
  assistantName,
  assistantTitle,
  type AssistantMessage
} from "@/lib/assistant-shared";

export { assistantName, type AssistantMessage } from "@/lib/assistant-shared";

export type AssistantSource = "booting" | "local-llm" | "bedrock" | "site-knowledge" | "error";

export const assistantSystemPrompt = `
You are ${assistantName}, a plainspoken ${assistantTitle.toLowerCase()} for rmoddel.com.
Your job is to answer questions about Reuben Moddel's background, positioning, capabilities, work themes, resume, project examples, and contact path.
Use the website knowledge below as the source of truth.
If someone refers to Reuben as Reuvain, treat that as the same person.
Answer naturally about Reuben. Avoid meta phrasing about how the site presents him unless you are explaining what public information is or is not available.
Do not invent credentials, timelines, deliverables, pricing, client names, or portfolio claims.
If a question is partially supported, answer the supported part first and name the boundary clearly.
Do not give a generic topic list unless the user asks what you can answer.
Use the contact form redirect mainly for unsupported private details, availability, pricing, or custom scope questions.
Keep answers concise, useful, specific, and direct.
Prefer short paragraphs and simple bullet lists when they improve clarity.

Website knowledge:
${websiteKnowledge}
`.trim();

function escapeRegExp(text: string) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function includesAny(text: string, needles: readonly string[]) {
  return needles.some((needle) => {
    const normalizedNeedle = normalizeForMatch(needle);

    if (normalizedNeedle.length <= 3 && /^[a-z0-9+#.]+$/.test(normalizedNeedle)) {
      return new RegExp(`(^|\\s)${escapeRegExp(normalizedNeedle)}($|\\s)`).test(text);
    }

    return text.includes(normalizedNeedle);
  });
}

function normalizeForMatch(text: string) {
  return text
    .toLowerCase()
    .replace(/[’']/g, "'")
    .replace(/\breuvain\b/g, "reuben")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9+#.\s/-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function bulletList(items: readonly string[]) {
  return items.map((item) => `- ${item}`).join("\n");
}

function listCapabilities() {
  return bulletList(
    capabilities.map((capability) => `${capability.title}: ${capability.body}`)
  );
}

function listProjects() {
  return bulletList(
    projects.map(
      (project) =>
        `${project.type}: ${project.summary} Deliverables include ${project.deliverables.join(
          ", "
        )}.`
    )
  );
}

function listRoleHistory() {
  return bulletList(
    employmentHistory.map(
      (role) => `${role.title}, ${role.company} (${role.dates})`
    )
  );
}

function listSkills(items: readonly string[]) {
  return bulletList(items);
}

function listTechnicalBackground() {
  return bulletList(
    technicalBackground.map((group) => `${group.area}: ${group.items.join(", ")}`)
  );
}

function getProjectByNeedle(...needles: string[]) {
  return projects.find((project) => {
    const haystack = normalizeForMatch(
      [project.type, project.title, project.summary, ...project.deliverables].join(" ")
    );

    return needles.some((needle) => haystack.includes(normalizeForMatch(needle)));
  });
}

function describeProject(project: (typeof projects)[number]) {
  return [
    `${project.type}: ${project.title}.`,
    "",
    project.summary,
    "",
    "What the site lists:",
    bulletList(project.deliverables),
    "",
    `Result: ${project.result}`
  ].join("\n");
}

const broadFollowUps = [
  "tell me more",
  "more",
  "go on",
  "expand",
  "can you expand",
  "what else",
  "details",
  "more detail",
  "give me details"
];

function buildContextualQuestion(question: string, messages?: AssistantMessage[]) {
  const normalized = normalizeForMatch(question);

  if (!messages?.length || !broadFollowUps.includes(normalized)) {
    return question;
  }

  const previousUserQuestion = [...messages]
    .reverse()
    .find(
      (message) =>
        message.role === "user" && normalizeForMatch(message.content) !== normalized
    );

  return previousUserQuestion
    ? `${previousUserQuestion.content}\nFollow-up: ${question}`
    : question;
}

type FallbackTopic = {
  triggers: readonly string[];
  priority?: number;
  answer: () => string;
};

const fallbackTopics: readonly FallbackTopic[] = [
  {
    triggers: [
      "what can you answer",
      "what can i ask",
      "what do you know",
      "what questions",
      "site assistant",
      "assistant"
    ],
    answer: () =>
      [
        "I can answer from the site's published content, especially:",
        "",
        bulletList([
          "Reuben's background and resume",
          "Operations, people leadership, and cross-functional execution experience",
          "Clear communication, process improvement, stakeholder alignment, and business systems work",
          "Technical problem-solving, software, cloud, database, and systems background",
          "Advanced AI, OpenAI API integrations, and automation used with judgment",
          "Selected work examples and contact path"
        ])
      ].join("\n")
  },
  {
    triggers: [
      "who is reuben",
      "who's reuben",
      "what is reuben",
      "what's reuben",
      "about reuben",
      "about you",
      "background",
      "summary",
      "overview",
      "bio",
      "introduce",
      "tell me about reuben"
    ],
    answer: () =>
      [
        "Reuben is a strong communicator and business operations leader with deep technical fluency and practical AI judgment.",
        "",
        resumeSummary.join(" "),
        "",
        "The short arc: hands-on web development, software and business systems analysis, technical operations, product operations, AI-enabled workflow thinking, people leadership, and organizational execution."
      ].join("\n")
  },
  {
    triggers: [
      "experience",
      "employment",
      "work history",
      "career",
      "roles",
      "jobs",
      "job history",
      "companies",
      "where has he worked"
    ],
    priority: -4,
    answer: () =>
      [
        "The resume shows this work history:",
        "",
        listRoleHistory(),
        "",
        "The throughline is moving from hands-on web development into software and business systems analysis, then into technical operations, product operations, AI-enabled workflow thinking, people leadership, and organizational execution."
      ].join("\n")
  },
  {
    triggers: [
      "gpacency",
      "gparency",
      "director",
      "product operations",
      "technical lead",
      "mvp marketplace",
      "agile development team",
      "latest role",
      "most recent role"
    ],
    priority: 3,
    answer: () => {
      const role = employmentHistory[0];

      return [
        `Reuben's most recent listed role is ${role.title} at ${role.company}, ${role.location} (${role.dates}).`,
        "",
        "The resume highlights:",
        bulletList(role.points)
      ].join("\n");
    }
  },
  {
    triggers: [
      "technical operations manager",
      "eastern union",
      "migration",
      "internal systems",
      "kpi"
    ],
    priority: 3,
    answer: () => {
      const role = employmentHistory[1];

      return [
        `At ${role.company}, Reuben was ${role.title} (${role.dates}).`,
        "",
        bulletList(role.points)
      ].join("\n");
    }
  },
  {
    triggers: [
      "software analyst",
      "cardcash",
      "automated workflows",
      "manual processing",
      "data integrity",
      "analytics processes"
    ],
    priority: 3,
    answer: () => {
      const role = employmentHistory[2];

      return [
        `At ${role.company}, Reuben was a ${role.title} (${role.dates}).`,
        "",
        bulletList(role.points)
      ].join("\n");
    }
  },
  {
    triggers: [
      "web developer",
      "development background",
      "developer background",
      "central analysis",
      "new york guest",
      "code",
      "coding"
    ],
    answer: () =>
      [
        "Reuben started in web developer roles before moving into software analysis, technical operations, product operations, and operations leadership.",
        "",
        bulletList(
          employmentHistory
            .filter((role) => role.title.toLowerCase().includes("web developer"))
            .map((role) => `${role.company} (${role.dates}): ${role.points.join(" ")}`)
        ),
        "",
        "That technical base is a core part of his advantage: it helps him understand the real issue, evaluate systems and AI options, use automation where it fits, and communicate clearly with technical and non-technical teams."
      ].join("\n")
  },
  {
    triggers: [
      "capability",
      "capabilities",
      "strength",
      "strengths",
      "useful",
      "where is he useful",
      "what do you do",
      "what does he do",
      "service",
      "services",
      "offer",
      "offering",
      "work themes",
      "themes",
      "lanes",
      "help with",
      "best at",
      "value"
    ],
    answer: () =>
      [
        "Reuben tends to be most useful in three areas:",
        "",
        listCapabilities(),
        "",
        `Common outcomes: ${outcomePoints.join(", ")}.`
      ].join("\n")
  },
  {
    triggers: [
      "ambiguous",
      "ambiguity",
      "messy work",
      "clarify",
      "clarifying",
      "requirements",
      "priorities",
      "decision framing",
      "plain english",
      "structure"
    ],
    answer: () =>
      [
        "For ambiguous work, Reuben focuses on turning scattered goals, competing inputs, and half-formed ideas into usable direction.",
        "",
        "That usually means requirements, priorities, decision framing, and plain-English structure. The goal is not just a document; it is helping someone decide, build, explain, or move."
      ].join("\n")
  },
  {
    triggers: [
      "translate",
      "translation",
      "stakeholder",
      "stakeholders",
      "developers",
      "business translation",
      "documentation",
      "cross-functional",
      "alignment"
    ],
    answer: () =>
      [
        "A recurring theme is aligning people, priorities, processes, and technical realities.",
        "",
        "He is strongest when business goals, human context, operating constraints, and technical realities need to line up. That includes stakeholder alignment, clearer expectations, requirements structure, documentation, and better handoffs."
      ].join("\n")
  },
  {
    triggers: [
      "workflow",
      "workflows",
      "process",
      "process improvement",
      "internal tool",
      "internal tools",
      "automation",
      "sop",
      "operating rhythm",
      "team rhythm",
      "ops"
    ],
    answer: () =>
      [
        "For workflows, Reuben's approach is to understand the real operating problem first, then choose the right mix of communication, process, systems, automation, AI, or team habits around what people actually need to do.",
        "",
        "The resume backs that up with internal systems work, automated workflows, migration from third-party tools to internal systems, process improvement, KPI visibility, and structured operating routines."
      ].join("\n")
  },
  {
    triggers: [
      "ai",
      "artificial intelligence",
      "openai",
      "llm",
      "ai workflow",
      "ai workflows",
      "ai tools",
      "advanced ai",
      "openai api",
      "hammer",
      "ai for ai",
      "human judgment",
      "quality control",
      "automation ideas"
    ],
    answer: () =>
      [
        "For Reuben, AI and automation are real strengths, but he applies them with judgment.",
        "",
        "He starts by understanding the issue, the people involved, and the outcome that matters. When AI is the right fit, he can use it for planning, communication, analysis, documentation, workflow design, repetitive work, and OpenAI API integrations.",
        "",
        "The important point is that he is not trying to force AI onto every problem. Sometimes the better answer is clearer communication, a simpler process, a better system handoff, or a non-AI automation."
      ].join("\n")
  },
  {
    triggers: [
      "principle",
      "principles",
      "working style",
      "style",
      "approach",
      "how does he work",
      "process",
      "think",
      "thinking"
    ],
    answer: () =>
      [
        "The working style on the site is practical and context-first:",
        "",
        bulletList(workingPrinciples.map((principle) => `${principle.title}: ${principle.body}`)),
        "",
        "That maps to outputs people can understand, use, hand off, build from, or make decisions with."
      ].join("\n")
  },
  {
    triggers: [
      "project",
      "projects",
      "work sample",
      "work samples",
      "case study",
      "case studies",
      "portfolio",
      "examples",
      "selected work",
      "sample work"
    ],
    priority: -4,
    answer: () =>
      [
        "The public profile includes selected work themes rather than deep case studies:",
        "",
        listProjects()
      ].join("\n")
  },
  {
    triggers: [
      "community fundraising",
      "fundraising",
      "campaign",
      "pledge card",
      "poster",
      "parlor meeting"
    ],
    priority: 4,
    answer: () => describeProject(getProjectByNeedle("community fundraising") ?? projects[0])
  },
  {
    triggers: [
      "dessert",
      "brand",
      "label",
      "packaging",
      "food brand",
      "logo refinement",
      "badge"
    ],
    priority: 4,
    answer: () => describeProject(getProjectByNeedle("dessert brand") ?? projects[1])
  },
  {
    triggers: [
      "journal",
      "ads",
      "event materials",
      "whatsapp",
      "headline concepts",
      "layout direction"
    ],
    priority: 4,
    answer: () => describeProject(getProjectByNeedle("journal ads") ?? projects[2])
  },
  {
    triggers: [
      "business writing",
      "legal",
      "formal letters",
      "dispute",
      "contract",
      "negotiation",
      "sensitive"
    ],
    priority: 4,
    answer: () => describeProject(getProjectByNeedle("legal-style writing") ?? projects[3])
  },
  {
    triggers: [
      "skills",
      "technical skills",
      "tools",
      "tech stack",
      "technical background",
      "technical fluency",
      "technical problem",
      "technical problem solving",
      "languages",
      "programming languages",
      "framework",
      "frameworks",
      "stack",
      "php",
      "javascript",
      "js",
      "es6",
      "react",
      "nextjs",
      "next.js",
      "nestjs",
      "nestj",
      "coldfusion",
      "sql",
      "aws",
      "gcp",
      "database",
      "databases",
      "mysql",
      "postgres",
      "postgresql",
      "sql server",
      "python",
      "django",
      "fastapi",
      "dynamodb",
      "firebase",
      "jira",
      "trello",
      "clickup"
    ],
    answer: () =>
      [
        "His technical background is a core differentiator, especially because he combines it with clear communication and practical judgment:",
        "",
        listTechnicalBackground(),
        "",
        "Related resume context includes web development across multiple languages, databases, AWS, GCP, OpenAI API integrations, workflow automation, and delivery tools like Jira, Trello, and ClickUp."
      ].join("\n")
  },
  {
    triggers: [
      "leadership",
      "manager",
      "management",
      "team leadership",
      "mentor",
      "mentoring",
      "training",
      "vendor",
      "operations management"
    ],
    answer: () =>
      [
        "The leadership and operations section lists:",
        "",
        listSkills(leadershipSkills),
        "",
        "The GPARENCY role also specifically mentions building and scaling an agile development team, including hiring and mentoring."
      ].join("\n")
  },
  {
    triggers: [
      "education",
      "degree",
      "school",
      "college",
      "university",
      "njit",
      "certification",
      "training",
      "dale carnegie"
    ],
    answer: () =>
      [
        `Education: ${education.degree}, ${education.school}; ${education.completed}.`,
        `Professional development: ${professionalDevelopment.program}, ${professionalDevelopment.year}.`
      ].join("\n")
  },
  {
    triggers: [
      "resume",
      "cv",
      "download",
      "pdf",
      "formal resume"
    ],
    priority: 1,
    answer: () =>
        "The site has a resume page at /resume and a downloadable PDF at /resume.pdf. The resume positions Reuben as a Business Operations and Technical Solutions Leader with experience across clear communication, technical problem-solving, AI-enabled automation, process improvement, business systems, and cross-functional execution."
  },
  {
    triggers: [
      "location",
      "where is he",
      "where are you",
      "based",
      "local",
      "lakewood",
      "new jersey",
      "nj"
    ],
    answer: () =>
      `The resume lists Reuben as based in ${resumeIdentity.location}.`
  },
  {
    triggers: [
      "contact",
      "email",
      "phone",
      "get in touch",
      "reach out",
      "book",
      "call",
      "start",
      "hire",
      "job opportunity",
      "recruit",
      "opportunity",
      "available"
    ],
    answer: () =>
      [
        "The preferred path is the contact form on the site, especially for roles, recruiting conversations, collaborations, or project inquiries.",
        "",
        `The public resume also lists ${resumeIdentity.email} and ${resumeIdentity.phone}.`
      ].join("\n")
  },
  {
    triggers: [
      "audience",
      "who is this for",
      "who do you work with",
      "fit",
      "good fit",
      "employer",
      "hiring team",
      "collaborator",
      "client"
    ],
    answer: () =>
      "This profile is mainly for prospective employers, hiring teams, collaborators, clients, and people with relevant projects or service inquiries. The strongest fit is work involving clear communication, operations leadership, technical problem-solving, AI-enabled automation, program execution, process improvement, stakeholder alignment, business systems, and cross-functional clarity."
  },
  {
    triggers: [
      "why hire",
      "why should",
      "differentiator",
      "different",
      "unique",
      "stand out",
      "pitch"
    ],
    answer: () =>
      [
        "Reuben's strongest hiring argument is the blend: clear communication, operations leadership, people-centered management, strong technical fluency, AI and automation judgment, process improvement, and business systems experience.",
        "",
        "That matters most when the work is ambiguous, cross-functional, technical, or hard to execute. Reuben's value is understanding the real issue, choosing the right mix of people, process, systems, or AI, and helping teams turn that into forward movement."
      ].join("\n")
  }
];

function scoreTopic(normalizedQuestion: string, topic: FallbackTopic) {
  const triggerScore = topic.triggers.reduce((score, trigger) => {
    if (!includesAny(normalizedQuestion, [trigger])) {
      return score;
    }

    const normalizedTrigger = normalizeForMatch(trigger);
    const wordCount = normalizedTrigger.split(" ").length;
    const genericTriggerPenalty = [
      "project",
      "projects",
      "work",
      "experience",
      "process",
      "training"
    ].includes(normalizedTrigger)
      ? -2
      : 0;

    return (
      score +
      5 +
      wordCount * 3 +
      Math.min(normalizedTrigger.length, 20) / 2 +
      genericTriggerPenalty
    );
  }, 0);

  return triggerScore > 0 ? triggerScore + (topic.priority ?? 0) : 0;
}

function findTopicReply(question: string) {
  const normalized = normalizeForMatch(question);
  const bestTopic = fallbackTopics.reduce<
    { topic: FallbackTopic; score: number } | undefined
  >((best, candidate) => {
    const score = scoreTopic(normalized, candidate);

    if (score <= 0 || (best && best.score >= score)) {
      return best;
    }

    return { topic: candidate, score };
  }, undefined);

  return bestTopic?.topic.answer();
}

export function buildFallbackReply(question: string, messages?: AssistantMessage[]) {
  const contextualQuestion = buildContextualQuestion(question, messages);
  const normalized = normalizeForMatch(contextualQuestion);

  if (!normalized) {
    return "Ask me about Reuben's background, resume, operations leadership experience, technical fluency, AI and automation judgment, selected work, or contact path.";
  }

  const isGreetingOnly =
    ["hello", "hi", "hey"].includes(normalized) ||
    (includesAny(normalized, ["good morning", "good afternoon"]) &&
      normalized.split(" ").length <= 3);

  if (isGreetingOnly) {
    return "Hi. Ask me about Reuben's background, work history, strengths, technical fluency, AI and automation judgment, selected projects, resume, or how to contact him.";
  }

  if (
    includesAny(normalized, ["one sentence", "in one sentence"]) &&
    includesAny(normalized, ["reuben", "who is", "who's", "what is", "what's"])
  ) {
    return "Reuben is a strong communicator and business operations leader with deep technical fluency, able to understand the real issue and apply people, process, systems, automation, or advanced AI when they fit.";
  }

  if (includesAny(normalized, ["price", "pricing", "cost", "budget", "package", "packages"])) {
    return "This site does not publish service packages or pricing. It is mainly a personal portfolio and working profile. For a service inquiry, send the context through the contact form and Reuben can respond directly.";
  }

  const topicReply = findTopicReply(contextualQuestion);

  if (topicReply) {
    return topicReply;
  }

  return [
    "I do not see that specific detail in the site content, so I do not want to invent an answer.",
    "",
    "The grounded areas I can answer well are Reuben's resume, work history, operations and people leadership experience, clear communication, technical problem-solving, business systems, AI and automation judgment, selected work examples, education, skills, and contact path."
  ].join("\n");
}
