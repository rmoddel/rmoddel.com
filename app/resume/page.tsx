import type { Metadata } from "next";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import {
  education,
  employmentHistory,
  leadershipSkills,
  professionalDevelopment,
  resumeIdentity,
  resumeSummary,
  technicalSkills
} from "@/lib/resume-content";
import { siteProfile } from "@/lib/site-profile";

export const metadata: Metadata = {
  title: "Resume | Business Operations and Technical Solutions Leadership",
  description:
    "Resume for Reuben Moddel, a business operations and technical solutions leader with experience across clear communication, AI-enabled automation, process improvement, business systems, and cross-functional execution.",
  alternates: {
    canonical: "/resume"
  },
  openGraph: {
    title: "Reuben Moddel Resume",
    description:
      "Business operations, technical solutions, and AI-enabled automation resume for Reuben Moddel.",
    url: "/resume",
    siteName: "rmoddel.com",
    locale: "en_US",
    type: "profile",
    firstName: "Reuben",
    lastName: "Moddel",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Reuben Moddel resume"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Reuben Moddel Resume",
    description:
      "Business operations, technical solutions, and AI-enabled automation resume for Reuben Moddel.",
    images: ["/twitter-image"]
  }
};

export default function ResumePage() {
  return (
    <main className="pageShell">
      <SiteHeader brandLine={siteProfile.identity.primaryTitle} />

      <section className="heroSection resumeHero">
        <div className="heroCopy">
          <div className="heroRibbon">
            <p className="eyebrow">Resume</p>
            <span className="heroSpark">{siteProfile.positioning.credential}</span>
          </div>
          <h1>{resumeIdentity.name}</h1>
          <p className="heroText resumeHeadline">{resumeIdentity.title}</p>
          <div className="heroTags" aria-label="Contact details">
            <span>{resumeIdentity.location}</span>
            <span>
              <a href={resumeIdentity.phoneHref}>{resumeIdentity.phone}</a>
            </span>
            <span>
              <a href={resumeIdentity.emailHref}>{resumeIdentity.email}</a>
            </span>
          </div>
          <div className="resumeActions">
            <a className="button buttonGhost smallButton resumeDownloadButton" href="/resume.pdf">
              Download PDF Resume
            </a>
          </div>
        </div>

        <aside className="heroPanel resumePanel">
          <div>
            <div className="heroPanelBadge">Profile</div>
            <p className="panelResult">
              Strong communicator and technical operations leader with practical
              judgment across people, systems, process improvement, automation,
              and advanced AI.
            </p>
          </div>
          <div className="heroOutcomeList">
            <span>Clear communication</span>
            <span>Technical fluency</span>
            <span>AI judgment</span>
            <span>Process improvement</span>
            <span>Cross-functional execution</span>
          </div>
        </aside>
      </section>

      <section className="sectionCard">
        <div className="sectionHeading">
          <p className="eyebrow">Summary</p>
          <h2>Clear communication, technical judgment, and practical follow-through.</h2>
        </div>
        <div className="twoColumn">
          {resumeSummary.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </section>

      <section className="sectionCard">
        <div className="sectionHeading">
          <p className="eyebrow">Core Skills</p>
          <h2>Communication, operations, systems, and AI range built around execution.</h2>
        </div>
        <div className="grid twoGrid">
          <article className="contentCard serviceCard">
            <p className="microLabel">Technical, AI & Systems Execution</p>
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
          <article className="contentCard structuredCard">
            <p className="microLabel">Education</p>
            <h3>{education.school}</h3>
            <p>{education.degree}</p>
            <p className="resumeMeta">{education.completed}</p>
          </article>

          <article className="contentCard principleCard">
            <p className="microLabel">Professional Development</p>
            <h3>{professionalDevelopment.program}</h3>
            <p className="resumeMeta">{professionalDevelopment.year}</p>
          </article>
        </div>
      </section>

      <section className="sectionCard">
        <div className="sectionHeading">
          <p className="eyebrow">Employment History</p>
          <h2>A deliberate progression from technical builder to operations leader.</h2>
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

      <SiteFooter
        name={siteProfile.identity.name}
        summary={siteProfile.positioning.summary}
        title={siteProfile.identity.primaryTitle}
      />
    </main>
  );
}
