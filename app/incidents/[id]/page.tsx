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
    <div className="min-h-screen flex flex-col" style={{ background: "#ece9e1" }}>
      <SiteHeader />

      <main className="flex-1 mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Back */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm mb-8 transition-colors"
          style={{ color: "#5b5b54" }}
        >
          ← Back to status
        </Link>

        {/* Incident header card */}
        <div
          className="border overflow-hidden mb-8"
          style={{ background: "#f5f3ee", borderColor: "#d3cfc3" }}
        >
          <div
            className="px-6 py-5 border-b"
            style={{ background: "#ece9e1", borderColor: "#d3cfc3" }}
          >
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 text-xs font-semibold border ${sev.bg} ${sev.text} ${sev.border}`}
              >
                {sev.label}
              </span>
              <span
                className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-medium border"
                style={{ background: "#f5f3ee", borderColor: "#d3cfc3" }}
              >
                <span className={`size-1.5 ${st.dot}`} />
                <span className={st.text}>{st.label}</span>
              </span>
            </div>

            <h1 className="text-xl font-semibold" style={{ color: "#161616" }}>
              {incident.title}
            </h1>
            {incident.summary && (
              <p className="mt-1.5 text-sm" style={{ color: "#5b5b54" }}>
                {incident.summary}
              </p>
            )}
          </div>

          {/* Metadata grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y" style={{ "--tw-divide-color": "#d3cfc3" } as React.CSSProperties}>
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
                style={{ color: "#8a8a80" }}
              >
                Affected Services
              </h2>
              <div className="flex flex-wrap gap-2">
                {incident.affectedComponents.map((key) => (
                  <span
                    key={key}
                    className="inline-flex items-center gap-2 border px-3 py-1.5 text-sm"
                    style={{ borderColor: "#d3cfc3", background: "#f5f3ee", color: "#5b5b54" }}
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
                style={{ color: "#8a8a80" }}
              >
                Customer Impact
              </h2>
              <div
                className="border px-4 py-3"
                style={{ background: "rgba(217,119,6,0.06)", borderColor: "rgba(217,119,6,0.25)" }}
              >
                <p className="text-sm" style={{ color: "#92400e" }}>
                  {incident.customerImpact}
                </p>
              </div>
            </section>
          )}

          {/* Timeline */}
          <section>
            <h2
              className="text-xs font-semibold uppercase tracking-widest mb-5"
              style={{ color: "#8a8a80" }}
            >
              Incident Timeline
            </h2>
            <IncidentTimeline updates={incident.updates} />
          </section>

          {/* Root cause */}
          {(incident as { rootCause?: string | null }).rootCause && (
            <section>
              <h2
                className="text-xs font-semibold uppercase tracking-widest mb-3"
                style={{ color: "#8a8a80" }}
              >
                Root Cause
              </h2>
              <div
                className="border px-4 py-3"
                style={{ background: "#f5f3ee", borderColor: "#d3cfc3" }}
              >
                <p className="text-sm" style={{ color: "#5b5b54" }}>
                  {(incident as { rootCause?: string | null }).rootCause}
                </p>
              </div>
            </section>
          )}

          {(incident as { remediation?: string | null }).remediation && (
            <section>
              <h2
                className="text-xs font-semibold uppercase tracking-widest mb-3"
                style={{ color: "#8a8a80" }}
              >
                Remediation
              </h2>
              <div
                className="border px-4 py-3"
                style={{ background: "#f5f3ee", borderColor: "#d3cfc3" }}
              >
                <p className="text-sm" style={{ color: "#5b5b54" }}>
                  {(incident as { remediation?: string | null }).remediation}
                </p>
              </div>
            </section>
          )}
        </div>

        {/* Back link */}
        <div
          className="mt-12 pt-8 border-t"
          style={{ borderColor: "#d3cfc3" }}
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
    <div className="px-4 py-3" style={{ borderColor: "#d3cfc3" }}>
      <p
        className="text-[10px] font-semibold uppercase tracking-wider"
        style={{ color: "#8a8a80" }}
      >
        {label}
      </p>
      <p className="mt-0.5 text-xs font-medium truncate" style={{ color: "#161616" }}>
        {value}
      </p>
    </div>
  );
}

// Keep STATUS_LABELS in scope (used by the parent page for component status display)
void STATUS_LABELS;
