import { ContactForm } from "@/components/contact-form";
import {
  clientPromise,
  gpsMashal,
  gpsPrinciples,
  gpsSupportLine,
  landingNavigation
} from "@/lib/interactive-resume-content";
import { capabilities, outcomePoints, projects } from "@/lib/site-content";
import { siteProfile } from "@/lib/site-profile";

export function HeroSection() {
  return (
    <section
      aria-label="Reuben Moddel overview"
      className="heroSection"
      id="top"
      style={{ backgroundImage: "url('/gps-process-hero.png')" }}
    >
      <div className="heroOverlay" />
      <div className="heroCopy">
        <p className="eyebrow">{siteProfile.hero.eyebrow}</p>
        <h1>{siteProfile.hero.headline}</h1>
        <p className="heroText">{siteProfile.hero.body}</p>
        <p className="heroSupport">{siteProfile.hero.spark}</p>
        <div className="heroActions">
          <a className="button" href="/chat">
            Ask My Interactive Resume
          </a>
          <a className="button buttonSecondary" href="/resume">
            View My Resume
          </a>
          <a className="textLink" href="/contact">
            Contact Me
          </a>
        </div>
      </div>
    </section>
  );
}

export function CredentialTicker() {
  return (
    <section className="credibilityStrip" aria-label="Credibility">
      {siteProfile.hero.credentialStrip.map((item) => (
        <p key={item}>{item}</p>
      ))}
    </section>
  );
}

export function GpsSection() {
  return (
    <section className="sectionCard" id="gps">
      <div className="sectionHeading">
        <p className="eyebrow">The GPS Approach</p>
        <h2>Genuine, Personalized Solutions.</h2>
      </div>
      <p className="sectionIntro">
        GPS means Genuine, Personalized Solutions. I begin with the real process
        and the people affected, then design a solution around the way the
        organization actually works.
      </p>
      <div className="grid threeGrid">
        {gpsPrinciples.map((principle) => (
          <article className="contentCard" key={principle.title}>
            <h3>{principle.title}</h3>
            <p>{principle.body}</p>
          </article>
        ))}
      </div>
      <div className="routeCallout">
        <p>{gpsMashal}</p>
        <strong>{gpsSupportLine}</strong>
      </div>
    </section>
  );
}

export function CapabilitiesSection() {
  return (
    <section className="sectionCard" id="capabilities">
      <div className="sectionHeading">
        <p className="eyebrow">Core Strengths</p>
        <h2>Human judgment, operational clarity, and useful technology.</h2>
      </div>
      <div className="grid threeGrid">
        {capabilities.map((capability) => (
          <article className="contentCard serviceCard" key={capability.title}>
            <h3>{capability.title}</h3>
            <p>{capability.body}</p>
            <ul className="compactList">
              {capability.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
      <p className="sectionNote">
        I care about the people who have to live with the solution after it is
        delivered.
      </p>
    </section>
  );
}

export function PathwaysSection() {
  return (
    <section className="sectionCard">
      <div className="sectionHeading">
        <p className="eyebrow">Choose a Path</p>
        <h2>Read, ask, or reach out directly.</h2>
      </div>
      <div className="grid threeGrid">
        {landingNavigation.map((item) => (
          <article className="contentCard pathwayCard" key={item.title}>
            <h3>{item.title}</h3>
            <p>{item.body}</p>
            <a className="button buttonSecondary smallButton" href={item.href}>
              {item.cta}
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}

export function HowIWorkSection() {
  return (
    <section className="sectionCard">
      <div className="sectionHeading">
        <p className="eyebrow">Process</p>
        <h2>From current workflow to useful handoff.</h2>
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
  );
}

export function WorkSection({ compact = false }: { compact?: boolean }) {
  return (
    <section className="sectionCard" id="work">
      <div className="sectionHeading">
        <p className="eyebrow">Project Proof</p>
        <h2>Approved examples of personalized operational tools.</h2>
      </div>
      <div className="grid twoGrid">
        {projects.map((project) => (
          <article className="contentCard projectCard" key={project.title}>
            <div className="cardMetaRow">
              <p className="microLabel">{project.type}</p>
              <span className="statusBadge">{project.status}</span>
            </div>
            <h3>{project.title}</h3>
            <p>{project.summary}</p>
            {!compact ? (
              <ul className="compactList">
                {project.deliverables.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : null}
            <p className="resultText">Result: {project.result}</p>
          </article>
        ))}
      </div>
      <p className="sectionNote">
        I keep delivered work separate from ideas that are still being shaped.
      </p>
    </section>
  );
}

export function AiLeverageSection() {
  return (
    <section className="sectionCard">
      <div className="sectionHeading">
        <p className="eyebrow">AI and Software</p>
        <h2>{siteProfile.ai.headline}</h2>
      </div>
      <div className="splitText">
        <p>{siteProfile.ai.body}</p>
        <ul className="compactList">
          {siteProfile.ai.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function ExperienceSection() {
  return (
    <section className="sectionCard" id="experience">
      <div className="sectionHeading">
        <p className="eyebrow">Experience Arc</p>
        <h2>{siteProfile.experience.headline}</h2>
      </div>
      <p className="sectionIntro">{siteProfile.experience.body}</p>
      <div className="careerArc" aria-label="Career progression">
        {siteProfile.experience.threads.map((item) => (
          <article className="contentCard" key={item.title}>
            <h3>{item.title}</h3>
            <p>{item.body}</p>
          </article>
        ))}
      </div>
      <ul className="compactList twoColumnList">
        {siteProfile.experience.highlights.map((highlight) => (
          <li key={highlight}>{highlight}</li>
        ))}
      </ul>
      <div className="heroActions">
        <a className="button" href="/resume">
          View Resume
        </a>
        <a className="button buttonSecondary" href="/chat?topic=experience">
          Ask About Experience
        </a>
      </div>
    </section>
  );
}

export function AboutSection() {
  return (
    <section className="sectionCard" id="about">
      <div className="sectionHeading">
        <p className="eyebrow">About Me</p>
        <h2>{siteProfile.about.headline}</h2>
      </div>
      <div className="splitText">
        {siteProfile.about.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
      <ul className="outcomeList" aria-label="What teams typically gain">
        {outcomePoints.map((point) => (
          <li key={point}>{point}</li>
        ))}
      </ul>
    </section>
  );
}

export function AboutDetailSection() {
  return (
    <>
      <section className="sectionCard">
        <div className="sectionHeading">
          <p className="eyebrow">Career Progression</p>
          <h2>Hands-on contributor to AI solutions builder.</h2>
        </div>
        <div className="arcLine">
          <span>Hands-On Contributor</span>
          <span>Business and Systems Analyst</span>
          <span>Operations and Team Leadership</span>
          <span>AI Solutions Builder</span>
        </div>
        <p className="sectionIntro">{siteProfile.experience.body}</p>
      </section>

      <section className="sectionCard">
        <div className="sectionHeading">
          <p className="eyebrow">Human Component</p>
          <h2>Understanding people is part of the work.</h2>
        </div>
        <div className="grid twoGrid">
          <article className="contentCard">
            <h3>Management</h3>
            <p>
              Strong management begins with understanding people: their
              responsibilities, pressures, strengths, and concerns, and then
              creating enough clarity and accountability for everyone to move
              forward.
            </p>
          </article>
          <article className="contentCard">
            <h3>Technology</h3>
            <p>
              Technology should reduce friction, not create another system
              people struggle to maintain. AI and modern software tools belong
              where they add real value.
            </p>
          </article>
        </div>
      </section>

      <section className="sectionCard">
        <div className="sectionHeading">
          <p className="eyebrow">Work Ethic</p>
          <h2>Direct, ethical, practical, and free of pretense.</h2>
        </div>
        <p className="sectionIntro">
          I want to do work that genuinely helps people and organizations, not
          create activity that merely looks impressive.
        </p>
        <ul className="outcomeList">
          <li>Honest</li>
          <li>Direct</li>
          <li>Ethical</li>
          <li>Does not oversell</li>
          <li>Takes ownership</li>
          <li>Communicates clearly</li>
        </ul>
      </section>
    </>
  );
}

export function ContactSection() {
  return (
    <section className="contactSection" id="contact">
      <div className="contactCopy">
        <p className="eyebrow">Contact</p>
        <h1>{siteProfile.contact.headline}</h1>
        <p>{siteProfile.contact.body}</p>
        <p>{siteProfile.contact.secondary}</p>
        <div className="contactPromise">
          <p className="microLabel">Working Promise</p>
          <strong>{clientPromise}</strong>
        </div>
      </div>
      <ContactForm />
    </section>
  );
}
