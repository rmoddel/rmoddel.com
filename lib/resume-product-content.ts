import type { ResumeJob } from "@/lib/resume-pdf";

export const productResumeIdentity = {
  name: "Reuben Moddel",
  title: "Business Operations and Product Execution Leader",
  location: "Lakewood, NJ",
  phone: "732-552-4475",
  email: "rmoddel@gmail.com"
} as const;

export const productResumeSummary = [
  "Business operations and product execution leader with a background in software, workflow design, analytics, people leadership, and cross-functional execution. Known for turning ambiguous business goals into clear priorities, operating rhythms, and measurable output.",
  "Built a career from web development into software analysis, operations, and leadership roles, with repeated responsibility for aligning product, design, engineering, operations, and business partners around practical delivery."
] as const;

export const productSkillSections = [
  {
    heading: "Product Strategy & Roadmaps",
    items: [
      "Roadmap planning and prioritization",
      "Requirement gathering and documentation",
      "Decision framing for leadership teams",
      "Cross-functional alignment across product, design, engineering, and operations",
      "Analytics-driven tradeoff evaluation"
    ]
  },
  {
    heading: "Operations & Team Leadership",
    items: [
      "Agile workflow and launch coordination",
      "Stakeholder alignment and execution clarity",
      "Operational strategy and process optimization",
      "Team training and development",
      "Automation-enabled workflow design and integrations"
    ]
  }
] as const;

export const productEducation = {
  school: "New Jersey Institute of Technology",
  degree: "Master of Science, Management Information Systems",
  completed: "Completed January 2011"
} as const;

export const productProfessionalDevelopment = {
  program: "Dale Carnegie - Skills for Success",
  year: "2019"
} as const;

export const productExperience: ResumeJob[] = [
  {
    title: "Director, Product Operations / Technical Lead",
    company: "GPARENCY",
    location: "Howell, NJ",
    dates: "November 2021 - June 2025",
    points: [
      "Built and scaled an agile product delivery team, including hiring, mentoring, and execution cadence.",
      "Delivered an MVP marketplace with product, design, marketing, and engineering partners.",
      "Created structured planning and analytics to improve leadership visibility and roadmap decision-making.",
      "Coordinated work across internal and overseas contributors to keep launches moving."
    ]
  },
  {
    title: "Technical Operations Manager",
    company: "Eastern Union",
    location: "Howell, NJ",
    dates: "August 2020 - November 2021",
    points: [
      "Led migration from third-party tools to internal systems and improved operational control.",
      "Established onboarding and training patterns for junior team members.",
      "Supported KPI tracking and cross-business workflow improvements."
    ]
  },
  {
    title: "Software Analyst",
    company: "CardCash",
    location: "Lakewood, NJ",
    dates: "October 2015 - August 2020",
    points: [
      "Developed automated workflows to reduce manual processing and improve throughput.",
      "Created testing and analytics processes for data integrity and operational reliability.",
      "Partnered across departments to refine systems and reduce operational overhead."
    ]
  },
  {
    title: "Web Developer",
    company: "Central Analysis Bureau",
    location: "Lakewood, NJ",
    dates: "February 2013 - October 2015",
    points: [
      "Built internal tools for staff workflows and process support.",
      "Developed early experience translating business needs into usable systems."
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
