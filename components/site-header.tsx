"use client";

import { useEffect, useState } from "react";

const navItems = [
  { href: "#services", label: "Services" },
  { href: "#work", label: "Work" },
  { href: "#about", label: "About" },
  { href: "#contact", label: "Contact" }
];

export function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false);

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
      <a className="brand" href="#top" onClick={closeMenu}>
        <span className="brandMark">RM</span>
        <span className="brandText">
          <strong>Reuben Moddel</strong>
          <span>Creative AI Operator for Real-World Business</span>
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
          {navItems.map((item) => (
            <a href={item.href} key={item.href} onClick={closeMenu}>
              {item.label}
            </a>
          ))}
        </nav>
        <a className="button smallButton navCta" href="#session" onClick={closeMenu}>
          Book a Session
        </a>
      </div>
    </header>
  );
}
