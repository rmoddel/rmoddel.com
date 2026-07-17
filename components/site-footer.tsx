const footerLinks = [
  { href: "/", label: "Home" },
  { href: "/#work", label: "Work" },
  { href: "/#experience", label: "Experience" },
  { href: "/#about", label: "About" },
  { href: "/resume", label: "Resume" },
  { href: "/#contact", label: "Contact" },
  { href: "/privacy", label: "Privacy" }
];

type SiteFooterProps = {
  name?: string;
  title?: string;
  summary?: string;
};

export function SiteFooter({
  name = "Reuben Moddel",
  title = "Business Operations and Organizational Leader",
  summary = "I help organizations turn unclear objectives into organized execution by aligning people, priorities, and processes."
}: SiteFooterProps) {
  return (
    <footer className="siteFooter">
      <div className="footerLead">
        <p className="eyebrow">{name}</p>
        <h2>People, priorities, process, and execution.</h2>
        <p>{summary}</p>
      </div>
      <div className="footerMeta">
        <div>
          <p className="footerLabel">Navigate</p>
          <nav className="footerNav">
            {footerLinks.map((link) => (
              <a href={link.href} key={link.href}>
                {link.label}
              </a>
            ))}
          </nav>
        </div>
        <div>
          <p className="footerLabel">For Hiring Teams</p>
          <p className="footerText">
            The resume has the formal role history; the homepage shows the
            throughline in how I lead and execute.
          </p>
          <a className="button" href="/resume">
            View Resume
          </a>
        </div>
        <div>
          <p className="footerLabel">For Conversations</p>
          <p className="footerText">
            Reach out about a role, collaboration, or service inquiry where
            operations leadership and practical execution would help.
          </p>
          <a className="button" href="/#contact">
            Contact Me
          </a>
        </div>
      </div>
      <div className="footerBar">
        <p>{name}</p>
        <p>{title}</p>
        <p>Human understanding. Clear expectations. Practical accountability.</p>
      </div>
    </footer>
  );
}
