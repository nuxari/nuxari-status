"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { NuxariLogo } from "./NuxariLogo";

const APP_URL  = process.env.NEXT_PUBLIC_APP_URL  ?? "https://app.nuxari.com";
const WWW_URL  = process.env.NEXT_PUBLIC_WWW_URL  ?? "https://nuxari.com";
const DOCS_URL = process.env.NEXT_PUBLIC_DOCS_URL ?? "https://nuxari.com/docs";

const navLinks = [
  { label: "Home",    href: WWW_URL,     external: true },
  { label: "Docs",    href: DOCS_URL,    external: true },
];

export function SiteHeader() {
  const [scrolled,    setScrolled]    = useState(false);
  const [mobileOpen,  setMobileOpen]  = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className="sticky top-0 z-50 border-b transition-colors duration-300"
      style={{
        background:   "rgba(236,233,225,0.92)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderColor:  scrolled ? "#d3cfc3" : "transparent",
      }}
    >
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
        <div className="flex h-14 items-center justify-between gap-4">

          {/* Left: Logo + wordmark + divider + "Status" */}
          <Link
            href="/"
            className="flex items-center gap-2.5 shrink-0 transition-opacity hover:opacity-80"
          >
            <NuxariLogo size="sm" variant="full" />
            <span style={{ color: "#d3cfc3" }}>/</span>
            <span className="text-sm font-medium" style={{ color: "#8a8a80" }}>
              Status
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden sm:flex items-center gap-1">
            {navLinks.map((l) => (
              <a
                key={l.label}
                href={l.href}
                target={l.external ? "_blank" : undefined}
                rel={l.external ? "noopener noreferrer" : undefined}
                className="px-3 py-2 text-[13.5px] font-medium transition-colors"
                style={{ color: "#5b5b54" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#161616"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "#5b5b54"; }}
              >
                {l.label}
              </a>
            ))}

            <a
              href={`${APP_URL}/auth/login`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 text-[13.5px] font-medium transition-colors"
              style={{ color: "#5b5b54" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#161616"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "#5b5b54"; }}
            >
              Sign in
            </a>

            <a
              href={APP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-1 px-4 py-1.5 text-[13.5px] font-semibold text-white transition-colors"
              style={{ background: "#161616" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#2b2b2b"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "#161616"; }}
            >
              Open app
            </a>
          </nav>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="sm:hidden p-2 transition-colors"
            style={{ color: "#5b5b54" }}
            aria-label="Toggle menu"
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? (
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <line x1="3" y1="3" x2="15" y2="15" />
                <line x1="15" y1="3" x2="3" y2="15" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <line x1="2" y1="5" x2="16" y2="5" />
                <line x1="2" y1="9" x2="16" y2="9" />
                <line x1="2" y1="13" x2="16" y2="13" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div
            className="sm:hidden border-t pb-4"
            style={{ borderColor: "#d3cfc3" }}
          >
            <nav className="flex flex-col gap-1 pt-3">
              {navLinks.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  target={l.external ? "_blank" : undefined}
                  rel={l.external ? "noopener noreferrer" : undefined}
                  className="px-3 py-2 text-sm"
                  style={{ color: "#5b5b54" }}
                  onClick={() => setMobileOpen(false)}
                >
                  {l.label}
                </a>
              ))}
              <a
                href={`${APP_URL}/auth/login`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 text-sm"
                style={{ color: "#5b5b54" }}
                onClick={() => setMobileOpen(false)}
              >
                Sign in
              </a>
              <a
                href={APP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 mx-1 px-4 py-2 text-sm font-semibold text-white text-center"
                style={{ background: "#161616" }}
                onClick={() => setMobileOpen(false)}
              >
                Open app
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
