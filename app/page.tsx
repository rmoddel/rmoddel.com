import type { Metadata } from "next";
import { AiWidget } from "@/components/ai-widget";
import { ContactForm } from "@/components/contact-form";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import {
  capabilities,
  outcomePoints,
  projects,
  workingPrinciples
} from "@/lib/site-content";

const experienceHighlights = [
  {
    title: "Product operations and technical leadership",
    body:
      "Led cross-functional delivery, built operating rhythms, clarified priorities, supported developers, and helped leadership see what was happening."
  },
  {
    title: "Workflow and internal systems",
    body:
      "Improved operational processes, migrated teams into better systems, built internal tools, and reduced manual work through practical automation."
  },
  {
    title: "Software background with business translation",
    body:
      "Started in web development, moved through software analysis, and grew into roles centered on explaining, coordinating, and improving technical work."
  },
  {
    title: "Human-centered communication",
    body:
      "Used writing, training, documentation, and plain-English communication to help people understand what needs to happen next."
  }
] as const;

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": "https://rmoddel.com/#person",
      name: "Reuben Moddel",
      url: "https://rmoddel.com",
      image: "https://rmoddel.com/opengraph-image",
      jobTitle: "Product Operations and Technical Leader",
      description:
        "Reuben Moddel helps people make sense of messy work through technical judgment, operational experience, clear writing, and human understanding.",
      knowsAbout: [
        "Product operations",
        "Technical operations",
        "Workflow design",
        "Developer support",
        "Requirement gathering",
        "AI-enabled workflows",
        "Plain-English communication"
      ]
    },
    {
      "@type": "WebSite",
      "@id": "https://rmoddel.com/#website",
      name: "rmoddel.com",
      url: "https://rmoddel.com",
      inLanguage: "en-US",
      description:
        "Personal portfolio for Reuben Moddel, focused on product operations, technical leadership, workflow thinking, and practical execution.",
      author: {
        "@id": "https://rmoddel.com/#person"
      }
    },
    {
      "@type": "ProfilePage",
      "@id": "https://rmoddel.com/#profile",
      url: "https://rmoddel.com",
      name: "Reuben Moddel",
      description:
        "Personal portfolio and working profile for Reuben Moddel.",
      mainEntity: {
        "@id": "https://rmoddel.com/#person"
      },
      isPartOf: {
        "@id": "https://rmoddel.com/#website"
      }
    }
  ]
};

export const metadata: Metadata = {
  title: "Reuben Moddel | Product Operations and Technical Leadership",
  description:
    "Personal portfolio for Reuben Moddel, focused on product operations, technical leadership, workflow design, clear communication, and human-centered execution.",
  alternates: {
    canonical: "/"
  },
  openGraph: {
    title: "Reuben Moddel | Product Operations and Technical Leadership",
    description:
      "A personal portfolio about making sense of messy work through product operations, technical judgment, workflow design, clear communication, and human understanding.",
    url: "/",
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
        alt: "Reuben Moddel - I help people make sense of messy work"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Reuben Moddel | Product Operations and Technical Leadership",
    description:
      "Product operations, technical leadership, workflow design, clear communication, and human-centered execution.",
    images: ["/twitter-image"]
  }
};

export default function HomePage() {
  return (
    <main className="pageShell">
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        type="application/ld+json"
      />
      <SiteHeader />

      <section className="heroSection" id="top">
        <div className="heroCopy">
          <div className="heroRibbon">
            <p className="eyebrow">Personal portfolio and working profile</p>
            <span className="heroSpark">Human understanding x technical judgment</span>
          </div>
          <h1>I Help People Make Sense of Messy Work</h1>
          <p className="heroText">
            I am Reuben Moddel, a product operations and technical leader who
            helps teams clarify ambiguous work, translate between people and
            systems, and turn practical judgment into movement.
          </p>
          <div className="heroTags" aria-label="Core strengths">
            <span>Product Operations</span>
            <span>Technical Leadership</span>
            <span>Workflow Design</span>
            <span>Clear Writing</span>
            <span>AI With Judgment</span>
          </div>
          <div className="heroActions">
            <a className="button" href="#experience">
              View Experience
            </a>
            <a className="button buttonGhost" href="#work">
              See Work Themes
            </a>
          </div>
          <div className="heroMiniGrid" aria-label="What this work produces">
            {[
              ["Human first", "The real situation matters before the tool, ticket, or plan."],
              ["Clear translation", "Business, technical, and operational context need to line up."],
              ["Practical output", "The work should help someone decide, build, explain, or move."]
            ].map(([title, body]) => (
              <article className="miniCard" key={title}>
                <h3>{title}</h3>
                <p>{body}</p>
              </article>
            ))}
          </div>
        </div>
        <aside className="heroPanel">
          <div className="heroPanelBadge">How I Think</div>
          <p className="panelLabel">What I tend to notice first</p>
          <ul>
            <li>What people are actually trying to accomplish</li>
            <li>Where teams are talking past each other</li>
            <li>Which constraint is real and which is noise</li>
            <li>What needs to be clarified before execution</li>
          </ul>
          <p className="panelResult">
            The thread: strong human understanding, clear thinking, and useful execution.
          </p>
          <div className="heroOutcomeList">
            {outcomePoints.map((point) => (
              <span key={point}>{point}</span>
            ))}
          </div>
        </aside>
      </section>

      <section className="tickerSection" aria-label="Audience">
        <div className="tickerTrack">
          <span>Product Operations</span>
          <span>Technical Leadership</span>
          <span>Workflow Design</span>
          <span>Developer Support</span>
          <span>Requirements</span>
          <span>Documentation</span>
          <span>AI With Judgment</span>
          <span>Human Understanding</span>
          <span>Practical Execution</span>
        </div>
      </section>

      <section className="sectionCard">
        <div className="sectionHeading">
          <p className="eyebrow">Core Thread</p>
          <h2>Most of my work comes back to helping people think clearly.</h2>
        </div>
        <div className="twoColumn">
          <p>
            Across product operations, technical leadership, software analysis,
            workflows, writing, and AI, the common thread is not the tool. It is
            understanding the human situation well enough to make the next move
            clearer.
          </p>
          <p>
            I like work where context matters: where people need requirements
            clarified, tradeoffs explained, teams aligned, systems improved, or
            a messy goal turned into something others can act on.
          </p>
        </div>
      </section>

      <section className="sectionCard" id="capabilities">
        <div className="sectionHeading">
          <p className="eyebrow">Capabilities</p>
          <h2>Where I tend to be useful.</h2>
        </div>
        <div className="grid fourGrid">
          {capabilities.map((capability, index) => (
            <article className="contentCard serviceCard" key={capability.title}>
              <p className="cardIndex">0{index + 1}</p>
              <h3>{capability.title}</h3>
              <p>{capability.body}</p>
              <div className="chipRow" aria-label={`${capability.title} examples`}>
                {capability.items.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="sectionCard">
        <div className="sectionHeading">
          <p className="eyebrow">Working Style</p>
          <h2>From messy context to useful movement.</h2>
        </div>
        <div className="grid fourGrid processGrid">
          {[
            ["01", "Understand the people", "I try to understand the context, pressure, audience, and real-world constraints before jumping to a solution."],
            ["02", "Name the actual problem", "The useful problem is often hiding under symptoms, requests, assumptions, or a tool someone already picked."],
            ["03", "Structure the next move", "That may become requirements, a workflow, a document, a plan, a prototype, or a clearer conversation."],
            ["04", "Make it usable", "I care about outputs people can understand, use, hand off, build from, or make decisions with."]
          ].map(([step, title, body]) => (
            <article className="contentCard stepCard" key={step}>
              <span>{step}</span>
              <h3>{title}</h3>
              <p>{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="sectionCard" id="work">
        <div className="sectionHeading">
          <p className="eyebrow">Selected Work Themes</p>
          <h2>Examples of the kind of thinking I bring to the work.</h2>
        </div>
        <div className="grid twoGrid">
          {projects.map((project, index) => (
            <article className="contentCard projectCard" key={project.type}>
              <p className="cardIndex">Case {index + 1}</p>
              <p className="microLabel">{project.type}</p>
              <h3>{project.title}</h3>
              <p>{project.summary}</p>
              <div className="detailList" aria-label={`${project.title} deliverables`}>
                {project.deliverables.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
              <p className="resultText">Result: {project.result}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="sectionCard">
        <div className="sectionHeading">
          <p className="eyebrow">Human Understanding First</p>
          <h2>AI is useful when it is guided by real context.</h2>
        </div>
        <div className="twoColumn">
          <p>
            I use AI to move faster, explore options, structure ideas, draft,
            summarize, test angles, and reduce repetitive work.
          </p>
          <p>
            But the important part is still human: knowing what problem we are
            solving, who is affected, what tone fits, what tradeoff matters, and
            what output is actually useful.
          </p>
        </div>
        <div className="grid threeGrid principleGrid">
          {workingPrinciples.map((principle) => (
            <article className="contentCard principleCard" key={principle.title}>
              <h3>{principle.title}</h3>
              <p>{principle.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="sectionCard" id="experience">
        <div className="sectionHeading">
          <p className="eyebrow">Experience</p>
          <h2>Work history with a consistent throughline.</h2>
        </div>
        <p className="sectionIntro">
          My resume has the formal role-by-role detail. The short version is
          that I have moved from web development into software analysis,
          technical operations, product operations, and technical leadership.
        </p>
        <div className="grid twoGrid">
          {experienceHighlights.map((item, index) => (
            <article className="contentCard structuredCard" key={item.title}>
              <p className="cardIndex">Thread 0{index + 1}</p>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
        <div className="heroActions">
          <a className="button" href="/resume">
            View Resume
          </a>
          <a className="button buttonGhost" href="/resume.pdf">
            Download PDF
          </a>
        </div>
      </section>

      <section className="sectionCard" id="about">
        <div className="sectionHeading">
          <p className="eyebrow">About Reuben Moddel</p>
          <h2>I am most useful when the work needs judgment, not just output.</h2>
        </div>
        <div className="twoColumn">
          <p>
            I am not trying to present this site as a company. It is a portfolio
            and working profile for the kind of roles and projects where my
            range is useful: technical, operational, written, human, and
            practical.
          </p>
          <p>
            My work experience has mostly lived in the middle: between business
            goals and technical execution, between leadership and developers,
            between messy inputs and clear next steps, and between AI speed and
            human judgment.
          </p>
        </div>
        <div className="chipRow" aria-label="What clients typically leave with">
          {outcomePoints.map((point) => (
            <span key={point}>{point}</span>
          ))}
        </div>
      </section>

      <section className="contactSection" id="contact">
        <div className="contactCopy">
          <p className="eyebrow">Contact</p>
          <h2>Reach out about a role, project, or conversation.</h2>
          <p>
            I am using this site as a portfolio for prospective job
            opportunities, especially roles involving product operations,
            technical operations, workflow design, AI-enabled execution, and
            cross-functional clarity.
          </p>
          <p>
            I am also open to relevant project or service inquiries when the fit
            makes sense. Send the context and I will respond directly.
          </p>
        </div>
        <ContactForm />
      </section>
      <SiteFooter />
      <AiWidget />
    </main>
  );
}
