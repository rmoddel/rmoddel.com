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
        <h2>Clear thinking, strong messaging, and usable execution.</h2>
        <p>
          I help turn rough ideas into websites, campaigns, business writing,
          workflow direction, and product plans that are easier to use, explain,
          and move forward.
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
          <p className="footerLabel">Best Starting Point</p>
          <p className="footerText">
            If the project is still messy, the best place to begin is the
            Idea-to-Execution Session.
          </p>
          <a className="button" href="#session">
            Book a Session
          </a>
        </div>
        <div>
          <p className="footerLabel">What I Help Build</p>
          <p className="footerText">
            Websites, ads, campaigns, writing, workflow ideas, and product
            planning with practical business judgment.
          </p>
          <a className="button" href="#contact">
            Start a Project
          </a>
        </div>
      </div>
      <div className="footerBar">
        <p>Reuben Moddel</p>
        <p>Creative AI Operator for Real-World Business</p>
        <p>Human judgment. AI speed. Practical results.</p>
      </div>
    </footer>
  );
}
