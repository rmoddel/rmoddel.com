"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "#services", label: "Services" },
  { href: "#work", label: "Work" },
  { href: "#about", label: "About" },
  { href: "/resume", label: "Resume" },
  { href: "#contact", label: "Contact" }
];

export function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === "/";

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

  function resolveHref(href: string) {
    if (href.startsWith("#")) {
      return isHomePage ? href : `/${href}`;
    }

    return href;
  }

  return (
    <header className="siteHeader">
      <a className="brand" href={isHomePage ? "#top" : "/"} onClick={closeMenu}>
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
            <a href={resolveHref(item.href)} key={item.href} onClick={closeMenu}>
              {item.label}
            </a>
          ))}
        </nav>
        <a
          className="button smallButton navCta"
          href={isHomePage ? "#session" : "/#session"}
          onClick={closeMenu}
        >
          Book a Session
        </a>
      </div>
    </header>
  );
}
