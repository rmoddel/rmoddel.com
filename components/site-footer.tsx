const footerLinks = [
  { href: "/", label: "Home" },
  { href: "/#work", label: "Work" },
  { href: "/#experience", label: "Experience" },
  { href: "/#about", label: "About" },
  { href: "/resume", label: "Resume" },
  { href: "/#contact", label: "Contact" },
  { href: "/privacy", label: "Privacy" }
];

export function SiteFooter() {
  return (
    <footer className="siteFooter">
      <div className="footerLead">
        <p className="eyebrow">Reuben Moddel</p>
        <h2>Clear thinking, human context, and practical execution.</h2>
        <p>
          Personal portfolio for product operations, technical leadership,
          workflow design, clear communication, and AI-enabled work grounded in
          human understanding.
        </p>
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
            throughline in how I think and work.
          </p>
          <a className="button" href="/resume">
            View Resume
          </a>
        </div>
        <div>
          <p className="footerLabel">For Conversations</p>
          <p className="footerText">
            Reach out about a role, collaboration, or service inquiry where
            clear thinking and practical execution would help.
          </p>
          <a className="button" href="/#contact">
            Contact Me
          </a>
        </div>
      </div>
      <div className="footerBar">
        <p>Reuben Moddel</p>
        <p>Product Operations and Technical Leadership</p>
        <p>Human understanding. Clear thinking. Practical results.</p>
      </div>
    </footer>
  );
}
