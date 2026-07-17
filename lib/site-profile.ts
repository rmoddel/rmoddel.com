import { readFileSync } from "fs";
import path from "path";

type TextCard = {
  title: string;
  body: string;
};

type ListCard = TextCard & {
  items: string[];
};

type CaseStudy = {
  type: string;
  title: string;
  summary: string;
  deliverables: string[];
  result: string;
};

type ExperienceThread = {
  title: string;
  body: string;
};

function escapeRegExp(text: string) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function normalizeBody(text: string) {
  return text
    .trim()
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.replace(/\s*\n\s*/g, " ").trim())
    .join("\n\n");
}

function required(value: string | undefined, label: string) {
  if (!value?.trim()) {
    throw new Error(`Missing required site profile field: ${label}`);
  }

  return value.trim();
}

function getSection(markdown: string, heading: string) {
  const pattern = new RegExp(`^## ${escapeRegExp(heading)}\\s*$`, "m");
  const match = pattern.exec(markdown);

  if (!match) {
    return required(undefined, `section ${heading}`);
  }

  const contentStart = match.index + match[0].length + 1;
  const rest = markdown.slice(contentStart);
  const nextHeading = /^## /m.exec(rest);
  const contentEnd =
    nextHeading && typeof nextHeading.index === "number"
      ? contentStart + nextHeading.index
      : markdown.length;

  return required(markdown.slice(contentStart, contentEnd), `section ${heading}`);
}

function getSubsections(section: string) {
  const subsections: Array<{ title: string; body: string }> = [];
  const matches = [...section.matchAll(/^### ([^\n]+)\s*$/gm)];

  for (let index = 0; index < matches.length; index += 1) {
    const match = matches[index];
    const nextMatch = matches[index + 1];
    const contentStart = (match.index ?? 0) + match[0].length + 1;
    const contentEnd = nextMatch?.index ?? section.length;

    subsections.push({
      title: match[1].trim(),
      body: section.slice(contentStart, contentEnd).trim()
    });
  }

  return subsections;
}

function getField(section: string, label: string) {
  const pattern = new RegExp(`^${escapeRegExp(label)}:\\s*(.+)$`, "m");
  const match = section.match(pattern);

  return match?.[1].trim();
}

function getBlock(section: string, label: string) {
  const pattern = new RegExp(`^${escapeRegExp(label)}:\\s*\\n`, "m");
  const match = pattern.exec(section);

  if (!match) {
    return undefined;
  }

  const start = match.index + match[0].length;
  const rest = section.slice(start);
  const stop = rest.search(/\n(?:[A-Z][A-Za-z0-9 &/-]+:|### |## )/);
  const raw = stop >= 0 ? rest.slice(0, stop) : rest;

  return normalizeBody(raw);
}

function getList(section: string, label: string) {
  const pattern = new RegExp(`^${escapeRegExp(label)}:\\s*\\n`, "m");
  const match = pattern.exec(section);

  if (!match) {
    return [];
  }

  const lines = section.slice(match.index + match[0].length).split("\n");
  const items: string[] = [];

  for (const line of lines) {
    if (line.startsWith("- ")) {
      items.push(line.slice(2).trim());
      continue;
    }

    if (items.length > 0 && line.trim() !== "") {
      break;
    }
  }

  return items;
}

function getNumberedList(section: string) {
  return section
    .split("\n")
    .map((line) => line.match(/^\d+\.\s+(.+)$/)?.[1].trim())
    .filter((item): item is string => Boolean(item));
}

function splitCard(item: string): TextCard {
  const separator = item.indexOf(":");

  if (separator === -1) {
    return {
      title: item,
      body: ""
    };
  }

  return {
    title: item.slice(0, separator).trim(),
    body: item.slice(separator + 1).trim()
  };
}

const profilePath = path.join(process.cwd(), "content", "site-profile.md");

export const siteProfileMarkdown = readFileSync(profilePath, "utf8").trim();

const identity = getSection(siteProfileMarkdown, "Identity");
const positioning = getSection(siteProfileMarkdown, "Positioning");
const hero = getSection(siteProfileMarkdown, "Hero");
const capabilitiesSection = getSection(siteProfileMarkdown, "Capabilities");
const howIWork = getSection(siteProfileMarkdown, "How I Work");
const caseStudiesSection = getSection(siteProfileMarkdown, "Case Studies");
const aiSection = getSection(siteProfileMarkdown, "AI and Automation");
const experienceArc = getSection(siteProfileMarkdown, "Experience Arc");
const about = getSection(siteProfileMarkdown, "About");
const contact = getSection(siteProfileMarkdown, "Contact");
const chatbotKnowledge = getSection(siteProfileMarkdown, "Chatbot Knowledge");

export const siteProfile = {
  identity: {
    name: required(getField(identity, "Name"), "Identity.Name"),
    primaryTitle: required(getField(identity, "Primary Title"), "Identity.Primary Title"),
    heroTitle: required(getField(identity, "Hero Title"), "Identity.Hero Title"),
    resumeTitle: required(getField(identity, "Resume Title"), "Identity.Resume Title"),
    location: required(getField(identity, "Location"), "Identity.Location"),
    phone: required(getField(identity, "Phone"), "Identity.Phone"),
    email: required(getField(identity, "Email"), "Identity.Email")
  },
  positioning: {
    credential: required(getField(positioning, "Credential"), "Positioning.Credential"),
    summary: required(getBlock(positioning, "Summary"), "Positioning.Summary"),
    narrative: required(getBlock(positioning, "Narrative"), "Positioning.Narrative"),
    peoplePrinciple: required(
      getBlock(positioning, "People Principle"),
      "Positioning.People Principle"
    )
  },
  hero: {
    eyebrow: required(getField(hero, "Eyebrow"), "Hero.Eyebrow"),
    spark: required(getField(hero, "Spark"), "Hero.Spark"),
    headline: required(getField(hero, "Headline"), "Hero.Headline"),
    body: required(getBlock(hero, "Body"), "Hero.Body"),
    tags: getList(hero, "Tags"),
    miniCards: getList(hero, "Mini Cards").map(splitCard),
    panelBadge: required(getField(hero, "Panel Badge"), "Hero.Panel Badge"),
    panelLabel: required(getField(hero, "Panel Label"), "Hero.Panel Label"),
    panelItems: getList(hero, "Panel Items"),
    panelResult: required(getField(hero, "Panel Result"), "Hero.Panel Result"),
    credentialStrip: getList(hero, "Credential Strip")
  },
  capabilities: getSubsections(capabilitiesSection).map<ListCard>((capability) => ({
    title: capability.title,
    body: required(
      capability.body.split(/\nItems:\s*\n/)[0]?.trim(),
      `Capabilities.${capability.title}.body`
    ),
    items: getList(capability.body, "Items")
  })),
  howIWork: getNumberedList(howIWork),
  caseStudies: getSubsections(caseStudiesSection).map<CaseStudy>((study) => ({
    title: study.title,
    type: required(getField(study.body, "Type"), `Case Studies.${study.title}.Type`),
    summary: required(getBlock(study.body, "Summary"), `Case Studies.${study.title}.Summary`),
    deliverables: getList(study.body, "Deliverables"),
    result: required(getBlock(study.body, "Result"), `Case Studies.${study.title}.Result`)
  })),
  ai: {
    headline: required(getField(aiSection, "Headline"), "AI and Automation.Headline"),
    body: required(getBlock(aiSection, "Body"), "AI and Automation.Body"),
    items: getList(aiSection, "Items")
  },
  experience: {
    headline: required(getField(experienceArc, "Headline"), "Experience Arc.Headline"),
    body: required(getBlock(experienceArc, "Body"), "Experience Arc.Body"),
    threads: getList(experienceArc, "Threads").map<ExperienceThread>(splitCard),
    highlights: getList(experienceArc, "Highlights")
  },
  about: {
    headline: required(getField(about, "Headline"), "About.Headline"),
    paragraphs: getList(about, "Paragraphs"),
    outcomes: getList(about, "Outcomes")
  },
  contact: {
    headline: required(getField(contact, "Headline"), "Contact.Headline"),
    body: required(getBlock(contact, "Body"), "Contact.Body"),
    secondary: required(getBlock(contact, "Secondary"), "Contact.Secondary")
  },
  chatbotKnowledge: normalizeBody(chatbotKnowledge)
} as const;

export type SiteProfile = typeof siteProfile;
