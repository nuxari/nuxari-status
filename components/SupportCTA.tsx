"use client";

const SUPPORT_URL = process.env.NEXT_PUBLIC_SUPPORT_URL ?? "https://app.nuxari.com/admin/support/tickets/new";
const APP_URL     = process.env.NEXT_PUBLIC_APP_URL     ?? "https://app.nuxari.com";

export function SupportCTA() {
  return (
    <section
      className="border px-6 py-7"
      style={{ background: "#f5f3ee", borderColor: "#d3cfc3" }}
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
        <div className="max-w-lg">
          <h2 className="text-base font-semibold" style={{ color: "#161616" }}>
            Experiencing an issue not listed here?
          </h2>
          <p className="mt-1.5 text-sm" style={{ color: "#5b5b54" }}>
            If your organization is affected and it&apos;s not reflected above, submit a support
            request and our team will investigate.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <a
            href={APP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 text-sm font-medium border transition-colors"
            style={{ color: "#5b5b54", borderColor: "#d3cfc3", background: "transparent" }}
          >
            Open app
          </a>
          <a
            href={SUPPORT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 text-sm font-semibold text-white transition-colors"
            style={{ background: "#2f4bff" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#1f37e0"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "#2f4bff"; }}
          >
            Submit support request
          </a>
        </div>
      </div>
    </section>
  );
}
