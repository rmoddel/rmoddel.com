const footerLinks = [
  { href: "/", label: "Home" },
  { href: "/resume", label: "Résumé" },
  { href: "/chat", label: "Interactive Résumé" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/privacy", label: "Privacy" }
];

type SiteFooterProps = {
  name?: string;
  title?: string;
  summary?: string;
};

export function SiteFooter({
  name = "Reuben Moddel",
  title = "AI Solutions, Operations, and People Leadership",
  summary = "I combine operations, people leadership, systems experience, and AI-enabled software delivery to improve cumbersome real-world processes."
}: SiteFooterProps) {
  return (
    <footer className="siteFooter">
      <div className="footerLead">
        <p className="eyebrow">{name}</p>
        <h2>You know the process. I’ll help build the better path.</h2>
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
          <p className="footerLabel">Explore</p>
          <p className="footerText">
            Ask about my experience, leadership, skills, AI-enabled software,
            GPS, selected projects, or fit for an opportunity.
          </p>
          <a className="button buttonSecondary smallButton" href="/chat">
            Ask About Me
          </a>
        </div>
        <div>
          <p className="footerLabel">Connect</p>
          <p className="footerText">
            Reach out about a role, collaboration, personalized software
            solution, or process that should work better.
          </p>
          <a className="button smallButton" href="/contact">
            Contact Me
          </a>
        </div>
      </div>
      <div className="footerBar">
        <p>{name}</p>
        <p>{title}</p>
        <p>Genuine problems. Personalized software. Practical results.</p>
      </div>
    </footer>
  );
}
