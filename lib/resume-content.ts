import { siteProfile } from "@/lib/site-profile";

export const resumeIdentity = {
  name: siteProfile.identity.name,
  title: siteProfile.identity.resumeTitle,
  location: siteProfile.identity.location,
  phone: siteProfile.identity.phone,
  phoneHref: "tel:7325524475",
  email: siteProfile.identity.email,
  emailHref: `mailto:${siteProfile.identity.email}`
} as const;

export const resumeSummary = [
  `${siteProfile.identity.resumeTitle} with ${siteProfile.positioning.credential.toLowerCase()}.`,
  siteProfile.positioning.summary,
  siteProfile.experience.body
] as const;

export const technicalSkills = [
  "Problem diagnosis and technical solution translation",
  "Advanced AI solution evaluation and workflow design",
  "OpenAI API integrations and AI-enabled automation",
  "Workflow automation and internal systems improvement",
  "Project planning and coordination",
  "Agile workflow: standups, sprints, and ticketing",
  "Requirement gathering and documentation",
  "Stakeholder reporting and task clarification",
  "Cross-functional communication",
  "Cloud platforms: AWS and GCP",
  "Web development background across multiple languages",
  "Databases: MySQL, Postgres, SQL Server, DynamoDB, and Firebase",
  "Tools: Jira, Trello, and ClickUp"
] as const;

export const leadershipSkills = [
  "Clear client and stakeholder communication",
  "People leadership and cross-functional alignment",
  "Hiring, mentoring, onboarding, and training",
  "Operational strategy and process optimization",
  "Technical and non-technical team coordination",
  "Vendor and stakeholder management",
  "Analytics and SEO integration",
  "Program execution and blocker removal"
] as const;

export const education = {
  school: "New Jersey Institute of Technology",
  degree: "Master of Science, Management Information Systems",
  completed: "Completed January 2011"
} as const;

export const professionalDevelopment = {
  program: "Dale Carnegie - Skills for Success",
  year: "2019"
} as const;

export const employmentHistory = [
  {
    title: "Director, Product Operations / Technical Lead",
    company: "GPARENCY",
    location: "Howell, NJ",
    dates: "November 2021 - June 2025",
    points: [
      "Built and scaled an agile development team, including hiring and mentoring.",
      "Translated product, design, marketing, and leadership priorities into executable technical work for an MVP marketplace.",
      "Coordinated work across internal and overseas developers.",
      "Created structured systems, processes, and analytics for leadership visibility."
    ]
  },
  {
    title: "Technical Operations Manager",
    company: "Eastern Union",
    location: "Howell, NJ",
    dates: "August 2020 - November 2021",
    points: [
      "Oversaw migration from third-party tools to internal systems.",
      "Led onboarding and training for junior team members.",
      "Maintained operational reliability, system adoption, and KPI visibility.",
      "Improved workflows across business units."
    ]
  },
  {
    title: "Software Analyst",
    company: "CardCash",
    location: "Lakewood, NJ",
    dates: "October 2015 - August 2020",
    points: [
      "Developed automated workflows to reduce manual processing and operational friction.",
      "Collaborated across departments to improve operational systems.",
      "Created testing and analytics processes for data integrity.",
      "Documented improvements and reduced operational overhead."
    ]
  },
  {
    title: "Web Developer",
    company: "Central Analysis Bureau",
    location: "Lakewood, NJ",
    dates: "February 2013 - October 2015",
    points: [
      "Built internal tools for staff operational workflows.",
      "Developed early experience in building digital systems."
    ]
  },
  {
    title: "Web Developer",
    company: "New York Guest Services",
    location: "New York, NY",
    dates: "July 2012 - February 2013",
    points: [
      "Developed website features and maintained internal systems.",
      "Deepened practical knowledge of the software development lifecycle."
    ]
  }
] as const;
