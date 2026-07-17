import type { Metadata } from "next";
import { AiWidget } from "@/components/ai-widget";
import { ContactForm } from "@/components/contact-form";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import {
  capabilities,
  outcomePoints,
  projects,
  technicalBackground
} from "@/lib/site-content";
import { siteProfile } from "@/lib/site-profile";

const technicalKnowsAbout = technicalBackground.flatMap((group) => group.items);

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": "https://rmoddel.com/#person",
      name: siteProfile.identity.name,
      url: "https://rmoddel.com",
      image: "https://rmoddel.com/opengraph-image",
      jobTitle: siteProfile.identity.primaryTitle,
      description: siteProfile.positioning.summary,
      knowsAbout: [
        "Business operations",
        "Operations and program management",
        "People leadership",
        "Process improvement",
        "Cross-functional execution",
        "Stakeholder alignment",
        "Business systems",
        "Automation-enabled operations",
        ...technicalKnowsAbout
      ]
    },
    {
      "@type": "WebSite",
      "@id": "https://rmoddel.com/#website",
      name: "rmoddel.com",
      url: "https://rmoddel.com",
      inLanguage: "en-US",
      description:
        "Personal portfolio for Reuben Moddel, focused on business operations, people leadership, process improvement, and organized execution.",
      author: {
        "@id": "https://rmoddel.com/#person"
      }
    },
    {
      "@type": "ProfilePage",
      "@id": "https://rmoddel.com/#profile",
      url: "https://rmoddel.com",
      name: siteProfile.identity.name,
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
  title: "Reuben Moddel | Business Operations and Organizational Leader",
  description:
    "Personal portfolio for Reuben Moddel, focused on operations leadership, people management, process improvement, stakeholder alignment, and organized execution.",
  alternates: {
    canonical: "/"
  },
  openGraph: {
    title: "Reuben Moddel | Business Operations and Organizational Leader",
    description:
      "Operations and people leadership grounded in process improvement, stakeholder alignment, business systems, and practical execution.",
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
        alt: "Reuben Moddel - Operations and People Leader"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Reuben Moddel | Business Operations and Organizational Leader",
    description:
      "Operations leadership, people management, process improvement, stakeholder alignment, and organized execution.",
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
      <SiteHeader brandLine={siteProfile.identity.primaryTitle} />

      <section className="heroSection" id="top">
        <div className="heroCopy">
          <div className="heroRibbon">
            <p className="eyebrow">{siteProfile.hero.eyebrow}</p>
            <span className="heroSpark">{siteProfile.hero.spark}</span>
          </div>
          <h1>{siteProfile.hero.headline}</h1>
          <p className="heroText">{siteProfile.hero.body}</p>
          <div className="heroTags" aria-label="Core strengths">
            {siteProfile.hero.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
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
            {siteProfile.hero.miniCards.map((card) => (
              <article className="miniCard" key={card.title}>
                <h3>{card.title}</h3>
                <p>{card.body}</p>
              </article>
            ))}
          </div>
        </div>
        <aside className="heroPanel">
          <div className="heroPanelBadge">{siteProfile.hero.panelBadge}</div>
          <p className="panelLabel">{siteProfile.hero.panelLabel}</p>
          <ul>
            {siteProfile.hero.panelItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="panelResult">{siteProfile.hero.panelResult}</p>
          <div className="heroOutcomeList">
            {outcomePoints.map((point) => (
              <span key={point}>{point}</span>
            ))}
          </div>
        </aside>
      </section>

      <section className="tickerSection" aria-label="Credential strip">
        <div className="tickerTrack">
          {siteProfile.hero.credentialStrip.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </section>

      <section className="sectionCard" id="capabilities">
        <div className="sectionHeading">
          <p className="eyebrow">Capabilities</p>
          <h2>Commercially recognizable strengths.</h2>
        </div>
        <div className="grid threeGrid">
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
          <p className="eyebrow">How I Work</p>
          <h2>From unclear objectives to organized execution.</h2>
        </div>
        <div className="grid fourGrid processGrid">
          {siteProfile.howIWork.map((body, index) => (
            <article className="contentCard stepCard" key={body}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <p>{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="sectionCard" id="work">
        <div className="sectionHeading">
          <p className="eyebrow">Selected Work Themes</p>
          <h2>Management proof through real execution contexts.</h2>
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
          <p className="eyebrow">Operational Leverage</p>
          <h2>{siteProfile.ai.headline}</h2>
        </div>
        <div className="twoColumn">
          <p>{siteProfile.ai.body}</p>
          <div className="chipRow" aria-label="Automation uses">
            {siteProfile.ai.items.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="sectionCard" id="experience">
        <div className="sectionHeading">
          <p className="eyebrow">Experience</p>
          <h2>{siteProfile.experience.headline}</h2>
        </div>
        <p className="sectionIntro">{siteProfile.experience.body}</p>
        <div className="grid threeGrid">
          {siteProfile.experience.threads.map((item, index) => (
            <article className="contentCard structuredCard" key={item.title}>
              <p className="cardIndex">Thread 0{index + 1}</p>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
        <div className="detailList experienceDetailList" aria-label="Experience highlights">
          {siteProfile.experience.highlights.map((highlight) => (
            <span key={highlight}>{highlight}</span>
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
          <h2>{siteProfile.about.headline}</h2>
        </div>
        <div className="twoColumn">
          {siteProfile.about.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <div className="chipRow" aria-label="What teams typically gain">
          {outcomePoints.map((point) => (
            <span key={point}>{point}</span>
          ))}
        </div>
      </section>

      <section className="contactSection" id="contact">
        <div className="contactCopy">
          <p className="eyebrow">Contact</p>
          <h2>{siteProfile.contact.headline}</h2>
          <p>{siteProfile.contact.body}</p>
          <p>{siteProfile.contact.secondary}</p>
        </div>
        <ContactForm />
      </section>
      <SiteFooter
        name={siteProfile.identity.name}
        summary={siteProfile.positioning.summary}
        title={siteProfile.identity.primaryTitle}
      />
      <AiWidget />
    </main>
  );
}
