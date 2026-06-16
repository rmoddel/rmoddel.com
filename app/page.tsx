import type { Metadata } from "next";
import { AiWidget } from "@/components/ai-widget";
import { ContactForm } from "@/components/contact-form";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import {
  outcomePoints,
  packages,
  projects,
  services,
  workingPrinciples
} from "@/lib/site-content";

const fitItems = [
  {
    title: "When the idea is still messy",
    body:
      "You know what you want in broad terms, but the offer, message, structure, or deliverable still feels unclear."
  },
  {
    title: "When words and design need to line up",
    body:
      "You need the idea to look right, sound right, and make practical sense at the same time."
  },
  {
    title: "When AI might help, but only if it actually helps",
    body:
      "You want speed and leverage without turning the work into generic AI output or unnecessary complexity."
  },
  {
    title: "When execution needs direction",
    body:
      "You need someone who can clarify the work, shape the next step, and give developers, designers, or collaborators something usable."
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
      jobTitle: "Creative AI Operator",
      description:
        "Reuben Moddel helps businesses, nonprofits, founders, and community organizations turn rough ideas into polished results.",
      knowsAbout: [
        "Websites",
        "Business writing",
        "AI workflow consulting",
        "MVP planning",
        "Creative direction",
        "Product blueprinting"
      ]
    },
    {
      "@type": "ProfessionalService",
      "@id": "https://rmoddel.com/#service",
      name: "rmoddel.com",
      url: "https://rmoddel.com",
      description:
        "Creative AI operator services covering websites, ads, campaigns, business writing, workflows, and app planning.",
      founder: {
        "@id": "https://rmoddel.com/#person"
      },
      areaServed: "Worldwide",
      serviceType: [
        "Creative and marketing support",
        "Business writing and messaging",
        "AI workflow consulting",
        "MVP and product blueprinting"
      ]
    },
  ]
};

export const metadata: Metadata = {
  title: "Creative AI Operator for Real-World Business",
  description:
    "Reuben Moddel helps turn rough ideas into polished websites, ads, campaigns, business writing, workflows, and AI-powered systems.",
  alternates: {
    canonical: "/"
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
            <p className="eyebrow">Bring me the mess. I’ll help make it make sense.</p>
            <span className="heroSpark">Human judgment x AI speed</span>
          </div>
          <h1>Turn Rough Ideas Into Polished Results</h1>
          <p className="heroText">
            Websites, logos, ads, campaigns, business writing, app plans, and
            AI-powered workflows, created with practical business sense, creative
            direction, and AI-powered speed.
          </p>
          <div className="heroTags" aria-label="Key offerings">
            <span>Websites</span>
            <span>Campaigns</span>
            <span>Business Writing</span>
            <span>AI Workflows</span>
            <span>App Plans</span>
          </div>
          <div className="heroActions">
            <a className="button" href="#session">
              Book an Idea-to-Execution Session
            </a>
            <a className="button buttonGhost" href="#work">
              See Work Samples
            </a>
          </div>
          <div className="heroMiniGrid" aria-label="What this work produces">
            {[
              ["Clarity first", "The first step is making the idea coherent."],
              ["Useful outputs", "The result should be ready to use or hand off."],
              ["Range without drift", "Creative, writing, workflow, and product thinking stay aligned."]
            ].map(([title, body]) => (
              <article className="miniCard" key={title}>
                <h3>{title}</h3>
                <p>{body}</p>
              </article>
            ))}
          </div>
        </div>
        <aside className="heroPanel">
          <div className="heroPanelBadge">Idea to Execution</div>
          <p className="panelLabel">What clients usually bring</p>
          <ul>
            <li>Scattered notes and screenshots</li>
            <li>Half-written copy and rough ideas</li>
            <li>Unclear offers, websites, or campaigns</li>
            <li>App concepts that need structure</li>
          </ul>
          <p className="panelResult">
            Outcome: clear direction, sharp messaging, usable deliverables.
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
          <span>Businesses</span>
          <span>Nonprofits</span>
          <span>Founders</span>
          <span>Community Organizations</span>
          <span>Websites</span>
          <span>Ads</span>
          <span>Writing</span>
          <span>Workflows</span>
          <span>App Plans</span>
        </div>
      </section>

      <section className="sectionCard">
        <div className="sectionHeading">
          <p className="eyebrow">Core Positioning</p>
          <h2>You Have the Idea. Now It Needs to Make Sense.</h2>
        </div>
        <div className="twoColumn">
          <p>
            Most people do not need more tech. They need someone who can
            understand what they are trying to do, organize the idea, find the
            right angle, and turn it into something real.
          </p>
          <p>
            I combine writing, design direction, business sense, software
            thinking, and AI tools to help businesses, nonprofits, founders, and
            community organizations move from idea to execution quickly.
          </p>
        </div>
      </section>

      <section className="sectionCard" id="services">
        <div className="sectionHeading">
          <p className="eyebrow">What I Help With</p>
          <h2>Clear deliverables across creative, writing, workflows, and product planning.</h2>
        </div>
        <div className="grid fourGrid">
          {services.map((service, index) => (
            <article className="contentCard serviceCard" key={service.title}>
              <p className="cardIndex">0{index + 1}</p>
              <h3>{service.title}</h3>
              <p>{service.body}</p>
              <div className="chipRow" aria-label={`${service.title} examples`}>
                {service.items.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="sectionCard">
        <div className="sectionHeading">
          <p className="eyebrow">How It Works</p>
          <h2>From rough concept to something usable.</h2>
        </div>
        <div className="grid fourGrid processGrid">
          {[
            ["01", "You explain the mess", "Bring the notes, screenshots, voice notes, draft, or half-built project."],
            ["02", "I clarify the direction", "We figure out what matters most and what the best first deliverable should be."],
            ["03", "We create the thing", "That may be copy, design direction, a website, a document, a workflow, or a product plan."],
            ["04", "You walk away with something practical", "Clear, professional, and ready to use or hand off."]
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
          <p className="eyebrow">Selected Work</p>
          <h2>Real project types. Honest descriptions. No fake case studies.</h2>
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
          <p className="eyebrow">AI With Human Judgment</p>
          <h2>AI is an amplifier, not a replacement for judgment.</h2>
        </div>
        <div className="twoColumn">
          <p>
            I use AI to move faster, explore more directions, sharpen copy, test
            layouts, structure ideas, and speed up execution.
          </p>
          <p>
            The final direction, taste, messaging, business logic, and quality
            control still come from human judgment. AI can generate. I help
            decide what is actually good, useful, clear, and appropriate.
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

      <section className="offerPanel" id="session">
        <div className="sectionHeading">
          <p className="eyebrow">Main Offer</p>
          <h2>Idea-to-Execution Session</h2>
        </div>
        <p>
          For people who have an idea but do not know how to package it, write
          it, design it, or build it.
        </p>
        <p>
          In one focused session, we clarify what you are trying to create, what
          matters most, and what the next practical deliverable should be.
        </p>
        <ul className="checkList">
          <li>A clearer version of your idea</li>
          <li>Recommended direction and deliverables</li>
          <li>Practical next steps</li>
          <li>Messaging angles and AI opportunities where relevant</li>
        </ul>
        <a className="button" href="#contact">
          Book an Idea-to-Execution Session
        </a>
      </section>

      <section className="sectionCard">
        <div className="sectionHeading">
          <p className="eyebrow">Service Packages</p>
          <h2>Clear ways to work together.</h2>
        </div>
        <p className="sectionIntro">
          These are starting points, not rigid boxes. The right engagement depends
          on whether you need strategy, materials, workflow thinking, or a full
          product plan.
        </p>
        <div className="grid twoGrid">
          {packages.map((pkg, index) => (
            <article className="contentCard packageCard" key={pkg.title}>
              <p className="cardIndex">Option 0{index + 1}</p>
              <p className="microLabel">{pkg.price}</p>
              <h3>{pkg.title}</h3>
              <p>{pkg.body}</p>
              <p className="bestForText">{pkg.bestFor}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="sectionCard" id="about">
        <div className="sectionHeading">
          <p className="eyebrow">About Reuben Moddel</p>
          <h2>I help people make sense of messy ideas.</h2>
        </div>
        <div className="twoColumn">
          <p>
            I am not a traditional designer, copywriter, developer, or
            consultant. I am the person people call when they have a rough idea
            and need help making it make sense.
          </p>
          <p>
            I combine business understanding, writing, design taste, software
            thinking, AI tools, plain-English communication, and practical
            execution. That range lets me move between websites, ads, app plans,
            business documents, and internal systems without losing the thread.
          </p>
        </div>
        <div className="chipRow" aria-label="What clients typically leave with">
          {outcomePoints.map((point) => (
            <span key={point}>{point}</span>
          ))}
        </div>
      </section>

      <section className="sectionCard">
        <div className="sectionHeading">
          <p className="eyebrow">Best Fit</p>
          <h2>Where this kind of help is most useful.</h2>
        </div>
        <div className="grid twoGrid">
          {fitItems.map((item) => (
            <article className="contentCard fitCard" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="contactSection" id="contact">
        <div className="contactCopy">
          <p className="eyebrow">Start With a Conversation</p>
          <h2>Have something you want to create?</h2>
          <p>
            Website, ad, logo, campaign, business document, workflow, or app
            idea. Bring the rough version and tell me what you are trying to
            build.
          </p>
          <p>You do not need to have it all figured out. That is the point.</p>
        </div>
        <ContactForm />
      </section>
      <SiteFooter />
      <AiWidget />
    </main>
  );
}
