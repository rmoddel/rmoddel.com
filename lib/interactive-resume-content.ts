import { employmentHistory, resumeIdentity } from "@/lib/resume-content";
import { technicalBackground } from "@/lib/site-content";
import { siteProfile } from "@/lib/site-profile";

export type ChatLink = {
  href: string;
  label: string;
};

export type ChatTopic = {
  id: string;
  label: string;
  openingAnswer: string;
  followUps: string[];
  links: ChatLink[];
  context: string;
};

export const professionalDescriptor = "AI Solutions, Operations, and People Leadership";

export const formalTitle = "AI Solutions and Operations Leader";

export const clientPromise =
  "Bring me the process that is slowing you down. I’ll understand it, improve it, and deliver a personalized solution your team can actually use.";

export const landingNavigation = [
  {
    title: "Read the Resume",
    body: "See my roles, responsibilities, education, and career progression in a clean resume format.",
    href: "/resume",
    cta: "View Resume"
  },
  {
    title: "Chat With My Resume",
    body: "Ask about my experience, leadership style, AI work, skills, projects, or fit for an opportunity.",
    href: "/chat",
    cta: "Start a Conversation"
  },
  {
    title: "Contact Me",
    body: "Reach out regarding a role, project, collaboration, or process that needs improvement.",
    href: "/contact",
    cta: "Contact Me"
  }
] as const;

export const gpsPrinciples = [
  {
    title: "Genuine",
    body: "Solve a real operational problem, not add AI or software for appearance."
  },
  {
    title: "Personalized",
    body: "Design around the client’s workflow, terminology, people, rules, and priorities."
  },
  {
    title: "Solutions",
    body: "Deliver working software, automation, or process improvements people can actually use."
  }
] as const;

export const gpsMashal =
  "A GPS contains sophisticated technology, but the driver only needs to enter a destination and control the options that matter. I approach software the same way: handling the complexity behind the scenes and giving the user simple, understandable controls.";

export const gpsSupportLine = "Powerful technology behind the scenes. Simple control in your hands.";

export const contactInquiryTypes = [
  "Role or leadership opportunity",
  "AI or software solution",
  "Process improvement",
  "Collaboration",
  "General inquiry"
] as const;

export const starterQuestions = [
  "Tell me about your background.",
  "Walk me through your experience.",
  "What are your strongest skills?",
  "How do you lead people and projects?",
  "How do you use AI?",
  "What have you built?",
  "What is the GPS approach?",
  "How can I contact you?"
] as const;

const roleHistory = employmentHistory
  .map((role) => `${role.title}, ${role.company} (${role.dates})`)
  .join("; ");

const mostRecentRole = employmentHistory[0];

export const chatTopics: ChatTopic[] = [
  {
    id: "experience",
    label: "My Experience",
    openingAnswer:
      "I bring 15+ years across business systems, operations, software delivery, process improvement, and team leadership. My career moved from hands-on web development into software and systems analysis, technical operations, product operations, and leadership roles where I coordinated people, process, and delivery.\n\nMy public resume includes roles at GPARENCY, Eastern Union, CardCash, Central Analysis Bureau, and New York Guest Services. The throughline is practical execution: understanding the real problem, aligning technical and nontechnical contributors, and moving useful work forward.",
    followUps: [
      "What did you do at GPARENCY?",
      "What management experience do you have?",
      "How did your career progress?",
      "What operational problems have you solved?"
    ],
    links: [
      { href: "/resume", label: "View Resume" },
      { href: "/resume.pdf", label: "Download PDF" }
    ],
    context: `Current public resume roles: ${roleHistory}. Most recent role: ${mostRecentRole.title} at ${mostRecentRole.company}, ${mostRecentRole.location}, ${mostRecentRole.dates}.`
  },
  {
    id: "about",
    label: "About Me",
    openingAnswer:
      "My working style is honest, direct, practical, and people-aware. I listen before prescribing, try to understand the pressures around a process, and care whether the final result actually works for the people who have to live with it.\n\nMy value is not only technical fluency. It is the combination of human understanding, clear communication, operational judgment, and enough software and AI fluency to lead useful solutions from idea to execution.",
    followUps: [
      "What do you value at work?",
      "How do you think about people and process?",
      "What makes your approach different?"
    ],
    links: [{ href: "/about", label: "About" }],
    context:
      "About: honest, direct, ethical work style; human understanding; care for people affected by a process; preference for useful results over show."
  },
  {
    id: "skills",
    label: "Skills and Strengths",
    openingAnswer:
      "My strongest skills sit at the intersection of operations, people, systems, and execution.\n\nKey areas include operations and process improvement, team and cross-functional leadership, requirements and problem discovery, AI-enabled solutions, software and systems fluency, communication, and follow-through. I am most useful when a process is cumbersome, unclear, cross-functional, or technical enough that business and implementation realities need to be translated clearly.",
    followUps: [
      "What are your strongest operational skills?",
      "How technical are you?",
      "Where are you most useful?"
    ],
    links: [
      { href: "/", label: "Home" },
      { href: "/resume", label: "Resume" }
    ],
    context:
      "Skills: operations and process improvement; team and cross-functional leadership; requirements and problem discovery; AI-enabled solutions; software and systems fluency; communication and execution."
  },
  {
    id: "leadership",
    label: "Leadership and Management",
    openingAnswer:
      "My leadership experience includes hiring and mentoring, coordinating internal and overseas contributors, clarifying priorities, establishing practical operating rhythms, communicating with stakeholders, and helping teams move through ambiguity.\n\nMy management approach combines empathy with accountability: understand the people and pressures first, then create enough clarity, ownership, and follow-up for work to move.",
    followUps: [
      "How do you manage ambiguity?",
      "What team leadership is listed on the resume?",
      "How does empathy affect your management style?"
    ],
    links: [{ href: "/about", label: "Leadership Approach" }],
    context:
      "Leadership: hiring and mentoring; coordinating internal and overseas contributors; clarifying priorities; operating rhythms; stakeholder communication; accountability with empathy; ambiguity handling."
  },
  {
    id: "ai-software",
    label: "AI and Personalized Software",
    openingAnswer:
      "I treat AI and software as delivery capabilities, not decoration. The useful question is not whether a process can include AI; it is whether AI, automation, a form, a dashboard, document intelligence, or an integration would reduce friction in a real workflow.\n\nThe goal is personalized software around the organization’s actual needs, with sophisticated technology behind the scenes and understandable controls in the user’s hands.",
    followUps: [
      "What does personalized software mean?",
      "How do you decide whether AI fits?",
      "What kinds of tools can you build or improve?"
    ],
    links: [{ href: "/work", label: "Project Examples" }],
    context:
      "AI and personalized software: process-first; AI only where useful; solutions may include automation, forms, dashboards, document intelligence, integrations, and workflow tools."
  },
  {
    id: "process-improvement",
    label: "Process Improvement",
    openingAnswer:
      "My process-improvement sequence is straightforward: understand the current process, understand the people affected, identify the true constraint, determine the simplest useful improvement, build or implement it, test it in real use, and hand over clear controls and documentation.\n\nThat approach keeps the solution grounded in what people actually need to do rather than what looks impressive in a demo.",
    followUps: [
      "How would you evaluate our process?",
      "What counts as a useful improvement?",
      "How do you handle adoption?"
    ],
    links: [{ href: "/contact", label: "Discuss a Process" }],
    context:
      "Process sequence: understand current process; understand people affected; identify true constraint; determine simplest useful improvement; build or implement it; test in real use; hand over controls and documentation."
  },
  {
    id: "projects",
    label: "Selected Projects",
    openingAnswer:
      "The project examples I can talk about publicly are practical workflow tools, not abstract demos.\n\nSelf-Service Flyer Generator: delivered. It lets a nontechnical client enter event details and download a professionally formatted, print-ready PDF.\n\nCommunity Announcement Broadcast System: delivered. It gives an organization a guided interface for messages, recipients, delivery settings, review, and cost visibility.\n\nI keep the line clear between delivered work and ideas that are still taking shape.",
    followUps: [
      "Tell me about the flyer generator.",
      "Tell me about the broadcast system.",
      "What does client control mean?"
    ],
    links: [{ href: "/work", label: "View Projects" }],
    context:
      "Project facts: Self-Service Flyer Generator, status Delivered; Community Announcement Broadcast System, status Delivered. Do not present document intelligence as completed until details are confirmed."
  },
  {
    id: "gps",
    label: "The GPS Approach",
    openingAnswer:
      `${gpsPrinciples[0].title}: ${gpsPrinciples[0].body}\n\n${gpsPrinciples[1].title}: ${gpsPrinciples[1].body}\n\n${gpsPrinciples[2].title}: ${gpsPrinciples[2].body}\n\n${gpsMashal}\n\n${gpsSupportLine}`,
    followUps: [
      "What makes a solution genuine?",
      "What does personalized mean here?",
      "What controls should users have?"
    ],
    links: [{ href: "/about", label: "Read More" }],
    context: `GPS means Genuine, Personalized Solutions. ${gpsMashal} ${gpsSupportLine}`
  },
  {
    id: "roles",
    label: "Roles and Opportunities",
    openingAnswer:
      "I am strongest in roles that combine operations, people, systems, and execution. Possible role families include operations leadership, program or project management, implementation, customer success, solutions leadership, AI operations, business systems, cross-functional management, and client-facing technical operations.\n\nFit depends on the actual responsibilities. For a role centered only on advanced hands-on programming, my current positioning is less direct than for roles requiring operational judgment, stakeholder alignment, process improvement, AI-enabled tools, and practical delivery.",
    followUps: [
      "Would you fit an operations leadership role?",
      "Would you fit an implementation role?",
      "What kind of role is less direct?"
    ],
    links: [
      { href: "/resume", label: "Resume" },
      { href: "/contact", label: "Contact Me" }
    ],
    context:
      "Role families: operations leadership; program/project management; implementation; customer success; solutions leadership; AI operations; business systems; cross-functional management; forward-deployed or client-facing technical operations. Fit depends on responsibilities."
  },
  {
    id: "contact",
    label: "Contact Me",
    openingAnswer:
      "You can contact me about a role, collaboration, personalized AI or software solution, or a cumbersome process that should work better. Start a message here or use the contact page.",
    followUps: [
      "Start a contact message.",
      "What should I include?",
      "Go to the contact page."
    ],
    links: [{ href: "/contact", label: "Contact Page" }],
    context: `Public contact details: ${resumeIdentity.email}; ${resumeIdentity.phone}; ${resumeIdentity.location}.`
  }
];

export const approvedKnowledge = `
Professional descriptor: ${professionalDescriptor}
Formal title: ${formalTitle}
Core positioning: ${siteProfile.positioning.summary}
Client-facing promise: ${clientPromise}
GPS: ${gpsPrinciples.map((item) => `${item.title} - ${item.body}`).join("; ")}
GPS analogy: ${gpsMashal}
Experience: ${roleHistory}
Technical background: ${technicalBackground
  .map((group) => `${group.area}: ${group.items.join(", ")}`)
  .join("; ")}
Assistant topics: ${chatTopics.map((topic) => `${topic.label}: ${topic.context}`).join("\n")}
Boundaries: do not invent metrics, clients, responsibilities, titles, dates, salary expectations, private details, or project status.
`.trim();
