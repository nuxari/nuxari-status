"use client";

import { NuxariLogo } from "./NuxariLogo";

const WWW_URL     = process.env.NEXT_PUBLIC_WWW_URL     ?? "https://nuxari.com";
const DOCS_URL    = process.env.NEXT_PUBLIC_DOCS_URL    ?? "https://nuxari.com/docs";
const SUPPORT_URL = process.env.NEXT_PUBLIC_SUPPORT_URL ?? "https://app.nuxari.com/admin/support/tickets/new";
const APP_URL     = process.env.NEXT_PUBLIC_APP_URL     ?? "https://app.nuxari.com";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="mt-16 border-t"
      style={{ background: "#f5f3ee", borderColor: "#d3cfc3" }}
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">

          {/* Left: logo + copyright */}
          <div className="flex items-center gap-2.5">
            <NuxariLogo size="sm" variant="mark" />
            <span className="text-xs" style={{ color: "#8a8a80" }}>
              © {year} Nuxari. All rights reserved.
            </span>
          </div>

          {/* Nav links */}
          <nav className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {[
              { label: "Home",     href: WWW_URL },
              { label: "Docs",     href: DOCS_URL },
              { label: "Support",  href: SUPPORT_URL },
              { label: "Privacy",  href: `${WWW_URL}/privacy` },
              { label: "Terms",    href: `${WWW_URL}/terms` },
              { label: "Security", href: `${WWW_URL}/security` },
            ].map((l) => (
              <a
                key={l.label}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs transition-colors"
                style={{ color: "#8a8a80" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#161616"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "#8a8a80"; }}
              >
                {l.label}
              </a>
            ))}
          </nav>

          {/* App link */}
          <a
            href={APP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs transition-colors"
            style={{ color: "#5b5b54" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#161616"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "#5b5b54"; }}
          >
            Open app
          </a>
        </div>
      </div>
    </footer>
  );
}
