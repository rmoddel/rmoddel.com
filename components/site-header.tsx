"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/resume", label: "Resume" },
  { href: "/chat", label: "Interactive Resume" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" }
];

type SiteHeaderProps = {
  brandLine?: string;
};

export function SiteHeader({
  brandLine = "AI Solutions, Operations, and People Leadership"
}: SiteHeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth > 820) {
        setIsOpen(false);
      }
    }

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  function closeMenu() {
    setIsOpen(false);
  }

  return (
    <header className="siteHeader">
      <a className="brand" href="/" onClick={closeMenu}>
        <span className="brandMark">RM</span>
        <span className="brandText">
          <strong>Reuben Moddel</strong>
          <span>{brandLine}</span>
        </span>
      </a>

      <button
        aria-controls="site-nav"
        aria-expanded={isOpen}
        aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
        className="menuButton"
        onClick={() => setIsOpen((value) => !value)}
        type="button"
      >
        <span />
        <span />
        <span />
      </button>

      <div className={`navShell ${isOpen ? "open" : ""}`}>
        <nav className="siteNav" id="site-nav">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname?.startsWith(`${item.href}/`));

            return (
              <a
                aria-current={isActive ? "page" : undefined}
                href={item.href}
                key={item.href}
                onClick={closeMenu}
              >
                {item.label}
              </a>
            );
          })}
        </nav>
        <div className="headerActions">
          <a className="button smallButton" href="/chat" onClick={closeMenu}>
            Ask About Me
          </a>
          <a
            className="button buttonSecondary smallButton"
            href="/contact"
            onClick={closeMenu}
          >
            Contact Me
          </a>
        </div>
      </div>
    </header>
  );
}
