import { ContactForm } from "@/components/contact-form";

const services = [
  {
    title: "Creative & Marketing",
    body:
      "Websites, logos, journal ads, flyers, campaigns, labels, fundraising visuals, and community-facing materials."
  },
  {
    title: "Business Writing & Messaging",
    body:
      "Emails, proposals, donor appeals, letters, pitch copy, website copy, executive summaries, and plain-English business documents."
  },
  {
    title: "AI Workflow Consulting",
    body:
      "Workflow reviews, automation ideas, internal tools, SOPs, dashboards, data cleanup, and document processing strategy."
  },
  {
    title: "MVP & Product Blueprinting",
    body:
      "Product specs, app planning, user flows, backend structure, feature lists, developer handoff docs, and AI-agent build instructions."
  }
];

const projects = [
  {
    type: "Community Fundraising Campaign",
    title: "Campaign identity and donor materials",
    body:
      "Campaign messaging, pledge card concept, poster direction, parlor meeting signage, and reusable event materials.",
    result:
      "Created a polished campaign identity with practical fundraising materials."
  },
  {
    type: "Dessert Brand Label & Packaging",
    title: "Retail-ready product presentation",
    body:
      "Logo refinement, circular product label, kosher/parve badge layout, freezer instruction label, and typography cleanup.",
    result: "Created a sharper, cleaner look for a small food brand."
  },
  {
    type: "Journal Ads & Event Materials",
    title: "Fast community-facing design support",
    body:
      "Ad copy, layout direction, headline concepts, typography cleanup, and WhatsApp-ready versions.",
    result:
      "Produced polished event and advertising materials quickly and affordably."
  },
  {
    type: "Healthcare AI Platform Planning",
    title: "Workflow and software direction",
    body:
      "Workflow analysis, product architecture, developer handoff specs, AI document processing strategy, and referral workflow planning.",
    result:
      "Organized complex referral workflows into a clearer software direction."
  },
  {
    type: "Buyer Marketplace / Receipt Tracking",
    title: "Product roadmap from a messy concept",
    body:
      "Receipt upload flow, runner/dealer workflow mapping, AI validation concept, dashboard planning, and backend structure.",
    result: "Turned a fragmented marketplace idea into a structured roadmap."
  },
  {
    type: "Business & Legal-Style Writing",
    title: "Plain-English communication that still sounds serious",
    body:
      "Formal letters, dispute language, contract simplification, business communication, and negotiation wording.",
    result:
      "Helped people communicate clearly without robotic or over-lawyered language."
  }
];

const packages = [
  ["$250+", "Quick Creative Consult", "Direction on a website, ad, logo, campaign, or message."],
  ["$500-$2,500+", "Creative Buildout", "Copy, concepts, visual direction, and polished materials for launch or outreach."],
  ["$500-$1,500+", "AI Workflow Audit", "Workflow review, automation opportunities, and a plain-English action plan."],
  ["$2,500-$7,500+", "MVP / App Blueprint", "User flows, features, backend logic, MVP scope, and build-ready planning docs."],
  ["$3,000-$10,000/month", "Fractional AI / Product Partner", "Ongoing product direction, developer oversight, workflow strategy, and business-to-tech translation."]
] as const;

const proofItems = [
  "Screenshots and before/after examples",
  "Short honest testimonials from real clients or organizers",
  "Simple project descriptions showing what became clearer, sharper, or more usable"
];

export default function HomePage() {
  return (
    <main className="pageShell">
      <header className="siteHeader">
        <a className="brand" href="#top">
          <span className="brandMark">RM</span>
          <span className="brandText">
            <strong>Reuben Moddel</strong>
            <span>Creative AI Operator for Real-World Business</span>
          </span>
        </a>
        <nav className="siteNav">
          <a href="#services">Services</a>
          <a href="#work">Work</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </nav>
        <a className="button smallButton" href="#session">
          Book a Session
        </a>
      </header>

      <section className="heroSection" id="top">
        <div className="heroCopy">
          <p className="eyebrow">Bring me the mess. I’ll help make it make sense.</p>
          <h1>Turn Rough Ideas Into Polished Results</h1>
          <p className="heroText">
            Websites, logos, ads, campaigns, business writing, app plans, and
            AI-powered workflows, created with practical business sense, creative
            direction, and AI-powered speed.
          </p>
          <div className="heroActions">
            <a className="button" href="#session">
              Book an Idea-to-Execution Session
            </a>
            <a className="button buttonGhost" href="#work">
              See Work Samples
            </a>
          </div>
        </div>
        <aside className="heroPanel">
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
        </aside>
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
          {services.map((service) => (
            <article className="contentCard" key={service.title}>
              <h3>{service.title}</h3>
              <p>{service.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="sectionCard">
        <div className="sectionHeading">
          <p className="eyebrow">How It Works</p>
          <h2>From rough concept to something usable.</h2>
        </div>
        <div className="grid fourGrid">
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
          {projects.map((project) => (
            <article className="contentCard" key={project.type}>
              <p className="microLabel">{project.type}</p>
              <h3>{project.title}</h3>
              <p>{project.body}</p>
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
          <h2>Flexible ways to work together.</h2>
        </div>
        <div className="grid twoGrid">
          {packages.map(([price, title, body]) => (
            <article className="contentCard" key={title}>
              <p className="microLabel">{price}</p>
              <h3>{title}</h3>
              <p>{body}</p>
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
      </section>

      <section className="sectionCard">
        <div className="sectionHeading">
          <p className="eyebrow">Proof</p>
          <h2>Use real proof, not manufactured credibility.</h2>
        </div>
        <div className="grid threeGrid">
          {proofItems.map((item) => (
            <article className="contentCard" key={item}>
              <h3>{item}</h3>
              <p>Keep this section anchored in real screenshots, project materials, and client feedback you can stand behind.</p>
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
    </main>
  );
}
