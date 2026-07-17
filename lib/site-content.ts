import { siteProfile, siteProfileMarkdown } from "@/lib/site-profile";

export const capabilities = siteProfile.capabilities;

export const projects = siteProfile.caseStudies;

export const workingPrinciples = siteProfile.howIWork.map((body, index) => {
  const titles = [
    "Understand the objective",
    "Identify the constraint",
    "Structure the work",
    "Support execution"
  ];

  return {
    title: titles[index] ?? `Step ${index + 1}`,
    body
  };
});

export const outcomePoints = siteProfile.about.outcomes;

export const technicalBackground = [
  {
    area: "Languages",
    items: ["PHP", "JavaScript", "ES6", "ColdFusion", "SQL", "Python"]
  },
  {
    area: "Frontend",
    items: ["React", "Next.js"]
  },
  {
    area: "Backend",
    items: ["NestJS", "Django", "FastAPI"]
  },
  {
    area: "Databases",
    items: ["MySQL", "Postgres", "SQL Server"]
  }
] as const;

export const websiteKnowledge = `
Source of truth: content/site-profile.md

${siteProfileMarkdown}

Additional public resume facts:
- Education: Master of Science, Management Information Systems, New Jersey Institute of Technology, completed January 2011.
- Professional development: Dale Carnegie - Skills for Success, 2019.
- Current public resume roles include GPARENCY, Eastern Union, CardCash, Central Analysis Bureau, and New York Guest Services.
- Technical fluency includes PHP, JavaScript, ES6, ColdFusion, SQL, Python, React, Next.js, NestJS, Django, FastAPI, MySQL, Postgres, SQL Server, AWS, GCP, OpenAI API integrations, DynamoDB, Firebase, Jira, Trello, and ClickUp.
`.trim();
