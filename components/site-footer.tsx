const footerLinks = [
  { href: "#top", label: "Home" },
  { href: "#services", label: "Services" },
  { href: "#work", label: "Work" },
  { href: "#about", label: "About" },
  { href: "#contact", label: "Contact" }
];

export function SiteFooter() {
  return (
    <footer className="siteFooter">
      <div className="footerLead">
        <p className="eyebrow">Bring Me the Mess</p>
        <h2>Clear ideas. Polished execution. Human judgment.</h2>
        <p>
          Websites, campaigns, business writing, workflows, and app planning for
          people who need practical help turning rough concepts into something real.
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
          <p className="footerLabel">Start Here</p>
          <p className="footerText">Book an Idea-to-Execution Session or send a project inquiry.</p>
          <a className="button" href="#contact">
            Start a Project
          </a>
        </div>
      </div>
      <div className="footerBar">
        <p>Reuben Moddel</p>
        <p>Creative AI Operator for Real-World Business</p>
      </div>
    </footer>
  );
}
