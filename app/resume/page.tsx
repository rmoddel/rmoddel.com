import type { Metadata } from "next";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

const technicalSkills = [
  "Project planning and coordination",
  "Agile workflow: standups, sprints, and ticketing",
  "Requirement gathering and documentation",
  "Developer support and task clarification",
  "Cross-functional communication",
  "Cloud platforms: AWS and GCP",
  "OpenAI API integrations",
  "Web development background across multiple languages",
  "Databases: MySQL, Postgres, DynamoDB, and Firebase",
  "Tools: Jira, Trello, and ClickUp"
] as const;

const leadershipSkills = [
  "Operational strategy and process optimization",
  "Cross-functional leadership",
  "Vendor and stakeholder management",
  "Analytics and SEO integration",
  "Team training and development"
] as const;

const employmentHistory = [
  {
    title: "Director, Product Operations / Technical Lead",
    company: "GPARENCY",
    location: "Howell, NJ",
    dates: "November 2021 - June 2025",
    points: [
      "Built and scaled an agile development team, including hiring and mentoring.",
      "Delivered an MVP marketplace with product, design, and marketing teams.",
      "Coordinated work across internal and overseas developers.",
      "Created structured processes and analytics for leadership visibility."
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
      "Maintained operational reliability and supported KPIs.",
      "Improved workflows across business units."
    ]
  },
  {
    title: "Software Analyst",
    company: "CardCash",
    location: "Lakewood, NJ",
    dates: "October 2015 - August 2020",
    points: [
      "Developed automated workflows to reduce manual processing.",
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

export const metadata: Metadata = {
  title: "Resume",
  description:
    "Resume for Reuben Moddel, Technical Lead and Operations Manager.",
  alternates: {
    canonical: "/resume"
  }
};

export default function ResumePage() {
  return (
    <main className="pageShell">
      <SiteHeader />

      <section className="heroSection resumeHero">
        <div className="heroCopy">
          <div className="heroRibbon">
            <p className="eyebrow">Resume</p>
            <span className="heroSpark">Technical leadership and operations</span>
          </div>
          <h1>Reuben Moddel</h1>
          <p className="heroText resumeHeadline">Technical Lead and Operations Manager</p>
          <div className="heroTags" aria-label="Contact details">
            <span>Lakewood, NJ</span>
            <span>
              <a href="tel:7325524475">732-552-4475</a>
            </span>
            <span>
              <a href="mailto:rmoddel@gmail.com">rmoddel@gmail.com</a>
            </span>
          </div>
        </div>

        <aside className="heroPanel resumePanel">
          <div>
            <div className="heroPanelBadge">Profile</div>
            <p className="panelResult">
              Practical, reliable technical leader with a strong foundation in software,
              operations, and cross-functional execution.
            </p>
          </div>
          <div className="heroOutcomeList">
            <span>Team leadership</span>
            <span>Developer support</span>
            <span>Process improvement</span>
            <span>Operations management</span>
            <span>AI integration</span>
          </div>
        </aside>
      </section>

      <section className="sectionCard">
        <div className="sectionHeading">
          <p className="eyebrow">Summary</p>
          <h2>Technical judgment with operational follow-through.</h2>
        </div>
        <div className="twoColumn">
          <p>
            Practical, reliable Technical Lead and Operations Manager with a strong
            technical foundation and a proven record in managing teams, systems, and
            processes.
          </p>
          <p>
            Began as a web developer, expanded into software analysis and operations,
            and progressed into technical leadership roles overseeing cross-functional
            work. Known for supporting developers, translating business needs into
            actionable tasks, improving workflows, and keeping projects moving.
          </p>
        </div>
      </section>

      <section className="sectionCard">
        <div className="sectionHeading">
          <p className="eyebrow">Core Skills</p>
          <h2>Technical and professional range built around execution.</h2>
        </div>
        <div className="grid twoGrid">
          <article className="contentCard serviceCard">
            <p className="microLabel">Technical & Professional Skills</p>
            <ul className="resumeList">
              {technicalSkills.map((skill) => (
                <li key={skill}>{skill}</li>
              ))}
            </ul>
          </article>

          <article className="contentCard fitCard">
            <p className="microLabel">Leadership & Operations</p>
            <ul className="resumeList">
              {leadershipSkills.map((skill) => (
                <li key={skill}>{skill}</li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      <section className="sectionCard">
        <div className="sectionHeading">
          <p className="eyebrow">Education & Development</p>
          <h2>Formal training with continued professional growth.</h2>
        </div>
        <div className="grid twoGrid">
          <article className="contentCard packageCard">
            <p className="microLabel">Education</p>
            <h3>New Jersey Institute of Technology</h3>
            <p>Master of Science, Management Information Systems</p>
            <p className="resumeMeta">Completed January 2011</p>
          </article>

          <article className="contentCard principleCard">
            <p className="microLabel">Professional Development</p>
            <h3>Dale Carnegie - Skills for Success</h3>
            <p className="resumeMeta">2019</p>
          </article>
        </div>
      </section>

      <section className="sectionCard">
        <div className="sectionHeading">
          <p className="eyebrow">Employment History</p>
          <h2>Leadership, operations, and software experience across multiple roles.</h2>
        </div>
        <div className="grid">
          {employmentHistory.map((role, index) => (
            <article className="contentCard projectCard resumeRoleCard" key={role.title + role.company}>
              <div className="resumeRoleHeader">
                <div>
                  <p className="cardIndex">Role 0{index + 1}</p>
                  <h3>{role.title}</h3>
                  <p className="resumeMeta">
                    {role.company} • {role.location}
                  </p>
                </div>
                <p className="resumeDate">{role.dates}</p>
              </div>
              <ul className="resumeList">
                {role.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
