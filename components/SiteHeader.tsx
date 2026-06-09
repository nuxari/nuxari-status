"use client";

import Link from "next/link";
import { useState } from "react";

const APP_URL     = process.env.NEXT_PUBLIC_APP_URL     ?? "https://app.nuxari.com";
const WWW_URL     = process.env.NEXT_PUBLIC_WWW_URL     ?? "https://nuxari.com";
const DOCS_URL    = process.env.NEXT_PUBLIC_DOCS_URL    ?? "https://nuxari.com/docs";
const SUPPORT_URL = process.env.NEXT_PUBLIC_SUPPORT_URL ?? "https://app.nuxari.com/admin/support/tickets/new";

const navLinks = [
  { label: "Home",    href: WWW_URL,     external: true  },
  { label: "Docs",    href: DOCS_URL,    external: true  },
  { label: "Support", href: SUPPORT_URL, external: true  },
];

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header
      className="sticky top-0 z-50 border-b"
      style={{ background: "#161616", borderColor: "#2b2b2b" }}
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between gap-4">

          {/* ── Left: Logo + wordmark ── */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            {/* Blue square N logo */}
            <div
              className="flex size-7 items-center justify-center rounded-md font-bold text-white text-xs transition-opacity group-hover:opacity-80"
              style={{ background: "#2f4bff" }}
            >
              N
            </div>
            <span
              className="text-sm font-semibold transition-colors group-hover:opacity-80"
              style={{ color: "#f3f2ee" }}
            >
              Nuxari
            </span>
            <span style={{ color: "#2b2b2b" }}>/</span>
            <span className="text-sm font-medium" style={{ color: "#9a9a94" }}>
              Status
            </span>
          </Link>

          {/* ── Desktop nav ── */}
          <nav className="hidden sm:flex items-center gap-1">
            {navLinks.map((l) => (
              <a
                key={l.label}
                href={l.href}
                target={l.external ? "_blank" : undefined}
                rel={l.external ? "noopener noreferrer" : undefined}
                className="px-3 py-1.5 rounded-md text-sm transition-colors"
                style={{ color: "#9a9a94" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#f3f2ee"; (e.currentTarget as HTMLElement).style.background = "#1d1d1d"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "#9a9a94"; (e.currentTarget as HTMLElement).style.background = "transparent"; }}
              >
                {l.label}
              </a>
            ))}

            <a
              href={APP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 px-4 py-1.5 rounded-md text-sm font-semibold text-white transition-colors"
              style={{ background: "#2f4bff" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#1f37e0"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "#2f4bff"; }}
            >
              Open app
            </a>
          </nav>

          {/* ── Mobile hamburger ── */}
          <button
            type="button"
            className="sm:hidden p-2 rounded-md transition-colors"
            style={{ color: "#9a9a94" }}
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

        {/* ── Mobile menu ── */}
        {mobileOpen && (
          <div className="sm:hidden border-t pb-4" style={{ borderColor: "#2b2b2b" }}>
            <nav className="flex flex-col gap-1 pt-3">
              {navLinks.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  target={l.external ? "_blank" : undefined}
                  rel={l.external ? "noopener noreferrer" : undefined}
                  className="px-3 py-2 rounded-md text-sm"
                  style={{ color: "#9a9a94" }}
                  onClick={() => setMobileOpen(false)}
                >
                  {l.label}
                </a>
              ))}
              <a
                href={APP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 mx-1 px-4 py-2 rounded-md text-sm font-semibold text-white text-center"
                style={{ background: "#2f4bff" }}
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
