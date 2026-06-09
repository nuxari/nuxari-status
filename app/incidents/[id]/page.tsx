import type { Metadata } from "next";
import { notFound }        from "next/navigation";
import Link               from "next/link";
import { getIncidentById } from "@/lib/api";
import { SEVERITY_CONFIG, INCIDENT_STATUS_CONFIG, STATUS_LABELS } from "@/lib/tokens";
import { IncidentTimeline } from "@/components/IncidentTimeline";
import { StatusDot }        from "@/components/StatusDot";
import { SiteHeader }       from "@/components/SiteHeader";
import { SiteFooter }       from "@/components/SiteFooter";
import { formatDateTime, duration } from "@/lib/utils";
import type { ComponentStatus } from "@/lib/types";

export const revalidate = 30;

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const incident = await getIncidentById(id);
  if (!incident) return { title: "Incident Not Found" };
  return { title: incident.title };
}

export default async function IncidentPage({ params }: PageProps) {
  const { id } = await params;
  const incident = await getIncidentById(id);
  if (!incident) notFound();

  const sev        = SEVERITY_CONFIG[incident.severity]  ?? SEVERITY_CONFIG.minor;
  const st         = INCIDENT_STATUS_CONFIG[incident.status] ?? INCIDENT_STATUS_CONFIG.investigating;
  const isResolved = incident.status === "resolved";

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#0f0f0f" }}>
      <SiteHeader />

      <main className="flex-1 mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Back */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm mb-8 transition-colors"
          style={{ color: "#9a9a94" }}
        >
          ← Back to status
        </Link>

        {/* Incident header card */}
        <div
          className="rounded-xl border overflow-hidden mb-8"
          style={{ background: "#161616", borderColor: "#2b2b2b" }}
        >
          <div
            className="px-6 py-5 border-b"
            style={{ background: "#1d1d1d", borderColor: "#2b2b2b" }}
          >
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold border ${sev.darkBg} ${sev.darkText} ${sev.darkBorder}`}
              >
                {sev.label}
              </span>
              <span
                className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium border"
                style={{ background: "rgba(255,255,255,0.04)", borderColor: "#2b2b2b" }}
              >
                <span className={`size-1.5 rounded-full ${st.dot}`} />
                <span className={st.darkText}>{st.label}</span>
              </span>
            </div>

            <h1 className="text-xl font-semibold" style={{ color: "#f3f2ee" }}>
              {incident.title}
            </h1>
            {incident.summary && (
              <p className="mt-1.5 text-sm" style={{ color: "#9a9a94" }}>
                {incident.summary}
              </p>
            )}
          </div>

          {/* Metadata grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y" style={{ "--tw-divide-color": "#2b2b2b" } as React.CSSProperties}>
            <MetaCell label="Started"  value={formatDateTime(incident.startedAt)} />
            <MetaCell label="Duration" value={duration(incident.startedAt, incident.resolvedAt)} />
            <MetaCell label="Status"   value={st.label} />
            {isResolved && incident.resolvedAt
              ? <MetaCell label="Resolved" value={formatDateTime(incident.resolvedAt)} />
              : <MetaCell label="Resolved" value="—" />
            }
          </div>
        </div>

        <div className="space-y-8">
          {/* Affected services */}
          {incident.affectedComponents.length > 0 && (
            <section>
              <h2
                className="text-xs font-semibold uppercase tracking-widest mb-3"
                style={{ color: "#9a9a94" }}
              >
                Affected Services
              </h2>
              <div className="flex flex-wrap gap-2">
                {incident.affectedComponents.map((key) => (
                  <span
                    key={key}
                    className="inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm"
                    style={{ borderColor: "#2b2b2b", background: "#1d1d1d", color: "#9a9a94" }}
                  >
                    <StatusDot status={"degraded" as ComponentStatus} size="xs" />
                    {key.replace(/_/g, " ")}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Customer impact */}
          {incident.customerImpact && (
            <section>
              <h2
                className="text-xs font-semibold uppercase tracking-widest mb-3"
                style={{ color: "#9a9a94" }}
              >
                Customer Impact
              </h2>
              <div
                className="rounded-lg border px-4 py-3"
                style={{ background: "rgba(245,158,11,0.08)", borderColor: "rgba(245,158,11,0.25)" }}
              >
                <p className="text-sm" style={{ color: "#f59e0b" }}>
                  {incident.customerImpact}
                </p>
              </div>
            </section>
          )}

          {/* Timeline */}
          <section>
            <h2
              className="text-xs font-semibold uppercase tracking-widest mb-5"
              style={{ color: "#9a9a94" }}
            >
              Incident Timeline
            </h2>
            <IncidentTimeline updates={incident.updates} />
          </section>

          {/* Root cause — visible once resolved */}
          {(incident as { rootCause?: string | null }).rootCause && (
            <section>
              <h2
                className="text-xs font-semibold uppercase tracking-widest mb-3"
                style={{ color: "#9a9a94" }}
              >
                Root Cause
              </h2>
              <div
                className="rounded-lg border px-4 py-3"
                style={{ background: "#161616", borderColor: "#2b2b2b" }}
              >
                <p className="text-sm" style={{ color: "#9a9a94" }}>
                  {(incident as { rootCause?: string | null }).rootCause}
                </p>
              </div>
            </section>
          )}

          {(incident as { remediation?: string | null }).remediation && (
            <section>
              <h2
                className="text-xs font-semibold uppercase tracking-widest mb-3"
                style={{ color: "#9a9a94" }}
              >
                Remediation
              </h2>
              <div
                className="rounded-lg border px-4 py-3"
                style={{ background: "#161616", borderColor: "#2b2b2b" }}
              >
                <p className="text-sm" style={{ color: "#9a9a94" }}>
                  {(incident as { remediation?: string | null }).remediation}
                </p>
              </div>
            </section>
          )}
        </div>

        {/* Back link */}
        <div
          className="mt-12 pt-8 border-t"
          style={{ borderColor: "#2b2b2b" }}
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium transition-colors"
            style={{ color: "#2f4bff" }}
          >
            ← Back to all systems status
          </Link>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

function MetaCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-4 py-3" style={{ borderColor: "#2b2b2b" }}>
      <p
        className="text-[10px] font-semibold uppercase tracking-wider"
        style={{ color: "#6b6b66" }}
      >
        {label}
      </p>
      <p className="mt-0.5 text-xs font-medium truncate" style={{ color: "#f3f2ee" }}>
        {value}
      </p>
    </div>
  );
}

// Keep STATUS_LABELS in scope (used by the parent page for component status display)
void STATUS_LABELS;
