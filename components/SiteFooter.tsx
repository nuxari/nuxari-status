const WWW_URL     = process.env.NEXT_PUBLIC_WWW_URL     ?? "https://nuxari.com";
const DOCS_URL    = process.env.NEXT_PUBLIC_DOCS_URL    ?? "https://nuxari.com/docs";
const SUPPORT_URL = process.env.NEXT_PUBLIC_SUPPORT_URL ?? "https://app.nuxari.com/admin/support/tickets/new";
const APP_URL     = process.env.NEXT_PUBLIC_APP_URL     ?? "https://app.nuxari.com";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="mt-16 border-t"
      style={{ background: "#161616", borderColor: "#2b2b2b" }}
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">

          {/* Left: logo + copyright */}
          <div className="flex items-center gap-2.5">
            <div
              className="flex size-6 items-center justify-center rounded-md text-[10px] font-bold text-white shrink-0"
              style={{ background: "#2f4bff" }}
            >
              N
            </div>
            <span className="text-xs" style={{ color: "#6b6b66" }}>
              © {year} Nuxari. All rights reserved.
            </span>
          </div>

          {/* Center: nav links */}
          <nav className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {[
              { label: "Home",     href: WWW_URL,               ext: true },
              { label: "Docs",     href: DOCS_URL,              ext: true },
              { label: "Support",  href: SUPPORT_URL,           ext: true },
              { label: "Privacy",  href: `${APP_URL}/settings`, ext: true },
              { label: "Terms",    href: `${WWW_URL}/terms`,    ext: true },
              { label: "Security", href: `${WWW_URL}/security`, ext: true },
            ].map((l) => (
              <a
                key={l.label}
                href={l.href}
                target={l.ext ? "_blank" : undefined}
                rel={l.ext ? "noopener noreferrer" : undefined}
                className="text-xs transition-colors"
                style={{ color: "#6b6b66" }}
              >
                {l.label}
              </a>
            ))}
          </nav>

          {/* Right: view all incidents + RSS (coming soon) */}
          <div className="flex items-center gap-3">
            <a
              href="/incidents"
              className="text-xs transition-colors"
              style={{ color: "#9a9a94" }}
            >
              View all incidents →
            </a>
            <span
              className="inline-flex items-center rounded px-2 py-0.5 text-[10px] font-medium border"
              style={{ color: "#6b6b66", borderColor: "#2b2b2b", background: "#1d1d1d" }}
              title="RSS feed coming soon"
            >
              RSS
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
