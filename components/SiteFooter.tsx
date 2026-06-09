"use client";

import { NuxariLogo } from "./NuxariLogo";

const WWW_URL  = process.env.NEXT_PUBLIC_WWW_URL  ?? "https://nuxari.com";
const DOCS_URL = process.env.NEXT_PUBLIC_DOCS_URL ?? "https://nuxari.com/docs";
const APP_URL  = process.env.NEXT_PUBLIC_APP_URL  ?? "https://app.nuxari.com";

const columns = [
  {
    heading: "Company",
    links: [
      { label: "Home",      href: WWW_URL },
      { label: "Docs",      href: DOCS_URL },
      { label: "Support",   href: `${WWW_URL}/support` },
      { label: "Partners",  href: `${WWW_URL}/partners` },
      { label: "Contact",   href: `${WWW_URL}/contact` },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy",   href: `${WWW_URL}/privacy` },
      { label: "Terms",     href: `${WWW_URL}/terms` },
      { label: "Security",  href: `${WWW_URL}/security` },
      { label: "DPA",       href: `${WWW_URL}/legal/dpa` },
    ],
  },
  {
    heading: "Platform",
    links: [
      { label: "Access Governance",     href: `${WWW_URL}/platform/access-governance` },
      { label: "Remediation Control",   href: `${WWW_URL}/platform/remediation-control` },
      { label: "Evidence & Compliance", href: `${WWW_URL}/platform/evidence-compliance` },
      { label: "Integrations",          href: `${WWW_URL}/integrations` },
    ],
  },
] as const;

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer style={{ background: "#161616", color: "#f3f2ee" }}>
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 py-14">

        {/* Main grid */}
        <div
          className="grid grid-cols-2 gap-x-6 gap-y-10 border-b pb-12 sm:grid-cols-2 lg:grid-cols-5"
          style={{ borderColor: "#2b2b2b" }}
        >
          {/* Brand cell */}
          <div className="col-span-2">
            <NuxariLogo size="md" variant="full" dark />
            <p
              className="mt-4 max-w-[260px] text-sm leading-relaxed"
              style={{ color: "#9a9a94" }}
            >
              The governance control plane for access drift, controlled remediation,
              and audit-ready evidence across cloud, SaaS, identity, and edge environments.
            </p>
            <a
              href={APP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex px-4 py-2 text-[13.5px] font-semibold text-white transition-colors"
              style={{ background: "#2f4bff" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#1f37e0"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "#2f4bff"; }}
            >
              Open app
            </a>
          </div>

          {/* Link columns */}
          {columns.map((col) => (
            <div key={col.heading}>
              <h3
                className="mb-4 text-[11px] font-semibold uppercase tracking-[0.12em]"
                style={{ color: "#9a9a94" }}
              >
                {col.heading}
              </h3>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm transition-colors"
                      style={{ color: "rgba(243,242,238,0.7)" }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#f3f2ee"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(243,242,238,0.7)"; }}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="pt-8">
          <span className="text-sm" style={{ color: "#9a9a94" }}>
            © {year} Nuxari, Inc. All rights reserved.
          </span>
        </div>
      </div>
    </footer>
  );
}
