import type { ResumeJob } from "@/lib/resume-pdf";

export const customerSuccessResumeIdentity = {
  name: "Reuben Moddel",
  title: "Customer-Facing Operations and Process Improvement Leader",
  location: "Lakewood, NJ",
  phone: "732-552-4475",
  email: "rmoddel@gmail.com"
} as const;

export const customerSuccessResumeSummary = [
  "Customer-facing operations and process improvement leader with 13+ years of experience driving complex business systems and operational initiatives from problem definition through execution.",
  "Partners with executives, stakeholders, product, engineering, and operations teams to resolve issues, improve processes, deliver reporting, and translate business needs into clear priorities.",
  "Known for building trust quickly, staying organized in ambiguous environments, and helping teams deliver practical outcomes that support customers and end users."
] as const;

export const customerSuccessSkillSections = [
  {
    heading: "Customer Success & Communication",
    items: [
      "Customer relationship management",
      "Stakeholder communication",
      "Cross-functional collaboration",
      "Issue resolution",
      "Business systems fluency"
    ]
  },
  {
    heading: "Operations & Workflow",
    items: [
      "Customer reporting",
      "Project management",
      "Process improvement",
      "Product feedback",
      "Data/reporting literacy",
      "Workflow automation",
      "Automation-enabled operations"
    ]
  }
] as const;

export const customerSuccessEducation = {
  school: "New Jersey Institute of Technology",
  degree: "Master of Science, Management Information Systems",
  completed: "Completed January 2011"
} as const;

export const customerSuccessProfessionalDevelopment = {
  program: "Dale Carnegie - Skills for Success",
  year: "2019"
} as const;

export const customerSuccessExperience: ResumeJob[] = [
  {
    title: "Director, Product Operations / Technical Lead",
    company: "GPARENCY",
    location: "Howell, NJ",
    dates: "November 2021 - June 2025",
    points: [
      "Served as a bridge between business stakeholders, product, engineering, and external partners to clarify needs and unblock delivery.",
      "Coordinated cross-functional execution across leadership, product, operations, design, marketing, and development.",
      "Built reporting and planning routines that improved visibility into priorities, status, and handoffs."
    ]
  },
  {
    title: "Technical Operations Manager",
    company: "Eastern Union",
    location: "Howell, NJ",
    dates: "August 2020 - November 2021",
    points: [
      "Managed migration from third-party tools to internal systems and improved operational control.",
      "Supported onboarding, training, and issue resolution for team members and business partners.",
      "Improved KPI visibility and cross-business workflow coordination."
    ]
  },
  {
    title: "Software Analyst",
    company: "CardCash",
    location: "Lakewood, NJ",
    dates: "October 2015 - August 2020",
    points: [
      "Developed automated workflows to reduce manual processing.",
      "Partnered across departments to improve operational systems, testing, and reporting.",
      "Turned recurring process issues into documented fixes and clearer handoffs."
    ]
  },
  {
    title: "Web Developer",
    company: "Central Analysis Bureau",
    location: "Lakewood, NJ",
    dates: "February 2013 - October 2015",
    points: [
      "Built internal tools supporting staff workflows.",
      "Worked with users to clarify needs and improve usability."
    ]
  },
  {
    title: "Web Developer",
    company: "New York Guest Services",
    location: "New York, NY",
    dates: "July 2012 - February 2013",
    points: [
      "Maintained website features and internal systems.",
      "Learned to translate business needs into practical updates."
    ]
  }
];
